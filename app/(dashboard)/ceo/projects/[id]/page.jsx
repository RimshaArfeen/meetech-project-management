'use client';
import React, { useState, useEffect } from 'react';
import {
     ArrowLeft,
     Target,
     TrendingUp,
     AlertTriangle,
     CheckCircle2,
     Clock,
     Briefcase,
     Zap,
     DollarSign,
     Users,
     MessageSquare,
     FileText,
     Calendar,
     Download,
     Share2,
     MoreVertical,
     Shield,
     Flag,
     BarChart3,
     RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useCEOProjects } from '../../../../../hooks/useCEOProjects';
import { useRouter } from 'next/navigation';

export default function CEOSingleProjectView({ params }) {
     const router = useRouter();
     const unwrappedParams = React.use(params);
     const projectId = unwrappedParams?.id;

     const { getProjectDetails } = useCEOProjects();
     const [project, setProject] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [activeTab, setActiveTab] = useState('overview');

     useEffect(() => {
          if (projectId) {
               loadProject();
          } else {
               setError('Invalid project ID');
               setLoading(false);
          }
     }, [projectId]);

     const loadProject = async () => {
          try {
               setLoading(true);
               setError(null);

               console.log('Loading project with ID:', projectId);
               const data = await getProjectDetails(projectId);

               if (data) {
                    console.log('Project data loaded:', data.name);
                    setProject(data);
               } else {
                    setError('Project not found');
               }
          } catch (err) {
               console.error('Error loading project:', err);
               setError(err.message || 'Failed to load project details');
          } finally {
               setLoading(false);
          }
     };

     const handleRetry = () => {
          loadProject();
     };

     const getRiskColor = (riskLevel) => {
          switch (riskLevel) {
               case 'HIGH': return 'bg-red-500/10 text-red-600 border-red-500/20';
               case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
               case 'LOW': return 'bg-green-500/10 text-green-600 border-green-500/20';
               default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
          }
     };

     const getStatusColor = (status) => {
          switch (status) {
               case 'ACTIVE': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
               case 'IN_DEVELOPMENT': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
               case 'CLIENT_REVIEW': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
               case 'COMPLETED': return 'bg-green-500/10 text-green-600 border-green-500/20';
               case 'UPCOMING': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
               case 'ON_HOLD': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
               default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
          }
     };

     if (loading) {
          return (
               <div className="min-h-screen bg-bg-page flex items-center justify-center">
                    <div className="text-center">
                         <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                         <p className="text-text-muted">Loading project insights...</p>
                    </div>
               </div>
          );
     }

     if (error || !project) {
          return (
               <div className="min-h-screen bg-bg-page p-page-x py-page-y flex items-center justify-center">
                    <div className="text-center max-w-md">
                         <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                         <h2 className="text-xl font-bold text-text-primary mb-2">Project Not Found</h2>
                         <p className="text-text-muted mb-6">{error || 'The project you\'re looking for doesn\'t exist.'}</p>
                         <div className="flex gap-3 justify-center">
                              <button
                                   onClick={() => router.push('/ceo/projects')}
                                   className="bg-accent text-text-inverse px-6 py-3 rounded-xl font-bold hover:bg-accent-hover transition-all"
                              >
                                   Back to Portfolio
                              </button>
                              <button
                                   onClick={handleRetry}
                                   className="px-6 py-3 border border-border-default rounded-xl font-bold text-text-primary hover:bg-bg-subtle transition-all flex items-center gap-2"
                              >
                                   <RefreshCw size={16} />
                                   Retry
                              </button>
                         </div>
                    </div>
               </div>
          );
     }
     
     return (
          <div className="min-h-screen bg-bg-page p-page-x py-page-y">
               {/* Top Navigation & Breadcrumbs */}
               <nav className="mb-8 flex items-center justify-between">
                    <Link href="/ceo/projects" className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors font-bold text-ui">
                         <ArrowLeft size={16} /> Back to Portfolio
                    </Link>
                    <div className="flex items-center gap-2">
                         <button className="p-2 hover:bg-bg-surface rounded-lg text-text-muted hover:text-accent">
                              <Share2 size={18} />
                         </button>
                         <button className="p-2 hover:bg-bg-surface rounded-lg text-text-muted hover:text-accent">
                              <Download size={18} />
                         </button>
                         <button className="p-2 hover:bg-bg-surface rounded-lg text-text-muted hover:text-accent">
                              <MoreVertical size={18} />
                         </button>
                    </div>
               </nav>

               {/* Hero Section: Executive Summary */}
               <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2">
                         <div className="flex items-center gap-3 mb-4 flex-wrap">
                              <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">
                                   Project ID: {project.id.slice(-8)}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(project.status)}`}>
                                   {project.status.replace('_', ' ')}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRiskColor(project.riskLevel)}`}>
                                   {project.riskLevel} RISK
                              </span>
                              {project.priority === 'CRITICAL' && (
                                   <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 uppercase tracking-widest">
                                        <Zap size={12} /> Critical Priority
                                   </span>
                              )}
                         </div>
                         <h1 className="text-headline-xl font-bold text-text-primary leading-tight">
                              {project.name}
                         </h1>
                         <p className="text-subheading text-text-muted mt-4 max-w-2xl leading-relaxed">
                              {project.description || 'No description provided.'}
                         </p>
                         <div className="flex items-center gap-6 mt-6 text-sm text-text-muted">
                              <div className="flex items-center gap-2">
                                   <Calendar size={16} />
                                   <span>Started: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not started'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                   <Clock size={16} />
                                   <span className={project.timelineMetrics?.isOverdue ? 'text-red-500' : ''}>
                                        Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                                        {project.timelineMetrics?.daysRemaining > 0 && !project.timelineMetrics?.isOverdue && (
                                             <span className="ml-2 text-xs text-green-500">
                                                  ({project.timelineMetrics.daysRemaining} days left)
                                             </span>
                                        )}
                                        {project.timelineMetrics?.isOverdue && (
                                             <span className="ml-2 text-xs text-red-500">
                                                  ({project.timelineMetrics.delayDays} days overdue)
                                             </span>
                                        )}
                                   </span>
                              </div>
                         </div>
                    </div>

                    {/* CEO Quick Actions & Health */}
                    <div className="bg-gradient-to-br from-accent to-accent-active rounded-3xl p-6 text-white shadow-xl">
                         <div className="relative w-32 h-32 mx-auto mb-4">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                   <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="3"
                                   />
                                   <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="3"
                                        strokeDasharray={100.5}
                                        strokeDashoffset={100.5 - (100.5 * project.progress) / 100}
                                        strokeLinecap="round"
                                   />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                   <span className="text-headline-lg font-black">{project.progress}%</span>
                                   <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Complete</span>
                              </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                              <div className="text-center">
                                   <p className="text-[10px] font-bold uppercase opacity-80">Budget</p>
                                   <p className="text-lg font-bold">${(project.financialMetrics?.budget / 1000).toFixed(1)}k</p>
                              </div>
                              <div className="text-center">
                                   <p className="text-[10px] font-bold uppercase opacity-80">Cost</p>
                                   <p className="text-lg font-bold">${(project.financialMetrics?.cost / 1000).toFixed(1)}k</p>
                              </div>
                         </div>
                         <button className="w-full mt-6 py-3 bg-white text-accent rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                              <Download size={16} />
                              Download Executive Report
                         </button>
                    </div>
               </section>

               {/* Tabs Navigation */}
               <div className="flex border-b border-border-default mb-8">
                    <button
                         onClick={() => setActiveTab('overview')}
                         className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === 'overview'
                                   ? 'text-accent'
                                   : 'text-text-muted hover:text-text-primary'
                              }`}
                    >
                         Strategic Overview
                         {activeTab === 'overview' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                         )}
                    </button>
                    <button
                         onClick={() => setActiveTab('milestones')}
                         className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === 'milestones'
                                   ? 'text-accent'
                                   : 'text-text-muted hover:text-text-primary'
                              }`}
                    >
                         Milestones & Timeline
                         {activeTab === 'milestones' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                         )}
                    </button>
                    <button
                         onClick={() => setActiveTab('team')}
                         className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === 'team'
                                   ? 'text-accent'
                                   : 'text-text-muted hover:text-text-primary'
                              }`}
                    >
                         Team Workload
                         {activeTab === 'team' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                         )}
                    </button>
                    <button
                         onClick={() => setActiveTab('client')}
                         className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === 'client'
                                   ? 'text-accent'
                                   : 'text-text-muted hover:text-text-primary'
                              }`}
                    >
                         Client Feedback
                         {activeTab === 'client' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                         )}
                    </button>
               </div>

               {/* Tab Content */}
               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column - Main Content (2 columns) */}
                    <div className="xl:col-span-2 space-y-6">
                         {activeTab === 'overview' && (
                              <>
                                   {/* Financial Performance */}
                                   <div className="bg-bg-surface border border-border-default rounded-2xl p-6">
                                        <h2 className="text-headline font-bold text-text-primary flex items-center gap-2 mb-6">
                                             <DollarSign className="text-accent" size={20} />
                                             Financial Performance
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                             <div>
                                                  <p className="text-xs text-text-muted mb-1">Budget</p>
                                                  <p className="text-2xl font-bold text-text-primary">
                                                       ${(project.financialMetrics?.budget / 1000).toFixed(1)}k
                                                  </p>
                                             </div>
                                             <div>
                                                  <p className="text-xs text-text-muted mb-1">Actual Cost</p>
                                                  <p className={`text-2xl font-bold ${project.financialMetrics?.cost > project.financialMetrics?.budget
                                                            ? 'text-red-500'
                                                            : 'text-text-primary'
                                                       }`}>
                                                       ${(project.financialMetrics?.cost / 1000).toFixed(1)}k
                                                  </p>
                                             </div>
                                             <div>
                                                  <p className="text-xs text-text-muted mb-1">Variance</p>
                                                  <p className={`text-2xl font-bold ${project.financialMetrics?.variance >= 0
                                                            ? 'text-green-500'
                                                            : 'text-red-500'
                                                       }`}>
                                                       ${(Math.abs(project.financialMetrics?.variance) / 1000).toFixed(1)}k
                                                       {project.financialMetrics?.variance >= 0 ? ' under' : ' over'}
                                                  </p>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Project Metrics */}
                                   <div className="bg-bg-surface border border-border-default rounded-2xl p-6">
                                        <h2 className="text-headline font-bold text-text-primary flex items-center gap-2 mb-6">
                                             <BarChart3 className="text-accent" size={20} />
                                             Key Metrics
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                             <div className="p-4 bg-bg-subtle rounded-xl text-center">
                                                  <p className="text-2xl font-bold text-accent">{project.tasks?.length || 0}</p>
                                                  <p className="text-xs text-text-muted">Total Tasks</p>
                                             </div>
                                             <div className="p-4 bg-bg-subtle rounded-xl text-center">
                                                  <p className="text-2xl font-bold text-green-500">
                                                       {project.tasks?.filter(t => t.status === 'COMPLETED').length || 0}
                                                  </p>
                                                  <p className="text-xs text-text-muted">Completed</p>
                                             </div>
                                             <div className="p-4 bg-bg-subtle rounded-xl text-center">
                                                  <p className="text-2xl font-bold text-yellow-500">
                                                       {project.tasks?.filter(t => t.status === 'REVIEW').length || 0}
                                                  </p>
                                                  <p className="text-xs text-text-muted">In Review</p>
                                             </div>
                                             <div className="p-4 bg-bg-subtle rounded-xl text-center">
                                                  <p className="text-2xl font-bold text-red-500">
                                                       {project.tasks?.filter(t => t.status === 'BLOCKED').length || 0}
                                                  </p>
                                                  <p className="text-xs text-text-muted">Blocked</p>
                                             </div>
                                        </div>
                                   </div>
                              </>
                         )}

                         {activeTab === 'milestones' && (
                              <div className="space-y-4">
                                   {project.milestoneProgress?.map((milestone) => (
                                        <div
                                             key={milestone.id}
                                             className="bg-bg-surface border border-border-default rounded-2xl p-5 hover:border-accent/50 transition-all"
                                        >
                                             <div className="flex items-start gap-4">
                                                  <div className={`mt-1 p-2 rounded-lg ${milestone.status === 'COMPLETED'
                                                            ? 'bg-green-500/10 text-green-500'
                                                            : milestone.status === 'DELAYED'
                                                                 ? 'bg-red-500/10 text-red-500'
                                                                 : 'bg-accent/10 text-accent'
                                                       }`}>
                                                       {milestone.status === 'COMPLETED' ? (
                                                            <CheckCircle2 size={20} />
                                                       ) : milestone.status === 'DELAYED' ? (
                                                            <Clock size={20} />
                                                       ) : (
                                                            <Target size={20} />
                                                       )}
                                                  </div>
                                                  <div className="flex-1">
                                                       <div className="flex justify-between items-start">
                                                            <div>
                                                                 <h4 className="font-bold text-text-primary">{milestone.name}</h4>
                                                                 <p className="text-sm text-text-muted mt-1">{milestone.description}</p>
                                                            </div>
                                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${milestone.status === 'COMPLETED'
                                                                      ? 'bg-green-500/10 text-green-500'
                                                                      : milestone.status === 'DELAYED'
                                                                           ? 'bg-red-500/10 text-red-500'
                                                                           : 'bg-accent/10 text-accent'
                                                                 }`}>
                                                                 {milestone.status}
                                                            </span>
                                                       </div>
                                                       <div className="mt-4">
                                                            <div className="flex justify-between text-xs mb-1">
                                                                 <span className="text-text-muted">Progress</span>
                                                                 <span className="font-bold">{milestone.taskProgress?.toFixed(0)}%</span>
                                                            </div>
                                                            <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden">
                                                                 <div
                                                                      className={`h-full transition-all duration-700 ${milestone.status === 'DELAYED' ? 'bg-red-500' : 'bg-accent'
                                                                           }`}
                                                                      style={{ width: `${milestone.taskProgress || 0}%` }}
                                                                 />
                                                            </div>
                                                       </div>
                                                       <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                                                            <span>Tasks: {milestone.completedTasks || 0}/{milestone.totalTasks || 0}</span>
                                                            {milestone.deadline && (
                                                                 <span className="flex items-center gap-1">
                                                                      <Clock size={12} />
                                                                      Target: {new Date(milestone.deadline).toLocaleDateString()}
                                                                 </span>
                                                            )}
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         )}

                         {activeTab === 'team' && (
                              <div className="space-y-6">
                                   <div className="bg-bg-surface border border-border-default rounded-2xl p-6">
                                        <h2 className="text-headline font-bold text-text-primary flex items-center gap-2 mb-6">
                                             <Users className="text-accent" size={20} />
                                             Team Workload Distribution
                                        </h2>
                                        <div className="space-y-6">
                                             {project.workload?.map((dev) => (
                                                  <div key={dev.id}>
                                                       <div className="flex justify-between items-end mb-2">
                                                            <div className="flex items-center gap-3">
                                                                 <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center font-bold text-accent overflow-hidden">
                                                                      {dev.avatar ? (
                                                                           <img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover" />
                                                                      ) : (
                                                                           dev.name[0]
                                                                      )}
                                                                 </div>
                                                                 <div>
                                                                      <p className="text-ui font-bold text-text-primary">{dev.name}</p>
                                                                      <p className="text-[10px] text-text-muted uppercase font-bold">{dev.role}</p>
                                                                 </div>
                                                            </div>
                                                            <div className="text-right">
                                                                 <p className={`text-ui font-black ${dev.totalTasks > 15 ? 'text-red-500' : 'text-text-primary'}`}>
                                                                      {Math.round((dev.totalTasks / 20) * 100)}%
                                                                 </p>
                                                                 <p className="text-[10px] text-text-muted font-bold">{dev.totalTasks} Active Tasks</p>
                                                            </div>
                                                       </div>
                                                       <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden">
                                                            <div
                                                                 className={`h-full transition-all duration-700 ${dev.totalTasks > 15 ? 'bg-red-500' : 'bg-accent-secondary'
                                                                      }`}
                                                                 style={{ width: `${Math.min((dev.totalTasks / 20) * 100, 100)}%` }}
                                                            />
                                                       </div>
                                                       <div className="flex gap-4 mt-2 text-xs">
                                                            <span className="text-green-600">✓ {dev.completedTasks}</span>
                                                            <span className="text-accent">● {dev.inProgressTasks}</span>
                                                            <span className="text-yellow-600">▲ {dev.reviewTasks}</span>
                                                            <span className="text-red-600">⚠ {dev.blockedTasks}</span>
                                                            {dev.highPriorityTasks > 0 && (
                                                                 <span className="text-orange-600 font-bold">
                                                                      🔥 {dev.highPriorityTasks} high
                                                                 </span>
                                                            )}
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   {/* CEO Insight Alert */}
                                   {project.workload?.some(dev => dev.totalTasks > 15) && (
                                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3">
                                             <AlertTriangle className="text-red-500 shrink-0" size={18} />
                                             <p className="text-[11px] text-red-700 leading-tight">
                                                  <strong>CEO Insight:</strong>{' '}
                                                  {project.workload
                                                       .filter(dev => dev.totalTasks > 15)
                                                       .map(dev => dev.name)
                                                       .join(', ')} {project.workload.filter(dev => dev.totalTasks > 15).length > 1 ? 'are' : 'is'} at critical capacity.
                                                  Consider reassigning tasks to prevent delivery delays.
                                             </p>
                                        </div>
                                   )}
                              </div>
                         )}

                         {activeTab === 'client' && (
                              <div className="space-y-6">
                                   <div className="bg-bg-surface border border-border-default rounded-2xl p-6">
                                        <h2 className="text-headline font-bold text-text-primary flex items-center gap-2 mb-6">
                                             <MessageSquare className="text-accent" size={20} />
                                             Client Feedback History
                                        </h2>
                                        <div className="space-y-4">
                                             {project.feedbacks?.length > 0 ? (
                                                  project.feedbacks.map((feedback) => (
                                                       <div
                                                            key={feedback.id}
                                                            className="p-4 bg-bg-subtle border border-border-default rounded-xl"
                                                       >
                                                            <div className="flex justify-between items-start mb-2">
                                                                 <div>
                                                                      <p className="text-sm font-bold text-text-primary">{feedback.stage}</p>
                                                                      <p className="text-xs text-text-muted">
                                                                           {new Date(feedback.createdAt).toLocaleDateString()} • by {feedback.createdBy?.name}
                                                                      </p>
                                                                 </div>
                                                                 <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${feedback.isApproved
                                                                           ? 'bg-green-500/10 text-green-600'
                                                                           : feedback.status === 'REJECTED'
                                                                                ? 'bg-red-500/10 text-red-600'
                                                                                : 'bg-yellow-500/10 text-yellow-600'
                                                                      }`}>
                                                                      {feedback.status}
                                                                 </span>
                                                            </div>
                                                            <p className="text-sm text-text-body mt-2">"{feedback.content}"</p>
                                                            {feedback.rating && (
                                                                 <div className="flex items-center gap-1 mt-2">
                                                                      {[...Array(5)].map((_, i) => (
                                                                           <span
                                                                                key={i}
                                                                                className={i < feedback.rating ? 'text-yellow-500' : 'text-gray-300'}
                                                                           >
                                                                                ★
                                                                           </span>
                                                                      ))}
                                                                 </div>
                                                            )}
                                                       </div>
                                                  ))
                                             ) : (
                                                  <p className="text-center py-8 text-text-muted">No feedback recorded yet</p>
                                             )}
                                        </div>
                                   </div>

                                   {/* Client Approval Status */}
                                   <div className="bg-bg-surface border border-border-default rounded-2xl p-6">
                                        <h2 className="text-headline font-bold text-text-primary flex items-center gap-2 mb-6">
                                             <Flag className="text-accent" size={20} />
                                             Approval Status
                                        </h2>
                                        <div className="grid grid-cols-2 gap-4">
                                             <div className="p-4 bg-bg-subtle rounded-xl text-center">
                                                  <p className="text-3xl font-bold text-accent">{project.clientStatus?.feedbackCount || 0}</p>
                                                  <p className="text-xs text-text-muted">Total Feedback</p>
                                             </div>
                                             <div className="p-4 bg-bg-subtle rounded-xl text-center">
                                                  <p className="text-3xl font-bold text-green-500">{project.clientStatus?.approvedCount || 0}</p>
                                                  <p className="text-xs text-text-muted">Approved</p>
                                             </div>
                                        </div>
                                        {project.clientStatus?.latestApproval && (
                                             <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                                                  <p className="text-sm text-green-600 flex items-center gap-2">
                                                       <CheckCircle2 size={16} />
                                                       Latest feedback was approved
                                                  </p>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         )}
                    </div>

                    {/* Right Column - Sidebar (1 column) */}
                    <div className="space-y-6">
                         {/* Key Personnel */}
                         <div className="bg-bg-surface border border-border-default rounded-2xl p-6">
                              <h3 className="text-ui font-bold text-text-primary mb-4">Key Personnel</h3>
                              <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                                             {project.manager?.name?.[0]}
                                        </div>
                                        <div>
                                             <p className="text-sm font-bold text-text-primary">Project Manager</p>
                                             <p className="text-xs text-text-muted">{project.manager?.name}</p>
                                             <p className="text-[10px] text-text-disabled">{project.manager?.email}</p>
                                        </div>
                                   </div>
                                   {project.teamLead && (
                                        <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-full bg-accent-secondary flex items-center justify-center text-white font-bold">
                                                  {project.teamLead.name?.[0]}
                                             </div>
                                             <div>
                                                  <p className="text-sm font-bold text-text-primary">Team Lead</p>
                                                  <p className="text-xs text-text-muted">{project.teamLead.name}</p>
                                                  <p className="text-[10px] text-text-disabled">{project.teamLead.email}</p>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         </div>

                         {/* Client Information */}
                         <div className="bg-bg-surface border border-border-default rounded-2xl p-6">
                              <h3 className="text-ui font-bold text-text-primary mb-4">Client Information</h3>
                              <div className="space-y-3">
                                   <p className="text-sm font-bold text-text-primary">{project.clientName}</p>
                                   <p className="text-xs text-text-muted">{project.clientCompany || 'No company'}</p>
                                   <p className="text-xs text-text-muted">{project.clientEmail}</p>
                                   <p className="text-xs text-text-muted">{project.clientPhone || 'No phone'}</p>
                              </div>
                         </div>

                         {/* Key Documents */}
                         <div className="bg-bg-surface border border-border-default rounded-2xl p-6">
                              <h3 className="text-ui font-bold text-text-primary mb-4">Key Documents</h3>
                              <div className="space-y-3">
                                   {project.documents?.slice(0, 3).map(doc => (
                                        <a
                                             key={doc.id}
                                             href={doc.url}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="flex items-center gap-3 p-2 hover:bg-bg-subtle rounded-lg transition-colors"
                                        >
                                             <FileText size={16} className="text-accent" />
                                             <div className="flex-1">
                                                  <p className="text-xs font-medium text-text-primary">{doc.name}</p>
                                                  <p className="text-[10px] text-text-muted">
                                                       {new Date(doc.uploadedAt).toLocaleDateString()}
                                                  </p>
                                             </div>
                                        </a>
                                   ))}
                                   {(!project.documents || project.documents.length === 0) && (
                                        <p className="text-xs text-text-muted text-center py-2">No documents</p>
                                   )}
                              </div>
                         </div>

                         {/* Risk Assessment */}
                         <div className={`p-6 rounded-2xl border ${project.riskLevel === 'HIGH'
                                   ? 'bg-red-500/5 border-red-500/20'
                                   : project.riskLevel === 'MEDIUM'
                                        ? 'bg-yellow-500/5 border-yellow-500/20'
                                        : 'bg-green-500/5 border-green-500/20'
                              }`}>
                              <h3 className="text-ui font-bold text-text-primary mb-3">Risk Assessment</h3>
                              <div className="flex items-center gap-2 mb-3">
                                   <Shield size={20} className={
                                        project.riskLevel === 'HIGH'
                                             ? 'text-red-500'
                                             : project.riskLevel === 'MEDIUM'
                                                  ? 'text-yellow-500'
                                                  : 'text-green-500'
                                   } />
                                   <span className="text-lg font-black">{project.riskLevel} RISK</span>
                              </div>
                              {project.delayReason && (
                                   <p className="text-sm text-red-600 mt-2">⚠️ {project.delayReason}</p>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
}
