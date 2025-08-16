-- Create pdf_library table for storing PDF metadata
CREATE TABLE public.pdf_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'application/pdf',
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pdf_library ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can create their own PDFs" 
ON public.pdf_library 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own PDFs" 
ON public.pdf_library 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own PDFs" 
ON public.pdf_library 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own PDFs" 
ON public.pdf_library 
FOR DELETE 
USING (user_id = auth.uid());

-- Create storage bucket for PDF documents
INSERT INTO storage.buckets (id, name, public) VALUES ('pdf-documents', 'pdf-documents', true);

-- RLS policies for storage
CREATE POLICY "Users can upload their own PDFs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pdf-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own PDFs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pdf-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own PDFs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'pdf-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own PDFs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'pdf-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pdf_library_updated_at
BEFORE UPDATE ON public.pdf_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();