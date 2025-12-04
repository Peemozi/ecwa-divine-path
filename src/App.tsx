import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Splash from "./pages/Splash";
import AuthOptions from "./pages/AuthOptions";
import Login from "./pages/Login";
import LoginEmail from "./pages/LoginEmail";
import LoginVerify from "./pages/LoginVerify";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Hymns from "./pages/Hymns";
import HymnDetail from "./pages/HymnDetail";
import MenuPage from "./pages/MenuPage";
import Manuals from "./pages/Manuals";
import ManualYears from "./pages/ManualYears";
import ManualLanguage from "./pages/ManualLanguage";
import ManualLessons from "./pages/ManualLessons";
import ManualLesson from "./pages/ManualLesson";
import Quiz from "./pages/Quiz";
import QuizYears from "./pages/QuizYears";
import QuizLessons from "./pages/QuizLessons";
import QuizQuestions from "./pages/QuizQuestions";
import QuizResults from "./pages/QuizResults";
import QuizHistory from "./pages/QuizHistory";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Splash />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthOptions />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login-email" element={<LoginEmail />} />
            <Route path="/login-verify" element={<LoginVerify />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hymns" element={<Hymns />} />
            <Route path="/hymns/:id" element={<HymnDetail />} />
            <Route path="/menu" element={<MenuPage />} />
            
            {/* Manuals Routes */}
            <Route path="/manuals" element={<Manuals />} />
            <Route path="/manuals/:type/years" element={<ManualYears />} />
            <Route path="/manuals/:type/:year/language" element={<ManualLanguage />} />
            <Route path="/manuals/:type/:year/:language/lessons" element={<ManualLessons />} />
            <Route path="/manuals/:type/:year/:language/lesson/:lessonId" element={<ManualLesson />} />
            
            {/* Quiz Routes */}
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:type/years" element={<QuizYears />} />
            <Route path="/quiz/:type/:year/lessons" element={<QuizLessons />} />
            <Route path="/quiz/:type/:year/lesson/:lessonId" element={<QuizQuestions />} />
            <Route path="/quiz/:type/:year/lesson/:lessonId/results" element={<QuizResults />} />
            <Route path="/quiz-history" element={<QuizHistory />} />
            
            <Route path="/payment" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
