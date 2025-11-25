import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { isAdmin } from '../utils/authHelpers';

const CLOUDINARY_CLOUD_NAME = 'dzcix6zs4';
const CLOUDINARY_UPLOAD_PRESET = 'Apartment_blocks';

const containerStyle = {
  minHeight: 'calc(100vh - 60px)',
  background: '#f5f7fa',
  padding: '40px 20px'
};

const formContainerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  padding: '40px'
};

const titleStyle = {
  fontSize: '32px',
  fontWeight: '800',
  margin: '0 0 8px',
  color: '#000'
};

const sectionTitleStyle = {
  fontSize: '24px',
  fontWeight: '700',
  margin: '32px 0 16px',
  color: '#000',
  borderBottom: '2px solid #000',
  paddingBottom: '8px'
};

const fieldStyle = {
  marginBottom: '24px'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#000',
  display: 'block',
  marginBottom: '8px'
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
  gap: '16px',
  marginTop: '40px',
  paddingTop: '24px',
  borderTop: '1px solid #ddd'
};

const buttonStyle = (variant) => ({
  flex: 1,
  padding: '14px 32px',
  fontSize: '16px',
  fontWeight: '700',
  background: variant === 'primary' ? '#000' : variant === 'danger' ? '#d00' : '#fff',
  color: variant === 'primary' || variant === 'danger' ? '#fff' : '#666',
  border: variant === 'primary' || variant === 'danger' ? 'none' : '1px solid #ddd',
  borderRadius: '8px',
  cursor: 'pointer'
});

