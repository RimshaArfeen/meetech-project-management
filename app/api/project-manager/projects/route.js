
// // app/api/project-manager/projects/route.js
// import { NextResponse } from 'next/server';
// import { verifyAccessToken } from '../../../../lib/auth/jwt';
// import prisma from '../../../../lib/prisma';
// import { z } from 'zod';

// const projectSchema = z.object({
//      name: z.string().min(3, 'Project name must be at least 3 characters'),
//      description: z.string().optional(),
//      scope: z.string().optional(),
//      deadline: z.string().optional(),
//      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
//      teamLeadId: z.string().optional(),
//      clientName: z.string().min(2, 'Client name is required'),
//      clientEmail: z.string().email('Valid client email is required'),
//      clientCompany: z.string().optional(),
//      clientPhone: z.string().optional(),
//      startDate: z.string().optional(),
//      budget: z.number().optional()
// });

// export async function POST(request) {
//      try {
//           const token = request.cookies.get('accessToken')?.value;

//           if (!token) {
//                return NextResponse.json(
//                     { error: 'Not authenticated' },
//                     { status: 401 }
//                );
//           }

//           const decoded = verifyAccessToken(token);
//           if (!decoded || decoded.role !== 'PROJECT_MANAGER') {
//                return NextResponse.json(
//                     { error: 'Access denied' },
//                     { status: 403 }
//                );
//           }

//           const body = await request.json();

//           // Validate input
//           const validation = projectSchema.safeParse(body);
//           if (!validation.success) {
//                return NextResponse.json(
//                     { error: 'Invalid input', details: validation.error.errors },
//                     { status: 400 }
//                );
//           }

//           const data = validation.data;

//           // Create project
//           const project = await prisma.project.create({
//                data: {
//                     name: data.name,
//                     description: data.description || data.scope,
//                     status: 'UPCOMING',
//                     priority: data.priority,
//                     startDate: data.startDate ? new Date(data.startDate) : new Date(),
//                     deadline: data.deadline ? new Date(data.deadline) : null,
//                     budget: data.budget,
//                     clientName: data.clientName,
//                     clientEmail: data.clientEmail,
//                     clientCompany: data.clientCompany,
//                     clientPhone: data.clientPhone,
//                     managerId: decoded.id,
//                     teamLeadId: data.teamLeadId,
//                     createdById: decoded.id,
//                     progress: 0
//                },
//                include: {
//                     manager: {
//                          select: {
//                               id: true,
//                               name: true,
//                               email: true
//                          }
//                     },
//                     teamLead: {
//                          select: {
//                               id: true,
//                               name: true,
//                               email: true
//                          }
//                     }
//                }
//           });

//           // Create activity log
//           await prisma.activityLog.create({
//                data: {
//                     action: 'CREATE_PROJECT',
//                     entityType: 'project',
//                     entityId: project.id,
//                     details: {
//                          projectName: project.name,
//                          clientName: project.clientName
//                     },
//                     userId: decoded.id
//                }
//           });

//           // Notify team lead if assigned
//           if (data.teamLeadId) {
//                await prisma.notification.create({
//                     data: {
//                          type: 'PROJECT_UPDATE',
//                          title: 'New Project Assigned',
//                          message: `You have been assigned as Team Lead for project: ${project.name}`,
//                          link: `/team-lead/projects/${project.id}`,
//                          userId: data.teamLeadId,
//                          metadata: {
//                               projectId: project.id,
//                               projectName: project.name,
//                               assignedBy: decoded.name
//                          }
//                     }
//                });
//           }

//           return NextResponse.json({
//                success: true,
//                message: 'Project created successfully',
//                project
//           });

//      } catch (error) {
//           console.error('Create project error:', error);
//           return NextResponse.json(
//                { error: 'Failed to create project' },
//                { status: 500 }
//           );
//      }
// }

