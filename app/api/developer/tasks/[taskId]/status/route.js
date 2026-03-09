
// app/api/developer/tasks/[taskId]/status/route.js

import { NextResponse } from 'next/server';
import { verifyAccessToken } from '../../../../../../lib/auth/jwt';
import prisma from '../../../../../../lib/prisma';

export async function PATCH(request, { params }) {
     try {
          const { taskId } = params;
          const { status, reviewNotes } = await request.json();

          // Get token from cookies
          const token = request.cookies.get('accessToken')?.value;

          if (!token) {
               return NextResponse.json(
                    { error: 'Not authenticated' },
                    { status: 401 }
               );
          }

          // Verify token and get user
          const decoded = verifyAccessToken(token);
          if (!decoded) {
               return NextResponse.json(
                    { error: 'Invalid token' },
                    { status: 401 }
               );
          }

          // Check if task exists and user has access
          const existingTask = await prisma.task.findUnique({
               where: { id: taskId },
               include: {
                    project: {
                         select: {
                              id: true,
                              name: true,
                              teamLeadId: true,
                              managerId: true
                         }
                    }
               }
          });

          if (!existingTask) {
               return NextResponse.json(
                    { error: 'Task not found' },
                    { status: 404 }
               );
          }

          // Verify access (task assigned to this developer or user is lead/manager)
          const hasAccess = existingTask.assigneeId === decoded.id ||
               existingTask.project.teamLeadId === decoded.id ||
               existingTask.project.managerId === decoded.id ||
               decoded.role === 'CEO';

          if (!hasAccess) {
               return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
               );
          }

          // Prepare update data
          const updateData = {
               status,
               updatedAt: new Date()
          };

          // If marking as completed, set completedAt
          if (status === 'COMPLETED') {
               updateData.completedAt = new Date();
          }

          // If requesting review, set reviewRequested
          if (status === 'REVIEW') {
               updateData.reviewRequested = true;
               if (reviewNotes) {
                    updateData.reviewNotes = reviewNotes;
               }
          }

          // Update task
          const updatedTask = await prisma.task.update({
               where: { id: taskId },
               data: updateData,
               include: {
                    project: {
                         select: {
                              id: true,
                              name: true
                         }
                    },
                    assignee: {
                         select: {
                              id: true,
                              name: true
                         }
                    }
               }
          });

          // Create activity log
          await prisma.activityLog.create({
               data: {
                    action: 'UPDATE_TASK_STATUS',
                    entityType: 'task',
                    entityId: taskId,
                    details: {
                         oldStatus: existingTask.status,
                         newStatus: status,
                         taskTitle: existingTask.title
                    },
                    userId: decoded.id
               }
          });

          // Create notification for team lead if task is in review
          if (status === 'REVIEW' && existingTask.project.teamLeadId) {
               await prisma.notification.create({
                    data: {
                         type: 'TASK_REVIEW',
                         title: 'Task Ready for Review',
                         message: `${existingTask.title} is ready for your review`,
                         link: `/team-lead/tasks/${taskId}`,
                         userId: existingTask.project.teamLeadId,
                         metadata: {
                              taskId,
                              taskTitle: existingTask.title,
                              developerName: decoded.name
                         }
                    }
               });
          }

          return NextResponse.json({
               success: true,
               task: updatedTask,
               message: `Task status updated to ${status}`
          });

     } catch (error) {
          console.error('Task status update error:', error);
          return NextResponse.json(
               { error: 'Failed to update task status' },
               { status: 500 }
          );
     }
}