import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, LayoutDashboard, BarChart2, Award, LogOut } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { to: '/analytics', label: 'Analytics',  icon: <BarChart2 className="w-4 h-4" /> },
  { to: '/badges',    label: 'Badges',     icon: <Award className="w-4 h-4" /> },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center glow-purple-sm">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span
            className="text-lg font-bold gradient-text tracking-tight hidden sm:block"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            DailyXP
          </span>
        </NavLink>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              {icon}
              <span className="hidden sm:block">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
            <span className="text-xs text-slate-500">Lv {user?.level} · {user?.xp} XP</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
