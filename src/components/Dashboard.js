import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidHlsZXJ3YXluZTEiLCJhIjoiY21oNzlqb2xwMHBybjJscHR5ZXVqcHZ2aCJ9.jHao1snG3bwXFRVWcA8tuQ';

const containerStyle = {
  display: 'flex',
  minHeight: 'calc(100vh - 60px)',
  background: '#f5f7fa'
};

const sidebarStyle = {
  width: '250px',
  background: '#fff',
  borderRight: '1px solid #ddd',
  padding: '24px 0'
};

const tabButtonStyle = {
  width: '100%',
  padding: '16px 24px',
  fontSize: '16px',
  fontWeight: '600',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  color: '#666',
  transition: 'all 0.2s ease'
};

const activeTabButtonStyle = {
  width: '100%',
  padding: '16px 24px',
  fontSize: '16px',
  fontWeight: '600',
  background: '#f0f0f0',
  border: 'none',
  borderLeftWidth: '4px',
  borderLeftStyle: 'solid',
  borderLeftColor: '#000',
  textAlign: 'left',
  cursor: 'pointer',
  color: '#000',
  transition: 'all 0.2s ease'
};

const contentStyle = {
  flex: 1,
  padding: '40px'
};

const titleStyle = {
  fontSize: '32px',
  fontWeight: '800',
  margin: '0 0 32px',
  color: '#000'
};

const profileCardStyle = {
  background: '#fff',
  borderRadius: '12px',
  padding: '32px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  maxWidth: '600px'
};

const fieldStyle = {
  marginBottom: '24px'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#666',
  display: 'block',
  marginBottom: '8px'
};

const valueStyle = {
  fontSize: '18px',
  fontWeight: '500',
  color: '#000'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  marginBottom: '16px'
};

const buttonStyle = {
  padding: '14px 32px',
  fontSize: '16px',
  fontWeight: '700',
  background: '#000',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '24px'
};

const selectStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  background: '#fff'
};

const locationContainerStyle = {
  width: '100%',
  minHeight: '50px',
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  alignItems: 'center',
  position: 'relative',
  background: '#fff'
};

const tagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  background: '#f0f0f0',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '500'
};

const removeTagButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  padding: '0',
  lineHeight: '1',
  color: '#666'
};

const locationInputStyle = {
  flex: '1',
  minWidth: '200px',
  border: 'none',
  outline: 'none',
  fontSize: '16px',
  padding: '4px',
  fontFamily: 'inherit'
};

const suggestionsStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  background: '#fff',
  border: '1px solid #ddd',
  borderTop: 'none',
  borderRadius: '0 0 6px 6px',
  maxHeight: '200px',
  overflowY: 'auto',
  zIndex: 1000,
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const suggestionItemStyle = {
  padding: '12px',
  cursor: 'pointer',
  fontSize: '14px',
  borderBottom: '1px solid #f0f0f0'
};

