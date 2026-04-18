import { LayoutDashboard, Bell, Trophy, Building2, Settings, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

const studentNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: BookOpen, label: 'Academic Notices', active: false },
  { icon: Trophy, label: 'Scholarships', active: false },
  { icon: Building2, label: 'Department Alerts', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

const facultyNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Bell, label: 'Sent Notifications', active: false },
  { icon: Building2, label: 'Department', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

interface SidebarProps {
  role: 'student' | 'faculty';
}

export default function Sidebar({ role }: SidebarProps) {
  const navItems = role === 'student' ? studentNavItems : facultyNavItems;
  const user = role === 'student'
    ? { name: 'Manikandan K V', id: 'ME 2025-29', avatar: 'M' }
    : { name: 'Dr. Selvakumar', title: 'Prof. EIPR', avatar: 'ASK' };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo & Brand */}
      <div className="h-16 px-6 flex items-center border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-semibold">I</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">IRIS</h1>
            <p className="text-[10px] text-muted-foreground -mt-1 tracking-wide">INFORMATION SYSTEM</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <span className="text-primary font-semibold">{user.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {'id' in user ? user.id : user.title}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all relative group ${
                item.active
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              {item.active && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="size-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-[10px] text-muted-foreground text-center">
          © 2026 IRIS • v1.0.0
        </p>
      </div>
    </aside>
  );
}
