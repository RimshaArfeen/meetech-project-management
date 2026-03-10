// // components/layouts/Sidebar.js
// 'use client';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { FiHome, FiUsers, FiBriefcase, FiCheckSquare, FiSettings, FiUser } from 'react-icons/fi';
// import {
//      LayoutDashboard,
//      Briefcase,
//      FileText,
//      User,
//      ListTodo,
// } from 'lucide-react';

// export default function Sidebar({ userRole = '' }) { // Default role
//      const pathname = usePathname();

//      const menuItems = {
//           CEO: [
//                { name: 'Dashboard', icon: FiHome, path: '/ceo' },
//                { name: 'Projects', icon: FiBriefcase, path: '/ceo/projects' },
//                { name: 'Managers', icon: FiUsers, path: '/ceo/managers' },
//                { name: 'Reports', icon: FiCheckSquare, path: '/ceo/reports' },
//                { name: 'Settings', icon: FiSettings, path: '/ceo/settings' },
//                { name: 'Profile', icon: FiUser, path: '/ceo/profile' }
//           ],
//           PROJECT_MANAGER: [
//                { name: 'Dashboard', icon: FiHome, path: '/project-manager' },
//                { name: 'My Projects', icon: FiBriefcase, path: '/project-manager/projects' },
//                { name: 'Clients', icon: FiUsers, path: '/project-manager/clients' },
//                { name: 'Reports', icon: FiCheckSquare, path: '/project-manager/reports' },
//                { name: 'Profile', icon: FiUser, path: '/project-manager/profile' }
//           ],
//           TEAM_LEAD: [
//                { name: 'Dashboard', icon: FiHome, path: '/team-lead' },
//                { name: 'Projects', icon: FiBriefcase, path: '/team-lead/projects' },
//                { name: 'Tasks Control', icon: FiCheckSquare, path: '/team-lead/tasks' },
//                { name: 'My Developers', icon: FiUsers, path: '/team-lead/my-developers' },
//                { name: 'Approvals', icon: FiCheckSquare, path: '/team-lead/approvals' },
//                { name: 'Report Issues', icon: FiUsers, path: '/team-lead/report-issues' },
//                { name: 'Profile', icon: FiUser, path: '/team-lead/profile' }
//           ],
//           DEVELOPER: [
//                { name: 'Dashboard', icon: FiHome, path: '/developer' },
//                { name: 'My Tasks', icon: FiCheckSquare, path: '/developer/tasks' },
//                { name: 'Projects', icon: FiBriefcase, path: '/developer/projects' },
//                { name: 'Profile', icon: FiUser, path: '/developer/profile' }
//           ]
//      };

//      // Get role-specific menu items
//      const roleMenuItems = menuItems[userRole] || [];

//      // Navigation item component with active state
//      const NavItem = ({ item }) => {
//           const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
//           const Icon = item.icon;

//           return (
//                <Link
//                     href={item.path}
//                     className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
//                          ? 'bg-accent text-text-inverse'
//                          : 'text-text-muted hover:bg-bg-subtle hover:text-text-primary'
//                          }`}
//                >
//                     <Icon size={20} />
//                     <span className="text-sm font-medium">{item.name}</span>
//                </Link>
//           );
//      };

//      // Determine user role display
//      const getUserRoleDisplay = () => {
//           const roleMap = {
//                CEO: 'Chief Executive Officer',
//                PROJECT_MANAGER: 'Project Manager',
//                TEAM_LEAD: 'Team Lead',
//                DEVELOPER: 'Developer'
//           };
//           return roleMap[userRole] || userRole;
//      };

//      return (
//           <aside className="w-64 border-r border-border-default bg-bg-surface flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen">
//                {/* Logo Section */}
//                <div className="p-6">
//                     <div className="flex items-center gap-2 text-accent font-bold text-xl">
//                          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-text-inverse">
//                               <ListTodo size={20} />
//                          </div>
//                          <span className="tracking-tight text-text-primary">ProManage</span>
//                     </div>
//                </div>

