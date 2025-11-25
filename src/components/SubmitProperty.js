import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const CLOUDINARY_CLOUD_NAME = 'dzcix6zs4';
const CLOUDINARY_UPLOAD_PRESET = 'Apartment_blocks';

const containerStyle = {
  minHeight: 'calc(100vh - 60px)',
  background: '#f5f7fa',
  padding: '40px 20px'
};

const wizardContainerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  overflow: 'hidden'
};

const progressBarStyle = {
  display: 'flex',
  background: '#f0f0f0',
  padding: '0'
};

const stepStyle = (isActive, isCompleted) => ({
  flex: 1,
  padding: '16px',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: isActive ? '700' : '600',
  color: isActive ? '#000' : isCompleted ? '#666' : '#999',
  background: isActive ? '#fff' : isCompleted ? '#f9f9f9' : '#f0f0f0',
  borderBottom: isActive ? '3px solid #000' : '3px solid transparent',
  cursor: 'default'
});

const contentStyle = {
  padding: '40px'
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: '800',
  margin: '0 0 8px',
  color: '#000'
};

const subtitleStyle = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 32px'
};

const fieldStyle = {
  marginBottom: '24px'
};

const labelStyle = (required) => ({
  fontSize: '14px',
  fontWeight: '600',
  color: required ? '#000' : '#666',
  display: 'block',
  marginBottom: '8px'
});

const requiredStyle = {
  color: '#d00',
  marginLeft: '4px'
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

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px'
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '40px',
  paddingTop: '24px',
  borderTop: '1px solid #ddd'
};

const buttonStyle = (primary) => ({
  padding: '14px 32px',
  fontSize: '16px',
  fontWeight: '700',
  background: primary ? '#000' : '#fff',
  color: primary ? '#fff' : '#666',
  border: primary ? 'none' : '1px solid #ddd',
  borderRadius: '8px',
  cursor: 'pointer'
});

const uploadContainerStyle = {
  border: '2px dashed #ddd',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center',
  background: '#fafafa',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const imageGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '16px',
  marginTop: '16px'
};

const imagePreviewStyle = {
  position: 'relative',
  paddingTop: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '2px solid #ddd'
};

const coverBadgeStyle = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  background: '#000',
  color: '#fff',
  padding: '4px 8px',
  fontSize: '12px',
  fontWeight: '700',
  borderRadius: '4px',
  zIndex: 2
};

const imageStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const removeButtonStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  background: '#d00',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  cursor: 'pointer',
  fontSize: '18px',
  lineHeight: '1',
  zIndex: 2
};

const setCoverButtonStyle = {
  position: 'absolute',
  bottom: '8px',
  left: '8px',
  right: '8px',
  background: 'rgba(0,0,0,0.7)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600',
  zIndex: 2
};

const errorStyle = {
  color: '#d00',
  fontSize: '14px',
  marginTop: '8px'
};