function BuyBoxTab() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [buyBoxId, setBuyBoxId] = useState(null);
  
  const [locationTags, setLocationTags] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [pricePerUnitMin, setPricePerUnitMin] = useState('');
  const [pricePerUnitMax, setPricePerUnitMax] = useState('');
  const [capRateMin, setCapRateMin] = useState('');
  const [capRateMax, setCapRateMax] = useState('');
  const [unitsMin, setUnitsMin] = useState('');
  const [unitsMax, setUnitsMax] = useState('');
  const [noiMin, setNoiMin] = useState('');
  const [noiMax, setNoiMax] = useState('');
  
  const [sellerCarryRequired, setSellerCarryRequired] = useState('');
  const [maxDownPayment, setMaxDownPayment] = useState('');
  const [interestRateMin, setInterestRateMin] = useState('');
  const [interestRateMax, setInterestRateMax] = useState('');
  const [balloonTermMin, setBalloonTermMin] = useState('');
  const [balloonTermMax, setBalloonTermMax] = useState('');
  const [interestOnlyRequired, setInterestOnlyRequired] = useState('');
  const [requiresEquityPartner, setRequiresEquityPartner] = useState('');
  const [maxEquitySplit, setMaxEquitySplit] = useState('');
  const [vacantUnderperforming, setVacantUnderperforming] = useState(false);
  const [distressedAsset, setDistressedAsset] = useState(false);
  const [expiredRentalLicenses, setExpiredRentalLicenses] = useState(false);
  const [motivatedSeller, setMotivatedSeller] = useState(false);
  const [assumableLoan, setAssumableLoan] = useState(false);
  
  const [minMonthlyCashFlow, setMinMonthlyCashFlow] = useState('');
  const [minRentPerUnit, setMinRentPerUnit] = useState('');
  const [minRentUpside, setMinRentUpside] = useState('');
  const [minRenovationRoi, setMinRenovationRoi] = useState('');
  const [minDscr, setMinDscr] = useState('');
  
  const [bedsMin, setBedsMin] = useState('');
  const [bathsMin, setBathsMin] = useState('');
  const [sqftMin, setSqftMin] = useState('');
  const [sqftMax, setSqftMax] = useState('');
  const [yearBuiltMin, setYearBuiltMin] = useState('');
  const [yearBuiltMax, setYearBuiltMax] = useState('');
  const [lotSizeMin, setLotSizeMin] = useState('');
  const [lotSizeMax, setLotSizeMax] = useState('');
  const [parkingType, setParkingType] = useState('');
  const [laundryType, setLaundryType] = useState('');
  
  const [occupancyMin, setOccupancyMin] = useState('');
  const [occupancyMax, setOccupancyMax] = useState('');
  const [stabilizedOccupancyRequired, setStabilizedOccupancyRequired] = useState('');
  const [separateUtilities, setSeparateUtilities] = useState('');
  const [rubsAllowed, setRubsAllowed] = useState('');
  const [tenantPaidUtilities, setTenantPaidUtilities] = useState('');
  
  const [maxRehabPerUnit, setMaxRehabPerUnit] = useState('');
  const [maxTotalRehab, setMaxTotalRehab] = useState('');
  const [heavyValueAdd, setHeavyValueAdd] = useState('');
  const [turnkey, setTurnkey] = useState('');

  useEffect(() => {
    loadBuyBox();
  }, []);

  useEffect(() => {
    if (locationInput.length > 2) {
      fetchLocationSuggestions(locationInput);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  }, [locationInput]);

  const fetchLocationSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&types=place,region,postcode&country=US`
      );
      const data = await response.json();
      setLocationSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const addLocationTag = (location) => {
    if (!locationTags.includes(location)) {
      setLocationTags([...locationTags, location]);
    }
    setLocationInput('');
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };

  const removeLocationTag = (location) => {
    setLocationTags(locationTags.filter(l => l !== location));
  };

  const loadBuyBox = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('buy_boxes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setBuyBoxId(data.id);
      setLocationTags(data.locations || []);
      setPriceMin(data.price_min || '');
      setPriceMax(data.price_max || '');
      setPricePerUnitMin(data.price_per_unit_min || '');
      setPricePerUnitMax(data.price_per_unit_max || '');
      setCapRateMin(data.cap_rate_min || '');
      setCapRateMax(data.cap_rate_max || '');
      setUnitsMin(data.units_min || '');
      setUnitsMax(data.units_max || '');
      setNoiMin(data.noi_min || '');
      setNoiMax(data.noi_max || '');
      setSellerCarryRequired(data.seller_carry_required || '');
      setMaxDownPayment(data.max_down_payment || '');
      setInterestRateMin(data.interest_rate_min || '');
      setInterestRateMax(data.interest_rate_max || '');
      setBalloonTermMin(data.balloon_term_min || '');
      setBalloonTermMax(data.balloon_term_max || '');
      setInterestOnlyRequired(data.interest_only_required || '');
      setRequiresEquityPartner(data.requires_equity_partner || '');
      setMaxEquitySplit(data.max_equity_split || '');
      setVacantUnderperforming(data.vacant_underperforming || false);
      setDistressedAsset(data.distressed_asset || false);
      setExpiredRentalLicenses(data.expired_rental_licenses || false);
      setMotivatedSeller(data.motivated_seller || false);
      setAssumableLoan(data.assumable_loan || false);
      setMinMonthlyCashFlow(data.min_monthly_cash_flow || '');
      setMinRentPerUnit(data.min_rent_per_unit || '');
      setMinRentUpside(data.min_rent_upside || '');
      setMinRenovationRoi(data.min_renovation_roi || '');
      setMinDscr(data.min_dscr || '');
      setBedsMin(data.beds_min || '');
      setBathsMin(data.baths_min || '');
      setSqftMin(data.sqft_min || '');
      setSqftMax(data.sqft_max || '');
      setYearBuiltMin(data.year_built_min || '');
      setYearBuiltMax(data.year_built_max || '');
      setLotSizeMin(data.lot_size_min || '');
      setLotSizeMax(data.lot_size_max || '');
      setParkingType(data.parking_type || '');
      setLaundryType(data.laundry_type || '');
      setOccupancyMin(data.occupancy_min || '');
      setOccupancyMax(data.occupancy_max || '');
      setStabilizedOccupancyRequired(data.stabilized_occupancy_required || '');
      setSeparateUtilities(data.separate_utilities || '');
      setRubsAllowed(data.rubs_allowed || '');
      setTenantPaidUtilities(data.tenant_paid_utilities || '');
      setMaxRehabPerUnit(data.max_rehab_per_unit || '');
      setMaxTotalRehab(data.max_total_rehab || '');
      setHeavyValueAdd(data.heavy_value_add || '');
      setTurnkey(data.turnkey || '');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Not logged in');
      setLoading(false);
      return;
    }

    console.log('Saving buy box with locations:', locationTags);

    const buyBoxData = {
      user_id: user.id,
      locations: locationTags,
      price_min: priceMin || null,
      price_max: priceMax || null,
      price_per_unit_min: pricePerUnitMin || null,
      price_per_unit_max: pricePerUnitMax || null,
      cap_rate_min: capRateMin || null,
      cap_rate_max: capRateMax || null,
      units_min: unitsMin || null,
      units_max: unitsMax || null,
      noi_min: noiMin || null,
      noi_max: noiMax || null,
      seller_carry_required: sellerCarryRequired || null,
      max_down_payment: maxDownPayment || null,
      interest_rate_min: interestRateMin || null,
      interest_rate_max: interestRateMax || null,
      balloon_term_min: balloonTermMin || null,
      balloon_term_max: balloonTermMax || null,
      interest_only_required: interestOnlyRequired || null,
      requires_equity_partner: requiresEquityPartner || null,
      max_equity_split: maxEquitySplit || null,
      vacant_underperforming: vacantUnderperforming,
      distressed_asset: distressedAsset,
      expired_rental_licenses: expiredRentalLicenses,
      motivated_seller: motivatedSeller,
      assumable_loan: assumableLoan,
      min_monthly_cash_flow: minMonthlyCashFlow || null,
      min_rent_per_unit: minRentPerUnit || null,
      min_rent_upside: minRentUpside || null,
      min_renovation_roi: minRenovationRoi || null,
      min_dscr: minDscr || null,
      beds_min: bedsMin || null,
      baths_min: bathsMin || null,
      sqft_min: sqftMin || null,
      sqft_max: sqftMax || null,
      year_built_min: yearBuiltMin || null,
      year_built_max: yearBuiltMax || null,
      lot_size_min: lotSizeMin || null,
      lot_size_max: lotSizeMax || null,
      parking_type: parkingType || null,
      laundry_type: laundryType || null,
      occupancy_min: occupancyMin || null,
      occupancy_max: occupancyMax || null,
      stabilized_occupancy_required: stabilizedOccupancyRequired || null,
      separate_utilities: separateUtilities || null,
      rubs_allowed: rubsAllowed || null,
      tenant_paid_utilities: tenantPaidUtilities || null,
      max_rehab_per_unit: maxRehabPerUnit || null,
      max_total_rehab: maxTotalRehab || null,
      heavy_value_add: heavyValueAdd || null,
      turnkey: turnkey || null,
      updated_at: new Date().toISOString()
    };

    if (buyBoxId) {
      console.log('Updating existing buy box:', buyBoxId);
      const { error } = await supabase
        .from('buy_boxes')
        .update(buyBoxData)
        .eq('id', buyBoxId);

      if (error) {
        console.error('Buy box update error:', error);
        alert('Failed to update: ' + error.message);
      } else {
        console.log('Buy box updated successfully');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } else {
      console.log('Creating new buy box');
      const { data, error } = await supabase
        .from('buy_boxes')
        .insert(buyBoxData)
        .select()
        .single();

      if (error) {
        console.error('Buy box insert error:', error);
        alert('Failed to save: ' + error.message);
      } else {
        console.log('Buy box created successfully:', data);
        setBuyBoxId(data.id);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 style={titleStyle}>Buy Box</h1>
      <div style={profileCardStyle}>
        
        <h2 style={{fontSize:'20px',fontWeight:'700',margin:'0 0 16px',color:'#000'}}>1. Locations</h2>
        <div style={fieldStyle}>
          <label style={labelStyle}>City / County / ZIP</label>
          <div style={{position:'relative'}}>
            <div style={locationContainerStyle}>
              {locationTags.map((tag, index) => (
                <div key={index} style={tagStyle}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeLocationTag(tag)}
                    style={removeTagButtonStyle}
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Type to search locations..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                style={locationInputStyle}
              />
            </div>
            {showSuggestions && locationSuggestions.length > 0 && (
              <div style={suggestionsStyle}>
                {locationSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    style={suggestionItemStyle}
                    onClick={() => addLocationTag(suggestion.place_name)}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                  >
                    {suggestion.place_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <h2 style={{fontSize:'20px',fontWeight:'700',margin:'32px 0 16px',color:'#000'}}>2. Price / Deal Size</h2>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Price Min</label>
            <input type="number" placeholder="0" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Price Max</label>
            <input type="number" placeholder="Any" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Price Per Unit Min</label>
            <input type="number" placeholder="0" value={pricePerUnitMin} onChange={(e) => setPricePerUnitMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Price Per Unit Max</label>
            <input type="number" placeholder="Any" value={pricePerUnitMax} onChange={(e) => setPricePerUnitMax(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Cap Rate Min (%)</label>
            <input type="number" step="0.1" placeholder="0" value={capRateMin} onChange={(e) => setCapRateMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Cap Rate Max (%)</label>
            <input type="number" step="0.1" placeholder="Any" value={capRateMax} onChange={(e) => setCapRateMax(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Unit Count Min</label>
            <input type="number" placeholder="0" value={unitsMin} onChange={(e) => setUnitsMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Unit Count Max</label>
            <input type="number" placeholder="Any" value={unitsMax} onChange={(e) => setUnitsMax(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>NOI Min</label>
            <input type="number" placeholder="0" value={noiMin} onChange={(e) => setNoiMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>NOI Max</label>
            <input type="number" placeholder="Any" value={noiMax} onChange={(e) => setNoiMax(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <h2 style={{fontSize:'20px',fontWeight:'700',margin:'32px 0 16px',color:'#000'}}>3. Creative Financing Filters</h2>
        <div style={fieldStyle}>
          <label style={labelStyle}>Seller Carry Required</label>
          <select value={sellerCarryRequired} onChange={(e) => setSellerCarryRequired(e.target.value)} style={selectStyle}>
            <option value="">Either</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Max Down Payment (%)</label>
          <input type="number" step="0.1" placeholder="0-30" value={maxDownPayment} onChange={(e) => setMaxDownPayment(e.target.value)} style={inputStyle} />
        </div>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Interest Rate Min (%)</label>
            <input type="number" step="0.1" placeholder="0" value={interestRateMin} onChange={(e) => setInterestRateMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Interest Rate Max (%)</label>
            <input type="number" step="0.1" placeholder="Any" value={interestRateMax} onChange={(e) => setInterestRateMax(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Balloon Term Min (years)</label>
            <input type="number" placeholder="0" value={balloonTermMin} onChange={(e) => setBalloonTermMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Balloon Term Max (years)</label>
            <input type="number" placeholder="Any" value={balloonTermMax} onChange={(e) => setBalloonTermMax(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Interest-Only Option Required</label>
          <select value={interestOnlyRequired} onChange={(e) => setInterestOnlyRequired(e.target.value)} style={selectStyle}>
            <option value="">Either</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Requires Equity Partner</label>
          <select value={requiresEquityPartner} onChange={(e) => setRequiresEquityPartner(e.target.value)} style={selectStyle}>
            <option value="">Either</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Max Equity Split (%)</label>
          <input type="number" step="0.1" placeholder="0-50" value={maxEquitySplit} onChange={(e) => setMaxEquitySplit(e.target.value)} style={inputStyle} />
        </div>

        <h3 style={{fontSize:'16px',fontWeight:'700',margin:'24px 0 12px',color:'#000'}}>Creative Deal Signals</h3>
        <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px'}}>
          <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'15px'}}>
            <input type="checkbox" checked={vacantUnderperforming} onChange={(e) => setVacantUnderperforming(e.target.checked)} />
            Vacant or Underperforming
          </label>
          <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'15px'}}>
            <input type="checkbox" checked={distressedAsset} onChange={(e) => setDistressedAsset(e.target.checked)} />
            Distressed Asset
          </label>
          <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'15px'}}>
            <input type="checkbox" checked={expiredRentalLicenses} onChange={(e) => setExpiredRentalLicenses(e.target.checked)} />
            Expired Rental Licenses
          </label>
          <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'15px'}}>
            <input type="checkbox" checked={motivatedSeller} onChange={(e) => setMotivatedSeller(e.target.checked)} />
            Motivated Seller
          </label>
          <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'15px'}}>
            <input type="checkbox" checked={assumableLoan} onChange={(e) => setAssumableLoan(e.target.checked)} />
            Assumable Loan Available
          </label>
        </div>

        <h2 style={{fontSize:'20px',fontWeight:'700',margin:'32px 0 16px',color:'#000'}}>4. Income & Rent Filters</h2>
        <div style={fieldStyle}>
          <label style={labelStyle}>Min Monthly Cash Flow Day One</label>
          <input type="number" placeholder="0" value={minMonthlyCashFlow} onChange={(e) => setMinMonthlyCashFlow(e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Min Rent Per Unit</label>
          <input type="number" placeholder="0" value={minRentPerUnit} onChange={(e) => setMinRentPerUnit(e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Min Rent Upside (%)</label>
          <input type="number" step="0.1" placeholder="0" value={minRentUpside} onChange={(e) => setMinRentUpside(e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Min Renovation ROI (%)</label>
          <input type="number" step="0.1" placeholder="0" value={minRenovationRoi} onChange={(e) => setMinRenovationRoi(e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Min DSCR Day One</label>
          <input type="number" step="0.1" placeholder="0" value={minDscr} onChange={(e) => setMinDscr(e.target.value)} style={inputStyle} />
        </div>

        <h2 style={{fontSize:'20px',fontWeight:'700',margin:'32px 0 16px',color:'#000'}}>5. Physical Property Attributes</h2>
        <div style={fieldStyle}>
          <label style={labelStyle}>Beds (Min)</label>
          <select value={bedsMin} onChange={(e) => setBedsMin(e.target.value)} style={selectStyle}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Baths (Min)</label>
          <select value={bathsMin} onChange={(e) => setBathsMin(e.target.value)} style={selectStyle}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Square Feet Min</label>
            <input type="number" placeholder="0" value={sqftMin} onChange={(e) => setSqftMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Square Feet Max</label>
            <input type="number" placeholder="Any" value={sqftMax} onChange={(e) => setSqftMax(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Year Built Min</label>
            <input type="number" placeholder="0" value={yearBuiltMin} onChange={(e) => setYearBuiltMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Year Built Max</label>
            <input type="number" placeholder="Any" value={yearBuiltMax} onChange={(e) => setYearBuiltMax(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Lot Size Min</label>
            <input type="number" placeholder="0" value={lotSizeMin} onChange={(e) => setLotSizeMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Lot Size Max</label>
            <input type="number" placeholder="Any" value={lotSizeMax} onChange={(e) => setLotSizeMax(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Parking Type</label>
          <input type="text" placeholder="Optional" value={parkingType} onChange={(e) => setParkingType(e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Laundry</label>
          <select value={laundryType} onChange={(e) => setLaundryType(e.target.value)} style={selectStyle}>
            <option value="">Any</option>
            <option value="In-unit">In-unit</option>
            <option value="On-site">On-site</option>
            <option value="None">None</option>
          </select>
        </div>

        <h2 style={{fontSize:'20px',fontWeight:'700',margin:'32px 0 16px',color:'#000'}}>6. Operational Filters</h2>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Current Occupancy Min (%)</label>
            <input type="number" placeholder="0" value={occupancyMin} onChange={(e) => setOccupancyMin(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Current Occupancy Max (%)</label>
            <input type="number" placeholder="100" value={occupancyMax} onChange={(e) => setOccupancyMax(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Stabilized Occupancy Required</label>
          <select value={stabilizedOccupancyRequired} onChange={(e) => setStabilizedOccupancyRequired(e.target.value)} style={selectStyle}>
            <option value="">Doesn't matter</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Separate Utilities</label>
          <select value={separateUtilities} onChange={(e) => setSeparateUtilities(e.target.value)} style={selectStyle}>
            <option value="">Doesn't matter</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>RUBS Allowed</label>
          <select value={rubsAllowed} onChange={(e) => setRubsAllowed(e.target.value)} style={selectStyle}>
            <option value="">Doesn't matter</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Tenant-Paid Utilities</label>
          <select value={tenantPaidUtilities} onChange={(e) => setTenantPaidUtilities(e.target.value)} style={selectStyle}>
            <option value="">Either</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <h2 style={{fontSize:'20px',fontWeight:'700',margin:'32px 0 16px',color:'#000'}}>7. Risk Tolerance Filters</h2>
        <div style={fieldStyle}>
          <label style={labelStyle}>Max Rehab Budget Per Unit</label>
          <input type="number" placeholder="0" value={maxRehabPerUnit} onChange={(e) => setMaxRehabPerUnit(e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Max Total Rehab Budget</label>
          <input type="number" placeholder="0" value={maxTotalRehab} onChange={(e) => setMaxTotalRehab(e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Heavy Value Add?</label>
          <select value={heavyValueAdd} onChange={(e) => setHeavyValueAdd(e.target.value)} style={selectStyle}>
            <option value="">Either</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Turnkey?</label>
          <select value={turnkey} onChange={(e) => setTurnkey(e.target.value)} style={selectStyle}>
            <option value="">Either</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <button onClick={handleSave} disabled={loading} style={buttonStyle}>
          {loading ? 'Saving...' : 'Save Buy Box'}
        </button>

        {saved && (
          <p style={{marginTop:'16px', color:'green', fontWeight:'600'}}>
            Buy box data has been saved!
          </p>
        )}
      </div>
    </div>
  );
}

function BuyBoxResultsTab() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatchingProperties();
  }, []);

  const loadMatchingProperties = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: buyBox } = await supabase
      .from('buy_boxes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('Loaded buy box for results:', buyBox);

    if (!buyBox) {
      console.log('No buy box found');
      setLoading(false);
      return;
    }

    let query = supabase
      .from('properties')
      .select('*');

    console.log('Starting query for all properties');

    // Only apply filters that are actually filled in (optional filtering)
    // Price filters
    if (buyBox.price_min) {
      console.log('Filtering price >= ', buyBox.price_min);
      query = query.gte('price', buyBox.price_min);
    }
    if (buyBox.price_max) {
      console.log('Filtering price <= ', buyBox.price_max);
      query = query.lte('price', buyBox.price_max);
    }
    
    // Units
    if (buyBox.units_min) query = query.gte('units', buyBox.units_min);
    if (buyBox.units_max) query = query.lte('units', buyBox.units_max);
    
    // Creative financing (only filter if explicitly required)
    if (buyBox.seller_carry_required === 'Yes') query = query.eq('seller_financing_available', true);
    if (buyBox.assumable_loan) query = query.eq('assumable_loan', true);
    
    // Creative deal signals (only filter if checked)
    if (buyBox.vacant_underperforming) query = query.eq('vacant_underperforming', true);
    if (buyBox.distressed_asset) query = query.eq('distressed_asset', true);
    if (buyBox.motivated_seller) query = query.eq('motivated_seller', true);
    
    // Physical attributes
    if (buyBox.sqft_min) query = query.gte('sqft', buyBox.sqft_min);
    if (buyBox.sqft_max) query = query.lte('sqft', buyBox.sqft_max);
    if (buyBox.year_built_min) query = query.gte('year_built', buyBox.year_built_min);
    if (buyBox.year_built_max) query = query.lte('year_built', buyBox.year_built_max);

    query = query.order('created_at', { ascending: false });

    const { data: propertiesData, error: queryError } = await query;

    console.log('Query returned properties:', propertiesData?.length || 0);
    if (queryError) console.error('Query error:', queryError);

    // Client-side location filter - flexible matching
    let filtered = propertiesData || [];
    if (buyBox.locations && buyBox.locations.length > 0) {
      console.log('Filtering by locations:', buyBox.locations);
      filtered = filtered.filter(property => {
        const propCity = (property.city || '').toLowerCase();
        const propState = (property.state || '').toLowerCase();
        const propZip = (property.zip || property.zipcode || '').toString().toLowerCase();
        const propAddress = (property.address || '').toLowerCase();
        
        // Check if any location tag matches city, state, or zip
        return buyBox.locations.some(loc => {
          const searchTerm = loc.toLowerCase();
          const cityMatch = propCity.includes(searchTerm) || searchTerm.includes(propCity);
          const stateMatch = propState.includes(searchTerm) || searchTerm.includes(propState);
          const zipMatch = propZip.includes(searchTerm) || searchTerm.includes(propZip);
          const addressMatch = propAddress.includes(searchTerm);
          
          const matched = cityMatch || stateMatch || zipMatch || addressMatch;
          if (matched) {
            console.log(`Property matched: ${property.address} (searched: ${searchTerm})`);
          }
          return matched;
        });
      });
      console.log('After location filtering:', filtered.length, 'properties');
    } else {
      console.log('No location filter, returning all properties');
    }

    setProperties(filtered);
    setLoading(false);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  const imageStyle = {
    width: '100%',
    height: '220px',
    background: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#999'
  };

  const contentCardStyle = {
    padding: '20px'
  };

  const addressStyle = {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 12px',
    color: '#000'
  };

  const metaStyle = {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 6px'
  };

  const priceStyle = {
    fontSize: '22px',
    fontWeight: '800',
    color: '#000',
    margin: '12px 0 0'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    background: status === 'active' ? '#e8f5e9' : 
                status === 'sold' ? '#ffebee' : 
                status === 'pending' ? '#fff3e0' : 
                status === 'contingent' ? '#e3f2fd' : '#f5f5f5',
    color: status === 'active' ? '#2e7d32' : 
           status === 'sold' ? '#c62828' : 
           status === 'pending' ? '#ef6c00' : 
           status === 'contingent' ? '#1565c0' : '#757575'
  });

  return (
    <div>
      <h1 style={titleStyle}>Buy Box Results</h1>
      {loading ? (
        <p>Loading matching properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties match your buy box criteria yet.</p>
      ) : (
        <div style={gridStyle}>
          {properties.map(property => (
            <div
              key={property.id}
              style={cardStyle}
              onClick={() => navigate(`/property/${property.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              {property.cover_image ? (
                <img src={property.cover_image} alt={property.title} style={{...imageStyle, objectFit: 'cover'}} />
              ) : (
                <div style={imageStyle}>No Image</div>
              )}
              <div style={contentCardStyle}>
                <div style={statusBadgeStyle(property.status || 'active')}>
                  {(property.status || 'active')}
                </div>
                <h3 style={addressStyle}>{property.title || property.address}</h3>
                <p style={metaStyle}>{property.units} Units • {property.city}, {property.state}</p>
                {property.monthly_rent && property.price && (
                  <p style={metaStyle}>Cap Rate: {((property.monthly_rent * 12 / property.price) * 100).toFixed(1)}%</p>
                )}
                <p style={priceStyle}>${property.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MyListingsTab() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setListings(data || []);
    setLoading(false);
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    const { error } = await supabase
      .from('properties')
      .update({ status: newStatus })
      .eq('id', propertyId);

    if (error) {
      console.error('Update error:', error);
      alert('Failed to update status: ' + error.message);
    } else {
      loadListings();
    }
  };

  const handleDelete = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      loadListings();
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  };

  const listingCardStyle = {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    background: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#999'
  };

  const contentStyle = {
    padding: '20px'
  };

  const titleStyle2 = {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 8px',
    color: '#000'
  };

  const metaStyle = {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 6px'
  };

  const priceStyle = {
    fontSize: '22px',
    fontWeight: '800',
    color: '#000',
    margin: '12px 0'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '12px',
    background: status === 'active' ? '#e8f5e9' : status === 'sold' ? '#ffebee' : status === 'pending' ? '#fff3e0' : '#e3f2fd',
    color: status === 'active' ? '#2e7d32' : status === 'sold' ? '#c62828' : status === 'pending' ? '#ef6c00' : '#1565c0'
  });

  const buttonRowStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap'
  };

  const actionButtonStyle = {
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    background: '#fff',
    transition: 'all 0.2s ease'
  };

  const deleteButtonStyle = {
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    background: '#f44336',
    color: '#fff',
    transition: 'all 0.2s ease'
  };

  return (
    <div>
      <h1 style={titleStyle}>My Listings</h1>
      {loading ? (
        <p>Loading your listings...</p>
      ) : listings.length === 0 ? (
        <div>
          <p>You haven't listed any properties yet.</p>
          <button
            onClick={() => navigate('/submit')}
            style={{...buttonStyle, marginTop: '16px'}}
          >
            Submit Your First Property
          </button>
        </div>
      ) : (
        <div style={gridStyle}>
          {listings.map(listing => (
            <div key={listing.id} style={listingCardStyle}>
              {listing.cover_image ? (
                <img src={listing.cover_image} alt={listing.title} style={{...imageStyle, objectFit: 'cover'}} />
              ) : (
                <div style={imageStyle}>No Image</div>
              )}
              <div style={contentStyle}>
                <div style={statusBadgeStyle(listing.status)}>
                  {listing.status.toUpperCase()}
                </div>
                <h3 style={titleStyle2}>{listing.title || listing.address}</h3>
                <p style={metaStyle}>{listing.units} Units • {listing.city}, {listing.state}</p>
                <p style={priceStyle}>${listing.price?.toLocaleString()}</p>
                <p style={{...metaStyle, marginTop: '8px'}}>
                  Views: {listing.views || 0} • LOIs: {listing.loi_count || 0}
                </p>

                <div style={buttonRowStyle}>
                  <button
                    onClick={() => navigate(`/property/${listing.id}`)}
                    style={actionButtonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit-property/${listing.id}`)}
                    style={actionButtonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                  >
                    Edit
                  </button>
                  {listing.status !== 'sold' && (
                    <button
                      onClick={() => handleStatusChange(listing.id, 'sold')}
                      style={actionButtonStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      Mark Sold
                    </button>
                  )}
                  {listing.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange(listing.id, 'pending')}
                      style={actionButtonStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      Mark Pending
                    </button>
                  )}
                  {listing.status !== 'contingent' && (
                    <button
                      onClick={() => handleStatusChange(listing.id, 'contingent')}
                      style={actionButtonStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      Mark Contingent
                    </button>
                  )}
                  {listing.status !== 'active' && (
                    <button
                      onClick={() => handleStatusChange(listing.id, 'active')}
                      style={actionButtonStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      Mark Active
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(listing.id)}
                    style={deleteButtonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#d32f2f'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f44336'}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (activeTab === 'offers') {
      loadOffers();
    }
  }, [activeTab]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfile();
  };

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('User from auth:', user);
    
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile query result:', { data, error });

      if (data) {
        setProfile({
          ...data,
          email: user.email
        });
      } else if (error) {
        console.error('Profile load error:', error);
      }
    }
    
    setLoading(false);
  };

  const loadOffers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    console.log('Loading offers for user:', user.id);

    // Get offers where user is the seller
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        properties (
          address,
          city,
          state,
          title
        )
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    console.log('Offers query result:', { data, error });

    if (error) {
      console.error('Error loading offers:', error);
    } else {
      setOffers(data || []);
    }
  };

  const MyOffersTab = () => {
    const calculateMetrics = (offer) => {
      const price = offer.purchase_price || 0;
      const noi = offer.current_noi || 0;
      const capRate = price > 0 ? ((noi / price) * 100).toFixed(2) : 0;
      const cashFlow = (noi / 12).toFixed(0);

      return { capRate, cashFlow };
    };

    return (
      <div>
        <h1 style={titleStyle}>My Offers</h1>
        {offers.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <p style={{ fontSize: '18px', color: '#666' }}>No offers received yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {offers.map(offer => {
              const metrics = calculateMetrics(offer);
              return (
                <div key={offer.id} style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700' }}>
                        {offer.properties?.title || offer.properties?.address || 'Property'}
                      </h3>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        {offer.properties?.city}, {offer.properties?.state}
                      </p>
                      <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#999' }}>
                        Received: {new Date(offer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      background: offer.status === 'pending' ? '#ffd700' : offer.status === 'accepted' ? '#4caf50' : '#f44336',
                      color: '#fff'
                    }}>
                      {offer.status.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Offer Price</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>
                        ${offer.purchase_price?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Units</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>
                        {offer.units || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Cap Rate</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#4caf50' }}>
                        {metrics.capRate}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Monthly Cash Flow</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#2196f3' }}>
                        ${metrics.cashFlow}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Strategy</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                        {offer.strategy?.replace('-', ' ').toUpperCase() || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Earnest Money</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                        ${offer.earnest_money?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Closing Timeline</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                        {offer.closing_timeline || 'N/A'} days
                      </div>
                    </div>
                  </div>

                  <details style={{ marginBottom: '20px' }}>
                    <summary style={{ fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>
                      View Full LOI
                    </summary>
                    <pre style={{
                      padding: '16px',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace'
                    }}>
                      {offer.loi_text || 'No LOI text available'}
                    </pre>
                  </details>

                  {offer.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => updateOfferStatus(offer.id, 'accepted')}
                        style={{
                          padding: '12px 24px',
                          fontSize: '16px',
                          fontWeight: '600',
                          background: '#4caf50',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateOfferStatus(offer.id, 'rejected')}
                        style={{
                          padding: '12px 24px',
                          fontSize: '16px',
                          fontWeight: '600',
                          background: '#f44336',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const updateOfferStatus = async (offerId, newStatus) => {
    const { error } = await supabase
      .from('offers')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', offerId);

    if (error) {
      console.error('Error updating offer:', error);
      alert('Failed to update offer status');
    } else {
      alert(`Offer ${newStatus}!`);
      loadOffers();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h1 style={titleStyle}>Profile</h1>
            {loading ? (
              <p>Loading...</p>
            ) : profile ? (
              <div style={profileCardStyle}>
                <div style={fieldStyle}>
                  <span style={labelStyle}>First Name</span>
                  <span style={valueStyle}>{profile.first_name}</span>
                </div>
                <div style={fieldStyle}>
                  <span style={labelStyle}>Last Name</span>
                  <span style={valueStyle}>{profile.last_name}</span>
                </div>
                <div style={fieldStyle}>
                  <span style={labelStyle}>Email</span>
                  <span style={valueStyle}>{profile.email}</span>
                </div>
                <div style={fieldStyle}>
                  <span style={labelStyle}>Phone</span>
                  <span style={valueStyle}>{profile.phone}</span>
                </div>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/');
                  }}
                  style={{
                    marginTop: '24px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    background: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <p>No profile found</p>
            )}
          </div>
        );
      case 'listings':
        return <MyListingsTab />;
      case 'buybox':
        return <BuyBoxTab />;
      case 'results':
        return <BuyBoxResultsTab />;
      case 'offers':
        return <MyOffersTab />;
      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <button
          style={activeTab === 'profile' ? activeTabButtonStyle : tabButtonStyle}
          onClick={() => setActiveTab('profile')}
          onMouseEnter={(e) => {
            if (activeTab !== 'profile') e.currentTarget.style.background = '#f9f9f9';
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'profile') e.currentTarget.style.background = 'transparent';
          }}
        >
          Profile
        </button>
        <button
          style={activeTab === 'listings' ? activeTabButtonStyle : tabButtonStyle}
          onClick={() => setActiveTab('listings')}
          onMouseEnter={(e) => {
            if (activeTab !== 'listings') e.currentTarget.style.background = '#f9f9f9';
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'listings') e.currentTarget.style.background = 'transparent';
          }}
        >
          My Listings
        </button>
        <button
          style={activeTab === 'buybox' ? activeTabButtonStyle : tabButtonStyle}
          onClick={() => setActiveTab('buybox')}
          onMouseEnter={(e) => {
            if (activeTab !== 'buybox') e.currentTarget.style.background = '#f9f9f9';
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'buybox') e.currentTarget.style.background = 'transparent';
          }}
        >
          Buy Box
        </button>
        <button
          style={activeTab === 'results' ? activeTabButtonStyle : tabButtonStyle}
          onClick={() => setActiveTab('results')}
          onMouseEnter={(e) => {
            if (activeTab !== 'results') e.currentTarget.style.background = '#f9f9f9';
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'results') e.currentTarget.style.background = 'transparent';
          }}
        >
          Buy Box Results
        </button>
        <button
          style={activeTab === 'offers' ? activeTabButtonStyle : tabButtonStyle}
          onClick={() => setActiveTab('offers')}
          onMouseEnter={(e) => {
            if (activeTab !== 'offers') e.currentTarget.style.background = '#f9f9f9';
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'offers') e.currentTarget.style.background = 'transparent';
          }}
        >
          My Offers
        </button>
      </div>
      <div style={contentStyle}>
        {renderContent()}
      </div>
    </div>
  );
}
