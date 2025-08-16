import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Event {
  id: string;
  title: string;
  description?: string;
  starts_at: string;
  ends_at?: string;
  type: string;
  location?: string;
  subject_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  source: string;
  priority?: string;
  reminders_min_before?: number[];
}

export interface EventWithSubject extends Event {
  subject?: {
    id: string;
    name: string;
    color: string;
  };
}

export const useEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<EventWithSubject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('agenda_events')
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('starts_at', { ascending: true });

      if (error) throw error;
      
      const eventsWithSubjects = data?.map(event => ({
        ...event,
        subject: event.subjects ? event.subjects : undefined,
        reminders_min_before: event.reminders_min_before || [15, 60]
      })) || [];
      
      setEvents(eventsWithSubjects);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os eventos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: {
    title: string;
    description?: string;
    starts_at: string;
    ends_at?: string;
    type: string;
    location?: string;
    subject_id?: string;
    priority?: string;
    reminders_min_before?: number[];
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('agenda_events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          starts_at: eventData.starts_at,
          ends_at: eventData.ends_at,
          type: eventData.type,
          location: eventData.location,
          subject_id: eventData.subject_id,
          user_id: user.id,
          source: 'manual',
          priority: eventData.priority,
          reminders_min_before: eventData.reminders_min_before || [15, 60]
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

      const newEvent = {
        ...data,
        subject: data.subjects ? data.subjects : undefined,
        reminders_min_before: data.reminders_min_before || [15, 60]
      };

      setEvents(prev => [...prev, newEvent].sort((a, b) => 
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      ));
      
      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso!",
      });

      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('agenda_events')
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

      const updatedEvent = {
        ...data,
        subject: data.subjects ? data.subjects : undefined,
        reminders_min_before: data.reminders_min_before || [15, 60]
      };

      setEvents(prev => prev.map(event => 
        event.id === id ? updatedEvent : event
      ).sort((a, b) => 
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      ));

      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o evento.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteEvent = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('agenda_events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Evento excluído com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o evento.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função para obter estatísticas dos eventos
  const getEventStats = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const thisWeekEvents = events.filter(event => {
      const eventDate = new Date(event.starts_at);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });

    const exams = events.filter(event => event.type === 'prova');
    const assignments = events.filter(event => event.type === 'trabalho');
    const visits = events.filter(event => event.type === 'aula');

    return {
      thisWeek: thisWeekEvents.length,
      exams: exams.length,
      assignments: assignments.length,
      visits: visits.length
    };
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: loadEvents,
    getEventStats
  };
};