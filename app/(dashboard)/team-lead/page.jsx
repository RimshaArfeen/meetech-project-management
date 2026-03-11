
// app/(dashboard)/team-lead/page.js
'use client';
import React, { useState, useEffect } from 'react';
import {
     Plus,
     LayoutDashboard,
     Briefcase,
     Users,
     Calendar,
     CheckCircle2,
     AlertCircle,
     FileText,
     MessageSquare,
     Upload,
     MoreVertical,
     ChevronRight,
     TrendingUp,
     Clock,
     UserPlus,
     CheckSquare,
     ListTodo,
     Flag,
     UserCheck,
     ArrowUpRight,
     X,
     Loader
} from 'lucide-react';
import { useTeamLeadDashboard } from '../../../hooks/useTeamLeadDashboard';
import CreateTaskModal from '../../Components/team-lead/CreateTaskModal';
import IssueReportModal from '../../Components/team-lead/IssueReportModal';
import TaskApprovalModal from '../../Components/team-lead/TaskApprovalModal';
import Spinner from '../../Components/common/Spinner';

const TeamLeadDashboard = () => {
     const [activeTab, setActiveTab] = useState('overview');
     const [showTaskModal, setShowTaskModal] = useState(false);
     const [showIssueModal, setShowIssueModal] = useState(false);
     const [selectedApproval, setSelectedApproval] = useState(null);
     const [selectedProject, setSelectedProject] = useState('all');

     const {
          projects,
          pendingApprovals,
          developerTasks,
          deadlines,
          stats,
          loading,
          error,
          createTask,
          approveTask,
          requestRevision,
          reportIssue,
          refetch
     } = useTeamLeadDashboard();

     if (loading) {
          return (
               <div className="min-h-screen bg-bg-page flex items-center justify-center">
                    <Spinner message="Loading your dashboard..." />
               </div>
          );
     }

     if (error) {
          return (
               <div className="min-h-screen bg-bg-page flex items-center justify-center">
                    <div className="text-center max-w-md">
                         <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                         <h2 className="text-xl font-bold text-text-primary mb-2">Error Loading Dashboard</h2>
                         <p className="text-text-muted mb-6">{error}</p>
                         <button
                              onClick={refetch}
                              className="bg-accent text-text-inverse px-6 py-3 rounded-xl font-bold hover:bg-accent-hover transition-all"
                         >
                              Try Again
                         </button>
                    </div>
               </div>
          );
     }

     // Filter tasks based on selected project
     const filteredTasks = selectedProject === 'all'
          ? developerTasks
          : developerTasks.filter(task => task.projectId === selectedProject);

     return (
          <div className="min-h-screen bg-bg-page text-text-body font-sans flex pb-32 md:pb-0">


               {/* Main Content */}
               <main className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="h-16 border-b border-border-default bg-bg-surface flex items-center justify-between px-page-x sticky top-0 z-10">
                         <div className="flex items-center gap-4">
                              <h1 className="text-headline font-bold text-text-primary">Team Lead Control Panel</h1>
                              <div className="h-6 w-px bg-border-default"></div>
                              <select
                                   value={selectedProject}
                                   onChange={(e) => setSelectedProject(e.target.value)}
                                   className="bg-transparent text-sm font-medium text-text-muted outline-none cursor-pointer hover:text-accent transition-colors"
                              >
                                   <option value="all">All My Projects</option>
                                   {projects.map(project => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                   ))}
                              </select>
                         </div>
                         <div className="flex items-center gap-4">
                              <button
                                   onClick={() => setShowIssueModal(true)}
                                   className="border border-border-default hover:bg-bg-subtle text-text-body px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
                              >
                                   <AlertCircle size={18} />
                                   <span>Report Issue</span>
                              </button>
                              <button
                                   onClick={() => setShowTaskModal(true)}
                                   className="bg-accent hover:bg-accent-hover text-text-inverse px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                              >
                                   <Plus size={18} />
                                   <span>Create Dev Task</span>
                              </button>
                         </div>
                    </header>

                    {/* Dashboard Content */}
                    <div className="p-page-y px-page-x space-y-8 overflow-y-auto chat-scroll  pb-12">

                         {/* Stats Overview */}
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <StatCard
                                   icon={<Briefcase className="text-accent" />}
                                   label="Active Projects"
                                   value={stats.activeProjects}
                                   total={stats.totalProjects}
                                   bgColor="bg-accent/10"
                              />
                              <StatCard
                                   icon={<Users className="text-accent-secondary" />}
                                   label="Team Members"
                                   value={stats.totalDevelopers}
                                   bgColor="bg-accent-secondary/10"
                              />
                              <StatCard
                                   icon={<UserCheck className="text-yellow-500" />}
                                   label="Pending Reviews"
                                   value={stats.pendingReviews}
                                   bgColor="bg-yellow-500/10"
                              />
                              <StatCard
                                   icon={<Clock className="text-red-500" />}
                                   label="Overdue Tasks"
                                   value={stats.overdueTasks}
                                   bgColor="bg-red-500/10"
                              />
                         </div>

                         {/* Active Projects Overview */}
                         <section>
                              <div className="flex items-center justify-between mb-4">
                                   <h2 className="text-subheading font-bold text-text-primary">Active Projects</h2>
                                   <button className="text-sm text-accent hover:underline flex items-center gap-1">
                                        View All <ChevronRight size={16} />
                                   </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {projects.slice(0, 4).map(proj => (
                                        <ProjectCard key={proj.id} project={proj} />
                                   ))}
                              </div>
                         </section>

                         {/* Main Workspace Split */}
                         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                              {/* Task Tracking Table */}
                              <div className="xl:col-span-2 space-y-6">
                                   <div className="flex items-center justify-between">
                                        <h2 className="text-subheading font-bold text-text-primary flex items-center gap-2">
                                             Developer Task Queue
                                             <span className="text-xs font-normal px-2 py-0.5 bg-accent-muted text-accent rounded-full">
                                                  {filteredTasks.length}
                                             </span>
                                        </h2>
                                        <div className="flex gap-2">
                                             <button
                                                  onClick={() => setActiveTab('tasks')}
                                                  className="text-xs font-medium px-3 py-1 rounded border border-border-default hover:bg-bg-subtle"
                                             >
                                                  View All
                                             </button>
                                             <button className="text-xs font-medium px-3 py-1 rounded border border-border-default hover:bg-bg-subtle">
                                                  Weekly Log
                                             </button>
                                        </div>
                                   </div>

                                   <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left border-collapse">
                                             <thead>
                                                  <tr className="bg-bg-subtle border-b border-border-default">
                                                       <th className="p-4 text-xs font-bold text-text-muted uppercase">Task & Developer</th>
                                                       <th className="p-4 text-xs font-bold text-text-muted uppercase">Priority</th>
                                                       <th className="p-4 text-xs font-bold text-text-muted uppercase">Status</th>
                                                       <th className="p-4 text-xs font-bold text-text-muted uppercase">Internal Deadline</th>
                                                       <th className="p-4 text-xs font-bold text-text-muted uppercase text-right">Action</th>
                                                  </tr>
                                             </thead>
                                             <tbody className="divide-y divide-border-default">
                                                  {filteredTasks.slice(0, 5).map((item) => (
                                                       <TaskRow key={item.id} task={item} />
                                                  ))}
                                                  {filteredTasks.length === 0 && (
                                                       <tr>
                                                            <td colSpan="5" className="p-8 text-center text-text-muted">
                                                                 No tasks found for the selected project
                                                            </td>
                                                       </tr>
                                                  )}
                                             </tbody>
                                        </table>
                                   </div>

                                   {/* Issue Reporting CTA */}
                                   <div className="bg-red-50/50 border border-red-100 rounded-xl p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                             <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                                  <AlertCircle size={24} />
                                             </div>
                                             <div>
                                                  <h4 className="text-sm font-bold text-red-900">Blocking Issues?</h4>
                                                  <p className="text-xs text-red-700">Report delays or technical hurdles directly to the Project Manager.</p>
                                             </div>
                                        </div>
                                        <button
                                             onClick={() => setShowIssueModal(true)}
                                             className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                                        >
                                             Escalate to PM
                                        </button>
                                   </div>
                              </div>

                              {/* Quality Control Sidebar */}
                              <div className="space-y-8">
                                   {/* Approval Queue */}
                                   <div className="bg-bg-surface rounded-xl border border-border-default shadow-sm overflow-hidden">
                                        <div className="p-4 border-b border-border-default flex items-center justify-between bg-bg-subtle">
                                             <h3 className="text-ui font-bold text-text-primary flex items-center gap-2">
                                                  <UserCheck size={18} className="text-accent-secondary" />
                                                  Review Pipeline
                                             </h3>
                                             {pendingApprovals.length > 0 && (
                                                  <span className="text-[10px] font-bold bg-accent-secondary text-text-inverse px-1.5 py-0.5 rounded">
                                                       {pendingApprovals.length} NEW
                                                  </span>
                                             )}
                                        </div>
                                        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto chat-scroll ">
                                             {pendingApprovals.length > 0 ? (
                                                  pendingApprovals.map(app => (
                                                       <ApprovalItem
                                                            key={app.id}
                                                            approval={app}
                                                            onApprove={() => setSelectedApproval(app)}
                                                       />
                                                  ))
                                             ) : (
                                                  <div className="text-center py-8">
                                                       <CheckCircle2 size={32} className="text-text-muted mx-auto mb-3" />
                                                       <p className="text-sm text-text-muted">No pending approvals</p>
                                                  </div>
                                             )}
                                        </div>
                                   </div>

                                   {/* Internal Deadlines Tracker */}
                                   <div className="bg-bg-card rounded-xl p-6 border border-border-subtle">
                                        <h3 className="text-ui font-bold text-text-primary mb-4 flex items-center gap-2">
                                             <Calendar size={18} className="text-accent" />
                                             Upcoming Deadlines
                                        </h3>
                                        <div className="space-y-4">
                                             {deadlines.length > 0 ? (
                                                  deadlines.map(deadline => (
                                                       <DeadlineItem key={deadline.id} deadline={deadline} />
                                                  ))
                                             ) : (
                                                  <p className="text-sm text-text-muted text-center py-4">
                                                       No upcoming deadlines this week
                                                  </p>
                                             )}
                                        </div>
                                   </div>

                                   {/* Quick Stats */}
                                   <div className="bg-gradient-to-br from-accent to-accent-active rounded-xl p-6 text-text-inverse">
                                        <h3 className="text-ui font-bold mb-4 flex items-center gap-2">
                                             <TrendingUp size={18} />
                                             Team Performance
                                        </h3>
                                        <div className="space-y-3">
                                             <div>
                                                  <div className="flex justify-between text-sm mb-1">
                                                       <span>Completion Rate</span>
                                                       <span>{stats.completionRate}%</span>
                                                  </div>
                                                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                                       <div
                                                            className="h-full bg-white rounded-full"
                                                            style={{ width: `${stats.completionRate}%` }}
                                                       />
                                                  </div>
                                             </div>
                                             <div className="grid grid-cols-2 gap-3 pt-2">
                                                  <div>
                                                       <p className="text-xs opacity-80">Completed</p>
                                                       <p className="text-xl font-bold">{stats.completedTasks}</p>
                                                  </div>
                                                  <div>
                                                       <p className="text-xs opacity-80">Total Tasks</p>
                                                       <p className="text-xl font-bold">{stats.totalTasks}</p>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </main>

               {/* Modals */}
               <CreateTaskModal
                    isOpen={showTaskModal}
                    onClose={() => setShowTaskModal(false)}
                    onSubmit={createTask}
                    projects={projects}
               />

               <IssueReportModal
                    isOpen={showIssueModal}
                    onClose={() => setShowIssueModal(false)}
                    onSubmit={reportIssue}
                    projects={projects}
               />

               {selectedApproval && (
                    <TaskApprovalModal
                         isOpen={!!selectedApproval}
                         onClose={() => setSelectedApproval(null)}
                         onApprove={approveTask}
                         onRevision={requestRevision}
                         task={selectedApproval}
                    />
               )}
          </div>
     );
};

