import React, { useState, useEffect } from 'react';
import { UploadedFile, PrintSettings, Station } from '../types';
import { PrinterIllustration } from './PrinterIllustration';
import { motion } from 'motion/react';
import { Printer, MapPin, Sparkles, FileText, CheckCircle } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Step6PrintingProps {
  file: UploadedFile;
  station: Station;
  settings: PrintSettings;
  onPrintComplete: () => void;
}

export const Step6Printing: React.FC<Step6PrintingProps> = ({
  file,
  station,
  settings,
  onPrintComplete,
}) => {
  const totalPages = settings.effectivePages * settings.copies;
  const [currentPage, setCurrentPage] = useState(1);
  const [progressPercent, setProgressPercent] = useState(8);

  useEffect(() => {
    // Dynamic page by page print simulation
    const totalDurationMs = Math.max(3500, Math.min(8000, totalPages * 650));
    const intervalTime = totalDurationMs / totalPages;

    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        if (prevPage < totalPages) {
          const nextPage = prevPage + 1;
          const nextPercent = Math.round((nextPage / totalPages) * 100);
          setProgressPercent(nextPercent);
          return nextPage;
        } else {
          clearInterval(interval);
          setProgressPercent(100);
          soundEffects.playPrintDone();
          setTimeout(() => {
            onPrintComplete();
          }, 800);
          return totalPages;
        }
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [totalPages, onPrintComplete]);

  return (
    <motion.div
      id="screen-6-printing"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col justify-between min-h-[calc(100vh-80px)] max-w-md mx-auto px-5 py-5"
    >
      <div className="space-y-4">
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Job Active • Physical Spooling</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
            Your document is printing
          </h1>
        </div>

        {/* Animated Printer Graphic */}
        <div className="py-2">
          <PrinterIllustration
            isPrinting={true}
            currentPage={currentPage}
            totalPages={totalPages}
            printMode={settings.printMode}
          />
        </div>

        {/* Printing Status Details Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3.5">
          {/* Document & Station Details */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-slate-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {totalPages} {totalPages === 1 ? 'page' : 'pages'} • {settings.printMode === 'bw' ? 'Black & White' : 'Full Color'}
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Printing</span>
            </div>
          </div>

          {/* Connected Printer Name */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="text-slate-400 font-medium">Printer:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {station.name}
            </span>
          </div>

          {/* Progress Bar & Page Counter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500 font-medium">
                Current page: <strong className="text-slate-900 font-mono-code">{currentPage} / {totalPages}</strong>
              </span>
              <span className="text-blue-600 font-mono-code">{progressPercent}%</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Instructions (small message as requested in spec) */}
      <div className="text-center pt-4 pb-2">
        <div className="p-3 bg-blue-50 border border-blue-200/70 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-center gap-2 shadow-2xs">
          <Printer className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Please collect your printout from the printer.</span>
        </div>
      </div>
    </motion.div>
  );
};
