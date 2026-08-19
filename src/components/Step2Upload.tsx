import React, { useState, useRef } from 'react';
import { UploadedFile } from '../types';
import { SAMPLE_DOCS } from '../data/sampleDocs';
import { formatFileSize } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Upload, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  FileCheck2, 
  Sparkles,
  Layers,
  HardDrive
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface Step2UploadProps {
  file: UploadedFile | null;
  onFileSelect: (file: UploadedFile) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step2Upload: React.FC<Step2UploadProps> = ({
  file,
  onFileSelect,
  onContinue,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    processFile(rawFile);
  };

  const processFile = (rawFile: File) => {
    setIsProcessing(true);
    soundEffects.playClick();

    // Estimate realistic page count if PDF or image
    let estimatedPages = 1;
    if (rawFile.type.includes('pdf')) {
      // Estimate based on size (rough average 180kb per page, minimum 1)
      estimatedPages = Math.max(1, Math.min(60, Math.round(rawFile.size / (190 * 1024))));
      if (rawFile.name.toLowerCase().includes('assignment')) {
        estimatedPages = 12;
      }
    } else if (rawFile.type.includes('image')) {
      estimatedPages = 1;
    } else {
      estimatedPages = Math.max(1, Math.ceil(rawFile.size / (150 * 1024)));
    }

    const objectUrl = URL.createObjectURL(rawFile);

    setTimeout(() => {
      onFileSelect({
        name: rawFile.name,
        size: rawFile.size,
        type: rawFile.type,
        pageCount: estimatedPages,
        previewUrl: rawFile.type.startsWith('image/') ? objectUrl : undefined,
      });
      setIsProcessing(false);
    }, 450);
  };

  const handleSelectSample = (sample: UploadedFile) => {
    soundEffects.playClick();
    onFileSelect(sample);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  return (
    <motion.div
      id="screen-2-upload"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col justify-between min-h-[calc(100vh-80px)] max-w-md mx-auto px-5 py-4"
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            id="upload-back-btn"
            onClick={() => {
              soundEffects.playClick();
              onBack();
            }}
            className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-xs font-semibold text-slate-400">Step 1 of 3</span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Upload your file
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Select or drag your document to prepare for print
        </p>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.docx"
          className="hidden"
          onChange={handleNativeFileChange}
        />

        {/* Upload Card or Selected File Card */}
        <div className="mt-5">
          {!file ? (
            <div
              id="drop-upload-zone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/70 scale-[1.01]'
                  : 'border-slate-300 hover:border-blue-500 bg-white hover:bg-slate-50/50 shadow-xs'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-inner">
                {isProcessing ? (
                  <div className="w-7 h-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FileText className="w-9 h-9 text-blue-600" />
                )}
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Choose a file
              </h2>
              <p className="text-sm text-slate-500 mb-4 max-w-[220px]">
                Tap to upload your PDF or image
              </p>

              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-500/20">
                <Upload className="w-3.5 h-3.5" />
                <span>Browse Files</span>
              </span>

              <div className="mt-4 text-[11px] text-slate-400 font-medium">
                Supports PDF, JPG, PNG up to 20MB
              </div>
            </div>
          ) : (
            /* Uploaded File Selected Card */
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 relative overflow-hidden"
            >
              <div className="flex items-start gap-3.5">
                {/* Thumbnail / Document Icon */}
                <div className="w-16 h-20 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
                  {file.previewUrl ? (
                    <img
                      src={file.previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-1 text-center">
                      <FileText className="w-7 h-7 text-blue-600 mb-0.5" />
                      <span className="text-[9px] font-bold font-mono uppercase bg-blue-100 text-blue-800 px-1 rounded">
                        {file.type.includes('pdf') ? 'PDF' : 'DOC'}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>

                {/* File Details */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mb-0.5">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Document Ready</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base truncate" title={file.name}>
                    {file.name}
                  </h3>

                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        <strong className="text-slate-900">{file.pageCount}</strong> {file.pageCount === 1 ? 'page' : 'pages'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                      <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                </div>

                {/* Change / Remove button */}
                <button
                  id="remove-file-btn"
                  onClick={() => {
                    soundEffects.playClick();
                    fileInputRef.current?.click();
                  }}
                  className="absolute top-3 right-3 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200/50"
                  title="Change Document"
                >
                  Change
                </button>
              </div>
            </motion.div>
          )}

          {/* Quick 1-Tap Sample Files for instant student testing */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Quick Sample Documents:
              </span>
              <span className="text-[11px] text-slate-400">1-tap demo</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_DOCS.map((sample, idx) => (
                <button
                  key={idx}
                  id={`sample-doc-${idx}`}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2.5 text-left rounded-xl border text-xs transition-all flex items-center gap-2 ${
                    file?.name === sample.name
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{sample.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {sample.pageCount} pages • {formatFileSize(sample.size)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-4 pb-2">
        <button
          id="continue-to-settings-btn"
          disabled={!file}
          onClick={() => {
            soundEffects.playClick();
            onContinue();
          }}
          className={`w-full h-13 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
            file
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25 active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
