
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavigationProvider } from "@/contexts/NavigationContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JoinBoardPage from "./pages/JoinBoardPage";

const queryClient = new QueryClient();

function App() {
  return (
    <NavigationProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/join/:token" element={<JoinBoardPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </TooltipProvider>
    </NavigationProvider>
  );
}

export default App;
