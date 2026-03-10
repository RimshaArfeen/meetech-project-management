
// app/api/team-lead/dashboard/route.js
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
          if (!decoded || decoded.role !== 'TEAM_LEAD') {
               return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
               );
          }

          const now = new Date();
          const startOfDay = new Date(now.setHours(0, 0, 0, 0));
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          startOfWeek.setHours(0, 0, 0, 0);

          // Get projects where user is team lead
          const projects = await prisma.project.findMany({
               where: {
                    teamLeadId: decoded.id
               },
               include: {
                    manager: {
                         select: {
                              id: true,
                              name: true,
                              email: true
                         }
                    },
                    _count: {
                         select: {
                              tasks: true,
                              milestones: true
                         }
                    },
                    tasks: {
                         where: {
                              status: 'REVIEW'
                         },
                         select: {
                              id: true
                         }
                    }
               }
          });

          // Get all tasks from team lead's projects
          const tasks = await prisma.task.findMany({
               where: {
                    project: {
                         teamLeadId: decoded.id
                    }
               },
               include: {
                    project: {
                         select: {
                              id: true,
                              name: true
                         }
                    },
                    milestone: {
                         select: {
                              id: true,
                              name: true
                         }
                    },
                    assignee: {
                         select: {
                              id: true,
                              name: true,
                              email: true,
                              avatar: true
                         }
                    },
                    _count: {
                         select: {
                              comments: true,
                              attachments: true
                         }
                    }
               },
               orderBy: [
                    { status: 'asc' },
                    { priority: 'desc' },
                    { deadline: 'asc' }
               ]
          });

          // Calculate statistics
          const stats = {
               totalTasks: tasks.length,
               inReview: tasks.filter(t => t.status === 'REVIEW').length,
               overdue: tasks.filter(t =>
                    t.deadline && new Date(t.deadline) < now && t.status !== 'COMPLETED'
               ).length,
               completed: tasks.filter(t => t.status === 'COMPLETED').length,
               notStarted: tasks.filter(t => t.status === 'NOT_STARTED').length,
               inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
               blocked: tasks.filter(t => t.status === 'BLOCKED').length
          };

          // Get developers (users with role DEVELOPER)
          const developers = await prisma.user.findMany({
               where: {
                    role: 'DEVELOPER',
                    status: 'ACTIVE'
               },
               select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    jobTitle: true,
                    _count: {
                         select: {
                              assignedTasks: {
                                   where: {
                                        status: {
                                             not: 'COMPLETED'
                                        }
                                   }
                              }
                         }
                    }
               },
               orderBy: {
                    name: 'asc'
               }
          });

          // Get recent activities
          const recentActivities = await prisma.activityLog.findMany({
               where: {
                    OR: [
                         { entityType: 'task' },
                         { entityType: 'milestone' }
                    ],
                    userId: decoded.id
               },
               include: {
                    user: {
                         select: {
                              name: true,
                              avatar: true
                         }
                    }
               },
               orderBy: {
                    createdAt: 'desc'
               },
               take: 10
          });

          return NextResponse.json({
               projects,
               tasks,
               stats,
               developers,
               recentActivities
          });

     } catch (error) {
          console.error('Team lead dashboard error:', error);
          return NextResponse.json(
               { error: 'Failed to fetch dashboard data' },
               { status: 500 }
          );
     }
}