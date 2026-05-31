import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#aa3bff', '#9333ea', '#22c55e', '#f97316', '#3b82f6']
  });
};
