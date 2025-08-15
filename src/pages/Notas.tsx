import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Plus, 
  Search, 
  TrendingUp, 
  BookOpen,
  Edit3, 
  Trash2, 
  Target,
  Calendar,
  ArrowLeft,
  Award,
  Calculator,
  BarChart3,
  ClipboardCheck,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { Progress } from "@/components/ui/progress";
import { useSubjects } from "@/hooks/useSubjects";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Grade {
  id: string;
  subject_id: string;
  assessment_type: string;
  title: string;
  grade: number;
  weight: number;
  date: string;
  user_id: string;
}

const tiposAvaliacao = [
  'Prova',
  'Trabalho', 
  'Seminário',
  'Projeto',
  'Participação',
  'Outro'
] as const;

const Notas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { subjects, loading: subjectsLoading } = useSubjects();
  
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNewNotaOpen, setIsNewNotaOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  
  // Form states
  const [subjectId, setSubjectId] = useState("");
  const [tipoAvaliacao, setTipoAvaliacao] = useState<'Prova' | 'Trabalho' | 'Seminário' | 'Projeto' | 'Participação' | 'Outro'>('Prova');
  const [title, setTitle] = useState("");
  const [nota, setNota] = useState("");
  const [pesoNota, setPesoNota] = useState("");
  const [dataAvaliacao, setDataAvaliacao] = useState("");

  // Load grades from Supabase
  useEffect(() => {
    if (user) {
      loadGrades();
    }
  }, [user]);

  const loadGrades = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setGrades(data || []);
    } catch (error) {
      console.error('Error loading grades:', error);
      toast({
        title: "Erro ao carregar notas",
        description: "Não foi possível carregar suas notas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const resetForm = () => {
    setSubjectId("");
    setTipoAvaliacao('Prova');
    setTitle("");
    setNota("");
    setPesoNota("");
    setDataAvaliacao("");
  };

  const handleSaveNota = async () => {
    if (!subjectId || !title.trim() || !nota || !pesoNota || !dataAvaliacao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const notaValue = parseFloat(nota);
    const pesoValue = parseFloat(pesoNota);

    if (notaValue < 0 || notaValue > 10) {
      toast({
        title: "Nota inválida",
        description: "A nota deve estar entre 0 e 10.",
        variant: "destructive",
      });
      return;
    }

    if (pesoValue <= 0) {
      toast({
        title: "Peso inválido", 
        description: "O peso deve ser maior que 0.",
        variant: "destructive",
      });
      return;
    }

    try {
      const gradeData = {
        subject_id: subjectId,
        assessment_type: tipoAvaliacao,
        title: title.trim(),
        grade: notaValue,
        weight: pesoValue,
        date: dataAvaliacao,
        user_id: user!.id,
      };

      if (editingGrade) {
        const { error } = await supabase
          .from('grades')
          .update(gradeData)
          .eq('id', editingGrade.id)
          .eq('user_id', user!.id);

        if (error) throw error;

        toast({
          title: "Nota atualizada",
          description: "Suas alterações foram salvas com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('grades')
          .insert(gradeData);

        if (error) throw error;

        toast({
          title: "Nova nota registrada",
          description: "A nota foi salva com sucesso.",
        });
      }

      resetForm();
      setIsNewNotaOpen(false);
      setEditingGrade(null);
      loadGrades();
    } catch (error) {
      console.error('Error saving grade:', error);
      toast({
        title: "Erro ao salvar nota",
        description: "Não foi possível salvar a nota. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditNota = (grade: Grade) => {
    setEditingGrade(grade);
    setSubjectId(grade.subject_id);
    setTipoAvaliacao(grade.assessment_type as any);
    setTitle(grade.title);
    setNota(grade.grade.toString());
    setPesoNota(grade.weight.toString());
    setDataAvaliacao(grade.date);
    setIsNewNotaOpen(true);
  };

  const handleDeleteNota = async (gradeId: string) => {
    try {
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', gradeId)
        .eq('user_id', user!.id);

      if (error) throw error;

      toast({
        title: "Nota excluída",
        description: "A nota foi removida com sucesso.",
      });

      loadGrades();
    } catch (error) {
      console.error('Error deleting grade:', error);
      toast({
        title: "Erro ao excluir nota",
        description: "Não foi possível excluir a nota. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Cálculos acadêmicos
  const subjectsWithGrades = useMemo(() => {
    const subjectsMap = new Map();
    
    subjects.forEach(subject => {
      subjectsMap.set(subject.id, {
        ...subject,
        grades: grades.filter(grade => grade.subject_id === subject.id)
      });
    });

    return Array.from(subjectsMap.values()).map((subject: any) => {
      const subjectGrades = subject.grades;
      
      if (subjectGrades.length === 0) {
        return {
          ...subject,
          media: 0,
          status: 'Sem notas',
          totalAvaliacoes: 0
        };
      }

      const somaNotas = subjectGrades.reduce((acc: number, grade: Grade) => acc + (grade.grade * grade.weight), 0);
      const somaPesos = subjectGrades.reduce((acc: number, grade: Grade) => acc + grade.weight, 0);
      const media = somaPesos > 0 ? somaNotas / somaPesos : 0;
      const status = media >= 7.0 ? 'Aprovado' : media >= 5.0 ? 'Pendente' : 'Reprovado';
      
      return {
        ...subject,
        grades: subjectGrades,
        media: parseFloat(media.toFixed(2)),
        status,
        totalAvaliacoes: subjectGrades.length
      };
    });
  }, [subjects, grades]);

  const estatisticas = useMemo(() => {
    const totalNotas = grades.length;
    const totalDisciplinas = subjects.length;
    const subjectsWithData = subjectsWithGrades.filter(s => s.totalAvaliacoes > 0);
    const mediaGeral = subjectsWithData.length > 0 
      ? parseFloat((subjectsWithData.reduce((acc, d) => acc + d.media, 0) / subjectsWithData.length).toFixed(2))
      : 0;
    
    const disciplinaAprovadas = subjectsWithData.filter(d => d.status === 'Aprovado').length;
    
    return {
      totalNotas,
      totalDisciplinas: subjectsWithData.length,
      mediaGeral,
      disciplinaAprovadas,
      percentualAprovacao: subjectsWithData.length > 0 ? Math.round((disciplinaAprovadas / subjectsWithData.length) * 100) : 0
    };
  }, [subjectsWithGrades, grades, subjects]);

  const filteredSubjects = subjectsWithGrades.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubjectId === "all" || subject.id === selectedSubjectId;
    
    return matchesSearch && matchesSubject;
  });

  if (loading || subjectsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMenuClick={handleMenuClick} />
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-center h-40">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-agro-green/10 flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Desempenho Acadêmico</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Acompanhe suas notas e médias por disciplina</p>
            </div>
            <Dialog open={isNewNotaOpen} onOpenChange={setIsNewNotaOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-agro-green hover:bg-agro-green-light w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="sm:hidden">Registrar</span>
                  <span className="hidden sm:inline">Registrar Nota</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-3 sm:mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">
                    {editingGrade ? "Editar Nota" : "Registrar Nova Nota"}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject" className="text-sm font-medium">Disciplina *</Label>
                      <Select value={subjectId} onValueChange={setSubjectId}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tipoAvaliacao" className="text-sm font-medium">Tipo de Avaliação *</Label>
                      <Select value={tipoAvaliacao} onValueChange={(value: any) => setTipoAvaliacao(value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposAvaliacao.map(tipo => (
                            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">Título *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: P1 - Primeira Prova"
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0">
                    <div>
                      <Label htmlFor="nota" className="text-sm font-medium">Nota (0-10) *</Label>
                      <Input
                        id="nota"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        placeholder="8.5"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pesoNota" className="text-sm font-medium">Peso *</Label>
                      <Input
                        id="pesoNota"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={pesoNota}
                        onChange={(e) => setPesoNota(e.target.value)}
                        placeholder="2.0"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataAvaliacao" className="text-sm font-medium">Data *</Label>
                      <Input
                        id="dataAvaliacao"
                        type="date"
                        value={dataAvaliacao}
                        onChange={(e) => setDataAvaliacao(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsNewNotaOpen(false);
                      setEditingGrade(null);
                      resetForm();
                    }}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveNota} className="bg-agro-green hover:bg-agro-green-light w-full sm:w-auto order-1 sm:order-2">
                    {editingGrade ? "Salvar" : "Registrar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Dashboard com Estatísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3">
                  <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-agro-green flex-shrink-0" />
                  <div className="text-center sm:text-left">
                    <p className="text-lg sm:text-2xl font-bold">{estatisticas.mediaGeral.toFixed(1)}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Média Geral</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-agro-sky flex-shrink-0" />
                  <div className="text-center sm:text-left">
                    <p className="text-lg sm:text-2xl font-bold">{estatisticas.totalDisciplinas}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Disciplinas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3">
                  <ClipboardCheck className="h-6 w-6 sm:h-8 sm:w-8 text-agro-earth flex-shrink-0" />
                  <div className="text-center sm:text-left">
                    <p className="text-lg sm:text-2xl font-bold">{estatisticas.totalNotas}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Avaliações</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-accent flex-shrink-0" />
                  <div className="text-center sm:text-left">
                    <p className="text-lg sm:text-2xl font-bold">{estatisticas.percentualAprovacao}%</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Aprovação</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="pt-4 sm:pt-6">
            <div className="space-y-3 sm:flex sm:flex-row sm:gap-4 sm:items-center sm:space-y-0">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar disciplinas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as disciplinas</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Disciplinas Grid */}
        {filteredSubjects.length === 0 ? (
          <Card className="text-center py-8 sm:py-12">
            <CardContent>
              <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium mb-2">Nenhuma disciplina encontrada</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
                {subjects.length === 0 
                  ? "Configure primeiro suas disciplinas em Configurações" 
                  : "Comece registrando suas primeiras notas para acompanhar seu desempenho."
                }
              </p>
              {subjects.length > 0 && (
                <Button 
                  onClick={() => setIsNewNotaOpen(true)}
                  className="bg-agro-green hover:bg-agro-green-light w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primeira Nota
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredSubjects.map((subject) => (
              <Card key={subject.id} className="overflow-hidden" style={{ borderLeft: `4px solid ${subject.color}` }}>
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl mb-2 truncate">{subject.name}</CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl font-bold text-foreground">
                            {subject.media.toFixed(1)}
                          </span>
                          <Badge 
                            variant={
                              subject.status === 'Aprovado' ? 'default' : 
                              subject.status === 'Pendente' ? 'secondary' : 
                              'destructive'
                            }
                            className={
                              subject.status === 'Aprovado' ? 'bg-green-100 text-green-800 border-green-200' :
                              subject.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              subject.status === 'Sem notas' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            }
                          >
                            {subject.status}
                          </Badge>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {subject.totalAvaliacoes} avaliação{subject.totalAvaliacoes !== 1 ? 'ões' : ''}
                        </div>
                      </div>
                    </div>
                    {subject.totalAvaliacoes > 0 && (
                      <div className="text-right flex-shrink-0">
                        <Progress 
                          value={Math.min(subject.media * 10, 100)} 
                          className="w-20 sm:w-24 h-2 mb-1 sm:mb-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {Math.min(subject.media * 10, 100).toFixed(0)}%
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                {subject.grades && subject.grades.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {subject.grades.map((grade: Grade) => (
                        <div key={grade.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/30 rounded-lg gap-3 sm:gap-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {grade.assessment_type}
                              </Badge>
                              <span className="font-medium text-sm sm:text-base truncate">{grade.title}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <span className="flex items-center gap-1 flex-shrink-0">
                                <Calendar className="h-3 w-3" />
                                {new Date(grade.date).toLocaleDateString()}
                              </span>
                              <span className="flex-shrink-0">Peso: {grade.weight}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-3">
                            <div className="text-right">
                              <div className="text-lg font-bold">{grade.grade.toFixed(1)}</div>
                              <div className="text-xs text-muted-foreground">/ 10</div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditNota(grade)}
                                className="h-8 w-8"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteNota(grade.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notas;