import { useState, useMemo } from "react";
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

interface NotaAcademica {
  id: string;
  disciplina: string;
  tipoAvaliacao: 'Prova' | 'Trabalho' | 'Seminário' | 'Projeto' | 'Participação' | 'Outro';
  descricao: string;
  nota: number;
  pesoNota: number;
  dataAvaliacao: Date;
  observacoes?: string;
  status: 'Aprovado' | 'Reprovado' | 'Pendente';
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
  
  const [notasAcademicas, setNotasAcademicas] = useState<NotaAcademica[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNewNotaOpen, setIsNewNotaOpen] = useState(false);
  const [editingNota, setEditingNota] = useState<NotaAcademica | null>(null);
  
  // Form states
  const [disciplina, setDisciplina] = useState("");
  const [tipoAvaliacao, setTipoAvaliacao] = useState<'Prova' | 'Trabalho' | 'Seminário' | 'Projeto' | 'Participação' | 'Outro'>('Prova');
  const [descricao, setDescricao] = useState("");
  const [nota, setNota] = useState("");
  const [pesoNota, setPesoNota] = useState("");
  const [dataAvaliacao, setDataAvaliacao] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const resetForm = () => {
    setDisciplina("");
    setTipoAvaliacao('Prova');
    setDescricao("");
    setNota("");
    setPesoNota("");
    setDataAvaliacao("");
    setObservacoes("");
  };

