import React from 'react';
import { useStreaks } from '../hooks/useStreaks';
import { Flame } from 'lucide-react';

export const StreakCounter: React.FC = () => {
  const streak = useStreaks();

  if (streak === 0) return null;

  return (
    <div className="glass dark:glass-dark px-4 py-2 rounded-xl flex items-center gap-2 text-orange-500 font-bold animate-in slide-in-from-right duration-500">
      <Flame size={20} className="animate-pulse" fill="currentColor" />
      <span>{streak} Day Streak!</span>
    </div>
  );
};
