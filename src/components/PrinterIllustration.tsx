import React from 'react';
import { motion } from 'motion/react';

interface PrinterIllustrationProps {
  isPrinting?: boolean;
  currentPage?: number;
  totalPages?: number;
  printMode?: 'bw' | 'color';
}

export const PrinterIllustration: React.FC<PrinterIllustrationProps> = ({
  isPrinting = false,
  currentPage = 1,
  totalPages = 12,
  printMode = 'bw',
}) => {
  return (
    <div id="printer-illustration-container" className="relative w-full max-w-[280px] h-[220px] mx-auto flex items-center justify-center">
      {/* Top Input Paper Tray (stack of clean papers) */}
      <div className="absolute top-2 w-36 h-12 bg-white rounded-t-sm border border-slate-300 shadow-sm flex flex-col items-center justify-start overflow-hidden transform -translate-y-1">
        <div className="w-full h-1 bg-slate-200" />
        <div className="w-28 h-px bg-slate-200 mt-2" />
        <div className="w-24 h-px bg-slate-200 mt-1" />
        {/* Paper feeder sheet going down */}
        {isPrinting && (
          <motion.div
            className="w-28 h-8 bg-blue-50/50 border-t border-blue-200"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Main Printer Body */}
      <div className="relative z-10 w-64 h-36 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-3 flex flex-col justify-between">
        {/* Top Control Bar & LED */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-300 uppercase">
              {isPrinting ? 'Laser Active' : 'Station Ready'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
              printMode === 'color' ? 'bg-indigo-900 text-indigo-200 border border-indigo-500' : 'bg-slate-700 text-slate-200'
            }`}>
              {printMode === 'color' ? 'CMYK' : 'MONO'}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </div>
        </div>

        {/* Laser / Scanner Scanline Bar (visible while printing) */}
        {isPrinting && (
          <div className="relative w-full h-1 bg-slate-900 rounded overflow-hidden">
            <motion.div
              className={`h-full w-12 ${printMode === 'color' ? 'bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400' : 'bg-blue-400'} rounded-full shadow-sm`}
              animate={{ x: [-20, 220, -20] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
            />
          </div>
        )}

        {/* Paper Output Slot */}
        <div className="relative w-full h-3 bg-slate-950 rounded-sm border border-slate-900 shadow-inner flex items-center justify-center overflow-visible">
          {/* Animated Printed Paper Ejection */}
          {isPrinting ? (
            <motion.div
              key={currentPage}
              initial={{ y: -8, opacity: 0.7, scaleY: 0.3 }}
              animate={{ y: 22, opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute top-2 w-40 bg-white border border-slate-200 rounded-b shadow-lg p-2 flex flex-col gap-1 z-20"
            >
              {/* Render simulated printed document lines on paper */}
              <div className="flex items-center justify-between mb-0.5">
                <div className={`h-1 rounded ${printMode === 'color' ? 'w-12 bg-blue-500' : 'w-12 bg-slate-600'}`} />
                <span className="text-[8px] font-mono text-slate-400 font-bold">p.{currentPage}</span>
              </div>
              <div className="w-full h-0.5 bg-slate-300 rounded" />
              <div className="w-4/5 h-0.5 bg-slate-300 rounded" />
              <div className="w-3/4 h-0.5 bg-slate-300 rounded" />
              {printMode === 'color' && (
                <div className="w-full h-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded my-0.5 flex items-center justify-center">
                  <div className="w-4 h-1.5 bg-blue-400 rounded-sm" />
                </div>
              )}
              <div className="w-full h-0.5 bg-slate-200 rounded" />
            </motion.div>
          ) : (
            <div className="w-36 h-1 bg-slate-800 rounded" />
          )}
        </div>

        {/* Bottom Status Branding */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-1">
          <span>HP LaserJet Enterprise</span>
          <span>{currentPage}/{totalPages}</span>
        </div>
      </div>

      {/* Output Catcher Tray (bottom tray holding stacked finished prints) */}
      <div className="absolute -bottom-2 w-48 h-10 bg-slate-700/80 rounded-b-lg border-b-2 border-slate-600 shadow-md flex items-end justify-center pb-1">
        <div className="w-40 h-1 bg-slate-600 rounded-full" />
      </div>
    </div>
  );
};
