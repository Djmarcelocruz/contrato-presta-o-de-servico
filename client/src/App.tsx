import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Navigation from "./components/Navigation";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Inventory from "./pages/Inventory";
import CashFlow from "./pages/CashFlow";
import Budgets from "./pages/Budgets";
import Contracts from "./pages/Contracts";
import Receipts from "./pages/Receipts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function Router() {
  // All routes require authentication (handled by useAuth hook in each page)
  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 md:ml-64 pt-16 md:pt-0">
        <Switch>
          <Route path={"/"} component={Dashboard} />
          <Route path={"/clients"} component={Clients} />
          <Route path={"/inventory"} component={Inventory} />
          <Route path={"/cash-flow"} component={CashFlow} />
          <Route path={"/budgets"} component={Budgets} />
          <Route path={"/contracts"} component={Contracts} />
          <Route path={"/receipts"} component={Receipts} />
          <Route path={"/reports"} component={Reports} />
          <Route path={"/settings"} component={Settings} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

// NOTE: About Theme
// - Brutalista theme: Dark mode with black background, white text, red accents
// - Color palette in index.css is configured for this dark brutalista aesthetic
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
