import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload as UploadIcon, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Download, 
  Trash2, 
  Eye, 
  X,
  ArrowLeft,
  Filter,
  Search,
  Tag,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  discipline: string;
  tags: string[];
  description?: string;
  url?: string;
  progress?: number;
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

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Upload States
  const [uploadDiscipline, setUploadDiscipline] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = async (selectedFiles: File[]) => {
    for (const file of selectedFiles) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 50MB`,
          variant: "destructive",
        });
        continue;
      }

      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        discipline: uploadDiscipline || "Não categorizado",
        tags: uploadTags.split(",").map(tag => tag.trim()).filter(Boolean),
        description: uploadDescription,
        progress: 0,
      };

      setFiles(prev => [...prev, newFile]);
      setUploading(prev => [...prev, fileId]);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: Math.min((f.progress || 0) + Math.random() * 30, 100) }
            : f
        ));
      }, 500);

      // Complete upload after 3 seconds
      setTimeout(() => {
        clearInterval(progressInterval);
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: 100, url: URL.createObjectURL(file) }
            : f
        ));
        setUploading(prev => prev.filter(id => id !== fileId));
        
        toast({
          title: "Upload concluído",
          description: `${file.name} foi enviado com sucesso`,
        });
      }, 3000);
    }

    // Reset upload form
    setUploadDiscipline("");
    setUploadTags("");
    setUploadDescription("");
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-8 w-8 text-agro-sky" />;
    if (type.startsWith("video/")) return <Video className="h-8 w-8 text-destructive" />;
    if (type.startsWith("audio/")) return <Music className="h-8 w-8 text-accent" />;
    return <FileText className="h-8 w-8 text-agro-green" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDiscipline = selectedDiscipline === "all" || file.discipline === selectedDiscipline;
    const matchesType = selectedType === "all" || 
                       (selectedType === "images" && file.type.startsWith("image/")) ||
                       (selectedType === "documents" && (file.type.includes("pdf") || file.type.includes("document"))) ||
                       (selectedType === "videos" && file.type.startsWith("video/")) ||
                       (selectedType === "audios" && file.type.startsWith("audio/"));
    
    return matchesSearch && matchesDiscipline && matchesType;
  });

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "Arquivo removido",
      description: "O arquivo foi excluído com sucesso",
    });
  };

  const downloadFile = (file: UploadedFile) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    }
  };

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const totalStorage = files.reduce((total, file) => total + file.size, 0);
  const storageLimit = 1024 * 1024 * 1024; // 1GB

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={handleMenuClick} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <Sidebar 
            activeSection="upload"
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gerenciador de Upload</h1>
              <p className="text-muted-foreground">Organize e gerencie seus arquivos acadêmicos</p>
            </div>
          </div>

          {/* Storage Usage */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Armazenamento utilizado</span>
                <span className="text-sm font-medium">
                  {formatFileSize(totalStorage)} / {formatFileSize(storageLimit)}
                </span>
              </div>
              <Progress value={(totalStorage / storageLimit) * 100} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="h-5 w-5" />
              Upload de Arquivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Upload Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="discipline">Disciplina</Label>
                <Select value={uploadDiscipline} onValueChange={setUploadDiscipline}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinas.map(disciplina => (
                      <SelectItem key={disciplina} value={disciplina}>{disciplina}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="aula, prova, resumo"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Descrição do arquivo"
                />
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                ${dragActive 
                  ? "border-agro-green bg-agro-green/5" 
                  : "border-border hover:border-agro-green/50 hover:bg-agro-green/5"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Clique ou arraste arquivos aqui</h3>
              <p className="text-muted-foreground mb-4">
                Suporte a PDFs, imagens, vídeos, áudios e documentos (máx. 50MB)
              </p>
              <Button variant="outline">
                Selecionar Arquivos
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFiles(Array.from(e.target.files));
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar arquivos..."
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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Tipo de arquivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="documents">Documentos</SelectItem>
                  <SelectItem value="images">Imagens</SelectItem>
                  <SelectItem value="videos">Vídeos</SelectItem>
                  <SelectItem value="audios">Áudios</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate text-sm">{file.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {file.url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadFile(file)}
                        className="h-8 w-8"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteFile(file.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {uploading.includes(file.id) && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Enviando...</span>
                      <span>{Math.round(file.progress || 0)}%</span>
                    </div>
                    <Progress value={file.progress || 0} className="h-1" />
                  </div>
                )}

                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {file.discipline}
                  </Badge>
                  
                  {file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {file.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {file.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {file.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Nenhum arquivo encontrado</h3>
              <p className="text-muted-foreground">
                {files.length === 0 
                  ? "Comece fazendo upload de seus primeiros arquivos" 
                  : "Tente ajustar os filtros de busca"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Upload;