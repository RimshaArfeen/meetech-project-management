
// hooks/useTeamLeadTasks.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useTeamLeadTasks() {
     const [tasks, setTasks] = useState([]);
     const [projects, setProjects] = useState([]);
     const [developers, setDevelopers] = useState([]);
     const [stats, setStats] = useState({
          totalTasks: 0,
          inReview: 0,
          overdue: 0,
          completed: 0,
          notStarted: 0,
          inProgress: 0,
          blocked: 0
     });
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [filters, setFilters] = useState({
          status: 'all',
          projectId: '',
          assigneeId: '',
          search: ''
     });
     const [sortBy, setSortBy] = useState('deadline');
     const [sortOrder, setSortOrder] = useState('asc');
     const router = useRouter();

     const fetchTasks = useCallback(async () => {
          try {
               setLoading(true);

               const params = new URLSearchParams();
               if (filters.status !== 'all') params.append('status', filters.status);
               if (filters.projectId) params.append('projectId', filters.projectId);
               if (filters.assigneeId) params.append('assigneeId', filters.assigneeId);
               if (filters.search) params.append('search', filters.search);
               if (sortBy) params.append('sortBy', sortBy);
               if (sortOrder) params.append('sortOrder', sortOrder);

               const response = await fetch(`/api/team-lead/tasks?${params.toString()}`);

               if (!response.ok) {
                    if (response.status === 401) {
                         router.push('/login');
                         return;
                    }
                    throw new Error('Failed to fetch tasks');
               }

               const data = await response.json();
               setTasks(data.tasks);
               setProjects(data.filters?.projects || []);
               setDevelopers(data.filters?.developers || []);

               // Calculate stats
               const now = new Date();
               const newStats = {
                    totalTasks: data.tasks.length,
                    inReview: data.tasks.filter(t => t.status === 'REVIEW').length,
                    overdue: data.tasks.filter(t =>
                         t.deadline && new Date(t.deadline) < now && t.status !== 'COMPLETED'
                    ).length,
                    completed: data.tasks.filter(t => t.status === 'COMPLETED').length,
                    notStarted: data.tasks.filter(t => t.status === 'NOT_STARTED').length,
                    inProgress: data.tasks.filter(t => t.status === 'IN_PROGRESS').length,
                    blocked: data.tasks.filter(t => t.status === 'BLOCKED').length
               };
               setStats(newStats);

               setError(null);
          } catch (err) {
               setError(err.message);
               console.error('Tasks fetch error:', err);
          } finally {
               setLoading(false);
          }
     }, [filters, sortBy, sortOrder, router]);

     // Get single task details
     const getTask = useCallback(async (taskId) => {
          try {
               const response = await fetch(`/api/team-lead/tasks/${taskId}`);

               if (!response.ok) {
                    throw new Error('Failed to fetch task');
               }

               const data = await response.json();
               return data.task;
          } catch (err) {
               console.error('Task fetch error:', err);
               return null;
          }
     }, []);

     // Update task (assign, edit, approve)
     const updateTask = useCallback(async (taskId, updates) => {
          try {
               const response = await fetch(`/api/team-lead/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updates),
               });

               const data = await response.json();

               if (!response.ok) {
                    throw new Error(data.error || 'Failed to update task');
               }

               // Refresh tasks list
               await fetchTasks();

               return { success: true, task: data.task };
          } catch (err) {
               console.error('Task update error:', err);
               return { success: false, error: err.message };
          }
     }, [fetchTasks]);

     // Delete task
     const deleteTask = useCallback(async (taskId) => {
          try {
               const response = await fetch(`/api/team-lead/tasks/${taskId}`, {
                    method: 'DELETE',
               });

               const data = await response.json();

               if (!response.ok) {
                    throw new Error(data.error || 'Failed to delete task');
               }

               await fetchTasks();
               return { success: true };
          } catch (err) {
               console.error('Task delete error:', err);
               return { success: false, error: err.message };
          }
     }, [fetchTasks]);

     // Report issue to PM
     const reportIssue = useCallback(async (taskId, issueData) => {
          try {
               const response = await fetch(`/api/team-lead/tasks/${taskId}/report`, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(issueData),
               });

               const data = await response.json();

               if (!response.ok) {
                    throw new Error(data.error || 'Failed to report issue');
               }

               return { success: true, message: data.message };
          } catch (err) {
               console.error('Report issue error:', err);
               return { success: false, error: err.message };
          }
     }, []);

     useEffect(() => {
          fetchTasks();
     }, [fetchTasks]);

     return {
          tasks,
          projects,
          developers,
          stats,
          loading,
          error,
          filters,
          setFilters,
          sortBy,
          setSortBy,
          sortOrder,
          setSortOrder,
          getTask,
          updateTask,
          deleteTask,
          reportIssue,
          refetch: fetchTasks
     };
}

// Hook for single task details
export function useTeamLeadTask(taskId) {
     const [task, setTask] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const router = useRouter();

     const fetchTask = useCallback(async () => {
          if (!taskId) return;

          try {
               setLoading(true);
               const response = await fetch(`/api/team-lead/tasks/${taskId}`);

               if (!response.ok) {
                    if (response.status === 401) {
                         router.push('/login');
                         return;
                    }
                    throw new Error('Failed to fetch task');
               }

               const data = await response.json();
               setTask(data.task);
               setError(null);
          } catch (err) {
               setError(err.message);
               console.error('Task fetch error:', err);
          } finally {
               setLoading(false);
          }
     }, [taskId, router]);

     // Update task status
     const updateTaskStatus = useCallback(async (status, reviewApproved = false) => {
          try {
               const response = await fetch(`/api/team-lead/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status, reviewApproved }),
               });

               if (response.ok) {
                    await fetchTask();
                    return { success: true };
               }
               return { success: false };
          } catch (error) {
               console.error('Failed to update task:', error);
               return { success: false };
          }
     }, [taskId, fetchTask]);

     // Add comment
     const addComment = useCallback(async (content) => {
          try {
               const response = await fetch(`/api/team-lead/tasks/${taskId}/comments`, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content }),
               });

               if (response.ok) {
                    await fetchTask();
                    return { success: true };
               }
               return { success: false };
          } catch (error) {
               console.error('Failed to add comment:', error);
               return { success: false };
          }
     }, [taskId, fetchTask]);

     useEffect(() => {
          fetchTask();
     }, [fetchTask]);

     return {
          task,
          loading,
          error,
          updateTaskStatus,
          addComment,
          refetch: fetchTask
     };
}