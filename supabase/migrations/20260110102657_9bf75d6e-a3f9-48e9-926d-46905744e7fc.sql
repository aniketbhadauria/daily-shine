-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'washer', 'customer');
CREATE TYPE public.wash_status AS ENUM ('pending', 'completed', 'missed', 'skipped');
CREATE TYPE public.subscription_plan AS ENUM ('daily', 'weekly_2x', 'weekly_3x');
CREATE TYPE public.missed_reason AS ENUM ('car_not_available', 'access_denied', 'weather', 'mechanical_issue', 'customer_request');

-- Profiles table for user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Cars table
CREATE TABLE public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  color TEXT,
  license_plate TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Addresses/locations for car parking
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL DEFAULT 'Home',
  address_line TEXT NOT NULL,
  landmark TEXT,
  parking_type TEXT DEFAULT 'open',
  access_notes TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  plan subscription_plan NOT NULL,
  price_per_month INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  auto_renew BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Routes for washers (daily assignments)
CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  washer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  route_date DATE NOT NULL DEFAULT CURRENT_DATE,
  route_name TEXT,
  estimated_cars INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Wash jobs (individual wash assignments)
CREATE TABLE public.wash_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  washer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status wash_status NOT NULL DEFAULT 'pending',
  sequence_order INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  before_photo_url TEXT,
  after_photo_url TEXT,
  gps_latitude DOUBLE PRECISION,
  gps_longitude DOUBLE PRECISION,
  gps_verified BOOLEAN DEFAULT false,
  missed_reason missed_reason,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Disputes table for admin resolution
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wash_job_id UUID REFERENCES public.wash_jobs(id) ON DELETE CASCADE NOT NULL,
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  resolution TEXT,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wash_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Cars policies
CREATE POLICY "Users can view own cars" ON public.cars FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own cars" ON public.cars FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Washers can view assigned cars" ON public.cars FOR SELECT USING (
  public.has_role(auth.uid(), 'washer') AND EXISTS (
    SELECT 1 FROM public.wash_jobs WHERE car_id = cars.id AND washer_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all cars" ON public.cars FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Addresses policies
CREATE POLICY "Users can manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Washers can view assigned addresses" ON public.addresses FOR SELECT USING (
  public.has_role(auth.uid(), 'washer') AND EXISTS (
    SELECT 1 FROM public.wash_jobs WHERE address_id = addresses.id AND washer_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all addresses" ON public.addresses FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Routes policies
CREATE POLICY "Washers can view own routes" ON public.routes FOR SELECT USING (auth.uid() = washer_id);
CREATE POLICY "Admins can manage all routes" ON public.routes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Wash jobs policies
CREATE POLICY "Customers can view own wash jobs" ON public.wash_jobs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.subscriptions WHERE id = wash_jobs.subscription_id AND user_id = auth.uid())
);
CREATE POLICY "Washers can view assigned jobs" ON public.wash_jobs FOR SELECT USING (auth.uid() = washer_id);
CREATE POLICY "Washers can update assigned jobs" ON public.wash_jobs FOR UPDATE USING (auth.uid() = washer_id);
CREATE POLICY "Admins can manage all wash jobs" ON public.wash_jobs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Disputes policies
CREATE POLICY "Users can view own disputes" ON public.disputes FOR SELECT USING (auth.uid() = reported_by);
CREATE POLICY "Users can create disputes" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Admins can manage all disputes" ON public.disputes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Default role is customer
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON public.routes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wash_jobs_updated_at BEFORE UPDATE ON public.wash_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for wash photos
INSERT INTO storage.buckets (id, name, public) VALUES ('wash-photos', 'wash-photos', true);

-- Storage policies for wash photos
CREATE POLICY "Washers can upload photos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'wash-photos' AND auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view wash photos" ON storage.objects FOR SELECT USING (bucket_id = 'wash-photos');

CREATE POLICY "Admins can delete photos" ON storage.objects FOR DELETE USING (
  bucket_id = 'wash-photos' AND public.has_role(auth.uid(), 'admin')
);