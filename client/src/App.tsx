import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./contexts/AppContext";
import Layout from "@/components/Layout";
import DashboardPage from "@/pages/dashboard";
import InventoryPage from "@/pages/inventory";
import TractorsPage from "@/pages/tractors";
import LaborPage from "@/pages/labor";
import OrdersPage from "@/pages/orders";
import InvoicesPage from "@/pages/invoices";
import { Settings } from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/inventory" component={InventoryPage} />
        <Route path="/tractors" component={TractorsPage} />
        <Route path="/labor" component={LaborPage} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/invoices" component={InvoicesPage} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Router />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
