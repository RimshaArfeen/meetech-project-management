
// hooks/useProjectReports.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export function useProjectReports() {
     const [reports, setReports] = useState([]);
     const [metrics, setMetrics] = useState({
          avgVelocity: 0,
          atRiskProjects: 0,
          monthlyDeliveries: 0,
          velocityTrend: '+0%',
          projectsByRisk: { low: 0, medium: 0, high: 0 },
          completionTrend: []
     });
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [filters, setFilters] = useState({
          status: 'ALL',
          riskLevel: 'ALL',
          dateRange: '30days',
          search: ''
     });
     const router = useRouter();

     const fetchReports = useCallback(async () => {
          try {
               setLoading(true);

               // Build query string from filters
               const queryParams = new URLSearchParams();
               if (filters.status !== 'ALL') queryParams.append('status', filters.status);
               if (filters.riskLevel !== 'ALL') queryParams.append('riskLevel', filters.riskLevel);
               if (filters.dateRange) queryParams.append('dateRange', filters.dateRange);
               if (filters.search) queryParams.append('search', filters.search);

               const response = await fetch(`/api/project-manager/reports?${queryParams.toString()}`);

               if (!response.ok) {
                    if (response.status === 401) {
                         router.push('/login');
                         return;
                    }
                    throw new Error('Failed to fetch reports');
               }

               const data = await response.json();
               setReports(data.reports);
               setMetrics(data.metrics);
               setError(null);
          } catch (err) {
               console.error('Error fetching reports:', err);
               setError(err.message);
          } finally {
               setLoading(false);
          }
     }, [filters, router]);

     useEffect(() => {
          fetchReports();
     }, [fetchReports]);

     const generateCustomReport = useCallback(async (reportConfig) => {
          try {
               const response = await fetch('/api/project-manager/reports/custom', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reportConfig)
               });

               if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to generate report');
               }

               const data = await response.json();

               Swal.fire({
                    title: 'Report Generated!',
                    text: 'Your custom report is ready for download',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
               });

               return data;
          } catch (err) {
               console.error('Error generating report:', err);
               Swal.fire({
                    title: 'Error',
                    text: err.message,
                    icon: 'error',
                    confirmButtonColor: '#b91c1c'
               });
               throw err;
          }
     }, []);

     // Update the exportReport function:
     const exportReport = useCallback(async (projectId, format = 'pdf') => {
          try {
               const response = await fetch(`/api/project-manager/reports/${projectId}/export?format=${format}`);

               if (!response.ok) {
                    // Try to get error message from response
                    let errorMessage = 'Failed to export report';
                    try {
                         const errorData = await response.json();
                         errorMessage = errorData.error || errorMessage;
                    } catch {
                         // If response is not JSON, use status text
                         errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
               }

               // Check content type to determine how to handle the response
               const contentType = response.headers.get('content-type');

               if (contentType?.includes('application/json')) {
                    // JSON response - likely an error or data
                    const data = await response.json();
                    console.log('Report data:', data);

                    // Create downloadable JSON file
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `project-report-${projectId}.json`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
               } else {
                    // Binary response (PDF, CSV, etc.)
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `project-report-${projectId}.${format}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
               }

               Swal.fire({
                    title: 'Export Successful!',
                    text: `Report exported as ${format.toUpperCase()}`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
               });

               return true;
          } catch (err) {
               console.error('Error exporting report:', err);
               Swal.fire({
                    title: 'Export Failed',
                    text: err.message || 'Failed to export report. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#b91c1c'
               });
               return false;
          }
     }, []);

     const updateFilters = (newFilters) => {
          setFilters(prev => ({ ...prev, ...newFilters }));
     };

     const clearFilters = () => {
          setFilters({
               status: 'ALL',
               riskLevel: 'ALL',
               dateRange: '30days',
               search: ''
          });
     };

     return {
          reports,
          metrics,
          loading,
          error,
          filters,
          updateFilters,
          clearFilters,
          generateCustomReport,
          exportReport,
          refetch: fetchReports
     };
}