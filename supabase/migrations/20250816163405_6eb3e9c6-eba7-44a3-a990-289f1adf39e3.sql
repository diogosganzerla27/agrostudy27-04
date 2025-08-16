-- Add priority column to agenda_events table
ALTER TABLE public.agenda_events ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('high', 'medium', 'low'));