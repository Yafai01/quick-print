export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function parsePageRange(rangeStr: string, totalPages: number): number {
  if (!rangeStr || !rangeStr.trim()) return totalPages;
  
  const clean = rangeStr.replace(/\s+/g, '');
  const parts = clean.split(',');
  const selectedPages = new Set<number>();

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
        for (let p = start; p <= Math.min(end, totalPages); p++) {
          selectedPages.add(p);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p > 0 && p <= totalPages) {
        selectedPages.add(p);
      }
    }
  }

  return selectedPages.size > 0 ? selectedPages.size : totalPages;
}

export function calculatePrice(
  pages: number,
  copies: number,
  printMode: 'bw' | 'color',
  paperSize: 'A4' | 'A3',
  sides: 'single' | 'double',
  bAndWPrice: number = 1,
  colorPrice: number = 5
): {
  unitPrice: number;
  sheetsNeeded: number;
  subtotal: number;
  discount: number;
  total: number;
} {
  const baseRate = printMode === 'bw' ? bAndWPrice : colorPrice;
  const sizeMultiplier = paperSize === 'A3' ? 2 : 1;
  const unitPrice = baseRate * sizeMultiplier;
  
  // If double-sided, sheets needed is ceil(pages / 2)
  const sheetsNeeded = sides === 'double' ? Math.ceil(pages / 2) : pages;
  
  // Total cost: pages * copies * unitPrice
  const rawCost = pages * copies * unitPrice;
  
  // Discount for double-sided if applicable (saves paper)
  const discount = sides === 'double' ? Math.floor(pages / 2) * copies * 0.5 : 0;
  const total = Math.max(1, Math.round(rawCost - discount));

  return {
    unitPrice,
    sheetsNeeded: sheetsNeeded * copies,
    subtotal: rawCost,
    discount,
    total,
  };
}

export function generateJobId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `QP-${randomNum}`;
}
