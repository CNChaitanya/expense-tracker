import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { modalVariants } from '../../lib/animations';

interface LightboxProps {
  image: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
  const [scale, setScale] = React.useState(1);

  const handlePinch = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      // Basic pinch simulation
      const newScale = Math.min(Math.max(distance / 200, 0.5), 3);
      setScale(newScale);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `receipt_${Date.now()}.png`;
    link.click();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        />
        
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
        >
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            <div className="flex gap-2">
              <button onClick={() => setScale(prev => Math.min(prev + 0.5, 3))} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white">
                <ZoomIn size={24} />
              </button>
              <button onClick={() => setScale(prev => Math.max(prev - 0.5, 0.5))} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white">
                <ZoomOut size={24} />
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDownload} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white">
                <Download size={24} />
              </button>
              <button onClick={onClose} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white">
                <X size={24} />
              </button>
            </div>
          </div>

          <motion.img
            src={image}
            alt="Receipt"
            style={{ scale }}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-200"
            onTouchMove={handlePinch}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
