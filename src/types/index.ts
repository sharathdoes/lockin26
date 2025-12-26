// TypeScript types for LockIn2026

export interface DrawPath {
  points: Point[];
  id: string;
  color: string;
  width: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Note {
  id: string;
  email: string;
  content: string;
  paths: DrawPath[];
  isPublic: boolean;
  reminderDate?: string;
  createdAt: string;
  cheers: number;
  comments: Comment[];

  rotation: number;
}

export interface Comment {
  id: string;
  userEmail: string;
  text: string;
  createdAt: string;
}

export interface Template {
  id: 'blank' | 'lines' | 'checklist';
  name: string;
  preview: string;
}
