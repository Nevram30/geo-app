import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const zoningApplicationRouter = createTRPCRouter({
  // Get all zoning applications with filters
  getAll: publicProcedure
    .input(
      z
        .object({
          status: z.enum(["SUBMITTED", "REVIEWING", "REJECTED", "APPROVED", "FOR_EVALUATION"]).optional(),
          userId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.zoningApplication.findMany({
        where: {
          status: input?.status,
          userId: input?.userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviewedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
      });
    }),

  // Get applications for the current user (applicant)
  getMyApplications: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.zoningApplication.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        reviewedByUser: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });
  }),

  // Get single application by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.zoningApplication.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviewedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),

  // Update application status (for reviewers)
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["SUBMITTED", "REVIEWING", "REJECTED", "APPROVED", "FOR_EVALUATION"]),
        remarks: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: {
        status: "SUBMITTED" | "REVIEWING" | "REJECTED" | "APPROVED" | "FOR_EVALUATION";
        remarks?: string;
        reviewedAt: Date;
        reviewedBy: string;
        approvedAt?: Date;
        rejectedAt?: Date;
      } = {
        status: input.status,
        remarks: input.remarks,
        reviewedAt: new Date(),
        reviewedBy: ctx.session.user.id,
      };

      if (input.status === "APPROVED") {
        updateData.approvedAt = new Date();
      }

      if (input.status === "REJECTED") {
        updateData.rejectedAt = new Date();
      }

      return ctx.db.zoningApplication.update({
        where: { id: input.id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviewedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),

  // Get application statistics
  getStats: publicProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.zoningApplication.count();
    const submitted = await ctx.db.zoningApplication.count({ where: { status: "SUBMITTED" } });
    const reviewing = await ctx.db.zoningApplication.count({ where: { status: "REVIEWING" } });
    const approved = await ctx.db.zoningApplication.count({ where: { status: "APPROVED" } });
    const rejected = await ctx.db.zoningApplication.count({ where: { status: "REJECTED" } });
    const forEvaluation = await ctx.db.zoningApplication.count({ where: { status: "FOR_EVALUATION" } });

    return {
      total,
      submitted,
      reviewing,
      approved,
      rejected,
      forEvaluation,
    };
  }),

  // Get stats for a specific reviewer
  getReviewerStats: protectedProcedure.query(async ({ ctx }) => {
    const assignedToMe = await ctx.db.zoningApplication.count({
      where: { reviewedBy: ctx.session.user.id },
    });
    const pendingReview = await ctx.db.zoningApplication.count({
      where: { status: "SUBMITTED" },
    });
    const approvedByMe = await ctx.db.zoningApplication.count({
      where: {
        reviewedBy: ctx.session.user.id,
        status: "APPROVED",
      },
    });
    const rejectedByMe = await ctx.db.zoningApplication.count({
      where: {
        reviewedBy: ctx.session.user.id,
        status: "REJECTED",
      },
    });

    return {
      assignedToMe,
      pendingReview,
      approvedByMe,
      rejectedByMe,
    };
  }),

  // Delete application
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.zoningApplication.delete({
        where: { id: input.id },
      });
    }),
});
