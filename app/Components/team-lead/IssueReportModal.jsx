// Components/team-lead/IssueReportModal.jsx
'use client';
import React, { useState } from 'react';
import { X, AlertCircle, Flag, Users, MessageSquare } from 'lucide-react';

export default function IssueReportModal({ isOpen, onClose, onSubmit, projects }) {
     const [formData, setFormData] = useState({
          projectId: '',
          title: '',
          description: '',
          severity: 'MEDIUM',
          affectedTasks: '',
          proposedSolution: ''
     });
     const [submitting, setSubmitting] = useState(false);
     const [error, setError] = useState(null);

     if (!isOpen) return null;

     const handleSubmit = async (e) => {
          e.preventDefault();
          setSubmitting(true);
          setError(null);

          try {
               if (!formData.projectId || !formData.title || !formData.description) {
                    throw new Error('Please fill in all required fields');
               }

               await onSubmit({
                    ...formData,
                    affectedTasks: formData.affectedTasks.split(',').map(t => t.trim()).filter(Boolean)
               });

               // Reset form
               setFormData({
                    projectId: '', title: '', description: '', severity: 'MEDIUM',
                    affectedTasks: '', proposedSolution: ''
               });
               onClose();
          } catch (err) {
               setError(err.message);
          } finally {
               setSubmitting(false);
          }
     };

     return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ">
               <div className="bg-bg-surface w-full max-w-xl rounded-2xl shadow-2xl border border-border-default h-[90vh] overflow-y-auto chat-scroll  chat-scroll ">
                    <div className="p-6 border-b border-border-default flex justify-between items-center bg-bg-subtle">
                         <h2 className="text-headline font-bold text-text-primary flex items-center gap-2">
                              <AlertCircle size={20} className="text-red-500" />
                              Report Issue to Project Manager
                         </h2>
                         <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                              <X size={20} />
                         </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                         {error && (
                              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                   {error}
                              </div>
                         )}

                         {/* Project Selection */}
                         <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                                   <Flag size={14} />
                                   Project <span className="text-red-400">*</span>
                              </label>
                              <select
                                   value={formData.projectId}
                                   onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                   required
                                   className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-1 focus:ring-accent outline-none"
                              >
                                   <option value="">Select project</option>
                                   {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                   ))}
                              </select>
                         </div>

                         {/* Issue Title */}
                         <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                   Issue Title <span className="text-red-400">*</span>
                              </label>
                              <input
                                   type="text"
                                   value={formData.title}
                                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                   required
                                   className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-1 focus:ring-accent outline-none"
                                   placeholder="e.g., API Integration Blocked"
                              />
                         </div>

                         {/* Severity */}
                         <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Severity</label>
                              <div className="flex gap-4">
                                   {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(level => (
                                        <label key={level} className="flex items-center gap-2">
                                             <input
                                                  type="radio"
                                                  name="severity"
                                                  value={level}
                                                  checked={formData.severity === level}
                                                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                                  className="w-4 h-4 text-accent"
                                             />
                                             <span className={`text-xs ${level === 'CRITICAL' ? 'text-red-500' :
                                                  level === 'HIGH' ? 'text-orange-500' :
                                                       level === 'MEDIUM' ? 'text-yellow-500' :
                                                            'text-green-500'
                                                  }`}>
                                                  {level}
                                             </span>
                                        </label>
                                   ))}
                              </div>
                         </div>

                         {/* Description */}
                         <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                   Description <span className="text-red-400">*</span>
                              </label>
                              <textarea
                                   value={formData.description}
                                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                   required
                                   rows="4"
                                   className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-1 focus:ring-accent outline-none"
                                   placeholder="Describe the issue in detail..."
                              />
                         </div>

                         {/* Affected Tasks */}
                         <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                                   <Users size={14} />
                                   Affected Tasks (comma-separated)
                              </label>
                              <input
                                   type="text"
                                   value={formData.affectedTasks}
                                   onChange={(e) => setFormData({ ...formData, affectedTasks: e.target.value })}
                                   className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-1 focus:ring-accent outline-none"
                                   placeholder="Task IDs or names"
                              />
                         </div>

                         {/* Proposed Solution */}
                         <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                                   <MessageSquare size={14} />
                                   Proposed Solution
                              </label>
                              <textarea
                                   value={formData.proposedSolution}
                                   onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                                   rows="3"
                                   className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-1 focus:ring-accent outline-none"
                                   placeholder="Suggest how to resolve this issue..."
                              />
                         </div>

                         {/* Action Buttons */}
                         <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
                              <button
                                   type="button"
                                   onClick={onClose}
                                   className="px-6 py-2 rounded-lg font-medium text-text-body hover:bg-border-default transition-colors"
                              >
                                   Cancel
                              </button>
                              <button
                                   type="submit"
                                   disabled={submitting}
                                   className="px-6 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                              >
                                   {submitting ? (
                                        <>
                                             <Loader size={16} className="animate-spin" />
                                             Reporting...
                                        </>
                                   ) : (
                                        <>
                                             <AlertCircle size={16} />
                                             Report Issue
                                        </>
                                   )}
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
}