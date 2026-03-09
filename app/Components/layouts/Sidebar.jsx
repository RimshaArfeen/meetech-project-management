// components/layouts/Sidebar.js
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiBriefcase, FiCheckSquare, FiSettings, FiUser } from 'react-icons/fi';
import {
     LayoutDashboard,
     Briefcase,
     FileText,
     User,
     ListTodo,
} from 'lucide-react';

export default function Sidebar({ userRole = 'DEVELOPER' }) { // Default role
     const pathname = usePathname();

     const menuItems = {
          CEO: [
               { name: 'Dashboard', icon: FiHome, path: '/ceo' },
               { name: 'Projects', icon: FiBriefcase, path: '/ceo/projects' },
               { name: 'Managers', icon: FiUsers, path: '/ceo/managers' },
               { name: 'Reports', icon: FiCheckSquare, path: '/ceo/reports' },
               { name: 'Settings', icon: FiSettings, path: '/ceo/settings' },
               { name: 'Profile', icon: FiUser, path: '/ceo/profile' }
          ],
          PROJECT_MANAGER: [
               { name: 'Dashboard', icon: FiHome, path: '/project-manager' },
               { name: 'My Projects', icon: FiBriefcase, path: '/project-manager/projects' },
               { name: 'Clients', icon: FiUsers, path: '/project-manager/clients' },
               { name: 'Reports', icon: FiCheckSquare, path: '/project-manager/reports' },
               { name: 'Profile', icon: FiUser, path: '/project-manager/profile' }
          ],
          TEAM_LEAD: [
               { name: 'Dashboard', icon: FiHome, path: '/team-lead' },
               { name: 'Projects', icon: FiBriefcase, path: '/team-lead/projects' },
               { name: 'Tasks', icon: FiCheckSquare, path: '/team-lead/tasks' },
               { name: 'Team', icon: FiUsers, path: '/team-lead/team' },
               { name: 'Profile', icon: FiUser, path: '/team-lead/profile' }
          ],
          DEVELOPER: [
               { name: 'Dashboard', icon: FiHome, path: '/developer' },
               { name: 'My Tasks', icon: FiCheckSquare, path: '/developer/tasks' },
               { name: 'Projects', icon: FiBriefcase, path: '/developer/projects' },
               { name: 'Profile', icon: FiUser, path: '/developer/profile' }
          ]
     };

     // Get role-specific menu items
     const roleMenuItems = menuItems[userRole] || [];

     // Navigation item component with active state
     const NavItem = ({ item }) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
               <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                         ? 'bg-accent text-text-inverse'
                         : 'text-text-muted hover:bg-bg-subtle hover:text-text-primary'
                         }`}
               >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.name}</span>
               </Link>
          );
     };

     // Determine user role display
     const getUserRoleDisplay = () => {
          const roleMap = {
               CEO: 'Chief Executive Officer',
               PROJECT_MANAGER: 'Project Manager',
               TEAM_LEAD: 'Team Lead',
               DEVELOPER: 'Developer'
          };
          return roleMap[userRole] || userRole;
     };

     return (
          <aside className="w-64 border-r border-border-default bg-bg-surface flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen">
               {/* Logo Section */}
               <div className="p-6">
                    <div className="flex items-center gap-2 text-accent font-bold text-xl">
                         <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-text-inverse">
                              <ListTodo size={20} />
                         </div>
                         <span className="tracking-tight text-text-primary">ProManage</span>
                    </div>
               </div>

               {/* Role-based Navigation Menu */}
               <nav className="flex-1 px-4 space-y-1">
                    {roleMenuItems.map((item, index) => (
                         <NavItem key={index} item={item} />
                    ))}
               </nav>

               {/* User Profile Section */}
               <div className="p-4 border-t border-border-default">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-subtle transition-colors cursor-pointer">
                         <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center text-accent font-medium border border-accent/20">
                              EC
                         </div>
                         <div>
                              <p className="text-sm font-semibold text-text-primary">Emily Chen</p>
                              <p className="text-xs text-text-muted">{getUserRoleDisplay()}</p>
                         </div>
                    </div>
               </div>
          </aside>
     );
}