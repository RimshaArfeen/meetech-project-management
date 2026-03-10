
import React from 'react';
import {
     BarChart3,
     FileText,
     Download,
     Calendar,
     AlertTriangle,
     CheckCircle2,
     Clock,
     Filter,
     ArrowUpRight, PlusCircle
} from 'lucide-react';

export default function ReportsPage() {
     // Mock data representing aggregated Project & Task metrics for the PM
     const reportCards = [
          {
               id: "rpt-1",
               projectName: "Enterprise ERP Migration",
               client: "Global Corp",
               status: "IN_DEVELOPMENT",
               progress: 65,
               tasksCompleted: 42,
               totalTasks: 60,
               onTrack: true,
               budgetBurn: 58, // % of budget spent
               riskLevel: "LOW",
               lastGenerated: "Oct 12, 2023"
          },
          {
               id: "rpt-2",
               projectName: "SaaS Dashboard Redesign",
               client: "Starlight Inc",
               status: "CLIENT_REVIEW",
               progress: 88,
               tasksCompleted: 75,
               totalTasks: 80,
               onTrack: false,
               budgetBurn: 92,
               riskLevel: "HIGH",
               delayReason: "Pending Client Feedback",
               lastGenerated: "Oct 14, 2023"
          }
     ];

     return (
          <div className="min-h-screen bg-bg-page p-page-x py-page-y pb-24 md:pb-page-y">
               {/* Page Header */}
               <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                         <h1 className="text-headline-lg font-bold text-text-primary tracking-tight flex items-center gap-3">
                              <BarChart3 className="text-accent" />
                              Project Status Reports
                         </h1>
                         <p className="text-text-muted mt-1 font-medium">Generate, track, and export performance metrics for your stakeholders.</p>
                    </div>

                    <div className="flex gap-3">
                         <button className="flex items-center gap-2 px-4 py-2 border border-border-strong rounded-lg text-text-body font-bold hover:bg-bg-subtle transition-colors">
                              <Filter size={18} />
                              Filter
                         </button>
                         <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-text-inverse px-5 py-2.5 rounded-lg font-bold transition-all shadow-md">
                              <PlusCircle size={18} />
                              Custom Report
                         </button>
                    </div>
               </header>

               {/* Quick Insights Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <MetricSummary icon={<Clock className="text-accent" />} label="Avg. Velocity" value="84%" subtext="+4% from last month" />
                    <MetricSummary icon={<AlertTriangle className="text-red-500" />} label="At Risk Projects" value="03" subtext="Requires PM attention" />
                    <MetricSummary icon={<CheckCircle2 className="text-accent-secondary" />} label="Monthly Deliveries" value="12" subtext="On track for EOM" />
               </div>

               {/* Reports Card Grid */}
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {reportCards.map((report) => (
                         <ReportCard key={report.id} report={report} />
                    ))}
               </div>
          </div>
     );
}

function MetricSummary({ icon, label, value, subtext }) {
     return (
          <div className="bg-bg-surface border border-border-default p-5 rounded-2xl shadow-sm">
               <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-bg-subtle rounded-lg">{icon}</div>
                    <span className="text-caption font-bold text-text-muted uppercase tracking-wider">{label}</span>
               </div>
               <div className="flex items-baseline gap-2">
                    <span className="text-headline-lg font-black text-text-primary">{value}</span>
                    <span className="text-xs font-medium text-accent-secondary">{subtext}</span>
               </div>
          </div>
     );
}

function ReportCard({ report }) {
     return (
          <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-accent/5 transition-all group">
               <div className="p-6">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-6">
                         <div>
                              <span className="text-[10px] font-black text-accent uppercase tracking-widest">{report.client}</span>
                              <h3 className="text-subheading font-bold text-text-primary mt-1 group-hover:text-accent transition-colors">
                                   {report.projectName}
                              </h3>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${report.riskLevel === 'HIGH'
                                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                        : 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20'
                                   }`}>
                                   {report.riskLevel} RISK
                              </span>
                              <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                                   <Calendar size={12} /> Updated {report.lastGenerated}
                              </span>
                         </div>
                    </div>

                    {/* Core Metrics Grid */}
                    <div className="grid grid-cols-2 gap-8 mb-6">
                         {/* Progress Section */}
                         <div>
                              <div className="flex justify-between text-xs font-bold mb-2">
                                   <span className="text-text-muted">PROJECT PROGRESS</span>
                                   <span className="text-text-primary">{report.progress}%</span>
                              </div>
                              <div className="w-full h-2.5 bg-bg-subtle border border-border-subtle rounded-full overflow-hidden">
                                   <div
                                        className={`h-full transition-all duration-1000 ${report.onTrack ? 'bg-accent' : 'bg-orange-500'}`}
                                        style={{ width: `${report.progress}%` }}
                                   />
                              </div>
                              <p className="text-[11px] text-text-muted mt-2 font-medium italic">
                                   {report.tasksCompleted} / {report.totalTasks} Tasks Resolved
                              </p>
                         </div>

                         {/* Budget/Cost Burn Section */}
                         <div>
                              <div className="flex justify-between text-xs font-bold mb-2">
                                   <span className="text-text-muted">BUDGET BURN</span>
                                   <span className={report.budgetBurn > 90 ? 'text-red-500' : 'text-text-primary'}>
                                        {report.budgetBurn}%
                                   </span>
                              </div>
                              <div className="w-full h-2.5 bg-bg-subtle border border-border-subtle rounded-full overflow-hidden">
                                   <div
                                        className="h-full bg-text-primary transition-all duration-1000"
                                        style={{ width: `${report.budgetBurn}%` }}
                                   />
                              </div>
                              <p className="text-[11px] text-text-muted mt-2 font-medium">
                                   Actual Cost vs. Estimated Budget
                              </p>
                         </div>
                    </div>

                    {/* Warning Banner if Delay exists */}
                    {report.delayReason && (
                         <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl mb-6">
                              <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                              <p className="text-xs text-red-700 font-medium">
                                   <strong>Delayed:</strong> {report.delayReason}
                              </p>
                         </div>
                    )}

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-border-subtle">
                         <div className="flex gap-4">
                              <button className="text-ui font-bold text-text-muted hover:text-accent flex items-center gap-2 transition-colors">
                                   <FileText size={16} />
                                   View Logs
                              </button>
                         </div>
                         <div className="flex gap-2">
                              <button className="p-2 text-text-body hover:bg-bg-subtle rounded-lg border border-border-strong transition-all" title="Download PDF">
                                   <Download size={18} />
                              </button>
                              <button className="flex items-center gap-2 bg-accent text-text-inverse px-4 py-2 rounded-lg text-ui font-bold hover:bg-black/70 transition-all duration-300 hover:cursor-pointer">
                                   Full Report
                                   <ArrowUpRight size={16} />
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
}