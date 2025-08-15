import { useState } from "react";
import { BookOpen, Plus, Search, Filter, Tag, Paperclip, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
const CadernoDigital = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("all");
  
  // Estados para o formulário de nova anotação
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    discipline: "",
    content: "",
    tags: "",
    files: [] as File[]
  });
  const [notes, setNotes] = useState([{
    id: 1,
    title: "Irrigação por Gotejamento",
    discipline: "Solos",
    content: "Técnica de irrigação localizada que permite aplicação de água diretamente na zona radicular...",
    tags: ["irrigação", "economia-água", "sustentabilidade"],
    date: "2024-11-15",
    color: "bg-agro-earth"
  }, {
    id: 2,
    title: "Controle Biológico de Pragas",
    discipline: "Fitotecnia",
    content: "Uso de organismos vivos para controlar populações de pragas de forma natural...",
    tags: ["controle-biológico", "pragas", "sustentável"],
    date: "2024-11-14",
    color: "bg-agro-green"
  }, {
    id: 3,
    title: "Princípios da Agroecologia",
    discipline: "Agroecologia",
    content: "Sistema agrícola que integra aspectos ecológicos, econômicos e sociais...",
    tags: ["agroecologia", "sustentabilidade", "biodiversidade"],
    date: "2024-11-13",
    color: "bg-agro-field"
  }]);
  
  // Função para salvar nova anotação
  const handleSaveNote = () => {
    if (!newNote.title.trim() || !newNote.discipline || !newNote.content.trim()) {
      return; // Validação básica
    }
    
    const note = {
      id: notes.length + 1,
      title: newNote.title,
      discipline: newNote.discipline,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      date: new Date().toISOString().split('T')[0],
      color: "bg-agro-green" // Cor padrão para novas anotações
    };
    
    setNotes([note, ...notes]);
    
    // Limpar formulário
    setNewNote({
      title: "",
      discipline: "",
      content: "",
      tags: "",
      files: []
    });
    
    setIsDialogOpen(false);
  };
  const disciplines = ["all", "Solos", "Fitotecnia", "Agroecologia", "Entomologia", "Zootecnia"];
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === "all" || note.discipline === selectedDiscipline;
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
                onClick={() => navigate(-1)}
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
                    <Select value={newNote.discipline} onValueChange={(value) => setNewNote({...newNote, discipline: value})}>
                      <SelectTrigger className="h-11 sm:h-10">
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {disciplines.slice(1).map(discipline => <SelectItem key={discipline} value={discipline}>{discipline}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Conteúdo</label>
                    <Textarea 
                      placeholder="Conteúdo da anotação..." 
                      rows={8} 
                      className="min-h-[120px] resize-none"
                      value={newNote.content}
                      onChange={(e) => setNewNote({...newNote, content: e.target.value})}
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Paperclip className="mr-2 h-4 w-4" />
                      Anexar Arquivos
                    </label>
                    <Input 
                      type="file" 
                      multiple 
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      className="h-11 sm:h-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-muted/80" 
                    />
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: PDF, DOC, DOCX, TXT, JPG, PNG (máx. 10MB cada)
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button 
                  className="w-full h-11 sm:h-10" 
                  onClick={handleSaveNote}
                  disabled={!newNote.title.trim() || !newNote.discipline || !newNote.content.trim()}
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
              {disciplines.slice(1).map(discipline => <SelectItem key={discipline} value={discipline}>{discipline}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => <Card key={note.id} className="hover:shadow-md transition-all cursor-pointer touch-manipulation">
              <CardHeader className="pb-3 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base sm:text-lg leading-tight flex-1 min-w-0">{note.title}</CardTitle>
                  <div className={`w-4 h-4 sm:w-3 sm:h-3 rounded-full ${note.color} flex-shrink-0 mt-1`}></div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs px-2 py-1">{note.discipline}</Badge>
                  <span className="text-xs text-muted-foreground">{note.date}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3 leading-relaxed">{note.content}</p>
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs px-2 py-1 rounded-full">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>)}
                </div>
              </CardContent>
            </Card>)}
        </div>

        {filteredNotes.length === 0 && <div className="text-center py-12 px-4">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma anotação encontrada</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Crie sua primeira anotação ou ajuste os filtros</p>
          </div>}
      </div>
    </div>;
};
export default CadernoDigital;