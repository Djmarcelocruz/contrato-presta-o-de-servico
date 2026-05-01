import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context
const createMockContext = (role: 'user' | 'admin' = 'user'): TrpcContext => ({
  user: {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {
    protocol: "https",
    headers: {},
  } as any,
  res: {
    clearCookie: vi.fn(),
  } as any,
});

describe("DJ Brow System - Feature Tests", () => {
  describe("Clients Module", () => {
    it("should create a new client", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.clients.create({
        name: "João Silva",
        email: "joao@example.com",
        phone: "11999999999",
        cpf: "12345678901",
        address: "Rua A, 123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234567",
      });

      expect(result).toHaveProperty("id");
      expect(result.name).toBe("João Silva");
    });

    it("should list all clients", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.clients.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should search clients by name", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.clients.search({ query: "João" });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Inventory Module", () => {
    it("should create a new equipment", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.inventory.create({
        name: "Cabo XLR 5m",
        description: "Cabo XLR profissional 5 metros",
        category: "Cabos",
        quantity: 10,
        unitPrice: 25.50,
        minimumStock: 2,
      });

      expect(result).toHaveProperty("id");
      expect(result.name).toBe("Cabo XLR 5m");
      expect(result.quantity).toBe(10);
    });

    it("should list all equipment", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.inventory.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should get low stock alerts", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.inventory.getLowStock();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Cash Flow Module", () => {
    it("should create an income entry", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.cashFlow.create({
        type: "income",
        category: "DJ",
        value: 500.00,
        description: "Evento casamento",
        date: new Date(),
      });

      expect(result).toHaveProperty("id");
      expect(result.type).toBe("income");
      expect(result.value).toBe(500.00);
    });

    it("should create an expense entry", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.cashFlow.create({
        type: "expense",
        category: "Maintenance",
        value: 150.00,
        description: "Manutenção de equipamento",
        date: new Date(),
      });

      expect(result).toHaveProperty("id");
      expect(result.type).toBe("expense");
    });

    it("should calculate monthly summary", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const result = await caller.cashFlow.summary({
        startDate,
        endDate,
      });

      expect(result).toHaveProperty("totalIncome");
      expect(result).toHaveProperty("totalExpense");
      expect(typeof result.totalIncome).toBe("number");
      expect(typeof result.totalExpense).toBe("number");
    });
  });

  describe("Budgets Module", () => {
    it("should create a new budget", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.budgets.create({
        clientId: 1,
        eventDate: new Date("2026-06-15"),
        eventType: "Casamento",
        status: "draft",
      });

      expect(result).toHaveProperty("id");
      expect(result.eventType).toBe("Casamento");
      expect(result.status).toBe("draft");
    });

    it("should list all budgets", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.budgets.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should check for date conflicts", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const testDate = new Date("2026-06-20");

      // This should work if no conflict exists
      const result = await caller.budgets.checkDateConflict({
        eventDate: testDate,
      });

      expect(typeof result.hasConflict).toBe("boolean");
    });
  });

  describe("Contracts Module", () => {
    it("should create a new contract", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contracts.create({
        budgetId: 1,
        clientId: 1,
        eventType: "Casamento",
        eventDate: new Date("2026-06-15"),
        contractContent: "CONTRATO DE SERVIÇOS DE DJ...",
        status: "draft",
      });

      expect(result).toHaveProperty("id");
      expect(result.eventType).toBe("Casamento");
      expect(result.status).toBe("draft");
    });

    it("should list all contracts", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contracts.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Receipts Module", () => {
    it("should create a new receipt", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.receipts.create({
        budgetId: 1,
        clientId: 1,
        paymentDate: new Date(),
        value: 1500.00,
        paymentMethod: "Transferência Bancária",
      });

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("receiptNumber");
      expect(result.value).toBe(1500.00);
    });

    it("should list all receipts", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.receipts.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should generate sequential receipt numbers", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const receipt1 = await caller.receipts.create({
        budgetId: 1,
        clientId: 1,
        paymentDate: new Date(),
        value: 500.00,
        paymentMethod: "Dinheiro",
      });

      const receipt2 = await caller.receipts.create({
        budgetId: 2,
        clientId: 2,
        paymentDate: new Date(),
        value: 600.00,
        paymentMethod: "PIX",
      });

      expect(receipt2.receiptNumber).toBeGreaterThan(receipt1.receiptNumber);
    });
  });

  describe("Authentication", () => {
    it("should logout user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();
      expect(result.success).toBe(true);
    });

    it("should get current user info", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();
      expect(result).toEqual(ctx.user);
    });
  });

  describe("Data Validation", () => {
    it("should reject invalid email", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.clients.create({
          name: "Test",
          email: "invalid-email",
          phone: "11999999999",
          cpf: "12345678901",
          address: "Test",
          city: "Test",
          state: "SP",
          zipCode: "01234567",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should reject negative values in cash flow", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.cashFlow.create({
          type: "income",
          category: "DJ",
          value: -100,
          description: "Invalid",
          date: new Date(),
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("Security", () => {
    it("should not allow unauthenticated access to protected procedures", async () => {
      const unAuthCtx = {
        user: null,
        req: { protocol: "https", headers: {} } as any,
        res: { clearCookie: vi.fn() } as any,
      } as any;

      const caller = appRouter.createCaller(unAuthCtx);

      try {
        await caller.clients.list();
        expect.fail("Should have thrown auth error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });
});
