import React from 'react';
import { motion } from 'framer-motion';
import { useAppTheme } from '../../store/ThemeContext';

export const AuroraBackground: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--bg-color)] pointer-events-none transition-colors duration-1000">
      {/* Aurora Orbs */}
      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, 150, 200, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-start to-transparent blur-[120px] opacity-20"
      />
      
      <motion.div
        animate={{
          x: [0, -200, 100, 0],
          y: [0, 100, -150, 0],
          scale: [1, 1.1, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-end to-transparent blur-[100px] opacity-15"
      />
      
      <motion.div
        animate={{
          x: [0, 150, -150, 0],
          y: [0, -100, 50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-accent-start to-transparent blur-[140px] opacity-15"
      />

      {/* Theme-Specific Effects */}
      <div className="absolute inset-0 z-0">
         {/* Theme 1: Cosmic Particles */}
         {theme === 'cosmic' && Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-slow" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s` }} />
         ))}

         {/* Theme 2: Ocean Waves */}
         {theme === 'ocean' && (
            <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20 overflow-hidden">
               <div className="absolute bottom-0 w-[200%] h-full bg-gradient-to-t from-cyan-500 to-transparent animate-wave opacity-50" style={{ borderRadius: '40% 45% 0 0' }} />
               <div className="absolute bottom-[-10%] w-[200%] h-full bg-gradient-to-t from-blue-600 to-transparent animate-wave opacity-30" style={{ borderRadius: '35% 50% 0 0', animationDelay: '-5s' }} />
            </div>
         )}

         {/* Theme 3: Sunset Embers */}
         {theme === 'sunset' && Array.from({ length: 30 }).map((_, i) => (
            <motion.div 
               key={i} 
               animate={{ y: [0, -500], opacity: [0, 1, 0], x: [0, Math.random() * 50 - 25] }}
               transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 5 }}
               className="absolute w-1.5 h-1.5 bg-orange-500 rounded-full blur-[1px]"
               style={{ bottom: '-10px', left: `${Math.random() * 100}%` }}
            />
         ))}

         {/* Theme 4: Forest Leaves */}
         {theme === 'forest' && Array.from({ length: 15 }).map((_, i) => (
            <motion.div 
               key={i} 
               animate={{ y: [-20, 800], x: [0, Math.random() * 100 - 50], rotate: [0, 360] }}
               transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 10 }}
               className="absolute text-emerald-500/20 text-2xl"
               style={{ top: '-50px', left: `${Math.random() * 100}%` }}
            >
               🍃
            </motion.div>
         ))}

         {/* Theme 5: Neon Scanlines */}
         {theme === 'inferno' && (
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,4px_100%] pointer-events-none" />
         )}
      </div>

      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
