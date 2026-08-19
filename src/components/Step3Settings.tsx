import React from 'react';
import { UploadedFile, PrintSettings, Station } from '../types';
import { calculatePrice, parsePageRange } from '../utils/helpers';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Minus, 
  Plus, 
  FileText, 
  Coins, 
  Sliders, 
  Check,
  Zap,
  Info
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Step3SettingsProps {
  file: UploadedFile;
  station: Station;
  settings: PrintSettings;
  onUpdateSettings: (newSettings: Partial<PrintSettings>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step3Settings: React.FC<Step3SettingsProps> = ({
  file,
  station,
  settings,
  onUpdateSettings,
  onContinue,
  onBack,
}) => {
  const effectivePages = settings.pageSelectionType === 'all'
    ? file.pageCount
    : parsePageRange(settings.customPageRange, file.pageCount);

  const pricing = calculatePrice(
    effectivePages,
    settings.copies,
    settings.printMode,
    settings.paperSize,
    settings.sides,
    station.bAndWPricePerPage,
    station.colorPricePerPage
  );

  const handleCopiesChange = (delta: number) => {
    soundEffects.playClick();
    const next = Math.max(1, Math.min(20, settings.copies + delta));
    onUpdateSettings({ copies: next });
  };

  const handleCustomRangeChange = (val: string) => {
    const pages = parsePageRange(val, file.pageCount);
    onUpdateSettings({
      customPageRange: val,
      effectivePages: pages,
    });
  };

  return (
    <motion.div
      id="screen-3-settings"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col justify-between min-h-[calc(100vh-80px)] max-w-md mx-auto px-5 py-4"
    >
      <div>
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            id="settings-back-btn"
            onClick={() => {
              soundEffects.playClick();
              onBack();
            }}
            className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-xs font-semibold text-slate-400">Step 2 of 3</span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Print settings
        </h1>

        {/* Selected Document Minimal Badge */}
        <div className="mt-2.5 flex items-center justify-between bg-blue-50/70 border border-blue-100 rounded-xl px-3.5 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800 truncate">
              {file.name}
            </span>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
            {file.pageCount} pages total
          </span>
        </div>

        {/* Settings Grid */}
        <div className="mt-4 space-y-4">
          {/* 1. Pages Selection */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pages to Print
              </label>
              <span className="text-xs font-semibold text-blue-600">
                {effectivePages} {effectivePages === 1 ? 'page' : 'pages'} selected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="pages-all-btn"
                onClick={() => {
                  soundEffects.playClick();
                  onUpdateSettings({ pageSelectionType: 'all', effectivePages: file.pageCount });
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  settings.pageSelectionType === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
                }`}
              >
                {settings.pageSelectionType === 'all' && <Check className="w-3.5 h-3.5" />}
                <span>All ({file.pageCount} pages)</span>
              </button>

              <button
                id="pages-custom-btn"
                onClick={() => {
                  soundEffects.playClick();
                  onUpdateSettings({ pageSelectionType: 'custom' });
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  settings.pageSelectionType === 'custom'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
                }`}
              >
                {settings.pageSelectionType === 'custom' && <Check className="w-3.5 h-3.5" />}
                <span>Custom Range</span>
              </button>
            </div>

            {settings.pageSelectionType === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    id="custom-range-input"
                    type="text"
                    placeholder={`e.g. 1-5, 8, 10-${file.pageCount}`}
                    value={settings.customPageRange}
                    onChange={(e) => handleCustomRangeChange(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono-code text-slate-800"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Specify page numbers and/or page ranges separated by commas.
                </p>
              </motion.div>
            )}
          </div>

          {/* 2. Copies & Paper Size row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Copies */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Copies
              </label>
              <div className="flex items-center justify-between bg-slate-50 rounded-xl border border-slate-200 p-1">
                <button
                  id="copies-minus-btn"
                  onClick={() => handleCopiesChange(-1)}
                  disabled={settings.copies <= 1}
                  className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:shadow-none hover:bg-slate-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-extrabold text-sm text-slate-900 px-2 font-mono-code">
                  {settings.copies}
                </span>
                <button
                  id="copies-plus-btn"
                  onClick={() => handleCopiesChange(1)}
                  disabled={settings.copies >= 20}
                  className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:shadow-none hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Paper Size */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Paper Size
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  id="paper-a4-btn"
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdateSettings({ paperSize: 'A4' });
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.paperSize === 'A4'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  A4
                </button>
                <button
                  id="paper-a3-btn"
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdateSettings({ paperSize: 'A3' });
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.paperSize === 'A3'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  A3
                </button>
              </div>
            </div>
          </div>

          {/* 3. Print Mode (B&W vs Color) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Print Mode
              </label>
              <span className="text-[11px] text-slate-400">
                {settings.printMode === 'bw' ? '₹1.00 / page' : '₹5.00 / page'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="mode-bw-btn"
                onClick={() => {
                  soundEffects.playClick();
                  onUpdateSettings({ printMode: 'bw' });
                }}
                className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  settings.printMode === 'bw'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-900 inline-block" />
                  <span className="font-extrabold text-sm">B&amp;W</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Standard ₹1/page</span>
              </button>

              <button
                id="mode-color-btn"
                onClick={() => {
                  soundEffects.playClick();
                  onUpdateSettings({ printMode: 'color' });
                }}
                className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  settings.printMode === 'color'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 inline-block" />
                  <span className="font-extrabold text-sm">Color</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Vibrant ₹5/page</span>
              </button>
            </div>
          </div>

          {/* 4. Sides & Orientation */}
          <div className="grid grid-cols-2 gap-3">
            {/* Sides */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Sides
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  id="sides-single-btn"
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdateSettings({ sides: 'single' });
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.sides === 'single'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  Single
                </button>
                <button
                  id="sides-double-btn"
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdateSettings({ sides: 'double' });
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.sides === 'double'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  Double
                </button>
              </div>
            </div>

            {/* Orientation */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Orientation
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  id="orient-portrait-btn"
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdateSettings({ orientation: 'portrait' });
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.orientation === 'portrait'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  Portrait
                </button>
                <button
                  id="orient-landscape-btn"
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdateSettings({ orientation: 'landscape' });
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.orientation === 'landscape'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Price Calculation Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-300 font-medium">
                {effectivePages} {effectivePages === 1 ? 'page' : 'pages'} × {settings.copies} {settings.copies === 1 ? 'copy' : 'copies'} × ₹{pricing.unitPrice}
                {settings.sides === 'double' && effectivePages > 1 ? ' (eco 2-sided)' : ''}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant Station Spooling</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Total
              </span>
              <span className="text-2xl font-black text-white tracking-tight">
                ₹{pricing.total}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-4 pb-2">
        <button
          id="continue-to-payment-btn"
          onClick={() => {
            soundEffects.playClick();
            onContinue();
          }}
          className="w-full h-13 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