//                {/* Role-based Navigation Menu */}
//                <nav className="flex-1 px-4 space-y-1">
//                     {roleMenuItems.map((item, index) => (
//                          <NavItem key={index} item={item} />
//                     ))}
//                </nav>

//                {/* User Profile Section */}
//                <div className="p-4 border-t border-border-default">
//                     <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-subtle transition-colors cursor-pointer">
//                          <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center text-accent font-medium border border-accent/20">
//                               EC
//                          </div>
//                          <div>
//                               <p className="text-sm font-semibold text-text-primary">Emily Chen</p>
//                               <p className="text-xs text-text-muted">{getUserRoleDisplay()}</p>
//                          </div>
//                     </div>
//                </div>
//           </aside>
//      );
// }

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiBriefcase, FiCheckSquare, FiSettings, FiUser } from 'react-icons/fi';
import { ListTodo } from 'lucide-react';
import { useProfile } from '../../../hooks/useProfile';

export default function Sidebar({ userRole = '' }) {
     const pathname = usePathname();
     const { user, isLoading } = useProfile(); // Check if your hook provides a loading state
     console.log("User Name:", user?.name || "Guest");

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
               { name: 'Tasks Control', icon: FiCheckSquare, path: '/team-lead/tasks' },
               { name: 'My Developers', icon: FiUsers, path: '/team-lead/my-developers' },
               { name: 'Approvals', icon: FiCheckSquare, path: '/team-lead/approvals' },
               { name: 'Report Issues', icon: FiUsers, path: '/team-lead/report-issues' },
               { name: 'Profile', icon: FiUser, path: '/team-lead/profile' }
          ],
          DEVELOPER: [
               { name: 'Dashboard', icon: FiHome, path: '/developer' },
               { name: 'My Tasks', icon: FiCheckSquare, path: '/developer/tasks' },
               { name: 'Projects', icon: FiBriefcase, path: '/developer/projects' },
               { name: 'Profile', icon: FiUser, path: '/developer/profile' }
          ]
     };

     const roleMenuItems = menuItems[userRole] || [];

     const NavItem = ({ item }) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
               <Link
                    href={item.path}
                    className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${isActive
                         ? 'text-accent md:bg-accent md:text-text-inverse'
                         : 'text-text-muted hover:text-accent md:hover:bg-bg-subtle'
                         }`}
               >
                    <Icon size={20} />
                    {/* Hide text on mobile */}
                    <span className="text-[10px] md:text-sm font-medium hidden md:block">{item.name}</span>
               </Link>
          );
     };

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
          // Mobile: Fixed bottom, Desktop: Sticky left
          <aside className="fixed bottom-0 left-0 w-full z-50 bg-bg-surface border-t border-border-default 
                            md:w-64 md:h-screen md:sticky md:top-0 md:border-r md:border-t-0 md:flex md:flex-col">

               {/* Logo Section (Hidden on Mobile) */}
               <div className="hidden md:block p-6">
                    <div className="flex items-center gap-2 text-accent font-bold text-xl">
                         <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-text-inverse">
                              <ListTodo size={20} />
                         </div>
                         <span className="tracking-tight text-text-primary">ProManage</span>
                    </div>
               </div>

               {/* Role-based Navigation Menu (Horizontal on mobile, Vertical on desktop) */}
               <nav className="flex-1 flex flex-row md:flex-col md:px-4 justify-around md:justify-start md:gap-y-2">
                    {roleMenuItems.map((item, index) => (
                         <NavItem key={index} item={item} />
                    ))}
               </nav>

               {/* User Profile Section (Hidden on Mobile) */}
               <div className="hidden md:block p-4 border-t border-border-default">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-subtle transition-colors cursor-pointer">
                         <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center text-accent font-medium border border-accent/20">
                              {
                                   user?.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .substring(0, 2)
                              }
                         </div>
                         <div>
                              <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                              <p className="text-xs text-text-muted">{user?.role}</p>
                         </div>
                    </div>
               </div>
          </aside>
     );
}