import { useState, useRef } from "react";
import { FileText, Upload, Search, Filter, Download, Eye, Trash2, Star, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePdfLibrary } from "@/hooks/usePdfLibrary";

const BibliotecaPDF = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewPdfDialogOpen, setViewPdfDialogOpen] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<any>(null);
  const [deletePdfId, setDeletePdfId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    discipline: "",
    tags: "",
    description: ""
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    pdfs, 
    loading, 
    stats, 
    uploadPdf, 
    deletePdf, 
    toggleFavorite, 
    downloadPdf, 
    getPdfUrl, 
    getCategories 
  } = usePdfLibrary();


  const categories = getCategories();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Erro",
          description: "O arquivo deve ter no máximo 10MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, title: prev.title || file.name.replace('.pdf', '') }));
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos PDF",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.title || !formData.author || !formData.discipline) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      await uploadPdf(selectedFile, {
        title: formData.title,
        author: formData.author,
        category: formData.discipline,
        tags: formData.tags,
        description: formData.description
      });
      
      // Reset form
      setSelectedFile(null);
      setFormData({ title: "", author: "", discipline: "", tags: "", description: "" });
      setUploadDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setUploading(false);
    }
  };

  const handleViewPdf = (pdf: any) => {
    setViewingPdf(pdf);
    setViewPdfDialogOpen(true);
  };

  const handleDownloadPdf = (pdf: any) => {
    downloadPdf(pdf);
  };

  const handleDeletePdf = async (pdfId: string) => {
    await deletePdf(pdfId);
    setDeletePdfId(null);
  };

  const handleToggleFavorite = (pdfId: string) => {
    toggleFavorite(pdfId);
  };

  const filteredPDFs = pdfs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pdf.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesCategory = selectedCategory === "all" || pdf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const getCategoryColor = (category: string) => {
    // Use a hash-based color assignment for consistent colors
    const colors = ['bg-agro-green', 'bg-agro-earth', 'bg-agro-field', 'bg-agro-sky', 'bg-orange-500', 'bg-purple-500', 'bg-blue-500'];
    const hash = category.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar 
            activeSection="biblioteca" 
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
          <Sidebar activeSection="biblioteca" onSectionChange={() => {}} />
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
                    <FileText className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-agro-earth" />
                    Biblioteca PDF
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">Artigos e materiais de estudo</p>
                </div>
              </div>
              
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload PDF
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Upload de Arquivo PDF</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-muted rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={handleFileSelect}
                    >
                      <Upload className="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-muted-foreground mb-2 sm:mb-4" />
                      {selectedFile ? (
                        <div>
                          <p className="text-sm sm:text-lg font-medium mb-1 sm:mb-2 text-primary">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm sm:text-lg font-medium mb-1 sm:mb-2">Arraste e solte seu PDF aqui</p>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4">ou clique para selecionar</p>
                          <Button variant="outline" size="sm">Selecionar Arquivo</Button>
                        </>
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    <Input 
                      placeholder="Título do documento *" 
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input 
                      placeholder="Autor *" 
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    />
                    <Select 
                      value={formData.discipline} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, discipline: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Disciplina *" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="Tags (separadas por vírgula)" 
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    />
                    <Input 
                      placeholder="Descrição (opcional)" 
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Button 
                      className="w-full" 
                      onClick={handleUpload}
                      disabled={!selectedFile || !formData.title || !formData.author || !formData.discipline || uploading}
                    >
                      {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {uploading ? "Enviando..." : "Fazer Upload"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de PDFs</p>
                      <p className="text-2xl font-bold text-agro-green">{stats.totalPdfs}</p>
                    </div>
                    <FileText className="h-8 w-8 text-agro-green" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Favoritos</p>
                      <p className="text-2xl font-bold text-yellow-500">{stats.favorites}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Armazenamento</p>
                      <p className="text-2xl font-bold text-agro-sky">{stats.totalSize}</p>
                    </div>
                    <Upload className="h-8 w-8 text-agro-sky" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Este Mês</p>
                      <p className="text-2xl font-bold text-agro-earth">{stats.thisMonth}</p>
                    </div>
                    <Upload className="h-8 w-8 text-agro-earth" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar PDFs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* PDF Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPDFs.map(pdf => (
                  <Card key={pdf.id} className="hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <CardTitle className="text-base leading-tight line-clamp-2">{pdf.title}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">{pdf.author}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto"
                          onClick={() => handleToggleFavorite(pdf.id)}
                        >
                          <Star 
                            className={`h-4 w-4 ${pdf.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">{pdf.description}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getCategoryColor(pdf.category)} text-white border-none`}
                          >
                            {pdf.category}
                          </Badge>
                          {pdf.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {pdf.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{pdf.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatFileSize(pdf.file_size)}</span>
                          <span>{new Date(pdf.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewPdf(pdf)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDownloadPdf(pdf)}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Baixar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="px-2">
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir "{pdf.title}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePdf(pdf.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredPDFs.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Nenhum PDF encontrado
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm || selectedCategory !== "all" 
                        ? "Tente alterar os filtros de busca" 
                        : "Faça upload do seu primeiro PDF para começar"
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PDF Viewer Dialog */}
            <Dialog open={viewPdfDialogOpen} onOpenChange={setViewPdfDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-red-500" />
                    {viewingPdf?.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden min-h-[500px]">
                  {viewingPdf && (
                    <iframe
                      src={getPdfUrl(viewingPdf)}
                      className="w-full h-full min-h-[500px]"
                      title={viewingPdf.title}
                    />
                  )}
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button onClick={() => handleDownloadPdf(viewingPdf)}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setViewPdfDialogOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BibliotecaPDF;