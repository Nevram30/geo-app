import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const barangayRouter = createTRPCRouter({
  // Get all barangays
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.barangay.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { businesses: true, hazardZones: true },
        },
      },
    });
  }),

  // Get single barangay by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.barangay.findUnique({
        where: { id: input.id },
        include: {
          businesses: {
            include: {
              category: true,
              zone: true,
            },
          },
          hazardZones: true,
        },
      });
    }),

  // Create barangay
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        population: z.number().optional(),
        area: z.number().optional(),
        boundary: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.barangay.create({
        data: input,
      });
    }),

  // Update barangay
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        code: z.string().min(1).optional(),
        population: z.number().optional(),
        area: z.number().optional(),
        boundary: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.barangay.update({
        where: { id },
        data,
      });
    }),

  // Delete barangay
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.barangay.delete({
        where: { id: input.id },
      });
    }),
});
