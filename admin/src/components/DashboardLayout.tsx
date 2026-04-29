"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Bell,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface NavItemProps {
  href: string;
  icon: any;
  label: string;
  active: boolean;
  isOpen: boolean;
  onClick: () => void;
}

const NavItem = ({ href, icon: Icon, label, active, isOpen, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative",
      active 
        ? "bg-emerald-600 text-white shadow-sm" 
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
    )}
  >
    <Icon className={cn("w-5 h-5 shrink-0", active ? "" : "group-hover:scale-110 transition-transform")} />
    {isOpen && <span className="ml-3 font-medium transition-opacity duration-300">{label}</span>}
    {!isOpen && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] whitespace-nowrap">
        {label}
      </div>
    )}
  </button>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      router.push('/login');
    } else {
      setUsername(storedUsername || 'Usuario');
      setIsAuthenticated(true);
    }
    setLoading(false);
    
    // Handle responsive sidebar initial state
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [router]);

  if (loading) return null; // O un spinner profesional
  if (!isAuthenticated && pathname !== '/login') return null;

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Resumen' },
    { href: '/dashboard/clients', icon: Users, label: 'Clientes' },
    { href: '/dashboard/products', icon: Package, label: 'Productos' },
    { href: '/dashboard/quotations', icon: FileText, label: 'Cotizaciones' },
  ];

  const navigateTo = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-[70] transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-20",
        isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-full flex flex-col p-4 relative">
          <div className="flex items-center space-x-3 px-2 mb-10 overflow-hidden">
            <div className="bg-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="text-white w-5 h-5" />
            </div>
            {isSidebarOpen && <span className="font-bold text-xl text-slate-800 dark:text-white truncate">QuotationJS</span>}
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                active={pathname === item.href}
                isOpen={isSidebarOpen || isMobileMenuOpen}
                onClick={() => navigateTo(item.href)}
              />
            ))}
          </nav>

          <div className="pt-4 mt-auto space-y-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all group"
            >
              <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-180 transition-transform duration-500" />
              {(isSidebarOpen || isMobileMenuOpen) && <span className="ml-3 font-medium">Cerrar Sesión</span>}
            </button>
          </div>
          
          {/* Toggle button for desktop sidebar */}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex absolute -right-3 top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1 text-slate-400 hover:text-emerald-600 shadow-sm z-[80]"
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 rotate-180" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300 min-w-0",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Topbar */}
        <header className="h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Panel Administrativo</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
            </button>
            
            <div className="h-8 w-px bg-slate-200 dark:border-slate-800" />
            
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none">{username}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase mt-1">Admin</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 w-9 h-9 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm">
                <UserIcon className="text-slate-500 dark:text-slate-400 w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
