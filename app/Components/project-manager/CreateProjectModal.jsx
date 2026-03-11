// Components/project-manager/CreateProjectModal.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, Building, DollarSign, FileText, Plus } from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose, onSubmit }) {
     const [formData, setFormData] = useState({
          name: '',
          description: '',
          scope: '',
          deadline: '',
          priority: 'MEDIUM',
          teamLeadId: '',
          clientName: '',
          clientEmail: '',
          clientCompany: '',
          clientPhone: '',
          startDate: '',
          budget: ''
     });
     const [teamLeads, setTeamLeads] = useState([]);
     const [loading, setLoading] = useState(false);
     const [submitting, setSubmitting] = useState(false);
     const [error, setError] = useState(null);

     useEffect(() => {
          if (isOpen) {
               fetchTeamLeads();
          }
     }, [isOpen]);

     const fetchTeamLeads = async () => {
          try {
               setLoading(true);
               const response = await fetch('/api/project-manager/team-leads');
               if (response.ok) {
                    const data = await response.json();
                    setTeamLeads(data.teamLeads || []);
               }
          } catch (error) {
               console.error('Failed to fetch team leads:', error);
          } finally {
               setLoading(false);
          }
     };

     if (!isOpen) return null;

     const handleSubmit = async (e) => {
          e.preventDefault();
          setSubmitting(true);
          setError(null);

          try {
               // Validate required fields
               if (!formData.name.trim()) throw new Error('Project name is required');
               if (!formData.clientName.trim()) throw new Error('Client name is required');
               if (!formData.clientEmail.trim()) throw new Error('Client email is required');

               // Validate email format
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               if (!emailRegex.test(formData.clientEmail)) {
                    throw new Error('Please enter a valid client email');
               }

               // Convert budget to number if provided
               const projectData = {
                    ...formData,
                    budget: formData.budget ? parseFloat(formData.budget) : null,
                    startDate: formData.startDate || new Date().toISOString().split('T')[0]
               };

               await onSubmit(projectData);

               // Reset form
               setFormData({
                    name: '', description: '', scope: '', deadline: '', priority: 'MEDIUM',
                    teamLeadId: '', clientName: '', clientEmail: '', clientCompany: '',
                    clientPhone: '', startDate: '', budget: ''
               });
               onClose();
          } catch (err) {
               setError(err.message);
          } finally {
               setSubmitting(false);
          }
     };

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(prev => ({ ...prev, [name]: value }));
     };

     return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-bg-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-border-default overflow-hidden max-h-[90vh] overflow-y-auto chat-scroll ">
                    <div className="p-6 border-b border-border-default flex justify-between items-center bg-bg-subtle sticky top-0 z-10">
                         <h2 className="text-xl font-bold text-text-primary">Create New Project</h2>
                         <button
                              onClick={onClose}
                              className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-bg-surface transition-colors"
                         >
                              <X size={20} />
                         </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                         {error && (
                              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                   {error}
                              </div>
                         )}

                         {/* Project Details Section */}
                         <div className="space-y-4">
                              <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2">
                                   Project Details
                              </h3>

                              <div>
                                   <label className="block text-xs font-medium text-text-muted mb-2">
                                        Project Name <span className="text-red-400">*</span>
                                   </label>
                                   <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        placeholder="e.g., Enterprise CRM Overhaul"
                                   />
                              </div>

                              <div>
                                   <label className="block text-xs font-medium text-text-muted mb-2">
                                        Description
                                   </label>
                                   <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        placeholder="Brief description of the project..."
                                   />
                              </div>

                              <div>
                                   <label className="block text-xs font-medium text-text-muted mb-2">
                                        Project Scope
                                   </label>
                                   <textarea
                                        name="scope"
                                        value={formData.scope}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        placeholder="Define the scope and objectives..."
                                   />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="block text-xs font-medium text-text-muted mb-2">
                                             <Calendar size={14} className="inline mr-1" />
                                             Start Date
                                        </label>
                                        <input
                                             type="date"
                                             name="startDate"
                                             value={formData.startDate}
                                             onChange={handleChange}
                                             className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-xs font-medium text-text-muted mb-2">
                                             <Calendar size={14} className="inline mr-1" />
                                             Deadline
                                        </label>
                                        <input
                                             type="date"
                                             name="deadline"
                                             value={formData.deadline}
                                             onChange={handleChange}
                                             min={formData.startDate || new Date().toISOString().split('T')[0]}
                                             className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        />
                                   </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="block text-xs font-medium text-text-muted mb-2">
                                             Priority
                                        </label>
                                        <select
                                             name="priority"
                                             value={formData.priority}
                                             onChange={handleChange}
                                             className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        >
                                             <option value="LOW">Low</option>
                                             <option value="MEDIUM">Medium</option>
                                             <option value="HIGH">High</option>
                                             <option value="CRITICAL">Critical</option>
                                        </select>
                                   </div>
                                   <div>
                                        <label className="block text-xs font-medium text-text-muted mb-2">
                                             <DollarSign size={14} className="inline mr-1" />
                                             Budget
                                        </label>
                                        <input
                                             type="number"
                                             name="budget"
                                             value={formData.budget}
                                             onChange={handleChange}
                                             min="0"
                                             step="1000"
                                             className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                             placeholder="50000"
                                        />
                                   </div>
                              </div>
                         </div>

                         {/* Team Lead Assignment */}
                         <div className="space-y-4">
                              <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2">
                                   Team Assignment
                              </h3>

                              <div>
                                   <label className="block text-xs font-medium text-text-muted mb-2">
                                        <User size={14} className="inline mr-1" />
                                        Assign Team Lead
                                   </label>
                                   <select
                                        name="teamLeadId"
                                        value={formData.teamLeadId}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        disabled={loading}
                                   >
                                        <option value="">Select a team lead (optional)</option>
                                        {teamLeads.map(tl => (
                                             <option key={tl.id} value={tl.id}>
                                                  {tl.name} {!tl.isAvailable ? '(Busy)' : ''}
                                             </option>
                                        ))}
                                   </select>
                                   {loading && <p className="text-xs text-text-muted mt-1">Loading team leads...</p>}
                              </div>
                         </div>

                         {/* Client Information */}
                         <div className="space-y-4">
                              <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-2">
                                   Client Information
                              </h3>

                              <div>
                                   <label className="block text-xs font-medium text-text-muted mb-2">
                                        <User size={14} className="inline mr-1" />
                                        Client Name <span className="text-red-400">*</span>
                                   </label>
                                   <input
                                        type="text"
                                        name="clientName"
                                        value={formData.clientName}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        placeholder="John Doe"
                                   />
                              </div>

                              <div>
                                   <label className="block text-xs font-medium text-text-muted mb-2">
                                        <Mail size={14} className="inline mr-1" />
                                        Client Email <span className="text-red-400">*</span>
                                   </label>
                                   <input
                                        type="email"
                                        name="clientEmail"
                                        value={formData.clientEmail}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                        placeholder="client@company.com"
                                   />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="block text-xs font-medium text-text-muted mb-2">
                                             <Building size={14} className="inline mr-1" />
                                             Company
                                        </label>
                                        <input
                                             type="text"
                                             name="clientCompany"
                                             value={formData.clientCompany}
                                             onChange={handleChange}
                                             className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                             placeholder="Company Name"
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-xs font-medium text-text-muted mb-2">
                                             <Phone size={14} className="inline mr-1" />
                                             Phone
                                        </label>
                                        <input
                                             type="tel"
                                             name="clientPhone"
                                             value={formData.clientPhone}
                                             onChange={handleChange}
                                             className="w-full p-3 bg-bg-subtle border border-border-default rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                             placeholder="+1 234 567 890"
                                        />
                                   </div>
                              </div>
                         </div>

                         {/* Form Actions */}
                         <div className="flex justify-end gap-3 pt-6 border-t border-border-default">
                              <button
                                   type="button"
                                   onClick={onClose}
                                   className="px-6 py-2.5 rounded-lg font-medium text-text-body hover:bg-border-default transition-colors"
                              >
                                   Cancel
                              </button>
                              <button
                                   type="submit"
                                   disabled={submitting}
                                   className="px-6 py-2.5 rounded-lg font-medium bg-accent text-text-inverse hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                   {submitting ? (
                                        <>
                                             <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                             Creating...
                                        </>
                                   ) : (
                                        <>
                                             <Plus size={16} />
                                             Create Project
                                        </>
                                   )}
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
}