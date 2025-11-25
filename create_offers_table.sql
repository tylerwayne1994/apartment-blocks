-- Create offers table to store LOI submissions
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL,
  
  -- Deal snapshot
  purchase_price DECIMAL(15,2),
  units INTEGER,
  current_noi DECIMAL(15,2),
  closing_timeline INTEGER,
  dd_period INTEGER,
  earnest_money DECIMAL(15,2),
  earnest_type TEXT,
  
  -- Strategy
  strategy TEXT,
  
  -- Full LOI text
  loi_text TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Buyers can insert their own offers
CREATE POLICY "Users can insert own offers"
  ON offers FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Buyers can view their own offers
CREATE POLICY "Buyers can view own offers"
  ON offers FOR SELECT
  USING (auth.uid() = buyer_id);

-- Sellers can view offers on their properties
CREATE POLICY "Sellers can view offers on their properties"
  ON offers FOR SELECT
  USING (auth.uid() = seller_id);

-- Sellers can update status on their offers
CREATE POLICY "Sellers can update offer status"
  ON offers FOR UPDATE
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Create index for performance
CREATE INDEX idx_offers_property_id ON offers(property_id);
CREATE INDEX idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX idx_offers_seller_id ON offers(seller_id);
