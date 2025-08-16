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
  attachments?: {
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
  }[];
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

      // Load attachments separately for each note
      const notesWithSubjects = [];
      for (const note of data || []) {
        const { data: attachments } = await supabase
          .from('note_attachments')
          .select('*')
          .eq('note_id', note.id);

        notesWithSubjects.push({
          ...note,
          subject: note.subjects ? note.subjects : undefined,
          content_md: note.content_md || '',
          tags: note.tags || [],
          attachments: attachments || []
        });
      }
      
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
    files?: File[];
  }) => {
    if (!user) return null;

    try {
      // First create the note
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

      // Handle file uploads if any
      const uploadedAttachments = [];
      if (noteData.files && noteData.files.length > 0) {
        for (const file of noteData.files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${data.id}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('note-attachments')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue;
          }

          // Save attachment record
          const { data: attachmentData, error: attachmentError } = await supabase
            .from('note_attachments')
            .insert({
              note_id: data.id,
              file_name: file.name,
              file_path: fileName,
              file_size: file.size,
              file_type: file.type,
              user_id: user.id
            })
            .select()
            .single();

          if (attachmentError) {
            console.error('Error saving attachment record:', attachmentError);
          } else {
            uploadedAttachments.push(attachmentData);
          }
        }
      }

      const newNote = {
        ...data,
        subject: data.subjects ? data.subjects : undefined,
        content_md: data.content_md || '',
        tags: data.tags || [],
        attachments: uploadedAttachments
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