// Internal Components
const NavItem = ({ icon, label, active, onClick, badge, href }) => {
     const Component = href ? 'a' : 'button';

     return (
          <Component
               href={href}
               onClick={onClick}
               className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-ui transition-all ${active
                    ? 'bg-accent text-text-inverse shadow-md'
                    : 'text-text-muted hover:bg-bg-subtle hover:text-text-primary'
                    }`}
          >
               <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-medium">{label}</span>
               </div>
               {badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-accent/10 text-accent'
                         }`}>
                         {badge}
                    </span>
               )}
          </Component>
     );
};

const StatCard = ({ icon, label, value, total, bgColor }) => (
     <div className="bg-bg-surface border border-border-default rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
               <div className={`p-2 ${bgColor} rounded-lg`}>
                    {icon}
               </div>
               <span className="text-xs font-medium text-text-muted uppercase">{label}</span>
          </div>
          <div className="flex items-end justify-between">
               <span className="text-2xl font-bold text-text-primary">{value}</span>
               {total && (
                    <span className="text-xs text-text-muted">of {total}</span>
               )}
          </div>
     </div>
);

const ProjectCard = ({ project }) => (
     <div className="bg-bg-surface border border-border-default p-5 rounded-xl shadow-sm hover:border-accent transition-colors">
          <div className="flex justify-between items-start mb-4">
               <div>
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">{project.name}</h3>
                    <p className="text-xs text-text-muted">{project.client}</p>
               </div>
               <span className="text-xs font-bold text-accent px-2 py-1 bg-accent-muted rounded">
                    Deadline: {project.deadline}
               </span>
          </div>
          <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
               </div>
               <div className="h-2 bg-bg-subtle rounded-full overflow-hidden border border-border-subtle">
                    <div
                         className="h-full bg-accent transition-all duration-500"
                         style={{ width: `${project.progress}%` }}
                    />
               </div>
               <div className="flex justify-between text-[10px] text-text-muted mt-1">
                    <span>{project.taskCount} tasks</span>
                    <span>{project.milestoneCount} milestones</span>
               </div>
          </div>
     </div>
);

