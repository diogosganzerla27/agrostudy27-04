import { FileText, Image, Download, Calendar, Tag, BookOpen, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Note {
  id: number;
  title: string;
  discipline: string;
  content: string;
  tags: string[];
  date: string;
  color: string;
  files?: File[];
}

interface ViewNoteDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewNoteDialog = ({ note, open, onOpenChange }: ViewNoteDialogProps) => {
  if (!note) return null;

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const isImage = (file: File) => file.type.startsWith('image/');

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
                  <Badge variant="secondary">{note.discipline}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{note.date}</span>
                </div>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full ${note.color} flex-shrink-0`}></div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Content */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Conteúdo</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </div>
            </div>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs px-2 py-1 rounded-full">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {note.files && note.files.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Arquivos Anexados</h3>
                <div className="space-y-3">
                  {note.files.map((file, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {getFileIcon(file)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadFile(file)}
                          className="flex-shrink-0"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      
                      {/* Preview for images */}
                      {isImage(file) && (
                        <div className="mt-3">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="max-w-full h-auto max-h-64 rounded-md border"
                            onLoad={(e) => {
                              // Clean up object URL after image loads
                              setTimeout(() => {
                                URL.revokeObjectURL((e.target as HTMLImageElement).src);
                              }, 1000);
                            }}
                          />
                        </div>
                      )}
                    </div>
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