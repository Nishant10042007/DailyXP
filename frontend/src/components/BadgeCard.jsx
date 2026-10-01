import React from 'react';

// All badge definitions with their visual properties
export const BADGE_CONFIG = [
  {
    id: 'starter_flame',
    name: 'Starter Flame 🔥',
    description: 'Complete a 3-day streak',
    requirement: 3,
    icon: '🔥',
    color: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20',
    textColor: 'text-orange-400',
  },
  {
    id: 'consistency_rookie',
    name: 'Consistency Rookie',
    description: 'Maintain a 7-day streak',
    requirement: 7,
    icon: '⭐',
    color: 'from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/20',
    textColor: 'text-yellow-400',
  },
  {
    id: 'rising_ember',
    name: 'Rising Ember',
    description: 'Maintain a 14-day streak',
    requirement: 14,
    icon: '💫',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
    textColor: 'text-pink-400',
  },
  {
    id: 'habit_builder',
    name: 'Habit Builder',
    description: 'Maintain a 21-day streak',
    requirement: 21,
    icon: '🏗️',
    color: 'from-cyan-500/20 to-sky-500/20',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/20',
    textColor: 'text-cyan-400',
  },
  {
    id: 'unbreakable',
    name: 'Unbreakable',
    description: 'Maintain a 30-day streak',
    requirement: 30,
    icon: '💎',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
    glow: 'shadow-violet-500/20',
    textColor: 'text-violet-400',
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Maintain a 60-day streak',
    requirement: 60,
    icon: '⚡',
    color: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
    textColor: 'text-blue-400',
  },
  {
    id: 'legend',
    name: 'Legend 👑',
    description: 'Maintain a 100-day streak',
    requirement: 100,
    icon: '👑',
    color: 'from-amber-400/20 to-yellow-500/20',
    border: 'border-amber-400/40',
    glow: 'shadow-amber-400/30',
    textColor: 'text-amber-400',
  },
];

const BadgeCard = ({ badge, earned }) => (
  <div
    className={`
      relative rounded-2xl p-5 border transition-all duration-300
      ${earned
        ? `bg-gradient-to-br ${badge.color} ${badge.border} shadow-lg ${badge.glow}`
        : 'glass border-white/5 opacity-40 grayscale'
      }
    `}
  >
    {earned && (
      <div className="absolute top-3 right-3">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
          Earned
        </span>
      </div>
    )}
    <div className="text-4xl mb-3">{badge.icon}</div>
    <h3 className={`font-bold text-sm ${earned ? badge.textColor : 'text-slate-500'}`}>
      {badge.name}
    </h3>
    <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
    {!earned && (
      <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
        🔒 Locked
      </div>
    )}
  </div>
);

export default BadgeCard;
