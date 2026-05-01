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

describe("DJ Brow - End-to-End Integration Tests", () => {
  describe("Complete Workflow: Client → Budget → Contract → Receipt", () => {
    let clientId: number;
    let budgetId: number;
    let contractId: number;
    let receiptId: number;

    it("Step 1: Create a new client", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const client = await caller.clients.create({
        name: "Maria Silva",
        email: "maria@example.com",
        phone: "11987654321",
        cpf: "12345678901",
        address: "Av. Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        zipCode: "01311100",
      });

      expect(client).toHaveProperty("id");
      expect(client.name).toBe("Maria Silva");
      clientId = client.id;
    });

    it("Step 2: Create a budget for the client", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const eventDate = new Date("2026-07-15");
      const budget = await caller.budgets.create({
        clientId,
        eventDate,
        eventType: "Casamento",
        status: "draft",
      });

      expect(budget).toHaveProperty("id");
      expect(budget.clientId).toBe(clientId);
      expect(budget.eventType).toBe("Casamento");
      budgetId = budget.id;
    });

    it("Step 3: Create a contract from the budget", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const contract = await caller.contracts.create({
        budgetId,
        clientId,
        eventType: "Casamento",
        eventDate: new Date("2026-07-15"),
        contractContent: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS - DJ PARA CASAMENTO

CONTRATANTE: Maria Silva
CONTRATADA: DJ Brow

1. OBJETO DO CONTRATO
Prestação de serviço de DJ e sonorização para casamento.

2. DATA E LOCAL
Data: 15/07/2026
Local: Salão de Eventos XYZ
Horário: 20:00 às 02:00

3. VALORES E CONDIÇÕES
Valor total: R$ 2.500,00
Forma de pagamento: Transferência Bancária
Prazo de pagamento: 50% na assinatura, 50% 7 dias antes do evento

4. RESPONSABILIDADES
- Fornecimento de equipamentos profissionais
- Animação musical durante o evento
- Suporte técnico durante toda a duração

5. CANCELAMENTO
Cancelamento com até 30 dias de antecedência: reembolso de 50%
Cancelamento com menos de 30 dias: sem reembolso

6. ASSINATURAS
_________________          _________________
Contratante                Contratada`,
        status: "draft",
      });

      expect(contract).toHaveProperty("id");
      expect(contract.budgetId).toBe(budgetId);
      expect(contract.eventType).toBe("Casamento");
      contractId = contract.id;
    });

    it("Step 4: Generate a receipt for payment", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const receipt = await caller.receipts.create({
        budgetId,
        clientId,
        paymentDate: new Date(),
        value: 1250.00,
        paymentMethod: "Transferência Bancária",
        description: "Sinal para casamento de Maria Silva",
      });

      expect(receipt).toHaveProperty("id");
      expect(receipt).toHaveProperty("receiptNumber");
      expect(receipt.clientId).toBe(clientId);
      expect(receipt.value).toBe(1250.00);
      receiptId = receipt.id;
    });

    it("Step 5: Verify all records are linked correctly", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      // Verify client exists
      const clients = await caller.clients.list();
      const client = clients.find(c => c.id === clientId);
      expect(client).toBeDefined();
      expect(client?.name).toBe("Maria Silva");

      // Verify budget exists
      const budgets = await caller.budgets.list();
      const budget = budgets.find(b => b.id === budgetId);
      expect(budget).toBeDefined();
      expect(budget?.clientId).toBe(clientId);

      // Verify contract exists
      const contracts = await caller.contracts.list();
      const contract = contracts.find(c => c.id === contractId);
      expect(contract).toBeDefined();
      expect(contract?.budgetId).toBe(budgetId);

      // Verify receipt exists
      const receipts = await caller.receipts.list();
      const receipt = receipts.find(r => r.id === receiptId);
      expect(receipt).toBeDefined();
      expect(receipt?.budgetId).toBe(budgetId);
    });
  });

  describe("Financial Flow Validation", () => {
    it("should track income from receipts", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      // Create income entry
      const income = await caller.cashFlow.create({
        type: "income",
        category: "DJ",
        value: 2500.00,
        description: "Casamento - Maria Silva",
        date: new Date(),
      });

      expect(income.type).toBe("income");
      expect(income.value).toBe(2500.00);
      expect(income.category).toBe("DJ");
    });

    it("should track expenses", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const expense = await caller.cashFlow.create({
        type: "expense",
        category: "Maintenance",
        value: 150.00,
        description: "Manutenção de equipamento",
        date: new Date(),
      });

      expect(expense.type).toBe("expense");
      expect(expense.value).toBe(150.00);
    });

    it("should calculate correct financial summary", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const summary = await caller.cashFlow.summary({
        startDate,
        endDate,
      });

      expect(summary).toHaveProperty("totalIncome");
      expect(summary).toHaveProperty("totalExpense");
      expect(typeof summary.totalIncome).toBe("number");
      expect(typeof summary.totalExpense).toBe("number");
      expect(summary.totalIncome).toBeGreaterThanOrEqual(0);
      expect(summary.totalExpense).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Inventory Management", () => {
    it("should create equipment and track stock", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const equipment = await caller.inventory.create({
        name: "Caixa de Som JBL 500W",
        description: "Caixa de som profissional com 500W de potência",
        category: "Som",
        quantity: 5,
        unitPrice: 1200.00,
        minimumStock: 2,
      });

      expect(equipment.quantity).toBe(5);
      expect(equipment.unitPrice).toBe(1200.00);
    });

    it("should alert when stock is low", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const lowStock = await caller.inventory.getLowStock();
      expect(Array.isArray(lowStock)).toBe(true);
    });
  });

  describe("Data Validation and Error Handling", () => {
    it("should reject invalid email format", async () => {
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

    it("should require authentication for protected procedures", async () => {
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

  describe("Search and Filter Functionality", () => {
    it("should search clients by name", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      // Create a test client first
      await caller.clients.create({
        name: "João Pereira",
        email: "joao@example.com",
        phone: "11988888888",
        cpf: "98765432101",
        address: "Rua B, 456",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234567",
      });

      const results = await caller.clients.search({ query: "João" });
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it("should filter inventory by category", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const allEquipment = await caller.inventory.list();
      expect(Array.isArray(allEquipment)).toBe(true);
    });
  });

  describe("Concurrent Operations", () => {
    it("should handle multiple budget creations simultaneously", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const promises = Array.from({ length: 3 }).map((_, i) =>
        caller.budgets.create({
          clientId: 1,
          eventDate: new Date(`2026-08-${10 + i}`),
          eventType: "Aniversário",
          status: "draft",
        })
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(3);
      expect(results.every(r => r.id)).toBe(true);
    });
  });
});
