import React from 'react';
import { motion } from 'framer-motion';

export const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#030712] pointer-events-none">
      {/* Orb 1: Purple */}
      <motion.div
        animate={{
          x: [0, 200, -100, 0],
          y: [0, 150, 200, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[120px]"
      />
      
      {/* Orb 2: Blue */}
      <motion.div
        animate={{
          x: [0, -250, 150, 0],
          y: [0, 200, -100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/12 blur-[100px]"
      />
      
      {/* Orb 3: Cyan */}
      <motion.div
        animate={{
          x: [0, 100, -200, 0],
          y: [0, -150, 100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-cyan-600/12 blur-[140px]"
      />

      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
