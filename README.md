# QuickPrint

A mobile-first prototype of a self-service printing station for a college campus. A student scans a station's QR code, uploads a document, chooses print settings, pays by UPI and watches the job print. This version simulates the full flow in the browser and doesn't connect to real printers or payment services.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## User flow

1. **Home**: shows the current print station. The station comes from the `?station=` URL parameter (for example `?station=LIBRARY01`, `ENGLAB02`, `HOSTELA01` or `CAFETERIA01`), so each station's QR code can link straight to it. Each station has its own printer model and per-page prices.
2. **Upload**: pick a PDF, image or DOCX file, or use one of the sample documents. The page count is estimated.
3. **Settings**: choose the number of copies (1 to 20), paper size (A4 or A3), black-and-white or colour, single- or double-sided printing, orientation and a page range. The price updates as you change them.
4. **Payment**: an order summary with simulated UPI checkout, either through app buttons (GPay, PhonePe, Paytm, BHIM) or a UPI QR code.
5. **Payment success**: a confirmation with a generated transaction ID.
6. **Printing**: an animated page-by-page printing simulation.
7. **Completed**: job details with a confetti celebration.

A "physical station" modal shows the QR code a station would display. Sound effects are generated with the Web Audio API.

## Tech stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Motion (animations), Lucide icons, canvas-confetti

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm (a `bun.lock` is also included)

### Run locally

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:3000.

### Build

```bash
npm run build     # outputs static files to dist/
npm run preview
```

### Environment variables

None are needed. `.env.example` comes from the AI Studio template and lists `GEMINI_API_KEY` and `APP_URL`, but the current code doesn't use them.

## Project structure

```
src/App.tsx               Step state machine for the print flow
src/components/           Header, Step1Home ... Step7Completed, PhysicalStationModal, PrinterIllustration
src/data/stations.ts      Sample print stations and pricing
src/data/sampleDocs.ts    Sample documents
src/utils/helpers.ts      Page-range parsing, price calculation, formatting
src/utils/audio.ts        Web Audio sound effects
src/types.ts              Shared types
```
