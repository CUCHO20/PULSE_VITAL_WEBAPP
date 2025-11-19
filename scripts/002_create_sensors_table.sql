-- Create sensors table
CREATE TABLE public.sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  is_linked BOOLEAN DEFAULT false,
  linked_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sensor_id to profiles table
ALTER TABLE public.profiles
ADD COLUMN sensor_id UUID REFERENCES public.sensors(id) ON DELETE SET NULL;

-- Enable RLS for sensors table
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sensors
CREATE POLICY "Anyone can view available sensors" 
  ON public.sensors 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can only update their linked sensor" 
  ON public.sensors 
  FOR UPDATE 
  USING (auth.uid() = linked_user_id);

-- Insert sample sensor data
INSERT INTO public.sensors (name, model, manufacturer) VALUES
('Pulse Vitals Pro', 'PVP-100', 'VitalTech'),
('Smart Heart Monitor', 'SHM-500', 'CardioLife'),
('Fitness Band Elite', 'FBE-200', 'FitConnect'),
('Health Tracker Plus', 'HTP-300', 'WellnessHub'),
('Advanced Pulse Monitor', 'APM-400', 'MediSense');
