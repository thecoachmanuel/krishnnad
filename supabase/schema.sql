-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- HELPERS
-- ==========================================
-- This function breaks infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION check_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM profiles
    WHERE id = auth.uid()
  );
END;
$$;

-- This function automatically creates a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'customer' -- Hardcoded to prevent role injection
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Protection function to prevent non-admins from changing roles
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger AS $$
BEGIN
  -- If role is being changed
  IF (NEW.role IS DISTINCT FROM OLD.role) THEN
    -- Check if the actual performer (not the definer) is an admin
    -- Note: check_is_admin() uses auth.uid() which is standard for RLS
    IF NOT public.check_is_admin() THEN
      -- Revert the role change to the old value
      NEW.role = OLD.role;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- PROFILES (Users/Buyers and Admin)
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Link to Supabase Auth table
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public to read basic info if needed? No, keep profiles private.
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin has full access to profiles" ON profiles;
CREATE POLICY "Admin has full access to profiles" ON profiles
  FOR ALL USING (check_is_admin());

-- ==========================================
-- BREEDS 
-- ==========================================
CREATE TABLE IF NOT EXISTS breeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  origin TEXT,
  temperament TEXT,
  size_category TEXT CHECK (size_category IN ('small', 'medium', 'large')),
  life_expectancy TEXT,
  description TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for breeds" ON breeds;
CREATE POLICY "Public read access for breeds" ON breeds
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write access for breeds" ON breeds;
CREATE POLICY "Admin write access for breeds" ON breeds
  FOR ALL USING (check_is_admin());


-- ==========================================
-- DOGS
-- ==========================================
CREATE TABLE IF NOT EXISTS dogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  breed_id UUID REFERENCES breeds(id) ON DELETE SET NULL,
  age_months INTEGER,
  gender TEXT CHECK (gender IN ('Male', 'Female')),
  color TEXT,
  weight_kg NUMERIC,
  price NUMERIC NOT NULL,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Reserved', 'Sold')),
  is_featured BOOLEAN DEFAULT false,
  health_certified BOOLEAN DEFAULT false,
  vaccinated BOOLEAN DEFAULT false,
  dewormed BOOLEAN DEFAULT false,
  microchipped BOOLEAN DEFAULT false,
  pedigree_certified BOOLEAN DEFAULT false,
  description TEXT,
  care_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for dogs" ON dogs;
CREATE POLICY "Public read access for dogs" ON dogs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write access for dogs" ON dogs;
CREATE POLICY "Admin write access for dogs" ON dogs
  FOR ALL USING (check_is_admin());


-- ==========================================
-- DOG IMAGES & DOCUMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS dog_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS dog_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  document_type TEXT CHECK (document_type IN ('health_cert', 'pedigree', 'vaccination_card')),
  url TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE dog_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_documents ENABLE ROW LEVEL SECURITY;

-- Images
DROP POLICY IF EXISTS "Public read access for dog images" ON dog_images;
CREATE POLICY "Public read access for dog images" ON dog_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write access for dog images" ON dog_images;
CREATE POLICY "Admin write access for dog images" ON dog_images FOR ALL USING (check_is_admin());

-- Documents
DROP POLICY IF EXISTS "Public read access for dog docs" ON dog_documents;
CREATE POLICY "Public read access for dog docs" ON dog_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write access for dog docs" ON dog_documents;


-- ==========================================
-- ORDERS / PAYMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  paystack_reference TEXT UNIQUE,
  paystack_transaction_id TEXT,
  amount_paid NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'refunded')),
  delivery_status TEXT DEFAULT 'processing' CHECK (delivery_status IN ('processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
  delivery_fee NUMERIC DEFAULT 0,
  customer_snapshot JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can read their own orders" ON public.orders;
CREATE POLICY "Customers can read their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers can insert pending orders" ON public.orders;
CREATE POLICY "Customers can insert pending orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id AND status = 'pending');

DROP POLICY IF EXISTS "Admin has full access to orders" ON public.orders;
CREATE POLICY "Admin has full access to orders" ON public.orders
  FOR ALL USING (public.check_is_admin());


-- ==========================================
-- WISHLISTS
-- ==========================================
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, dog_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can manage own wishlist" ON wishlists;
CREATE POLICY "Customers can manage own wishlist" ON wishlists
  FOR ALL USING (auth.uid() = user_id);


-- ==========================================
-- ENQUIRIES & SETTINGS
-- ==========================================
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert enquiries" ON enquiries;
CREATE POLICY "Public can insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manages enquiries" ON enquiries;
CREATE POLICY "Admin manages enquiries" ON enquiries FOR ALL USING (check_is_admin());

DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manages site settings" ON site_settings;
CREATE POLICY "Admin manages site settings" ON site_settings FOR ALL USING (check_is_admin());

-- ==========================================
-- STORAGE BUCKETS (Note: Done via Supabase UI usually)
-- ==========================================
-- 1. `dog-images` (Public)
-- 2. `dog-documents` (Public)
-- 3. `avatars` (Public)

-- Add Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_dogs_updated_at ON dogs;
CREATE TRIGGER trg_dogs_updated_at BEFORE UPDATE ON dogs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger to sync auth.users to public.profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to protect the role field from unauthorized changes
DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- ONE-TIME ADMIN UPGRADE (Uncomment and run with your email to manually upgrade a user)
-- UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL@HERE.COM';
