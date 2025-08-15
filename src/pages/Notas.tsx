import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  StickyNote, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  StarOff,
  Edit3, 
  Trash2, 
  Download, 
  Share2,
  Tag,
  Calendar,
  FileText,
  ArrowLeft,
  BookOpen,
  Lightbulb,
  ClipboardList,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";

interface Note {
  id: string;
  title: string;
  content: string;
  discipline: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  template: string;
  attachments?: string[];
}

const disciplinas = [
  "Agronomia",
  "Zootecnia", 
  "Engenharia Florestal",
  "Biotecnologia",
  "Solos",
  "Fitotecnia",
  "Entomologia",
  "Fitopatologia",
  "Economia Rural",
  "Extensão Rural"
];

const templates = [
  { id: "blank", name: "Nota em branco", icon: FileText, content: "" },
  { id: "class", name: "Anotações de aula", icon: BookOpen, content: "# Aula - [Data]\n\n## Disciplina: \n\n## Tópicos abordados:\n- \n- \n- \n\n## Observações importantes:\n\n\n## Dúvidas:\n\n\n## Para próxima aula:\n" },
  { id: "research", name: "Pesquisa", icon: Lightbulb, content: "# Pesquisa - [Título]\n\n## Objetivo:\n\n\n## Metodologia:\n\n\n## Resultados:\n\n\n## Conclusões:\n\n\n## Referências:\n" },
  { id: "summary", name: "Resumo", icon: ClipboardList, content: "# Resumo - [Tópico]\n\n## Conceitos principais:\n\n\n## Pontos importantes:\n- \n- \n- \n\n## Aplicações práticas:\n\n\n## Referências:\n" }
];

const Notas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Form states
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteDiscipline, setNoteDiscipline] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const resetForm = () => {
    setNoteTitle("");
    setNoteContent("");
    setNoteDiscipline("");
    setNoteTags("");
    setSelectedTemplate("");
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o título e o conteúdo da nota.",
        variant: "destructive",
      });
      return;
    }

    const noteData: Note = {
      id: editingNote?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: noteTitle.trim(),
      content: noteContent.trim(),
      discipline: noteDiscipline || "Não categorizado",
      tags: noteTags.split(",").map(tag => tag.trim()).filter(Boolean),
      isFavorite: editingNote?.isFavorite || false,
      createdAt: editingNote?.createdAt || new Date(),
      updatedAt: new Date(),
      template: selectedTemplate || "blank",
    };

    if (editingNote) {
      setNotes(prev => prev.map(note => note.id === editingNote.id ? noteData : note));
      toast({
        title: "Nota atualizada",
        description: "Suas alterações foram salvas com sucesso.",
      });
    } else {
      setNotes(prev => [...prev, noteData]);
      toast({
        title: "Nova nota criada",
        description: "Sua nota foi salva com sucesso.",
      });
    }

    resetForm();
    setIsNewNoteOpen(false);
    setEditingNote(null);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteDiscipline(note.discipline);
    setNoteTags(note.tags.join(", "));
    setSelectedTemplate(note.template);
    setIsNewNoteOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast({
      title: "Nota excluída",
      description: "A nota foi removida com sucesso.",
    });
  };

  const toggleFavorite = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, isFavorite: !note.isFavorite }
        : note
    ));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setNoteContent(template.content);
    }
  };

  const exportNote = (note: Note) => {
    const content = `# ${note.title}\n\n**Disciplina:** ${note.discipline}\n**Tags:** ${note.tags.join(", ")}\n**Criado em:** ${note.createdAt.toLocaleDateString()}\n\n---\n\n${note.content}`;
    
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${note.title.replace(/\s+/g, "_")}.md`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Nota exportada",
      description: "A nota foi baixada como arquivo Markdown.",
    });
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDiscipline = selectedDiscipline === "all" || note.discipline === selectedDiscipline;
    const matchesFavorites = !showFavorites || note.isFavorite;
    
    return matchesSearch && matchesDiscipline && matchesFavorites;
  });

  const favoriteNotes = notes.filter(note => note.isFavorite);
  const recentNotes = notes.slice().sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={handleMenuClick} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <Sidebar 
            activeSection="notas"
            onSectionChange={() => {}}
            onClose={() => setMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-agro-green/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Minhas Notas</h1>
              <p className="text-muted-foreground">Organize suas anotações acadêmicas</p>
            </div>
            <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-agro-green hover:bg-agro-green-light">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Nota
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingNote ? "Editar Nota" : "Nova Nota"}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Template Selection */}
                  {!editingNote && (
                    <div>
                      <Label>Escolha um template</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {templates.map((template) => (
                          <Card 
                            key={template.id} 
                            className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                              selectedTemplate === template.id ? "ring-2 ring-agro-green" : ""
                            }`}
                            onClick={() => handleTemplateSelect(template.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <template.icon className="h-5 w-5 text-agro-green" />
                                <span className="font-medium text-sm">{template.name}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Digite o título da nota"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discipline">Disciplina</Label>
                      <Select value={noteDiscipline} onValueChange={setNoteDiscipline}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          {disciplinas.map(disciplina => (
                            <SelectItem key={disciplina} value={disciplina}>{disciplina}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      value={noteTags}
                      onChange={(e) => setNoteTags(e.target.value)}
                      placeholder="aula, importante, prova"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Digite o conteúdo da sua nota aqui..."
                      className="min-h-[300px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Suporte a Markdown básico (# Título, **negrito**, *itálico*, - lista)
                    </p>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsNewNoteOpen(false);
                      setEditingNote(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveNote} className="bg-agro-green hover:bg-agro-green-light">
                    {editingNote ? "Salvar Alterações" : "Criar Nota"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <StickyNote className="h-8 w-8 text-agro-green" />
                  <div>
                    <p className="text-2xl font-bold">{notes.length}</p>
                    <p className="text-sm text-muted-foreground">Total de notas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{favoriteNotes.length}</p>
                    <p className="text-sm text-muted-foreground">Favoritas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-agro-sky" />
                  <div>
                    <p className="text-2xl font-bold">{new Set(notes.map(n => n.discipline)).size}</p>
                    <p className="text-sm text-muted-foreground">Disciplinas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar notas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as disciplinas</SelectItem>
                  {disciplinas.map(disciplina => (
                    <SelectItem key={disciplina} value={disciplina}>{disciplina}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={showFavorites ? "default" : "outline"}
                onClick={() => setShowFavorites(!showFavorites)}
                className="w-full sm:w-auto"
              >
                <Star className="h-4 w-4 mr-2" />
                Favoritas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2 mb-2">{note.title}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {note.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(note.id)}
                    className="h-8 w-8 flex-shrink-0"
                  >
                    {note.isFavorite ? (
                      <Star className="h-4 w-4 text-accent fill-current" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {note.content.replace(/[#*\-\[\]]/g, "")}
                </p>
                
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-xs">
                    {note.discipline}
                  </Badge>
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 pt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditNote(note)}
                      className="h-8 w-8"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => exportNote(note)}
                      className="h-8 w-8"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <StickyNote className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma nota encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {notes.length === 0 
                  ? "Comece criando sua primeira nota" 
                  : "Tente ajustar os filtros de busca"}
              </p>
              <Button onClick={() => setIsNewNoteOpen(true)} className="bg-agro-green hover:bg-agro-green-light">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Nota
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notas;