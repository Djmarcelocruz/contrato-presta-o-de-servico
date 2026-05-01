import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Owner's personal data (encrypted in application layer)
  ownerName: text("ownerName"),
  ownerCpf: varchar("ownerCpf", { length: 255 }), // Encrypted
  ownerPhone: varchar("ownerPhone", { length: 255 }), // Encrypted
  ownerAddress: text("ownerAddress"), // Encrypted
  ownerCity: varchar("ownerCity", { length: 100 }),
  ownerState: varchar("ownerState", { length: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Clients table
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 255 }), // Encrypted
  phone: varchar("phone", { length: 255 }), // Encrypted
  email: varchar("email", { length: 320 }),
  address: text("address"), // Encrypted
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  cep: varchar("cep", { length: 20 }), // Encrypted
  notes: text("notes"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("clients_userId_idx").on(table.userId),
  nameIdx: index("clients_name_idx").on(table.name),
}));

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// Inventory/Equipment table
export const inventory = mysqlTable("inventory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // cables, lighting, sound, etc
  quantity: int("quantity").default(0),
  unitValue: decimal("unitValue", { precision: 10, scale: 2 }).notNull(),
  minThreshold: int("minThreshold").default(5), // Alert when below this
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("inventory_userId_idx").on(table.userId),
  categoryIdx: index("inventory_category_idx").on(table.category),
}));

export type InventoryItem = typeof inventory.$inferSelect;
export type InsertInventoryItem = typeof inventory.$inferInsert;

// Cash Flow table
export const cashFlow = mysqlTable("cashFlow", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: timestamp("date").notNull(),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // DJ, sound, lighting, fuel, maintenance, etc
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  relatedEventId: int("relatedEventId"), // Link to event/budget if applicable
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("cashFlow_userId_idx").on(table.userId),
  dateIdx: index("cashFlow_date_idx").on(table.date),
  typeIdx: index("cashFlow_type_idx").on(table.type),
}));

export type CashFlowEntry = typeof cashFlow.$inferSelect;
export type InsertCashFlowEntry = typeof cashFlow.$inferInsert;

// Budgets/Quotes table
export const budgets = mysqlTable("budgets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientId: int("clientId").notNull(),
  eventDate: timestamp("eventDate").notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(), // wedding, birthday, graduation, corporate, show, other
  status: mysqlEnum("status", ["draft", "sent", "approved", "rejected", "completed"]).default("draft"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull().default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("budgets_userId_idx").on(table.userId),
  clientIdIdx: index("budgets_clientId_idx").on(table.clientId),
  eventDateIdx: index("budgets_eventDate_idx").on(table.eventDate),
}));

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = typeof budgets.$inferInsert;

// Budget Items (line items in a budget)
export const budgetItems = mysqlTable("budgetItems", {
  id: int("id").autoincrement().primaryKey(),
  budgetId: int("budgetId").notNull(),
  inventoryId: int("inventoryId"), // Link to inventory if using existing equipment
  description: varchar("description", { length: 255 }).notNull(),
  quantity: int("quantity").default(1),
  unitValue: decimal("unitValue", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
}, (table) => ({
  budgetIdIdx: index("budgetItems_budgetId_idx").on(table.budgetId),
}));

export type BudgetItem = typeof budgetItems.$inferSelect;
export type InsertBudgetItem = typeof budgetItems.$inferInsert;

// Contracts table
export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  budgetId: int("budgetId").notNull(),
  clientId: int("clientId").notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  eventDate: timestamp("eventDate").notNull(),
  contractContent: text("contractContent"), // HTML or plain text contract
  status: mysqlEnum("status", ["draft", "sent", "signed", "completed", "cancelled"]).default("draft"),
  signedAt: timestamp("signedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("contracts_userId_idx").on(table.userId),
  budgetIdIdx: index("contracts_budgetId_idx").on(table.budgetId),
}));

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

// Receipts/Payment Receipts table
export const receipts = mysqlTable("receipts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  budgetId: int("budgetId").notNull(),
  clientId: int("clientId").notNull(),
  receiptNumber: varchar("receiptNumber", { length: 50 }).notNull().unique(),
  paymentDate: timestamp("paymentDate").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }).notNull(), // cash, card, transfer, check
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("receipts_userId_idx").on(table.userId),
  receiptNumberIdx: index("receipts_receiptNumber_idx").on(table.receiptNumber),
}));

export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = typeof receipts.$inferInsert;