import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { 
  Brick, Tractor, Laborer, Order, Invoice, Setting,
  InsertBrick, InsertTractor, InsertLaborer, InsertOrder, InsertInvoice, InsertSetting 
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  // Data
  bricks: Brick[] | undefined;
  tractors: Tractor[] | undefined;
  laborers: Laborer[] | undefined;
  orders: Order[] | undefined;
  invoices: Invoice[] | undefined;
  settings: Setting[] | undefined;
  statistics: any;
  
  // Loading states
  isLoadingBricks: boolean;
  isLoadingTractors: boolean;
  isLoadingLaborers: boolean;
  isLoadingOrders: boolean;
  isLoadingInvoices: boolean;
  isLoadingSettings: boolean;
  isLoadingStatistics: boolean;
  
  // Mutations
  createBrick: (brick: InsertBrick) => Promise<void>;
  updateBrick: (id: string, brick: Partial<InsertBrick>) => Promise<void>;
  deleteBrick: (id: string) => Promise<void>;
  
  createTractor: (tractor: InsertTractor) => Promise<void>;
  updateTractor: (id: string, tractor: Partial<InsertTractor>) => Promise<void>;
  deleteTractor: (id: string) => Promise<void>;
  
  createLaborer: (laborer: InsertLaborer) => Promise<void>;
  updateLaborer: (id: string, laborer: Partial<InsertLaborer>) => Promise<void>;
  deleteLaborer: (id: string) => Promise<void>;
  
  createOrder: (order: InsertOrder) => Promise<void>;
  updateOrder: (id: string, order: Partial<InsertOrder>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  
  createInvoice: (invoice: InsertInvoice) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<InsertInvoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  updateSettings: (settings: InsertSetting[]) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: bricks, isLoading: isLoadingBricks } = useQuery<Brick[]>({
    queryKey: ['/api/bricks']
  });

  const { data: tractors, isLoading: isLoadingTractors } = useQuery<Tractor[]>({
    queryKey: ['/api/tractors']
  });

  const { data: laborers, isLoading: isLoadingLaborers } = useQuery<Laborer[]>({
    queryKey: ['/api/laborers']
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ['/api/orders']
  });

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices']
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery<Setting[]>({
    queryKey: ['/api/settings']
  });

  const { data: statistics, isLoading: isLoadingStatistics } = useQuery({
    queryKey: ['/api/statistics']
  });

  // Brick mutations
  const createBrickMutation = useMutation({
    mutationFn: async (brick: InsertBrick) => {
      await apiRequest('POST', '/api/bricks', brick);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bricks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Brick created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create brick", variant: "destructive" });
    }
  });

  const updateBrickMutation = useMutation({
    mutationFn: async ({ id, brick }: { id: string; brick: Partial<InsertBrick> }) => {
      await apiRequest('PUT', `/api/bricks/${id}`, brick);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bricks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Brick updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update brick", variant: "destructive" });
    }
  });

  const deleteBrickMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/bricks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bricks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Brick deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete brick", variant: "destructive" });
    }
  });

  // Tractor mutations
  const createTractorMutation = useMutation({
    mutationFn: async (tractor: InsertTractor) => {
      await apiRequest('POST', '/api/tractors', tractor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tractors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Tractor created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create tractor", variant: "destructive" });
    }
  });

  const updateTractorMutation = useMutation({
    mutationFn: async ({ id, tractor }: { id: string; tractor: Partial<InsertTractor> }) => {
      await apiRequest('PUT', `/api/tractors/${id}`, tractor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tractors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Tractor updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update tractor", variant: "destructive" });
    }
  });

  const deleteTractorMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/tractors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tractors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Tractor deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete tractor", variant: "destructive" });
    }
  });

  // Laborer mutations
  const createLaborerMutation = useMutation({
    mutationFn: async (laborer: InsertLaborer) => {
      await apiRequest('POST', '/api/laborers', laborer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/laborers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Laborer created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create laborer", variant: "destructive" });
    }
  });

  const updateLaborerMutation = useMutation({
    mutationFn: async ({ id, laborer }: { id: string; laborer: Partial<InsertLaborer> }) => {
      await apiRequest('PUT', `/api/laborers/${id}`, laborer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/laborers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Laborer updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update laborer", variant: "destructive" });
    }
  });

  const deleteLaborerMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/laborers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/laborers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Laborer deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete laborer", variant: "destructive" });
    }
  });

  // Order mutations
  const createOrderMutation = useMutation({
    mutationFn: async (order: InsertOrder) => {
      await apiRequest('POST', '/api/orders', order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bricks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tractors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Order created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create order", variant: "destructive" });
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, order }: { id: string; order: Partial<InsertOrder> }) => {
      await apiRequest('PUT', `/api/orders/${id}`, order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Order updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Order deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete order", variant: "destructive" });
    }
  });

  // Invoice mutations
  const createInvoiceMutation = useMutation({
    mutationFn: async (invoice: InsertInvoice) => {
      await apiRequest('POST', '/api/invoices', invoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Invoice created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create invoice", variant: "destructive" });
    }
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: async ({ id, invoice }: { id: string; invoice: Partial<InsertInvoice> }) => {
      await apiRequest('PUT', `/api/invoices/${id}`, invoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Invoice updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update invoice", variant: "destructive" });
    }
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      toast({ title: "Success", description: "Invoice deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete invoice", variant: "destructive" });
    }
  });

  // Settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: InsertSetting[]) => {
      await apiRequest('PUT', '/api/settings', settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({ title: "Success", description: "Settings updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update settings", variant: "destructive" });
    }
  });

  const value: AppContextType = {
    // Data
    bricks,
    tractors,
    laborers,
    orders,
    invoices,
    settings,
    statistics,
    
    // Loading states
    isLoadingBricks,
    isLoadingTractors,
    isLoadingLaborers,
    isLoadingOrders,
    isLoadingInvoices,
    isLoadingSettings,
    isLoadingStatistics,
    
    // Mutations
    createBrick: (brick: InsertBrick) => createBrickMutation.mutateAsync(brick),
    updateBrick: (id: string, brick: Partial<InsertBrick>) => updateBrickMutation.mutateAsync({ id, brick }),
    deleteBrick: (id: string) => deleteBrickMutation.mutateAsync(id),
    
    createTractor: (tractor: InsertTractor) => createTractorMutation.mutateAsync(tractor),
    updateTractor: (id: string, tractor: Partial<InsertTractor>) => updateTractorMutation.mutateAsync({ id, tractor }),
    deleteTractor: (id: string) => deleteTractorMutation.mutateAsync(id),
    
    createLaborer: (laborer: InsertLaborer) => createLaborerMutation.mutateAsync(laborer),
    updateLaborer: (id: string, laborer: Partial<InsertLaborer>) => updateLaborerMutation.mutateAsync({ id, laborer }),
    deleteLaborer: (id: string) => deleteLaborerMutation.mutateAsync(id),
    
    createOrder: (order: InsertOrder) => createOrderMutation.mutateAsync(order),
    updateOrder: (id: string, order: Partial<InsertOrder>) => updateOrderMutation.mutateAsync({ id, order }),
    deleteOrder: (id: string) => deleteOrderMutation.mutateAsync(id),
    
    createInvoice: (invoice: InsertInvoice) => createInvoiceMutation.mutateAsync(invoice),
    updateInvoice: (id: string, invoice: Partial<InsertInvoice>) => updateInvoiceMutation.mutateAsync({ id, invoice }),
    deleteInvoice: (id: string) => deleteInvoiceMutation.mutateAsync(id),

    updateSettings: (settings: InsertSetting[]) => updateSettingsMutation.mutateAsync(settings),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
