import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import VerifyToken from "./pages/VerifyToken";
import Dashboard from "./pages/Dashboard";
import Hymns from "./pages/Hymns";
import HymnDetail from "./pages/HymnDetail";
import Manuals from "./pages/Manuals";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-token" element={<VerifyToken />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hymns" element={<Hymns />} />
          <Route path="/hymns/:id" element={<HymnDetail />} />
          <Route path="/manuals" element={<Manuals />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
