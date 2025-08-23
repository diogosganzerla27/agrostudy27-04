import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Palette, BookOpen, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useSubjects } from "@/hooks/useSubjects";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const colors = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#84cc16", "#6366f1"
];

export default function Disciplinas() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subjects, semesters, loading, createSubject, updateSubject, deleteSubject, getSubjectsBySemester } = useSubjects();
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    color: "#22c55e",
    semesterId: ""
  });

  const subjectsBySemester = getSubjectsBySemester();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.semesterId) {
      toast({
        title: "Erro",
        description: "Nome e semestre são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, {
          name: formData.name,
          code: formData.code,
          color: formData.color,
          semester_id: formData.semesterId
        });
        toast({
          title: "Disciplina atualizada",
          description: "A disciplina foi atualizada com sucesso",
        });
      } else {
        await createSubject(formData.name, formData.code, formData.color, formData.semesterId);
      }
      
      setShowDialog(false);
      setEditingSubject(null);
      setFormData({
        name: "",
        code: "",
        color: "#22c55e",
        semesterId: ""
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a disciplina",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code || "",
      color: subject.color,
      semesterId: subject.semester_id
    });
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteSubjectId) return;
    
    try {
      await deleteSubject(deleteSubjectId);
      setDeleteSubjectId(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a disciplina",
        variant: "destructive",
      });
    }
  };

  const openNewSubjectDialog = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      code: "",
      color: "#22c55e",
      semesterId: semesters[0]?.id || ""
    });
    setShowDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agro-green/5 to-agro-field/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-green/5 to-agro-field/5 pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground p-2 md:px-3"
              >
                <ArrowLeft className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Voltar</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <h1 className="text-lg md:text-2xl font-bold text-foreground">Disciplinas</h1>
              </div>
            </div>

            {/* Desktop add button */}
            <Button 
              onClick={openNewSubjectDialog} 
              className="hidden md:flex bg-primary hover:bg-primary/90 transition-all hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Disciplina
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
        {subjectsBySemester.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
              <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-4 animate-pulse" />
              <h3 className="text-base md:text-lg font-semibold mb-2">Nenhum semestre encontrado</h3>
              <p className="text-muted-foreground text-center text-sm md:text-base mb-6 px-4">
                Você precisa criar um semestre primeiro para adicionar disciplinas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 md:space-y-8 animate-fade-in">
            {subjectsBySemester.map((semester, index) => (
              <Card 
                key={semester.id} 
                className="animate-scale-in hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="flex items-center justify-between text-base md:text-lg">
                    <span className="truncate pr-2">{semester.title}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {semester.subjects.length} disciplina{semester.subjects.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {semester.subjects.length === 0 ? (
                    <div className="text-center py-6 md:py-8 text-muted-foreground">
                      <p className="text-sm">Nenhuma disciplina neste semestre</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {semester.subjects.map((subject, subjectIndex) => (
                        <Card 
                          key={subject.id} 
                          className="relative group hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer border-border/50"
                          style={{ animationDelay: `${(index * 100) + (subjectIndex * 50)}ms` }}
                        >
                          <CardContent className="p-3 md:p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div 
                                className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0 mt-1 shadow-sm" 
                                style={{ backgroundColor: subject.color }}
                              />
                              
                              {/* Mobile actions */}
                              <div className="md:hidden">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-muted rounded-full"
                                    >
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() => handleEdit(subject)} className="text-sm">
                                      <Edit2 className="h-3 w-3 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => setDeleteSubjectId(subject.id)} 
                                      className="text-sm text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {/* Desktop actions */}
                              <div className="hidden md:flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(subject)}
                                  className="h-7 w-7 p-0 hover:bg-primary/10 hover:scale-110 transition-all"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteSubjectId(subject.id)}
                                  className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 hover:scale-110 transition-all"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 leading-tight">
                              {subject.name}
                            </h3>
                            {subject.code && (
                              <p className="text-xs text-muted-foreground truncate">{subject.code}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-4 z-50">
        <Button
          onClick={openNewSubjectDialog}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Dialog for Add/Edit Subject */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {editingSubject ? "Editar Disciplina" : "Nova Disciplina"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nome da Disciplina *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Fitotecnia, Solos, etc."
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">Código (opcional)</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: FIT101, SOL201, etc."
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester" className="text-sm font-medium">Semestre *</Label>
              <Select
                value={formData.semesterId}
                onValueChange={(value) => setFormData({ ...formData, semesterId: value })}
                required
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione o semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Cor da Disciplina</Label>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all duration-200 active:scale-95",
                      formData.color === color 
                        ? "border-foreground scale-110 shadow-lg" 
                        : "border-border/50 hover:scale-105 hover:shadow-md"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="h-11 order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="h-11 order-1 sm:order-2 bg-primary hover:bg-primary/90 transition-all"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingSubject ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteSubjectId} onOpenChange={() => setDeleteSubjectId(null)}>
        <AlertDialogContent className="mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              Tem certeza que deseja excluir esta disciplina? Esta ação não pode ser desfeita e 
              todos os dados relacionados (notas, eventos, etc.) também serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
            <AlertDialogCancel className="h-11 order-2 sm:order-1">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="h-11 order-1 sm:order-2 bg-destructive hover:bg-destructive/90 transition-all"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}