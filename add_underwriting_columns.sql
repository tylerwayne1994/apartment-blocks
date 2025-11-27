-- Add missing columns for comprehensive underwriting analysis
-- Run this in Supabase SQL Editor

-- Financial fields
ALTER TABLE properties ADD COLUMN IF NOT EXISTS financing_type TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS down_payment_percent NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS term_years INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS loan_amount NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS monthly_payment NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS amortization_years INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS interest_rate NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS annual_debt_service NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS realtor_fees_percent NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS closing_costs_percent NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS acquisition_fees_percent NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS rehab_cost NUMERIC;

-- Expense breakdown fields
ALTER TABLE properties ADD COLUMN IF NOT EXISTS vacancy_rate_percent NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_management_percent NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS capex_percent NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS repairs_maintenance NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS management_fees NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS payroll NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS other_expenses NUMERIC;

-- Monthly utilities
ALTER TABLE properties ADD COLUMN IF NOT EXISTS monthly_gas NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS monthly_electrical NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS monthly_water NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS monthly_sewer NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS monthly_trash NUMERIC;

-- Proforma rents (JSON array)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS proforma_rents JSONB;

-- Add comments for documentation
COMMENT ON COLUMN properties.financing_type IS 'Traditional, Cash, Seller Finance, or Assumable';
COMMENT ON COLUMN properties.down_payment_percent IS 'Down payment as percentage of purchase price';
COMMENT ON COLUMN properties.term_years IS 'Loan term in years';
COMMENT ON COLUMN properties.loan_amount IS 'Total loan amount';
COMMENT ON COLUMN properties.monthly_payment IS 'Monthly loan payment (principal + interest)';
COMMENT ON COLUMN properties.amortization_years IS 'Loan amortization period in years';
COMMENT ON COLUMN properties.interest_rate IS 'Loan interest rate as percentage';
COMMENT ON COLUMN properties.annual_debt_service IS 'Total annual debt service';
COMMENT ON COLUMN properties.realtor_fees_percent IS 'Realtor/broker fees as percentage';
COMMENT ON COLUMN properties.closing_costs_percent IS 'Closing costs as percentage of purchase price';
COMMENT ON COLUMN properties.acquisition_fees_percent IS 'Acquisition/disposition fees as percentage';
COMMENT ON COLUMN properties.rehab_cost IS 'Total rehabilitation/renovation cost';
COMMENT ON COLUMN properties.vacancy_rate_percent IS 'Expected vacancy rate as percentage';
COMMENT ON COLUMN properties.property_management_percent IS 'Property management fee as percentage of gross income';
COMMENT ON COLUMN properties.capex_percent IS 'Capital expenditures as percentage of gross income';
COMMENT ON COLUMN properties.repairs_maintenance IS 'Annual repairs and maintenance costs';
COMMENT ON COLUMN properties.management_fees IS 'Annual property management fees (fixed amount)';
COMMENT ON COLUMN properties.payroll IS 'Annual payroll expenses';
COMMENT ON COLUMN properties.other_expenses IS 'Other miscellaneous annual expenses';
COMMENT ON COLUMN properties.monthly_gas IS 'Monthly gas utility cost';
COMMENT ON COLUMN properties.monthly_electrical IS 'Monthly electrical utility cost';
COMMENT ON COLUMN properties.monthly_water IS 'Monthly water utility cost';
COMMENT ON COLUMN properties.monthly_sewer IS 'Monthly sewer utility cost';
COMMENT ON COLUMN properties.monthly_trash IS 'Monthly trash/waste utility cost';
COMMENT ON COLUMN properties.proforma_rents IS 'Array of unit types with proforma rents: [{type, units, rent}]';
