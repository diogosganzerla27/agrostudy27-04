import { useState, useEffect } from "react";
import { Brain, Upload, FileText, Zap, Loader2, ArrowLeft, Target, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePdfLibrary } from "@/hooks/usePdfLibrary";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  topic: string;
  userAnswer?: number;
}

interface SimulatedExam {
  id: string;
  title: string;
  questions: Question[];
  duration: number;
  generatedAt: string;
  subject: string;
  totalQuestions: number;
  score?: number;
  completed?: boolean;
}

const SimuladoIA = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const [generatingExam, setGeneratingExam] = useState(false);
  const [generatedExams, setGeneratedExams] = useState<SimulatedExam[]>([]);
  const [currentExam, setCurrentExam] = useState<SimulatedExam | null>(null);
  const [examInProgress, setExamInProgress] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResult, setExamResult] = useState<{ score: number; correct: number; total: number } | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pdfs, loading } = usePdfLibrary();

  const handlePdfSelection = (pdfId: string) => {
    setSelectedPdfs(prev => 
      prev.includes(pdfId) 
        ? prev.filter(id => id !== pdfId)
        : [...prev, pdfId]
    );
  };

  const generateExam = async () => {
    if (selectedPdfs.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um PDF para gerar o simulado",
        variant: "destructive"
      });
      return;
    }

    setGeneratingExam(true);
    
    // Simular geração de prova baseada nos PDFs selecionados
    setTimeout(() => {
      const selectedPdfObjects = pdfs.filter(pdf => selectedPdfs.includes(pdf.id));
      const subject = selectedPdfObjects[0]?.category || "Geral";
      
      // Gerar questões baseadas nos PDFs selecionados (simulação)
      const mockQuestions: Question[] = [
        {
          id: "1",
          question: "Qual é o principal objetivo da agricultura sustentável?",
          options: [
            "Maximizar a produção a qualquer custo",
            "Equilibrar produtividade, sustentabilidade ambiental e viabilidade econômica",
            "Reduzir custos de produção",
            "Aumentar o uso de pesticidas"
          ],
          correctAnswer: 1,
          difficulty: "Médio",
          topic: "Sustentabilidade"
        },
        {
          id: "2",
          question: "O que caracteriza um sistema de plantio direto?",
          options: [
            "Preparo intensivo do solo",
            "Ausência de cobertura vegetal",
            "Não revolvimento do solo e manutenção da cobertura",
            "Uso exclusivo de fertilizantes químicos"
          ],
          correctAnswer: 2,
          difficulty: "Médio",
          topic: "Manejo do Solo"
        },
        {
          id: "3",
          question: "Qual a importância da rotação de culturas?",
          options: [
            "Apenas para diversificar a produção",
            "Melhorar a fertilidade do solo e quebrar ciclos de pragas",
            "Reduzir a necessidade de irrigação",
            "Aumentar o tamanho das plantas"
          ],
          correctAnswer: 1,
          difficulty: "Fácil",
          topic: "Rotação de Culturas"
        },
        {
          id: "4",
          question: "Quais são os principais nutrientes que as plantas necessitam?",
          options: [
            "Apenas água e luz solar",
            "Nitrogênio, fósforo e potássio (NPK)",
            "Somente carbono e oxigênio",
            "Apenas minerais do solo"
          ],
          correctAnswer: 1,
          difficulty: "Fácil",
          topic: "Nutrição Vegetal"
        },
        {
          id: "5",
          question: "O que é manejo integrado de pragas (MIP)?",
          options: [
            "Uso exclusivo de pesticidas químicos",
            "Estratégia que combina métodos biológicos, culturais e químicos",
            "Eliminação total de todos os insetos",
            "Uso apenas de métodos orgânicos"
          ],
          correctAnswer: 1,
          difficulty: "Difícil",
          topic: "Controle de Pragas"
        }
      ];

      const newExam: SimulatedExam = {
        id: Date.now().toString(),
        title: `Simulado - ${subject}`,
        questions: mockQuestions,
        duration: 45, // 45 minutos
        generatedAt: new Date().toISOString(),
        subject,
        totalQuestions: mockQuestions.length
      };

      setGeneratedExams(prev => [...prev, newExam]);
      setGeneratingExam(false);
      setSelectedPdfs([]);
      
      toast({
        title: "Simulado Gerado!",
        description: `Simulado criado com ${mockQuestions.length} questões baseadas nos PDFs selecionados`,
      });
    }, 3000);
  };

  const startExam = (exam: SimulatedExam) => {
    setCurrentExam(exam);
    setExamInProgress(true);
    setTimeRemaining(exam.duration * 60); // converter para segundos
    setCurrentQuestionIndex(0);
    setAnswers({});
    setExamCompleted(false);
    setExamResult(null);
  };

  // Timer do exame
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (examInProgress && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examInProgress, timeRemaining]);

  const submitAnswer = (questionId: string, answer: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const finishExam = () => {
    if (!currentExam) return;

    let correct = 0;
    currentExam.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / currentExam.questions.length) * 100);
    const result = { score, correct, total: currentExam.questions.length };
    
    setExamResult(result);
    setExamCompleted(true);
    setExamInProgress(false);
    
    // Atualizar o exame na lista
    setGeneratedExams(prev => 
      prev.map(exam => 
        exam.id === currentExam.id 
          ? { ...exam, score, completed: true }
          : exam
      )
    );
  };

  const resetExam = () => {
    setCurrentExam(null);
    setExamInProgress(false);
    setExamCompleted(false);
    setExamResult(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-500';
      case 'Médio': return 'bg-yellow-500';
      case 'Difícil': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Renderizar interface do exame em andamento
  if (examInProgress && currentExam) {
    const currentQuestion = currentExam.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentExam.questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-4xl">
          {/* Cabeçalho do Exame */}
          <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">{currentExam.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                </div>
                <Button variant="outline" onClick={finishExam}>
                  Finalizar
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Questão {currentQuestionIndex + 1} de {currentExam.questions.length}
            </p>
          </div>

          {/* Questão Atual */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
                <Badge className={`${getDifficultyColor(currentQuestion.difficulty)} text-white`}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion.id]?.toString() || ""}
                onValueChange={(value) => submitAnswer(currentQuestion.id, parseInt(value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navegação */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>
            
            {currentQuestionIndex === currentExam.questions.length - 1 ? (
              <Button onClick={finishExam} className="bg-agro-green hover:bg-agro-green/90">
                Finalizar Exame
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(currentExam.questions.length - 1, prev + 1))}
                className="bg-agro-green hover:bg-agro-green/90"
              >
                Próxima
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Renderizar resultado do exame
  if (examCompleted && examResult) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-16 w-16 mx-auto text-agro-green mb-4" />
              <CardTitle className="text-2xl">Exame Concluído!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-agro-green">
                {examResult.score}%
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{examResult.correct}</div>
                  <div className="text-sm text-muted-foreground">Corretas</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{examResult.total - examResult.correct}</div>
                  <div className="text-sm text-muted-foreground">Incorretas</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={resetExam} variant="outline">
                  Voltar aos Simulados
                </Button>
                <Button onClick={() => startExam(currentExam!)} className="bg-agro-green hover:bg-agro-green/90">
                  Refazer Exame
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar 
            activeSection="simulado" 
            onSectionChange={() => setMobileMenuOpen(false)}
            onClose={() => setMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <Header 
        onMenuClick={() => setMobileMenuOpen(true)}
        sidebarOpen={mobileMenuOpen}
      />
      
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar activeSection="simulado" onSectionChange={() => {}} />
        </div>
        <main className="flex-1 p-3 sm:p-4 lg:p-6 lg:ml-64">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center">
                    <Brain className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-agro-green" />
                    Simulado IA
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">Provas geradas por inteligência artificial</p>
                </div>
              </div>
            </div>

            {/* Seção de Geração de Simulado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-agro-green" />
                  Gerar Novo Simulado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Selecione os PDFs que você estudou para que a IA crie um simulado personalizado baseado no conteúdo.
                </p>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pdfs.map(pdf => (
                      <div
                        key={pdf.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedPdfs.includes(pdf.id)
                            ? 'border-agro-green bg-agro-green/5'
                            : 'border-border hover:border-agro-green/50'
                        }`}
                        onClick={() => handlePdfSelection(pdf.id)}
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm line-clamp-2">{pdf.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{pdf.author}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {pdf.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  onClick={generateExam}
                  disabled={selectedPdfs.length === 0 || generatingExam}
                  className="w-full bg-agro-green hover:bg-agro-green/90"
                >
                  {generatingExam ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando Simulado...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Gerar Simulado
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Simulados Gerados */}
            {generatedExams.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-agro-green" />
                    Seus Simulados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedExams.map(exam => (
                      <Card key={exam.id} className="relative">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{exam.title}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {exam.totalQuestions} questões • {exam.duration} min
                              </p>
                            </div>
                            {exam.completed && exam.score !== undefined && (
                              <Badge 
                                className={`${
                                  exam.score >= 70 ? 'bg-green-500' : 
                                  exam.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                } text-white`}
                              >
                                {exam.score}%
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              Criado em {new Date(exam.generatedAt).toLocaleDateString('pt-BR')}
                            </p>
                            <Button 
                              onClick={() => startExam(exam)}
                              className="w-full bg-agro-green hover:bg-agro-green/90"
                              size="sm"
                            >
                              {exam.completed ? 'Refazer' : 'Iniciar'} Simulado
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SimuladoIA;