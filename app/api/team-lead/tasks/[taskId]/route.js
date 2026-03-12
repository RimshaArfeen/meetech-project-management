
// app/api/team-lead/tasks/[taskId]/route.js
import { NextResponse } from 'next/server';
import { verifyAccessToken } from "../../../../../lib/auth/jwt";
import prisma from '../../../../../lib/prisma';


export async function GET(request, { params }) {
     try {
          const { taskId } = params;
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

          const task = await prisma.task.findUnique({
               where: { id: taskId },
               include: {
                    project: {
                         include: {
                              manager: {
                                   select: {
                                        id: true,
                                        name: true,
                                        email: true
                                   }
                              }
                         }
                    },
                    milestone: true,
                    assignee: {
                         select: {
                              id: true,
                              name: true,
                              email: true,
                              avatar: true,
                              jobTitle: true
                         }
                    },
                    createdBy: {
                         select: {
                              id: true,
                              name: true,
                              email: true
                         }
                    },
                    comments: {
                         orderBy: {
                              createdAt: 'desc'
                         },
                         include: {
                              author: {
                                   select: {
                                        id: true,
                                        name: true,
                                        role: true,
                                        avatar: true
                                   }
                              },
                              replies: {
                                   include: {
                                        author: {
                                             select: {
                                                  id: true,
                                                  name: true,
                                                  avatar: true
                                             }
                                        }
                                   }
                              }
                         }
                    },
                    attachments: {
                         orderBy: {
                              uploadedAt: 'desc'
                         }
                    }
               }
          });

          if (!task) {
               return NextResponse.json(
                    { error: 'Task not found' },
                    { status: 404 }
               );
          }

          // Verify access
          if (task.project.teamLeadId !== decoded.id) {
               return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
               );
          }

          // Calculate metrics
          const now = new Date();
          const taskWithMeta = {
               ...task,
               isOverdue: task.deadline && new Date(task.deadline) < now && task.status !== 'COMPLETED',
               daysUntilDeadline: task.deadline
                    ? Math.ceil((new Date(task.deadline) - now) / (1000 * 60 * 60 * 24))
                    : null,
               timeSpent: task.actualHours ? `${task.actualHours}h` : 'Not started',
               timeRemaining: task.estimatedHours && task.actualHours
                    ? `${Math.max(0, task.estimatedHours - task.actualHours)}h`
                    : task.estimatedHours ? `${task.estimatedHours}h` : 'N/A',
               progress: task.estimatedHours && task.actualHours
                    ? Math.min(100, Math.round((task.actualHours / task.estimatedHours) * 100))
                    : 0
          };

          return NextResponse.json({ task: taskWithMeta });

     } catch (error) {
          console.error('Task details error:', error);
          return NextResponse.json(
               { error: 'Failed to fetch task details' },
               { status: 500 }
          );
     }
}


export async function PATCH(request, { params }) {
     try {
          const { taskId } = params;
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
               status,
               priority,
               assigneeId,
               deadline,
               estimatedHours,
               actualHours,
               reviewApproved,
               reviewNotes
          } = body;

          // Verify task belongs to team lead's project
          const existingTask = await prisma.task.findUnique({
               where: { id: taskId },
               include: {
                    project: {
                         select: { teamLeadId: true, name: true }
                    },
                    assignee: {
                         select: { id: true, name: true }
                    }
               }
          });

          if (!existingTask || existingTask.project.teamLeadId !== decoded.id) {
               return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
               );
          }

          // Prepare update data
          const updateData = {
               title,
               description,
               priority,
               deadline: deadline ? new Date(deadline) : existingTask.deadline,
               estimatedHours: estimatedHours ? parseFloat(estimatedHours) : existingTask.estimatedHours,
               actualHours: actualHours ? parseFloat(actualHours) : existingTask.actualHours,
               updatedAt: new Date()
          };

          // Handle status changes
          if (status) {
               updateData.status = status;

               // If approving a completed task
               if (status === 'COMPLETED' && reviewApproved) {
                    updateData.completedAt = new Date();

                    // Create notification for developer
                    await prisma.notification.create({
                         data: {
                              type: 'TASK_COMPLETED',
                              title: 'Task Approved',
                              message: `Your task "${existingTask.title}" has been approved`,
                              link: `/developer/tasks/${taskId}`,
                              userId: existingTask.assigneeId,
                              metadata: {
                                   taskId,
                                   taskTitle: existingTask.title,
                                   approvedBy: decoded.name
                              }
                         }
                    });
               }
          }

          // Handle reassignment
          if (assigneeId && assigneeId !== existingTask.assigneeId) {
               updateData.assigneeId = assigneeId;

               // Notify new assignee
               await prisma.notification.create({
                    data: {
                         type: 'TASK_ASSIGNED',
                         title: 'Task Reassigned',
                         message: `Task "${existingTask.title}" has been reassigned to you`,
                         link: `/developer/tasks/${taskId}`,
                         userId: assigneeId,
                         metadata: {
                              taskId,
                              taskTitle: existingTask.title,
                              assignedBy: decoded.name
                         }
                    }
               });
          }

          // Update task
          const updatedTask = await prisma.task.update({
               where: { id: taskId },
               data: updateData,
               include: {
                    assignee: {
                         select: {
                              id: true,
                              name: true,
                              email: true
                         }
                    },
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
                    }
               }
          });

          // Log activity
          await prisma.activityLog.create({
               data: {
                    action: reviewApproved ? 'APPROVE_TASK' : 'UPDATE_TASK',
                    entityType: 'task',
                    entityId: taskId,
                    details: {
                         taskTitle: existingTask.title,
                         changes: Object.keys(body),
                         approved: reviewApproved
                    },
                    userId: decoded.id
               }
          });

          return NextResponse.json({
               success: true,
               task: updatedTask,
               message: reviewApproved ? 'Task approved successfully' : 'Task updated successfully'
          });

     } catch (error) {
          console.error('Update task error:', error);
          return NextResponse.json(
               { error: 'Failed to update task' },
               { status: 500 }
          );
     }
}

export async function DELETE(request, { params }) {
     try {
          const { taskId } = params;
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

          // Verify task belongs to team lead's project
          const task = await prisma.task.findUnique({
               where: { id: taskId },
               include: {
                    project: {
                         select: { teamLeadId: true }
                    }
               }
          });

          if (!task || task.project.teamLeadId !== decoded.id) {
               return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
               );
          }

          // Soft delete or actually delete? Let's do soft delete by archiving
          await prisma.task.update({
               where: { id: taskId },
               data: {
                    status: 'ARCHIVED'
               }
          });

          // Log activity
          await prisma.activityLog.create({
               data: {
                    action: 'DELETE_TASK',
                    entityType: 'task',
                    entityId: taskId,
                    details: {
                         taskId,
                         reason: 'Deleted by team lead'
                    },
                    userId: decoded.id
               }
          });

          return NextResponse.json({
               success: true,
               message: 'Task deleted successfully'
          });

     } catch (error) {
          console.error('Delete task error:', error);
          return NextResponse.json(
               { error: 'Failed to delete task' },
               { status: 500 }
          );
     }
}

