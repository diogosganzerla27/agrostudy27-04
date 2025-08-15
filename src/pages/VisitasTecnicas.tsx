import { useState, useRef } from "react";
import { MapPin, Plus, Camera, Thermometer, Droplets, Calendar, Clock, ArrowLeft, X, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const VisitasTecnicas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para UI
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para formulário
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    time: "",
    type: "",
    objectives: "",
    temperature: "",
    humidity: "",
    weather: "",
    learnings: ""
  });
  
  // Estado para fotos
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  
  // Estado para lista de visitas
  const [visits, setVisits] = useState([
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
  ]);

  // Funções auxiliares
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

  // Funções de formulário
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função de upload de fotos
  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newPhotos = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isImage) {
        toast({
          title: "Erro",
          description: "Apenas arquivos de imagem são permitidos.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "Erro", 
          description: "Arquivo muito grande. Máximo 5MB por foto.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    setSelectedPhotos(prev => [...prev, ...newPhotos]);
  };

  // Remover foto
  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Salvar visita
  const handleSaveVisit = async () => {
    // Validação
    if (!formData.location || !formData.date || !formData.type || !formData.objectives) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simula salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVisit = {
        id: visits.length + 1,
        location: formData.location,
        date: formData.date,
        time: formData.time || "08:00",
        type: formData.type,
        weather: formData.temperature || formData.humidity || formData.weather ? {
          temp: formData.temperature || "N/A",
          humidity: formData.humidity || "N/A", 
          condition: formData.weather || "N/A"
        } : null,
        objectives: formData.objectives,
        learnings: formData.learnings,
        photos: selectedPhotos.length,
        status: new Date(formData.date) > new Date() ? "scheduled" : "completed"
      };
      
      setVisits(prev => [newVisit, ...prev]);
      
      // Reset form
      setFormData({
        location: "",
        date: "",
        time: "",
        type: "",
        objectives: "",
        temperature: "",
        humidity: "",
        weather: "",
        learnings: ""
      });
      setSelectedPhotos([]);
      setDialogOpen(false);
      
      toast({
        title: "Sucesso!",
        description: "Visita técnica salva com sucesso.",
      });
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a visita.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Confirmar antes de fechar dialog se há dados
  const handleDialogClose = () => {
    const hasData = Object.values(formData).some(value => value.trim() !== '') || selectedPhotos.length > 0;
    
    if (hasData) {
      if (window.confirm('Tem certeza que deseja fechar? Os dados não salvos serão perdidos.')) {
        setFormData({
          location: "",
          date: "",
          time: "",
          type: "",
          objectives: "",
          temperature: "",
          humidity: "",
          weather: "",
          learnings: ""
        });
        setSelectedPhotos([]);
        setDialogOpen(false);
      }
    } else {
      setDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar 
            activeSection="visitas" 
            onSectionChange={() => {}} 
            onClose={() => setMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>
      
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar activeSection="visitas" onSectionChange={() => {}} />
        </div>
        <main className="flex-1 p-3 sm:p-4 lg:p-6 lg:ml-64">
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center">
                    <MapPin className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-agro-field shrink-0" />
                    <span className="truncate">Visitas Técnicas</span>
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">Registre experiências de campo ou pecuária</p>
                </div>
              </div>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto self-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Visita
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto m-2 sm:m-6">
                  <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <DialogTitle>Registrar Visita Técnica</DialogTitle>
                    <DialogClose asChild>
                      <Button variant="ghost" size="icon" onClick={handleDialogClose}>
                        <X className="h-4 w-4" />
                      </Button>
                    </DialogClose>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <Input 
                      placeholder="Local da visita *" 
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                      />
                      <Input 
                        type="time" 
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                      />
                    </div>
                    
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Área de estudo *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Produção Vegetal">Produção Vegetal</SelectItem>
                        <SelectItem value="Zootecnia">Zootecnia</SelectItem>
                        <SelectItem value="Agronegócio">Agronegócio</SelectItem>
                        <SelectItem value="Agroecologia">Agroecologia</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Textarea 
                      placeholder="Objetivos da visita... *" 
                      rows={3} 
                      value={formData.objectives}
                      onChange={(e) => handleInputChange('objectives', e.target.value)}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input 
                        placeholder="Temperatura" 
                        value={formData.temperature}
                        onChange={(e) => handleInputChange('temperature', e.target.value)}
                      />
                      <Input 
                        placeholder="Umidade" 
                        value={formData.humidity}
                        onChange={(e) => handleInputChange('humidity', e.target.value)}
                      />
                      <Select value={formData.weather} onValueChange={(value) => handleInputChange('weather', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Clima" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ensolarado">Ensolarado</SelectItem>
                          <SelectItem value="Nublado">Nublado</SelectItem>
                          <SelectItem value="Chuvoso">Chuvoso</SelectItem>
                          <SelectItem value="Parcialmente nublado">Parcialmente nublado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Textarea 
                      placeholder="Principais aprendizados..." 
                      rows={4} 
                      value={formData.learnings}
                      onChange={(e) => handleInputChange('learnings', e.target.value)}
                    />
                    
                    {/* Upload de fotos */}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e.target.files)}
                      />
                      
                      <div 
                        className="border-2 border-dashed border-muted rounded-lg p-4 text-center cursor-pointer hover:border-agro-green transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePhotoUpload(e.dataTransfer.files);
                        }}
                      >
                        <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Clique para adicionar fotos ou arraste aqui
                        </p>
                        {selectedPhotos.length > 0 && (
                          <p className="text-xs text-agro-green mt-1">
                            {selectedPhotos.length} foto{selectedPhotos.length > 1 ? 's' : ''} selecionada{selectedPhotos.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      
                      {/* Preview das fotos */}
                      {selectedPhotos.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                          {selectedPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Foto ${index + 1}`}
                                className="w-full h-16 object-cover rounded border"
                              />
                              <Button 
                                variant="destructive" 
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removePhoto(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Botões */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleDialogClose}
                        className="sm:w-auto"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        className="sm:flex-1" 
                        onClick={handleSaveVisit}
                        disabled={loading}
                      >
                        {loading ? "Salvando..." : "Salvar Visita"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">Total de Visitas</p>
                      <p className="text-lg sm:text-2xl font-bold text-agro-green">{visits.length}</p>
                    </div>
                    <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-agro-green shrink-0" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">Este Mês</p>
                      <p className="text-lg sm:text-2xl font-bold text-agro-sky">
                        {visits.filter(v => {
                          const visitDate = new Date(v.date);
                          const now = new Date();
                          return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear();
                        }).length}
                      </p>
                    </div>
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-agro-sky shrink-0" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">Fotos Capturadas</p>
                      <p className="text-lg sm:text-2xl font-bold text-agro-earth">
                        {visits.reduce((acc, visit) => acc + visit.photos, 0)}
                      </p>
                    </div>
                    <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-agro-earth shrink-0" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">Próximas</p>
                      <p className="text-lg sm:text-2xl font-bold text-agro-field">
                        {visits.filter(v => new Date(v.date) > new Date()).length}
                      </p>
                    </div>
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-agro-field shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visits List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {visits.map(visit => {
                const statusBadge = getStatusBadge(visit.status);
                
                return (
                  <Card key={visit.id} className="hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${getTypeColor(visit.type)} mt-1 shrink-0`}></div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg truncate">{visit.location}</CardTitle>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 text-xs sm:text-sm text-muted-foreground gap-1 sm:gap-0">
                              <span className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                                {new Date(visit.date).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center">
                                <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                                {visit.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={statusBadge.variant} className="text-xs shrink-0">
                          {statusBadge.text}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <Badge variant="outline" className="text-xs">{visit.type}</Badge>
                        </div>
                        
                        {visit.weather && (
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm bg-muted/50 p-2 sm:p-3 rounded-lg">
                            <span className="flex items-center">
                              <Thermometer className="mr-1 h-3 w-3 sm:h-4 sm:w-4 text-red-500 shrink-0" />
                              <span className="truncate">{visit.weather.temp}</span>
                            </span>
                            <span className="flex items-center">
                              <Droplets className="mr-1 h-3 w-3 sm:h-4 sm:w-4 text-blue-500 shrink-0" />
                              <span className="truncate">{visit.weather.humidity}</span>
                            </span>
                            <span className="text-muted-foreground truncate">{visit.weather.condition}</span>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium text-xs sm:text-sm mb-1">Objetivos:</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{visit.objectives}</p>
                        </div>
                        
                        {visit.learnings && (
                          <div>
                            <h4 className="font-medium text-xs sm:text-sm mb-1">Aprendizados:</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{visit.learnings}</p>
                          </div>
                        )}
                        
                        {visit.photos > 0 && (
                          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                            <Camera className="mr-1 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                            <span className="truncate">{visit.photos} foto{visit.photos > 1 ? 's' : ''} anexada{visit.photos > 1 ? 's' : ''}</span>
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