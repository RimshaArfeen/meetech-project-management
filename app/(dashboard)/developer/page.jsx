// app/(dashboard)/developer/page.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import for redirection
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
     PlayCircle, LogOut
} from 'lucide-react';
import { StatCard } from '../../Components/common/StatCard';
import { StatusBadge } from '../../Components/common/StatusBadge';

const MySwal = withReactContent(Swal);

const DeveloperDashboard = () => {
     const [selectedTask, setSelectedTask] = useState(null);
     const [isLoading, setIsLoading] = useState(false);
     const router = useRouter();

     const handleLogout = async () => {
          // Trigger SweetAlert2 Confirmation
          const result = await MySwal.fire({
               title: <p className="text-red-700 font-bold">Are you sure?</p>,
               text: "You will need to login again to access the Developer Dashboard.",
               icon: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#b91c1c', // Matching your bg-red-700
               cancelButtonColor: '#6b7280',
               confirmButtonText: 'Yes, logout',
               background: '#ffffff', // Adjust to match your bg-bg-surface
               customClass: {
                    popup: 'rounded-2xl border border-border-default shadow-xl',
                    confirmButton: 'rounded-xl px-4 py-2 font-medium',
                    cancelButton: 'rounded-xl px-4 py-2 font-medium'
               }
          });

          if (result.isConfirmed) {
               try {
                    setIsLoading(true);
                    const response = await fetch('/api/auth/logout', { method: 'POST' });

                    if (response.ok) {
                         router.push('/login');
                    }
               } catch (error) {
                    MySwal.fire('Error', 'Logout failed. Please try again.', 'error');
               } finally {
                    setIsLoading(false);
               }
          }
     };

     // Developer specific mock data
     const myProjects = [
          { id: 1, name: 'Cloud Migration Phase 2', role: 'Backend Dev', deadline: 'May 15', tasksLeft: 4 },
          { id: 2, name: 'AI Integration Suite', role: 'Frontend Dev', deadline: 'Jun 01', tasksLeft: 7 }
     ];

     const personalTasks = [
          { id: 201, task: 'Fix Header Alignment', project: 'Cloud Migration', status: 'In Progress', priority: 'Medium', deadline: 'Today', description: 'The header is shifting 5px to the left on mobile viewports.' },
          { id: 202, task: 'Setup AWS S3 Buckets', project: 'Cloud Migration', status: 'Blocked', priority: 'High', deadline: 'Yesterday', description: 'Waiting for IAM permissions from the DevOps team.' },
          { id: 203, task: 'Unit Testing for API', project: 'AI Integration', status: 'Not Started', priority: 'Low', deadline: 'Tomorrow', description: 'Write tests for the /v1/chat endpoint.' },
          { id: 204, task: 'Clean up Tailwind classes', project: 'AI Integration', status: 'Completed', priority: 'Low', deadline: 'Completed', description: 'Remove unused utility classes from the landing page.' }
     ];

     const comments = [
          { id: 1, user: 'Sarah Chen', role: 'Team Lead', text: 'Emily, focus on the header fix first. The client is reviewing mobile today.', time: '1h ago' },
          { id: 2, user: 'You', role: 'Developer', text: 'On it. Just finishing the CSS variable mapping.', time: '45m ago' }
     ];

     // Filter tasks based on status
     const getTasksByStatus = (status) => {
          return personalTasks.filter(task => task.status === status);
     };

     return (
          <>
               {/* Main Content */}
               <main className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="h-16 border-b border-border-default bg-bg-surface flex items-center justify-between px-6 sticky top-0 z-10">
                         <div className="flex items-center gap-4">
                              <h1 className="text-xl font-bold text-text-primary">Developer Workspace</h1>
                              <div className="h-6 w-px bg-border-default"></div>
                              <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                                   <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                   Active Session: 2h 15m
                              </div>

                         </div>
                         <div className="flex items-center gap-4">
                              <button className="text-text-muted hover:text-accent p-2 rounded-lg hover:bg-bg-subtle transition-colors">
                                   <Clock size={20} />
                              </button>
                              <div className="h-8 w-px bg-border-default"></div>
                              <button className="bg-accent hover:bg-accent-hover text-text-inverse px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm">
                                   <CheckCircle2 size={18} />
                                   <span>Submit for Review</span>
                              </button>
                              <button
                                   onClick={handleLogout}
                                   disabled={isLoading}
                                   className={`flex items-center gap-2 px-4 py-2 bg-red-700 text-text-inverse rounded-xl font-medium hover:bg-red-800 transition-all shadow-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                   <LogOut size={18} />
                                   <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                              </button>
                         </div>
                    </header>

                    {/* Dashboard Content */}
                    <div className="p-6 space-y-8 overflow-y-auto">
                         {/* Quick Stats Cards */}
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <StatCard
                                   title="Total Tasks"
                                   value={personalTasks.length}
                                   icon={<ListTodo size={20} />}
                                   color="blue"
                              />
                              <StatCard
                                   title="In Progress"
                                   value={getTasksByStatus('In Progress').length}
                                   icon={<PlayCircle size={20} />}
                                   color="yellow"
                              />
                              <StatCard
                                   title="Completed"
                                   value={getTasksByStatus('Completed').length}
                                   icon={<CheckCircle size={20} />}
                                   color="green"
                              />
                              <StatCard
                                   title="Blocked"
                                   value={getTasksByStatus('Blocked').length}
                                   icon={<AlertCircle size={20} />}
                                   color="red"
                              />
                         </div>

                         {/* Top Grid: Projects & Deadlines */}
                         <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   {myProjects.map(proj => (
                                        <div key={proj.id} className="bg-bg-surface border border-border-default p-5 rounded-xl shadow-sm hover:border-accent transition-colors">
                                             <div className="flex justify-between items-start mb-4">
                                                  <div>
                                                       <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">{proj.name}</h3>
                                                       <p className="text-[10px] text-accent font-bold mt-1 bg-accent-muted px-2 py-0.5 rounded inline-block">{proj.role}</p>
                                                  </div>
                                                  <span className="text-[10px] font-bold text-text-muted">Due: {proj.deadline}</span>
                                             </div>
                                             <div className="flex items-center justify-between">
                                                  <span className="text-xs text-text-muted">{proj.tasksLeft} tasks remaining</span>
                                                  <button className="text-accent hover:text-accent-hover p-1">
                                                       <ArrowUpRight size={16} />
                                                  </button>
                                             </div>
                                        </div>
                                   ))}
                              </div>

                              <div className="bg-bg-surface border border-border-default p-5 rounded-xl flex items-center justify-between">
                                   <div>
                                        <p className="text-xs font-bold text-text-muted uppercase mb-1">Weekly Goal</p>
                                        <p className="text-2xl font-bold text-text-primary">12 / 15</p>
                                        <p className="text-xs text-text-muted">Tasks completed</p>
                                   </div>
                                   <div className="relative w-16 h-16">
                                        <svg className="w-full h-full transform -rotate-90">
                                             <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-bg-subtle" />
                                             <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={176} strokeDashoffset={35.2} className="text-accent" />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">80%</span>
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
                                                  {personalTasks.length}
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
                                        {personalTasks.map((task) => (
                                             <TaskItem
                                                  key={task.id}
                                                  task={task}
                                                  isSelected={selectedTask?.id === task.id}
                                                  onSelect={() => setSelectedTask(task)}
                                             />
                                        ))}
                                   </div>
                              </div>

                              {/* Task Detail Sidebar */}
                              <TaskDetails
                                   selectedTask={selectedTask}
                                   comments={comments}
                              />
                         </div>
                    </div>
               </main>

          </>
     );
};



// Task Item Component
const TaskItem = ({ task, isSelected, onSelect }) => (
     <div
          onClick={onSelect}
          className={`bg-bg-surface border p-4 rounded-xl transition-all cursor-pointer group ${isSelected
               ? 'border-accent ring-1 ring-accent'
               : 'border-border-default hover:border-border-strong'
               }`}
     >
          <div className="flex items-center justify-between gap-4">
               <div className="flex items-center gap-4 flex-1">
                    <button className="text-text-disabled hover:text-accent transition-colors">
                         {task.status === 'Completed' ?
                              <CheckCircle className="text-emerald-500" size={20} /> :
                              <Circle size={20} />
                         }
                    </button>
                    <div className="flex-1">
                         <p className={`text-sm font-semibold transition-colors ${task.status === 'Completed' ? 'text-text-disabled line-through' : 'text-text-primary group-hover:text-accent'}`}>
                              {task.task}
                         </p>
                         <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] text-text-muted flex items-center gap-1 font-medium">
                                   <Briefcase size={10} /> {task.project}
                              </span>
                              <PriorityBadge priority={task.priority} />
                         </div>
                    </div>
               </div>

               <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                         <p className="text-[10px] font-bold text-text-muted uppercase">Deadline</p>
                         <p className={`text-xs font-medium ${task.deadline === 'Yesterday' ? 'text-red-500' : 'text-text-body'}`}>
                              {task.deadline}
                         </p>
                    </div>
                    <StatusBadge status={task.status} />
                    <ChevronRight size={16} className="text-border-strong group-hover:text-accent" />
               </div>
          </div>
     </div>
);

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
     const colors = {
          High: 'bg-red-50 text-red-600',
          Medium: 'bg-yellow-50 text-yellow-600',
          Low: 'bg-green-50 text-green-600'
     };

     return (
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${colors[priority] || 'bg-slate-50 text-slate-600'}`}>
               {priority}
          </span>
     );
};



