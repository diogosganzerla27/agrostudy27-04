import { BookOpen, Calendar, FileText, MapPin, PlusCircle, Clock, Target, Sprout, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import MiniChat from "./MiniChat";
import heroImage from "@/assets/agrovita-hero.jpg";
import studentImage from "@/assets/student-studying-plants.jpg";
import { useNavigate } from "react-router-dom";
import { useNotes } from "@/hooks/useNotes";
import { useEvents } from "@/hooks/useEvents";
import { useVisits } from "@/hooks/useVisits";
import { useSubjects } from "@/hooks/useSubjects";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { notes } = useNotes();
  const { events } = useEvents();
  const { visits } = useVisits();
  const { subjects } = useSubjects();

  // Calcular estatísticas reais
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.starts_at);
    const today = new Date();
    return eventDate >= today;
  }).slice(0, 4);

  const subjectsWithNotes = subjects.map(subject => ({
    ...subject,
    notesCount: notes.filter(note => note.subject_id === subject.id).length
  })).filter(subject => subject.notesCount > 0)
    .sort((a, b) => b.notesCount - a.notesCount)
    .slice(0, 3);
  
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative rounded-lg overflow-hidden" 
        style={{
          backgroundImage: `url(${studentImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-agro-green/80"></div>
        <div className="relative p-4 sm:p-8 text-white">
          {/* Logo e Nome */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
              <Sprout className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">AgroStudy</h1>
          </div>
          
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Bem-vindo ao futuro dos estudos agrícolas!</h2>
            <p className="text-base sm:text-lg opacity-90 mb-4">Sua plataforma completa para organizar a vida acadêmica no setor Agro. Gerencie anotações, arquivos, agenda e registre suas experiências de campo ou pecuária.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/caderno')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Anotação
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20" onClick={() => navigate('/visitas')}>
                <MapPin className="mr-2 h-4 w-4" />
                Registrar Visita
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Target className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-agro-green" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/caderno')}>
              <div className="flex items-center mb-2">
                <BookOpen className="mr-2 h-5 w-5 text-agro-green" />
                <h3 className="font-medium text-sm sm:text-base">Caderno Digital</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Organize anotações por disciplina</p>
            </div>
            <div className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/agenda')}>
              <div className="flex items-center mb-2">
                <Calendar className="mr-2 h-5 w-5 text-agro-sky" />
                <h3 className="font-medium text-sm sm:text-base">Agenda Acadêmica</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Provas, trabalhos e eventos importantes</p>
            </div>
            <div className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/visitas')}>
              <div className="flex items-center mb-2">
                <MapPin className="mr-2 h-5 w-5 text-agro-field" />
                <h3 className="font-medium text-sm sm:text-base">Visitas Técnicas</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Registre experiências de campo ou pecuária</p>
            </div>
            <div className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/biblioteca')}>
              <div className="flex items-center mb-2">
                <FileText className="mr-2 h-5 w-5 text-agro-earth" />
                <h3 className="font-medium text-sm sm:text-base">Biblioteca PDF</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Artigos e materiais de estudo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AgroStudy IA Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base sm:text-lg">
            <div className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-agro-green" />
              AgroStudy IA
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/agrostudy-ia')}
              className="bg-agro-green/10 border-agro-green/30 text-agro-green hover:bg-agro-green/20"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Chat Expandido
            </Button>
          </CardTitle>
          <CardDescription className="text-sm">Converse diretamente com sua assistente IA</CardDescription>
        </CardHeader>
        <CardContent>
          <MiniChat />
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Anotações Feitas" 
          value={notes.length.toString()} 
          icon={BookOpen} 
          description={`${notes.filter(note => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(note.created_at) >= weekAgo;
          }).length} esta semana`} 
          variant="green" 
        />
        <StatsCard 
          title="Próximos Eventos" 
          value={upcomingEvents.length.toString()} 
          icon={Calendar} 
          description={`${events.filter(e => e.type === 'prova').length} provas total`} 
          variant="sky" 
        />
        <StatsCard 
          title="Disciplinas Ativas" 
          value={subjects.length.toString()} 
          icon={FileText} 
          description={`${subjectsWithNotes.length} com anotações`} 
          variant="earth" 
        />
        <StatsCard 
          title="Visitas de Campo" 
          value={visits.length.toString()} 
          icon={MapPin} 
          description={visits.length > 0 ? `Última: ${new Date(visits[0]?.date || '').toLocaleDateString('pt-BR')}` : 'Nenhuma ainda'} 
          variant="green" 
        />
      </div>

      {/* Próximas Atividades */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-agro-green" />
            Próximas Atividades
          </CardTitle>
          <CardDescription className="text-sm">Seus compromissos acadêmicos mais importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma atividade próxima</p>
              </div>
            ) : (
              upcomingEvents.map((event, index) => {
                const eventDate = new Date(event.starts_at);
                const today = new Date();
                const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                
                let priority = 'low';
                if (event.type === 'prova' && diffDays <= 7) priority = 'high';
                else if (event.type === 'trabalho' && diffDays <= 3) priority = 'high';
                else if (diffDays <= 1) priority = 'high';
                else if (diffDays <= 7) priority = 'medium';
                
                return (
                  <div key={event.id} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      priority === 'high' ? 'bg-red-500' : 
                      priority === 'medium' ? 'bg-yellow-500' : 'bg-agro-green'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {eventDate.toLocaleDateString('pt-BR')} - {eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Disciplinas em Destaque */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Sprout className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-agro-green" />
            Disciplinas em Destaque
          </CardTitle>
          <CardDescription className="text-sm">Suas matérias mais ativas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {subjectsWithNotes.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Sprout className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma disciplina com anotações</p>
              </div>
            ) : (
              subjectsWithNotes.map((subject, index) => (
                <div key={subject.id} className="p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm sm:text-base">{subject.name}</h3>
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: subject.color }}></div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{subject.notesCount} anotações</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};