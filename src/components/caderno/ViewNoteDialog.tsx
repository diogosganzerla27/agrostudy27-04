import { FileText, Image, Download, Calendar, Tag, BookOpen, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteWithSubject } from "@/hooks/useNotes";

interface ViewNoteDialogProps {
  note: NoteWithSubject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (noteId: string) => void;
}

export const ViewNoteDialog = ({ note, open, onOpenChange, onDelete }: ViewNoteDialogProps) => {
  if (!note) return null;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(note.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-4xl h-[90vh] max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl sm:text-2xl leading-tight">{note.title}</DialogTitle>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">{note.subject?.name || 'Sem disciplina'}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(note.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: note.subject?.color || '#22c55e' }}
              ></div>
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Anotação</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a anotação "{note.title}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Content */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Conteúdo</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {note.content_md || 'Sem conteúdo'}
                </p>
              </div>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-1 rounded-full">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};