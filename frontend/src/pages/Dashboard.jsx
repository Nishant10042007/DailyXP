import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { HabitCard } from '../components/HabitCard';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import BadgeUnlockModal from '../components/BadgeUnlockModal';
import { BADGE_CONFIG } from '../components/BadgeCard';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trophy, Flame, Target, Zap, Sparkles, Award, ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const { user, setUser, api } = useContext(AuthContext);
  const navigate = useNavigate();

  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('medium');

  // XP float toast
  const [xpToast, setXpToast] = useState(null);
  // Badge unlock modal
  const [unlockedBadge, setUnlockedBadge] = useState(null);

  const fetchHabits = async () => {
    try {
      const [habitsRes, logsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/logs'),
      ]);
      const today = new Date().toDateString();
      const todayLogs = logsRes.data.filter(
        (l) => new Date(l.dateCompleted).toDateString() === today
      );
      const completedIds = todayLogs.map((l) => l.habit?._id || l.habit);
      setHabits(
        habitsRes.data.map((h) => ({ ...h, completedToday: completedIds.includes(h._id) }))
      );
    } catch (err) {
      console.error('Failed to fetch habits', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchHabits(); }, []);

  const handleLogHabit = async (habitId) => {
    setIsLogging(habitId);
    try {
      const res = await api.post('/logs', { habitId });
      if (res.data.userStats) {
        const { totalXP, level, xpEarned, newBadge, badges } = res.data.userStats;
        setUser((prev) => ({ 
          ...prev, 
          xp: totalXP, 
          level,
          badges: badges || prev.badges
        }));
        setXpToast(`+${xpEarned} XP`);
        setTimeout(() => setXpToast(null), 2500);
        if (newBadge) {
          setTimeout(() => setUnlockedBadge(newBadge), 600);
        }
      }
      await fetchHabits();
    } catch (err) {
      console.error('Failed to log habit', err);
    } finally {
      setIsLogging(null);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('Delete this habit? This cannot be undone.')) return;
    try {
      await api.delete(`/habits/${habitId}`);
      setHabits((prev) => prev.filter((h) => h._id !== habitId));
    } catch (err) {
      console.error('Failed to delete habit', err);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/habits', {
        title: newTitle,
        description: newDesc,
        difficulty: newDifficulty,
        frequency: 'daily',
      });
      setNewTitle('');
      setNewDesc('');
      setIsAdding(false);
      fetchHabits();
    } catch (err) {
      console.error('Failed to create habit', err);
    }
  };

  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const xpForNextLevel = level * 100;
  const xpProgress = Math.min((xp / xpForNextLevel) * 100, 100);
  const completedToday = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;
  const completionPct = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.currentStreak || 0), 0);
  const earnedBadges = user?.badges || [];

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto">
      {/* Badge Unlock Modal */}
      {unlockedBadge && (
        <BadgeUnlockModal
          badgeName={unlockedBadge}
          onClose={() => setUnlockedBadge(null)}
        />
      )}

      {/* XP Toast */}
      {xpToast && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in-up pointer-events-none">
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl glass glow-purple border border-brand-500/30 text-brand-300 font-bold text-lg">
            <Zap className="w-5 h-5 text-brand-400" fill="currentColor" />
            {xpToast}
          </div>
        </div>
      )}

      {/* Welcome + Level card */}
      <div className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-widest">Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Hey, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-500 mt-1">
              {completionPct === 100 && totalHabits > 0
                ? '🎉 All habits done! You crushed it today.'
                : `${completedToday} of ${totalHabits} habits completed today`}
            </p>
          </div>

          <div className="glass rounded-2xl px-6 py-4 border border-white/7 glow-purple-sm min-w-[220px]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">Level</p>
                <p className="text-3xl font-black gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{level}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-brand-400" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-brand-400" />{xp} XP</span>
                <span>{xpForNextLevel} XP</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in-up-delay-1">
        {[
          { icon: <Target className="w-5 h-5" />, label: 'Today',       value: `${completedToday}/${totalHabits}`, color: 'text-accent-400',  bg: 'bg-accent-500/10' },
          { icon: <Flame className="w-5 h-5" />,  label: 'Best Streak', value: `${bestStreak}🔥`,                  color: 'text-orange-400',  bg: 'bg-orange-500/10' },
          { icon: <Zap className="w-5 h-5" />,    label: 'Total XP',    value: xp,                                 color: 'text-brand-400',   bg: 'bg-brand-500/10' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5 text-center">
            <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mx-auto mb-2`}>{s.icon}</div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main 3-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up-delay-2">

        {/* Habits */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Your Habits
            </h2>
            <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? 'secondary' : 'primary'} className="text-sm">
              {isAdding ? 'Cancel' : <><Plus className="w-4 h-4 mr-1" /> New Habit</>}
            </Button>
          </div>

          {/* Create form */}
          {isAdding && (
            <div className="glass rounded-2xl p-6 border border-brand-500/20 glow-purple-sm animate-fade-in-up">
              <h3 className="text-base font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" /> Create New Habit
              </h3>
              <form onSubmit={handleCreateHabit} className="space-y-4">
                <Input label="Habit name" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Read for 20 minutes" required />
                <Input label="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Why is this habit important?" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-400">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ val: 'easy', label: 'Easy', xp: '10 XP', cls: 'badge-easy' }, { val: 'medium', label: 'Medium', xp: '20 XP', cls: 'badge-medium' }, { val: 'hard', label: 'Hard', xp: '30 XP', cls: 'badge-hard' }].map((d) => (
                      <button key={d.val} type="button" onClick={() => setNewDifficulty(d.val)}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${newDifficulty === d.val ? `${d.cls} scale-105` : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
                        {d.label}
                        <span className="block text-xs opacity-70">{d.xp}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <Button type="submit">Create Habit</Button>
                </div>
              </form>
            </div>
          )}

          {/* Habit list */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-2xl p-5 border border-white/5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/5 rounded-full w-1/2" />
                      <div className="h-3 bg-white/5 rounded-full w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : habits.length === 0 ? (
            <div className="glass rounded-2xl p-12 border border-dashed border-white/10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-brand-400" />
              </div>
              <p className="text-slate-400 font-medium mb-1">No habits yet</p>
              <p className="text-slate-600 text-sm mb-5">Create your first habit to start earning XP</p>
              <Button onClick={() => setIsAdding(true)}><Plus className="w-4 h-4 mr-1" /> Create First Habit</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  onLog={handleLogHabit}
                  isLogging={isLogging === habit._id}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 animate-fade-in-up-delay-3">

          {/* Daily Progress */}
          <div className="glass rounded-2xl p-5 border border-white/5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Daily Progress</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke="url(#cgrad)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - completionPct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                  <defs>
                    <linearGradient id="cgrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-200">{completionPct}%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{completedToday}<span className="text-slate-500 text-base font-normal">/{totalHabits}</span></p>
                <p className="text-xs text-slate-500">habits completed</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Total XP', value: `${xp} XP`, cls: 'gradient-text font-bold' },
                { label: 'Next level at', value: `${xpForNextLevel} XP`, cls: 'text-slate-300 font-semibold' },
                { label: 'Best streak', value: `${bestStreak} 🔥`, cls: 'text-orange-400 font-semibold' },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-white/3 border border-white/5">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className={`text-sm ${r.cls}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges preview */}
          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" /> Badges
              </h3>
              <button
                onClick={() => navigate('/badges')}
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-0.5 transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {earnedBadges.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                Complete a 3-day streak to earn your first badge!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {earnedBadges.map((b) => {
                  const cfg = BADGE_CONFIG.find((x) => x.name === b);
                  return (
                    <div key={b}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-gradient-to-r ${cfg?.color || 'from-slate-500/20 to-slate-500/20'} ${cfg?.border || 'border-white/10'} ${cfg?.textColor || 'text-slate-400'}`}
                      title={b}
                    >
                      <span>{cfg?.icon || '🏅'}</span>
                      <span className="hidden sm:block truncate max-w-[80px]">{b}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* XP Progress */}
          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">XP Progress</h3>
              <span className="text-xs text-brand-400 font-medium">Lv {level}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden mb-2">
              <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>{xp} XP</span><span>{xpForNextLevel} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
