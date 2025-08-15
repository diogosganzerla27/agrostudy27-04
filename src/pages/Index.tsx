import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import CadernoDigital from "@/pages/CadernoDigital"

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "caderno":
        return <CadernoDigital />
      case "agenda":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-agro-green">Agenda Acadêmica</h2>
            <p className="text-muted-foreground">Gerencie seus prazos, provas e eventos</p>
            {/* Conteúdo será implementado */}
          </div>
        )
      case "arquivos":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-agro-green">Biblioteca PDF</h2>
            <p className="text-muted-foreground">Organize e busque seus materiais de estudo</p>
            {/* Conteúdo será implementado */}
          </div>
        )
      case "campo":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-agro-green">Diário de Campo</h2>
            <p className="text-muted-foreground">Registre suas visitas técnicas e observações</p>
            {/* Conteúdo será implementado */}
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-agro-green">Em Desenvolvimento</h2>
            <p className="text-muted-foreground">Esta seção está sendo construída</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            className="h-[calc(100vh-73px)] sticky top-[73px]"
          />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar 
              activeSection={activeSection} 
              onSectionChange={setActiveSection}
              onClose={() => setMobileMenuOpen(false)}
              className="h-full"
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default Index