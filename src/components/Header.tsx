import React from 'react';
import { Station } from '../types';
import { Printer, MapPin, QrCode, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  station: Station;
  onOpenStationModal: () => void;
  currentStep: string;
}

export const Header: React.FC<HeaderProps> = ({
  station,
  onOpenStationModal,
  currentStep,
}) => {
  return (
    <header id="app-header" className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                QuickPrint
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200/60">
                Self-Service
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">College FastPrint</p>
          </div>
        </div>

        {/* Station Badge & Physical QR preview button */}
        <div className="flex items-center gap-1.5">
          <button
            id="station-info-badge-btn"
            onClick={onOpenStationModal}
            title="View Physical Station QR details"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 transition-colors text-xs font-semibold"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="max-w-[110px] truncate text-[11px] font-medium text-slate-800">
              {station.name.replace('Print Station', '').trim()}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          </button>

          <button
            id="open-qr-poster-btn"
            onClick={onOpenStationModal}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
            title="Scan or Switch Station"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