  const handleSaveNota = () => {
    if (!disciplina || !descricao.trim() || !nota || !pesoNota || !dataAvaliacao) {
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

    const notaData: NotaAcademica = {
      id: editingNota?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      disciplina,
      tipoAvaliacao,
      descricao: descricao.trim(),
      nota: notaValue,
      pesoNota: pesoValue,
      dataAvaliacao: new Date(dataAvaliacao),
      observacoes: observacoes.trim() || undefined,
      status: notaValue >= 7.0 ? 'Aprovado' : notaValue >= 5.0 ? 'Pendente' : 'Reprovado'
    };

    if (editingNota) {
      setNotasAcademicas(prev => prev.map(n => n.id === editingNota.id ? notaData : n));
      toast({
        title: "Nota atualizada",
        description: "Suas alterações foram salvas com sucesso.",
      });
    } else {
      setNotasAcademicas(prev => [...prev, notaData]);
      toast({
        title: "Nova nota registrada",
        description: "A nota foi salva com sucesso.",
      });
    }

    resetForm();
    setIsNewNotaOpen(false);
    setEditingNota(null);
  };

  const handleEditNota = (nota: NotaAcademica) => {
    setEditingNota(nota);
    setDisciplina(nota.disciplina);
    setTipoAvaliacao(nota.tipoAvaliacao);
    setDescricao(nota.descricao);
    setNota(nota.nota.toString());
    setPesoNota(nota.pesoNota.toString());
    setDataAvaliacao(nota.dataAvaliacao.toISOString().split('T')[0]);
    setObservacoes(nota.observacoes || "");
    setIsNewNotaOpen(true);
  };

  const handleDeleteNota = (notaId: string) => {
    setNotasAcademicas(prev => prev.filter(n => n.id !== notaId));
    toast({
      title: "Nota excluída",
      description: "A nota foi removida com sucesso.",
    });
  };

  // Cálculos acadêmicos
  const disciplinasComNotas = useMemo(() => {
    const disciplinasMap = new Map<string, NotaAcademica[]>();
    
    notasAcademicas.forEach(nota => {
      if (!disciplinasMap.has(nota.disciplina)) {
        disciplinasMap.set(nota.disciplina, []);
      }
      disciplinasMap.get(nota.disciplina)!.push(nota);
    });

    return Array.from(disciplinasMap.entries()).map(([nome, notas]) => {
      const somaNotas = notas.reduce((acc, nota) => acc + (nota.nota * nota.pesoNota), 0);
      const somaPesos = notas.reduce((acc, nota) => acc + nota.pesoNota, 0);
      const media = somaPesos > 0 ? somaNotas / somaPesos : 0;
      const status = media >= 7.0 ? 'Aprovado' : media >= 5.0 ? 'Pendente' : 'Reprovado';
      
      return {
        nome,
        notas,
        media: parseFloat(media.toFixed(2)),
        status,
        totalAvaliacoes: notas.length
      };
    });
  }, [notasAcademicas]);

  const estatisticas = useMemo(() => {
    const totalNotas = notasAcademicas.length;
    const totalDisciplinas = disciplinasComNotas.length;
    const mediaGeral = disciplinasComNotas.length > 0 
      ? parseFloat((disciplinasComNotas.reduce((acc, d) => acc + d.media, 0) / disciplinasComNotas.length).toFixed(2))
      : 0;
    
    const disciplinaAprovadas = disciplinasComNotas.filter(d => d.status === 'Aprovado').length;
    
    return {
      totalNotas,
      totalDisciplinas,
      mediaGeral,
      disciplinaAprovadas,
      percentualAprovacao: totalDisciplinas > 0 ? Math.round((disciplinaAprovadas / totalDisciplinas) * 100) : 0
    };
  }, [disciplinasComNotas]);

  const filteredDisciplinas = disciplinasComNotas.filter(disciplina => {
    const matchesSearch = disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === "all" || disciplina.nome === selectedDiscipline;
    
    return matchesSearch && matchesDiscipline;
  });

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
              <h1 className="text-3xl font-bold text-foreground">Desempenho Acadêmico</h1>
              <p className="text-muted-foreground">Acompanhe suas notas e médias por disciplina</p>
            </div>
            <Dialog open={isNewNotaOpen} onOpenChange={setIsNewNotaOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-agro-green hover:bg-agro-green-light">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Nota
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingNota ? "Editar Nota" : "Registrar Nova Nota"}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="disciplina">Disciplina *</Label>
                      <Select value={disciplina} onValueChange={setDisciplina}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          {disciplinas.map(disc => (
                            <SelectItem key={disc} value={disc}>{disc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tipoAvaliacao">Tipo de Avaliação *</Label>
                      <Select value={tipoAvaliacao} onValueChange={(value: any) => setTipoAvaliacao(value)}>
                        <SelectTrigger>
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
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Input
                      id="descricao"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Ex: P1 - Primeira Prova, Trabalho Final, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="nota">Nota (0-10) *</Label>
                      <Input
                        id="nota"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        placeholder="8.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pesoNota">Peso da Nota *</Label>
                      <Input
                        id="pesoNota"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={pesoNota}
                        onChange={(e) => setPesoNota(e.target.value)}
                        placeholder="2.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataAvaliacao">Data da Avaliação *</Label>
                      <Input
                        id="dataAvaliacao"
                        type="date"
                        value={dataAvaliacao}
                        onChange={(e) => setDataAvaliacao(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Input
                      id="observacoes"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Comentários adicionais sobre a avaliação"
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsNewNotaOpen(false);
                      setEditingNota(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveNota} className="bg-agro-green hover:bg-agro-green-light">
                    {editingNota ? "Salvar Alterações" : "Registrar Nota"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Dashboard com Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calculator className="h-8 w-8 text-agro-green" />
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.mediaGeral.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Média Geral</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-agro-sky" />
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.totalDisciplinas}</p>
                    <p className="text-sm text-muted-foreground">Disciplinas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="h-8 w-8 text-agro-earth" />
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.totalNotas}</p>
                    <p className="text-sm text-muted-foreground">Avaliações</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{estatisticas.percentualAprovacao}%</p>
                    <p className="text-sm text-muted-foreground">Aprovação</p>
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
                    placeholder="Buscar disciplinas..."
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
            </div>
          </CardContent>
        </Card>

        {/* Disciplinas Grid */}
        {filteredDisciplinas.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma nota registrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece registrando suas primeiras notas para acompanhar seu desempenho.
              </p>
              <Button 
                onClick={() => setIsNewNotaOpen(true)}
                className="bg-agro-green hover:bg-agro-green-light"
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar Primeira Nota
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredDisciplinas.map((disciplina) => (
              <Card key={disciplina.nome} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{disciplina.nome}</CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-foreground">
                            {disciplina.media.toFixed(1)}
                          </span>
                          <Badge 
                            variant={
                              disciplina.status === 'Aprovado' ? 'default' : 
                              disciplina.status === 'Pendente' ? 'secondary' : 
                              'destructive'
                            }
                            className={
                              disciplina.status === 'Aprovado' ? 'bg-green-100 text-green-800 border-green-200' :
                              disciplina.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            }
                          >
                            {disciplina.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {disciplina.totalAvaliacoes} avaliação{disciplina.totalAvaliacoes !== 1 ? 'ões' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress 
                        value={Math.min(disciplina.media * 10, 100)} 
                        className="w-24 h-2 mb-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        Progresso: {Math.min(disciplina.media * 10, 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {disciplina.notas.map((nota) => (
                      <div key={nota.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {nota.tipoAvaliacao}
                            </Badge>
                            <span className="font-medium">{nota.descricao}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {nota.dataAvaliacao.toLocaleDateString()}
                            </span>
                            <span>Peso: {nota.pesoNota}</span>
                            {nota.observacoes && (
                              <span className="truncate max-w-40">{nota.observacoes}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-lg font-bold">{nota.nota.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">/ 10</div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditNota(nota)}
                              className="h-8 w-8"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteNota(nota.id)}
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
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notas;