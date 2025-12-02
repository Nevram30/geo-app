import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const hazardRouter = createTRPCRouter({
  // Get all hazard zones
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.hazardZone.findMany({
      include: {
        barangay: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get hazard zones by type
  getByType: publicProcedure
    .input(
      z.object({
        type: z.enum(["FLOOD", "LANDSLIDE", "EARTHQUAKE_FAULT", "COASTAL_HAZARD", "FIRE_HAZARD", "OTHER"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.hazardZone.findMany({
        where: { type: input.type },
        include: {
          barangay: true,
        },
      });
    }),

  // Create hazard zone
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.enum(["FLOOD", "LANDSLIDE", "EARTHQUAKE_FAULT", "COASTAL_HAZARD", "FIRE_HAZARD", "OTHER"]),
        severity: z.enum(["LOW", "MODERATE", "HIGH", "VERY_HIGH"]),
        barangayId: z.string().optional(),
        boundary: z.any(),
        description: z.string().optional(),
        source: z.string().optional(),
        dateAssessed: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.hazardZone.create({
        data: {
          name: input.name,
          type: input.type,
          severity: input.severity,
          barangayId: input.barangayId,
          boundary: input.boundary,
          description: input.description,
          source: input.source,
          dateAssessed: input.dateAssessed,
        },
        include: {
          barangay: true,
        },
      });
    }),

  // Update hazard zone
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        type: z.enum(["FLOOD", "LANDSLIDE", "EARTHQUAKE_FAULT", "COASTAL_HAZARD", "FIRE_HAZARD", "OTHER"]).optional(),
        severity: z.enum(["LOW", "MODERATE", "HIGH", "VERY_HIGH"]).optional(),
        barangayId: z.string().optional(),
        boundary: z.any().optional(),
        description: z.string().optional(),
        source: z.string().optional(),
        dateAssessed: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.hazardZone.update({
        where: { id },
        data,
      });
    }),

  // Delete hazard zone
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.hazardZone.delete({
        where: { id: input.id },
      });
    }),
});
