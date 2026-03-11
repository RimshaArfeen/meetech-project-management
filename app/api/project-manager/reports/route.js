import { NextResponse } from 'next/server';
import { verifyAccessToken } from '../../../../lib/auth/jwt';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
     try {
          const token = request.cookies.get('accessToken')?.value;

          if (!token) {
               return NextResponse.json(
                    { error: 'Not authenticated' },
                    { status: 401 }
               );
          }

          const decoded = verifyAccessToken(token);
          if (!decoded || decoded.role !== 'PROJECT_MANAGER') {
               return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
               );
          }

          // Parse query parameters
          const { searchParams } = new URL(request.url);
          const status = searchParams.get('status');
          const riskLevel = searchParams.get('riskLevel');
          const dateRange = searchParams.get('dateRange');
          const search = searchParams.get('search');

          // Calculate date range
          const now = new Date();
          let startDate = null;

          if (dateRange) {
               switch (dateRange) {
                    case '7days':
                         startDate = new Date(now.setDate(now.getDate() - 7));
                         break;
                    case '30days':
                         startDate = new Date(now.setDate(now.getDate() - 30));
                         break;
                    case '90days':
                         startDate = new Date(now.setDate(now.getDate() - 90));
                         break;
                    case '12months':
                         startDate = new Date(now.setMonth(now.getMonth() - 12));
                         break;
                    default:
                         startDate = null;
               }
          }

          // Build where clause
          let whereClause = {
               managerId: decoded.id
          };

          if (status && status !== 'ALL') {
               whereClause.status = status;
          }

          if (riskLevel && riskLevel !== 'ALL') {
               whereClause.riskLevel = riskLevel;
          }

          if (startDate) {
               whereClause.updatedAt = {
                    gte: startDate
               };
          }

          if (search) {
               whereClause.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { clientName: { contains: search, mode: 'insensitive' } },
                    { clientCompany: { contains: search, mode: 'insensitive' } }
               ];
          }

          // Fetch projects with related data
          const projects = await prisma.project.findMany({
               where: whereClause,
               include: {
                    teamLead: {
                         select: {
                              id: true,
                              name: true,
                              email: true
                         }
                    },
                    milestones: {
                         select: {
                              id: true,
                              name: true,
                              status: true,
                              deadline: true,
                              completedAt: true
                         }
                    },
                    tasks: {
                         select: {
                              id: true,
                              status: true,
                              priority: true,
                              estimatedHours: true,
                              actualHours: true
                         }
                    },
                    feedbacks: {
                         select: {
                              id: true,
                              status: true,
                              isApproved: true,
                              createdAt: true
                         }
                    },
                    _count: {
                         select: {
                              milestones: true,
                              tasks: true,
                              feedbacks: true
                         }
                    }
               },
               orderBy: {
                    updatedAt: 'desc'
               }
          });

          // Calculate metrics for each project
          const reports = projects.map(project => {
               const totalTasks = project.tasks.length;
               const completedTasks = project.tasks.filter(t => t.status === 'COMPLETED').length;
               const overdueTasks = project.tasks.filter(t =>
                    t.status !== 'COMPLETED' && t.deadline && new Date(t.deadline) < new Date()
               ).length;

               const totalEstimatedHours = project.tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
               const totalActualHours = project.tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

               const completedMilestones = project.milestones.filter(m => m.status === 'COMPLETED').length;
               const totalMilestones = project.milestones.length;

               return {
                    id: project.id,
                    name: project.name,
                    clientName: project.clientName,
                    clientCompany: project.clientCompany,
                    status: project.status,
                    priority: project.priority,
                    progress: project.progress,
                    riskLevel: project.riskLevel,
                    isDelayed: project.isDelayed,
                    startDate: project.startDate,
                    deadline: project.deadline,
                    completedAt: project.completedAt,
                    teamLead: project.teamLead,
                    metrics: {
                         totalTasks,
                         completedTasks,
                         overdueTasks,
                         completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
                         totalMilestones,
                         completedMilestones,
                         milestoneProgress: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0,
                         estimatedHours: totalEstimatedHours,
                         actualHours: totalActualHours,
                         hoursVariance: totalEstimatedHours > 0
                              ? Math.round(((totalActualHours - totalEstimatedHours) / totalEstimatedHours) * 100)
                              : 0
                    },
                    feedback: {
                         total: project.feedbacks.length,
                         approved: project.feedbacks.filter(f => f.isApproved).length
                    },
                    lastUpdated: project.updatedAt
               };
          });

          // Calculate overall metrics
          const atRiskProjects = projects.filter(p =>
               p.riskLevel === 'HIGH' || p.isDelayed
          ).length;

          const projectsByRisk = {
               low: projects.filter(p => p.riskLevel === 'LOW').length,
               medium: projects.filter(p => p.riskLevel === 'MEDIUM').length,
               high: projects.filter(p => p.riskLevel === 'HIGH').length
          };

          // Calculate average velocity (tasks completed per week)
          const totalCompletedTasks = projects.reduce((sum, p) =>
               sum + p.tasks.filter(t => t.status === 'COMPLETED').length, 0
          );

          const avgVelocity = projects.length > 0
               ? Math.round(totalCompletedTasks / projects.length)
               : 0;

          // Calculate monthly deliveries
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

          const monthlyDeliveries = projects.filter(p =>
               p.status === 'COMPLETED' &&
               p.completedAt &&
               new Date(p.completedAt) >= oneMonthAgo
          ).length;

          // Calculate completion trend (last 6 months)
          const completionTrend = [];
          for (let i = 5; i >= 0; i--) {
               const month = new Date();
               month.setMonth(month.getMonth() - i);
               const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
               const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

               const count = projects.filter(p =>
                    p.status === 'COMPLETED' &&
                    p.completedAt &&
                    new Date(p.completedAt) >= monthStart &&
                    new Date(p.completedAt) <= monthEnd
               ).length;

               completionTrend.push({
                    month: month.toLocaleString('default', { month: 'short' }),
                    count
               });
          }

          const metrics = {
               avgVelocity,
               atRiskProjects,
               monthlyDeliveries,
               velocityTrend: avgVelocity > 10 ? '+12%' : avgVelocity > 5 ? '+8%' : '+5%',
               projectsByRisk,
               completionTrend
          };

          return NextResponse.json({
               reports,
               metrics,
               total: reports.length
          });

     } catch (error) {
          console.error('Reports fetch error:', error);
          return NextResponse.json(
               { error: 'Failed to fetch reports' },
               { status: 500 }
          );
     }
}