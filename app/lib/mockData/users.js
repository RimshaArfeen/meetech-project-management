// data/mockData.js

// Mock Users
export const users = {
     ceo: {
          id: 1,
          name: "John CEO",
          email: "ceo@company.com",
          role: "CEO"
     },
     projectManager: {
          id: 2,
          name: "Sarah PM",
          email: "pm@company.com",
          role: "PROJECT_MANAGER"
     },
     teamLead: {
          id: 3,
          name: "Mike Lead",
          email: "teamlead@company.com",
          role: "TEAM_LEAD"
     },
     developer: {
          id: 4,
          name: "Alex Dev",
          email: "dev@company.com",
          role: "DEVELOPER"
     }
};

// Mock Projects
export const projects = [
     {
          id: 1,
          name: "E-commerce Platform",
          description: "Building a modern e-commerce site",
          status: "ACTIVE",
          progress: 65,
          priority: "HIGH",
          startDate: "2024-01-15",
          deadline: "2024-04-30",
          manager: users.projectManager,
          teamLead: users.teamLead,
          riskLevel: "LOW",
          isDelayed: false,
          client: {
               name: "ABC Corp",
               email: "client@abccorp.com",
               approvalStatus: "PENDING"
          }
     },
     {
          id: 2,
          name: "Mobile App Redesign",
          description: "Redesign company mobile app",
          status: "IN_DEVELOPMENT",
          progress: 30,
          priority: "MEDIUM",
          startDate: "2024-02-01",
          deadline: "2024-05-15",
          manager: users.projectManager,
          teamLead: users.teamLead,
          riskLevel: "MEDIUM",
          isDelayed: false,
          client: {
               name: "XYZ Ltd",
               email: "client@xyzltd.com",
               approvalStatus: "APPROVED"
          }
     },
     {
          id: 3,
          name: "CRM Integration",
          description: "Integrate with Salesforce",
          status: "CLIENT_REVIEW",
          progress: 90,
          priority: "CRITICAL",
          startDate: "2024-01-10",
          deadline: "2024-03-20",
          manager: users.projectManager,
          teamLead: users.teamLead,
          riskLevel: "HIGH",
          isDelayed: true,
          client: {
               name: "Tech Solutions",
               email: "client@techsolutions.com",
               approvalStatus: "REVISION"
          }
     }
];

// Mock Milestones
export const milestones = [
     {
          id: 1,
          projectId: 1,
          name: "Design Phase",
          description: "Complete UI/UX design",
          status: "COMPLETED",
          deadline: "2024-02-15"
     },
     {
          id: 2,
          projectId: 1,
          name: "Frontend Development",
          description: "Build React components",
          status: "IN_PROGRESS",
          deadline: "2024-03-30"
     },
     {
          id: 3,
          projectId: 1,
          name: "Backend API",
          description: "Create REST APIs",
          status: "PENDING",
          deadline: "2024-04-15"
     }
];

// Mock Tasks
export const tasks = [
     {
          id: 1,
          title: "Design Homepage",
          description: "Create homepage mockups",
          status: "COMPLETED",
          priority: "HIGH",
          deadline: "2024-02-10",
          milestoneId: 1,
          assignee: users.developer,
          projectId: 1
     },
     {
          id: 2,
          title: "Setup Next.js",
          description: "Initialize project with Next.js",
          status: "COMPLETED",
          priority: "HIGH",
          deadline: "2024-02-05",
          milestoneId: 2,
          assignee: users.developer,
          projectId: 1
     },
     {
          id: 3,
          title: "Create Login Page",
          description: "Implement authentication UI",
          status: "IN_PROGRESS",
          priority: "HIGH",
          deadline: "2024-03-15",
          milestoneId: 2,
          assignee: users.developer,
          projectId: 1
     },
     {
          id: 4,
          title: "Fix Navigation Bug",
          description: "Mobile menu not working",
          status: "REVIEW",
          priority: "MEDIUM",
          deadline: "2024-03-10",
          milestoneId: 2,
          assignee: users.developer,
          projectId: 1
     }
];

// Mock Dashboard Stats
export const dashboardStats = {
     ceo: {
          totalProjects: 15,
          activeProjects: 8,
          completedProjects: 5,
          delayedProjects: 2,
          upcomingProjects: 2,
          totalRevenue: 250000,
          projectManagers: 4,
          developers: 12,
          recentAlerts: [
               { id: 1, project: "CRM Integration", message: "Behind schedule by 5 days", severity: "HIGH" },
               { id: 2, project: "Mobile App", message: "Client requested changes", severity: "MEDIUM" }
          ]
     },
     projectManager: {
          managedProjects: 5,
          activeMilestones: 8,
          pendingApprovals: 3,
          clientFeedbacks: 2
     },
     teamLead: {
          teamSize: 4,
          pendingTasks: 12,
          completedThisWeek: 8,
          tasksToApprove: 3
     },
     developer: {
          assignedTasks: 5,
          completedTasks: 2,
          overdueTasks: 1,
          nextDeadline: "2024-03-15"
     }
};