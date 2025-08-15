import { useState } from "react";
import { MapPin, Plus, Camera, Thermometer, Droplets, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const VisitasTecnicas = () => {
  const visits = [
    {
      id: 1,
      location: "Fazenda Experimental UNESP",
      date: "2024-11-20",
      time: "14:30",
      type: "Produção Vegetal",
      weather: { temp: "28°C", humidity: "65%", condition: "Ensolarado" },
      objectives: "Observar técnicas de plantio direto e sistema de irrigação",
      learnings: "Compreendeu a importância da cobertura do solo e rotação de culturas",
      photos: 5,
      status: "completed"
    },
    {
      id: 2,
      location: "Estação Pecuária IFSP",
      date: "2024-11-15",
      time: "08:00",
      type: "Zootecnia",
      weather: { temp: "22°C", humidity: "70%", condition: "Parcialmente nublado" },
      objectives: "Estudar manejo reprodutivo em bovinos de leite",
      learnings: "Aprendeu sobre inseminação artificial e detecção de cio",
      photos: 8,
      status: "completed"
    },
    {
      id: 3,
      location: "Cooperativa Agrícola Regional",
      date: "2024-12-02",
      time: "09:00",
      type: "Agronegócio",
      weather: null,
      objectives: "Conhecer processos de beneficiamento e comercialização",
      learnings: "",
      photos: 0,
      status: "scheduled"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return { text: 'Concluída', variant: 'default' as const };
      case 'scheduled': return { text: 'Agendada', variant: 'secondary' as const };
      case 'cancelled': return { text: 'Cancelada', variant: 'destructive' as const };
      default: return { text: 'Pendente', variant: 'outline' as const };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Produção Vegetal': return 'bg-agro-green';
      case 'Zootecnia': return 'bg-agro-earth';
      case 'Agronegócio': return 'bg-agro-sky';
      case 'Agroecologia': return 'bg-agro-field';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeSection="visitas" onSectionChange={() => {}} />
        <main className="flex-1 p-4 sm:p-6 lg:ml-64">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                  <MapPin className="mr-3 h-7 w-7 text-agro-field" />
                  Visitas Técnicas
                </h1>
                <p className="text-muted-foreground mt-1">Registre experiências de campo ou pecuária</p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Visita
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Registrar Visita Técnica</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Local da visita" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input type="date" />
                      <Input type="time" />
                    </div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Área de estudo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="producao-vegetal">Produção Vegetal</SelectItem>
                        <SelectItem value="zootecnia">Zootecnia</SelectItem>
                        <SelectItem value="agronegocio">Agronegócio</SelectItem>
                        <SelectItem value="agroecologia">Agroecologia</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Objetivos da visita..." rows={3} />
                    <div className="grid grid-cols-3 gap-4">
                      <Input placeholder="Temperatura" />
                      <Input placeholder="Umidade" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Clima" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ensolarado">Ensolarado</SelectItem>
                          <SelectItem value="nublado">Nublado</SelectItem>
                          <SelectItem value="chuvoso">Chuvoso</SelectItem>
                          <SelectItem value="parcial">Parcialmente nublado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea placeholder="Principais aprendizados..." rows={4} />
                    <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                      <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Clique para adicionar fotos</p>
                    </div>
                    <Button className="w-full">Salvar Visita</Button>
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
                      <p className="text-sm text-muted-foreground">Total de Visitas</p>
                      <p className="text-2xl font-bold text-agro-green">8</p>
                    </div>
                    <MapPin className="h-8 w-8 text-agro-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Este Mês</p>
                      <p className="text-2xl font-bold text-agro-sky">3</p>
                    </div>
                    <Calendar className="h-8 w-8 text-agro-sky" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Fotos Capturadas</p>
                      <p className="text-2xl font-bold text-agro-earth">47</p>
                    </div>
                    <Camera className="h-8 w-8 text-agro-earth" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Próximas</p>
                      <p className="text-2xl font-bold text-agro-field">1</p>
                    </div>
                    <Clock className="h-8 w-8 text-agro-field" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visits List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {visits.map(visit => {
                const statusBadge = getStatusBadge(visit.status);
                
                return (
                  <Card key={visit.id} className="hover:shadow-md transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-4 h-4 rounded-full ${getTypeColor(visit.type)} mt-1`}></div>
                          <div>
                            <CardTitle className="text-lg">{visit.location}</CardTitle>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4" />
                                {new Date(visit.date).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center">
                                <Clock className="mr-1 h-4 w-4" />
                                {visit.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.text}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Badge variant="outline">{visit.type}</Badge>
                        </div>
                        
                        {visit.weather && (
                          <div className="flex items-center space-x-4 text-sm bg-muted/50 p-3 rounded-lg">
                            <span className="flex items-center">
                              <Thermometer className="mr-1 h-4 w-4 text-red-500" />
                              {visit.weather.temp}
                            </span>
                            <span className="flex items-center">
                              <Droplets className="mr-1 h-4 w-4 text-blue-500" />
                              {visit.weather.humidity}
                            </span>
                            <span className="text-muted-foreground">{visit.weather.condition}</span>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium text-sm mb-1">Objetivos:</h4>
                          <p className="text-sm text-muted-foreground">{visit.objectives}</p>
                        </div>
                        
                        {visit.learnings && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Aprendizados:</h4>
                            <p className="text-sm text-muted-foreground">{visit.learnings}</p>
                          </div>
                        )}
                        
                        {visit.photos > 0 && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Camera className="mr-1 h-4 w-4" />
                            {visit.photos} foto{visit.photos > 1 ? 's' : ''} anexada{visit.photos > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitasTecnicas;