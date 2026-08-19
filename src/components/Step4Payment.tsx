import React, { useState, useEffect } from 'react';
import { UploadedFile, PrintSettings, Station, PaymentDetails } from '../types';
import { calculatePrice } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Copy, 
  Check, 
  Clock,
  Zap,
  ArrowRight
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Step4PaymentProps {
  file: UploadedFile;
  station: Station;
  settings: PrintSettings;
  onPaymentSuccess: (details: PaymentDetails) => void;
  onBack: () => void;
}

export const Step4Payment: React.FC<Step4PaymentProps> = ({
  file,
  station,
  settings,
  onPaymentSuccess,
  onBack,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi_apps' | 'upi_qr' | 'upi_id'>('upi_apps');
  const [selectedApp, setSelectedApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('student@okaxis');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3-min dynamic QR expiry

  const pricing = calculatePrice(
    settings.effectivePages,
    settings.copies,
    settings.printMode,
    settings.paperSize,
    settings.sides,
    station.bAndWPricePerPage,
    station.colorPricePerPage
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 180));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePay = (method: 'upi' | 'gpay' | 'phonepe' | 'paytm' | 'qr' = selectedApp) => {
    soundEffects.playClick();
    setIsProcessing(true);

    setTimeout(() => {
      soundEffects.playPaymentSuccess();
      const transactionId = `UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      onPaymentSuccess({
        method,
        upiId: selectedMethod === 'upi_id' ? upiIdInput : `${selectedApp}@bank`,
        transactionId,
        amount: pricing.total,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }, 1200);
  };

  const handleCopyUpi = () => {
    soundEffects.playClick();
    setCopiedUpi(true);
    navigator.clipboard?.writeText('quickprint@collegeupi');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <motion.div
      id="screen-4-payment"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col justify-between min-h-[calc(100vh-80px)] max-w-md mx-auto px-5 py-4"
    >
      <div>
        {/* Navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            id="payment-back-btn"
            disabled={isProcessing}
            onClick={() => {
              soundEffects.playClick();
              onBack();
            }}
            className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-xs font-semibold text-slate-400">Final Step</span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Complete payment
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fast UPI checkout • Instant printer authorization
        </p>

        {/* Clean Payment Summary Card (as requested in spec) */}
        <div className="mt-4 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-blue-600 font-mono-code">{station.id}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Document</span>
              <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                {file.name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Pages</span>
              <span className="font-semibold text-slate-800">
                {settings.effectivePages} {settings.effectivePages === 1 ? 'page' : 'pages'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Copies</span>
              <span className="font-semibold text-slate-800">
                {settings.copies}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                {settings.printMode === 'bw' ? 'B&W Rate' : 'Color Rate'}
              </span>
              <span className="font-semibold text-slate-800">
                ₹{pricing.unitPrice}/page
              </span>
            </div>

            {settings.sides === 'double' && (
              <div className="flex items-center justify-between text-emerald-600">
                <span>Double-sided Eco Discount</span>
                <span className="font-semibold">-₹{pricing.discount}</span>
              </div>
            )}
          </div>

          <div className="my-3 border-t border-dashed border-slate-200" />

          <div className="flex items-center justify-between">
            <span className="font-black text-sm text-slate-900 tracking-wider">
              TOTAL
            </span>
            <span className="text-2xl font-black text-blue-600 font-mono-code">
              ₹{pricing.total}
            </span>
          </div>
        </div>

        {/* Indian Payment Options Tabs */}
        <div className="mt-4 space-y-3">
          <div className="flex rounded-xl bg-slate-200/70 p-1">
            <button
              id="tab-upi-apps"
              onClick={() => {
                soundEffects.playClick();
                setSelectedMethod('upi_apps');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedMethod === 'upi_apps'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>UPI Apps</span>
            </button>

            <button
              id="tab-upi-qr"
              onClick={() => {
                soundEffects.playClick();
                setSelectedMethod('upi_qr');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedMethod === 'upi_qr'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>UPI QR Code</span>
            </button>
          </div>

          {/* Tab 1: UPI Apps (GPay, PhonePe, Paytm, BHIM) */}
          {selectedMethod === 'upi_apps' && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Choose UPI App
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Google Pay */}
                <button
                  id="pay-app-gpay"
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedApp('gpay');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    selectedApp === 'gpay'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center font-bold text-xs text-blue-600">
                    GPay
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Google Pay</div>
                    <div className="text-[10px] text-slate-400">Instant UPI</div>
                  </div>
                </button>

                {/* PhonePe */}
                <button
                  id="pay-app-phonepe"
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedApp('phonepe');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    selectedApp === 'phonepe'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white shadow-xs flex items-center justify-center font-bold text-xs">
                    Pe
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">PhonePe</div>
                    <div className="text-[10px] text-slate-400">Instant UPI</div>
                  </div>
                </button>

                {/* Paytm */}
                <button
                  id="pay-app-paytm"
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedApp('paytm');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    selectedApp === 'paytm'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-500 text-white shadow-xs flex items-center justify-center font-bold text-[10px]">
                    Paytm
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Paytm UPI</div>
                    <div className="text-[10px] text-slate-400">Wallet / UPI</div>
                  </div>
                </button>

                {/* BHIM / Other UPI */}
                <button
                  id="pay-app-bhim"
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedApp('bhim');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    selectedApp === 'bhim'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white shadow-xs flex items-center justify-center font-bold text-[10px]">
                    BHIM
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">BHIM / Any UPI</div>
                    <div className="text-[10px] text-slate-400">Direct VPA</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Dynamic UPI QR code */}
          {selectedMethod === 'upi_qr' && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs text-center space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Scan with any UPI App</span>
                <span className="flex items-center gap-1 text-amber-600 font-mono-code font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(countdown)}
                </span>
              </div>

              {/* Dynamic QR graphic with college station branding */}
              <div className="w-44 h-44 mx-auto p-2.5 bg-white border-2 border-slate-900 rounded-2xl shadow-sm relative flex flex-col items-center justify-center">
                {/* SVG QR Code Pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  {/* Position markers */}
                  <rect x="5" y="5" width="26" height="26" fill="currentColor" rx="4" />
                  <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                  <rect x="13" y="13" width="10" height="10" fill="currentColor" rx="1" />

                  <rect x="69" y="5" width="26" height="26" fill="currentColor" rx="4" />
                  <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                  <rect x="77" y="13" width="10" height="10" fill="currentColor" rx="1" />

                  <rect x="5" y="69" width="26" height="26" fill="currentColor" rx="4" />
                  <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                  <rect x="13" y="77" width="10" height="10" fill="currentColor" rx="1" />

                  {/* QR Matrix Bits */}
                  <rect x="36" y="8" width="8" height="8" fill="currentColor" />
                  <rect x="48" y="12" width="6" height="6" fill="currentColor" />
                  <rect x="58" y="6" width="6" height="10" fill="currentColor" />
                  
                  <rect x="36" y="22" width="6" height="8" fill="currentColor" />
                  <rect x="46" y="24" width="8" height="6" fill="currentColor" />
                  <rect x="58" y="20" width="8" height="8" fill="currentColor" />

                  <rect x="8" y="36" width="8" height="8" fill="currentColor" />
                  <rect x="20" y="38" width="8" height="6" fill="currentColor" />
                  <rect x="32" y="34" width="6" height="8" fill="currentColor" />
                  
                  {/* Center Badge */}
                  <circle cx="50" cy="50" r="12" fill="white" />
                  <circle cx="50" cy="50" r="9" fill="#2563eb" />
                  <text x="50" y="53" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">QP</text>

                  <rect x="66" y="36" width="10" height="6" fill="currentColor" />
                  <rect x="80" y="38" width="12" height="8" fill="currentColor" />

                  <rect x="36" y="48" width="6" height="14" fill="currentColor" />
                  <rect x="64" y="46" width="12" height="6" fill="currentColor" />
                  <rect x="80" y="52" width="8" height="10" fill="currentColor" />

                  <rect x="36" y="68" width="10" height="8" fill="currentColor" />
                  <rect x="50" y="66" width="8" height="12" fill="currentColor" />
                  <rect x="64" y="70" width="8" height="8" fill="currentColor" />
                  <rect x="76" y="68" width="16" height="6" fill="currentColor" />

                  <rect x="38" y="82" width="12" height="8" fill="currentColor" />
                  <rect x="56" y="82" width="14" height="10" fill="currentColor" />
                  <rect x="76" y="80" width="8" height="12" fill="currentColor" />
                </svg>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-mono-code font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                  quickprint@collegeupi
                </span>
                <button
                  id="copy-upi-vpa-btn"
                  onClick={handleCopyUpi}
                  className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs flex items-center gap-1 font-semibold"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Button & Security Note */}
      <div className="pt-4 pb-2 space-y-2">
        <button
          id="pay-now-action-btn"
          disabled={isProcessing}
          onClick={() => handlePay(selectedMethod === 'upi_qr' ? 'qr' : selectedApp)}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Authorizing ₹{pricing.total}...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-200" />
              <span>Pay ₹{pricing.total}</span>
            </div>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>NPCI UPI Certified • Instant hardware trigger</span>
        </div>
      </div>
    </motion.div>
  );
};
