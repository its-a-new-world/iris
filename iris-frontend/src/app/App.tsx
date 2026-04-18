import { useState } from 'react';
import { Bell, Search, Plus, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import NotificationModal from './components/NotificationModal';
import AuthPage from '../AuthPage';

export default function App() {
  // 1. New user state to hold the authenticated session
  const [user, setUser] = useState<any>(null);
  
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 2. GATEKEEPER: If no user is logged in, intercept and show AuthPage
  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  // 3. MAIN APP LAYOUT (Only accessible if logged in)
  return (
    <div className="size-full flex bg-background overflow-hidden">
      {/* Sidebar - Dynamically passes the logged-in user's role */}
      <Sidebar role={user.role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm bg-card/95">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notices, deadlines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-6">
            
            {/* User Profile Info (Replaces manual role toggle) */}
            <div className="flex items-center gap-3 border-r border-border pr-4 hidden md:flex">
              <div className="text-right">
                <p className="text-sm font-bold leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role} • {user.department}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={() => setUser(null)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="size-5" />
              <span className="text-sm font-medium hidden sm:block">Logout</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
              <Bell className="size-5 text-foreground" />
              <span className="absolute top-1 right-1 size-2 bg-urgent rounded-full" />
            </button>

            {/* New Notification Button (Faculty only) */}
            {user.role === 'faculty' && (
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
                <Plus className="size-4" />
                <span className="text-sm">New Notice</span>
              </button>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto">
          {user.role === 'student' ? (
            <StudentDashboard searchQuery={searchQuery} onNotificationClick={setSelectedNotification} />
          ) : (
            <FacultyDashboard searchQuery={searchQuery} onNotificationClick={setSelectedNotification} />
          )}
        </main>
      </div>

      {/* Notification Modal */}
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          role={user.role}
        />
      )}
    </div>
  );
}