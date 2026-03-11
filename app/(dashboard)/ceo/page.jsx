"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PortfolioPulseChart from '../../Components/ceo/PortfolioChart';
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
     LogOut,
     X,
     RefreshCw,
     PieChart,
     Target,
     UserCheck,
     DollarSign,
     Flag,
     Shield,
     Zap
} from 'lucide-react';
import { useCEODashboard } from '../../../hooks/useCEODashboard';
import Spinner from '../../Components/common/Spinner';
import SearchResults from '../../Components/ceo/SearchResults';
import NotificationsPanel from '../../Components/ceo/NotificationsPanel';

const MySwal = withReactContent(Swal);

const App = () => {
     const [activeTab, setActiveTab] = useState('Overview');
     const [showNotifications, setShowNotifications] = useState(false);
     const [showSearchResults, setShowSearchResults] = useState(false);
     const [searchQuery, setSearchQuery] = useState('');
     const [searchResults, setSearchResults] = useState({ projects: [], users: [] });
     const [searching, setSearching] = useState(false);
     const [timeRange, setTimeRange] = useState('30days');
     const searchRef = useRef(null);
     const notificationsRef = useRef(null);

     const router = useRouter();
     const {
          stats,
          projects,
          managers,
          workload,
          alerts,
          approvalQueue,
          loading,
          error,
          searchTerm,
          setSearchTerm,
          filteredProjects,
          getStatsByTimeRange,
          refetch
     } = useCEODashboard();

     // Handle click outside for dropdowns
     useEffect(() => {
          const handleClickOutside = (event) => {
               if (searchRef.current && !searchRef.current.contains(event.target)) {
                    setShowSearchResults(false);
               }
               if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                    setShowNotifications(false);
               }
          };
          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
     }, []);

     // Search functionality
     useEffect(() => {
          const delayDebounce = setTimeout(() => {
               if (searchQuery.length >= 2) {
                    performSearch();
               } else {
                    setSearchResults({ projects: [], users: [] });
               }
          }, 500);

          return () => clearTimeout(delayDebounce);
     }, [searchQuery]);

     const performSearch = async () => {
          if (searchQuery.length < 2) return;

          setSearching(true);
          try {
               const response = await fetch(`/api/ceo/search?q=${encodeURIComponent(searchQuery)}`);
               if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data.results || { projects: [], users: [] });
                    setShowSearchResults(true);
               }
          } catch (error) {
               console.error('Search error:', error);
          } finally {
               setSearching(false);
          }
     };

     const handleLogout = async () => {
          const result = await MySwal.fire({
               title: <p className="text-red-700 font-bold">Are you sure?</p>,
               text: "You will need to login again to access the Executive Dashboard.",
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
                    const response = await fetch('/api/auth/logout', { method: 'POST' });
                    if (response.ok) {
                         router.push('/login');
                    }
               } catch (error) {
                    MySwal.fire('Error', 'Logout failed. Please try again.', 'error');
               }
          }
     };

     const handleTimeRangeChange = async (range) => {
          setTimeRange(range);
          const rangeStats = await getStatsByTimeRange(range);
          if (rangeStats) {
               console.log('Range stats:', rangeStats);
          }
     };

     const getRiskColor = (risk) => {
          switch (risk) {
               case 'High': return 'text-red-600 font-bold';
               case 'Medium': return 'text-orange-500';
               default: return 'text-text-muted';
          }
     };

     const getStatusColor = (status) => {
          switch (status) {
               case 'IN_DEVELOPMENT': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
               case 'COMPLETED': return 'bg-green-500/10 text-green-500 border-green-500/20';
               case 'CLIENT_REVIEW': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
               case 'ON_HOLD': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
               case 'DELAYED': return 'bg-red-500/10 text-red-500 border-red-500/20';
               case 'ACTIVE': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
               case 'UPCOMING': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
               default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
          }
     };

     if (loading) {
          return (
               <div className="min-h-screen bg-bg-page p-page-x py-page-y flex items-center justify-center">
                    <Spinner title="Executive Dashboard..." />
               </div>
          );
     }

     if (error) {
          return (
               <div className="min-h-screen bg-bg-page p-page-x py-page-y flex items-center justify-center">
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

     return (
          <main className="p-page-x py-page-y pb-32 md:pb-auto">
               {/* Top Header */}
               <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
                    <div>
                         <h1 className="text-4xl font-bold text-text-primary tracking-tight">Executive Dashboard</h1>
                         <p className="text-text-muted">
                              Welcome back. Here's a summary of your organization's health.
                         </p>
                    </div>

                    <div className="flex items-center gap-3">
                         {/* Time Range Selector */}
                         <select
                              value={timeRange}
                              onChange={(e) => handleTimeRangeChange(e.target.value)}
                              className="px-4 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm focus:ring-1 focus:ring-accent outline-none"
                         >
                              <option value="7days">Last 7 Days</option>
                              <option value="30days">Last 30 Days</option>
                              <option value="90days">Last 90 Days</option>
                              <option value="year">This Year</option>
                         </select>

                         {/* Search Bar */}
                         <div className="relative" ref={searchRef}>
                              <div className="relative">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
                                   <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                        placeholder="Search projects, managers..."
                                        className="pl-10 pr-10 py-2.5 bg-bg-surface border border-border-default rounded-xl focus:ring-1 focus:ring-accent outline-none w-64 transition-all"
                                   />
                                   {searching && (
                                        <RefreshCw size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted animate-spin" />
                                   )}
                                   {searchQuery && !searching && (
                                        <button
                                             onClick={() => {
                                                  setSearchQuery('');
                                                  setSearchResults({ projects: [], users: [] });
                                             }}
                                             className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                        >
                                             <X size={16} />
                                        </button>
                                   )}
                              </div>

                              {showSearchResults && (
                                   <SearchResults
                                        results={searchResults}
                                        onClose={() => setShowSearchResults(false)}
                                   />
                              )}
                         </div>

                         {/* Notifications */}
                         <div className="relative" ref={notificationsRef}>
                              <button
                                   onClick={() => setShowNotifications(!showNotifications)}
                                   className="p-2.5 bg-bg-surface border border-border-default rounded-xl hover:bg-bg-subtle transition-colors text-text-body relative"
                              >
                                   <Bell size={20} />
                                   {alerts.length > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-bg-page"></span>
                                   )}
                              </button>

                              {showNotifications && (
                                   <NotificationsPanel
                                        alerts={alerts}
                                        onClose={() => setShowNotifications(false)}
                                   />
                              )}
                         </div>

                         {/* Refresh Button */}
                         <button
                              onClick={refetch}
                              className="p-2.5 bg-bg-surface border border-border-default rounded-xl hover:bg-bg-subtle transition-colors text-text-body"
                              title="Refresh"
                         >
                              <RefreshCw size={20} />
                         </button>

                         
                    </div>
               </header>

               {/* High Level Stats Grid */}
               <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <StatCard
                         icon={<Briefcase className="text-accent" size={24} />}
                         label="Total Projects"
                         value={stats.totalProjects}
                         subValue={`${stats.activeProjects} active`}
                         change={`${stats.inProgressProjects} in dev`}
                         trend="neutral"
                    />
                    <StatCard
                         icon={<DollarSign className="text-green-500" size={24} />}
                         label="Portfolio Value"
                         value={`$${(stats.totalRevenue / 1000000).toFixed(1)}M`}
                         subValue={`${stats.completedProjects} completed`}
                         change="Portfolio"
                         trend="neutral"
                    />
                    <StatCard
                         icon={<Target className="text-accent-secondary" size={24} />}
                         label="Avg. Progress"
                         value={`${stats.avgProgress}%`}
                         subValue={`${stats.highRiskProjects} at risk`}
                         change={stats.highRiskProjects > 0 ? `${stats.highRiskProjects} high risk` : 'On track'}
                         trend={stats.highRiskProjects > 0 ? 'down' : 'up'}
                    />
                    <StatCard
                         icon={<UserCheck className="text-purple-500" size={24} />}
                         label="Client Approvals"
                         value={`${stats.clientApprovals?.approved || 0}/${stats.clientApprovals?.total || 0}`}
                         subValue={`${stats.clientApprovals?.rate || 0}% rate`}
                         change="Steady"
                         trend="neutral"
                    />
               </section>

               {/* Dashboard Core Modules */}
               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                         <PortfolioPulseChart />
                    </div>

                    {/* Main Project Overview Table */}
                    <div className="xl:col-span-2 space-y-8">
                         <div className="bg-bg-surface rounded-2xl border border-border-default overflow-hidden shadow-sm">
                              <div className="p-6 border-b border-border-default flex items-center justify-between">
                                   <div>
                                        <h3 className="text-subheading font-bold text-text-primary">
                                             High-Priority Project Pipeline
                                        </h3>
                                        <p className="text-sm text-text-muted mt-1">
                                             {filteredProjects.length} projects • {filteredProjects.filter(p => p.risk === 'High').length} at risk
                                        </p>
                                   </div>
                                   <Link
                                        href="/ceo/projects"
                                        className="text-accent text-ui font-medium hover:underline"
                                   >
                                        View all projects
                                   </Link>
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
                                             {filteredProjects.slice(0, 4).map((proj) => (
                                                  <ProjectRow key={proj.id} project={proj} getStatusColor={getStatusColor} getRiskColor={getRiskColor} />
                                             ))}
                                             {filteredProjects.length === 0 && (
                                                  <tr>
                                                       <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                                                            No projects found matching your search
                                                       </td>
                                                  </tr>
                                             )}
                                        </tbody>
                                   </table>
                              </div>
                         </div>

                         {/* Performance Metrics per PM */}
                         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                              <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-sm">
                                   <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-subheading font-bold text-text-primary">
                                             Manager Performance
                                        </h3>
                                        <Link href="/ceo/managers" className="text-sm text-accent hover:underline">
                                             View all
                                        </Link>
                                   </div>
                                   <div className="space-y-6">
                                        {managers.length > 0 ? (
                                             managers.slice(0, 3).map((mgr, i) => (
                                                  <ManagerPerformance key={i} manager={mgr} />
                                             ))
                                        ) : (
                                             <p className="text-center text-text-muted py-4">No manager data available</p>
                                        )}
                                   </div>
                              </div>

                              {/* Workload Distribution */}
                              <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-sm">
                                   <h3 className="text-subheading font-bold text-text-primary mb-2">
                                        Developer Workload
                                   </h3>
                                   <p className="text-caption text-text-muted mb-6">
                                        Organization-wide resource allocation
                                   </p>

                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between text-ui">
                                             <span className="text-text-muted">Total Capacity</span>
                                             <span className="font-bold text-text-primary">
                                                  {workload.totalCapacity} hrs/wk
                                             </span>
                                        </div>
                                        <div className="flex items-center justify-between text-ui">
                                             <span className="text-text-muted">Currently Assigned</span>
                                             <span className="font-bold text-accent">
                                                  {workload.assignedHours} hrs/wk
                                             </span>
                                        </div>

                                        {/* Workload Bar */}
                                        <div className="relative mt-4">
                                             <div className="flex h-3 rounded-full overflow-hidden bg-bg-subtle">
                                                  <div
                                                       className="h-full bg-accent transition-all"
                                                       style={{ width: `${workload.distribution.development}%` }}
                                                       title="Development"
                                                  />
                                                  <div
                                                       className="h-full bg-accent-secondary transition-all"
                                                       style={{ width: `${workload.distribution.design}%` }}
                                                       title="Design"
                                                  />
                                                  <div
                                                       className="h-full bg-border-strong transition-all"
                                                       style={{ width: `${workload.distribution.overhead}%` }}
                                                       title="Overhead"
                                                  />
                                             </div>
                                        </div>

                                        {/* Legend */}
                                        <div className="flex items-center gap-4 mt-2">
                                             <LegendItem color="bg-accent" label="Development" />
                                             <LegendItem color="bg-accent-secondary" label="Design" />
                                             <LegendItem color="bg-border-strong" label="Overhead" />
                                        </div>

                                        {/* Utilization Rate */}
                                        <div className="mt-4 p-3 bg-bg-subtle rounded-lg">
                                             <div className="flex justify-between items-center">
                                                  <span className="text-sm text-text-muted">Utilization Rate</span>
                                                  <span className="text-lg font-bold text-accent">
                                                       {workload.percentage}%
                                                  </span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Right Column: Alerts and Quick Stats */}
                    <aside className="space-y-6">
                         {/* Critical Alerts */}
                         <div className="bg-red-700 p-6 rounded-2xl text-text-inverse shadow-lg shadow-red-500/20">
                              <div className="flex items-center gap-2 mb-4">
                                   <AlertCircle size={20} />
                                   <span className="font-bold tracking-tight">Critical Alerts</span>
                                   <span className="ml-auto text-sm bg-white/20 px-2 py-0.5 rounded-full">
                                        {alerts.length}
                                   </span>
                              </div>

                              <div className="space-y-3">
                                   {alerts.length > 0 ? (
                                        alerts.slice(0, 3).map((alert, i) => (
                                             <AlertItem key={i} alert={alert} />
                                        ))
                                   ) : (
                                        <div className="bg-white/10 p-4 rounded-xl">
                                             <p className="text-sm">No critical alerts at this time</p>
                                        </div>
                                   )}
                              </div>
                         </div>

                         {/* Approval Status */}
                         <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-sm">
                              <h3 className="text-subheading font-bold text-text-primary mb-4">
                                   Approval Queue
                              </h3>

                              <div className="space-y-3">
                                   {approvalQueue.map((item, i) => (
                                        <ApprovalItem key={i} item={item} />
                                   ))}
                              </div>

                              <Link
                                   href="/ceo/approvals"
                                   className="block w-full mt-6 py-2.5 text-center border border-border-strong rounded-xl text-ui font-bold hover:bg-bg-subtle transition-all"
                              >
                                   Review Approval Queue
                              </Link>
                         </div>

                         {/* Strategic Insight */}
                         <div className="bg-gradient-to-br from-accent to-accent-active p-6 rounded-2xl text-text-inverse shadow-lg relative overflow-hidden group">
                              <div className="relative z-10">
                                   <h4 className="text-ui font-bold mb-1 flex items-center gap-2">
                                        <TrendingUp size={18} />
                                        Strategic AI Insight
                                   </h4>
                                   <p className="text-sm text-white/90 leading-relaxed">
                                        Based on current velocity,
                                        <span className="font-bold mx-1">
                                             {managers.length > 0 ? managers[0]?.name : 'your top performer'}'s
                                        </span>
                                        team is performing well.
                                        {stats.highRiskProjects > 0 && (
                                             <span> Focus on the {stats.highRiskProjects} high-risk projects that need attention.</span>
                                        )}
                                   </p>
                                   <button className="mt-4 text-sm font-medium text-white/80 hover:text-white underline-offset-2 hover:underline">
                                        View Recommendation
                                   </button>
                              </div>
                              <div className="absolute -bottom-4 -right-4 text-white/10 transition-transform group-hover:scale-110">
                                   <TrendingUp size={100} />
                              </div>
                         </div>

                         {/* Quick Stats */}
                         <div className="grid grid-cols-2 gap-3">
                              <QuickStatCard
                                   label="Projects at Risk"
                                   value={stats.highRiskProjects}
                                   icon={<AlertCircle size={16} className="text-red-500" />}
                                   bgColor="bg-red-500/10"
                              />
                              <QuickStatCard
                                   label="Pending Approvals"
                                   value={stats.pendingApprovals || 0}
                                   icon={<Clock size={16} className="text-yellow-500" />}
                                   bgColor="bg-yellow-500/10"
                              />
                         </div>
                    </aside>
               </div>
          </main>
     );
};

