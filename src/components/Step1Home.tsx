import React from 'react';
import { Station } from '../types';
import { motion } from 'motion/react';
import { UploadCloud, CheckCircle2, ArrowRight, Shield, Zap, Sparkles, FileText, Smartphone } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Step1HomeProps {
  station: Station;
  onStartUpload: () => void;
  onOpenStationModal: () => void;
}

export const Step1Home: React.FC<Step1HomeProps> = ({
  station,
  onStartUpload,
  onOpenStationModal,
}) => {
  const handleUploadClick = () => {
    soundEffects.playClick();
    onStartUpload();
  };

  return (
    <motion.div
      id="screen-1-home"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-between min-h-[calc(100vh-80px)] max-w-md mx-auto px-5 py-6"
    >
      {/* Top Section: Branding & Slogan */}
      <div className="w-full text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100/80 mb-1">
          <Zap className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
          <span>Under 60 seconds • No sign up needed</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          QuickPrint
        </h1>

        <p className="text-base text-slate-600 font-medium tracking-tight">
          &ldquo;Scan. Upload. Pay. Print.&rdquo;
        </p>
      </div>

      {/* Center Section: Physical Station Status Card */}
      <div className="w-full my-6">
        <div
          id="station-card"
          onClick={onOpenStationModal}
          className="w-full bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden group"
        >
          {/* Subtle accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span>📍 Connected Station</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {station.name}
              </h2>
              <p className="text-xs text-slate-500 line-clamp-1 font-normal">
                {station.location}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Printer Online</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600">
                Ready to print
              </span>
            </div>
          </div>

          {/* Quick specs pill row */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <span className="font-medium text-slate-400">Model:</span>
              <span className="font-semibold text-slate-700 truncate max-w-[130px]">{station.model}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600 font-semibold text-[11px]">
              <span>Tap to switch</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* 4 Steps visual flow micro-strip */}
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-100/80 rounded-xl p-2 border border-slate-200/50 flex flex-col items-center">
            <Smartphone className="w-4 h-4 text-blue-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-700">1. Scan QR</span>
          </div>
          <div className="bg-slate-100/80 rounded-xl p-2 border border-slate-200/50 flex flex-col items-center">
            <FileText className="w-4 h-4 text-blue-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-700">2. Upload</span>
          </div>
          <div className="bg-slate-100/80 rounded-xl p-2 border border-slate-200/50 flex flex-col items-center">
            <Zap className="w-4 h-4 text-blue-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-700">3. Pay UPI</span>
          </div>
          <div className="bg-slate-100/80 rounded-xl p-2 border border-slate-200/50 flex flex-col items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-700">4. Collect</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Primary Action & Constraints */}
      <div className="w-full space-y-4 pb-2">
        <button
          id="upload-document-main-btn"
          onClick={handleUploadClick}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <UploadCloud className="w-6 h-6" />
          <span>Upload Document</span>
        </button>

        {/* Requirements info */}
        <div className="text-center space-y-1">
          <p className="text-xs font-semibold text-slate-600">
            PDF, JPG, PNG supported
          </p>
          <p className="text-[11px] text-slate-400">
            Maximum file size: 20 MB • Instant local spooling
          </p>
        </div>
      </div>
    </motion.div>
  );
};
