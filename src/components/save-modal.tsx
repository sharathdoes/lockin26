'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Note,DrawPath } from '@/types'
import { storage } from "@/lib/storage"

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteData: {
    content: string;
    paths: DrawPath[];
    rotation: number;
  };
  onSaveSuccess: () => void;
}

export default function SaveModal({ isOpen, onClose, noteData, onSaveSuccess }: SaveModalProps) {
  const [email, setEmail] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSaving(true);

    const note: Note = {
      id: storage.generateId(),
      email,
      content: noteData.content,
      paths: noteData.paths,
      isPublic,
      reminderDate: reminderDate || undefined,
      createdAt: new Date().toISOString(),
      cheers: 0,
      comments: [],
      rotation: noteData.rotation,
    };

    storage.saveNote(note);

    setTimeout(() => {
      setIsSaving(false);
      onSaveSuccess();
      onClose();
      setEmail('');
      setIsPublic(false);
      setReminderDate('');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" data-testid="save-modal">
      <div className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Save Your LockIn</h2>
          <button
            onClick={onClose}
            data-testid="close-modal"
            className="text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              data-testid="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="reminderDate" className="block text-sm font-medium text-gray-700 mb-2">
              When should you be reminded?
            </label>
            <input
              type="date"
              id="reminderDate"
              data-testid="reminder-input"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              data-testid="public-checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
              Make this public on /2026
            </label>
          </div>

          <button
            onClick={handleSave}
            data-testid="save-note-button"
            disabled={isSaving}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save my LockIn'}
          </button>
        </div>
      </div>
    </div>
  );
}
