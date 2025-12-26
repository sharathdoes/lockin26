// localStorage utilities for LockIn2026
import { Note, Comment } from '@/types'

const NOTES_KEY = 'lockin2026_notes';
const CHEERED_KEY = 'lockin2026_cheered';

export const storage = {
  // Get all notes
  getAllNotes: (): Note[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get public notes only
  getPublicNotes: (): Note[] => {
    return storage.getAllNotes().filter(note => note.isPublic);
  },

  // Get note by ID
  getNoteById: (id: string): Note | null => {
    const notes = storage.getAllNotes();
    return notes.find(note => note.id === id) || null;
  },

  // Save a new note
  saveNote: (note: Note): void => {
    const notes = storage.getAllNotes();
    notes.push(note);
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  },

  // Update a note
  updateNote: (id: string, updates: Partial<Note>): void => {
    const notes = storage.getAllNotes();
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updates };
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }
  },

  // Add a cheer to a note
  addCheer: (noteId: string): boolean => {
    const cheered = storage.getCheeredNotes();
    if (cheered.includes(noteId)) {
      return false; // Already cheered
    }
    
    const notes = storage.getAllNotes();
    const index = notes.findIndex(note => note.id === noteId);
    if (index !== -1) {
      notes[index].cheers += 1;
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      
      // Track that user cheered this note
      cheered.push(noteId);
      localStorage.setItem(CHEERED_KEY, JSON.stringify(cheered));
      return true;
    }
    return false;
  },

  // Check if user has cheered a note
  hasCheered: (noteId: string): boolean => {
    const cheered = storage.getCheeredNotes();
    return cheered.includes(noteId);
  },

  // Get list of cheered note IDs
  getCheeredNotes: (): string[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CHEERED_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Add a comment to a note
  addComment: (noteId: string, comment: Comment): void => {
    const notes = storage.getAllNotes();
    const index = notes.findIndex(note => note.id === noteId);
    if (index !== -1) {
      notes[index].comments.push(comment);
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }
  },

  // Generate unique ID
  generateId: (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
};
