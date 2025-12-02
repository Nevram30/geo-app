import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  // Get all business categories
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.businessCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { businesses: true },
        },
      },
    });
  }),

  // Get single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.businessCategory.findUnique({
        where: { id: input.id },
      });
    }),

  // Create category
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        description: z.string().optional(),
        allowedZones: z.array(z.string()).optional(),
        minDistance: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.businessCategory.create({
        data: input,
      });
    }),

  // Update category
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        code: z.string().min(1).optional(),
        description: z.string().optional(),
        allowedZones: z.array(z.string()).optional(),
        minDistance: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.businessCategory.update({
        where: { id },
        data,
      });
    }),

  // Delete category
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.businessCategory.delete({
        where: { id: input.id },
      });
    }),
});
