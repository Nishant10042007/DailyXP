import React from 'react';
import { Check, Flame, Award, Zap, Trash2 } from 'lucide-react';

const difficultyConfig = {
  easy:   { label: 'Easy',   cls: 'badge-easy',   xp: 10 },
  medium: { label: 'Medium', cls: 'badge-medium',  xp: 20 },
  hard:   { label: 'Hard',   cls: 'badge-hard',    xp: 30 },
};

export const HabitCard = ({ habit, onLog, isLogging, onDelete }) => {
  const done = habit.completedToday;
  const difficulty = habit.difficulty || 'medium';
  const frequency  = habit.frequency  || 'daily';
  const xpValue    = habit.xpValue    || difficultyConfig[difficulty]?.xp || 20;
  const streak     = habit.currentStreak || habit.streak || 0;
  const diff       = difficultyConfig[difficulty] || difficultyConfig.medium;

  return (
    <div
      className={`
        group relative glass rounded-2xl p-5
        border transition-all duration-300
        ${done
          ? 'border-brand-500/30 bg-brand-500/5'
          : 'border-white/5 hover:border-brand-500/25 hover:bg-white/[0.02]'
        }
        animate-fade-in-up
      `}
    >
      {done && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-transparent to-accent-500/5" />
        </div>
      )}

      <div className="flex items-center gap-4 relative z-10">
        {/* Check Button */}
        <button
          onClick={() => !done && onLog(habit._id)}
          disabled={done || isLogging}
          className={`check-btn ${done ? 'done' : ''}`}
          aria-label={done ? 'Completed' : 'Mark as done'}
        >
          {isLogging ? (
            <svg className="animate-spin w-5 h-5 stroke-brand-400 fill-none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="32" strokeDashoffset="32" />
            </svg>
          ) : (
            <Check className="w-5 h-5" strokeWidth={3} />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-semibold text-base tracking-tight ${done ? 'text-slate-400 line-through decoration-brand-500/50' : 'text-slate-100'}`}>
              {habit.title}
            </h3>
            {streak > 0 && (
              <span className="streak-badge">
                <Flame className="w-3 h-3" />
                {streak}
              </span>
            )}
          </div>

          {habit.description && (
            <p className="text-slate-500 text-sm mt-0.5 truncate">{habit.description}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diff.cls}`}>
              {diff.label}
            </span>
            <span className="text-xs text-slate-500 capitalize">{frequency}</span>
          </div>
        </div>

        {/* XP Badge */}
        <div className={`flex flex-col items-center text-center shrink-0 ${done ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-sm font-bold gradient-text">{xpValue}</span>
          </div>
          <span className="text-[10px] text-slate-600 uppercase tracking-wider">XP</span>
        </div>

        {/* Delete button — visible on hover */}
        {onDelete && (
          <button
            onClick={() => onDelete(habit._id)}
            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
            title="Delete habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {done && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-brand-500 via-accent-400 to-brand-500 opacity-60" />
      )}
    </div>
  );
};
