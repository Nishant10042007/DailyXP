import React, { useEffect, useState } from 'react';
import { BADGE_CONFIG } from './BadgeCard';
import { Sparkles } from 'lucide-react';

/**
 * Animated modal that appears when a new badge is earned.
 * Accepts: badgeName (string | null), onClose callback
 */
const BadgeUnlockModal = ({ badgeName, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (badgeName) {
      setVisible(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 400); // Wait for exit animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [badgeName]);

  const badgeInfo = BADGE_CONFIG.find((b) => b.name === badgeName);

  if (!badgeName || !badgeInfo) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        transition-all duration-400
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => { setVisible(false); setTimeout(onClose, 400); }}
      />

      {/* Modal */}
      <div
        className={`
          relative z-10 glass rounded-3xl p-10 text-center max-w-sm mx-4
          border ${badgeInfo.border} shadow-2xl ${badgeInfo.glow}
          transition-all duration-500
          ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}
        `}
      >
        {/* Sparkle top */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center glow-purple">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="text-7xl mb-4 animate-bounce">{badgeInfo.icon}</div>

        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">
          Badge Unlocked!
        </p>
        <h2
          className={`text-2xl font-black mb-2 ${badgeInfo.textColor}`}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {badgeInfo.name}
        </h2>
        <p className="text-slate-400 text-sm">{badgeInfo.description}</p>

        <button
          onClick={() => { setVisible(false); setTimeout(onClose, 400); }}
          className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-sm font-medium transition-colors"
        >
          Awesome! 🎉
        </button>
      </div>
    </div>
  );
};

export default BadgeUnlockModal;
