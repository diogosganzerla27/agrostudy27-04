import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Visit {
  id: string;
  location_text: string;
  date: string;
  kind: string;
  observations_md?: string;
  subject_id?: string;
  user_id: string;
  gps?: any;
  offline_status: string;
  created_at: string;
  updated_at: string;
}

export interface VisitWithSubject extends Visit {
  subject?: {
    id: string;
    name: string;
    color: string;
  };
  photos?: VisitPhoto[];
}

export interface VisitPhoto {
  id: string;
  visit_id?: string;
  file_url: string;
  caption?: string;
  taken_at: string;
  exif_json?: any;
}

export const useVisits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [visits, setVisits] = useState<VisitWithSubject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVisits = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('visits')
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            color
          ),
          visit_photos (
            id,
            visit_id,
            file_url,
            caption,
            taken_at,
            exif_json
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      
      const visitsWithData = data?.map(visit => ({
        ...visit,
        subject: visit.subjects ? visit.subjects : undefined,
        photos: visit.visit_photos || [],
        observations_md: visit.observations_md || ''
      })) || [];
      
      setVisits(visitsWithData);
    } catch (error) {
      console.error('Error loading visits:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as visitas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createVisit = async (visitData: {
    location_text: string;
    date: string;
    kind: string;
    observations_md?: string;
    subject_id?: string;
    gps?: any;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('visits')
        .insert({
          location_text: visitData.location_text,
          date: visitData.date,
          kind: visitData.kind,
          observations_md: visitData.observations_md,
          subject_id: visitData.subject_id,
          user_id: user.id,
          gps: visitData.gps,
          offline_status: 'synced'
        })
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            color
          ),
          visit_photos (
            id,
            visit_id,
            file_url,
            caption,
            taken_at,
            exif_json
          )
        `)
        .single();

      if (error) throw error;

      const newVisit = {
        ...data,
        subject: data.subjects ? data.subjects : undefined,
        photos: data.visit_photos || [],
        observations_md: data.observations_md || ''
      };

      setVisits(prev => [newVisit, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Visita criada com sucesso!",
      });

      return newVisit;
    } catch (error) {
      console.error('Error creating visit:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a visita.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateVisit = async (id: string, updates: Partial<Visit>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('visits')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            color
          ),
          visit_photos (
            id,
            visit_id,
            file_url,
            caption,
            taken_at,
            exif_json
          )
        `)
        .single();

      if (error) throw error;

      const updatedVisit = {
        ...data,
        subject: data.subjects ? data.subjects : undefined,
        photos: data.visit_photos || [],
        observations_md: data.observations_md || ''
      };

      setVisits(prev => prev.map(visit => 
        visit.id === id ? updatedVisit : visit
      ));

      toast({
        title: "Sucesso",
        description: "Visita atualizada com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Error updating visit:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a visita.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteVisit = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('visits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setVisits(prev => prev.filter(visit => visit.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Visita excluída com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Error deleting visit:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a visita.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função para obter estatísticas das visitas
  const getVisitStats = () => {
    const completedVisits = visits.filter(visit => {
      const visitDate = new Date(visit.date);
      const today = new Date();
      return visitDate <= today;
    });

    const scheduledVisits = visits.filter(visit => {
      const visitDate = new Date(visit.date);
      const today = new Date();
      return visitDate > today;
    });

    const totalPhotos = visits.reduce((total, visit) => total + (visit.photos?.length || 0), 0);

    const typeStats = visits.reduce((acc, visit) => {
      acc[visit.kind] = (acc[visit.kind] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: visits.length,
      completed: completedVisits.length,
      scheduled: scheduledVisits.length,
      totalPhotos,
      byType: typeStats
    };
  };

  useEffect(() => {
    loadVisits();
  }, [user]);

  return {
    visits,
    loading,
    createVisit,
    updateVisit,
    deleteVisit,
    refreshVisits: loadVisits,
    getVisitStats
  };
};