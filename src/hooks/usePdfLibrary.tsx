import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useSubjects } from './useSubjects';

export interface PdfDocument {
  id: string;
  title: string;
  author: string;
  file_name: string;
  file_path: string;
  file_size: number;
  category: string;
  tags: string[];
  description?: string;
  favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface PdfStats {
  totalPdfs: number;
  favorites: number;
  totalSize: string;
  thisMonth: number;
}

export const usePdfLibrary = () => {
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PdfStats>({
    totalPdfs: 0,
    favorites: 0,
    totalSize: '0 MB',
    thisMonth: 0
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { subjects } = useSubjects();

  const loadPdfs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pdf_library')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPdfs(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading PDFs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar biblioteca de PDFs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (pdfList: PdfDocument[]) => {
    const totalPdfs = pdfList.length;
    const favorites = pdfList.filter(pdf => pdf.favorite).length;
    const totalSizeBytes = pdfList.reduce((sum, pdf) => sum + pdf.file_size, 0);
    const totalSize = formatFileSize(totalSizeBytes);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = pdfList.filter(pdf => {
      const pdfDate = new Date(pdf.created_at);
      return pdfDate.getMonth() === currentMonth && pdfDate.getFullYear() === currentYear;
    }).length;

    setStats({ totalPdfs, favorites, totalSize, thisMonth });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const uploadPdf = async (file: File, metadata: {
    title: string;
    author: string;
    category: string;
    tags: string;
    description?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Upload file to storage
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('pdf-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { data, error: dbError } = await supabase
        .from('pdf_library')
        .insert({
          user_id: user.id,
          title: metadata.title,
          author: metadata.author,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          category: metadata.category,
          tags: metadata.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          description: metadata.description || `Material de estudo sobre ${metadata.category.toLowerCase()}`
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setPdfs(prev => [data, ...prev]);
      calculateStats([data, ...pdfs]);
      
      toast({
        title: "Sucesso",
        description: "PDF enviado com sucesso!"
      });

      return data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload do PDF",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deletePdf = async (pdfId: string) => {
    if (!user) return;

    try {
      const pdf = pdfs.find(p => p.id === pdfId);
      if (!pdf) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('pdf-documents')
        .remove([pdf.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('pdf_library')
        .delete()
        .eq('id', pdfId);

      if (dbError) throw dbError;

      const updatedPdfs = pdfs.filter(p => p.id !== pdfId);
      setPdfs(updatedPdfs);
      calculateStats(updatedPdfs);
      
      toast({
        title: "PDF removido",
        description: "O arquivo foi removido da biblioteca"
      });
    } catch (error) {
      console.error('Error deleting PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover PDF",
        variant: "destructive"
      });
    }
  };

  const toggleFavorite = async (pdfId: string) => {
    if (!user) return;

    try {
      const pdf = pdfs.find(p => p.id === pdfId);
      if (!pdf) return;

      const newFavoriteStatus = !pdf.favorite;
      
      const { error } = await supabase
        .from('pdf_library')
        .update({ favorite: newFavoriteStatus })
        .eq('id', pdfId);

      if (error) throw error;

      const updatedPdfs = pdfs.map(p => 
        p.id === pdfId ? { ...p, favorite: newFavoriteStatus } : p
      );
      setPdfs(updatedPdfs);
      calculateStats(updatedPdfs);
      
      toast({
        title: newFavoriteStatus ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: pdf.title
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar favoritos",
        variant: "destructive"
      });
    }
  };

  const getPdfUrl = (pdf: PdfDocument) => {
    return supabase.storage
      .from('pdf-documents')
      .getPublicUrl(pdf.file_path).data.publicUrl;
  };

  const downloadPdf = async (pdf: PdfDocument) => {
    try {
      const url = getPdfUrl(pdf);
      const element = document.createElement("a");
      element.href = url;
      element.download = pdf.file_name;
      element.target = "_blank";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Download iniciado",
        description: `${pdf.title} está sendo baixado`
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao baixar PDF",
        variant: "destructive"
      });
    }
  };

  const getCategories = () => {
    const subjectNames = subjects.map(subject => subject.name);
    return ['all', ...subjectNames];
  };

  useEffect(() => {
    if (user) {
      loadPdfs();
    }
  }, [user]);

  return {
    pdfs,
    loading,
    stats,
    uploadPdf,
    deletePdf,
    toggleFavorite,
    downloadPdf,
    getPdfUrl,
    getCategories,
    refreshPdfs: loadPdfs
  };
};