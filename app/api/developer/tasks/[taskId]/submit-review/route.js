

//app
import { NextResponse } from 'next/server';
import { verifyAccessToken } from '../../../../../../lib/auth/jwt';
import prisma from '../../../../../../lib/prisma';

export async function POST(request, { params }) {
     try {
          const { taskId } = params;
          const { notes } = await request.json();

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

          // Check if task exists and is assigned to this developer
          const task = await prisma.task.findUnique({
               where: { id: taskId },
               include: {
                    project: {
                         select: {
                              id: true,
                              teamLeadId: true,
                              managerId: true
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

          if (task.assigneeId !== decoded.id) {
               return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
               );
          }

          // Update task status to REVIEW
          const updatedTask = await prisma.task.update({
               where: { id: taskId },
               data: {
                    status: 'REVIEW',
                    reviewRequested: true,
                    reviewNotes: notes || null,
                    updatedAt: new Date()
               }
          });

          // Create notification for team lead
          if (task.project.teamLeadId) {
               await prisma.notification.create({
                    data: {
                         type: 'TASK_REVIEW',
                         title: 'Task Ready for Review',
                         message: `${task.title} is ready for your review${notes ? `: ${notes}` : ''}`,
                         link: `/team-lead/tasks/${taskId}`,
                         userId: task.project.teamLeadId,
                         metadata: {
                              taskId,
                              taskTitle: task.title,
                              developerId: decoded.id,
                              developerName: decoded.name,
                              notes
                         }
                    }
               });
          }

          // Create activity log
          await prisma.activityLog.create({
               data: {
                    action: 'SUBMIT_FOR_REVIEW',
                    entityType: 'task',
                    entityId: taskId,
                    details: {
                         taskTitle: task.title,
                         notes
                    },
                    userId: decoded.id
               }
          });

          return NextResponse.json({
               success: true,
               message: 'Task submitted for review successfully'
          });

     } catch (error) {
          console.error('Submit for review error:', error);
          return NextResponse.json(
               { error: 'Failed to submit task for review' },
               { status: 500 }
          );
     }
}