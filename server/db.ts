import { eq, and, gte, lte, desc, asc, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clients, InsertClient, inventory, InsertInventoryItem, cashFlow, InsertCashFlowEntry, budgets, InsertBudget, budgetItems, InsertBudgetItem, contracts, InsertContract, receipts, InsertReceipt } from "../drizzle/schema";
import { ENV } from './_core/env';
import { encryptSensitive, decryptSensitive } from './crypto';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ CLIENTS ============

export async function createClient(userId: number, data: Omit<InsertClient, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const encrypted: InsertClient = {
    ...data,
    userId,
    cpf: data.cpf ? encryptSensitive(data.cpf) : null,
    phone: data.phone ? encryptSensitive(data.phone) : null,
    address: data.address ? encryptSensitive(data.address) : null,
    cep: data.cep ? encryptSensitive(data.cep) : null,
  };

  const result = await db.insert(clients).values(encrypted);
  return result;
}

export async function getClientById(userId: number, clientId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(clients)
    .where(and(eq(clients.userId, userId), eq(clients.id, clientId)))
    .limit(1);

  if (result.length === 0) return null;

  // Decrypt sensitive fields
  const client = result[0];
  return {
    ...client,
    cpf: client.cpf ? decryptSensitive(client.cpf) : null,
    phone: client.phone ? decryptSensitive(client.phone) : null,
    address: client.address ? decryptSensitive(client.address) : null,
    cep: client.cep ? decryptSensitive(client.cep) : null,
  };
}

export async function listClients(userId: number, search?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [eq(clients.userId, userId), eq(clients.isActive, true)];
  if (search) {
    conditions.push(like(clients.name, `%${search}%`));
  }

  const result = await db
    .select()
    .from(clients)
    .where(and(...conditions))
    .orderBy(desc(clients.createdAt));

  // Decrypt sensitive fields for all clients
  return result.map(client => ({
    ...client,
    cpf: client.cpf ? decryptSensitive(client.cpf) : null,
    phone: client.phone ? decryptSensitive(client.phone) : null,
    address: client.address ? decryptSensitive(client.address) : null,
    cep: client.cep ? decryptSensitive(client.cep) : null,
  }));
}

export async function updateClient(userId: number, clientId: number, data: Partial<Omit<InsertClient, 'userId'>>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const encrypted: Record<string, any> = { ...data };
  if (data.cpf) encrypted.cpf = encryptSensitive(data.cpf);
  if (data.phone) encrypted.phone = encryptSensitive(data.phone);
  if (data.address) encrypted.address = encryptSensitive(data.address);
  if (data.cep) encrypted.cep = encryptSensitive(data.cep);

  await db
    .update(clients)
    .set(encrypted)
    .where(and(eq(clients.userId, userId), eq(clients.id, clientId)));
}

// ============ INVENTORY ============

export async function createInventoryItem(userId: number, data: Omit<InsertInventoryItem, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(inventory).values({ ...data, userId });
  return result;
}

export async function listInventory(userId: number, category?: string, search?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [eq(inventory.userId, userId)];
  if (category) conditions.push(eq(inventory.category, category));
  if (search) conditions.push(like(inventory.name, `%${search}%`));

  return await db
    .select()
    .from(inventory)
    .where(and(...conditions))
    .orderBy(desc(inventory.createdAt));
}

