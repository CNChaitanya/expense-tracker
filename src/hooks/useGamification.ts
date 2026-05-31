import { useState, useEffect, useCallback } from 'react';
import { triggerConfetti } from '../lib/confetti';

const LEVELS = [
  "Broke Student",
  "Budget Aware",
  "Saver",
  "Investor",
  "Wealth Builder",
  "Financial Guru"
];

const XP_PER_LEVEL = 500;

export const useGamification = () => {
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('user_xp') || '0', 10));
  const [level, setLevel] = useState(() => Math.floor(xp / XP_PER_LEVEL));

  useEffect(() => {
    localStorage.setItem('user_xp', xp.toString());
    const newLevel = Math.floor(xp / XP_PER_LEVEL);
    if (newLevel > level) {
      triggerConfetti();
      setLevel(newLevel);
    }
  }, [xp, level]);

  const addXp = useCallback((amount: number) => {
    setXp(prev => prev + amount);
  }, []);

  const levelName = LEVELS[Math.min(level, LEVELS.length - 1)];
  const nextLevelXp = (level + 1) * XP_PER_LEVEL;
  const progress = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

  return { xp, level, levelName, nextLevelXp, progress, addXp };
};
