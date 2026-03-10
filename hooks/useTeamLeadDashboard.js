

// hooks/useTeamLeadDashboard.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useTeamLeadDashboard() {
     const [dashboardData, setDashboardData] = useState({
          projects: [],
          pendingApprovals: [],
          developerTasks: [],
          stats: {
               totalProjects: 0,
               activeProjects: 0,
               totalDevelopers: 0,
               pendingReviews: 0,
               overdueTasks: 0,
               completionRate: 0
          },
          deadlines: []
     });
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const router = useRouter();

     const fetchDashboardData = useCallback(async () => {
          try {
               setLoading(true);
               setError(null);

               const response = await fetch('/api/team-lead/dashboard');

               if (!response.ok) {
                    if (response.status === 401) {
                         router.push('/auth/login');
                         return;
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch dashboard data');
               }

               const data = await response.json();
               setDashboardData(data);
          } catch (err) {
               console.error('Error fetching dashboard:', err);
               setError(err.message);
          } finally {
               setLoading(false);
          }
     }, [router]);

     useEffect(() => {
          fetchDashboardData();
     }, [fetchDashboardData]);

     const createTask = async (taskData) => {
          try {
               const response = await fetch('/api/team-lead/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
               });

               if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to create task');
               }

               const newTask = await response.json();
               await fetchDashboardData(); // Refresh data
               return newTask;
          } catch (err) {
               console.error('Error creating task:', err);
               throw err;
          }
     };

     const approveTask = async (taskId, notes) => {
          try {
               const response = await fetch(`/api/team-lead/tasks/${taskId}/approve`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notes })
               });

               if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to approve task');
               }

               await fetchDashboardData(); // Refresh data
               return await response.json();
          } catch (err) {
               console.error('Error approving task:', err);
               throw err;
          }
     };

     const requestRevision = async (taskId, feedback) => {
          try {
               const response = await fetch(`/api/team-lead/tasks/${taskId}/revision`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ feedback })
               });

               if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to request revision');
               }

               await fetchDashboardData(); // Refresh data
               return await response.json();
          } catch (err) {
               console.error('Error requesting revision:', err);
               throw err;
          }
     };

     const reportIssue = async (issueData) => {
          try {
               const response = await fetch('/api/team-lead/issues', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(issueData)
               });

               if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to report issue');
               }

               return await response.json();
          } catch (err) {
               console.error('Error reporting issue:', err);
               throw err;
          }
     };

     return {
          ...dashboardData,
          loading,
          error,
          createTask,
          approveTask,
          requestRevision,
          reportIssue,
          refetch: fetchDashboardData
     };
}