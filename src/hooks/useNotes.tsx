import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Note {
  id: string;
  title: string;
  content_md: string;
  subject_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface NoteWithSubject extends Note {
  subject?: {
    id: string;
    name: string;
    color: string;
  };
}

export const useNotes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<NoteWithSubject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notes_journal')
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const notesWithSubjects = data?.map(note => ({
        ...note,
        subject: note.subjects ? note.subjects : undefined,
        content_md: note.content_md || '',
        tags: note.tags || []
      })) || [];
      
      setNotes(notesWithSubjects);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as anotações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData: {
    title: string;
    content_md: string;
    subject_id?: string;
    tags?: string[];
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes_journal')
        .insert({
          title: noteData.title,
          content_md: noteData.content_md,
          subject_id: noteData.subject_id,
          tags: noteData.tags || [],
          user_id: user.id
        })
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            color
          )
        `)
        .single();

      if (error) throw error;

      const newNote = {
        ...data,
        subject: data.subjects ? data.subjects : undefined,
        content_md: data.content_md || '',
        tags: data.tags || []
      };

      setNotes(prev => [newNote, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Anotação criada com sucesso!",
      });

      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a anotação.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('notes_journal')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            color
          )
        `)
        .single();

      if (error) throw error;

      const updatedNote = {
        ...data,
        subject: data.subjects ? data.subjects : undefined,
        content_md: data.content_md || '',
        tags: data.tags || []
      };

      setNotes(prev => prev.map(note => 
        note.id === id ? updatedNote : note
      ));

      toast({
        title: "Sucesso",
        description: "Anotação atualizada com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a anotação.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('notes_journal')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Anotação excluída com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a anotação.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user]);

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: loadNotes
  };
};