-- Create storage bucket for note attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('note-attachments', 'note-attachments', false);

-- Create table for note attachments
CREATE TABLE public.note_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable RLS
ALTER TABLE public.note_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for note attachments
CREATE POLICY "Users can view their own note attachments" 
ON public.note_attachments 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own note attachments" 
ON public.note_attachments 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own note attachments" 
ON public.note_attachments 
FOR DELETE 
USING (user_id = auth.uid());

-- Storage policies for note attachments
CREATE POLICY "Users can view their own attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'note-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'note-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own attachments" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'note-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);