const uploadContainerStyle = {
  border: '2px dashed #ddd',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center',
  background: '#fafafa',
  cursor: 'pointer'
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

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // All form fields
  const [propertyTitle, setPropertyTitle] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [county, setCounty] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [units, setUnits] = useState('');
  const [buildingClass, setBuildingClass] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [sqft, setSqft] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [currentRentPerUnit, setCurrentRentPerUnit] = useState('');
  const [marketRentPerUnit, setMarketRentPerUnit] = useState('');
  const [proFormaRent, setProFormaRent] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [annualTaxes, setAnnualTaxes] = useState('');
  const [annualInsurance, setAnnualInsurance] = useState('');
  const [opex, setOpex] = useState('');
  const [utilitiesPaidBy, setUtilitiesPaidBy] = useState('');
  const [occupancyPercent, setOccupancyPercent] = useState('');
  const [bed1Count, setBed1Count] = useState('');
  const [bed2Count, setBed2Count] = useState('');
  const [bed3Count, setBed3Count] = useState('');
  const [bed4Count, setBed4Count] = useState('');
  const [vacancyCount, setVacancyCount] = useState('');
  const [renovatedCount, setRenovatedCount] = useState('');
  const [valueAddPossible, setValueAddPossible] = useState('');
  const [rehabPerUnit, setRehabPerUnit] = useState('');
  const [totalRehab, setTotalRehab] = useState('');
  const [sellerFinancing, setSellerFinancing] = useState('');
  const [sellerFinanceLoanAmount, setSellerFinanceLoanAmount] = useState('');
  const [sellerFinanceDownPayment, setSellerFinanceDownPayment] = useState('');
  const [sellerFinanceInterestRate, setSellerFinanceInterestRate] = useState('');
  const [sellerFinanceAmortization, setSellerFinanceAmortization] = useState('');
  const [sellerFinanceBalloonTerm, setSellerFinanceBalloonTerm] = useState('');
  const [assumableLoan, setAssumableLoan] = useState('');
  const [assumableLoanBalance, setAssumableLoanBalance] = useState('');
  const [assumableLoanPayment, setAssumableLoanPayment] = useState('');
  const [assumableLoanInterestRate, setAssumableLoanInterestRate] = useState('');
  const [assumableLoanType, setAssumableLoanType] = useState('');
  const [assumableLoanMaturity, setAssumableLoanMaturity] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [photos, setPhotos] = useState([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    checkAuthAndLoadProperty();
  }, [id]);

  const checkAuthAndLoadProperty = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in');
      navigate('/login');
      return;
    }

    await loadProperty(user.id);
  };

  const loadProperty = async (userId) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      alert('Failed to load property: ' + error.message);
      navigate('/dashboard');
      return;
    }

    const userIsAdmin = await isAdmin();
    const isOwner = data.user_id === userId;

    if (!userIsAdmin && !isOwner) {
      alert('You do not have permission to edit this property');
      navigate('/dashboard');
      return;
    }

    // Populate ALL fields
    setPropertyTitle(data.title || '');
    setAddress(data.address || '');
    setCity(data.city || '');
    setState(data.state || '');
    setZip(data.zip || '');
    setCounty(data.county || '');
    setPropertyType(data.property_type || '');
    setUnits(data.units?.toString() || '');
    setBuildingClass(data.building_class || '');
    setYearBuilt(data.year_built?.toString() || '');
    setSqft(data.sqft?.toString() || '');
    setLotSize(data.lot_size?.toString() || '');
    setAskingPrice(data.price?.toString() || '');
    setMonthlyRent(data.monthly_rent?.toString() || '');
    setCurrentRentPerUnit(data.current_rent_per_unit?.toString() || '');
    setMarketRentPerUnit(data.market_rent_per_unit?.toString() || '');
    setProFormaRent(data.pro_forma_rent?.toString() || '');
    setOtherIncome(data.other_income?.toString() || '');
    setAnnualTaxes(data.annual_taxes?.toString() || '');
    setAnnualInsurance(data.annual_insurance?.toString() || '');
    setOpex(data.annual_opex?.toString() || '');
    setUtilitiesPaidBy(data.utilities_paid_by || '');
    setOccupancyPercent(data.occupancy_percent?.toString() || '');
    setBed1Count(data.bed_1_count?.toString() || '');
    setBed2Count(data.bed_2_count?.toString() || '');
    setBed3Count(data.bed_3_count?.toString() || '');
    setBed4Count(data.bed_4_count?.toString() || '');
    setVacancyCount(data.vacancy_count?.toString() || '');
    setRenovatedCount(data.renovated_count?.toString() || '');
    setValueAddPossible(data.value_add_possible ? 'Yes' : 'No');
    setRehabPerUnit(data.rehab_per_unit?.toString() || '');
    setTotalRehab(data.total_rehab_budget?.toString() || '');
    setSellerFinancing(data.seller_financing_available ? 'Yes' : 'No');
    setSellerFinanceLoanAmount(data.seller_finance_loan_amount?.toString() || '');
    setSellerFinanceDownPayment(data.seller_finance_down_payment?.toString() || '');
    setSellerFinanceInterestRate(data.seller_finance_interest_rate?.toString() || '');
    setSellerFinanceAmortization(data.seller_finance_amortization?.toString() || '');
    setSellerFinanceBalloonTerm(data.seller_finance_balloon_term?.toString() || '');
    setAssumableLoan(data.assumable_loan ? 'Yes' : 'No');
    setAssumableLoanBalance(data.assumable_loan_balance?.toString() || '');
    setAssumableLoanPayment(data.assumable_loan_payment?.toString() || '');
    setAssumableLoanInterestRate(data.assumable_loan_interest_rate?.toString() || '');
    setAssumableLoanType(data.assumable_loan_type || '');
    setAssumableLoanMaturity(data.assumable_loan_maturity || '');
    setContactName(data.contact_name || '');
    setContactPhone(data.contact_phone || '');
    setContactEmail(data.contact_email || '');
    setPhotos(data.images || []);
    setDocuments(data.documents || []);
    
    // Find cover photo index
    if (data.images && data.cover_image) {
      const coverIndex = data.images.indexOf(data.cover_image);
      if (coverIndex >= 0) setCoverPhotoIndex(coverIndex);
    }

    setLoading(false);
  };

  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    
    // For PDFs, use image endpoint with format detection
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

  const handleSave = async () => {
    setSaving(true);

    try {
      const propertyData = {
        title: propertyTitle,
        address: address,
        city: city,
        state: state,
        zip: zip,
        county: county || null,
        property_type: propertyType,
        units: parseInt(units) || null,
        building_class: buildingClass || null,
        year_built: yearBuilt ? parseInt(yearBuilt) : null,
        sqft: sqft ? parseInt(sqft) : null,
        lot_size: lotSize ? parseFloat(lotSize) : null,
        price: parseFloat(askingPrice) || null,
        monthly_rent: monthlyRent ? parseFloat(monthlyRent) : null,
        current_rent_per_unit: currentRentPerUnit ? parseFloat(currentRentPerUnit) : null,
        market_rent_per_unit: marketRentPerUnit ? parseFloat(marketRentPerUnit) : null,
        pro_forma_rent: proFormaRent ? parseFloat(proFormaRent) : null,
        other_income: otherIncome ? parseFloat(otherIncome) : null,
        annual_taxes: parseFloat(annualTaxes) || null,
        annual_insurance: parseFloat(annualInsurance) || null,
        annual_opex: opex ? parseFloat(opex) : null,
        utilities_paid_by: utilitiesPaidBy || null,
        occupancy_percent: occupancyPercent ? parseFloat(occupancyPercent) : null,
        bed_1_count: bed1Count ? parseInt(bed1Count) : null,
        bed_2_count: bed2Count ? parseInt(bed2Count) : null,
        bed_3_count: bed3Count ? parseInt(bed3Count) : null,
        bed_4_count: bed4Count ? parseInt(bed4Count) : null,
        vacancy_count: vacancyCount ? parseInt(vacancyCount) : null,
        renovated_count: renovatedCount ? parseInt(renovatedCount) : null,
        value_add_possible: valueAddPossible === 'Yes',
        rehab_per_unit: rehabPerUnit ? parseFloat(rehabPerUnit) : null,
        total_rehab_budget: totalRehab ? parseFloat(totalRehab) : null,
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
        contact_name: contactName || null,
        contact_phone: contactPhone || null,
        contact_email: contactEmail || null,
        images: photos,
        cover_image: photos[coverPhotoIndex] || photos[0] || null,
        documents: documents
      };

      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id);

      if (error) throw error;

      alert('Property updated successfully!');
      navigate(`/property/${id}`);
    } catch (error) {
      alert('Failed to update property: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Property deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to delete property: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{textAlign: 'center', padding: '40px'}}>
          <p>Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Edit Property</h1>
        <p style={{fontSize: '14px', color: '#666', margin: '0 0 32px'}}>
          Update any information below
        </p>

        {/* Property Basics */}
        <h2 style={sectionTitleStyle}>Property Basics</h2>
        
        <div style={fieldStyle}>
          <label style={labelStyle}>Property Title</label>
          <input
            type="text"
            value={propertyTitle}
            onChange={(e) => setPropertyTitle(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={inputStyle}
              maxLength="2"
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>ZIP Code</label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>County</label>
            <input
              type="text"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Property Type</label>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} style={selectStyle}>
              <option value="">Select...</option>
              <option value="Multifamily">Multifamily</option>
              <option value="Mixed-Use">Mixed-Use</option>
              <option value="SFR Portfolio">SFR Portfolio</option>
              <option value="Apartment Complex">Apartment Complex</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Unit Count</label>
            <input
              type="number"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Building Class</label>
            <select value={buildingClass} onChange={(e) => setBuildingClass(e.target.value)} style={selectStyle}>
              <option value="">Select...</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Year Built</label>
            <input
              type="number"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Total Sq Ft</label>
            <input
              type="number"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Lot Size (acres)</label>
            <input
              type="number"
              step="0.1"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Financial Info */}
        <h2 style={sectionTitleStyle}>Financial Information</h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>Asking Price</label>
          <input
            type="number"
            value={askingPrice}
            onChange={(e) => setAskingPrice(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Current Monthly Rent Total</label>
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Current Rent Per Unit</label>
            <input
              type="number"
              value={currentRentPerUnit}
              onChange={(e) => setCurrentRentPerUnit(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Market Rent Per Unit</label>
            <input
              type="number"
              value={marketRentPerUnit}
              onChange={(e) => setMarketRentPerUnit(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Pro Forma Monthly Rent</label>
            <input
              type="number"
              value={proFormaRent}
              onChange={(e) => setProFormaRent(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Other Monthly Income</label>
            <input
              type="number"
              value={otherIncome}
              onChange={(e) => setOtherIncome(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Annual Taxes</label>
            <input
              type="number"
              value={annualTaxes}
              onChange={(e) => setAnnualTaxes(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Annual Insurance</label>
            <input
              type="number"
              value={annualInsurance}
              onChange={(e) => setAnnualInsurance(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Annual Operating Expenses</label>
          <input
            type="number"
            value={opex}
            onChange={(e) => setOpex(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Utilities Paid By</label>
          <select value={utilitiesPaidBy} onChange={(e) => setUtilitiesPaidBy(e.target.value)} style={selectStyle}>
            <option value="">Select...</option>
            <option value="Owner pays all">Owner pays all</option>
            <option value="Tenants pay some">Tenants pay some</option>
            <option value="Tenants pay all">Tenants pay all</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        {/* Occupancy */}
        <h2 style={sectionTitleStyle}>Occupancy & Unit Mix</h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>Current Occupancy %</label>
          <input
            type="number"
            value={occupancyPercent}
            onChange={(e) => setOccupancyPercent(e.target.value)}
            style={inputStyle}
            min="0"
            max="100"
          />
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>1 Bed Units</label>
            <input
              type="number"
              value={bed1Count}
              onChange={(e) => setBed1Count(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>2 Bed Units</label>
            <input
              type="number"
              value={bed2Count}
              onChange={(e) => setBed2Count(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>3 Bed Units</label>
            <input
              type="number"
              value={bed3Count}
              onChange={(e) => setBed3Count(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>4+ Bed Units</label>
            <input
              type="number"
              value={bed4Count}
              onChange={(e) => setBed4Count(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Vacant Units</label>
            <input
              type="number"
              value={vacancyCount}
              onChange={(e) => setVacancyCount(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Renovated Units</label>
            <input
              type="number"
              value={renovatedCount}
              onChange={(e) => setRenovatedCount(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Value Add */}
        <h2 style={sectionTitleStyle}>Value Add Opportunity</h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>Value Add Possible?</label>
          <select value={valueAddPossible} onChange={(e) => setValueAddPossible(e.target.value)} style={selectStyle}>
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Rehab Cost Per Unit</label>
            <input
              type="number"
              value={rehabPerUnit}
              onChange={(e) => setRehabPerUnit(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Total Rehab Budget</label>
            <input
              type="number"
              value={totalRehab}
              onChange={(e) => setTotalRehab(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Creative Finance */}
        <h2 style={sectionTitleStyle}>Creative Finance</h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>Seller Financing Available?</label>
          <select value={sellerFinancing} onChange={(e) => setSellerFinancing(e.target.value)} style={selectStyle}>
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {sellerFinancing === 'Yes' && (
          <>
            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Loan Amount</label>
                <input
                  type="number"
                  value={sellerFinanceLoanAmount}
                  onChange={(e) => setSellerFinanceLoanAmount(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Down Payment</label>
                <input
                  type="number"
                  value={sellerFinanceDownPayment}
                  onChange={(e) => setSellerFinanceDownPayment(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sellerFinanceInterestRate}
                  onChange={(e) => setSellerFinanceInterestRate(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Amortization (years)</label>
                <input
                  type="number"
                  value={sellerFinanceAmortization}
                  onChange={(e) => setSellerFinanceAmortization(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Balloon Term (years)</label>
              <input
                type="number"
                value={sellerFinanceBalloonTerm}
                onChange={(e) => setSellerFinanceBalloonTerm(e.target.value)}
                style={inputStyle}
              />
            </div>
          </>
        )}

        <div style={fieldStyle}>
          <label style={labelStyle}>Assumable Loan?</label>
          <select value={assumableLoan} onChange={(e) => setAssumableLoan(e.target.value)} style={selectStyle}>
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {assumableLoan === 'Yes' && (
          <>
            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Loan Balance</label>
                <input
                  type="number"
                  value={assumableLoanBalance}
                  onChange={(e) => setAssumableLoanBalance(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Monthly Payment</label>
                <input
                  type="number"
                  value={assumableLoanPayment}
                  onChange={(e) => setAssumableLoanPayment(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={rowStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={assumableLoanInterestRate}
                  onChange={(e) => setAssumableLoanInterestRate(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Loan Type</label>
                <input
                  type="text"
                  value={assumableLoanType}
                  onChange={(e) => setAssumableLoanType(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Maturity Date</label>
              <input
                type="text"
                value={assumableLoanMaturity}
                onChange={(e) => setAssumableLoanMaturity(e.target.value)}
                style={inputStyle}
              />
            </div>
          </>
        )}

        {/* Contact Info */}
        <h2 style={sectionTitleStyle}>Contact Information</h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>Contact Name</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Phone</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Photos */}
        <h2 style={sectionTitleStyle}>Photos</h2>

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
              {uploadingPhoto ? 'Uploading...' : 'Click to add more photos'}
            </div>
            <div style={{fontSize:'14px',color:'#666'}}>
              PNG, JPG up to 10MB each
            </div>
          </label>
        </div>

        {photos.length > 0 && (
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
        )}

        {/* Documents */}
        <h2 style={sectionTitleStyle}>Documents</h2>

        <div style={fieldStyle}>
          <input
            type="file"
            id="documentUpload"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
            onChange={handleDocumentUpload}
            style={{display:'none'}}
          />
          <label htmlFor="documentUpload" style={uploadContainerStyle}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>📄</div>
            <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'8px'}}>
              Click to add documents
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

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            onClick={() => navigate(`/property/${id}`)}
            style={buttonStyle('secondary')}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            style={buttonStyle('danger')}
          >
            Delete Property
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={buttonStyle('primary')}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
