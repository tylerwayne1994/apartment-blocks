import React, { useState, useEffect } from 'react';

export default function ValueAddCalculator({ initialUnits = 50, initialPrice = 1000000 }) {
  const [currentRent, setCurrentRent] = useState(1000);
  const [targetRent, setTargetRent] = useState(1200);
  const [units, setUnits] = useState(initialUnits);
  const [rehabPerUnit, setRehabPerUnit] = useState(5000);
  const [otherIncome, setOtherIncome] = useState(500);
  const [capRate, setCapRate] = useState(6);
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [inputsOpen, setInputsOpen] = useState(true);

  const [results, setResults] = useState({});

  useEffect(() => {
    calculate();
  }, [currentRent, targetRent, units, rehabPerUnit, otherIncome, capRate, currentPrice]);

  const calculate = () => {
    const currentAnnualIncome = currentRent * units * 12;
    const newAnnualIncome = (targetRent * units * 12) + (otherIncome * 12);
    const incomeIncrease = newAnnualIncome - currentAnnualIncome;
    const totalRehabCost = rehabPerUnit * units;
    const equityCreated = incomeIncrease / (capRate / 100);
    const roi = totalRehabCost > 0 ? (equityCreated / totalRehabCost) * 100 : 0;
    const newValue = currentPrice + equityCreated;

    setResults({
      currentAnnualIncome,
      newAnnualIncome,
      incomeIncrease,
      totalRehabCost,
      equityCreated,
      roi,
      newValue
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
    display: 'block'
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px'
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: '700' }}>Value-Add Calculator</h3>
      
      <button
        onClick={() => setInputsOpen(!inputsOpen)}
        style={{
          width: '100%',
          padding: '12px',
          background: '#f5f5f5',
          color: '#000',
          border: '1px solid #ddd',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: inputsOpen ? '24px' : '16px',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>Adjust Inputs</span>
        <span>{inputsOpen ? '▼' : '▶'}</span>
      </button>

      {inputsOpen && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div>
          <label style={labelStyle}>Current Rent per Unit (Monthly)</label>
          <input
            type="number"
            value={currentRent}
            onChange={(e) => setCurrentRent(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Target Rent After Rehab (Monthly)</label>
          <input
            type="number"
            value={targetRent}
            onChange={(e) => setTargetRent(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Number of Units</label>
          <input
            type="number"
            value={units}
            onChange={(e) => setUnits(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Rehab Cost per Unit</label>
          <input
            type="number"
            value={rehabPerUnit}
            onChange={(e) => setRehabPerUnit(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Additional Monthly Other Income</label>
          <input
            type="number"
            value={otherIncome}
            onChange={(e) => setOtherIncome(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Cap Rate for Valuation (%)</label>
          <input
            type="number"
            step="0.1"
            value={capRate}
            onChange={(e) => setCapRate(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Current Purchase Price</label>
          <input
            type="number"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>
      )}

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700' }}>Value-Add Results</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Current Annual Income</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>${results.currentAnnualIncome?.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>New Annual Income</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>${results.newAnnualIncome?.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Income Increase</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#4caf50' }}>
              ${results.incomeIncrease?.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Total Rehab Cost</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>${results.totalRehabCost?.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Equity Created</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#4caf50' }}>
              ${results.equityCreated?.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>ROI on Rehab</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: results.roi >= 100 ? '#4caf50' : '#ff9800' }}>
              {results.roi?.toFixed(1)}%
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>New Estimated Value</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#2196f3' }}>
              ${results.newValue?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
