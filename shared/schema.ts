import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bricks = pgTable("bricks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  description: text("description").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  minStock: integer("min_stock").notNull().default(1000),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const tractors = pgTable("tractors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  registrationNumber: text("registration_number").notNull().unique(),
  model: text("model").notNull(),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  status: text("status").notNull().default("available"), // available, assigned, maintenance
  lastMaintenance: timestamp("last_maintenance"),
  nextMaintenance: timestamp("next_maintenance"),
});

export const laborers = pgTable("laborers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  monthlySalary: decimal("monthly_salary", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"), // active, inactive, on_leave
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  brickType: text("brick_type").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  assignedTractorId: varchar("assigned_tractor_id"),
  assignedLaborerIds: text("assigned_laborer_ids").array(), 
  status: text("status").notNull().default("pending"), // pending, in_transit, delivered, cancelled
  orderDate: timestamp("order_date").defaultNow(),
  deliveryDate: timestamp("delivery_date"),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  orderId: varchar("order_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerAddress: text("customer_address").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  items: text("items").notNull(), // JSON string of invoice items
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, overdue
  invoiceDate: timestamp("invoice_date").defaultNow(),
  dueDate: timestamp("due_date"),
});

export const settings = pgTable("settings", {
  key: varchar("key").primaryKey(),
  value: text("value").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBrickSchema = createInsertSchema(bricks).omit({
  id: true,
  lastUpdated: true,
});

export const insertTractorSchema = createInsertSchema(tractors).omit({
  id: true,
});

export const insertLaborerSchema = createInsertSchema(laborers).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  orderDate: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  invoiceDate: true,
});

export const insertSettingSchema = createInsertSchema(settings);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Brick = typeof bricks.$inferSelect;
export type InsertBrick = z.infer<typeof insertBrickSchema>;

export type Tractor = typeof tractors.$inferSelect;
export type InsertTractor = z.infer<typeof insertTractorSchema>;

export type Laborer = typeof laborers.$inferSelect;
export type InsertLaborer = z.infer<typeof insertLaborerSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;