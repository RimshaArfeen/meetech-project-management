
// app/(dashboard)/ceo/page.js
"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import for redirection
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
     BarChart3,
     Users,
     Briefcase,
     TrendingUp,
     AlertCircle,
     CheckCircle2,
     Clock,
     ArrowUpRight,
     ArrowDownRight,
     MoreVertical,
     Search,
     Bell,
     Calendar,
     LogOut
} from 'lucide-react';

const MySwal = withReactContent(Swal);

const App = () => {
     const [activeTab, setActiveTab] = useState('Overview');
     const [isLoading, setIsLoading] = useState(false);
     const router = useRouter();

     const handleLogout = async () => {
          // Trigger SweetAlert2 Confirmation
          const result = await MySwal.fire({
               title: <p className="text-red-700 font-bold">Are you sure?</p>,
               text: "You will need to login again to access the Executive Dashboard.",
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

     // const handleLogout = async () => {

     //      try {
     //           setIsLoading(true);
     //           const response = await fetch('/api/auth/logout', {
     //                method: 'POST',
     //           });

     //           if (response.ok) {
     //                // Redirect to login page after successful cookie clearing
     //                router.push('/login');
     //           } else {
     //                console.error('Logout failed');
     //           }
     //      } catch (error) {
     //           console.error('An error occurred during logout:', error);
     //      } finally {
     //           setIsLoading(false);
     //      }
     // };
     // Mock Data
     const stats = [
          { label: 'Total Projects', value: '42', change: '+12%', trend: 'up', icon: Briefcase },
          { label: 'Active Revenue', value: '$1.2M', change: '+8.4%', trend: 'up', icon: TrendingUp },
          { label: 'Avg. Progress', value: '68%', change: '-2%', trend: 'down', icon: BarChart3 },
          { label: 'Client Approvals', value: '18/24', change: 'Steady', trend: 'neutral', icon: CheckCircle2 },
     ];

     const projects = [
          { id: 1, name: 'Cloud Migration X', manager: 'Sarah Chen', progress: 75, status: 'In Progress', revenue: '$240k', risk: 'Low' },
          { id: 2, name: 'Fintech Mobile App', manager: 'Michael Ross', progress: 32, status: 'Delayed', revenue: '$500k', risk: 'High' },
          { id: 3, name: 'Security Audit v2', manager: 'Elena Rodriguez', progress: 95, status: 'Review', revenue: '$85k', risk: 'Low' },
          { id: 4, name: 'E-commerce Redesign', manager: 'David Kim', progress: 60, status: 'In Progress', revenue: '$120k', risk: 'Medium' },
     ];

     const managers = [
          { name: 'Sarah Chen', performance: 98, workload: 85, active: 4 },
          { name: 'Michael Ross', performance: 72, workload: 95, active: 6 },
          { name: 'Elena Rodriguez', performance: 94, workload: 60, active: 3 },
     ];

     return (
          <div className="min-h-screen bg-bg-page text-text-body selection:bg-accent-muted selection:text-accent font-sans">
               {/* Sidebar Navigation */}
               <aside className="fixed left-0 top-0 h-full w-64 border-r border-border-default bg-bg-surface hidden lg:flex flex-col z-20">
                    <div className="p-6">
                         <div className="flex items-center gap-2 mb-8">
                              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                   <span className="text-text-inverse font-bold text-xl">P</span>
                              </div>
                              <span className="text-xl font-bold text-text-primary tracking-tight">ProManager</span>
                         </div>

                         <nav className="space-y-1">
                              {['Overview', 'Projects', 'Resources', 'Financials', 'Settings'].map((item) => (
                                   <button
                                        key={item}
                                        onClick={() => setActiveTab(item)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-ui font-medium ${activeTab === item
                                             ? 'bg-accent-muted text-accent'
                                             : 'text-text-muted hover:bg-bg-subtle hover:text-text-primary'
                                             }`}
                                   >
                                        {item === 'Overview' && <BarChart3 size={18} />}
                                        {item === 'Projects' && <Briefcase size={18} />}
                                        {item === 'Resources' && <Users size={18} />}
                                        {item === 'Financials' && <TrendingUp size={18} />}
                                        {item === 'Settings' && <MoreVertical size={18} />}
                                        {item}
                                   </button>
                              ))}
                         </nav>
                    </div>

                    <div className="mt-auto p-6 border-t border-border-default">
                         <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center border border-accent/20">
                                   <Users size={20} className="text-accent" />
                              </div>
                              <div>
                                   <p className="text-ui font-bold text-text-primary">Marcus Aurelius</p>
                                   <p className="text-caption text-text-muted leading-none">CEO & Founder</p>
                              </div>
                         </div>
                    </div>
               </aside>

               {/* Main Content Area */}
               <main className="lg:ml-64 p-page-x pb-32 md:py-page-y">
                    {/* Top Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                         <div>
                              <h1 className="text-4xl font-bold text-text-primary tracking-tight">Executive Dashboard</h1>
                              <p className="text-text-muted">Welcome back, Marcus. Here's a summary of your organization's health.</p>
                         </div>
                         <div className="flex items-center gap-3">
                              <div className="relative">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
                                   <input
                                        type="text"
                                        placeholder="Search projects..."
                                        className="pl-10 pr-4 py-2 bg-bg-subtle border border-border-default rounded-xl focus:ring-2 focus:ring-accent outline-none w-full md:w-64 transition-all"
                                   />
                              </div>
                              <button className="p-2.5 bg-bg-subtle border border-border-default rounded-xl hover:bg-border-subtle transition-colors text-text-body relative">
                                   <Bell size={20} />
                                   <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-bg-page"></span>
                              </button>
                              {/* <button className="flex items-center gap-2 px-4 py-2 bg-accent text-text-inverse rounded-xl font-medium hover:bg-accent-hover active:bg-accent-active transition-all shadow-sm">
                                   <Calendar size={18} />
                                   <span>Q3 Report</span>
                              </button> */}
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

                    {/* High Level Stats Grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                         {stats.map((stat, i) => (
                              <div key={i} className="bg-bg-card p-6 rounded-2xl border border-border-subtle hover:border-accent/30 transition-all group">
                                   <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-bg-surface rounded-xl group-hover:bg-accent-muted transition-colors">
                                             <stat.icon className="text-accent" size={24} />
                                        </div>
                                        <div className={`flex items-center gap-1 text-caption font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-accent-secondary/10 text-accent-secondary' :
                                             stat.trend === 'down' ? 'bg-red-500/10 text-red-700' : 'bg-text-muted/10 text-text-muted'
                                             }`}>
                                             {stat.trend === 'up' ? <ArrowUpRight size={14} /> : stat.trend === 'down' ? <ArrowDownRight size={14} /> : null}
                                             {stat.change}
                                        </div>
                                   </div>
                                   <p className="text-text-muted text-ui font-medium">{stat.label}</p>
                                   <h3 className="text-4xl font-bold text-text-primary">{stat.value}</h3>
                              </div>
                         ))}
                    </section>

                    {/* Dashboard Core Modules */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                         {/* Main Project Overview Table */}
                         <div className="xl:col-span-2 space-y-8">
                              <div className="bg-bg-surface rounded-2xl border border-border-default overflow-hidden shadow-sm">
                                   <div className="p-6 border-b border-border-default flex items-center justify-between">
                                        <h3 className="text-subheading font-bold text-text-primary">High-Priority Project Pipeline</h3>
                                        <button className="text-accent text-ui font-medium hover:underline">View all projects</button>
                                   </div>
                                   <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                             <thead>
                                                  <tr className="bg-bg-subtle text-text-muted text-caption uppercase tracking-wider font-bold">
                                                       <th className="px-6 py-4">Project</th>
                                                       <th className="px-6 py-4">Owner</th>
                                                       <th className="px-6 py-4">Progress</th>
                                                       <th className="px-6 py-4">Status</th>
                                                       <th className="px-6 py-4 text-right">Risk</th>
                                                  </tr>
                                             </thead>
                                             <tbody className="divide-y divide-border-default">
                                                  {projects.map((proj) => (
                                                       <tr key={proj.id} className="hover:bg-bg-subtle/50 transition-colors group">
                                                            <td className="px-6 py-4">
                                                                 <div>
                                                                      <p className="text-ui font-bold text-text-primary group-hover:text-accent transition-colors">{proj.name}</p>
                                                                      <p className="text-caption text-text-muted">{proj.revenue} Pipeline</p>
                                                                 </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-ui text-text-body">{proj.manager}</td>
                                                            <td className="px-6 py-4">
                                                                 <div className="w-32">
                                                                      <div className="flex items-center justify-between mb-1">
                                                                           <span className="text-caption font-bold text-text-primary">{proj.progress}%</span>
                                                                      </div>
                                                                      <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
                                                                           <div
                                                                                className={`h-full transition-all duration-1000 ${proj.status === 'Delayed' ? 'bg-red-800' : 'bg-accent'
                                                                                     }`}
                                                                                style={{ width: `${proj.progress}%` }}
                                                                           ></div>
                                                                      </div>
                                                                 </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                 <span className={`px-3 py-1 rounded-full text-sm font-medium border ${proj.status === 'Delayed' ? 'bg-red-50/10 border-red-200 text-red-600' :
                                                                      proj.status === 'Review' ? 'bg-accent-secondary/10 border-accent-secondary/20 text-accent-secondary' :
                                                                           'bg-accent-muted border-accent/20 text-accent'
                                                                      }`}>
                                                                      {proj.status}
                                                                 </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                 <div className="flex items-center justify-end gap-2">
                                                                      {proj.risk === 'High' && <AlertCircle size={16} className="text-red-500" />}
                                                                      <span className={`text-ui font-medium ${proj.risk === 'High' ? 'text-red-600 font-bold' :
                                                                           proj.risk === 'Medium' ? 'text-orange-500' : 'text-text-muted'
                                                                           }`}>
                                                                           {proj.risk}
                                                                      </span>
                                                                 </div>
                                                            </td>
                                                       </tr>
                                                  ))}
                                             </tbody>
                                        </table>
                                   </div>
                              </div>

                              {/* Performance Metrics per PM */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-sm">
                                        <h3 className="text-subheading font-bold text-text-primary mb-6">Manager Performance</h3>
                                        <div className="space-y-6">
                                             {managers.map((mgr, i) => (
                                                  <div key={i} className="flex items-center gap-4">
                                                       <div className="w-10 h-10 rounded-full bg-accent text-text-inverse flex items-center justify-center font-bold">
                                                            {mgr.name.charAt(0)}
                                                       </div>
                                                       <div className="flex-1">
                                                            <div className="flex justify-between mb-1">
                                                                 <span className="text-ui font-bold text-text-primary">{mgr.name}</span>
                                                                 <span className="text-ui font-bold text-accent">{mgr.performance}% Score</span>
                                                            </div>
                                                            <div className="h-2 w-full bg-border-subtle rounded-full overflow-hidden">
                                                                 <div className="h-full bg-accent" style={{ width: `${mgr.performance}%` }}></div>
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Workload Heatmap Placeholder */}
                                   <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-sm">
                                        <h3 className="text-subheading font-bold text-text-primary mb-2">Developer Workload</h3>
                                        <p className="text-caption text-text-muted mb-6">Organization-wide resource allocation</p>
                                        <div className="flex flex-col gap-4">
                                             <div className="flex items-center justify-between text-ui">
                                                  <span className="text-text-muted">Total Available Capacity</span>
                                                  <span className="font-bold text-text-primary">820 Hrs/wk</span>
                                             </div>
                                             <div className="flex items-center justify-between text-ui">
                                                  <span className="text-text-muted">Currently Assigned</span>
                                                  <span className="font-bold text-accent">695 Hrs/wk</span>
                                             </div>
                                             <div className="flex items-center gap-1 h-8 rounded-lg overflow-hidden mt-2">
                                                  <div className="h-full bg-accent" style={{ width: '60%' }} title="Development"></div>
                                                  <div className="h-full bg-accent-secondary" style={{ width: '25%' }} title="Design"></div>
                                                  <div className="h-full bg-border-strong" style={{ width: '15%' }} title="Overhead"></div>
                                             </div>
                                             <div className="flex items-center gap-4 mt-2">
                                                  <div className="flex items-center gap-2 text-caption font-medium">
                                                       <div className="w-2 h-2 rounded-full bg-accent"></div> Dev
                                                  </div>
                                                  <div className="flex items-center gap-2 text-caption font-medium">
                                                       <div className="w-2 h-2 rounded-full bg-accent-secondary"></div> Design
                                                  </div>
                                                  <div className="flex items-center gap-2 text-caption font-medium">
                                                       <div className="w-2 h-2 rounded-full bg-border-strong"></div> Buffer
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Right Column: Alerts and Quick Stats */}
                         <aside className="space-y-6">
                              <div className="bg-red-700 p-6 rounded-2xl text-text-inverse shadow-lg shadow-red-500/20">
                                   <div className="flex items-center gap-2 mb-4">
                                        <AlertCircle size={20} />
                                        <span className="font-bold tracking-tight">Critical Alerts</span>
                                   </div>
                                   <div className="space-y-4">
                                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                             <p className="text-ui font-bold">Fintech App Delayed</p>
                                             <p className="text-caption opacity-90 mb-2">Security review blocked. 2 days overdue.</p>
                                             <button className="text-caption font-bold underline">Escalate to Michael</button>
                                        </div>
                                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                             <p className="text-ui font-bold">Budget Threshold</p>
                                             <p className="text-caption opacity-90">Cloud Migration X has reached 90% of allocated Q3 budget.</p>
                                        </div>
                                   </div>
                              </div>

                              <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-sm">
                                   <h3 className="text-subheading font-bold text-text-primary mb-4">Approval Status</h3>
                                   <div className="space-y-4">
                                        {[
                                             { label: 'Client Feedback Pending', count: 12, color: 'bg-accent' },
                                             { label: 'Awaiting CEO Sign-off', count: 4, color: 'bg-accent-secondary' },
                                             { label: 'PM Resource Requests', count: 8, color: 'bg-orange-500' }
                                        ].map((item, i) => (
                                             <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-subtle hover:bg-border-subtle transition-colors cursor-pointer">
                                                  <div className="flex items-center gap-3">
                                                       <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                                       <span className="text-ui font-medium text-text-body">{item.label}</span>
                                                  </div>
                                                  <span className="font-bold text-text-primary">{item.count}</span>
                                             </div>
                                        ))}
                                   </div>
                                   <button className="w-full mt-6 py-2 border border-border-strong rounded-xl text-ui font-bold hover:bg-bg-subtle transition-all">
                                        Review Approval Queue
                                   </button>
                              </div>

                              <div className="bg-bg-card p-6 rounded-2xl border border-border-subtle relative overflow-hidden group">
                                   <div className="relative z-10">
                                        <h4 className="text-ui font-bold text-text-primary mb-1">Strategic AI Insight</h4>
                                        <p className="text-caption text-text-body leading-relaxed">
                                             Based on current velocity, Sarah Chen's team is likely to finish <span className="text-accent font-bold">"Cloud Migration"</span> 4 days ahead of schedule. Consider reassigning assets to <span className="text-red-600 font-bold">"Fintech App"</span>.
                                        </p>
                                   </div>
                                   <div className="absolute -bottom-4 -right-4 text-accent/5 transition-transform group-hover:scale-110">
                                        <TrendingUp size={100} />
                                   </div>
                              </div>
                         </aside>
                    </div>
               </main>
          </div>
     );
};

export default App;