
// app/(dashboard)/team-lead/page.js
'use client';
import React, { useState } from 'react';
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
     ArrowUpRight
} from 'lucide-react';

const App = () => {
     const [activeTab, setActiveTab] = useState('tasks');
     const [showTaskModal, setShowTaskModal] = useState(false);

     // Team Lead specific mock data
     const assignedProjects = [
          { id: 1, name: 'Cloud Migration Phase 2', client: 'Acme Corp', deadline: 'May 15', progress: 65 },
          { id: 2, name: 'AI Integration Suite', client: 'NexGen AI', deadline: 'Jun 01', progress: 12 }
     ];

     const pendingApprovals = [
          { id: 101, task: 'Database Schema Optimization', developer: 'Emily Chen', project: 'Cloud Migration', time: '2h ago' },
          { id: 102, task: 'Auth Middleware Implementation', developer: 'David Smith', project: 'AI Integration', time: '5h ago' }
     ];

     const developerTasks = [
          { id: 201, task: 'Fix Header Alignment', dev: 'Emily Chen', status: 'In Progress', priority: 'Medium', deadline: 'Today' },
          { id: 202, task: 'Setup AWS S3 Buckets', dev: 'James Wilson', status: 'Delayed', priority: 'High', deadline: 'Yesterday' },
          { id: 203, task: 'Unit Testing for API', dev: 'David Smith', status: 'Completed', priority: 'Low', deadline: 'Tomorrow' }
     ];

     return (
          <div className="min-h-screen bg-bg-page text-text-body font-sans flex">
               {/* Sidebar Nav */}
               <aside className="w-64 border-r border-border-default bg-bg-surface flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen">
                    <div className="p-6">
                         <div className="flex items-center gap-2 text-accent font-bold text-xl">
                              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-text-inverse">
                                   <CheckSquare size={20} />
                              </div>
                              <span className="tracking-tight text-text-primary">ProManage</span>
                         </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                         <NavItem icon={<LayoutDashboard size={20} />} label="TL Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                         <NavItem icon={<ListTodo size={20} />} label="Task Control" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
                         <NavItem icon={<Users size={20} />} label="My Developers" active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} />
                         <NavItem icon={<UserCheck size={20} />} label="Approvals" active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} />
                         <NavItem icon={<AlertCircle size={20} />} label="Report Issues" active={activeTab === 'issues'} onClick={() => setActiveTab('issues')} />
                    </nav>

                    <div className="p-4 border-t border-border-default">
                         <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-subtle transition-colors cursor-pointer">
                              <div className="w-10 h-10 rounded-full bg-accent-secondary/20 flex items-center justify-center text-accent-secondary font-medium border border-accent-secondary/30">
                                   SC
                              </div>
                              <div>
                                   <p className="text-sm font-semibold text-text-primary">Sarah Chen</p>
                                   <p className="text-xs text-text-muted">Senior Team Lead</p>
                              </div>
                         </div>
                    </div>
               </aside>

               {/* Main Content */}
               <main className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="h-16 border-b border-border-default bg-bg-surface flex items-center justify-between px-page-x sticky top-0 z-10">
                         <div className="flex items-center gap-4">
                              <h1 className="text-headline font-bold text-text-primary">Team Lead Control Panel</h1>
                              <div className="h-6 w-px bg-border-default"></div>
                              <select className="bg-transparent text-sm font-medium text-text-muted outline-none cursor-pointer hover:text-accent transition-colors">
                                   <option>All My Projects</option>
                                   <option>Cloud Migration Phase 2</option>
                                   <option>AI Integration Suite</option>
                              </select>
                         </div>
                         <div className="flex items-center gap-4">
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
                    <div className="p-page-y px-page-x space-y-8 overflow-y-auto">

                         {/* Active Projects Overview */}
                         <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {assignedProjects.map(proj => (
                                   <div key={proj.id} className="bg-bg-surface border border-border-default p-5 rounded-xl shadow-sm hover:border-accent transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                             <div>
                                                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">{proj.name}</h3>
                                                  <p className="text-xs text-text-muted">{proj.client}</p>
                                             </div>
                                             <span className="text-xs font-bold text-accent px-2 py-1 bg-accent-muted rounded">Deadline: {proj.deadline}</span>
                                        </div>
                                        <div className="space-y-2">
                                             <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase">
                                                  <span>Milestone Progress</span>
                                                  <span>{proj.progress}%</span>
                                             </div>
                                             <div className="h-2 bg-bg-subtle rounded-full overflow-hidden border border-border-subtle">
                                                  <div className="h-full bg-accent transition-all duration-500" style={{ width: `${proj.progress}%` }} />
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </section>

                         {/* Main Workspace Split */}
                         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                              {/* Task Tracking Table */}
                              <div className="xl:col-span-2 space-y-6">
                                   <div className="flex items-center justify-between">
                                        <h2 className="text-subheading font-bold text-text-primary flex items-center gap-2">
                                             Developer Task Queue <span className="text-xs font-normal px-2 py-0.5 bg-accent-muted text-accent rounded-full">{developerTasks.length}</span>
                                        </h2>
                                        <div className="flex gap-2">
                                             <button className="text-xs font-medium px-3 py-1 rounded border border-border-default hover:bg-bg-subtle">Filter</button>
                                             <button className="text-xs font-medium px-3 py-1 rounded border border-border-default hover:bg-bg-subtle">Weekly Log</button>
                                        </div>
                                   </div>

                                   <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left border-collapse">
                                             <thead>
                                                  <tr className="bg-bg-subtle border-b border-border-default">
                                                       <th className="p-4 text-xs font-bold text-text-muted uppercase">Task & Developer</th>
                                                       <th className="p-4 text-xs font-bold text-text-muted uppercase">Priority</th>
                                                       <th className="p-4 text-xs font-bold text-text-muted uppercase">Internal Deadline</th>
                                                       <th className="p-4 text-xs font-bold text-text-muted uppercase text-right">Action</th>
                                                  </tr>
                                             </thead>
                                             <tbody className="divide-y divide-border-default">
                                                  {developerTasks.map((item) => (
                                                       <tr key={item.id} className="hover:bg-bg-subtle/50 transition-colors">
                                                            <td className="p-4">
                                                                 <p className="text-sm font-semibold text-text-primary">{item.task}</p>
                                                                 <p className="text-[10px] text-text-muted">{item.dev}</p>
                                                            </td>
                                                            <td className="p-4">
                                                                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                                                      }`}>
                                                                      {item.priority}
                                                                 </span>
                                                            </td>
                                                            <td className="p-4">
                                                                 <div className="flex items-center gap-2">
                                                                      <Clock size={12} className={item.status === 'Delayed' ? 'text-red-500' : 'text-text-muted'} />
                                                                      <span className={`text-xs ${item.status === 'Delayed' ? 'text-red-600 font-bold' : 'text-text-body'}`}>{item.deadline}</span>
                                                                 </div>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                 <button className="text-accent hover:text-accent-hover"><MoreVertical size={16} /></button>
                                                            </td>
                                                       </tr>
                                                  ))}
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
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors">Escalate to PM</button>
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
                                             <span className="text-[10px] font-bold bg-accent-secondary text-text-inverse px-1.5 py-0.5 rounded">NEW</span>
                                        </div>
                                        <div className="p-4 space-y-4">
                                             {pendingApprovals.map(app => (
                                                  <div key={app.id} className="p-3 border border-border-subtle rounded-lg hover:border-accent-secondary transition-colors group">
                                                       <div className="flex justify-between mb-2">
                                                            <span className="text-[10px] text-text-muted font-bold uppercase">{app.project}</span>
                                                            <span className="text-[10px] text-text-disabled">{app.time}</span>
                                                       </div>
                                                       <p className="text-xs font-bold text-text-primary mb-1">{app.task}</p>
                                                       <div className="flex items-center justify-between">
                                                            <span className="text-[10px] text-text-muted italic">Dev: {app.developer}</span>
                                                            <div className="flex gap-2">
                                                                 <button className="p-1 text-red-500 hover:bg-red-50 rounded"><AlertCircle size={14} /></button>
                                                                 <button className="p-1 text-accent-secondary hover:bg-accent-secondary/10 rounded"><CheckCircle2 size={14} /></button>
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Internal Deadlines Tracker */}
                                   <div className="bg-bg-card rounded-xl p-6 border border-border-subtle">
                                        <h3 className="text-ui font-bold text-text-primary mb-4 flex items-center gap-2">
                                             <Calendar size={18} className="text-accent" />
                                             Internal Targets
                                        </h3>
                                        <div className="space-y-4">
                                             <div className="flex items-center gap-3">
                                                  <div className="w-1 h-10 bg-accent rounded-full"></div>
                                                  <div>
                                                       <p className="text-xs font-bold text-text-primary">Sprint 04 Final Wrap</p>
                                                       <p className="text-[10px] text-text-muted">Deadline: Friday, 5:00 PM</p>
                                                  </div>
                                             </div>
                                             <div className="flex items-center gap-3 opacity-60">
                                                  <div className="w-1 h-10 bg-border-strong rounded-full"></div>
                                                  <div>
                                                       <p className="text-xs font-bold text-text-primary">QA Peer Review</p>
                                                       <p className="text-[10px] text-text-muted">Completed 2d ago</p>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                         </div>
                    </div>
               </main>

               {/* Task Creation Modal */}
               {showTaskModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                         <div className="bg-bg-surface w-full max-w-xl rounded-2xl shadow-2xl border border-border-default overflow-hidden animate-in fade-in zoom-in duration-200">
                              <div className="p-6 border-b border-border-default flex justify-between items-center bg-bg-subtle">
                                   <h2 className="text-headline font-bold text-text-primary">Break Milestone into Tasks</h2>
                                   <button onClick={() => setShowTaskModal(false)} className="text-text-muted hover:text-text-primary">
                                        <Plus className="rotate-45" />
                                   </button>
                              </div>
                              <div className="p-8 space-y-6">
                                   <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Parent Milestone</label>
                                        <select className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none appearance-none">
                                             <option>Database Migration - Phase 2</option>
                                             <option>Frontend Component Library</option>
                                        </select>
                                   </div>
                                   <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Task Description</label>
                                        <input type="text" className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="e.g. Optimize Postgres indices" />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                             <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Assign Developer</label>
                                             <select className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none appearance-none">
                                                  <option>Emily Chen</option>
                                                  <option>David Smith</option>
                                                  <option>James Wilson</option>
                                             </select>
                                        </div>
                                        <div className="space-y-2">
                                             <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Internal Deadline</label>
                                             <input type="date" className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none" />
                                        </div>
                                   </div>
                              </div>
                              <div className="p-6 bg-bg-subtle border-t border-border-default flex justify-end gap-3">
                                   <button onClick={() => setShowTaskModal(false)} className="px-6 py-2 rounded-lg font-medium text-text-body hover:bg-border-default">Cancel</button>
                                   <button className="px-6 py-2 rounded-lg font-medium bg-accent text-text-inverse hover:bg-accent-hover shadow-lg">Assign Task</button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
};

// Internal Components
const NavItem = ({ icon, label, active, onClick }) => (
     <button
          onClick={onClick}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-ui transition-all ${active ? 'bg-accent text-text-inverse shadow-md' : 'text-text-muted hover:bg-bg-subtle hover:text-text-primary'
               }`}
     >
          {icon}
          <span className="font-medium">{label}</span>
     </button>
);

export default App;