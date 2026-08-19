import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Printer, Wifi, Sparkles, Send } from 'lucide-react';
import { Station } from '../types';

interface Step5SuccessProps {
  amount: number;
  station: Station;
  onAutoTransition: () => void;
}

export const Step5Success: React.FC<Step5SuccessProps> = ({
  amount,
  station,
  onAutoTransition,
}) => {
  useEffect(() => {
    // Automatically transition to printing status in ~1.8 seconds without requiring another button
    const timer = setTimeout(() => {
      onAutoTransition();
    }, 1900);
    return () => clearTimeout(timer);
  }, [onAutoTransition]);

  return (
    <motion.div
      id="screen-5-payment-success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] max-w-md mx-auto px-6 py-8 text-center"
    >
      {/* Animated Success Checkmark Ring */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-6 relative"
      >
        <Check className="w-12 h-12 stroke-[3.5]" />
        
        {/* Pulsing ring animation */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-emerald-400"
          animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>

      {/* Main Success Title & Amount */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Payment successful
        </h1>
        <p className="text-sm font-semibold text-emerald-600">
          ₹{amount} received via UPI
        </p>
      </motion.div>

      {/* Cloud Dispatch Animation to Physical Station */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-8 w-full max-w-xs bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between px-2">
          {/* Phone Icon */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">Phone</span>
          </div>

          {/* Animated Connecting Line */}
          <div className="flex-1 mx-3 flex items-center justify-center relative">
            <div className="w-full h-0.5 bg-slate-200" />
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-blue-600 shadow-xs"
              animate={{ x: [-40, 40] }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            />
          </div>

          {/* Printer Icon */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">Printer</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span>Sending your document to the printer...</span>
        </div>
      </motion.div>

      <p className="mt-6 text-xs text-slate-400 font-medium">
        Connecting to {station.name}...
      </p>
    </motion.div>
  );
};
