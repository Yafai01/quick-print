import { Station, StationId } from '../types';

export const STATIONS: Record<StationId, Station> = {
  LIBRARY01: {
    id: 'LIBRARY01',
    name: 'Library Print Station',
    location: 'Central Library, Ground Floor near Issue Desk',
    model: 'HP LaserJet Enterprise M507x',
    status: 'online',
    trayPaper: 94,
    blackInk: 88,
    colorInk: 92,
    bAndWPricePerPage: 1,
    colorPricePerPage: 5,
    doubleSidedDiscountPerSheet: 0.5,
  },
  ENGLAB02: {
    id: 'ENGLAB02',
    name: 'Engineering Lab Station',
    location: 'CS Block, 2nd Floor Lab Corridor',
    model: 'Canon imageRUNNER ADVANCE C3530i',
    status: 'online',
    trayPaper: 82,
    blackInk: 95,
    colorInk: 78,
    bAndWPricePerPage: 1,
    colorPricePerPage: 5,
    doubleSidedDiscountPerSheet: 0.5,
  },
  HOSTELA01: {
    id: 'HOSTELA01',
    name: 'Hostel Block A Station',
    location: 'Hostel A Common Study Room',
    model: 'Epson EcoTank L6490 FastPrint',
    status: 'online',
    trayPaper: 76,
    blackInk: 70,
    colorInk: 85,
    bAndWPricePerPage: 1,
    colorPricePerPage: 5,
    doubleSidedDiscountPerSheet: 0.5,
  },
  CAFETERIA01: {
    id: 'CAFETERIA01',
    name: 'Student Center Kiosk',
    location: 'Main Cafeteria Hub, Next to ATM',
    model: 'Brother HL-L6400DW HeavyDuty',
    status: 'online',
    trayPaper: 89,
    blackInk: 84,
    colorInk: 65,
    bAndWPricePerPage: 1,
    colorPricePerPage: 5,
    doubleSidedDiscountPerSheet: 0.5,
  },
};

export function getStationFromUrl(): Station {
  try {
    const params = new URLSearchParams(window.location.search);
    const stationParam = params.get('station')?.toUpperCase() as StationId;
    if (stationParam && STATIONS[stationParam]) {
      return STATIONS[stationParam];
    }
  } catch {
    // Fallback if URLSearchParams fails
  }
  return STATIONS.LIBRARY01;
}
