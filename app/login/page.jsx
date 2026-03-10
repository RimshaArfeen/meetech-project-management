
// app/login/page.jsx
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
     Eye,
     EyeOff,
     Lock,
     Mail,
     ArrowRight,
     Github,
     Chrome,
     ListTodo,
     AlertCircle
} from 'lucide-react';

export default function LoginPage() {
     const router = useRouter();
     const [showPassword, setShowPassword] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState('');
     const [formData, setFormData] = useState({
          email: '',
          password: ''
     });

     const handleChange = (e) => {
          setFormData({
               ...formData,
               [e.target.id]: e.target.value
          });
          // Clear error when user types
          if (error) setError('');
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          setIsLoading(true);
          setError('');

          try {
               const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
               });

               const data = await response.json();
               console.log("User Data", data)
               if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
               }

               // 1. Debug: Ensure data exists
               if (!data.user || !data.user.role) {
                    console.error("Missing user data in response", data);
                    router.push('/dashboard'); // Fallback
                    return;
               }

               // 2. Debug: Check the redirect path
               const roleRedirects = {
                    'CEO': '/ceo',
                    'PROJECT_MANAGER': '/project-manager',
                    'TEAM_LEAD': '/team-lead',
                    'DEVELOPER': '/developer'
               };

               const destination = roleRedirects[data.user.role] || '/dashboard';
               console.log("Redirecting to:", destination);

               // 3. Perform redirect
               // router.push(destination);
               // router.refresh(); // Forces Next.js to re-sync server components with new cookies
               window.location.href = destination;


          } catch (error) {
               setError(error.message);
          } finally {
               setIsLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-bg-page flex items-center justify-center p-4 font-sans text-text-body">
               {/* Decorative background elements */}
               <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-3xl"></div>
               </div>

               <div className="w-full max-w-[440px] relative">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-8">
                         <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-text-inverse shadow-lg shadow-accent/20 mb-4">
                              <ListTodo size={28} />
                         </div>
                         <h1 className="text-4xl font-bold text-text-primary tracking-tight">ProManage</h1>
                         <p className="text-text-muted mt-2 text-center">Enter your credentials to access your workspace</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-bg-surface border border-border-default rounded-2xl shadow-xl overflow-hidden">
                         <div className="p-8">
                              {/* Error Message */}
                              {error && (
                                   <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-sm">
                                        <AlertCircle size={16} />
                                        <span>{error}</span>
                                   </div>
                              )}

                              <form onSubmit={handleSubmit} className="space-y-5">
                                   {/* Email Field */}
                                   <div className="space-y-2">
                                        <label
                                             htmlFor="email"
                                             className="text-ui font-semibold text-text-primary flex items-center gap-2"
                                        >
                                             Email Address
                                        </label>
                                        <div className="relative group">
                                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-accent transition-colors">
                                                  <Mail size={18} />
                                             </div>
                                             <input
                                                  id="email"
                                                  type="email"
                                                  value={formData.email}
                                                  onChange={handleChange}
                                                  placeholder="name@company.com"
                                                  required
                                                  className="w-full pl-10 pr-4 py-3 bg-bg-subtle border border-border-default rounded-lg outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm placeholder:text-text-disabled"
                                             />
                                        </div>
                                   </div>

                                   {/* Password Field */}
                                   <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                             <label
                                                  htmlFor="password"
                                                  className="text-ui font-semibold text-text-primary flex items-center gap-2"
                                             >
                                                  Password
                                             </label>
                                        </div>
                                        <div className="relative group">
                                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-accent transition-colors">
                                                  <Lock size={18} />
                                             </div>
                                             <input
                                                  id="password"
                                                  type={showPassword ? "text" : "password"}
                                                  value={formData.password}
                                                  onChange={handleChange}
                                                  placeholder="••••••••"
                                                  required
                                                  className="w-full pl-10 pr-12 py-3 bg-bg-subtle border border-border-default rounded-lg outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm placeholder:text-text-disabled"
                                             />
                                             <button
                                                  type="button"
                                                  onClick={() => setShowPassword(!showPassword)}
                                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-muted transition-colors"
                                             >
                                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                             </button>
                                        </div>
                                   </div>

                                   {/* Submit Button */}
                                   <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-accent hover:bg-accent-hover active:bg-accent-active text-text-inverse py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/10 disabled:opacity-70 disabled:cursor-not-allowed group"
                                   >
                                        {isLoading ? (
                                             <div className="w-5 h-5 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin"></div>
                                        ) : (
                                             <>
                                                  Sign In to Workspace
                                                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                             </>
                                        )}
                                   </button>
                              </form>

                              <div className="relative my-8 text-center">
                                   <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border-default"></div>
                                   </div>
                                   <span className="relative px-4 bg-bg-surface text-caption font-bold text-text-disabled uppercase tracking-widest">
                                        Or continue with
                                   </span>
                              </div>

                              {/* Social Logins */}
                              <div className="grid grid-cols-2 gap-4">
                                   <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border-default rounded-lg hover:bg-bg-subtle text-ui font-semibold text-text-primary transition-colors">
                                        <Chrome size={18} className="text-[#4285F4]" />
                                        Google
                                   </button>
                                   <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border-default rounded-lg hover:bg-bg-subtle text-ui font-semibold text-text-primary transition-colors">
                                        <Github size={18} />
                                        GitHub
                                   </button>
                              </div>
                         </div>

                         {/* Footer Info */}
                         <div className="p-6 bg-bg-subtle border-t border-border-default text-center">
                              <p className="text-caption text-text-muted">
                                   Don't have an account?{' '}
                                   <a href="#" className="font-bold text-accent hover:text-accent-hover transition-colors">
                                        Request access from admin
                                   </a>
                              </p>
                         </div>
                    </div>
               </div>
          </div>
     );
}