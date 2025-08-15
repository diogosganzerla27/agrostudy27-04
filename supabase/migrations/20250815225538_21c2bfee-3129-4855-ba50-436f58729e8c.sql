-- Drop the existing restrictive constraint
ALTER TABLE public.grades DROP CONSTRAINT IF EXISTS grades_assessment_type_check;

-- Create new constraint that accepts all assessment types used in the frontend
ALTER TABLE public.grades ADD CONSTRAINT grades_assessment_type_check 
CHECK (assessment_type IN ('Prova', 'Trabalho', 'Seminário', 'Projeto', 'Participação', 'Outro'));