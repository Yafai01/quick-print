import React from 'react';
import { Station, StationId } from '../types';
import { STATIONS } from '../data/stations';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Printer, 
  Check, 
  ExternalLink, 
  QrCode, 
  Sparkles,
  Info,
  Layers,
  Droplet
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface PhysicalStationModalProps {
  isOpen: boolean;
  currentStation: Station;
  onSelectStation: (station: Station) => void;
  onClose: () => void;
}

export const PhysicalStationModal: React.FC<PhysicalStationModalProps> = ({
  isOpen,
  currentStation,
  onSelectStation,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            id="close-station-modal-btn"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Title */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 leading-tight">
                College Print Stations
              </h2>
              <p className="text-xs text-slate-500">
                Physical QR code simulated setup
              </p>
            </div>
          </div>

          {/* Physical QR Sticker Poster Concept Preview */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-2xl p-3.5 shadow-md mb-4 text-center relative overflow-hidden">
            <div className="text-[10px] uppercase tracking-widest font-bold text-blue-200 mb-1">
              Station QR Code Sticker
            </div>
            <div className="bg-white p-2.5 rounded-xl inline-block shadow-inner my-1">
              {/* QR Code SVG */}
              <svg viewBox="0 0 100 100" className="w-24 h-24 text-slate-900">
                <rect x="5" y="5" width="28" height="28" fill="currentColor" rx="4" />
                <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="13" width="12" height="12" fill="currentColor" rx="1" />

                <rect x="67" y="5" width="28" height="28" fill="currentColor" rx="4" />
                <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="75" y="13" width="12" height="12" fill="currentColor" rx="1" />

                <rect x="5" y="67" width="28" height="28" fill="currentColor" rx="4" />
                <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="75" width="12" height="12" fill="currentColor" rx="1" />

                <rect x="38" y="10" width="8" height="8" fill="currentColor" />
                <rect x="50" y="16" width="6" height="6" fill="currentColor" />
                <rect x="38" y="26" width="8" height="6" fill="currentColor" />
                <rect x="50" y="24" width="8" height="8" fill="currentColor" />

                <circle cx="50" cy="50" r="10" fill="#2563eb" />
                <text x="50" y="53" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">QP</text>

                <rect x="10" y="38" width="8" height="8" fill="currentColor" />
                <rect x="24" y="42" width="6" height="8" fill="currentColor" />
                <rect x="68" y="40" width="10" height="6" fill="currentColor" />
                <rect x="82" y="38" width="8" height="8" fill="currentColor" />

                <rect x="38" y="68" width="12" height="8" fill="currentColor" />
                <rect x="54" y="68" width="8" height="12" fill="currentColor" />
                <rect x="68" y="72" width="10" height="8" fill="currentColor" />
                <rect x="82" y="80" width="8" height="8" fill="currentColor" />
              </svg>
            </div>
            <div className="font-mono-code text-[11px] text-blue-100 font-bold">
              https://quickprint.college/print/{currentStation.id}
            </div>
            <p className="text-[10px] text-blue-200 mt-0.5">
              Students simply point their camera here to print directly to {currentStation.name}
            </p>
          </div>

          {/* Station Selection List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Switch Physical Location:
            </label>

            {(Object.keys(STATIONS) as StationId[]).map((stId) => {
              const st = STATIONS[stId];
              const isSelected = currentStation.id === st.id;

              return (
                <button
                  key={st.id}
                  id={`select-station-${st.id}`}
                  onClick={() => {
                    soundEffects.playClick();
                    onSelectStation(st);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">
                          {st.name}
                        </span>
                        {isSelected && (
                          <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {st.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Online</span>
                    </div>
                  </div>

                  {/* Tray & Ink Status */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      Paper Tray: {st.trayPaper}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-slate-400" />
                      Ink: {st.blackInk}%
                    </span>
                    <span className="font-mono-code font-semibold text-slate-700">
                      ₹{st.bAndWPricePerPage}/page
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              id="done-station-modal-btn"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
