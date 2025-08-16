import { useState } from "react";
import { Calendar, Clock, Plus, AlertCircle, BookOpen, FileText, ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { useEvents } from "@/hooks/useEvents";
import { useSubjects } from "@/hooks/useSubjects";
import { Loader2 } from "lucide-react";
const AgendaAcademica = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    events,
    loading,
    createEvent,
    deleteEvent,
    getEventStats
  } = useEvents();
  const {
    subjects
  } = useSubjects();
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    type: "",
    subject_id: "",
    priority: "",
    description: ""
  });
  const handleSaveEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.type || !newEvent.priority) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Usar apenas a data sem horário específico
    const startsAt = `${newEvent.date}T00:00:00`;
    const eventData = {
      title: newEvent.title,
      description: newEvent.description,
      starts_at: startsAt,
      type: newEvent.type,
      subject_id: newEvent.subject_id || undefined,
      priority: newEvent.priority
    };
    const createdEvent = await createEvent(eventData);
    if (createdEvent) {
      setNewEvent({
        title: "",
        date: "",
        type: "",
        subject_id: "",
        priority: "",
        description: ""
      });
      setDialogOpen(false);
    }
  };
  const handleDeleteEvent = async (eventId: string) => {
    const success = await deleteEvent(eventId);
    if (success) {
      setEventToDelete(null);
    }
  };
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'prova':
        return AlertCircle;
      case 'trabalho':
        return FileText;
      case 'aula':
        return BookOpen;
      case 'outro':
        return Calendar;
      default:
        return Calendar;
    }
  };
  const getEventColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          text: 'Alta',
          variant: 'destructive' as const
        };
      case 'medium':
        return {
          text: 'Média',
          variant: 'secondary' as const
        };
      case 'low':
        return {
          text: 'Baixa',
          variant: 'outline' as const
        };
      default:
        return {
          text: 'Normal',
          variant: 'secondary' as const
        };
    }
  };

  // Determinar prioridade baseada no tipo e proximidade
  const getEventPriority = (event: any) => {
    const eventDate = new Date(event.starts_at);
    const today = new Date();
    const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (event.type === 'prova' && diffDays <= 7) return 'high';
    if (event.type === 'trabalho' && diffDays <= 3) return 'high';
    if (diffDays <= 1) return 'high';
    if (diffDays <= 7) return 'medium';
    return 'low';
  };
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-agro-sky" />
      </div>;
  }
  const stats = getEventStats();
  return <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setMobileMenuOpen(true)} sidebarOpen={mobileMenuOpen} />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeSection="agenda" onSectionChange={() => {}} />
        </div>
        
        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar activeSection="agenda" onSectionChange={() => {}} onClose={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 p-4 sm:p-6 lg:ml-64">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="lg:hidden">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center">
                    <Calendar className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-agro-sky" />
                    Agenda Acadêmica
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">Provas, trabalhos e eventos importantes</p>
                </div>
              </div>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Evento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md sm:max-w-2xl mx-4">
                  <DialogHeader>
                    <DialogTitle>Novo Evento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <Input placeholder="Título do evento" value={newEvent.title} onChange={e => setNewEvent({
                    ...newEvent,
                    title: e.target.value
                  })} />
                    <Input type="date" value={newEvent.date} onChange={e => setNewEvent({
                      ...newEvent,
                      date: e.target.value
                    })} />
                    <Select value={newEvent.type} onValueChange={value => setNewEvent({
                    ...newEvent,
                    type: value
                  })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de evento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prova">Prova</SelectItem>
                        <SelectItem value="trabalho">Trabalho</SelectItem>
                        <SelectItem value="aula">Aula</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newEvent.subject_id} onValueChange={value => setNewEvent({
                    ...newEvent,
                    subject_id: value
                  })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Disciplina (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={newEvent.priority} onValueChange={value => setNewEvent({
                    ...newEvent,
                    priority: value
                  })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Descrição do evento..." rows={3} value={newEvent.description} onChange={e => setNewEvent({
                    ...newEvent,
                    description: e.target.value
                  })} />
                    <Button className="w-full" onClick={handleSaveEvent}>
                      Salvar Evento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Esta Semana</p>
                      <p className="text-lg sm:text-2xl font-bold text-agro-green">{stats.thisWeek}</p>
                    </div>
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-agro-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Provas</p>
                      <p className="text-lg sm:text-2xl font-bold text-red-500">{stats.exams}</p>
                    </div>
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Trabalhos</p>
                      <p className="text-lg sm:text-2xl font-bold text-yellow-500">{stats.assignments}</p>
                    </div>
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Visitas</p>
                      <p className="text-lg sm:text-2xl font-bold text-agro-field">{stats.visits}</p>
                    </div>
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-agro-field" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events List */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">Crie seu primeiro evento acadêmico</p>
                  </div> : <div className="space-y-4">
                     {events.map(event => {
                  const IconComponent = getEventIcon(event.type);
                  const priority = event.priority || getEventPriority(event);
                  const priorityBadge = getPriorityBadge(priority);
                  return <div key={event.id} className={`p-3 sm:p-4 border rounded-lg ${getEventColor(priority)}`}>
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                            <div className="flex items-start space-x-3 flex-1">
                              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm sm:text-base">{event.title}</h3>
                                <p className="text-xs sm:text-sm opacity-75 mt-1 line-clamp-2">{event.description}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
                                   <span className="flex items-center">
                                     <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                     {new Date(event.starts_at).toLocaleDateString('pt-BR')}
                                   </span>
                                  {event.subject && <Badge variant="outline" className="text-xs w-fit">{event.subject.name}</Badge>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={priorityBadge.variant} className="text-xs flex-shrink-0">
                                {priorityBadge.text}
                              </Badge>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir Evento</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o evento "{event.title}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 hover:bg-red-600">
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>;
                })}
                  </div>}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>;
};
export default AgendaAcademica;