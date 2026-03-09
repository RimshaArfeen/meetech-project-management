
// lib/types/index.js

export type UserRole = 'CEO' | 'PROJECT_MANAGER' | 'TEAM_LEAD' | 'DEVELOPER';

export interface User {
     id: string;
     name: string;
     email: string;
     role: UserRole;
     avatar?: string;
}

export interface Project {
     id: string;
     name: string;
     description: string;
     status: 'UPCOMING' | 'ACTIVE' | 'IN_DEVELOPMENT' | 'CLIENT_REVIEW' | 'COMPLETED' | 'ARCHIVED';
     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
     progress: number; // 0-100
     startDate: string;
     deadline: string;
     manager: User;
     teamLead?: User;
     clientName: string;
     clientEmail: string;
     revenue?: number;
     riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Milestone {
     id: string;
     projectId: string;
     name: string;
     status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
     deadline: string;
     tasks: Task[];
}

export interface Task {
     id: string;
     title: string;
     description: string;
     status: 'NOT_STARTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
     deadline: string;
     assignee?: User;
     projectId: string;
     milestoneId?: string;
     comments?: Comment[];
     attachments?: Attachment[];
}

export interface Comment {
     id: string;
     content: string;
     author: User;
     createdAt: string;
}

export interface Attachment {
     id: string;
     name: string;
     url: string;
     uploadedBy: User;
     uploadedAt: string;
}

export interface ClientFeedback {
     id: string;
     projectId: string;
     content: string;
     stage: 'INITIAL' | 'REVIEW' | 'REVISION' | 'APPROVAL';
     revisionCount: number;
     isApproved: boolean;
     createdAt: string;
}