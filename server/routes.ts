import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBrickSchema, 
  insertTractorSchema, 
  insertLaborerSchema, 
  insertOrderSchema,
  insertInvoiceSchema,
  insertSettingSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bricks routes
  app.get("/api/bricks", async (req, res) => {
    try {
      const bricks = await storage.getAllBricks();
      res.json(bricks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bricks" });
    }
  });

  app.post("/api/bricks", async (req, res) => {
    try {
      const validatedData = insertBrickSchema.parse(req.body);
      const brick = await storage.createBrick(validatedData);
      res.status(201).json(brick);
    } catch (error) {
      res.status(400).json({ message: "Invalid brick data" });
    }
  });

  app.put("/api/bricks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertBrickSchema.partial().parse(req.body);
      const brick = await storage.updateBrick(id, validatedData);
      if (!brick) {
        return res.status(404).json({ message: "Brick not found" });
      }
      res.json(brick);
    } catch (error) {
      res.status(400).json({ message: "Invalid brick data" });
    }
  });

  app.delete("/api/bricks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBrick(id);
      if (!deleted) {
        return res.status(404).json({ message: "Brick not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brick" });
    }
  });

  // Tractors routes
  app.get("/api/tractors", async (req, res) => {
    try {
      const tractors = await storage.getAllTractors();
      res.json(tractors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tractors" });
    }
  });

  app.get("/api/tractors/available", async (req, res) => {
    try {
      const tractors = await storage.getAvailableTractors();
      res.json(tractors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch available tractors" });
    }
  });

  app.post("/api/tractors", async (req, res) => {
    try {
      const validatedData = insertTractorSchema.parse(req.body);
      const tractor = await storage.createTractor(validatedData);
      res.status(201).json(tractor);
    } catch (error) {
      res.status(400).json({ message: "Invalid tractor data" });
    }
  });

  app.put("/api/tractors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTractorSchema.partial().parse(req.body);
      const tractor = await storage.updateTractor(id, validatedData);
      if (!tractor) {
        return res.status(404).json({ message: "Tractor not found" });
      }
      res.json(tractor);
    } catch (error) {
      res.status(400).json({ message: "Invalid tractor data" });
    }
  });

  app.delete("/api/tractors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTractor(id);
      if (!deleted) {
        return res.status(404).json({ message: "Tractor not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tractor" });
    }
  });

  // Laborers routes
  app.get("/api/laborers", async (req, res) => {
    try {
      const laborers = await storage.getAllLaborers();
      res.json(laborers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch laborers" });
    }
  });

  app.get("/api/laborers/active", async (req, res) => {
    try {
      const laborers = await storage.getActiveLaborers();
      res.json(laborers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active laborers" });
    }
  });

  app.post("/api/laborers", async (req, res) => {
    try {
      const validatedData = insertLaborerSchema.parse(req.body);
      const laborer = await storage.createLaborer(validatedData);
      res.status(201).json(laborer);
    } catch (error) {
      res.status(400).json({ message: "Invalid laborer data" });
    }
  });

  app.put("/api/laborers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertLaborerSchema.partial().parse(req.body);
      const laborer = await storage.updateLaborer(id, validatedData);
      if (!laborer) {
        return res.status(404).json({ message: "Laborer not found" });
      }
      res.json(laborer);
    } catch (error) {
      res.status(400).json({ message: "Invalid laborer data" });
    }
  });

  app.delete("/api/laborers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteLaborer(id);
      if (!deleted) {
        return res.status(404).json({ message: "Laborer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete laborer" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      const orders = await storage.getOrdersByStatus(status);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders by status" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      // Update brick stock
      const brick = await storage.getBrick(validatedData.brickType);
      if (brick) {
        await storage.updateBrickStock(brick.id, brick.currentStock - validatedData.quantity);
      }
      
      // Update tractor status if assigned
      if (validatedData.assignedTractorId) {
        await storage.updateTractor(validatedData.assignedTractorId, { status: 'assigned' });
      }
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(id, validatedData);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteOrder(id);
      if (!deleted) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

  // Invoices routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/order/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const invoice = await storage.getInvoiceByOrderId(orderId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      // Coerce common date strings to Date objects so drizzle-zod's date parsing succeeds
      const payload = { ...req.body } as Record<string, any>;
      for (const key of Object.keys(payload)) {
        const val = payload[key];
        if (typeof val === 'string' && /date$/i.test(key)) {
          const d = new Date(val);
          if (!isNaN(d.getTime())) payload[key] = d;
        }
      }

      const validatedData = insertInvoiceSchema.parse(payload);
      const invoice = await storage.createInvoice(validatedData);
      res.status(201).json(invoice);
    } catch (error) {
      // If this is a Zod validation error, include details to help debugging
      const errBody: any = { message: "Invalid invoice data" };
      if (error && typeof error === 'object' && 'issues' in (error as any)) {
        errBody.details = (error as any).issues;
      } else if (error instanceof Error) {
        errBody.details = error.message;
      }
      res.status(400).json(errBody);
    }
  });

  app.put("/api/invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      // Coerce dates in partial updates as well
      const payload = { ...req.body } as Record<string, any>;
      for (const key of Object.keys(payload)) {
        const val = payload[key];
        if (typeof val === 'string' && /date$/i.test(key)) {
          const d = new Date(val);
          if (!isNaN(d.getTime())) payload[key] = d;
        }
      }

      const validatedData = insertInvoiceSchema.partial().parse(payload);
      const invoice = await storage.updateInvoice(id, validatedData);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      const errBody: any = { message: "Invalid invoice data" };
      if (error && typeof error === 'object' && 'issues' in (error as any)) {
        errBody.details = (error as any).issues;
      } else if (error instanceof Error) {
        errBody.details = error.message;
      }
      res.status(400).json(errBody);
    }
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteInvoice(id);
      if (!deleted) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  // Statistics route for dashboard
// Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingSchema.array().parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });
  app.get("/api/statistics", async (req, res) => {
    try {
      const bricks = await storage.getAllBricks();
      const tractors = await storage.getAllTractors();
      const laborers = await storage.getAllLaborers();
      const orders = await storage.getAllOrders();
      const invoices = await storage.getAllInvoices();

      const stats = {
        totalBricks: bricks.reduce((sum, brick) => sum + brick.currentStock, 0),
        availableTractors: tractors.filter(t => t.status === 'available').length,
        activeLaborers: laborers.filter(l => l.status === 'active').length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalSales: invoices
          .filter(i => i.paymentStatus === 'paid')
          .reduce((sum, invoice) => sum + parseFloat(invoice.totalAmount), 0),
        lowStockBricks: bricks.filter(brick => brick.currentStock <= brick.minStock)
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