export async function getInventoryItem(userId: number, itemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(inventory)
    .where(and(eq(inventory.userId, userId), eq(inventory.id, itemId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateInventoryItem(userId: number, itemId: number, data: Partial<Omit<InsertInventoryItem, 'userId'>>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(inventory)
    .set(data)
    .where(and(eq(inventory.userId, userId), eq(inventory.id, itemId)));
}

export async function getLowStockItems(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(inventory)
    .where(and(
      eq(inventory.userId, userId),
      // This is a simplified check - in production, you'd use raw SQL or a proper comparison
    ))
    .orderBy(asc(inventory.quantity));
}

// ============ CASH FLOW ============

export async function createCashFlowEntry(userId: number, data: Omit<InsertCashFlowEntry, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(cashFlow).values({ ...data, userId });
  return result;
}

export async function listCashFlow(userId: number, startDate?: Date, endDate?: Date, type?: 'income' | 'expense') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [eq(cashFlow.userId, userId)];
  if (startDate) conditions.push(gte(cashFlow.date, startDate));
  if (endDate) conditions.push(lte(cashFlow.date, endDate));
  if (type) conditions.push(eq(cashFlow.type, type));

  return await db
    .select()
    .from(cashFlow)
    .where(and(...conditions))
    .orderBy(desc(cashFlow.date));
}

export async function getCashFlowSummary(userId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const entries = await listCashFlow(userId, startDate, endDate);
  
  let totalIncome = 0;
  let totalExpense = 0;

  entries.forEach(entry => {
    const value = parseFloat(entry.value.toString());
    if (entry.type === 'income') {
      totalIncome += value;
    } else {
      totalExpense += value;
    }
  });

  return {
    totalIncome,
    totalExpense,
    profit: totalIncome - totalExpense,
    entries,
  };
}

// ============ BUDGETS ============

export async function createBudget(userId: number, data: Omit<InsertBudget, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(budgets).values({ ...data, userId });
  return result;
}

export async function getBudgetById(userId: number, budgetId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.userId, userId), eq(budgets.id, budgetId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function listBudgets(userId: number, clientId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [eq(budgets.userId, userId)];
  if (clientId) conditions.push(eq(budgets.clientId, clientId));

  return await db
    .select()
    .from(budgets)
    .where(and(...conditions))
    .orderBy(desc(budgets.createdAt));
}

export async function checkDateConflict(userId: number, eventDate: Date, excludeBudgetId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if there's already an event on this date
  const dayStart = new Date(eventDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(eventDate);
  dayEnd.setHours(23, 59, 59, 999);

  const conditions = [
    eq(budgets.userId, userId),
    gte(budgets.eventDate, dayStart),
    lte(budgets.eventDate, dayEnd),
  ];

  if (excludeBudgetId) {
    conditions.push(/* not equal to excludeBudgetId - would need raw SQL */);
  }

  const result = await db
    .select()
    .from(budgets)
    .where(and(...conditions));

  return result.length > 0 ? result : null;
}

export async function updateBudget(userId: number, budgetId: number, data: Partial<Omit<InsertBudget, 'userId'>>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(budgets)
    .set(data)
    .where(and(eq(budgets.userId, userId), eq(budgets.id, budgetId)));
}

// ============ BUDGET ITEMS ============

export async function createBudgetItem(data: InsertBudgetItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(budgetItems).values(data);
  return result;
}

export async function listBudgetItems(budgetId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(budgetItems)
    .where(eq(budgetItems.budgetId, budgetId));
}

// ============ CONTRACTS ============

export async function createContract(userId: number, data: Omit<InsertContract, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contracts).values({ ...data, userId });
  return result;
}

export async function getContractById(userId: number, contractId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(contracts)
    .where(and(eq(contracts.userId, userId), eq(contracts.id, contractId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateContract(userId: number, contractId: number, data: Partial<Omit<InsertContract, 'userId'>>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(contracts)
    .set(data)
    .where(and(eq(contracts.userId, userId), eq(contracts.id, contractId)));
}

// ============ RECEIPTS ============

export async function createReceipt(userId: number, data: Omit<InsertReceipt, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(receipts).values({ ...data, userId });
  return result;
}

export async function getReceiptByNumber(userId: number, receiptNumber: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.receiptNumber, receiptNumber)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function listReceipts(userId: number, clientId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [eq(receipts.userId, userId)];
  if (clientId) conditions.push(eq(receipts.clientId, clientId));

  return await db
    .select()
    .from(receipts)
    .where(and(...conditions))
    .orderBy(desc(receipts.createdAt));
}

export async function generateReceiptNumber(userId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get the latest receipt number for this user
  const latest = await db
    .select()
    .from(receipts)
    .where(eq(receipts.userId, userId))
    .orderBy(desc(receipts.id))
    .limit(1);

  const nextNumber = (latest.length > 0 ? parseInt(latest[0].receiptNumber.split('-')[1]) : 0) + 1;
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `REC-${String(nextNumber).padStart(6, '0')}-${year}${month}`;
}
