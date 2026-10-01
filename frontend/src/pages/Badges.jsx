import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import BadgeCard, { BADGE_CONFIG } from '../components/BadgeCard';
import { Trophy, Zap, Star, TrendingUp } from 'lucide-react';

const Badges = () => {
  const { user, api } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/stats/dashboard')
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const earnedBadges = user?.badges || stats?.badges || [];
  const xp     = user?.xp    || stats?.totalXP || 0;
  const level  = user?.level || stats?.level   || 1;
  const xpForNextLevel = level * 100;
  const xpProgress = Math.min((xp / xpForNextLevel) * 100, 100);

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="animate-fade-in-up">
        <p className="text-slate-500 text-sm uppercase tracking-widest mb-1">Gamification</p>
        <h1 className="text-3xl font-bold text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Badges & Level
        </h1>
        <p className="text-slate-500 mt-1">Earn badges by hitting streak milestones</p>
      </div>

      {/* Level card */}
      <div className="glass rounded-2xl p-6 border border-brand-500/20 glow-purple-sm animate-fade-in-up-delay-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Big level number */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/30 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Level</span>
              <span className="text-4xl font-black gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {level}
              </span>
            </div>
            <div>
              <p className="text-slate-300 font-semibold text-lg">
                {level < 5 ? 'Beginner' : level < 10 ? 'Intermediate' : level < 20 ? 'Advanced' : 'Elite'} Explorer
              </p>
              <p className="text-slate-500 text-sm">{earnedBadges.length} badges earned · {xp} XP total</p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-brand-400" />
                {xp} XP
              </span>
              <span className="text-slate-500">{xpForNextLevel} XP to Level {level + 1}</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in-up-delay-2">
        {[
          { icon: <Trophy className="w-5 h-5" />, label: 'Badges Earned',  value: earnedBadges.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { icon: <Star className="w-5 h-5" />,   label: 'Total Badges',   value: BADGE_CONFIG.length,  color: 'text-slate-300',  bg: 'bg-slate-500/10' },
          { icon: <Zap className="w-5 h-5" />,    label: 'Total XP',       value: xp,                  color: 'text-brand-400',  bg: 'bg-brand-500/10' },
          { icon: <TrendingUp className="w-5 h-5" />, label: 'Current Level', value: level,             color: 'text-accent-400', bg: 'bg-accent-500/10' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5 text-center">
            <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mx-auto mb-2`}>
              {s.icon}
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="animate-fade-in-up-delay-3">
        <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          All Badges ({earnedBadges.length}/{BADGE_CONFIG.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {BADGE_CONFIG.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={earnedBadges.includes(badge.name)}
            />
          ))}
        </div>
      </div>

      {/* How to earn */}
      <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up">
        <h2 className="font-semibold text-slate-200 mb-4">How Points & Levels Work</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-400">
          <div className="space-y-2">
            <p className="font-medium text-slate-300">🎯 Earning XP</p>
            <ul className="space-y-1 text-slate-500">
              <li>• Easy habit: 10 XP base</li>
              <li>• Medium habit: 20 XP base</li>
              <li>• Hard habit: 30 XP base</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-slate-300">🔥 Streak Multipliers</p>
            <ul className="space-y-1 text-slate-500">
              <li>• 3+ day streak → 1.5× XP</li>
              <li>• 7+ day streak → 2× XP</li>
              <li>• 30+ day streak → 3× XP</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-slate-300">⚡ Leveling Up</p>
            <ul className="space-y-1 text-slate-500">
              <li>• Level = floor(totalXP / 100) + 1</li>
              <li>• Every 100 XP = 1 level</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-slate-300">🏅 Badge Milestones</p>
            <ul className="space-y-1 text-slate-500">
              {BADGE_CONFIG.map((b) => (
                <li key={b.id}>• {b.requirement} days → {b.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Account management */}
      <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up">
        <h2 className="font-semibold text-slate-200 mb-6">Account Management</h2>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-xl font-bold text-white shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-100">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action is permanent and will delete all your habits, logs, and progress.')) {
                  api.delete('/auth/me').then(() => {
                    localStorage.removeItem('dailyxp_token');
                    window.location.href = '/login';
                  });
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium transition-all border border-red-500/20"
            >
              Delete Account
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('dailyxp_token');
                window.location.href = '/login';
              }}
              className="px-6 py-2.5 rounded-xl glass hover:bg-white/5 text-slate-300 text-sm font-medium transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;
