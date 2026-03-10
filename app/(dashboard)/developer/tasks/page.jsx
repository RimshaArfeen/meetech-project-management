

// app/(dashboard)/developer/tasks/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import TaskCard from '../../../Components/common/TaskCard';
import {
     LayoutGrid,
     List,
     Filter,
     Plus,
     Search,
     X,
     AlertCircle,
     Clock,
     CheckCircle2,
     Loader
} from 'lucide-react';
import { useDeveloperTasks } from '../../../../hooks/useDeveloperTasks';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
     const router = useRouter();
     const {
          tasks,
          stats,
          loading,
          error,
          filters,
          setFilters,
          sortBy,
          setSortBy,
          sortOrder,
          setSortOrder
     } = useDeveloperTasks();

     const [view, setView] = useState('grid');
     const [searchInput, setSearchInput] = useState('');
     const [showFilters, setShowFilters] = useState(false);

     // Debounce search input
     useEffect(() => {
          const timer = setTimeout(() => {
               setFilters(prev => ({ ...prev, search: searchInput }));
          }, 300);

          return () => clearTimeout(timer);
     }, [searchInput, setFilters]);

     const clearSearch = () => {
          setSearchInput('');
          setFilters(prev => ({ ...prev, search: '' }));
     };

     const getStatusCount = (status) => {
          switch (status) {
               case 'NOT_STARTED': return stats.notStarted;
               case 'IN_PROGRESS': return stats.inProgress;
               case 'REVIEW': return stats.review;
               case 'COMPLETED': return stats.completed;
               case 'BLOCKED': return stats.blocked;
               default: return 0;
          }
     };

     const getStatusColor = (status) => {
          switch (status) {
               case 'NOT_STARTED': return 'bg-slate-500';
               case 'IN_PROGRESS': return 'bg-accent';
               case 'REVIEW': return 'bg-yellow-500';
               case 'COMPLETED': return 'bg-green-500';
               case 'BLOCKED': return 'bg-red-500';
               default: return 'bg-slate-500';
          }
     };

     if (loading && tasks.length === 0) {
          return (
               <div className="flex flex-col h-full bg-bg-page items-center justify-center">
                    <div className="text-center">
                         <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                         <p className="text-text-muted">Loading your tasks...</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="flex flex-col h-full bg-bg-page">
               {/* Header with Stats */}
               <header className="border-b border-border-default bg-bg-surface sticky top-0 z-10">
                    {/* Main Header */}
                    <div className="h-16 px-6 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                              <h2 className="text-lg font-bold text-text-primary">My Tasks</h2>
                              <span className="text-xs bg-accent-muted text-accent px-2 py-0.5 rounded-full font-bold">
                                   {stats.total}
                              </span>
                         </div>

                         <div className="flex items-center gap-2">
                              <div className="flex bg-bg-subtle p-1 rounded-lg border border-border-default">
                                   <button
                                        onClick={() => setView('grid')}
                                        className={`p-1.5 rounded-md transition-colors ${view === 'grid'
                                             ? 'bg-bg-surface shadow-sm text-accent'
                                             : 'text-text-muted hover:text-text-primary'
                                             }`}
                                   >
                                        <LayoutGrid size={18} />
                                   </button>
                                   <button
                                        onClick={() => setView('list')}
                                        className={`p-1.5 rounded-md transition-colors ${view === 'list'
                                             ? 'bg-bg-surface shadow-sm text-accent'
                                             : 'text-text-muted hover:text-text-primary'
                                             }`}
                                   >
                                        <List size={18} />
                                   </button>
                              </div>

                              <button
                                   onClick={() => setShowFilters(!showFilters)}
                                   className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all ${showFilters
                                        ? 'bg-accent text-text-inverse'
                                        : 'text-text-body bg-bg-surface border border-border-strong hover:bg-bg-subtle'
                                        }`}
                              >
                                   <Filter size={16} /> Filter
                                   {(filters.status !== 'all' || filters.priority !== 'all') && (
                                        <span className="ml-1 px-1.5 py-0.5 bg-accent/20 rounded-full text-[10px]">
                                             {Object.values(filters).filter(v => v !== 'all' && v !== null && v !== '').length}
                                        </span>
                                   )}
                              </button>

                              <button
                                   onClick={() => router.push('/developer/tasks/new')}
                                   className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
                              >
                                   <Plus size={16} /> New Task
                              </button>
                         </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="px-6 py-3 bg-bg-subtle/50 border-t border-border-subtle flex items-center gap-6 text-xs">
                         <div className="flex items-center gap-2">
                              <span className="text-text-muted">Overdue:</span>
                              <span className="font-bold text-red-500">{stats.overdue}</span>
                         </div>
                         <div className="flex items-center gap-2">
                              <span className="text-text-muted">In Progress:</span>
                              <span className="font-bold text-accent">{stats.inProgress}</span>
                         </div>
                         <div className="flex items-center gap-2">
                              <span className="text-text-muted">Review:</span>
                              <span className="font-bold text-yellow-500">{stats.review}</span>
                         </div>
                         <div className="flex items-center gap-2">
                              <span className="text-text-muted">Completed:</span>
                              <span className="font-bold text-green-500">{stats.completed}</span>
                         </div>
                         <div className="flex items-center gap-2">
                              <span className="text-text-muted">High Priority:</span>
                              <span className="font-bold text-orange-500">{stats.highPriority}</span>
                         </div>
                    </div>

                    {/* Filter Bar */}
                    {showFilters && (
                         <div className="px-6 py-4 border-t border-border-default bg-bg-surface animate-in slide-in-from-top-2">
                              <div className="flex flex-wrap items-center gap-4">
                                   {/* Search */}
                                   <div className="relative flex-1 min-w-[200px]">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={16} />
                                        <input
                                             type="text"
                                             value={searchInput}
                                             onChange={(e) => setSearchInput(e.target.value)}
                                             placeholder="Search tasks..."
                                             className="w-full bg-bg-subtle border border-border-default rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/20"
                                        />
                                        {searchInput && (
                                             <button
                                                  onClick={clearSearch}
                                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-primary"
                                             >
                                                  <X size={14} />
                                             </button>
                                        )}
                                   </div>

                                   {/* Status Filter */}
                                   <select
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                        className="px-3 py-2 bg-bg-subtle border border-border-default rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent/20"
                                   >
                                        <option value="all">All Status</option>
                                        <option value="NOT_STARTED">Not Started ({stats.notStarted})</option>
                                        <option value="IN_PROGRESS">In Progress ({stats.inProgress})</option>
                                        <option value="REVIEW">Review ({stats.review})</option>
                                        <option value="COMPLETED">Completed ({stats.completed})</option>
                                        <option value="BLOCKED">Blocked ({stats.blocked})</option>
                                   </select>

                                   {/* Priority Filter */}
                                   <select
                                        value={filters.priority}
                                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                                        className="px-3 py-2 bg-bg-subtle border border-border-default rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent/20"
                                   >
                                        <option value="all">All Priorities</option>
                                        <option value="URGENT">Urgent</option>
                                        <option value="HIGH">High</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="LOW">Low</option>
                                   </select>

                                   {/* Sort By */}
                                   <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 bg-bg-subtle border border-border-default rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent/20"
                                   >
                                        <option value="deadline">Sort by Deadline</option>
                                        <option value="priority">Sort by Priority</option>
                                        <option value="status">Sort by Status</option>
                                        <option value="createdAt">Sort by Created</option>
                                   </select>

                                   {/* Sort Order */}
                                   <button
                                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                        className="px-3 py-2 bg-bg-subtle border border-border-default rounded-lg text-sm hover:bg-bg-page transition-colors"
                                   >
                                        {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                                   </button>

                                   {/* Clear Filters */}
                                   {(filters.status !== 'all' || filters.priority !== 'all' || filters.search) && (
                                        <button
                                             onClick={() => {
                                                  setFilters({ status: 'all', priority: 'all', projectId: null, search: '' });
                                                  setSearchInput('');
                                             }}
                                             className="text-xs text-accent hover:text-accent-hover font-bold"
                                        >
                                             Clear all filters
                                        </button>
                                   )}
                              </div>
                         </div>
                    )}
               </header>

               {/* Error Message */}
               {error && (
                    <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                              <AlertCircle size={20} className="text-red-500" />
                              <p className="text-red-500 text-sm">{error}</p>
                         </div>
                         <button
                              onClick={() => window.location.reload()}
                              className="text-red-500 hover:text-red-600 text-xs font-bold"
                         >
                              Retry
                         </button>
                    </div>
               )}

               {/* Task Grid/List Area */}
               <main className="flex-1 overflow-y-auto chat-scroll p-6">
                    {tasks.length === 0 ? (
                         <div className="h-full flex items-center justify-center">
                              <div className="text-center max-w-md">
                                   <div className="p-4 bg-bg-surface rounded-full w-fit mx-auto mb-4">
                                        <CheckCircle2 size={40} className="text-text-disabled" />
                                   </div>
                                   <h3 className="font-bold text-text-primary text-lg mb-2">No tasks found</h3>
                                   <p className="text-text-muted text-sm mb-6">
                                        {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                                             ? 'Try adjusting your filters or search terms'
                                             : "You don't have any tasks assigned yet. Tasks will appear here when your team lead assigns them."}
                                   </p>
                                   {(filters.search || filters.status !== 'all' || filters.priority !== 'all') && (
                                        <button
                                             onClick={() => {
                                                  setFilters({ status: 'all', priority: 'all', projectId: null, search: '' });
                                                  setSearchInput('');
                                             }}
                                             className="bg-accent text-text-inverse px-6 py-3 rounded-xl font-bold text-sm hover:bg-accent-hover transition-all"
                                        >
                                             Clear Filters
                                        </button>
                                   )}
                              </div>
                         </div>
                    ) : view === 'grid' ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                              {tasks.map((task) => (
                                   <TaskCard role="developer" key={task.id} task={task} />
                              ))}
                         </div>
                    ) : (
                         <div className="bg-bg-surface rounded-xl border border-border-default overflow-hidden">
                              <table className="w-full">
                                   <thead className="bg-bg-subtle border-b border-border-default">
                                        <tr>
                                             <th className="text-left p-4 text-xs font-bold text-text-disabled uppercase">Task</th>
                                             <th className="text-left p-4 text-xs font-bold text-text-disabled uppercase">Project</th>
                                             <th className="text-left p-4 text-xs font-bold text-text-disabled uppercase">Status</th>
                                             <th className="text-left p-4 text-xs font-bold text-text-disabled uppercase">Priority</th>
                                             <th className="text-left p-4 text-xs font-bold text-text-disabled uppercase">Deadline</th>
                                             <th className="text-left p-4 text-xs font-bold text-text-disabled uppercase">Progress</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {tasks.map(task => (
                                             <tr
                                                  key={task.id}
                                                  onClick={() => router.push(`/developer/tasks/${task.id}`)}
                                                  className="border-b border-border-default hover:bg-bg-subtle/50 cursor-pointer transition-colors"
                                             >
                                                  <td className="p-4">
                                                       <div>
                                                            <p className="font-medium text-text-primary">{task.title}</p>
                                                            {task.description && (
                                                                 <p className="text-xs text-text-muted line-clamp-1">{task.description}</p>
                                                            )}
                                                       </div>
                                                  </td>
                                                  <td className="p-4 text-text-muted">{task.project?.name}</td>
                                                  <td className="p-4">
                                                       <div className={`w-fit px-2 py-1 rounded-full text-[10px] font-bold text-white ${getStatusColor(task.status)}`}>
                                                            {task.status.replace('_', ' ')}
                                                       </div>
                                                  </td>
                                                  <td className="p-4">
                                                       <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${task.priority === 'URGENT' ? 'bg-red-500/10 text-red-500' :
                                                            task.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                                                                 task.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' :
                                                                      'bg-green-500/10 text-green-500'
                                                            }`}>
                                                            {task.priority}
                                                       </span>
                                                  </td>
                                                  <td className="p-4">
                                                       <span className={`text-sm ${task.isOverdue ? 'text-red-500' : 'text-text-muted'
                                                            }`}>
                                                            {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                                                       </span>
                                                  </td>
                                                  <td className="p-4">
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-text-primary">
                                                                 {task.actualHours || 0}/{task.estimatedHours || 0}h
                                                            </span>
                                                            <div className="w-16 h-1.5 bg-bg-subtle rounded-full overflow-hidden">
                                                                 <div
                                                                      className="h-full bg-accent"
                                                                      style={{
                                                                           width: `${task.estimatedHours ? Math.min(100, (task.actualHours || 0) / task.estimatedHours * 100) : 0}%`
                                                                      }}
                                                                 />
                                                            </div>
                                                       </div>
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         </div>
                    )}
               </main>
          </div>
     );
}