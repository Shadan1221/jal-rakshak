-- Create sites table for monitoring locations
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius INTEGER NOT NULL, -- in meters for geofencing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create readings table for water level submissions
CREATE TABLE public.readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  water_level DECIMAL(10, 2) NOT NULL,
  photo_url TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint for status validation using a trigger
CREATE OR REPLACE FUNCTION validate_reading_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status NOT IN ('pending', 'verified', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_reading_status
BEFORE INSERT OR UPDATE ON public.readings
FOR EACH ROW EXECUTE FUNCTION validate_reading_status();

-- Enable RLS
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;

-- RLS policies for sites (public read)
CREATE POLICY "Sites are viewable by everyone" 
ON public.sites FOR SELECT 
USING (true);

-- RLS policies for readings
CREATE POLICY "Users can view all readings" 
ON public.readings FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own readings" 
ON public.readings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update readings" 
ON public.readings FOR UPDATE 
USING (true);

-- Create storage bucket for gauge photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gauge-photos', 'gauge-photos', true);

-- Storage policies
CREATE POLICY "Users can upload photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'gauge-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Photos are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gauge-photos');

-- Insert sample sites for testing
INSERT INTO public.sites (name, latitude, longitude, radius) VALUES
('Yamuna River - Delhi', 28.6139, 77.2090, 100),
('Ganges River - Varanasi', 25.3176, 82.9739, 150),
('Godavari River - Nashik', 19.9975, 73.7898, 120),
('Krishna River - Vijayawada', 16.5062, 80.6480, 100),
('Narmada River - Jabalpur', 23.1815, 79.9864, 130);