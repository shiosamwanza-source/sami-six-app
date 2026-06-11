-- ===================================================================
-- SAMI SIX APP - SUPABASE DATABASE SCHEMA (POSTGRESQL)
-- ===================================================================

-- 1. ENUMS (Mifumo ya Kudhibiti Hali za Oda na Malipo)
CREATE TYPE order_phase AS ENUM ('A', 'B', 'C', 'D');
CREATE TYPE order_status AS ENUM (
    'REQUEST_SUBMITTED', 
    'SOURCING', 
    'QUOTE_READY', 
    'DEPOSIT_PENDING', 
    'APPROVE_REQUIRED', 
    'AT_SEA', 
    'CLEARING', 
    'ARRIVAL_NOTIFIED', 
    'FINAL_PAYMENT_PENDING', 
    'RELEASE_READY', 
    'DELIVERED'
);
CREATE TYPE user_role AS ENUM ('buyer', 'supplier', 'warehouse_staff', 'clearing_agent', 'driver', 'admin');

-- 2. USERS TABLE (Inaunganishwa na Supabase Auth)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'buyer'::user_role,
    market_location TEXT, -- mf. Kariakoo, Ilala, Lusaka
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. ORDERS TABLE (Moyo wa Mfumo - Inasimamia hatua 11)
CREATE TABLE orders (
    id TEXT PRIMARY KEY DEFAULT 'SSA-' || upper(substring(md5(random()::text) from 1 for 6)),
    buyer_id UUID REFERENCES profiles(id) NOT NULL,
    item_description TEXT NOT NULL,
    source_country TEXT NOT NULL, -- China, Dubai, Turkey
    current_phase order_phase DEFAULT 'A'::order_phase NOT NULL,
    current_step INT DEFAULT 1 NOT NULL,
    status order_status DEFAULT 'REQUEST_SUBMITTED'::order_status NOT NULL,
    
    -- FINANCIAL ZONE 1 (Pay Now)
    product_cost_usd NUMERIC(12, 2) DEFAULT 0.00,
    deposit_receipt_url TEXT,
    deposit_verified BOOLEAN DEFAULT FALSE,
    
    -- FINANCIAL ZONE 2 (Financed - Due on Arrival)
    freight_cost_usd NUMERIC(12, 2) DEFAULT 0.00,
    tra_duty_usd NUMERIC(12, 2) DEFAULT 0.00,
    vat_usd NUMERIC(12, 2) DEFAULT 0.00,
    port_charges_usd NUMERIC(12, 2) DEFAULT 0.00,
    delivery_cost_usd NUMERIC(12, 2) DEFAULT 0.00,
    
    final_invoice_url TEXT,
    final_payment_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. WAREHOUSE LOGS (Kwa ajili ya Step 6 - Barcode & Photos/Video)
CREATE TABLE warehouse_verification (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    verified_by UUID REFERENCES profiles(id) NOT NULL,
    barcode TEXT UNIQUE NOT NULL,
    weight_kg NUMERIC(6, 2) NOT NULL,
    cbm NUMERIC(5, 2) NOT NULL,
    photo_url_1 TEXT NOT NULL,
    photo_url_2 TEXT NOT NULL,
    validation_video_url TEXT NOT NULL,
    buyer_approved BOOLEAN DEFAULT FALSE,
    buyer_decision_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. IoT GPS TRACKING (Kwa ajili ya malori ya FAW kwenda DRC/Zambia)
CREATE TABLE transit_tracking (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES profiles(id),
    truck_plate_no TEXT NOT NULL,
    current_latitude NUMERIC(10, 7) NOT NULL,
    current_longitude NUMERIC(10, 7) NOT NULL,
    current_speed_kmh INT DEFAULT 0,
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    border_status TEXT -- mf. "Approaching Nakonde", "Arrived Lubumbashi"
);

-- ===================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ===================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE transit_tracking ENABLE ROW LEVEL SECURITY;

-- Sheria ya Profiles: Kila mtu anaona profile yake, Admin anaona zote
CREATE POLICY "Users can view own profile" ON profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles 
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Sheria ya Orders: Mnunuzi anaona oda zake tu, mawakala na admin wanaona zote kulingana na kazi yao
CREATE POLICY "Buyers can view own orders" ON orders 
    FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Buyers can insert requests" ON orders 
    FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Staff and Admins can manage all orders" ON orders 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'warehouse_staff', 'clearing_agent')
        )
    );
