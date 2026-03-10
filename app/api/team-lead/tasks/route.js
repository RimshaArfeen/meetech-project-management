
// app/api/team-lead/tasks/route.js
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

          // Parse query parameters
          const { searchParams } = new URL(request.url);
          const status = searchParams.get('status');
          const projectId = searchParams.get('projectId');
          const assigneeId = searchParams.get('assigneeId');
          const search = searchParams.get('search');
          const sortBy = searchParams.get('sortBy') || 'deadline';
          const sortOrder = searchParams.get('sortOrder') || 'asc';

          // Build filter
          let whereClause = {
               project: {
                    teamLeadId: decoded.id
               }
          };

          if (status && status !== 'all') {
               whereClause.status = status;
          }

          if (projectId) {
               whereClause.projectId = projectId;
          }

          if (assigneeId) {
               whereClause.assigneeId = assigneeId;
          }

          if (search) {
               whereClause.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { project: { name: { contains: search, mode: 'insensitive' } } }
               ];
          }

          // Build sort
          let orderBy = {};
          switch (sortBy) {
               case 'deadline':
                    orderBy.deadline = sortOrder;
                    break;
               case 'priority':
                    orderBy.priority = sortOrder;
                    break;
               case 'status':
                    orderBy.status = sortOrder;
                    break;
               case 'createdAt':
                    orderBy.createdAt = sortOrder;
                    break;
               default:
                    orderBy.deadline = 'asc';
          }

          const tasks = await prisma.task.findMany({
               where: whereClause,
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
                              avatar: true,
                              jobTitle: true
                         }
                    },
                    _count: {
                         select: {
                              comments: true,
                              attachments: true
                         }
                    }
               },
               orderBy
          });

          // Calculate additional metrics
          const now = new Date();
          const tasksWithMeta = tasks.map(task => ({
               ...task,
               isOverdue: task.deadline && new Date(task.deadline) < now && task.status !== 'COMPLETED',
               daysUntilDeadline: task.deadline
                    ? Math.ceil((new Date(task.deadline) - now) / (1000 * 60 * 60 * 24))
                    : null
          }));

          // Get filter options
          const projects = await prisma.project.findMany({
               where: { teamLeadId: decoded.id },
               select: { id: true, name: true }
          });

          const developers = await prisma.user.findMany({
               where: {
                    role: 'DEVELOPER',
                    assignedTasks: {
                         some: {
                              project: {
                                   teamLeadId: decoded.id
                              }
                         }
                    }
               },
               select: { id: true, name: true }
          });

          return NextResponse.json({
               tasks: tasksWithMeta,
               filters: {
                    projects,
                    developers
               }
          });

     } catch (error) {
          console.error('Team lead tasks error:', error);
          return NextResponse.json(
               { error: 'Failed to fetch tasks' },
               { status: 500 }
          );
     }
}

export async function POST(request) {
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

          const body = await request.json();
          const {
               title,
               description,
               milestoneId,
               assigneeId,
               deadline,
               estimatedHours,
               priority
          } = body;

          // Validate required fields
          if (!title || !milestoneId || !assigneeId) {
               return NextResponse.json(
                    { error: 'Missing required fields' },
                    { status: 400 }
               );
          }

          // Verify milestone belongs to team lead's project
          const milestone = await prisma.milestone.findUnique({
               where: { id: milestoneId },
               include: {
                    project: {
                         select: { teamLeadId: true, id: true }
                    }
               }
          });

          if (!milestone || milestone.project.teamLeadId !== decoded.id) {
               return NextResponse.json(
                    { error: 'Access denied to this milestone' },
                    { status: 403 }
               );
          }

          // Create task
          const task = await prisma.task.create({
               data: {
                    title,
                    description,
                    status: 'NOT_STARTED',
                    priority: priority || 'MEDIUM',
                    deadline: deadline ? new Date(deadline) : null,
                    estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
                    projectId: milestone.projectId,
                    milestoneId,
                    assigneeId,
                    createdById: decoded.id
               },
               include: {
                    assignee: {
                         select: {
                              id: true,
                              name: true,
                              email: true
                         }
                    },
                    milestone: {
                         select: {
                              id: true,
                              name: true
                         }
                    },
                    project: {
                         select: {
                              id: true,
                              name: true
                         }
                    }
               }
          });

          // Create notification for developer
          await prisma.notification.create({
               data: {
                    type: 'TASK_ASSIGNED',
                    title: 'New Task Assigned',
                    message: `You have been assigned a new task: ${title}`,
                    link: `/developer/tasks/${task.id}`,
                    userId: assigneeId,
                    metadata: {
                         taskId: task.id,
                         taskTitle: title,
                         projectName: milestone.project.name,
                         assignedBy: decoded.name
                    }
               }
          });

          // Log activity
          await prisma.activityLog.create({
               data: {
                    action: 'CREATE_TASK',
                    entityType: 'task',
                    entityId: task.id,
                    details: {
                         title,
                         milestone: milestone.name,
                         assignee: task.assignee.name
                    },
                    userId: decoded.id
               }
          });

          return NextResponse.json({
               success: true,
               task,
               message: 'Task created successfully'
          });

     } catch (error) {
          console.error('Create task error:', error);
          return NextResponse.json(
               { error: 'Failed to create task' },
               { status: 500 }
          );
     }
}