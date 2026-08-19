import { UploadedFile } from '../types';

export const SAMPLE_DOCS: UploadedFile[] = [
  {
    name: 'assignment.pdf',
    size: 2.4 * 1024 * 1024,
    type: 'application/pdf',
    pageCount: 12,
    previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Lab_Report_Experiment_4.pdf',
    size: 1.8 * 1024 * 1024,
    type: 'application/pdf',
    pageCount: 6,
    previewUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Resume_Software_Internship.pdf',
    size: 450 * 1024,
    type: 'application/pdf',
    pageCount: 2,
    previewUrl: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Project_Architecture_Diagram.png',
    size: 980 * 1024,
    type: 'image/png',
    pageCount: 1,
    previewUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
  },
];
