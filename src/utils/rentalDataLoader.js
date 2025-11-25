// Utility to load and parse rental market data
let rentalDataCache = null;
let zipStatsCache = null;

// State abbreviation to full name mapping
const STATE_NAMES = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};

// Parse CSV properly handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Load city rental data from state CSVs
export async function loadCityRentalData(city, state) {
  if (!city || !state) {
    console.log('Missing city or state:', { city, state });
    return null;
  }
  
  try {
    // Convert state abbreviation to full name if needed
    const stateName = STATE_NAMES[state.toUpperCase()] || state;
    const stateFile = `${stateName}_Rental_Data - ${stateName}_Rental_Data.csv`;
    console.log('Fetching rental data:', `/data/states/${stateFile}`);
    
    const response = await fetch(`/data/states/${stateFile}`);
    if (!response.ok) {
      console.log('Failed to fetch rental data:', response.status);
      return null;
    }
    
    const text = await response.text();
    const lines = text.split('\n').filter(l => l.trim());
    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
    
    console.log('CSV Headers:', headers);
    
    const cityIndex = headers.findIndex(h => h.includes('city'));
    const rentIndex = headers.findIndex(h => h === 'rent');
    const bedsIndex = headers.findIndex(h => h === 'bed' || h === 'beds');
    const areaIndex = headers.findIndex(h => h === 'sqft' || h === 'area');
    
    console.log('Column indices:', { cityIndex, rentIndex, bedsIndex, areaIndex });
    
    const cityNormalized = city.toLowerCase().trim();
    const rentals = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cols = parseCSVLine(lines[i]);
      const rowCity = cols[cityIndex]?.toLowerCase().trim();
      
      if (rowCity === cityNormalized) {
        const rent = parseFloat(cols[rentIndex]);
        const beds = parseFloat(cols[bedsIndex]);
        const area = parseFloat(cols[areaIndex]);
        if (rent && !isNaN(rent) && rent > 0) {
          rentals.push({ rent, beds, area });
        }
      }
    }
    
    console.log(`Found ${rentals.length} rentals for ${city}`);
    
    if (rentals.length === 0) return null;
    
    // Calculate by bedroom count first
    const byBeds = {};
    rentals.forEach(r => {
      if (r.beds && !isNaN(r.beds)) {
        const bedKey = Math.floor(r.beds);
        if (!byBeds[bedKey]) byBeds[bedKey] = [];
        byBeds[bedKey].push(r.rent);
      }
    });
    
    // Filter outliers and calculate averages per bedroom type
    const avgByBeds = {};
    Object.keys(byBeds).forEach(beds => {
      let arr = byBeds[beds].sort((a, b) => a - b);
      
      // Remove outliers (bottom 10% and top 10%) for more accurate averages
      if (arr.length > 10) {
        const removeCount = Math.floor(arr.length * 0.1);
        arr = arr.slice(removeCount, arr.length - removeCount);
      }
      
      avgByBeds[beds] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    });
    
    // Use 2-bed average for overall market average, fall back to all rentals if not available
    let avgRent, medianRent;
    
    if (byBeds[2] && byBeds[2].length > 0) {
      // Use 2-bedroom units as the market standard
      const twoBedRents = byBeds[2].sort((a, b) => a - b);
      
      // Remove outliers for 2-bed
      let filtered = twoBedRents;
      if (twoBedRents.length > 10) {
        const removeCount = Math.floor(twoBedRents.length * 0.1);
        filtered = twoBedRents.slice(removeCount, twoBedRents.length - removeCount);
      }
      
      avgRent = filtered.reduce((a, b) => a + b, 0) / filtered.length;
      medianRent = filtered[Math.floor(filtered.length / 2)];
    } else {
      // Fallback to all rentals
      const rents = rentals.map(r => r.rent).sort((a, b) => a - b);
      avgRent = rents.reduce((a, b) => a + b, 0) / rents.length;
      medianRent = rents[Math.floor(rents.length / 2)];
    }
    
    const allRents = rentals.map(r => r.rent).sort((a, b) => a - b);
    
    console.log('Rent statistics for', city, ':', {
      count: rentals.length,
      min: Math.round(allRents[0]),
      max: Math.round(allRents[allRents.length - 1]),
      avg: Math.round(avgRent),
      median: Math.round(medianRent),
      twoBedCount: byBeds[2]?.length || 0
    });
    
    return {
      totalListings: rentals.length,
      avgRent: Math.round(avgRent),
      medianRent: Math.round(medianRent),
      minRent: Math.round(allRents[0]),
      maxRent: Math.round(allRents[allRents.length - 1]),
      avgByBeds
    };
  } catch (err) {
    console.error('Error loading rental data for', city, state, ':', err);
    return null;
  }
}

// Load ZIP code statistics
export async function loadZipStats(zipcode) {
  if (!zipcode) {
    console.log('No zipcode provided');
    return null;
  }
  
  try {
    if (!zipStatsCache) {
      console.log('Loading ZIP stats cache...');
      const response = await fetch('/data/zip_renter_owner_stats_with_counts.csv');
      if (!response.ok) {
        console.log('Failed to fetch ZIP stats:', response.status);
        return null;
      }
      
      const text = await response.text();
      const lines = text.split('\n').filter(l => l.trim());
      
      zipStatsCache = {};
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(',');
        const zip = cols[0]?.trim();
        if (zip) {
          zipStatsCache[zip] = {
            totalUnits: parseInt(cols[2]) || 0,
            ownerUnits: parseInt(cols[3]) || 0,
            renterUnits: parseInt(cols[4]) || 0,
            pctOwner: parseFloat(cols[5]) || 0,
            pctRenter: parseFloat(cols[6]) || 0
          };
        }
      }
      console.log(`Loaded ${Object.keys(zipStatsCache).length} ZIP codes`);
    }
    
    const stats = zipStatsCache[zipcode.toString()];
    if (stats) {
      console.log('Found ZIP stats for', zipcode, ':', stats);
    } else {
      console.log('No ZIP stats found for', zipcode);
    }
    return stats || null;
  } catch (err) {
    console.error('Error loading ZIP stats:', err);
    return null;
  }
}
