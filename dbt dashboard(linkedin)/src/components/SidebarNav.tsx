import React from 'react';
import { Home, MessageSquare, BarChart3, Calendar, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: Home, text: 'Home', page: 'Home' },
  { icon: Home, text: 'Approval', page: 'Automate' },
  { icon: MessageSquare, text: 'Chat', page: 'Chat' },
  { icon: BarChart3, text: 'Analytics', page: 'Analytics' },
  { icon: Calendar, text: 'Calendar', page: 'Calendar' },
  { icon: FileText, text: 'Articles', page: 'Articles' },
  { icon: FileText, text: 'Blogs', page: 'Blogs' },
  { icon: FileText, text: 'Templates', page: 'Templates' },
];

interface SidebarNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activePage,
  setActivePage,
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  return (
    <aside
      className={`bg-slate-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between">
        {!sidebarCollapsed && <h1 className="text-xl font-bold text-gray-800">DBT Social</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="ml-auto"
        >
          {sidebarCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.page;
            return (
              <li key={item.page}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActivePage(item.page)}
                >
                  <Icon className="h-5 w-5" />
                  {!sidebarCollapsed && <span className="ml-3">{item.text}</span>}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
          <Settings className="h-5 w-5" />
          {!sidebarCollapsed && <span className="ml-3">Settings</span>}
        </Button>
      </div>
    </aside>
  );
};

export default SidebarNav;
