

import React from 'react';
import {
     UserPlus,
     Mail,
     Phone,
     Briefcase,
     Clock,
     ExternalLink,
     PlusCircle,
     FileUp,
     MessageSquare
} from 'lucide-react';

// Mock data representing the aggregated Client view from the Prisma Project model
const clients = [
     {
          id: "c1",
          name: "Alex Thompson",
          company: "Nexus Tech Solutions",
          email: "alex@nexustech.com",
          phone: "+1 (555) 123-4567",
          activeProjects: 3,
          totalProgress: 72,
          status: "ACTIVE",
          lastFeedback: "2 days ago",
          totalBudget: 45000,
     },
     {
          id: "c2",
          name: "Sarah Williams",
          company: "Horizon Media",
          email: "s.williams@horizon.io",
          phone: "+1 (555) 987-6543",
          activeProjects: 1,
          totalProgress: 15,
          status: "UPCOMING",
          lastFeedback: "No feedback yet",
          totalBudget: 12000,
     }
];

export default function ClientDirectory() {
     return (
          <div className="min-h-screen bg-bg-page p-page-x py-page-y">
               {/* Header Section */}
               <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                         <h1 className="text-headline-lg font-bold text-text-primary tracking-tight">
                              Client Relationships
                         </h1>
                         <p className="text-text-muted mt-1">Manage client communications, requirements, and project approvals.</p>
                    </div>

                    <button className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-text-inverse px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-accent/20">
                         <UserPlus size={20} />
                         Add New Client
                    </button>
               </header>

               {/* Stats Overview */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard label="Total Clients" value="24" color="var(--accent-primary)" />
                    <StatsCard label="Active Projects" value="12" color="var(--accent-secondary)" />
                    <StatsCard label="Pending Feedback" value="08" color="#f59e0b" />
                    <StatsCard label="Total Portfolio" value="$240k" color="var(--accent-primary)" />
               </div>

               {/* Client Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {clients.map((client) => (
                         <ClientCard key={client.id} client={client} />
                    ))}
               </div>
          </div>
     );
}

function StatsCard({ label, value, color }) {
     return (
          <div className="bg-bg-card border border-border-subtle p-4 rounded-xl">
               <p className="text-caption font-bold text-text-muted uppercase tracking-wider">{label}</p>
               <p className="text-headline-lg font-black mt-1" style={{ color }}>{value}</p>
          </div>
     );
}

function ClientCard({ client }) {
     return (
          <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden hover:border-accent transition-all group">
               {/* Card Top: Identity */}
               <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                         <div className="w-12 h-12 bg-accent-muted rounded-xl flex items-center justify-center text-accent font-bold text-xl border border-accent/10">
                              {client.company.charAt(0)}
                         </div>
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${client.status === 'ACTIVE' ? 'bg-accent-secondary/10 text-accent-secondary' : 'bg-bg-subtle text-text-muted'
                              }`}>
                              {client.status}
                         </span>
                    </div>

                    <h3 className="text-subheading font-bold text-text-primary group-hover:text-accent transition-colors">
                         {client.name}
                    </h3>
                    <p className="text-ui text-text-muted font-medium mb-4">{client.company}</p>

                    <div className="space-y-2 border-t border-border-subtle pt-4">
                         <div className="flex items-center gap-3 text-ui text-text-body">
                              <Mail size={16} className="text-text-disabled" />
                              <span className="truncate">{client.email}</span>
                         </div>
                         <div className="flex items-center gap-3 text-ui text-text-body">
                              <Phone size={16} className="text-text-disabled" />
                              <span>{client.phone}</span>
                         </div>
                    </div>
               </div>

               {/* Card Middle: Project Metrics */}
               <div className="px-6 py-4 bg-bg-subtle/50 border-y border-border-subtle">
                    <div className="flex justify-between mb-2">
                         <div className="flex items-center gap-2">
                              <Briefcase size={16} className="text-accent" />
                              <span className="text-ui font-bold text-text-primary">{client.activeProjects} Projects</span>
                         </div>
                         <span className="text-ui font-black text-accent">{client.totalProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-border-default rounded-full overflow-hidden">
                         <div
                              className="h-full bg-accent transition-all duration-700"
                              style={{ width: `${client.totalProgress}%` }}
                         />
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-[11px] text-text-muted">
                         <MessageSquare size={14} />
                         <span>Feedback: <strong className="text-text-body">{client.lastFeedback}</strong></span>
                    </div>
               </div>

               {/* Card Bottom: PM Actions */}
               <div className="p-4 grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 text-ui font-bold py-2 border border-border-strong rounded-lg hover:bg-bg-subtle text-text-body transition-colors">
                         <FileUp size={16} />
                         Reqs
                    </button>
                    <button className="flex items-center justify-center gap-2 text-ui font-bold py-2 bg-accent text-text-inverse rounded-lg hover:bg-accent-hover transition-all">
                         Details
                         <ExternalLink size={16} />
                    </button>
               </div>
          </div>
     );
}