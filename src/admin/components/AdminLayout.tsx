import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  LayoutDashboard, Package, PlusCircle, Tags,
  LogOut, ShoppingBag, Menu, X, ChevronRight,
  Database, ImageIcon, Flame,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/admin' },
  { icon: Package,         label: 'Products',       href: '/admin/products' },
  { icon: PlusCircle,      label: 'Add Product',    href: '/admin/products/new' },
  { icon: Tags,            label: 'Categories',     href: '/admin/categories' },
  { icon: ImageIcon,       label: 'Media Library',  href: '/admin/media' },
  { icon: Database,        label: 'Firebase Setup', href: '/admin/setup' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 flex flex-col
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
        shadow-xl lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-500/30">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm tracking-widest">ZARE</p>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider">Admin CMS</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${active
                    ? 'bg-violet-50 text-violet-700 border border-violet-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3 h-3 text-violet-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-100 space-y-0.5">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Store</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 h-14 gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <Flame className="w-3 h-3 text-orange-500" />
            <span className="text-emerald-700 text-xs font-medium">Firebase Connected</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
