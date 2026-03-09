
// app/(dashboard)/project-manager/page.js
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
     UserPlus
} from 'lucide-react';

const App = () => {
     const [activeTab, setActiveTab] = useState('overview');
     const [showCreateModal, setShowCreateModal] = useState(false);


       <button
                                                                      onClick={handleLogout}
                                                                      disabled={isLoading}
                                                                      className={`flex items-center gap-2 px-4 py-2 bg-red-700 text-text-inverse rounded-xl font-medium hover:bg-red-800 transition-all shadow-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                 >
                                                                      <LogOut size={18} />
                                                                      <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                                                                 </button>
     // Mock data for the dashboard
     const projects = [
          { id: 1, name: 'Cloud Migration Phase 2', status: 'In Progress', progress: 65, teamLead: 'Sarah Chen', deadline: '2024-05-15', health: 'On Track' },
          { id: 2, name: 'AI Integration Suite', status: 'Planning', progress: 12, teamLead: 'Marcus Rodriguez', deadline: '2024-06-01', health: 'Delayed' },
          { id: 3, name: 'Q3 Security Audit', status: 'Review', progress: 90, teamLead: 'Alex Kim', deadline: '2024-04-30', health: 'On Track' },
     ];

     return (
          <div className="min-h-screen bg-bg-page text-text-body font-sans flex">
               {/* Sidebar Nav */}
               <aside className="w-64 border-r border-border-default bg-bg-surface flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen">
                    <div className="p-6">
                         <div className="flex items-center gap-2 text-accent font-bold text-xl">
                              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-text-inverse">
                                   <Briefcase size={20} />
                              </div>
                              <span className="tracking-tight text-text-primary">ProManage</span>
                         </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                         <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                         <NavItem icon={<Briefcase size={20} />} label="My Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
                         <NavItem icon={<Users size={20} />} label="Team Leads" active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} />
                         <NavItem icon={<Calendar size={20} />} label="Timelines" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                         <NavItem icon={<FileText size={20} />} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
                    </nav>

                    <div className="p-4 border-t border-border-default">
                         <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-subtle transition-colors cursor-pointer">
                              <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center text-accent font-medium">
                                   JD
                              </div>
                              <div>
                                   <p className="text-sm font-semibold text-text-primary">John Doe</p>
                                   <p className="text-xs text-text-muted">Project Manager</p>
                              </div>
                         </div>
                    </div>
               </aside>

               {/* Main Content */}
               <main className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="h-16 border-b border-border-default bg-bg-surface flex items-center justify-between px-page-x sticky top-0 z-10">
                         <h1 className="text-headline font-bold text-text-primary">Project Manager Panel</h1>
                         <div className="flex items-center gap-4">
                              <button
                                   onClick={() => setShowCreateModal(true)}
                                   className="bg-accent hover:bg-accent-hover text-text-inverse px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                              >
                                   <Plus size={18} />
                                   <span>Create New Project</span>
                              </button>
                         </div>
                    </header>

                    {/* Dashboard Content */}
                    <div className="p-page-y px-page-x space-y-8 overflow-y-auto">

                         {/* Quick Stats */}
                         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <StatCard label="Active Projects" value="12" icon={<Briefcase className="text-accent" />} trend="+2 this month" />
                              <StatCard label="Total Milestones" value="48" icon={<CheckCircle2 className="text-accent-secondary" />} trend="85% completion" />
                              <StatCard label="Pending Approvals" value="07" icon={<MessageSquare className="text-amber-500" />} trend="3 urgent" />
                              <StatCard label="Deadlines Hit" value="94%" icon={<TrendingUp className="text-emerald-500" />} trend="High performance" />
                         </section>

                         {/* Main Grid */}
                         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                              {/* Project List Section */}
                              <div className="xl:col-span-2 space-y-6">
                                   <div className="flex items-center justify-between">
                                        <h2 className="text-subheading font-bold text-text-primary flex items-center gap-2">
                                             Ongoing Projects <span className="text-xs font-normal px-2 py-0.5 bg-accent-muted text-accent rounded-full">{projects.length}</span>
                                        </h2>
                                        <button className="text-ui text-accent font-medium hover:underline">View All</button>
                                   </div>

                                   <div className="space-y-4">
                                        {projects.map((project) => (
                                             <ProjectRow key={project.id} project={project} />
                                        ))}
                                   </div>

                                   {/* Milestones & Timeline Focus */}
                                   <div className="bg-bg-card rounded-xl p-6 border border-border-subtle">
                                        <h3 className="text-ui font-bold text-text-primary mb-4 flex items-center gap-2">
                                             <Clock size={18} className="text-accent" />
                                             Upcoming Milestones
                                        </h3>
                                        <div className="space-y-3">
                                             <MilestoneItem title="UI/UX Prototype Approval" project="AI Integration Suite" date="Apr 24" status="urgent" />
                                             <MilestoneItem title="API Documentation Review" project="Cloud Migration" date="Apr 26" status="normal" />
                                             <MilestoneItem title="Client Feedback Integration" project="Security Audit" date="May 02" status="normal" />
                                        </div>
                                   </div>
                              </div>

                              {/* Side Panel: Actions & Feedback */}
                              <div className="space-y-8">
                                   {/* Assign Team Leads Card */}
                                   <div className="bg-bg-surface rounded-xl p-6 border border-border-default shadow-sm">
                                        <h3 className="text-ui font-bold text-text-primary mb-4 flex items-center gap-2">
                                             <UserPlus size={18} className="text-accent" />
                                             Assign Team Leads
                                        </h3>
                                        <div className="space-y-4">
                                             <p className="text-xs text-text-muted mb-2">Projects waiting for lead assignment:</p>
                                             <div className="p-3 bg-bg-subtle border border-border-subtle rounded-lg flex items-center justify-between">
                                                  <span className="text-sm font-medium">Retail App Redesign</span>
                                                  <button className="text-xs bg-accent text-text-inverse px-3 py-1.5 rounded-md hover:bg-accent-hover transition-colors">Assign</button>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Client Requirements & Docs */}
                                   <div className="bg-bg-surface rounded-xl p-6 border border-border-default shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                             <h3 className="text-ui font-bold text-text-primary flex items-center gap-2">
                                                  <Upload size={18} className="text-accent" />
                                                  Client Documents
                                             </h3>
                                             <button className="p-1 hover:bg-bg-subtle rounded"><Plus size={16} /></button>
                                        </div>
                                        <div className="space-y-3">
                                             <DocItem name="Requirements_V2.pdf" size="2.4 MB" date="2h ago" />
                                             <DocItem name="Brand_Guidelines.zip" size="14.8 MB" date="Yesterday" />
                                             <DocItem name="Contract_Signed.pdf" size="1.1 MB" date="3 days ago" />
                                        </div>
                                   </div>

                                   {/* Recent Client Feedback */}
                                   <div className="bg-bg-surface rounded-xl p-6 border border-border-default shadow-sm">
                                        <h3 className="text-ui font-bold text-text-primary mb-4 flex items-center gap-2">
                                             <MessageSquare size={18} className="text-accent-secondary" />
                                             Recent Feedback
                                        </h3>
                                        <div className="space-y-4">
                                             <div className="border-l-2 border-accent pl-3 py-1">
                                                  <p className="text-xs font-semibold text-text-primary">"The dashboard colors need to be more enterprise-focused."</p>
                                                  <p className="text-[10px] text-text-muted mt-1">— Acme Corp, 4h ago</p>
                                             </div>
                                             <div className="border-l-2 border-emerald-500 pl-3 py-1">
                                                  <p className="text-xs font-semibold text-text-primary text-emerald-600">Approval Received: Milestone 1</p>
                                                  <p className="text-[10px] text-text-muted mt-1">— Global Logistics, Yesterday</p>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                         </div>
                    </div>
               </main>

               {/* Simplified Create Project Modal Overlay */}
               {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                         <div className="bg-bg-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-border-default overflow-hidden animate-in fade-in zoom-in duration-200">
                              <div className="p-6 border-b border-border-default flex justify-between items-center bg-bg-subtle">
                                   <h2 className="text-headline font-bold text-text-primary">Define New Project</h2>
                                   <button onClick={() => setShowCreateModal(false)} className="text-text-muted hover:text-text-primary">
                                        <Plus className="rotate-45" />
                                   </button>
                              </div>
                              <div className="p-8 space-y-6">
                                   <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                             <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Project Name</label>
                                             <input type="text" className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="e.g. Q4 Growth Campaign" />
                                        </div>
                                        <div className="space-y-2">
                                             <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Target Deadline</label>
                                             <input type="date" className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none" />
                                        </div>
                                   </div>
                                   <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Project Scope</label>
                                        <textarea className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg h-24 focus:ring-2 focus:ring-accent outline-none" placeholder="Describe the key deliverables..." />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                             <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Assign Lead</label>
                                             <select className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none appearance-none">
                                                  <option>Select a Team Lead</option>
                                                  <option>Sarah Chen</option>
                                                  <option>Marcus Rodriguez</option>
                                             </select>
                                        </div>
                                        <div className="space-y-2">
                                             <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Priority</label>
                                             <div className="flex gap-2">
                                                  <button className="flex-1 py-3 border border-border-default rounded-lg hover:bg-accent-muted hover:text-accent transition-colors">Low</button>
                                                  <button className="flex-1 py-3 border border-accent bg-accent-muted text-accent rounded-lg font-bold">High</button>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div className="p-6 bg-bg-subtle border-t border-border-default flex justify-end gap-3">
                                   <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 rounded-lg font-medium text-text-body hover:bg-border-default">Cancel</button>
                                   <button className="px-6 py-2 rounded-lg font-medium bg-accent text-text-inverse hover:bg-accent-hover shadow-lg">Launch Project</button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
};

// UI Components
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

const StatCard = ({ label, value, icon, trend }) => (
     <div className="bg-bg-surface border border-border-default p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-bg-subtle rounded-lg">{icon}</div>
               <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
          </div>
          <div className="flex items-baseline gap-2">
               <span className="text-headline-lg font-bold text-text-primary">{value}</span>
               <span className="text-xs text-emerald-500 font-medium">{trend}</span>
          </div>
     </div>
);

const ProjectRow = ({ project }) => (
     <div className="group bg-bg-surface border border-border-default p-4 rounded-xl hover:shadow-md hover:border-accent transition-all cursor-pointer">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                         <h4 className="font-bold text-text-primary group-hover:text-accent transition-colors">{project.name}</h4>
                         <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${project.health === 'On Track' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                              {project.health}
                         </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                         <span className="flex items-center gap-1"><Users size={12} /> {project.teamLead}</span>
                         <span className="flex items-center gap-1"><Calendar size={12} /> {project.deadline}</span>
                    </div>
               </div>

               <div className="w-full md:w-48">
                    <div className="flex justify-between text-[10px] font-bold text-text-muted mb-1 uppercase tracking-tighter">
                         <span>Progress</span>
                         <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-bg-subtle rounded-full overflow-hidden border border-border-subtle">
                         <div
                              className={`h-full transition-all duration-500 rounded-full ${project.health === 'On Track' ? 'bg-accent' : 'bg-amber-500'}`}
                              style={{ width: `${project.progress}%` }}
                         />
                    </div>
               </div>

               <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-bg-subtle rounded-lg text-text-muted hover:text-accent"><AlertCircle size={18} /></button>
                    <button className="p-2 hover:bg-bg-subtle rounded-lg text-text-muted"><MoreVertical size={18} /></button>
                    <ChevronRight size={18} className="text-border-strong group-hover:text-accent" />
               </div>
          </div>
     </div>
);

const MilestoneItem = ({ title, project, date, status }) => (
     <div className="flex items-center justify-between p-3 bg-bg-surface border border-border-subtle rounded-lg">
          <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full ${status === 'urgent' ? 'bg-red-500 animate-pulse' : 'bg-accent'}`} />
               <div>
                    <p className="text-sm font-semibold text-text-primary">{title}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-tight">{project}</p>
               </div>
          </div>
          <span className={`text-xs font-bold ${status === 'urgent' ? 'text-red-600' : 'text-text-muted'}`}>{date}</span>
     </div>
);

const DocItem = ({ name, size, date }) => (
     <div className="flex items-center justify-between text-ui group hover:bg-bg-subtle p-2 rounded-lg transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
               <FileText size={16} className="text-text-muted group-hover:text-accent" />
               <div>
                    <p className="text-sm font-medium text-text-body">{name}</p>
                    <p className="text-[10px] text-text-disabled uppercase">{size} • {date}</p>
               </div>
          </div>
          <button className="text-text-muted hover:text-accent"><MoreVertical size={14} /></button>
     </div>
);

export default App;