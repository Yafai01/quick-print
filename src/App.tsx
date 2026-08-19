import React, { useState, useEffect } from 'react';
import { 
  Station, 
  PrintStep, 
  UploadedFile, 
  PrintSettings, 
  PaymentDetails, 
  PrintJob 
} from './types';
import { getStationFromUrl, STATIONS } from './data/stations';
import { generateJobId } from './utils/helpers';
import { Header } from './components/Header';
import { Step1Home } from './components/Step1Home';
import { Step2Upload } from './components/Step2Upload';
import { Step3Settings } from './components/Step3Settings';
import { Step4Payment } from './components/Step4Payment';
import { Step5Success } from './components/Step5Success';
import { Step6Printing } from './components/Step6Printing';
import { Step7Completed } from './components/Step7Completed';
import { PhysicalStationModal } from './components/PhysicalStationModal';
import { AnimatePresence } from 'motion/react';
import { Wifi, BatteryMedium, Signal, Smartphone } from 'lucide-react';

export default function App() {
  const [station, setStation] = useState<Station>(getStationFromUrl);
  const [step, setStep] = useState<PrintStep>('home');
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const [settings, setSettings] = useState<PrintSettings>({
    pageSelectionType: 'all',
    customPageRange: '',
    effectivePages: 12,
    copies: 1,
    paperSize: 'A4',
    printMode: 'bw',
    sides: 'single',
    orientation: 'portrait',
  });

  const [currentJob, setCurrentJob] = useState<PrintJob | null>(null);

  // Sync effective pages whenever uploaded file changes
  const handleFileSelect = (file: UploadedFile) => {
    setUploadedFile(file);
    setSettings((prev) => ({
      ...prev,
      effectivePages: file.pageCount,
      customPageRange: '',
      pageSelectionType: 'all',
    }));
  };

  const handleUpdateSettings = (newSettings: Partial<PrintSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const handlePaymentSuccess = (paymentDetails: PaymentDetails) => {
    if (!uploadedFile) return;

    const newJob: PrintJob = {
      jobId: generateJobId(),
      station,
      file: uploadedFile,
      settings,
      payment: paymentDetails,
      createdAt: new Date().toISOString(),
    };

    setCurrentJob(newJob);
    setStep('payment_success');
  };

  const handlePrintAnother = () => {
    setUploadedFile(null);
    setCurrentJob(null);
    setSettings({
      pageSelectionType: 'all',
      customPageRange: '',
      effectivePages: 12,
      copies: 1,
      paperSize: 'A4',
      printMode: 'bw',
      sides: 'single',
      orientation: 'portrait',
    });
    setStep('home');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start antialiased text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Desktop Helper Banner / Framing for AI Studio Preview */}
      <div className="w-full bg-slate-900 text-slate-300 px-4 py-1.5 text-[11px] font-medium hidden sm:flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Self-Service College Print Terminal</span>
          <span className="text-slate-400">• Mobile Student View Simulation</span>
        </div>
        <button
          onClick={() => setIsStationModalOpen(true)}
          className="text-blue-400 hover:text-blue-300 underline font-semibold cursor-pointer"
        >
          View Physical Station QR Poster
        </button>
      </div>

      {/* Main Container - Mobile First width constrained wrapper */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[92vh] sm:my-4 sm:rounded-3xl sm:shadow-2xl sm:border sm:border-slate-200/80 flex flex-col overflow-hidden relative">
        
        {/* Simulated Mobile Status Bar on framed view */}
        <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 text-slate-500 text-[11px] font-semibold">
          <span>9:41 AM</span>
          <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Global Navigation Header */}
        <Header
          station={station}
          onOpenStationModal={() => setIsStationModalOpen(true)}
          currentStep={step}
        />

        {/* Main Flow Screens Container */}
        <main className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {step === 'home' && (
              <Step1Home
                key="step-home"
                station={station}
                onStartUpload={() => setStep('upload')}
                onOpenStationModal={() => setIsStationModalOpen(true)}
              />
            )}

            {step === 'upload' && (
              <Step2Upload
                key="step-upload"
                file={uploadedFile}
                onFileSelect={handleFileSelect}
                onContinue={() => setStep('settings')}
                onBack={() => setStep('home')}
              />
            )}

            {step === 'settings' && uploadedFile && (
              <Step3Settings
                key="step-settings"
                file={uploadedFile}
                station={station}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onContinue={() => setStep('payment')}
                onBack={() => setStep('upload')}
              />
            )}

            {step === 'payment' && uploadedFile && (
              <Step4Payment
                key="step-payment"
                file={uploadedFile}
                station={station}
                settings={settings}
                onPaymentSuccess={handlePaymentSuccess}
                onBack={() => setStep('settings')}
              />
            )}

            {step === 'payment_success' && currentJob && (
              <Step5Success
                key="step-success"
                amount={currentJob.payment.amount}
                station={station}
                onAutoTransition={() => setStep('printing')}
              />
            )}

            {step === 'printing' && currentJob && (
              <Step6Printing
                key="step-printing"
                file={currentJob.file}
                station={station}
                settings={currentJob.settings}
                onPrintComplete={() => setStep('completed')}
              />
            )}

            {step === 'completed' && currentJob && (
              <Step7Completed
                key="step-completed"
                job={currentJob}
                onPrintAnother={handlePrintAnother}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Station Switcher & QR Code Poster Simulator Modal */}
      <PhysicalStationModal
        isOpen={isStationModalOpen}
        currentStation={station}
        onSelectStation={(st) => setStation(st)}
        onClose={() => setIsStationModalOpen(false)}
      />
    </div>
  );
}
