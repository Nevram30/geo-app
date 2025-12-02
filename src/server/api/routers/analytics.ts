/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// GIS analytics with Turf.js requires dynamic typing for GeoJSON structures

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import * as turf from "@turf/turf";

export const analyticsRouter = createTRPCRouter({
  // Get clustering analysis
  getClustering: protectedProcedure
    .input(
      z.object({
        radius: z.number().default(1000), // meters
        minPoints: z.number().default(3),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const businesses = await ctx.db.business.findMany({
        where: { status: "APPROVED" },
        include: {
          barangay: true,
          category: true,
        },
      });

      if (businesses.length === 0) {
        return { clusters: [], statistics: { totalClusters: 0, totalBusinesses: 0 } };
      }

      // Create points for clustering
      const points = businesses.map((b) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [b.longitude, b.latitude],
        },
        properties: {
          id: b.id,
          name: b.businessName,
          category: b.category.name,
          barangay: b.barangay.name,
        },
      }));

      const featureCollection = turf.featureCollection(points);

      // Simple clustering based on distance
      const clusters: any[] = [];
      const visited = new Set<number>();
      const radius = input?.radius ?? 1000;
      const minPoints = input?.minPoints ?? 3;

      for (let i = 0; i < points.length; i++) {
        if (visited.has(i)) continue;

        const cluster: any[] = [i];
        visited.add(i);

        for (let j = i + 1; j < points.length; j++) {
          if (visited.has(j)) continue;

          const distance = turf.distance(
            points[i]!.geometry.coordinates,
            points[j]!.geometry.coordinates,
            { units: "meters" },
          );

          if (distance <= radius) {
            cluster.push(j);
            visited.add(j);
          }
        }

        if (cluster.length >= minPoints) {
          const clusterBusinesses = cluster.map((idx) => businesses[idx]!);
          const centerPoint = turf.center(
            turf.featureCollection(cluster.map((idx) => points[idx]!)),
          );

          clusters.push({
            id: `cluster-${clusters.length + 1}`,
            businessCount: cluster.length,
            center: {
              latitude: centerPoint.geometry.coordinates[1],
              longitude: centerPoint.geometry.coordinates[0],
            },
            businesses: clusterBusinesses.map((b) => ({
              id: b.id,
              name: b.businessName,
              category: b.category.name,
              barangay: b.barangay.name,
            })),
            categories: [...new Set(clusterBusinesses.map((b) => b.category.name))],
            barangays: [...new Set(clusterBusinesses.map((b) => b.barangay.name))],
          });
        }
      }

      return {
        clusters,
        statistics: {
          totalClusters: clusters.length,
          totalBusinesses: businesses.length,
          clusteredBusinesses: clusters.reduce((sum, c) => sum + c.businessCount, 0),
          averageClusterSize: clusters.length > 0
            ? Math.round(clusters.reduce((sum, c) => sum + c.businessCount, 0) / clusters.length)
            : 0,
        },
      };
    }),

  // Get density heatmap data
  getDensityHeatmap: protectedProcedure.query(async ({ ctx }) => {
    const businesses = await ctx.db.business.findMany({
      where: { status: "APPROVED" },
      select: {
        latitude: true,
        longitude: true,
        businessName: true,
      },
    });

    // Create grid cells for density calculation
    const gridSize = 0.01; // approximately 1km
    const densityMap = new Map<string, number>();

    businesses.forEach((b) => {
      const gridX = Math.floor(b.latitude / gridSize);
      const gridY = Math.floor(b.longitude / gridSize);
      const key = `${gridX},${gridY}`;
      densityMap.set(key, (densityMap.get(key) ?? 0) + 1);
    });

    const heatmapData = Array.from(densityMap.entries()).map(([key, count]) => {
      const [gridX, gridY] = key.split(",").map(Number);
      return {
        latitude: (gridX! + 0.5) * gridSize,
        longitude: (gridY! + 0.5) * gridSize,
        intensity: count,
      };
    });

    return {
      points: businesses.map((b) => ({
        latitude: b.latitude,
        longitude: b.longitude,
        name: b.businessName,
      })),
      heatmap: heatmapData,
    };
  }),

  // Get trend analysis
  getTrends: protectedProcedure
    .input(
      z.object({
        period: z.enum(["week", "month", "quarter", "year"]).default("month"),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const period = input?.period ?? "month";
      const now = new Date();
      const startDate = new Date();

      switch (period) {
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          startDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      const businesses = await ctx.db.business.findMany({
        where: {
          submittedAt: {
            gte: startDate,
          },
        },
        include: {
          barangay: true,
          category: true,
        },
        orderBy: { submittedAt: "asc" },
      });

      // Group by date
      const dailyData = new Map<string, any>();

      businesses.forEach((b) => {
        const dateKey = b.submittedAt.toISOString().split("T")[0]!;
        if (!dailyData.has(dateKey)) {
          dailyData.set(dateKey, {
            date: dateKey,
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            underReview: 0,
          });
        }

        const data = dailyData.get(dateKey)!;
        data.total++;
        if (b.status === "APPROVED") data.approved++;
        else if (b.status === "PENDING") data.pending++;
        else if (b.status === "REJECTED") data.rejected++;
        else if (b.status === "UNDER_REVIEW") data.underReview++;
      });

      // Category trends
      const categoryTrends = new Map<string, number>();
      businesses.forEach((b) => {
        categoryTrends.set(b.category.name, (categoryTrends.get(b.category.name) ?? 0) + 1);
      });

      // Barangay trends
      const barangayTrends = new Map<string, number>();
      businesses.forEach((b) => {
        barangayTrends.set(b.barangay.name, (barangayTrends.get(b.barangay.name) ?? 0) + 1);
      });

      return {
        timeline: Array.from(dailyData.values()),
        categories: Array.from(categoryTrends.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
        barangays: Array.from(barangayTrends.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
        summary: {
          totalApplications: businesses.length,
          averagePerDay: businesses.length / Math.max(1, dailyData.size),
          period,
        },
      };
    }),

  // Generate and save analytics report
  generateReport: protectedProcedure
    .input(
      z.object({
        type: z.enum(["CLUSTERING", "DENSITY", "COMPLIANCE", "TRENDS"]),
        title: z.string(),
        parameters: z.any().optional(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let reportData: any = {};

      switch (input.type) {
        case "CLUSTERING": {
          const clustering = await ctx.db.business.findMany({
            where: { status: "APPROVED" },
            include: { barangay: true, category: true },
          });
          reportData = { businessCount: clustering.length };
          break;
        }
        case "DENSITY": {
          const businesses = await ctx.db.business.findMany({
            where: { status: "APPROVED" },
            select: { latitude: true, longitude: true, barangay: true },
          });
          reportData = { totalPoints: businesses.length };
          break;
        }
        case "COMPLIANCE": {
          const stats = await ctx.db.business.groupBy({
            by: ["status"],
            _count: true,
          });
          reportData = { statusBreakdown: stats };
          break;
        }
        case "TRENDS": {
          const recentBusinesses = await ctx.db.business.findMany({
            where: {
              submittedAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          });
          reportData = { last30Days: recentBusinesses.length };
          break;
        }
      }

      return ctx.db.analyticsReport.create({
        data: {
          title: input.title,
          type: input.type,
          data: reportData,
          parameters: input.parameters || {},
          generatedBy: input.userId,
        },
      });
    }),

  // Get all reports
  getReports: protectedProcedure
    .input(
      z.object({
        type: z.enum(["CLUSTERING", "DENSITY", "COMPLIANCE", "TRENDS"]).optional(),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.analyticsReport.findMany({
        where: {
          type: input?.type,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }),

  // Get dashboard summary
  getDashboardSummary: protectedProcedure.query(async ({ ctx }) => {
    const [
      totalBusinesses,
      approvedBusinesses,
      pendingBusinesses,
      rejectedBusinesses,
      underReviewBusinesses,
      recentApplications,
      barangayStats,
      categoryStats,
    ] = await Promise.all([
      ctx.db.business.count(),
      ctx.db.business.count({ where: { status: "APPROVED" } }),
      ctx.db.business.count({ where: { status: "PENDING" } }),
      ctx.db.business.count({ where: { status: "REJECTED" } }),
      ctx.db.business.count({ where: { status: "UNDER_REVIEW" } }),
      ctx.db.business.findMany({
        take: 10,
        orderBy: { submittedAt: "desc" },
        include: {
          barangay: true,
          category: true,
        },
      }),
      ctx.db.barangay.findMany({
        include: {
          _count: {
            select: { businesses: true },
          },
        },
      }),
      ctx.db.businessCategory.findMany({
        include: {
          _count: {
            select: { businesses: true },
          },
        },
      }),
    ]);

    return {
      overview: {
        total: totalBusinesses,
        approved: approvedBusinesses,
        pending: pendingBusinesses,
        rejected: rejectedBusinesses,
        underReview: underReviewBusinesses,
        approvalRate: totalBusinesses > 0 ? (approvedBusinesses / totalBusinesses) * 100 : 0,
      },
      recentApplications: recentApplications.map((b) => ({
        id: b.id,
        applicationNo: b.applicationNo,
        businessName: b.businessName,
        status: b.status,
        barangay: b.barangay.name,
        category: b.category.name,
        submittedAt: b.submittedAt,
      })),
      barangayDistribution: barangayStats
        .map((b) => ({
          name: b.name,
          count: b._count.businesses,
        }))
        .sort((a, b) => b.count - a.count),
      categoryDistribution: categoryStats
        .map((c) => ({
          name: c.name,
          count: c._count.businesses,
        }))
        .sort((a, b) => b.count - a.count),
    };
  }),
});
