import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CadernoDigital from "./pages/CadernoDigital";
import AgendaAcademica from "./pages/AgendaAcademica";
import VisitasTecnicas from "./pages/VisitasTecnicas";
import BibliotecaPDF from "./pages/BibliotecaPDF";
import Upload from "./pages/Upload";
import Notas from "./pages/Notas";
import Auth from "./pages/Auth";
import Setup from "./pages/Setup";
import AgroStudyIA from "./pages/AgroStudyIA";
import Disciplinas from "./pages/Disciplinas";
import SimuladoIA from "./pages/SimuladoIA";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isNewUser } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-agro-green to-agro-field">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (isNewUser) {
    return <Navigate to="/setup" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/caderno" element={<ProtectedRoute><CadernoDigital /></ProtectedRoute>} />
      <Route path="/agenda" element={<ProtectedRoute><AgendaAcademica /></ProtectedRoute>} />
      <Route path="/visitas" element={<ProtectedRoute><VisitasTecnicas /></ProtectedRoute>} />
      <Route path="/biblioteca" element={<ProtectedRoute><BibliotecaPDF /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
      <Route path="/notas" element={<ProtectedRoute><Notas /></ProtectedRoute>} />
      <Route path="/agrostudy-ia" element={<ProtectedRoute><AgroStudyIA /></ProtectedRoute>} />
      <Route path="/disciplinas" element={<ProtectedRoute><Disciplinas /></ProtectedRoute>} />
      <Route path="/simulado" element={<ProtectedRoute><SimuladoIA /></ProtectedRoute>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
