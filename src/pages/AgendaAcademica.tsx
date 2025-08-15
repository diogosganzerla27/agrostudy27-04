import { useState } from "react";
import { Calendar, Clock, Plus, AlertCircle, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const AgendaAcademica = () => {
  const [selectedMonth, setSelectedMonth] = useState("current");

  const events = [
    {
      id: 1,
      title: "Prova de Fitotecnia",
      type: "exam",
      date: "2024-11-22",
      time: "14:00",
      discipline: "Fitotecnia",
      description: "Prova sobre manejo integrado de pragas e doenças",
      priority: "high"
    },
    {
      id: 2,
      title: "Entrega de Relatório - Solos",
      type: "assignment",
      date: "2024-11-25",
      time: "23:59",
      discipline: "Solos",
      description: "Relatório sobre análise físico-química do solo",
      priority: "medium"
    },
    {
      id: 3,
      title: "Visita Técnica - Fazenda Experimental",
      type: "visit",
      date: "2024-11-27",
      time: "08:00",
      discipline: "Produção Vegetal",
      description: "Visita aos campos experimentais da universidade",
      priority: "medium"
    },
    {
      id: 4,
      title: "Seminário de Agroecologia",
      type: "seminar",
      date: "2024-11-28",
      time: "10:00",
      discipline: "Agroecologia",
      description: "Apresentação sobre sistemas agroflorestais",
      priority: "low"
    },
    {
      id: 5,
      title: "Prova de Entomologia",
      type: "exam",
      date: "2024-12-05",
      time: "16:00",
      discipline: "Entomologia",
      description: "Avaliação sobre identificação e controle de pragas",
      priority: "high"
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam': return AlertCircle;
      case 'assignment': return FileText;
      case 'visit': return Calendar;
      case 'seminar': return BookOpen;
      default: return Calendar;
    }
  };

  const getEventColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return { text: 'Alta', variant: 'destructive' as const };
      case 'medium': return { text: 'Média', variant: 'secondary' as const };
      case 'low': return { text: 'Baixa', variant: 'outline' as const };
      default: return { text: 'Normal', variant: 'secondary' as const };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeSection="agenda" onSectionChange={() => {}} />
        <main className="flex-1 p-4 sm:p-6 lg:ml-64">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                  <Calendar className="mr-3 h-7 w-7 text-agro-sky" />
                  Agenda Acadêmica
                </h1>
                <p className="text-muted-foreground mt-1">Provas, trabalhos e eventos importantes</p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Evento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Novo Evento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Título do evento" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input type="date" />
                      <Input type="time" />
                    </div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de evento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exam">Prova</SelectItem>
                        <SelectItem value="assignment">Trabalho</SelectItem>
                        <SelectItem value="visit">Visita Técnica</SelectItem>
                        <SelectItem value="seminar">Seminário</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Disciplina" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Descrição do evento..." rows={3} />
                    <Button className="w-full">Salvar Evento</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Esta Semana</p>
                      <p className="text-2xl font-bold text-agro-green">3</p>
                    </div>
                    <Calendar className="h-8 w-8 text-agro-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Provas</p>
                      <p className="text-2xl font-bold text-red-500">2</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Trabalhos</p>
                      <p className="text-2xl font-bold text-yellow-500">1</p>
                    </div>
                    <FileText className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Visitas</p>
                      <p className="text-2xl font-bold text-agro-field">1</p>
                    </div>
                    <Calendar className="h-8 w-8 text-agro-field" />
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
                <div className="space-y-4">
                  {events.map(event => {
                    const IconComponent = getEventIcon(event.type);
                    const priorityBadge = getPriorityBadge(event.priority);
                    
                    return (
                      <div key={event.id} className={`p-4 border rounded-lg ${getEventColor(event.priority)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <IconComponent className="h-5 w-5 mt-0.5" />
                            <div className="flex-1">
                              <h3 className="font-medium">{event.title}</h3>
                              <p className="text-sm opacity-75 mt-1">{event.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm">
                                <span className="flex items-center">
                                  <Calendar className="mr-1 h-4 w-4" />
                                  {new Date(event.date).toLocaleDateString('pt-BR')}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="mr-1 h-4 w-4" />
                                  {event.time}
                                </span>
                                <Badge variant="outline" className="text-xs">{event.discipline}</Badge>
                              </div>
                            </div>
                          </div>
                          <Badge variant={priorityBadge.variant}>
                            {priorityBadge.text}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgendaAcademica;