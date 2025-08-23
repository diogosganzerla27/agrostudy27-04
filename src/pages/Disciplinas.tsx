import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Palette, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useSubjects } from "@/hooks/useSubjects";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-green/5 to-agro-field/5">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Disciplinas</h1>
              </div>
            </div>

            <Button onClick={openNewSubjectDialog} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Disciplina
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {subjectsBySemester.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum semestre encontrado</h3>
              <p className="text-muted-foreground text-center mb-6">
                Você precisa criar um semestre primeiro para adicionar disciplinas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {subjectsBySemester.map((semester) => (
              <Card key={semester.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{semester.title}</span>
                    <Badge variant="secondary">
                      {semester.subjects.length} disciplina{semester.subjects.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {semester.subjects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma disciplina neste semestre</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {semester.subjects.map((subject) => (
                        <Card key={subject.id} className="relative group hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div 
                                className="w-4 h-4 rounded-full flex-shrink-0 mt-1" 
                                style={{ backgroundColor: subject.color }}
                              />
                              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(subject)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteSubjectId(subject.id)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{subject.name}</h3>
                            {subject.code && (
                              <p className="text-xs text-muted-foreground">{subject.code}</p>
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

      {/* Dialog for Add/Edit Subject */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Editar Disciplina" : "Nova Disciplina"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Disciplina *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Fitotecnia, Solos, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="code">Código (opcional)</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: FIT101, SOL201, etc."
              />
            </div>

            <div>
              <Label htmlFor="semester">Semestre *</Label>
              <Select
                value={formData.semesterId}
                onValueChange={(value) => setFormData({ ...formData, semesterId: value })}
                required
              >
                <SelectTrigger>
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

            <div>
              <Label>Cor da Disciplina</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color 
                        ? "border-foreground scale-110" 
                        : "border-border hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editingSubject ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteSubjectId} onOpenChange={() => setDeleteSubjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta disciplina? Esta ação não pode ser desfeita e 
              todos os dados relacionados (notas, eventos, etc.) também serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}