export default function SubmitProperty() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Check auth on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to submit a property');
      navigate('/login');
      return;
    }
    
    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile?.role === 'admin') {
      setIsAdmin(true);
      setSelectedUserId(user.id); // Default to self
      
      // Load all users for dropdown
      const { data: users } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .order('email');
      
      if (users) {
        setAllUsers(users);
      }
    }
  };

  // Step 1: Property Basics (REQUIRED)
  const [propertyTitle, setPropertyTitle] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [units, setUnits] = useState('');

  // Step 2: Financial Basics (REQUIRED)
  const [askingPrice, setAskingPrice] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [rentUnknown, setRentUnknown] = useState(false);
  const [currentRentPerUnit, setCurrentRentPerUnit] = useState('');
  const [marketRentPerUnit, setMarketRentPerUnit] = useState('');
  const [annualTaxes, setAnnualTaxes] = useState('');
  const [annualInsurance, setAnnualInsurance] = useState('');
  const [utilitiesPaidBy, setUtilitiesPaidBy] = useState('');

  // Step 3: Occupancy (REQUIRED)
  const [occupancyPercent, setOccupancyPercent] = useState('');
  const [occupancyUnknown, setOccupancyUnknown] = useState(false);

  // Step 4: Creative Finance (REQUIRED)
  const [sellerFinancing, setSellerFinancing] = useState('');
  const [sellerFinanceLoanAmount, setSellerFinanceLoanAmount] = useState('');
  const [sellerFinanceInterestRate, setSellerFinanceInterestRate] = useState('');
  const [sellerFinanceAmortization, setSellerFinanceAmortization] = useState('');
  const [sellerFinanceBalloonTerm, setSellerFinanceBalloonTerm] = useState('');
  const [sellerFinanceDownPayment, setSellerFinanceDownPayment] = useState('');
  
  const [assumableLoan, setAssumableLoan] = useState('');
  const [assumableLoanBalance, setAssumableLoanBalance] = useState('');
  const [assumableLoanPayment, setAssumableLoanPayment] = useState('');
  const [assumableLoanInterestRate, setAssumableLoanInterestRate] = useState('');
  const [assumableLoanType, setAssumableLoanType] = useState('');
  const [assumableLoanMaturity, setAssumableLoanMaturity] = useState('');

  // Step 5: Contact Info (REQUIRED)
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Step 6: Photos (REQUIRED - minimum 2)
  const [photos, setPhotos] = useState([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Optional fields
  const [county, setCounty] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [sqft, setSqft] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [buildingClass, setBuildingClass] = useState('');
  const [proFormaRent, setProFormaRent] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [opex, setOpex] = useState('');
  const [bed1Count, setBed1Count] = useState('');
  const [bed2Count, setBed2Count] = useState('');
  const [bed3Count, setBed3Count] = useState('');
  const [bed4Count, setBed4Count] = useState('');
  const [vacancyCount, setVacancyCount] = useState('');
  const [renovatedCount, setRenovatedCount] = useState('');
  const [valueAddPossible, setValueAddPossible] = useState('');
  const [rehabPerUnit, setRehabPerUnit] = useState('');
  const [totalRehab, setTotalRehab] = useState('');
  const [documents, setDocuments] = useState([]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!propertyTitle.trim()) newErrors.propertyTitle = 'Required';
      if (!address.trim()) newErrors.address = 'Required';
      if (!city.trim()) newErrors.city = 'Required';
      if (!state.trim()) newErrors.state = 'Required';
      if (!zip.trim()) newErrors.zip = 'Required';
      if (!propertyType) newErrors.propertyType = 'Required';
      if (!units) newErrors.units = 'Required';
    }

    if (step === 2) {
      if (!askingPrice) newErrors.askingPrice = 'Required';
      if (!rentUnknown && !monthlyRent) newErrors.monthlyRent = 'Required or check Unknown';
      if (!annualTaxes) newErrors.annualTaxes = 'Required';
      if (!annualInsurance) newErrors.annualInsurance = 'Required';
      if (!utilitiesPaidBy) newErrors.utilitiesPaidBy = 'Required';
    }

    if (step === 3) {
      if (!occupancyUnknown && !occupancyPercent) newErrors.occupancyPercent = 'Required or check Unknown';
    }

    if (step === 4) {
      if (!sellerFinancing) newErrors.sellerFinancing = 'Required';
      if (!assumableLoan) newErrors.assumableLoan = 'Required';
    }

    if (step === 5) {
      if (!contactName.trim()) newErrors.contactName = 'Required';
      if (!contactPhone.trim() && !contactEmail.trim()) {
        newErrors.contactPhone = 'Phone OR Email required';
        newErrors.contactEmail = 'Phone OR Email required';
      }
    }

    if (step === 6) {
      if (photos.length < 2) newErrors.photos = 'Minimum 2 photos required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    
    // Use image endpoint for all uploads - Cloudinary will detect format
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Upload failed: ${errorData}`);
    }
    const data = await response.json();
    return data.secure_url;
  };

  const uploadDocumentToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { data, error } = await supabase.storage
      .from('property-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-documents')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploadingPhoto(true);

    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file, 'image'));
      const urls = await Promise.all(uploadPromises);
      setPhotos([...photos, ...urls]);
      setErrors({ ...errors, photos: undefined });
    } catch (error) {
      alert('Photo upload failed: ' + error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    try {
      const uploadPromises = files.map(file => uploadDocumentToSupabase(file));
      const urls = await Promise.all(uploadPromises);
      setDocuments([...documents, ...urls]);
    } catch (error) {
      alert('Document upload failed: ' + error.message);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    if (coverPhotoIndex >= newPhotos.length) {
      setCoverPhotoIndex(0);
    }
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to submit a property');
        navigate('/login');
        return;
      }

      // Geocode the address to get coordinates
      let lng = null;
      let lat = null;
      try {
        const geocodeQuery = `${address}, ${city}, ${state} ${zip}`;
        const geocodeResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(geocodeQuery)}.json?access_token=pk.eyJ1IjoidHlsZXJ3YXluZTEiLCJhIjoiY21oNzlqb2xwMHBybjJscHR5ZXVqcHZ2aCJ9.jHao1snG3bwXFRVWcA8tuQ`
        );
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.features && geocodeData.features.length > 0) {
          lng = geocodeData.features[0].center[0];
          lat = geocodeData.features[0].center[1];
        }
      } catch (geoError) {
        console.error('Geocoding error:', geoError);
      }

      const propertyData = {
        user_id: selectedUserId || user.id, // Use selected user if admin, otherwise current user
        title: propertyTitle,
        address: address,
        city: city,
        state: state,
        zip: zip,
        county: county || null,
        property_type: propertyType,
        units: parseInt(units),
        building_class: buildingClass || null,
        year_built: yearBuilt ? parseInt(yearBuilt) : null,
        sqft: sqft ? parseInt(sqft) : null,
        lot_size: lotSize ? parseFloat(lotSize) : null,
        price: parseFloat(askingPrice),
        monthly_rent: rentUnknown ? null : parseFloat(monthlyRent),
        current_rent_per_unit: currentRentPerUnit ? parseFloat(currentRentPerUnit) : null,
        market_rent_per_unit: marketRentPerUnit ? parseFloat(marketRentPerUnit) : null,
        pro_forma_rent: proFormaRent ? parseFloat(proFormaRent) : null,
        other_income: otherIncome ? parseFloat(otherIncome) : null,
        annual_taxes: parseFloat(annualTaxes),
        annual_insurance: parseFloat(annualInsurance),
        annual_opex: opex ? parseFloat(opex) : null,
        utilities_paid_by: utilitiesPaidBy,
        occupancy_percent: occupancyUnknown ? null : parseFloat(occupancyPercent),
        seller_financing_available: sellerFinancing === 'Yes',
        seller_finance_loan_amount: sellerFinanceLoanAmount ? parseFloat(sellerFinanceLoanAmount) : null,
        seller_finance_down_payment: sellerFinanceDownPayment ? parseFloat(sellerFinanceDownPayment) : null,
        seller_finance_interest_rate: sellerFinanceInterestRate ? parseFloat(sellerFinanceInterestRate) : null,
        seller_finance_amortization: sellerFinanceAmortization ? parseInt(sellerFinanceAmortization) : null,
        seller_finance_balloon_term: sellerFinanceBalloonTerm ? parseInt(sellerFinanceBalloonTerm) : null,
        assumable_loan: assumableLoan === 'Yes',
        assumable_loan_balance: assumableLoanBalance ? parseFloat(assumableLoanBalance) : null,
        assumable_loan_payment: assumableLoanPayment ? parseFloat(assumableLoanPayment) : null,
        assumable_loan_interest_rate: assumableLoanInterestRate ? parseFloat(assumableLoanInterestRate) : null,
        assumable_loan_type: assumableLoanType || null,
        assumable_loan_maturity: assumableLoanMaturity || null,
        contact_name: contactName,
        contact_phone: contactPhone || null,
        contact_email: contactEmail || null,
        images: photos,
        cover_image: photos[coverPhotoIndex] || photos[0],
        documents: documents,
        bed_1_count: bed1Count ? parseInt(bed1Count) : null,
        bed_2_count: bed2Count ? parseInt(bed2Count) : null,
        bed_3_count: bed3Count ? parseInt(bed3Count) : null,
        bed_4_count: bed4Count ? parseInt(bed4Count) : null,
        vacancy_count: vacancyCount ? parseInt(vacancyCount) : null,
        renovated_count: renovatedCount ? parseInt(renovatedCount) : null,
        value_add_possible: valueAddPossible === 'Yes',
        rehab_per_unit: rehabPerUnit ? parseFloat(rehabPerUnit) : null,
        total_rehab_budget: totalRehab ? parseFloat(totalRehab) : null,
        lng: lng,
        lat: lat,
        status: 'active'
      };

      const { error } = await supabase
        .from('properties')
        .insert(propertyData);

      if (error) throw error;

      alert('Property submitted successfully!');
      navigate('/properties');
    } catch (error) {
      alert('Failed to submit property: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 style={titleStyle}>Property Basics</h2>
            <p style={subtitleStyle}>Tell us about the property</p>

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Property Title / Headline<span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                placeholder="e.g., 24-Unit Multifamily in Atlanta"
                style={inputStyle}
              />
              {errors.propertyTitle && <div style={errorStyle}>{errors.propertyTitle}</div>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Street Address<span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St"
                style={inputStyle}
              />
              {errors.address && <div style={errorStyle}>{errors.address}</div>}
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(true)}>
                  City<span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Atlanta"
                  style={inputStyle}
                />
                {errors.city && <div style={errorStyle}>{errors.city}</div>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle(true)}>
                  State<span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="GA"
                  style={inputStyle}
                  maxLength="2"
                />
                {errors.state && <div style={errorStyle}>{errors.state}</div>}
              </div>
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(true)}>
                  ZIP Code<span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="30303"
                  style={inputStyle}
                />
                {errors.zip && <div style={errorStyle}>{errors.zip}</div>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle(false)}>County (Optional)</label>
                <input
                  type="text"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  placeholder="Fulton"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(true)}>
                  Property Type<span style={requiredStyle}>*</span>
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Select...</option>
                  <option value="Multifamily">Multifamily</option>
                  <option value="Mixed-Use">Mixed-Use</option>
                  <option value="SFR Portfolio">SFR Portfolio</option>
                  <option value="Apartment Complex">Apartment Complex</option>
                  <option value="Other">Other</option>
                </select>
                {errors.propertyType && <div style={errorStyle}>{errors.propertyType}</div>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle(true)}>
                  Unit Count<span style={requiredStyle}>*</span>
                </label>
                <input
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  placeholder="24"
                  style={inputStyle}
                  min="1"
                />
                {errors.units && <div style={errorStyle}>{errors.units}</div>}
              </div>
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(false)}>Building Class (Optional)</label>
                <select
                  value={buildingClass}
                  onChange={(e) => setBuildingClass(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Select...</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle(false)}>Year Built (Optional)</label>
                <input
                  type="number"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                  placeholder="1985"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(false)}>Total Sq Ft (Optional)</label>
                <input
                  type="number"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  placeholder="20000"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle(false)}>Lot Size (Optional)</label>
                <input
                  type="number"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                  placeholder="1.5"
                  style={inputStyle}
                  step="0.1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 style={titleStyle}>Financial Basics</h2>
            <p style={subtitleStyle}>Required financial information</p>

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Asking Price<span style={requiredStyle}>*</span>
              </label>
              <input
                type="number"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder="2500000"
                style={inputStyle}
              />
              {errors.askingPrice && <div style={errorStyle}>{errors.askingPrice}</div>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Current Monthly Rent Total<span style={requiredStyle}>*</span>
              </label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="18000"
                style={inputStyle}
                disabled={rentUnknown}
              />
              <label style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'8px',fontSize:'14px'}}>
                <input
                  type="checkbox"
                  checked={rentUnknown}
                  onChange={(e) => setRentUnknown(e.target.checked)}
                />
                Unknown
              </label>
              {errors.monthlyRent && <div style={errorStyle}>{errors.monthlyRent}</div>}
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(false)}>Current Rent Per Unit</label>
                <input
                  type="number"
                  value={currentRentPerUnit}
                  onChange={(e) => setCurrentRentPerUnit(e.target.value)}
                  placeholder="850"
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle(false)}>Market Rent Per Unit</label>
                <input
                  type="number"
                  value={marketRentPerUnit}
                  onChange={(e) => setMarketRentPerUnit(e.target.value)}
                  placeholder="950"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle(false)}>Pro Forma Monthly Rent (Optional)</label>
              <input
                type="number"
                value={proFormaRent}
                onChange={(e) => setProFormaRent(e.target.value)}
                placeholder="22000"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle(false)}>Other Monthly Income (Optional)</label>
              <input
                type="number"
                value={otherIncome}
                onChange={(e) => setOtherIncome(e.target.value)}
                placeholder="2000"
                style={inputStyle}
              />
              <div style={{fontSize:'12px',color:'#999',marginTop:'4px'}}>
                Laundry, RUBS, storage, parking, etc.
              </div>
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(true)}>
                  Annual Taxes<span style={requiredStyle}>*</span>
                </label>
                <input
                  type="number"
                  value={annualTaxes}
                  onChange={(e) => setAnnualTaxes(e.target.value)}
                  placeholder="15000"
                  style={inputStyle}
                />
                {errors.annualTaxes && <div style={errorStyle}>{errors.annualTaxes}</div>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle(true)}>
                  Annual Insurance<span style={requiredStyle}>*</span>
                </label>
                <input
                  type="number"
                  value={annualInsurance}
                  onChange={(e) => setAnnualInsurance(e.target.value)}
                  placeholder="8000"
                  style={inputStyle}
                />
                {errors.annualInsurance && <div style={errorStyle}>{errors.annualInsurance}</div>}
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle(false)}>Annual Operating Expenses Total (Optional)</label>
              <input
                type="number"
                value={opex}
                onChange={(e) => setOpex(e.target.value)}
                placeholder="50000"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Who Pays Utilities?<span style={requiredStyle}>*</span>
              </label>
              <select
                value={utilitiesPaidBy}
                onChange={(e) => setUtilitiesPaidBy(e.target.value)}
                style={selectStyle}
              >
                <option value="">Select...</option>
                <option value="Owner pays all">Owner pays all</option>
                <option value="Tenants pay some">Tenants pay some</option>
                <option value="Tenants pay all">Tenants pay all</option>
                <option value="Unknown">Unknown</option>
              </select>
              {errors.utilitiesPaidBy && <div style={errorStyle}>{errors.utilitiesPaidBy}</div>}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 style={titleStyle}>Occupancy</h2>
            <p style={subtitleStyle}>Current occupancy status</p>

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Current Occupancy %<span style={requiredStyle}>*</span>
              </label>
              <input
                type="number"
                value={occupancyPercent}
                onChange={(e) => setOccupancyPercent(e.target.value)}
                placeholder="85"
                style={inputStyle}
                min="0"
                max="100"
                disabled={occupancyUnknown}
              />
              <label style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'8px',fontSize:'14px'}}>
                <input
                  type="checkbox"
                  checked={occupancyUnknown}
                  onChange={(e) => setOccupancyUnknown(e.target.checked)}
                />
                Unknown
              </label>
              {errors.occupancyPercent && <div style={errorStyle}>{errors.occupancyPercent}</div>}
            </div>

            <h3 style={{fontSize:'18px',fontWeight:'700',margin:'32px 0 16px',color:'#000'}}>
              Optional Unit Details
            </h3>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(false)}>1 Bed Units</label>
                <input
                  type="number"
                  value={bed1Count}
                  onChange={(e) => setBed1Count(e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle(false)}>2 Bed Units</label>
                <input
                  type="number"
                  value={bed2Count}
                  onChange={(e) => setBed2Count(e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(false)}>3 Bed Units</label>
                <input
                  type="number"
                  value={bed3Count}
                  onChange={(e) => setBed3Count(e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle(false)}>4+ Bed Units</label>
                <input
                  type="number"
                  value={bed4Count}
                  onChange={(e) => setBed4Count(e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(false)}>Vacant Units</label>
                <input
                  type="number"
                  value={vacancyCount}
                  onChange={(e) => setVacancyCount(e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle(false)}>Renovated Units</label>
                <input
                  type="number"
                  value={renovatedCount}
                  onChange={(e) => setRenovatedCount(e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
            </div>

            <h3 style={{fontSize:'18px',fontWeight:'700',margin:'32px 0 16px',color:'#000'}}>
              Value Add Opportunity
            </h3>

            <div style={fieldStyle}>
              <label style={labelStyle(false)}>Value Add Possible?</label>
              <select
                value={valueAddPossible}
                onChange={(e) => setValueAddPossible(e.target.value)}
                style={selectStyle}
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle(false)}>Rehab Cost Per Unit</label>
                <input
                  type="number"
                  value={rehabPerUnit}
                  onChange={(e) => setRehabPerUnit(e.target.value)}
                  placeholder="5000"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle(false)}>Total Rehab Estimate</label>
                <input
                  type="number"
                  value={totalRehab}
                  onChange={(e) => setTotalRehab(e.target.value)}
                  placeholder="120000"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 style={titleStyle}>Creative Finance</h2>
            <p style={subtitleStyle}>This is what makes your platform special</p>

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Seller Financing Available?<span style={requiredStyle}>*</span>
              </label>
              <select
                value={sellerFinancing}
                onChange={(e) => setSellerFinancing(e.target.value)}
                style={selectStyle}
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.sellerFinancing && <div style={errorStyle}>{errors.sellerFinancing}</div>}
            </div>

            {sellerFinancing === 'Yes' && (
              <>
                <div style={rowStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle(true)}>Seller Finance Loan Amount</label>
                    <input
                      type="number"
                      value={sellerFinanceLoanAmount}
                      onChange={(e) => setSellerFinanceLoanAmount(e.target.value)}
                      placeholder="Amount seller will carry"
                      style={inputStyle}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle(true)}>Down Payment Required</label>
                    <input
                      type="number"
                      value={sellerFinanceDownPayment}
                      onChange={(e) => setSellerFinanceDownPayment(e.target.value)}
                      placeholder="Down payment amount"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={rowStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle(true)}>Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sellerFinanceInterestRate}
                      onChange={(e) => setSellerFinanceInterestRate(e.target.value)}
                      placeholder="e.g., 6.5"
                      style={inputStyle}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle(true)}>Amortization (years)</label>
                    <input
                      type="number"
                      value={sellerFinanceAmortization}
                      onChange={(e) => setSellerFinanceAmortization(e.target.value)}
                      placeholder="e.g., 30"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle(true)}>Balloon Term (years)</label>
                  <input
                    type="number"
                    value={sellerFinanceBalloonTerm}
                    onChange={(e) => setSellerFinanceBalloonTerm(e.target.value)}
                    placeholder="e.g., 5"
                    style={inputStyle}
                  />
                </div>
                {sellerFinanceLoanAmount && sellerFinanceInterestRate && sellerFinanceAmortization && (
                  <div style={{padding: '16px', background: '#e8f5e9', borderRadius: '8px', marginTop: '16px', marginBottom: '16px'}}>
                    <h4 style={{margin: '0 0 8px', fontSize: '16px', fontWeight: '700'}}>Estimated Monthly Payment</h4>
                    <p style={{margin: 0, fontSize: '28px', fontWeight: '800', color: '#2e7d32'}}>
                      ${(() => {
                        const P = parseFloat(sellerFinanceLoanAmount);
                        const r = parseFloat(sellerFinanceInterestRate) / 100 / 12;
                        const n = parseFloat(sellerFinanceAmortization) * 12;
                        const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                        return payment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                      })()}/mo
                    </p>
                  </div>
                )}
              </>
            )}

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Assumable Loan Available?<span style={requiredStyle}>*</span>
              </label>
              <select
                value={assumableLoan}
                onChange={(e) => setAssumableLoan(e.target.value)}
                style={selectStyle}
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.assumableLoan && <div style={errorStyle}>{errors.assumableLoan}</div>}
            </div>

            {assumableLoan === 'Yes' && (
              <>
                <div style={rowStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle(true)}>Current Loan Balance</label>
                    <input
                      type="number"
                      value={assumableLoanBalance}
                      onChange={(e) => setAssumableLoanBalance(e.target.value)}
                      placeholder="Remaining balance"
                      style={inputStyle}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle(true)}>Monthly Payment</label>
                    <input
                      type="number"
                      value={assumableLoanPayment}
                      onChange={(e) => setAssumableLoanPayment(e.target.value)}
                      placeholder="Current monthly payment"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={rowStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle(true)}>Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={assumableLoanInterestRate}
                      onChange={(e) => setAssumableLoanInterestRate(e.target.value)}
                      placeholder="e.g., 4.5"
                      style={inputStyle}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle(true)}>Loan Type</label>
                    <input
                      type="text"
                      value={assumableLoanType}
                      onChange={(e) => setAssumableLoanType(e.target.value)}
                      placeholder="e.g., Conventional, FHA, VA"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle(true)}>Loan Maturity Date</label>
                  <input
                    type="text"
                    value={assumableLoanMaturity}
                    onChange={(e) => setAssumableLoanMaturity(e.target.value)}
                    placeholder="e.g., 2035 or 15 years remaining"
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            <div style={{
              background:'#f9f9f9',
              border:'1px solid #ddd',
              borderRadius:'8px',
              padding:'20px',
              marginTop:'32px'
            }}>
              <div style={{fontSize:'14px',color:'#666',lineHeight:'1.6'}}>
                <strong>Why this matters:</strong> Investors on Apartment Blocks are looking for creative deals. 
                Properties with seller financing or assumable loans get 3x more views.
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 style={titleStyle}>Contact Information</h2>
            <p style={subtitleStyle}>How should buyers reach you?</p>

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Seller / Broker Name<span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="John Smith"
                style={inputStyle}
              />
              {errors.contactName && <div style={errorStyle}>{errors.contactName}</div>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Phone Number<span style={requiredStyle}>*</span>
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="(404) 555-1234"
                style={inputStyle}
              />
              {errors.contactPhone && <div style={errorStyle}>{errors.contactPhone}</div>}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle(true)}>
                Email<span style={requiredStyle}>*</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="john@example.com"
                style={inputStyle}
              />
              {errors.contactEmail && <div style={errorStyle}>{errors.contactEmail}</div>}
              <div style={{fontSize:'12px',color:'#666',marginTop:'4px'}}>
                At least one contact method (phone or email) is required
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <h2 style={titleStyle}>Property Photos</h2>
            <p style={subtitleStyle}>Upload at least 2 photos (required)</p>

            <div style={fieldStyle}>
              <input
                type="file"
                id="photoUpload"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{display:'none'}}
              />
              <label
                htmlFor="photoUpload"
                style={{
                  ...uploadContainerStyle,
                  opacity: uploadingPhoto ? 0.5 : 1
                }}
              >
                <div style={{fontSize:'48px',marginBottom:'16px'}}>📷</div>
                <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'8px'}}>
                  {uploadingPhoto ? 'Uploading...' : 'Click to upload photos'}
                </div>
                <div style={{fontSize:'14px',color:'#666'}}>
                  PNG, JPG up to 10MB each
                </div>
              </label>
              {errors.photos && <div style={errorStyle}>{errors.photos}</div>}
            </div>

            {photos.length > 0 && (
              <div>
                <h3 style={{fontSize:'18px',fontWeight:'700',margin:'24px 0 16px',color:'#000'}}>
                  Uploaded Photos ({photos.length})
                </h3>
                <div style={imageGridStyle}>
                  {photos.map((url, index) => (
                    <div key={index} style={imagePreviewStyle}>
                      {index === coverPhotoIndex && (
                        <div style={coverBadgeStyle}>COVER</div>
                      )}
                      <img src={url} alt={`Property ${index + 1}`} style={imageStyle} />
                      <button
                        onClick={() => removePhoto(index)}
                        style={removeButtonStyle}
                      >
                        ×
                      </button>
                      {index !== coverPhotoIndex && (
                        <button
                          onClick={() => setCoverPhotoIndex(index)}
                          style={setCoverButtonStyle}
                        >
                          Set as Cover
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 style={{fontSize:'18px',fontWeight:'700',margin:'32px 0 16px',color:'#000'}}>
              Documents (Optional)
            </h3>
            <p style={{fontSize:'14px',color:'#666',margin:'0 0 16px'}}>
              Upload rent rolls, T-12, inspection reports, etc.
            </p>

            <div style={fieldStyle}>
              <input
                type="file"
                id="documentUpload"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                onChange={handleDocumentUpload}
                style={{display:'none'}}
              />
              <label
                htmlFor="documentUpload"
                style={uploadContainerStyle}
              >
                <div style={{fontSize:'48px',marginBottom:'16px'}}>📄</div>
                <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'8px'}}>
                  Click to upload documents
                </div>
                <div style={{fontSize:'14px',color:'#666'}}>
                  PDF, DOC, XLS, CSV up to 10MB each
                </div>
              </label>
            </div>

            {documents.length > 0 && (
              <div>
                <h4 style={{fontSize:'16px',fontWeight:'600',margin:'16px 0 8px',color:'#000'}}>
                  Uploaded Documents ({documents.length})
                </h4>
                {documents.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      display:'flex',
                      justifyContent:'space-between',
                      alignItems:'center',
                      padding:'12px',
                      background:'#f9f9f9',
                      borderRadius:'6px',
                      marginBottom:'8px'
                    }}
                  >
                    <span style={{fontSize:'14px',color:'#666'}}>
                      Document {index + 1}
                    </span>
                    <button
                      onClick={() => removeDocument(index)}
                      style={{
                        background:'#d00',
                        color:'#fff',
                        border:'none',
                        borderRadius:'4px',
                        padding:'6px 12px',
                        cursor:'pointer',
                        fontSize:'12px',
                        fontWeight:'600'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={wizardContainerStyle}>
        {isAdmin && (
          <div style={{padding: '24px 40px', borderBottom: '1px solid #ddd', background: '#fffbea'}}>
            <label style={{fontSize: '14px', fontWeight: '600', color: '#000', display: 'block', marginBottom: '8px'}}>
              🛡️ Admin: Post on Behalf of User
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #ffa000',
                borderRadius: '6px',
                background: '#fff'
              }}
            >
              <option value="">Select user...</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.email} {u.first_name && u.last_name ? `(${u.first_name} ${u.last_name})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div style={progressBarStyle}>
          <div style={stepStyle(currentStep === 1, currentStep > 1)}>1. Basics</div>
          <div style={stepStyle(currentStep === 2, currentStep > 2)}>2. Financials</div>
          <div style={stepStyle(currentStep === 3, currentStep > 3)}>3. Occupancy</div>
          <div style={stepStyle(currentStep === 4, currentStep > 4)}>4. Finance</div>
          <div style={stepStyle(currentStep === 5, currentStep > 5)}>5. Contact</div>
          <div style={stepStyle(currentStep === 6, currentStep > 6)}>6. Photos</div>
        </div>

        <div style={contentStyle}>
          {renderStep()}

          <div style={buttonContainerStyle}>
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              style={{
                ...buttonStyle(false),
                opacity: currentStep === 1 ? 0.5 : 1,
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Back
            </button>

            {currentStep < 6 ? (
              <button onClick={handleNext} style={buttonStyle(true)}>
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={buttonStyle(true)}
              >
                {loading ? 'Submitting...' : 'Submit Property'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
