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
export type ReminderType = 'monthly' | 'date';

export interface Note {
  id: string;
  email: string;
  content: string;
  paths: DrawPath[];
  isPublic: boolean;

  reminderType: ReminderType | null;
  reminderDate: string | null;

  imageUrl?: string | null;

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


export type CommentDTO = {
  id: string
  noteId: string
  userEmail: string
  text: string
  createdAt: string
}
export type NoteDTO = {
  id: string;
  email: string;
  content: string;
  paths: DrawPath[];
  rotation: number;
  isPublic: boolean;

  reminderType?: ReminderType | null;
  reminderDate?: string | null;

  imageUrl?: string | null;

  cheers: number;
  createdAt: string;
  comments: CommentDTO[];
};