const TaskRow = ({ task }) => {
     const getPriorityColor = (priority) => {
          switch (priority) {
               case 'URGENT':
               case 'HIGH': return 'bg-red-100 text-red-600';
               case 'MEDIUM': return 'bg-yellow-100 text-yellow-600';
               default: return 'bg-green-100 text-green-600';
          }
     };

     const getStatusColor = (status) => {
          switch (status) {
               case 'COMPLETED': return 'text-green-600';
               case 'IN_PROGRESS': return 'text-blue-600';
               case 'REVIEW': return 'text-yellow-600';
               case 'BLOCKED': return 'text-red-600';
               default: return 'text-gray-600';
          }
     };

     return (
          <tr className="hover:bg-bg-subtle/50 transition-colors">
               <td className="p-4">
                    <p className="text-sm font-semibold text-text-primary">{task.task}</p>
                    <p className="text-[10px] text-text-muted">{task.dev}</p>
               </td>
               <td className="p-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getPriorityColor(task.priority)}`}>
                         {task.priority}
                    </span>
               </td>
               <td className="p-4">
                    <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                         {task.status.replace('_', ' ')}
                    </span>
               </td>
               <td className="p-4">
                    <div className="flex items-center gap-2">
                         <Clock size={12} className={task.isDelayed ? 'text-red-500' : 'text-text-muted'} />
                         <span className={`text-xs ${task.isDelayed ? 'text-red-600 font-bold' : 'text-text-body'}`}>
                              {task.deadline}
                         </span>
                    </div>
               </td>
               <td className="p-4 text-right">
                    <button className="text-accent hover:text-accent-hover">
                         <MoreVertical size={16} />
                    </button>
               </td>
          </tr>
     );
};

