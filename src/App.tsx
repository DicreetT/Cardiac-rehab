import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import HeartHealthInfo from "./pages/HeartHealthInfo";
import Plans from "./pages/Plans";
import PlanDetail from "./pages/PlanDetail";
import Calendar from "./pages/Calendar";
import AdminDashboard from "./pages/AdminDashboard";
import ChooseAvatar from "./pages/ChooseAvatar";
import MemberPage from "./pages/MemberPage";
import IvanOnly from "@/components/IvanOnly";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/info" element={<HeartHealthInfo />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/plans" element={<ProtectedRoute><IvanOnly><Plans /></IvanOnly></ProtectedRoute>} />
            <Route path="/plan/:slug" element={<ProtectedRoute><IvanOnly><PlanDetail /></IvanOnly></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><IvanOnly><Calendar /></IvanOnly></ProtectedRoute>} />
            <Route path="/choose-avatar" element={<ProtectedRoute><ChooseAvatar /></ProtectedRoute>} />
            <Route path="/member/:name" element={<ProtectedRoute><MemberPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
