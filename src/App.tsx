import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CadernoDigital from "./pages/CadernoDigital";
import AgendaAcademica from "./pages/AgendaAcademica";
import VisitasTecnicas from "./pages/VisitasTecnicas";
import BibliotecaPDF from "./pages/BibliotecaPDF";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/caderno" element={<CadernoDigital />} />
          <Route path="/agenda" element={<AgendaAcademica />} />
          <Route path="/visitas" element={<VisitasTecnicas />} />
          <Route path="/biblioteca" element={<BibliotecaPDF />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
