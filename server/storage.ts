import {
  type User, type InsertUser,
  type Brick, type InsertBrick,
  type Tractor, type InsertTractor,
  type Laborer, type InsertLaborer,
  type Order, type InsertOrder,
  type Invoice, type InsertInvoice,
  type Setting, type InsertSetting
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Brick methods
  getAllBricks(): Promise<Brick[]>;
  getBrick(id: string): Promise<Brick | undefined>;
  createBrick(brick: InsertBrick): Promise<Brick>;
  updateBrick(id: string, brick: Partial<InsertBrick>): Promise<Brick | undefined>;
  deleteBrick(id: string): Promise<boolean>;
  updateBrickStock(id: string, newStock: number): Promise<Brick | undefined>;

  // Tractor methods
  getAllTractors(): Promise<Tractor[]>;
  getTractor(id: string): Promise<Tractor | undefined>;
  createTractor(tractor: InsertTractor): Promise<Tractor>;
  updateTractor(id: string, tractor: Partial<InsertTractor>): Promise<Tractor | undefined>;
  deleteTractor(id: string): Promise<boolean>;
  getAvailableTractors(): Promise<Tractor[]>;

  // Laborer methods
  getAllLaborers(): Promise<Laborer[]>;
  getLaborer(id: string): Promise<Laborer | undefined>;
  createLaborer(laborer: InsertLaborer): Promise<Laborer>;
  updateLaborer(id: string, laborer: Partial<InsertLaborer>): Promise<Laborer | undefined>;
  deleteLaborer(id: string): Promise<boolean>;
  getActiveLaborers(): Promise<Laborer[]>;

  // Order methods
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;
  getOrdersByStatus(status: string): Promise<Order[]>;

  // Invoice methods
  getAllInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string): Promise<boolean>;
  getInvoiceByOrderId(orderId: string): Promise<Invoice | undefined>;

  // Settings methods
  getAllSettings(): Promise<Setting[]>;
  updateSettings(settings: InsertSetting[]): Promise<Setting[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bricks: Map<string, Brick>;
  private tractors: Map<string, Tractor>;
  private laborers: Map<string, Laborer>;
  private orders: Map<string, Order>;
  private invoices: Map<string, Invoice>;
  private settings: Map<string, Setting>;
  private orderCounter: number = 1;
  private invoiceCounter: number = 1;

  constructor() {
    this.users = new Map();
    this.bricks = new Map();
    this.tractors = new Map();
    this.laborers = new Map();
    this.orders = new Map();
    this.invoices = new Map();
    this.settings = new Map();

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample bricks
    const sampleBricks: InsertBrick[] = [];

    
    for (const brick of sampleBricks) {
      await this.createBrick(brick);
    }

    // Sample tractors
    const sampleTractors: InsertTractor[] = [];

    for (const tractor of sampleTractors) {
      await this.createTractor(tractor);
    }

    // Sample laborers
    const sampleLaborers: InsertLaborer[] = [];

    for (const laborer of sampleLaborers) {
      await this.createLaborer(laborer);
    }

    // Sample settings
    const sampleSettings: Setting[] = [];
    for (const setting of sampleSettings) {
      this.settings.set(setting.key, setting);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Brick methods
  async getAllBricks(): Promise<Brick[]> {
    return Array.from(this.bricks.values());
  }

  async getBrick(id: string): Promise<Brick | undefined> {
    return this.bricks.get(id);
  }

  async createBrick(insertBrick: InsertBrick): Promise<Brick> {
    const id = randomUUID();
    const brick: Brick = {
      ...insertBrick,
      id,
      currentStock: insertBrick.currentStock || 0,
      minStock: insertBrick.minStock || 1000,
      lastUpdated: new Date()
    };
    this.bricks.set(id, brick);
    return brick;
  }

  async updateBrick(id: string, updateData: Partial<InsertBrick>): Promise<Brick | undefined> {
    const brick = this.bricks.get(id);
    if (!brick) return undefined;

    const updatedBrick: Brick = {
      ...brick,
      ...updateData,
      lastUpdated: new Date()
    };
    this.bricks.set(id, updatedBrick);
    return updatedBrick;
  }

  async deleteBrick(id: string): Promise<boolean> {
    return this.bricks.delete(id);
  }

  async updateBrickStock(id: string, newStock: number): Promise<Brick | undefined> {
    return this.updateBrick(id, { currentStock: newStock });
  }

  // Tractor methods
  async getAllTractors(): Promise<Tractor[]> {
    return Array.from(this.tractors.values());
  }

  async getTractor(id: string): Promise<Tractor | undefined> {
    return this.tractors.get(id);
  }

  async createTractor(insertTractor: InsertTractor): Promise<Tractor> {
    const id = randomUUID();
    const tractor: Tractor = {
      ...insertTractor,
      id,
      status: insertTractor.status || 'available',
      driverName: insertTractor.driverName || null,
      driverPhone: insertTractor.driverPhone || null,
      lastMaintenance: insertTractor.lastMaintenance || null,
      nextMaintenance: insertTractor.nextMaintenance || null
    };
    this.tractors.set(id, tractor);
    return tractor;
  }

  async updateTractor(id: string, updateData: Partial<InsertTractor>): Promise<Tractor | undefined> {
    const tractor = this.tractors.get(id);
    if (!tractor) return undefined;

    const updatedTractor: Tractor = { ...tractor, ...updateData };
    this.tractors.set(id, updatedTractor);
    return updatedTractor;
  }

  async deleteTractor(id: string): Promise<boolean> {
    return this.tractors.delete(id);
  }

  async getAvailableTractors(): Promise<Tractor[]> {
    return Array.from(this.tractors.values()).filter(t => t.status === 'available');
  }

  // Laborer methods
  async getAllLaborers(): Promise<Laborer[]> {
    return Array.from(this.laborers.values());
  }

  async getLaborer(id: string): Promise<Laborer | undefined> {
    return this.laborers.get(id);
  }

  async createLaborer(insertLaborer: InsertLaborer): Promise<Laborer> {
    const id = randomUUID();
    const laborer: Laborer = {
      ...insertLaborer,
      id,
      // totalHoursWorked: 0, // Removed as hourly rate is no longer used
      address: insertLaborer.address || null,
      status: insertLaborer.status || 'active'
    };
    this.laborers.set(id, laborer);
    return laborer;
  }

  async updateLaborer(id: string, updateData: Partial<InsertLaborer>): Promise<Laborer | undefined> {
    const laborer = this.laborers.get(id);
    if (!laborer) return undefined;

    const updatedLaborer: Laborer = { ...laborer, ...updateData };
    this.laborers.set(id, updatedLaborer);
    return updatedLaborer;
  }

  async deleteLaborer(id: string): Promise<boolean> {
    return this.laborers.delete(id);
  }

  async getActiveLaborers(): Promise<Laborer[]> {
    return Array.from(this.laborers.values()).filter(l => l.status === 'active');
  }

  // Order methods
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) =>
      new Date(b.orderDate!).getTime() - new Date(a.orderDate!).getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const orderNumber = `ORD${String(this.orderCounter++).padStart(3, '0')}`;
    const order: Order = {
      ...insertOrder,
      id,
      orderNumber,
      orderDate: new Date(),
      status: insertOrder.status || 'pending',
      customerPhone: insertOrder.customerPhone || null,
      assignedTractorId: insertOrder.assignedTractorId || null,
      assignedLaborerIds: insertOrder.assignedLaborerIds || [],
      deliveryDate: insertOrder.deliveryDate || null
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder: Order = { ...order, ...updateData };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orders.delete(id);
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.status === status);
  }

  // Invoice methods
  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).sort((a, b) =>
      new Date(b.invoiceDate!).getTime() - new Date(a.invoiceDate!).getTime()
    );
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoiceNumber = `INV${String(this.invoiceCounter++).padStart(3, '0')}`;
    const invoice: Invoice = {
      ...insertInvoice,
      id,
      invoiceNumber,
      invoiceDate: new Date(),
      paymentStatus: insertInvoice.paymentStatus || 'pending',
      dueDate: insertInvoice.dueDate || null
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: string, updateData: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;

    const updatedInvoice: Invoice = { ...invoice, ...updateData };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    return this.invoices.delete(id);
  }

  async getInvoiceByOrderId(orderId: string): Promise<Invoice | undefined> {
    return Array.from(this.invoices.values()).find(i => i.orderId === orderId);
  }

  // Settings methods
  async getAllSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }

  async updateSettings(settings: InsertSetting[]): Promise<Setting[]> {
    settings.forEach(setting => {
      this.settings.set(setting.key, setting);
    });
    return this.getAllSettings();
  }
}

export const storage = new MemStorage();