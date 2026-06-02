import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check, Sparkles } from 'lucide-react';
import { playSound } from '../lib/sounds';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Add your first expense",
    description: "Use the large '+' button at the bottom right to record a new transaction. You can even attach receipts!",
    target: "fab-button",
    icon: "💸"
  },
  {
    title: "Set monthly budgets",
    description: "Head over to the Budgets tab to set limits for each category and track your progress.",
    target: "nav-budgets",
    icon: "📊"
  },
  {
    title: "Spending Insights",
    description: "Check your dashboard for AI-generated insights and your current financial health score.",
    target: "dashboard-insights",
    icon: "💡"
  },
  {
    title: "Ask your AI Coach",
    description: "Need advice? Chat with your AI Financial Coach for personalized savings strategies.",
    target: "nav-coach",
    icon: "🤖"
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      playSound('add');
    } else {
      onComplete();
      playSound('success');
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass max-w-md w-full p-10 rounded-[40px] shadow-2xl border border-white/10 relative overflow-hidden text-center space-y-8"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-start/10 blur-[60px] rounded-full" />
        
        <div className="space-y-4">
           <div className="text-6xl mb-4">{step.icon}</div>
           <h2 className="text-3xl font-black text-white leading-tight">{step.title}</h2>
           <p className="text-gray-400 font-medium leading-relaxed">{step.description}</p>
        </div>

        <div className="flex flex-col gap-4">
           <button 
             onClick={handleNext}
             className="w-full py-5 bg-gradient-to-r from-primary-start to-primary-end text-white font-black rounded-2xl shadow-xl shadow-primary-start/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
           >
              {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next Step'} 
              {currentStep === STEPS.length - 1 ? <Check size={20} /> : <ChevronRight size={20} />}
           </button>
           
           <div className="flex justify-center gap-2">
              {STEPS.map((_, i) => (
                 <div 
                   key={i} 
                   className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-primary-start' : 'w-2 bg-white/10'}`} 
                 />
              ))}
           </div>
        </div>

        {currentStep === 0 && (
           <motion.div 
             animate={{ scale: [1, 1.1, 1] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-start flex items-center justify-center gap-2"
           >
              <Sparkles size={12} /> New Experience Unlocked
           </motion.div>
        )}
      </motion.div>
    </div>
  );
};
