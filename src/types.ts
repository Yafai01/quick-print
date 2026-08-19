export type StationId = 'LIBRARY01' | 'ENGLAB02' | 'HOSTELA01' | 'CAFETERIA01';

export interface Station {
  id: StationId;
  name: string;
  location: string;
  model: string;
  status: 'online' | 'busy' | 'offline';
  trayPaper: number; // percentage
  blackInk: number; // percentage
  colorInk: number; // percentage
  bAndWPricePerPage: number;
  colorPricePerPage: number;
  doubleSidedDiscountPerSheet: number;
}

export type PrintStep = 
  | 'home'
  | 'upload'
  | 'settings'
  | 'payment'
  | 'payment_success'
  | 'printing'
  | 'completed';

export interface UploadedFile {
  name: string;
  size: number; // bytes
  type: string;
  pageCount: number;
  previewUrl?: string;
  dataUrl?: string;
}

export type PaperSize = 'A4' | 'A3' | 'Letter';
export type PrintMode = 'bw' | 'color';
export type PrintSides = 'single' | 'double';
export type Orientation = 'portrait' | 'landscape';
export type PageSelectionType = 'all' | 'custom';

export interface PrintSettings {
  pageSelectionType: PageSelectionType;
  customPageRange: string;
  effectivePages: number;
  copies: number;
  paperSize: PaperSize;
  printMode: PrintMode;
  sides: PrintSides;
  orientation: Orientation;
}

export interface PaymentDetails {
  method: 'upi' | 'gpay' | 'phonepe' | 'paytm' | 'qr';
  upiId?: string;
  transactionId: string;
  amount: number;
  timestamp: string;
}

export interface PrintJob {
  jobId: string;
  station: Station;
  file: UploadedFile;
  settings: PrintSettings;
  payment: PaymentDetails;
  createdAt: string;
}
