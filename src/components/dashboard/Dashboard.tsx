import { BookOpen, Calendar, FileText, MapPin, PlusCircle, Clock, Target, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import heroImage from "@/assets/agrovita-hero.jpg";
import studentImage from "@/assets/student-studying-plants.jpg";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Anotações Feitas" value="127" icon={BookOpen} description="+12 esta semana" variant="green" />
        <StatsCard title="Próximos Eventos" value="5" icon={Calendar} description="3 provas este mês" variant="sky" />
        <StatsCard title="PDFs Salvos" value="43" icon={FileText} description="2.1 GB de conteúdo" variant="earth" />
        <StatsCard title="Visitas de Campo" value="8" icon={MapPin} description="Última: há 3 dias" variant="green" />
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
            {[
              {
                activity: "Prova de Fitotecnia",
                details: "Sexta-feira, 22/11 - 14:00h",
                type: "exam",
                priority: "high"
              },
              {
                activity: "Entrega de Relatório - Solos",
                details: "Segunda-feira, 25/11 - 23:59h",
                type: "assignment",
                priority: "medium"
              },
              {
                activity: "Visita Técnica - Fazenda Experimental",
                details: "Quarta-feira, 27/11 - 08:00h",
                type: "visit",
                priority: "medium"
              },
              {
                activity: "Seminário de Agroecologia",
                details: "Quinta-feira, 28/11 - 10:00h",
                type: "seminar",
                priority: "low"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  item.priority === 'high' ? 'bg-red-500' : 
                  item.priority === 'medium' ? 'bg-yellow-500' : 'bg-agro-green'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.activity}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{item.details}</p>
                </div>
              </div>
            ))}
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
            {[
              {
                name: "Solos",
                notes: 23,
                progress: 75,
                color: "bg-agro-earth"
              },
              {
                name: "Fitotecnia",
                notes: 18,
                progress: 60,
                color: "bg-agro-green"
              },
              {
                name: "Agroecologia",
                notes: 15,
                progress: 45,
                color: "bg-agro-field"
              }
            ].map((subject, index) => (
              <div key={index} className="p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm sm:text-base">{subject.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{subject.notes} anotações</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};