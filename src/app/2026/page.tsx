'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import NoteCard from '@/components/note-card'
import { storage } from '@/lib/storage';
import { Note } from '@/types';
import { getPublicNotes } from '@/actions/notes'

export default function Feed2026() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
  const publicNotes = await getPublicNotes()
    
    setNotes(publicNotes);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" data-testid="feed-title">
            /2026
          </h1>
          <p className="text-gray-400 text-lg">
            Public resolutions from people around the world
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 py-20">
            Loading...
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-400 py-20" data-testid="empty-state">
            <p className="text-xl mb-4">No public resolutions yet.</p>
            <p>Be the first to share your 2026 goals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="notes-grid">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onCheerUpdate={loadNotes} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
