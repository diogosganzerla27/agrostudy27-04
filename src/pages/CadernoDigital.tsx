import { useState } from "react";
import { BookOpen, Plus, Search, Filter, Tag, Paperclip, ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ViewNoteDialog } from "@/components/caderno/ViewNoteDialog";
import { FileUpload } from "@/components/caderno/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { useNotes } from "@/hooks/useNotes";
import { useSubjects } from "@/hooks/useSubjects";
import { Loader2 } from "lucide-react";
const CadernoDigital = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { notes, loading, createNote, deleteNote } = useNotes();
  const { subjects } = useSubjects();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("all");
  
  // Estados para o formulário de nova anotação
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    subject_id: "",
    content_md: "",
    tags: "",
    files: [] as File[]
  });

  // Estados para visualização de anotação
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Função para salvar nova anotação
  const handleSaveNote = async () => {
    if (!newNote.title.trim() || !newNote.subject_id || !newNote.content_md.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título, disciplina e conteúdo",
        variant: "destructive",
      });
      return;
    }
    
    const tagsArray = newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const createdNote = await createNote({
      title: newNote.title,
      subject_id: newNote.subject_id,
      content_md: newNote.content_md,
      tags: tagsArray,
      files: newNote.files
    });
    
    if (createdNote) {
      // Limpar formulário
      setNewNote({
        title: "",
        subject_id: "",
        content_md: "",
        tags: "",
        files: []
      });
      
      setIsDialogOpen(false);
    }
  };

  // Função para abrir anotação
  const handleViewNote = (note: any) => {
    setSelectedNote(note);
    setIsViewDialogOpen(true);
  };

  // Função para excluir anotação
  const handleDeleteNote = async (noteId: string) => {
    const success = await deleteNote(noteId);
    if (success) {
      setIsViewDialogOpen(false);
      setSelectedNote(null);
    }
  };

  // Função para voltar
  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-agro-green" />
      </div>
    );
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.content_md.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === "all" || note.subject_id === selectedDiscipline;
    return matchesSearch && matchesDiscipline;
  });
  return <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-3 mb-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleGoBack}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center">
                <BookOpen className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 text-agro-green" />
                Caderno Digital
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground ml-12">Organize suas anotações por disciplina</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto h-10 sm:h-9">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Nova Anotação</span>
                <span className="xs:hidden">Nova Anotação</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl h-[90vh] sm:h-auto max-h-[90vh] flex flex-col">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-lg sm:text-xl">Nova Anotação</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-4 pr-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título</label>
                    <Input 
                      placeholder="Título da anotação" 
                      className="h-11 sm:h-10"
                      value={newNote.title}
                      onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Disciplina</label>
                    <Select value={newNote.subject_id} onValueChange={(value) => setNewNote({...newNote, subject_id: value})}>
                      <SelectTrigger className="h-11 sm:h-10">
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Conteúdo</label>
                    <Textarea 
                      placeholder="Conteúdo da anotação..." 
                      rows={8} 
                      className="min-h-[120px] resize-none"
                      value={newNote.content_md}
                      onChange={(e) => setNewNote({...newNote, content_md: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <Input 
                      placeholder="Tags (separadas por vírgula)" 
                      className="h-11 sm:h-10"
                      value={newNote.tags}
                      onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                    />
                  </div>
                  <FileUpload 
                    files={newNote.files}
                    onFilesChange={(files) => setNewNote({...newNote, files})}
                  />
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button 
                  className="w-full h-11 sm:h-10" 
                  onClick={handleSaveNote}
                  disabled={!newNote.title.trim() || !newNote.subject_id || !newNote.content_md.trim()}
                >
                  Salvar Anotação
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar anotações..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 h-11 sm:h-10" />
          </div>
          <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
            <SelectTrigger className="w-full sm:w-48 h-11 sm:h-10">
              <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as disciplinas</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <Card 
              key={note.id} 
              className="hover:shadow-md transition-all cursor-pointer touch-manipulation"
              onClick={() => handleViewNote(note)}
            >
              <CardHeader className="pb-3 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base sm:text-lg leading-tight flex-1 min-w-0">{note.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 sm:w-3 sm:h-3 rounded-full ${note.subject?.color || 'bg-agro-green'} flex-shrink-0`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {note.subject?.name || 'Sem disciplina'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3 leading-relaxed">
                  {note.content_md}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs px-2 py-1 rounded-full">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Note Dialog */}
        <ViewNoteDialog 
          note={selectedNote}
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          onDelete={handleDeleteNote}
        />

        {filteredNotes.length === 0 && <div className="text-center py-12 px-4">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma anotação encontrada</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Crie sua primeira anotação ou ajuste os filtros</p>
          </div>}
      </div>
    </div>;
};
export default CadernoDigital;