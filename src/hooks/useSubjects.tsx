import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string;
  semester_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Semester {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useSubjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load semesters
      const { data: semestersData, error: semestersError } = await supabase
        .from('semesters')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (semestersError) throw semestersError;

      // Load subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (subjectsError) throw subjectsError;

      setSemesters(semestersData || []);
      setSubjects(subjectsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar disciplinas e semestres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSemester = async (title: string, startDate: string, endDate: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('semesters')
        .insert({
          title,
          start_date: startDate,
          end_date: endDate,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setSemesters(prev => [data, ...prev]);
      toast({
        title: "Semestre criado",
        description: `Semestre "${title}" criado com sucesso`,
      });

      return data;
    } catch (error) {
      console.error('Error creating semester:', error);
      toast({
        title: "Erro ao criar semestre",
        description: "Não foi possível criar o semestre",
        variant: "destructive",
      });
      return null;
    }
  };

  const createSubject = async (name: string, code: string, color: string, semesterId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          name,
          code,
          color,
          semester_id: semesterId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setSubjects(prev => [...prev, data]);
      toast({
        title: "Disciplina criada",
        description: `Disciplina "${name}" criada com sucesso`,
      });

      return data;
    } catch (error) {
      console.error('Error creating subject:', error);
      toast({
        title: "Erro ao criar disciplina",
        description: "Não foi possível criar a disciplina",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSubjects(prev => 
        prev.map(subject => 
          subject.id === id ? { ...subject, ...updates } : subject
        )
      );

      return true;
    } catch (error) {
      console.error('Error updating subject:', error);
      toast({
        title: "Erro ao atualizar disciplina",
        description: "Não foi possível atualizar a disciplina",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteSubject = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSubjects(prev => prev.filter(subject => subject.id !== id));
      toast({
        title: "Disciplina removida",
        description: "A disciplina foi removida com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Erro ao remover disciplina",
        description: "Não foi possível remover a disciplina",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteSemester = async (id: string) => {
    if (!user) return false;

    try {
      // Primeiro, verificar se há disciplinas neste semestre
      const subjectsInSemester = subjects.filter(subject => subject.semester_id === id);
      
      if (subjectsInSemester.length > 0) {
        toast({
          title: "Erro ao remover semestre",
          description: "Não é possível remover um semestre que possui disciplinas. Remova as disciplinas primeiro.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('semesters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSemesters(prev => prev.filter(semester => semester.id !== id));
      toast({
        title: "Semestre removido",
        description: "O semestre foi removido com sucesso",
      });

      return true;
    } catch (error) {
      console.error('Error deleting semester:', error);
      toast({
        title: "Erro ao remover semestre",
        description: "Não foi possível remover o semestre",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função para permitir adicionar disciplinas após setup
  const addNewSubject = async (name: string, code: string, color: string, semesterId: string) => {
    return await createSubject(name, code, color, semesterId);
  };

  // Função para obter disciplinas organizadas por semestre
  const getSubjectsBySemester = () => {
    const subjectsBySemester = semesters.map(semester => ({
      ...semester,
      subjects: subjects.filter(subject => subject.semester_id === semester.id)
    }));
    
    return subjectsBySemester;
  };

  return {
    subjects,
    semesters,
    loading,
    createSemester,
    createSubject,
    updateSubject,
    deleteSubject,
    deleteSemester,
    addNewSubject,
    getSubjectsBySemester,
    refreshData: loadData,
  };
};