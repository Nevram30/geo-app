/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// GIS operations with Turf.js and GeoJSON require dynamic typing

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import * as turf from "@turf/turf";

export const businessRouter = createTRPCRouter({
  // Get all businesses with filters
  getAll: publicProcedure
    .input(
      z
        .object({
          barangayId: z.string().optional(),
          categoryId: z.string().optional(),
          status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "REQUIRES_REVISION"]).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.business.findMany({
        where: {
          barangayId: input?.barangayId,
          categoryId: input?.categoryId,
          status: input?.status,
        },
        include: {
          barangay: true,
          category: true,
          zone: {
            include: {
              zoneType: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
      });
    }),

  // Get single business by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.business.findUnique({
        where: { id: input.id },
        include: {
          barangay: true,
          category: true,
          zone: {
            include: {
              zoneType: true,
            },
          },
          reviewedByUser: true,
        },
      });
    }),

  // Create business application with automated compliance checks
  create: publicProcedure
    .input(
      z.object({
        businessName: z.string().min(1),
        ownerName: z.string().min(1),
        ownerContact: z.string().optional(),
        ownerEmail: z.string().email().optional(),
        address: z.string().min(1),
        barangayId: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        categoryId: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Generate application number
      const count = await ctx.db.business.count();
      const applicationNo = `BA-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

      // Create point for the business location
      const businessPoint = turf.point([input.longitude, input.latitude]);

      // 1. ZONING COMPLIANCE CHECK
      const zones = await ctx.db.zone.findMany({
        include: { zoneType: true },
      });

      let matchedZone = null;
      for (const zone of zones) {
        if (zone.boundary) {
          const zonePolygon = turf.polygon((zone.boundary as any).coordinates);
          if (turf.booleanPointInPolygon(businessPoint, zonePolygon)) {
            matchedZone = zone;
            break;
          }
        }
      }

      // Get business category to check allowed zones
      const category = await ctx.db.businessCategory.findUnique({
        where: { id: input.categoryId },
      });

      const complianceChecks: any = {
        zoneCheck: {
          passed: false,
          zone: matchedZone?.name ?? "Unknown",
          zoneType: matchedZone?.zoneType.name ?? "Unknown",
          message: "Location not in any defined zone",
        },
        proximityCheck: {
          passed: true,
          violations: [],
        },
        hazardCheck: {
          passed: true,
          hazards: [],
        },
      };

      // Check if business category is allowed in this zone
      if (matchedZone && category?.allowedZones) {
        const allowedZones = category.allowedZones as string[];
        if (allowedZones.includes(matchedZone.zoneType.code)) {
          complianceChecks.zoneCheck.passed = true;
          complianceChecks.zoneCheck.message = "Business category allowed in this zone";
        } else {
          complianceChecks.zoneCheck.message = `Business category not allowed in ${matchedZone.zoneType.name} zone`;
        }
      }

      // 2. HAZARD ZONE CHECK
      const hazardZones = await ctx.db.hazardZone.findMany();
      const riskFlags: any[] = [];

      for (const hazard of hazardZones) {
        if (hazard.boundary) {
          const hazardPolygon = turf.polygon((hazard.boundary as any).coordinates);
          if (turf.booleanPointInPolygon(businessPoint, hazardPolygon)) {
            complianceChecks.hazardCheck.passed = false;
            complianceChecks.hazardCheck.hazards.push({
              type: hazard.type,
              severity: hazard.severity,
              name: hazard.name,
            });
            riskFlags.push({
              type: "HAZARD_ZONE",
              severity: hazard.severity,
              message: `Location intersects with ${hazard.type} hazard zone (${hazard.severity} severity)`,
              hazardName: hazard.name,
            });
          }
        }
      }

      // 3. PROXIMITY RULES CHECK
      if (category?.minDistance) {
        const nearbyBusinesses = await ctx.db.business.findMany({
          where: {
            categoryId: input.categoryId,
            status: "APPROVED",
          },
        });

        for (const nearby of nearbyBusinesses) {
          const nearbyPoint = turf.point([nearby.longitude, nearby.latitude]);
          const distance = turf.distance(businessPoint, nearbyPoint, { units: "meters" });

          if (distance < category.minDistance) {
            complianceChecks.proximityCheck.passed = false;
            complianceChecks.proximityCheck.violations.push({
              businessName: nearby.businessName,
              distance: Math.round(distance),
              required: category.minDistance,
            });
          }
        }
      }

      // Determine initial status based on checks
      let initialStatus: "PENDING" | "UNDER_REVIEW" | "REQUIRES_REVISION" = "PENDING";
      if (!complianceChecks.zoneCheck.passed || !complianceChecks.hazardCheck.passed) {
        initialStatus = "REQUIRES_REVISION";
      } else if (!complianceChecks.proximityCheck.passed) {
        initialStatus = "UNDER_REVIEW";
      }

      // Create the business application
      return ctx.db.business.create({
        data: {
          applicationNo,
          businessName: input.businessName,
          ownerName: input.ownerName,
          ownerContact: input.ownerContact,
          ownerEmail: input.ownerEmail,
          address: input.address,
          barangayId: input.barangayId,
          latitude: input.latitude,
          longitude: input.longitude,
          categoryId: input.categoryId,
          description: input.description,
          zoneId: matchedZone?.id,
          status: initialStatus,
          complianceChecks,
          riskFlags: riskFlags.length > 0 ? riskFlags : undefined,
        },
        include: {
          barangay: true,
          category: true,
          zone: {
            include: {
              zoneType: true,
            },
          },
        },
      });
    }),

  // Update business status
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "REQUIRES_REVISION"]),
        remarks: z.string().optional(),
        reviewedBy: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {
        status: input.status,
        remarks: input.remarks,
        reviewedAt: new Date(),
      };

      if (input.reviewedBy) {
        updateData.reviewedBy = input.reviewedBy;
      }

      if (input.status === "APPROVED") {
        updateData.approvedAt = new Date();
      }

      return ctx.db.business.update({
        where: { id: input.id },
        data: updateData,
      });
    }),

  // Get business statistics
  getStats: publicProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.business.count();
    const pending = await ctx.db.business.count({ where: { status: "PENDING" } });
    const approved = await ctx.db.business.count({ where: { status: "APPROVED" } });
    const rejected = await ctx.db.business.count({ where: { status: "REJECTED" } });
    const underReview = await ctx.db.business.count({ where: { status: "UNDER_REVIEW" } });

    return {
      total,
      pending,
      approved,
      rejected,
      underReview,
    };
  }),

  // Get businesses by barangay for clustering analysis
  getByBarangay: publicProcedure.query(async ({ ctx }) => {
    const barangays = await ctx.db.barangay.findMany({
      include: {
        _count: {
          select: { businesses: true },
        },
      },
    });

    return barangays.map((b) => ({
      id: b.id,
      name: b.name,
      businessCount: b._count.businesses,
    }));
  }),

  // Delete business
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.business.delete({
        where: { id: input.id },
      });
    }),
});
