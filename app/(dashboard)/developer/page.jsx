

// app/(dashboard)/developer/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
     Briefcase,
     CheckCircle2,
     AlertCircle,
     ListTodo,
     MessageSquare,
     Upload,
     MoreVertical,
     ChevronRight,
     Clock,
     Flag,
     Send,
     Paperclip,
     CheckCircle,
     Circle,
     PlayCircle,
     LogOut,
     RefreshCw,
     Target,
     Calendar
} from 'lucide-react';
import { StatCard } from '../../Components/common/StatCard';
import { StatusBadge } from '../../Components/common/StatusBadge';
import { PriorityBadge } from '../../Components/common/PriorityBadge';
import { useDeveloperDashboard } from '../../../hooks/useDeveloperDashboard';
import { usePresence } from '../../../hooks/usePresence';
import Spinner from '../../Components/common/Spinner';
import FailedLoading from '../../Components/common/FailedLoading';


const MySwal = withReactContent(Swal);

const DeveloperDashboard = () => {
     const router = useRouter();
     usePresence();
     const {
          stats,
          projects,
          tasks,
          comments,
          weeklyGoal,
          session,
          loading,
          error,
          selectedTask,
          setSelectedTask,
          submitForReview,
          submitAllForReview,
          refetch
     } = useDeveloperDashboard();

     const [isSubmitting, setIsSubmitting] = useState(false);
     const [isLoggingOut, setIsLoggingOut] = useState(false);
     const [newComment, setNewComment] = useState('');
     const [taskComments, setTaskComments] = useState({});

     // Group tasks by status for easier access
     const getTasksByStatus = (status) => {
          return tasks.filter(task => task.status === status);
     };

     // Handle logout
     const handleLogout = async () => {
          const result = await MySwal.fire({
               title: <p className="text-red-700 font-bold">Are you sure?</p>,
               text: "You will need to login again to access the Developer Dashboard.",
               icon: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#b91c1c',
               cancelButtonColor: '#6b7280',
               confirmButtonText: 'Yes, logout',
               background: '#ffffff',
               customClass: {
                    popup: 'rounded-2xl border border-border-default shadow-xl',
                    confirmButton: 'rounded-xl px-4 py-2 font-medium',
                    cancelButton: 'rounded-xl px-4 py-2 font-medium'
               }
          });

          if (result.isConfirmed) {
               try {
                    setIsLoggingOut(true);
                    const response = await fetch('/api/auth/logout', { method: 'POST' });

                    if (response.ok) {
                         router.push('/login');
                    }
               } catch (error) {
                    MySwal.fire('Error', 'Logout failed. Please try again.', 'error');
               } finally {
                    setIsLoggingOut(false);
               }
          }
     };

     // Handle submit for review
     const handleSubmitForReview = async (taskId) => {
          const { value: notes } = await MySwal.fire({
               title: 'Submit for Review',
               input: 'textarea',
               inputLabel: 'Review Notes (Optional)',
               inputPlaceholder: 'Add any notes for the reviewer...',
               showCancelButton: true,
               confirmButtonColor: '#2563eb',
               cancelButtonColor: '#6b7280',
               confirmButtonText: 'Submit',
               background: '#ffffff',
               customClass: {
                    popup: 'rounded-2xl border border-border-default shadow-xl',
                    confirmButton: 'rounded-xl px-4 py-2 font-medium',
                    cancelButton: 'rounded-xl px-4 py-2 font-medium'
               }
          });

          if (notes !== undefined) {
               setIsSubmitting(true);
               const result = await submitForReview(taskId, notes);
               setIsSubmitting(false);

               if (result.success) {
                    MySwal.fire({
                         title: 'Success!',
                         text: result.message,
                         icon: 'success',
                         confirmButtonColor: '#2563eb',
                         timer: 2000
                    });
               } else {
                    MySwal.fire({
                         title: 'Error',
                         text: result.error,
                         icon: 'error',
                         confirmButtonColor: '#b91c1c'
                    });
               }
          }
     };

     // Handle submit all for review
     const handleSubmitAllForReview = async () => {
          const completedTasks = tasks.filter(t => t.status === 'Completed').length;

          if (completedTasks === 0) {
               MySwal.fire({
                    title: 'No Tasks',
                    text: 'You have no completed tasks to submit for review.',
                    icon: 'info',
                    confirmButtonColor: '#2563eb'
               });
               return;
          }

          const result = await MySwal.fire({
               title: 'Submit All?',
               text: `You have ${completedTasks} completed task(s). Submit all for review?`,
               icon: 'question',
               showCancelButton: true,
               confirmButtonColor: '#2563eb',
               cancelButtonColor: '#6b7280',
               confirmButtonText: 'Yes, submit all'
          });

          if (result.isConfirmed) {
               setIsSubmitting(true);
               const submitResult = await submitAllForReview();
               setIsSubmitting(false);

               if (submitResult.success) {
                    MySwal.fire({
                         title: 'Success!',
                         text: submitResult.message,
                         icon: 'success',
                         confirmButtonColor: '#2563eb',
                         timer: 2000
                    });
               } else {
                    MySwal.fire({
                         title: 'Error',
                         text: submitResult.error,
                         icon: 'error',
                         confirmButtonColor: '#b91c1c'
                    });
               }
          }
     };

     // Handle comment submission
     const handleAddComment = async (taskId) => {
          if (!newComment.trim()) return;

          try {
               const response = await fetch(`/api/developer/tasks/${taskId}/comments`, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: newComment }),
               });

               if (response.ok) {
                    setNewComment('');
                    setTaskComments(prev => ({ ...prev, [taskId]: '' }));
                    refetch(); // Refresh dashboard data
               }
          } catch (error) {
               console.error('Failed to add comment:', error);
          }
     };

     if (loading) {
          return (
               <Spinner title="Your Dashboard" />
          );
     }

     if (error) {
          return (
               <FailedLoading refetch={refetch} error={error} />
          );
     }

     return (
          <div className="flex flex-col h-screen bg-bg-page">
               {/* Header */}
               <header className="h-16 border-b border-border-default bg-bg-surface flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                         <h1 className="text-xl font-bold text-text-primary">Developer Workspace</h1>
                         <div className="h-6 w-px bg-border-default"></div>
                         <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active Session: {session.activeDuration}
                         </div>
                         <button
                              onClick={() => refetch()}
                              className="p-1.5 text-text-muted hover:text-accent rounded-lg hover:bg-bg-subtle transition-colors"
                              title="Refresh"
                         >
                              <RefreshCw size={16} />
                         </button>
                    </div>

                    <div className="flex items-center gap-4">
                         <button
                              onClick={handleSubmitAllForReview}
                              disabled={isSubmitting}
                              className="bg-accent hover:bg-accent-hover text-text-inverse px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-50"
                         >
                              <CheckCircle2 size={18} />
                              <span>{isSubmitting ? 'Submitting...' : 'Submit All for Review'}</span>
                         </button>
                         <button
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className={`flex items-center gap-2 px-4 py-2 bg-red-700 text-text-inverse rounded-xl font-medium hover:bg-red-800 transition-all shadow-sm ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                                   }`}
                         >
                              <LogOut size={18} />
                              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                         </button>
                    </div>
               </header>

               {/* Dashboard Content */}
               <div className="flex-1 overflow-y-auto chat-scroll  p-6 space-y-8">
                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                         <StatCard
                              title="Total Tasks"
                              value={stats.total}
                              icon={<ListTodo size={20} />}
                              color="blue"
                         />
                         <StatCard
                              title="In Progress"
                              value={stats.inProgress}
                              icon={<PlayCircle size={20} />}
                              color="yellow"
                         />
                         <StatCard
                              title="Review"
                              value={stats.review}
                              icon={<Clock size={20} />}
                              color="purple"
                         />
                         <StatCard
                              title="Completed"
                              value={stats.completed}
                              icon={<CheckCircle size={20} />}
                              color="green"
                         />
                    </div>

                    {/* Projects & Weekly Goal */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {projects.map(proj => (
                                   <div
                                        key={proj.id}
                                        onClick={() => router.push(`/developer/projects/${proj.id}`)}
                                        className="bg-bg-surface border border-border-default p-5 rounded-xl shadow-sm hover:border-accent hover:shadow-md transition-all cursor-pointer group"
                                   >
                                        <div className="flex justify-between items-start mb-4">
                                             <div>
                                                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight group-hover:text-accent transition-colors">
                                                       {proj.name}
                                                  </h3>
                                                  <p className="text-[10px] text-accent font-bold mt-1 bg-accent-muted px-2 py-0.5 rounded inline-block">
                                                       {proj.role}
                                                  </p>
                                             </div>
                                             <span className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                                                  <Calendar size={12} />
                                                  {proj.deadline}
                                             </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                             <span className="text-xs text-text-muted">
                                                  {proj.tasksLeft} task{proj.tasksLeft !== 1 ? 's' : ''} remaining
                                             </span>
                                             <ChevronRight size={16} className="text-border-strong group-hover:text-accent transition-transform group-hover:translate-x-1" />
                                        </div>
                                   </div>
                              ))}
                         </div>

                         {/* Weekly Goal Progress */}
                         <div className="bg-gradient-to-br from-accent to-accent-active p-5 rounded-xl text-text-inverse shadow-lg">
                              <div className="flex items-start justify-between mb-4">
                                   <div>
                                        <p className="text-xs font-bold uppercase opacity-80 mb-1 flex items-center gap-1">
                                             <Target size={14} /> Weekly Goal
                                        </p>
                                        <p className="text-2xl font-bold">{weeklyGoal.completed} / {weeklyGoal.target}</p>
                                        <p className="text-xs opacity-80 mt-1">Tasks completed this week</p>
                                   </div>
                                   <div className="relative w-16 h-16">
                                        <svg className="w-full h-full transform -rotate-90">
                                             <circle
                                                  cx="32"
                                                  cy="32"
                                                  r="28"
                                                  stroke="rgba(255,255,255,0.2)"
                                                  strokeWidth="6"
                                                  fill="transparent"
                                             />
                                             <circle
                                                  cx="32"
                                                  cy="32"
                                                  r="28"
                                                  stroke="white"
                                                  strokeWidth="6"
                                                  fill="transparent"
                                                  strokeDasharray={176}
                                                  strokeDashoffset={176 - (176 * weeklyGoal.percentage) / 100}
                                                  className="transition-all duration-500"
                                             />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                                             {weeklyGoal.percentage}%
                                        </span>
                                   </div>
                              </div>
                              <div className="mt-4 pt-4 border-t border-white/10">
                                   <button
                                        onClick={() => router.push('/developer/tasks')}
                                        className="w-full text-xs font-bold hover:underline flex items-center justify-center gap-1"
                                   >
                                        View All Tasks <ChevronRight size={12} />
                                   </button>
                              </div>
                         </div>
                    </section>

                    {/* Main Workspace: Tasks & Context */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                         {/* Task List */}
                         <div className="xl:col-span-2 space-y-6">
                              <div className="flex items-center justify-between">
                                   <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                        My Active Tasks
                                        <span className="text-xs font-normal px-2 py-0.5 bg-accent-muted text-accent rounded-full">
                                             {tasks.filter(t => t.status !== 'Completed').length}
                                        </span>
                                   </h2>
                                   <div className="flex gap-2">
                                        <select className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border-default bg-bg-surface focus:outline-none focus:ring-1 focus:ring-accent">
                                             <option>Sort by Deadline</option>
                                             <option>Sort by Priority</option>
                                             <option>Sort by Status</option>
                                        </select>
                                   </div>
                              </div>

                              <div className="space-y-3">
                                   {tasks
                                        .filter(t => t.status !== 'Completed')
                                        .map((task) => (
                                             <TaskItem
                                                  key={task.id}
                                                  task={task}
                                                  isSelected={selectedTask?.id === task.id}
                                                  onSelect={() => setSelectedTask(task)}
                                                  onSubmitReview={handleSubmitForReview}
                                             />
                                        ))}
                              </div>
                         </div>

                         {/* Task Detail Sidebar */}
                         <TaskDetails
                              selectedTask={selectedTask}
                              comments={comments}
                              newComment={newComment}
                              setNewComment={setNewComment}
                              onAddComment={handleAddComment}
                              onSubmitReview={handleSubmitForReview}
                         />
                    </div>
               </div>
          </div>
     );
};

// Task Item Component
const TaskItem = ({ task, isSelected, onSelect, onSubmitReview }) => {
     const getPriorityColor = (priority) => {
          const colors = {
               'URGENT': 'text-red-600 bg-red-50',
               'HIGH': 'text-orange-600 bg-orange-50',
               'MEDIUM': 'text-yellow-600 bg-yellow-50',
               'LOW': 'text-green-600 bg-green-50'
          };
          return colors[priority] || 'text-gray-600 bg-gray-50';
     };

     return (
          <div
               onClick={onSelect}
               className={`bg-bg-surface border p-4 rounded-xl transition-all cursor-pointer group ${isSelected
                    ? 'border-accent ring-1 ring-accent/20'
                    : 'border-border-default hover:border-accent/50 hover:shadow-md'
                    }`}
          >
               <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                         <button
                              onClick={(e) => {
                                   e.stopPropagation();
                                   if (task.status !== 'Completed') {
                                        onSubmitReview(task.id);
                                   }
                              }}
                              className={`transition-colors ${task.status === 'Completed'
                                   ? 'text-green-500'
                                   : 'text-text-disabled hover:text-accent'
                                   }`}
                              disabled={task.status === 'Completed'}
                         >
                              {task.status === 'Completed' ? (
                                   <CheckCircle size={20} />
                              ) : (
                                   <Circle size={20} />
                              )}
                         </button>

                         <div className="flex-1">
                              <p className={`text-sm font-semibold transition-colors ${task.status === 'Completed'
                                   ? 'text-text-disabled line-through'
                                   : 'text-text-primary group-hover:text-accent'
                                   }`}>
                                   {task.task}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                   <span className="text-[10px] text-text-muted flex items-center gap-1 font-medium">
                                        <Briefcase size={10} /> {task.project}
                                   </span>
                                   <PriorityBadge priority={task.priority} />
                                   {task.comments > 0 && (
                                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                                             <MessageSquare size={10} /> {task.comments}
                                        </span>
                                   )}
                              </div>
                         </div>
                    </div>

                    <div className="flex items-center gap-6">
                         <div className="hidden sm:block text-right">
                              <p className="text-[10px] font-bold text-text-muted uppercase">Deadline</p>
                              <p className={`text-xs font-medium ${task.isOverdue ? 'text-red-500' : 'text-text-body'
                                   }`}>
                                   {task.deadline}
                              </p>
                         </div>
                         <StatusBadge status={task.status} />
                         <ChevronRight size={16} className="text-border-strong group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
               </div>

               {/* Quick actions on hover */}
               {task.status === 'Completed' && (
                    <div className="mt-3 pt-3 border-t border-border-subtle flex justify-end">
                         <button
                              onClick={(e) => {
                                   e.stopPropagation();
                                   onSubmitReview(task.id);
                              }}
                              className="text-xs text-accent hover:text-accent-hover font-bold flex items-center gap-1"
                         >
                              <CheckCircle2 size={12} />
                              Submit for Review
                         </button>
                    </div>
               )}
          </div>
     );
};

// Task Details Component
const TaskDetails = ({
     selectedTask,
     comments,
     newComment,
     setNewComment,
     onAddComment,
     onSubmitReview
}) => {
     const router = useRouter();

     if (!selectedTask) {
          return (
               <div className="bg-bg-surface border border-dashed border-border-strong rounded-xl p-12 text-center">
                    <div className="bg-bg-subtle w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-text-disabled">
                         <Flag size={24} />
                    </div>
                    <p className="text-lg font-bold text-text-primary mb-2">No Task Selected</p>
                    <p className="text-sm text-text-muted max-w-xs mx-auto">
                         Select a task from your list to view details, files, and team discussions.
                    </p>
               </div>
          );
     }

     const taskComments = comments.filter(c => c.taskTitle === selectedTask.task);

     return (
          <div className="space-y-6">
               <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border-default bg-bg-subtle flex items-center justify-between">
                         <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                              <Briefcase size={16} />
                              Task Details
                         </h3>
                         <button
                              onClick={() => router.push(`/developer/tasks/${selectedTask.id}`)}
                              className="text-xs text-accent hover:text-accent-hover font-bold"
                         >
                              View Full Task
                         </button>
                    </div>

                    <div className="p-5 space-y-6">
                         {/* Task Info */}
                         <div className="flex items-center justify-between">
                              <div>
                                   <p className="text-xs text-text-muted mb-1">Project</p>
                                   <p className="text-sm font-bold text-text-primary">{selectedTask.project}</p>
                              </div>
                              <div className="text-right">
                                   <p className="text-xs text-text-muted mb-1">Deadline</p>
                                   <p className={`text-sm font-bold ${selectedTask.isOverdue ? 'text-red-500' : 'text-text-primary'
                                        }`}>
                                        {selectedTask.deadline}
                                   </p>
                              </div>
                         </div>

                         {/* Description */}
                         <div>
                              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                   Description
                              </h4>
                              <p className="text-sm text-text-body leading-relaxed bg-bg-subtle p-3 rounded-lg border border-border-subtle">
                                   {selectedTask.description}
                              </p>
                         </div>

                         {/* Attachments */}
                         <div className="space-y-2">
                              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                   Attachments
                              </h4>
                              <div className="border-2 border-dashed border-border-default rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-bg-subtle hover:border-accent transition-all cursor-pointer">
                                   <Upload size={24} className="text-text-muted" />
                                   <p className="text-xs font-medium text-text-body">Click or drag to upload files</p>
                                   <p className="text-[10px] text-text-disabled">ZIP, PNG, PDF up to 10MB</p>
                              </div>
                         </div>

                         {/* Comments */}
                         <div className="space-y-4">
                              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                   <MessageSquare size={14} /> Comments ({taskComments.length})
                              </h4>

                              <div className="space-y-4 max-h-48 overflow-y-auto chat-scroll  pr-2">
                                   {taskComments.map((c) => (
                                        <div key={c.id} className="space-y-1">
                                             <div className="flex justify-between items-center">
                                                  <div className="flex items-center gap-2">
                                                       <span className="text-[10px] font-bold text-text-primary">
                                                            {c.user}
                                                       </span>
                                                       <span className="text-[8px] px-1.5 py-0.5 bg-accent/10 text-accent rounded-full">
                                                            {c.role}
                                                       </span>
                                                  </div>
                                                  <span className="text-[10px] text-text-disabled">{c.time}</span>
                                             </div>
                                             <div className="bg-bg-subtle p-3 rounded-lg text-xs text-text-body border border-border-subtle">
                                                  {c.text}
                                             </div>
                                        </div>
                                   ))}
                              </div>

                              {/* Add Comment */}
                              <div className="relative">
                                   <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && onAddComment(selectedTask.id)}
                                        placeholder="Type a comment..."
                                        className="w-full bg-bg-subtle border border-border-default rounded-lg py-2 pl-3 pr-10 text-xs focus:ring-1 focus:ring-accent outline-none"
                                   />
                                   <button
                                        onClick={() => onAddComment(selectedTask.id)}
                                        disabled={!newComment.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-accent hover:text-accent-hover disabled:opacity-50"
                                   >
                                        <Send size={14} />
                                   </button>
                              </div>
                         </div>

                         {/* Actions */}
                         {selectedTask.status === 'Completed' && (
                              <div className="pt-4 border-t border-border-default">
                                   <button
                                        onClick={() => onSubmitReview(selectedTask.id)}
                                        className="w-full bg-accent text-text-inverse py-3 rounded-lg font-bold text-xs hover:bg-accent-hover transition-all flex items-center justify-center gap-2"
                                   >
                                        <CheckCircle2 size={14} />
                                        Submit for Review
                                   </button>
                              </div>
                         )}
                    </div>
               </div>

               {/* Quick Resources */}
               <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
                    <h3 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-2 uppercase">
                         <Paperclip size={14} /> Quick Resources
                    </h3>
                    <div className="space-y-2">
                         <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className="flex items-center justify-between text-xs text-text-body hover:text-accent font-medium p-2 rounded hover:bg-bg-subtle transition-colors"
                         >
                              <span>Project Documentation</span>
                              <ChevronRight size={12} />
                         </a>
                         <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className="flex items-center justify-between text-xs text-text-body hover:text-accent font-medium p-2 rounded hover:bg-bg-subtle transition-colors"
                         >
                              <span>API Reference</span>
                              <ChevronRight size={12} />
                         </a>
                         <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className="flex items-center justify-between text-xs text-text-body hover:text-accent font-medium p-2 rounded hover:bg-bg-subtle transition-colors"
                         >
                              <span>Design Guidelines</span>
                              <ChevronRight size={12} />
                         </a>
                    </div>
               </div>
          </div>
     );
};

export default DeveloperDashboard;