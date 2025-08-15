import { useState } from "react";
import { FileText, Upload, Search, Filter, Download, Eye, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const BibliotecaPDF = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const pdfs = [
    {
      id: 1,
      title: "Manual de Fitotecnia",
      author: "Prof. João Silva",
      category: "Fitotecnia",
      size: "2.4 MB",
      pages: 124,
      uploadDate: "2024-11-10",
      favorite: true,
      description: "Guia completo sobre manejo integrado de culturas",
      tags: ["manejo", "culturas", "produção"]
    },
    {
      id: 2,
      title: "Análise de Solos - Métodos e Interpretação",
      author: "Dr. Maria Santos",
      category: "Solos",
      size: "1.8 MB",
      pages: 89,
      uploadDate: "2024-11-08",
      favorite: false,
      description: "Métodos analíticos para caracterização físico-química",
      tags: ["análise", "química", "física"]
    },
    {
      id: 3,
      title: "Sistemas Agroflorestais Sustentáveis",
      author: "Instituto Agroecológico",
      category: "Agroecologia",
      size: "3.1 MB",
      pages: 156,
      uploadDate: "2024-11-05",
      favorite: true,
      description: "Implementação e manejo de SAFs",
      tags: ["sustentabilidade", "floresta", "integração"]
    },
    {
      id: 4,
      title: "Controle Biológico de Pragas",
      author: "Embrapa",
      category: "Entomologia",
      size: "2.7 MB",
      pages: 98,
      uploadDate: "2024-11-02",
      favorite: false,
      description: "Estratégias de controle natural de pragas agrícolas",
      tags: ["controle-biológico", "pragas", "natural"]
    },
    {
      id: 5,
      title: "Nutrição Animal em Pastagens",
      author: "Prof. Carlos Mendes",
      category: "Zootecnia",
      size: "2.2 MB",
      pages: 112,
      uploadDate: "2024-10-28",
      favorite: false,
      description: "Manejo nutricional de bovinos em sistemas pastoris",
      tags: ["nutrição", "pastagem", "bovinos"]
    }
  ];

  const categories = ["all", "Fitotecnia", "Solos", "Agroecologia", "Entomologia", "Zootecnia"];

  const filteredPDFs = pdfs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || pdf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Fitotecnia': return 'bg-agro-green';
      case 'Solos': return 'bg-agro-earth';
      case 'Agroecologia': return 'bg-agro-field';
      case 'Entomologia': return 'bg-agro-sky';
      case 'Zootecnia': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeSection="biblioteca" onSectionChange={() => {}} />
        <main className="flex-1 p-4 sm:p-6 lg:ml-64">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                  <FileText className="mr-3 h-7 w-7 text-agro-earth" />
                  Biblioteca PDF
                </h1>
                <p className="text-muted-foreground mt-1">Artigos e materiais de estudo</p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload PDF
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload de Arquivo PDF</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">Arraste e solte seu PDF aqui</p>
                      <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar</p>
                      <Button variant="outline">Selecionar Arquivo</Button>
                    </div>
                    <Input placeholder="Título do documento" />
                    <Input placeholder="Autor" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Tags (separadas por vírgula)" />
                    <Button className="w-full">Fazer Upload</Button>
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
                      <p className="text-2xl font-bold text-agro-green">43</p>
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
                      <p className="text-2xl font-bold text-yellow-500">12</p>
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
                      <p className="text-2xl font-bold text-agro-sky">2.1 GB</p>
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
                      <p className="text-2xl font-bold text-agro-earth">8</p>
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
                        className={`p-1 ${pdf.favorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
                      >
                        <Star className="h-4 w-4" fill={pdf.favorite ? 'currentColor' : 'none'} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={`text-xs ${getCategoryColor(pdf.category)} text-white`}>
                          {pdf.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{pdf.uploadDate}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">{pdf.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{pdf.size}</span>
                        <span>{pdf.pages} páginas</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pdf.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {pdf.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{pdf.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-1 h-3 w-3" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="mr-1 h-3 w-3" />
                          Baixar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPDFs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum PDF encontrado</h3>
                <p className="text-muted-foreground">Faça upload de seus primeiros materiais ou ajuste os filtros</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BibliotecaPDF;