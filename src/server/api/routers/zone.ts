import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const zoneRouter = createTRPCRouter({
  // Get all zones
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.zone.findMany({
      include: {
        zoneType: true,
        _count: {
          select: { businesses: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }),

  // Get zone types
  getZoneTypes: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.zoneType.findMany({
      orderBy: { code: "asc" },
    });
  }),

  // Create zone type
  createZoneType: publicProcedure
    .input(
      z.object({
        code: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional(),
        color: z.string().optional(),
        rules: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.zoneType.create({
        data: input,
      });
    }),

  // Create zone
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        zoneTypeId: z.string(),
        boundary: z.any(),
        area: z.number().optional(),
        restrictions: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.zone.create({
        data: {
          name: input.name,
          zoneTypeId: input.zoneTypeId,
          boundary: input.boundary,
          area: input.area,
          restrictions: input.restrictions,
        },
        include: {
          zoneType: true,
        },
      });
    }),

  // Update zone
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        zoneTypeId: z.string().optional(),
        boundary: z.any().optional(),
        area: z.number().optional(),
        restrictions: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.zone.update({
        where: { id },
        data,
      });
    }),

  // Delete zone
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.zone.delete({
        where: { id: input.id },
      });
    }),
});
