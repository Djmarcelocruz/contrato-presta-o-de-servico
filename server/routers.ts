import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ CLIENTS ============
  clients: router({
    list: protectedProcedure
      .input(z.object({ search: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return await db.listClients(ctx.user.id, input?.search);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const client = await db.getClientById(ctx.user.id, input.id);
        if (!client) throw new TRPCError({ code: 'NOT_FOUND' });
        return client;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        cpf: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().max(2).optional(),
        cep: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createClient(ctx.user.id, input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        cpf: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().max(2).optional(),
        cep: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateClient(ctx.user.id, id, data);
        return { success: true };
      }),
  }),

  // ============ INVENTORY ============
  inventory: router({
    list: protectedProcedure
      .input(z.object({
        category: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return await db.listInventory(ctx.user.id, input?.category, input?.search);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const item = await db.getInventoryItem(ctx.user.id, input.id);
        if (!item) throw new TRPCError({ code: 'NOT_FOUND' });
        return item;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string().min(1),
        quantity: z.number().int().default(0),
        unitValue: z.string().or(z.number()),
        minThreshold: z.number().int().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createInventoryItem(ctx.user.id, {
          ...input,
          unitValue: typeof input.unitValue === 'string' ? parseFloat(input.unitValue) : input.unitValue,
        } as any);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        quantity: z.number().int().optional(),
        unitValue: z.string().or(z.number()).optional(),
        minThreshold: z.number().int().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.unitValue) {
          updateData.unitValue = typeof data.unitValue === 'string' ? parseFloat(data.unitValue) : data.unitValue;
        }
        await db.updateInventoryItem(ctx.user.id, id, updateData);
        return { success: true };
      }),

    lowStock: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getLowStockItems(ctx.user.id);
      }),
  }),

  // ============ CASH FLOW ============
  cashFlow: router({
    list: protectedProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        type: z.enum(['income', 'expense']).optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return await db.listCashFlow(ctx.user.id, input?.startDate, input?.endDate, input?.type);
      }),

    create: protectedProcedure
      .input(z.object({
        date: z.date(),
        type: z.enum(['income', 'expense']),
        category: z.string().min(1),
        value: z.string().or(z.number()),
        description: z.string().optional(),
        relatedEventId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createCashFlowEntry(ctx.user.id, {
          ...input,
          value: typeof input.value === 'string' ? parseFloat(input.value) : input.value,
        } as any);
      }),

    summary: protectedProcedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getCashFlowSummary(ctx.user.id, input.startDate, input.endDate);
      }),
  }),

  // ============ BUDGETS ============
  budgets: router({
    list: protectedProcedure
      .input(z.object({ clientId: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return await db.listBudgets(ctx.user.id, input?.clientId);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const budget = await db.getBudgetById(ctx.user.id, input.id);
        if (!budget) throw new TRPCError({ code: 'NOT_FOUND' });
        return budget;
      }),

    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        eventDate: z.date(),
        eventType: z.string().min(1),
        status: z.enum(['draft', 'sent', 'approved', 'rejected', 'completed']).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check for date conflicts
        const conflict = await db.checkDateConflict(ctx.user.id, input.eventDate);
        if (conflict && conflict.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Já existe um evento agendado para esta data',
          });
        }

        return await db.createBudget(ctx.user.id, {
          ...input,
          subtotal: 0,
          tax: 0,
          total: 0,
        } as any);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        eventDate: z.date().optional(),
        eventType: z.string().optional(),
        status: z.enum(['draft', 'sent', 'approved', 'rejected', 'completed']).optional(),
        subtotal: z.string().or(z.number()).optional(),
        tax: z.string().or(z.number()).optional(),
        total: z.string().or(z.number()).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.subtotal) updateData.subtotal = typeof data.subtotal === 'string' ? parseFloat(data.subtotal) : data.subtotal;
        if (data.tax) updateData.tax = typeof data.tax === 'string' ? parseFloat(data.tax) : data.tax;
        if (data.total) updateData.total = typeof data.total === 'string' ? parseFloat(data.total) : data.total;
        
        await db.updateBudget(ctx.user.id, id, updateData);
        return { success: true };
      }),
  }),

  // ============ CONTRACTS ============
  contracts: router({
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const contract = await db.getContractById(ctx.user.id, input.id);
        if (!contract) throw new TRPCError({ code: 'NOT_FOUND' });
        return contract;
      }),

    create: protectedProcedure
      .input(z.object({
        budgetId: z.number(),
        clientId: z.number(),
        eventType: z.string().min(1),
        eventDate: z.date(),
        contractContent: z.string(),
        status: z.enum(['draft', 'sent', 'signed', 'completed', 'cancelled']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createContract(ctx.user.id, input as any);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        contractContent: z.string().optional(),
        status: z.enum(['draft', 'sent', 'signed', 'completed', 'cancelled']).optional(),
        signedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateContract(ctx.user.id, id, data as any);
        return { success: true };
      }),
  }),

  // ============ RECEIPTS ============
  receipts: router({
    list: protectedProcedure
      .input(z.object({ clientId: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return await db.listReceipts(ctx.user.id, input?.clientId);
      }),

    create: protectedProcedure
      .input(z.object({
        budgetId: z.number(),
        clientId: z.number(),
        paymentDate: z.date(),
        value: z.string().or(z.number()),
        paymentMethod: z.string().min(1),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const receiptNumber = await db.generateReceiptNumber(ctx.user.id);
        return await db.createReceipt(ctx.user.id, {
          ...input,
          receiptNumber,
          value: typeof input.value === 'string' ? parseFloat(input.value) : input.value,
        } as any);
      }),
  }),
});

export type AppRouter = typeof appRouter;