// app/api/project-manager/projects/[projectId]/route.js
import { NextResponse } from 'next/server';
import { verifyAccessToken } from '../../../../../lib/auth/jwt';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
     try {
          const { projectId } = await params;
          const token = request.cookies.get('accessToken')?.value;

          if (!token) {
               return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
          }

          const decoded = verifyAccessToken(token);
          if (!decoded || decoded.role !== 'PROJECT_MANAGER') {
               return NextResponse.json({ error: 'Access denied' }, { status: 403 });
          }

          // Fetch project with all related data
          const project = await prisma.project.findFirst({
               where: {
                    id: projectId,
                    managerId: decoded.id
               },
               include: {
                    manager: {
                         select: {
                              id: true,
                              name: true,
                              email: true
                         }
                    },
                    teamLead: {
                         select: {
                              id: true,
                              name: true,
                              email: true,
                              avatar: true
                         }
                    },
                    milestones: {
                         include: {
                              tasks: {
                                   select: {
                                        id: true,
                                        status: true,
                                        assigneeId: true
                                   }
                              }
                         },
                         orderBy: { deadline: 'asc' }
                    },
                    tasks: {
                         include: {
                              assignee: {
                                   select: {
                                        id: true,
                                        name: true,
                                        avatar: true
                                   }
                              },
                              milestone: {
                                   select: {
                                        id: true,
                                        name: true
                                   }
                              }
                         },
                         orderBy: { createdAt: 'desc' }
                    },
                    documents: {
                         include: {
                              uploadedBy: {
                                   select: {
                                        name: true,
                                        avatar: true
                                   }
                              }
                         },
                         orderBy: { uploadedAt: 'desc' }
                    },
                    feedbacks: {
                         include: {
                              createdBy: {
                                   select: {
                                        name: true,
                                        role: true
                                   }
                              }
                         },
                         orderBy: { createdAt: 'desc' }
                    },
                    _count: {
                         select: {
                              tasks: true,
                              milestones: true,
                              documents: true,
                              feedbacks: true
                         }
                    }
               }
          });

          if (!project) {
               return NextResponse.json({ error: 'Project not found' }, { status: 404 });
          }

          // Calculate progress based on tasks
          const totalTasks = project.tasks.length;
          const completedTasks = project.tasks.filter(t => t.status === 'COMPLETED').length;
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : project.progress || 0;

          // Calculate milestone progress
          const milestonesWithProgress = project.milestones.map(m => {
               const milestoneTasks = m.tasks || [];
               const completedMilestoneTasks = milestoneTasks.filter(t => t.status === 'COMPLETED').length;
               const milestoneProgress = milestoneTasks.length > 0
                    ? Math.round((completedMilestoneTasks / milestoneTasks.length) * 100)
                    : 0;

               return {
                    ...m,
                    progress: milestoneProgress,
                    tasksCount: milestoneTasks.length,
                    completedTasks: completedMilestoneTasks
               };
          });

          const projectWithStats = {
               ...project,
               progress,
               milestones: milestonesWithProgress,
               stats: {
                    totalTasks,
                    completedTasks,
                    pendingTasks: totalTasks - completedTasks,
                    overdueTasks: project.tasks.filter(t =>
                         t.status !== 'COMPLETED' && t.deadline && new Date(t.deadline) < new Date()
                    ).length,
                    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
               }
          };

          return NextResponse.json({ project: projectWithStats });

     } catch (error) {
          console.error('Project Details API Error:', error);
          return NextResponse.json(
               { error: error.message },
               { status: 500 }
          );
     }
}

// Update project
export async function PATCH(request, { params }) {
     try {
          const { projectId } = await params;
          const token = request.cookies.get('accessToken')?.value;
          const body = await request.json();

          if (!token) {
               return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
          }

          const decoded = verifyAccessToken(token);
          if (!decoded || decoded.role !== 'PROJECT_MANAGER') {
               return NextResponse.json({ error: 'Access denied' }, { status: 403 });
          }

          // Verify project access
          const existingProject = await prisma.project.findFirst({
               where: {
                    id: projectId,
                    managerId: decoded.id
               }
          });

          if (!existingProject) {
               return NextResponse.json({ error: 'Project not found' }, { status: 404 });
          }

          // Update project
          const updatedProject = await prisma.project.update({
               where: { id: projectId },
               data: {
                    name: body.name,
                    description: body.description,
                    status: body.status,
                    priority: body.priority,
                    deadline: body.deadline ? new Date(body.deadline) : null,
                    budget: body.budget,
                    riskLevel: body.riskLevel,
                    clientName: body.clientName,
                    clientEmail: body.clientEmail,
                    clientCompany: body.clientCompany,
                    clientPhone: body.clientPhone
               },
               include: {
                    manager: { select: { id: true, name: true } },
                    teamLead: { select: { id: true, name: true } }
               }
          });

          // Log activity
          await prisma.activityLog.create({
               data: {
                    action: 'UPDATE_PROJECT',
                    entityType: 'project',
                    entityId: projectId,
                    details: { changes: body },
                    userId: decoded.id
               }
          });

          return NextResponse.json({ project: updatedProject });

     } catch (error) {
          console.error('Update Project API Error:', error);
          return NextResponse.json(
               { error: error.message },
               { status: 500 }
          );
     }
}

// Delete project
export async function DELETE(request, { params }) {
     try {
          const { projectId } = await params;
          const token = request.cookies.get('accessToken')?.value;

          if (!token) {
               return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
          }

          const decoded = verifyAccessToken(token);
          if (!decoded || decoded.role !== 'PROJECT_MANAGER') {
               return NextResponse.json({ error: 'Access denied' }, { status: 403 });
          }

          // Verify project access
          const project = await prisma.project.findFirst({
               where: {
                    id: projectId,
                    managerId: decoded.id
               }
          });

          if (!project) {
               return NextResponse.json({ error: 'Project not found' }, { status: 404 });
          }

          // Soft delete or archive? Let's archive it
          const archivedProject = await prisma.project.update({
               where: { id: projectId },
               data: { status: 'ARCHIVED' }
          });

          // Log activity
          await prisma.activityLog.create({
               data: {
                    action: 'ARCHIVE_PROJECT',
                    entityType: 'project',
                    entityId: projectId,
                    details: { projectName: project.name },
                    userId: decoded.id
               }
          });

          return NextResponse.json({
               success: true,
               message: 'Project archived successfully'
          });

     } catch (error) {
          console.error('Delete Project API Error:', error);
          return NextResponse.json(
               { error: error.message },
               { status: 500 }
          );
     }
}