// ========== COMPONENTS ==========

const StatCard = ({ icon, label, value, subValue, change, trend }) => {
     const getTrendColor = () => {
          switch (trend) {
               case 'up': return 'text-accent-secondary';
               case 'down': return 'text-red-600';
               default: return 'text-text-muted';
          }
     };

     const getTrendIcon = () => {
          switch (trend) {
               case 'up': return <ArrowUpRight size={14} />;
               case 'down': return <ArrowDownRight size={14} />;
               default: return null;
          }
     };

     return (
          <div className="bg-bg-card p-6 rounded-2xl border border-border-subtle hover:border-accent/30 transition-all group">
               <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-bg-surface rounded-xl group-hover:bg-accent-muted transition-colors">
                         {icon}
                    </div>
                    {change && (
                         <div className={`flex items-center gap-1 text-caption font-bold px-2 py-1 rounded-full ${getTrendColor()} bg-opacity-10`}>
                              {getTrendIcon()}
                              {change}
                         </div>
                    )}
               </div>
               <p className="text-text-muted text-ui font-medium">{label}</p>
               <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
                    <span className="text-xs text-text-muted">{subValue}</span>
               </div>
          </div>
     );
};

const ProjectRow = ({ project, getStatusColor, getRiskColor }) => {
     const getRiskIcon = (risk) => {
          if (risk === 'High' || risk === 'HIGH') return <AlertCircle size={16} className="text-red-500" />;
          if (risk === 'Medium' || risk === 'MEDIUM') return <AlertCircle size={16} className="text-orange-500" />;
          return null;
     };

     return (
          <tr className="hover:bg-bg-subtle/50 transition-colors group">
               <td className="px-6 py-4">
                    <Link href={`/ceo/projects/${project.id}`} className="block">
                         <p className="text-ui font-bold text-text-primary group-hover:text-accent transition-colors">
                              {project.name}
                         </p>
                         <p className="text-caption text-text-muted">{project.clientName || 'No client'}</p>
                    </Link>
               </td>
               <td className="px-6 py-4">
                    <Link href={`/ceo/users/${project.manager?.id}`} className="text-ui text-text-body hover:text-accent">
                         {project.manager?.name || 'Unassigned'}
                    </Link>
               </td>
               <td className="px-6 py-4">
                    <div className="w-32">
                         <div className="flex items-center justify-between mb-1">
                              <span className="text-caption font-bold text-text-primary">{project.progress}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
                              <div
                                   className={`h-full transition-all duration-1000 ${project.isDelayed ? 'bg-red-600' : 'bg-accent'
                                        }`}
                                   style={{ width: `${project.progress}%` }}
                              />
                         </div>
                         <p className="text-[10px] text-text-muted mt-1">
                              {project.taskStats?.completed || 0}/{project.taskStats?.total || 0} tasks
                         </p>
                    </div>
               </td>
               <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                         {project.status?.replace('_', ' ') || 'Unknown'}
                    </span>
               </td>
               <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                         {getRiskIcon(project.risk)}
                         <span className={`text-ui font-medium ${getRiskColor(project.risk)}`}>
                              {project.risk}
                         </span>
                    </div>
               </td>
          </tr>
     );
};

