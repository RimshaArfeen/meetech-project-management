

//app/(dashboard)/project-manager/projects/page.jsx
import React from 'react';
import Link from 'next/link';
import {
     Plus,
     Search,
     Calendar,
     User,
     BarChart2,
     Clock,
     MoreVertical,
     AlertCircle
} from 'lucide-react';

// Mock data based on your Prisma Model
const projects = [
     {
          id: "1",
          title: "Enterprise CRM Overhaul",
          status: "IN_PROGRESS",
          progress: 65,
          teamLead: "Sarah Jenkins",
          deadline: "2026-05-15",
          tasksCount: 24,
          isOverdue: false,
     },
     {
          id: "2",
          title: "Client Portal v2.0",
          status: "REVIEW_REQUESTED",
          progress: 88,
          teamLead: "Michael Chen",
          deadline: "2026-03-20",
          tasksCount: 12,
          isOverdue: true,
     }
];

export default function ProjectsPage() {
     return (
          <div className="min-h-screen bg-bg-page p-page-x pb-32 md:py-page-y">
               {/* Header Section */}
               <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                         <h1 className="text-4xl font-bold text-text-primary tracking-tight">
                              Projects Dashboard
                         </h1>
                         <p className="text-text-muted mt-1">Manage, monitor, and assign project scopes.</p>
                    </div>

                    <div className="flex items-center gap-3">
                         <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-text-inverse rounded-lg transition-colors font-medium">
                              <Plus size={18} />
                              Create New Project
                         </button>
                    </div>
               </header>

               {/* Filters & Search */}
               <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-border-subtle">
                    <div className="relative flex-1 min-w-[300px]">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
                         <input
                              type="text"
                              placeholder="Search projects, leads, or milestones..."
                              className="w-full pl-10 pr-4 py-2 bg-bg-surface border border-border-default rounded-lg focus:ring-1 focus:ring-focus-ring outline-none text-text-body transition-all"
                         />
                    </div>
                    <select className="px-4 py-2 bg-bg-surface border border-border-default rounded-lg text-text-body outline-none">
                         <option>All Statuses</option>
                         <option>In Progress</option>
                         <option>Completed</option>
                         <option>On Hold</option>
                    </select>
               </div>

               {/* Projects Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                         <ProjectCard key={project.id} project={project} />
                    ))}
               </div>
          </div>
     );
}

function ProjectCard({ project }) {
     return (
          <Link href={`/project/${project.id}`} className="group block">
               <div className="h-full bg-bg-card border border-border-default rounded-xl p-5 hover:border-accent transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden">

                    {/* Overdue Alert Decoration */}
                    {project.isOverdue && (
                         <div className="absolute top-0 right-0 p-2 bg-red-500/10 rounded-bl-lg">
                              <AlertCircle size={16} className="text-red-500" />
                         </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                         <span className={`text-caption font-bold px-2 py-1 rounded uppercase tracking-wider ${project.status === 'IN_PROGRESS' ? 'bg-accent-muted text-accent' : 'bg-accent-secondary/10 text-accent-secondary'
                              }`}>
                              {project.status.replace('_', ' ')}
                         </span>
                         <button className="text-text-disabled hover:text-text-primary">
                              <MoreVertical size={18} />
                         </button>
                    </div>

                    <h3 className="text-headline font-bold text-text-primary group-hover:text-accent transition-colors mb-2">
                         {project.title}
                    </h3>

                    <div className="space-y-3 mb-6">
                         <div className="flex items-center gap-2 text-ui text-text-body">
                              <User size={14} className="text-text-muted" />
                              <span className="font-medium">Lead:</span> {project.teamLead}
                         </div>
                         <div className="flex items-center gap-2 text-ui text-text-body">
                              <Calendar size={14} className="text-text-muted" />
                              <span className="font-medium">Deadline:</span> {project.deadline}
                         </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-2">
                         <div className="flex justify-between text-caption font-bold">
                              <span className="text-text-muted">PROJECT PROGRESS</span>
                              <span className="text-text-primary">{project.progress}%</span>
                         </div>
                         <div className="w-full h-2 bg-border-subtle rounded-full overflow-hidden">
                              <div
                                   className="h-full bg-accent transition-all duration-500"
                                   style={{ width: `${project.progress}%` }}
                              />
                         </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border-subtle flex justify-between items-center text-ui text-text-muted">
                         <div className="flex items-center gap-1">
                              <BarChart2 size={14} />
                              {project.tasksCount} Tasks
                         </div>
                         <div className="flex items-center gap-1 font-medium text-accent">
                              View Details →
                         </div>
                    </div>
               </div>
          </Link>
     );
}