import React, { useState, useEffect } from 'react';

export default function StressTestCalculator({ initialPrice = 1000000, initialNOI = 100000 }) {
  const [purchasePrice, setPurchasePrice] = useState(initialPrice);
  const [noi, setNoi] = useState(initialNOI);
  const [interestRate, setInterestRate] = useState(6.5);
  const [opex, setOpex] = useState(50000);
  const [capex, setCapex] = useState(10000);
  const [vacancy, setVacancy] = useState(5);
  const [ltv, setLtv] = useState(75);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [inputsOpen, setInputsOpen] = useState(true);

  const [results, setResults] = useState({});

  useEffect(() => {
    calculate();
  }, [purchasePrice, noi, interestRate, opex, capex, vacancy, ltv]);

  const calculate = () => {
    const loanAmount = purchasePrice * (ltv / 100);
    const equity = purchasePrice - loanAmount;
    const effectiveNOI = noi * (1 - vacancy / 100);
    const totalExpenses = opex + capex;
    
    const monthlyRate = interestRate / 100 / 12;
    const n = 25 * 12;
    const monthlyDebt = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const annualDebt = monthlyDebt * 12;
    
    const dscr = annualDebt > 0 ? effectiveNOI / annualDebt : 0;
    const annualCashFlow = effectiveNOI - totalExpenses - annualDebt;
    const monthlyCashFlow = annualCashFlow / 12;
    const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;

    setResults({
      loanAmount,
      equity,
      effectiveNOI,
      annualDebt,
      dscr,
      annualCashFlow,
      monthlyCashFlow,
      capRate
    });
  };

  const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: '#ddd',
    outline: 'none',
    cursor: 'pointer'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between'
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
      <h3 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: '700' }}>Stress Test Calculator</h3>
      
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
          <div style={labelStyle}>
            <span>Purchase Price</span>
            <span>${purchasePrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="100000"
            max="5000000"
            step="10000"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            style={sliderStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>
            <span>NOI (Annual)</span>
            <span>${noi.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="5000"
            value={noi}
            onChange={(e) => setNoi(Number(e.target.value))}
            style={sliderStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>
            <span>Interest Rate</span>
            <span>{interestRate.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            style={sliderStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>
            <span>Operating Expenses</span>
            <span>${opex.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="5000"
            value={opex}
            onChange={(e) => setOpex(Number(e.target.value))}
            style={sliderStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>
            <span>CapEx Reserve</span>
            <span>${capex.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="250000"
            step="5000"
            value={capex}
            onChange={(e) => setCapex(Number(e.target.value))}
            style={sliderStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>
            <span>Vacancy Rate</span>
            <span>{vacancy.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="0.5"
            value={vacancy}
            onChange={(e) => setVacancy(Number(e.target.value))}
            style={sliderStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>
            <span>Loan-to-Value (LTV)</span>
            <span>{ltv}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="85"
            step="1"
            value={ltv}
            onChange={(e) => setLtv(Number(e.target.value))}
            style={sliderStyle}
          />
        </div>
      </div>
      )}

      <button
        onClick={() => setResultsOpen(!resultsOpen)}
        style={{
          width: '100%',
          padding: '12px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: resultsOpen ? '24px' : '0'
        }}
      >
        {resultsOpen ? '▼' : '▶'} Stress Test Results
      </button>

      {resultsOpen && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Loan Amount</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>${results.loanAmount?.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Equity Required</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>${results.equity?.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Effective NOI</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>${results.effectiveNOI?.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Annual Debt Service</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>${results.annualDebt?.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>DSCR</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: results.dscr >= 1.25 ? '#4caf50' : '#f44336' }}>
              {results.dscr?.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Annual Cash Flow</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: results.annualCashFlow >= 0 ? '#4caf50' : '#f44336' }}>
              ${results.annualCashFlow?.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Monthly Cash Flow</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: results.monthlyCashFlow >= 0 ? '#4caf50' : '#f44336' }}>
              ${results.monthlyCashFlow?.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Cap Rate</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>{results.capRate?.toFixed(2)}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
