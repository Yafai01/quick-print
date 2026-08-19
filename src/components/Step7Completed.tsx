import React, { useEffect, useState } from 'react';
import { PrintJob } from '../types';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  Printer, 
  RotateCcw, 
  Copy, 
  CheckCheck, 
  Download, 
  Share2, 
  FileText, 
  MapPin, 
  Receipt,
  Sparkles 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Step7CompletedProps {
  job: PrintJob;
  onPrintAnother: () => void;
}

export const Step7Completed: React.FC<Step7CompletedProps> = ({
  job,
  onPrintAnother,
}) => {
  const [copied, setCopied] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    // Fire festive college celebration confetti
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#6366f1', '#f59e0b'],
      });
    } catch {
      // Fallback if canvas confetti fails in restricted env
    }
  }, []);

  const handleCopyJobId = () => {
    soundEffects.playClick();
    navigator.clipboard?.writeText(job.jobId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintAnotherClick = () => {
    soundEffects.playClick();
    onPrintAnother();
  };

  const totalPages = job.settings.effectivePages * job.settings.copies;

  return (
    <motion.div
      id="screen-7-completed"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col justify-between min-h-[calc(100vh-80px)] max-w-md mx-auto px-5 py-5"
    >
      <div className="text-center space-y-4">
        {/* Large Success Checkmark Badge */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="w-20 h-20 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/25"
        >
          <Check className="w-10 h-10 stroke-[3.5]" />
        </motion.div>

        {/* Headings as requested in spec */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Print complete!
          </h1>
          <p className="text-base font-semibold text-emerald-600">
            Please collect your document.
          </p>
        </div>

        {/* Completed Job Details Card (as specified in prompt) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs text-left space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]" title={job.file.name}>
                {job.file.name}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              ₹{job.payment.amount} paid
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Pages printed:</span>
              <span className="font-bold text-slate-800">{totalPages} pages ({job.settings.copies} copy)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Print Mode:</span>
              <span className="font-bold text-slate-800">
                {job.settings.printMode === 'bw' ? 'Black & White' : 'Color'} ({job.settings.paperSize})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Printer Location:</span>
              <span className="font-bold text-slate-800 truncate block">{job.station.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Time:</span>
              <span className="font-bold text-slate-800">{job.payment.timestamp}</span>
            </div>
          </div>

          {/* Job ID Row with Copy */}
          <div className="mt-2 pt-2.5 border-t border-dashed border-slate-200 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Job ID
              </span>
              <span className="font-mono-code font-bold text-sm text-slate-900">
                {job.jobId}
              </span>
            </div>

            <button
              id="copy-job-id-btn"
              onClick={handleCopyJobId}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Digital Slip / Receipt Accordion toggle */}
        <div>
          <button
            id="toggle-digital-receipt-btn"
            onClick={() => setShowReceipt(!showReceipt)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 py-1"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{showReceipt ? 'Hide payment receipt' : 'View digital payment receipt'}</span>
          </button>

          {showReceipt && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono-code space-y-1 text-left border border-slate-200"
            >
              <div className="flex justify-between">
                <span>TXN REF:</span>
                <span>{job.payment.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>PAYMENT VPA:</span>
                <span>{job.payment.upiId || 'upi@bank'}</span>
              </div>
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-emerald-600 font-bold">SUCCESSFUL</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Primary Action: Print Another Document */}
      <div className="space-y-3 pt-6 pb-2 text-center">
        <button
          id="print-another-document-btn"
          onClick={handlePrintAnotherClick}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Print Another Document</span>
        </button>

        {/* Secondary text as mandated in spec */}
        <p className="text-xs text-slate-500 font-medium">
          Thank you for using QuickPrint.
        </p>
      </div>
    </motion.div>
  );
};