const ManagerPerformance = ({ manager }) => {
     const getPerformanceColor = (score) => {
          if (score >= 90) return 'text-accent-secondary';
          if (score >= 75) return 'text-accent';
          if (score >= 60) return 'text-yellow-500';
          return 'text-red-500';
     };

     return (
          <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-accent text-text-inverse flex items-center justify-center font-bold flex-shrink-0">
                    {manager.avatar ? (
                         <img src={manager.avatar} alt={manager.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                         manager.name?.charAt(0) || 'M'
                    )}
               </div>

               <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                         <span className="text-ui font-bold text-text-primary">{manager.name}</span>
                         <span className={`text-ui font-bold ${getPerformanceColor(manager.performance)}`}>
                              {manager.performance}%
                         </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                         <span className="text-caption text-text-muted">
                              {manager.projects || 0} active projects
                         </span>
                         <span className="text-caption text-text-muted">•</span>
                         <span className="text-caption text-text-muted">
                              {manager.delayed || 0} delayed
                         </span>
                    </div>

                    <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
                         <div
                              className="h-full bg-accent transition-all"
                              style={{ width: `${manager.performance || 0}%` }}
                         />
                    </div>
               </div>
          </div>
     );
};

const AlertItem = ({ alert }) => {
     const severityColors = {
          high: 'bg-red-600',
          medium: 'bg-orange-500',
          low: 'bg-yellow-500'
     };

     return (
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
               <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${severityColors[alert.severity] || 'bg-yellow-500'}`} />
                    <div className="flex-1">
                         <p className="text-ui font-bold">{alert.title || 'Alert'}</p>
                         <p className="text-caption text-white/80 mt-1">{alert.message || 'No details'}</p>
                         {alert.actionable && (
                              <Link
                                   href={alert.actionLink || '#'}
                                   className="inline-block mt-2 text-caption font-bold text-white/90 hover:text-white underline"
                              >
                                   {alert.actionLabel || 'Take Action'} →
                              </Link>
                         )}
                    </div>
               </div>
          </div>
     );
};

const ApprovalItem = ({ item }) => (
     <Link
          href={item.link || '#'}
          className="flex items-center justify-between p-3 rounded-xl bg-bg-subtle hover:bg-border-subtle transition-colors cursor-pointer"
     >
          <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full ${item.color || 'bg-accent'}`} />
               <span className="text-ui font-medium text-text-body">{item.label}</span>
          </div>
          <span className="font-bold text-text-primary">{item.count}</span>
     </Link>
);

const LegendItem = ({ color, label }) => (
     <div className="flex items-center gap-2 text-caption font-medium">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-text-muted">{label}</span>
     </div>
);

const QuickStatCard = ({ label, value, icon, bgColor }) => (
     <div className="bg-bg-surface p-4 rounded-xl border border-border-default">
          <div className="flex items-center gap-2 mb-2">
               <div className={`p-1.5 ${bgColor} rounded-lg`}>
                    {icon}
               </div>
               <span className="text-xs text-text-muted">{label}</span>
          </div>
          <p className="text-xl font-bold text-text-primary">{value}</p>
     </div>
);

export default App;