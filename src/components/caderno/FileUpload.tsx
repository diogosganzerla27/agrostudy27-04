import { useState } from "react";
import { Paperclip, X, FileText, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const FileUpload = ({ files, onFilesChange }: FileUploadProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB

    Array.from(selectedFiles).forEach(file => {
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 10MB`,
          variant: "destructive",
        });
        return;
      }

      // Check if file already exists
      if (!files.some(existingFile => existingFile.name === file.name)) {
        newFiles.push(file);
      }
    });

    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles]);
      toast({
        title: "Arquivos adicionados",
        description: `${newFiles.length} arquivo(s) foram anexados`,
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium flex items-center">
        <Paperclip className="mr-2 h-4 w-4" />
        Anexar Arquivos
      </label>
      
      {/* File Input */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            <strong>Clique para selecionar</strong> ou arraste arquivos aqui
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            PDF, DOC, DOCX, TXT, JPG, PNG (máx. 10MB cada)
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Arquivos selecionados:</p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {getFileIcon(file)}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};