// Task Details Component
const TaskDetails = ({ selectedTask, comments }) => {
     if (!selectedTask) {
          return (
               <div className="bg-bg-surface border border-dashed border-border-strong rounded-xl p-12 text-center">
                    <div className="bg-bg-subtle w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-text-disabled">
                         <Flag size={20} />
                    </div>
                    <p className="text-sm font-bold text-text-primary">No Task Selected</p>
                    <p className="text-xs text-text-muted mt-1">
                         Select a task from your list to view details, files, and comments.
                    </p>
               </div>
          );
     }

     return (
          <div className="space-y-6">
               <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border-default bg-bg-subtle flex items-center justify-between">
                         <h3 className="text-sm font-bold text-text-primary">Task Details</h3>
                         <button className="text-text-muted hover:text-text-primary">
                              <MoreVertical size={16} />
                         </button>
                    </div>

                    <div className="p-5 space-y-6">
                         <div>
                              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                   Description
                              </h4>
                              <p className="text-sm text-text-body leading-relaxed">
                                   {selectedTask.description}
                              </p>
                         </div>

                         <div className="space-y-2">
                              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                   Deliverables
                              </h4>
                              <div className="border-2 border-dashed border-border-default rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-bg-subtle hover:border-accent transition-all cursor-pointer">
                                   <Upload size={24} className="text-text-muted" />
                                   <p className="text-xs font-medium text-text-body">Click or drag to upload files</p>
                                   <p className="text-[10px] text-text-disabled">ZIP, PNG, PDF up to 10MB</p>
                              </div>
                         </div>

                         <div className="space-y-4">
                              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                   <MessageSquare size={14} /> Internal Comments
                              </h4>
                              <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                                   {comments.map(c => (
                                        <div key={c.id} className="space-y-1">
                                             <div className="flex justify-between items-center">
                                                  <span className="text-[10px] font-bold text-text-primary">
                                                       {c.user} <span className="font-normal text-text-disabled">({c.role})</span>
                                                  </span>
                                                  <span className="text-[10px] text-text-disabled">{c.time}</span>
                                             </div>
                                             <div className="bg-bg-subtle p-2 rounded-lg text-xs text-text-body border border-border-subtle">
                                                  {c.text}
                                             </div>
                                        </div>
                                   ))}
                              </div>
                              <div className="relative">
                                   <input
                                        type="text"
                                        placeholder="Type a comment..."
                                        className="w-full bg-bg-subtle border border-border-default rounded-lg py-2 pl-3 pr-10 text-xs focus:ring-1 focus:ring-accent outline-none"
                                   />
                                   <button className="absolute right-2 top-1/2 -translate-y-1/2 text-accent hover:text-accent-hover">
                                        <Send size={14} />
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Quick Resources */}
               <div className="bg-bg-surface rounded-xl p-5 border border-border-default">
                    <h3 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-2 uppercase">
                         <Paperclip size={14} /> Documentation
                    </h3>
                    <div className="space-y-2">
                         <a href="#" className="flex items-center justify-between text-xs text-text-body hover:text-accent font-medium p-2 rounded hover:bg-bg-subtle">
                              <span>API Specs V1.4</span>
                              <ChevronRight size={12} />
                         </a>
                         <a href="#" className="flex items-center justify-between text-xs text-text-body hover:text-accent font-medium p-2 rounded hover:bg-bg-subtle">
                              <span>Branding Guidelines</span>
                              <ChevronRight size={12} />
                         </a>
                    </div>
               </div>
          </div>
     );
};

// ArrowUpRight Icon Component
const ArrowUpRight = ({ size }) => (
     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
     </svg>
);

export default DeveloperDashboard;