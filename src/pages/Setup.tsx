import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useSubjects } from '@/hooks/useSubjects';
import { Sprout, Plus, X, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Setup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSemester, createSubject } = useSubjects();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Semester form
  const [semesterTitle, setSemesterTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Subjects form
  const [subjects, setSubjects] = useState<Array<{name: string, code: string, color: string}>>([
    { name: '', code: '', color: '#22c55e' }
  ]);

  const predefinedSubjects = [
    { name: 'Agronomia', code: 'AGR101', color: '#22c55e' },
    { name: 'Zootecnia', code: 'ZOO101', color: '#3b82f6' },
    { name: 'Engenharia Florestal', code: 'ENG101', color: '#10b981' },
    { name: 'Biotecnologia', code: 'BIO101', color: '#8b5cf6' },
    { name: 'Solos', code: 'SOL101', color: '#f59e0b' },
    { name: 'Fitotecnia', code: 'FIT101', color: '#ef4444' },
    { name: 'Entomologia', code: 'ENT101', color: '#06b6d4' },
    { name: 'Fitopatologia', code: 'FIP101', color: '#84cc16' },
    { name: 'Economia Rural', code: 'ECO101', color: '#f97316' },
    { name: 'Extensão Rural', code: 'EXT101', color: '#a855f7' }
  ];

  const colors = [
    '#22c55e', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
    '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#a855f7'
  ];

  const handleSemesterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!semesterTitle.trim() || !startDate || !endDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos do semestre",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const addSubject = () => {
    setSubjects(prev => [...prev, { name: '', code: '', color: colors[prev.length % colors.length] }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(prev => prev.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: string, value: string) => {
    setSubjects(prev => 
      prev.map((subject, i) => 
        i === index ? { ...subject, [field]: value } : subject
      )
    );
  };

  const addPredefinedSubject = (predefined: typeof predefinedSubjects[0]) => {
    if (subjects.some(s => s.name === predefined.name)) return;
    
    setSubjects(prev => [...prev, predefined]);
  };

  const handleComplete = async () => {
    const validSubjects = subjects.filter(s => s.name.trim());
    
    if (validSubjects.length === 0) {
      toast({
        title: "Adicione pelo menos uma disciplina",
        description: "Você precisa de pelo menos uma disciplina para continuar",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create semester
      const semester = await createSemester(semesterTitle, startDate, endDate);
      if (!semester) {
        setLoading(false);
        return;
      }

      // Create subjects
      for (const subject of validSubjects) {
        await createSubject(subject.name, subject.code, subject.color, semester.id);
      }

      toast({
        title: "Configuração concluída!",
        description: "Sua conta foi configurada com sucesso",
      });

      navigate('/');
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        title: "Erro na configuração",
        description: "Ocorreu um erro durante a configuração",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-green to-agro-field p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="shadow-[var(--shadow-hover)]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-agro-green text-white p-3 rounded-full">
                <Sprout className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl text-agro-green">
              {step === 1 ? 'Configure seu semestre' : 'Adicione suas disciplinas'}
            </CardTitle>
            <p className="text-muted-foreground">
              {step === 1 
                ? 'Vamos começar configurando seu semestre atual'
                : 'Agora adicione as disciplinas que você está cursando'
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 ? (
              <form onSubmit={handleSemesterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Nome do semestre</Label>
                  <Input
                    id="semester"
                    placeholder="Ex: 2024.1, 5º Semestre, etc."
                    value={semesterTitle}
                    onChange={(e) => setSemesterTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start">Data de início</Label>
                    <Input
                      id="start"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">Data de término</Label>
                    <Input
                      id="end"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Continuar para disciplinas
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Disciplinas sugeridas</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Clique para adicionar disciplinas comuns do curso de Agro
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedSubjects.map((subject) => (
                      <Badge
                        key={subject.name}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary transition-colors"
                        onClick={() => addPredefinedSubject(subject)}
                        style={{ borderColor: subject.color }}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        {subject.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">Suas disciplinas</Label>
                    <Button onClick={addSubject} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>

                  {subjects.map((subject, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Nome da disciplina"
                          value={subject.name}
                          onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          placeholder="Código"
                          value={subject.code}
                          onChange={(e) => updateSubject(index, 'code', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={subject.color}
                          onChange={(e) => updateSubject(index, 'color', e.target.value)}
                          className="w-8 h-8 rounded border border-input"
                        />
                        {subjects.length > 1 && (
                          <Button
                            onClick={() => removeSubject(index)}
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Voltar
                  </Button>
                  <Button onClick={handleComplete} disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Configurando...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Finalizar configuração
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Setup;