const ApprovalItem = ({ approval, onApprove }) => (
     <div className="p-3 border border-border-subtle rounded-lg hover:border-accent-secondary transition-colors group">
          <div className="flex justify-between mb-2">
               <span className="text-[10px] text-text-muted font-bold uppercase">{approval.project}</span>
               <span className="text-[10px] text-text-disabled">{approval.time}</span>
          </div>
          <p className="text-xs font-bold text-text-primary mb-1">{approval.task}</p>
          <div className="flex items-center justify-between">
               <span className="text-[10px] text-text-muted italic">Dev: {approval.developer}</span>
               <div className="flex gap-2">
                    <button
                         onClick={() => onApprove(approval)}
                         className="p-1 text-accent-secondary hover:bg-accent-secondary/10 rounded transition-colors"
                         title="Review Task"
                    >
                         <CheckCircle2 size={14} />
                    </button>
               </div>
          </div>
     </div>
);

const DeadlineItem = ({ deadline }) => (
     <div className="flex items-center gap-3">
          <div className={`w-1 h-10 rounded-full ${deadline.deadline.includes('Today') ? 'bg-red-500' : 'bg-accent'
               }`}></div>
          <div className="flex-1">
               <p className="text-xs font-bold text-text-primary">{deadline.title}</p>
               <p className="text-[10px] text-text-muted">
                    {deadline.project} • {deadline.developer}
               </p>
               <p className="text-[10px] font-medium mt-1 text-accent">
                    {deadline.deadline}
               </p>
          </div>
     </div>
);

export default TeamLeadDashboard;