import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Tools from "@/pages/tools";
import ToolDetail from "@/pages/tool-detail";
import Categories from "@/pages/categories";
import SubmitTool from "@/pages/submit-tool";
import Dashboard from "@/pages/dashboard";
import Compare from "@/pages/compare";
import Pricing from "@/pages/pricing";
import Checkout from "@/pages/checkout";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          {!isAuthenticated ? (
            <>
              <Route path="/" component={Landing} />
              <Route path="/login" component={Login} />
              <Route path="/tools" component={Tools} />
              <Route path="/tools/:slug" component={ToolDetail} />
              <Route path="/categories" component={Categories} />
              <Route path="/categories/:slug" component={Tools} />
              <Route path="/compare" component={Compare} />
              <Route path="/pricing" component={Pricing} />
            </>
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/tools" component={Tools} />
              <Route path="/tools/:slug" component={ToolDetail} />
              <Route path="/categories" component={Categories} />
              <Route path="/categories/:slug" component={Tools} />
              <Route path="/submit-tool" component={SubmitTool} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/compare" component={Compare} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/checkout" component={Checkout} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
