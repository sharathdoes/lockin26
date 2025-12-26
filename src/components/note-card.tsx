'use client';

import { Note } from '@/types';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface NoteCardProps {
  note: Note;
  onCheerUpdate?: () => void;
}

export default function NoteCard({ note }: NoteCardProps) {

  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link href={`/note/${note.id}`} data-testid={`note-card-${note.id}`}>
      <div className="group bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-white transition-all cursor-pointer">
        {/* Thumbnail */}
        <div className="aspect-[4/5] bg-black flex items-center justify-center p-4">
          <div
            className="w-full h-full bg-[#efefef] rounded-sm flex items-center justify-center relative"
            style={{ transform: `rotate(${note.rotation}deg)` }}
          >
            <div className="absolute top-4 left-4 right-4">
              <h3 className="text-2xl md:text-3xl font-bold text-blue-600 leading-none">
                NY 2026
              </h3>
            </div>
            {note.content && (
              <div className="px-4 text-blue-600 text-sm md:text-base line-clamp-6 mt-12">
                {note.content}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span data-testid="note-date">
              {formatDate(note.createdAt)}
            </span>

            <div className="flex items-center gap-4">
              {/* <button
                onClick={handleCheer}
                data-testid="cheer-button"
                disabled={hasCheered || isCheering}
                className={`flex items-center gap-1 transition-colors ${
                  hasCheered
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    hasCheered ? 'fill-current' : ''
                  }`}
                />
                <span data-testid="cheer-count">{cheerCount}</span>
              </button> */}

              <div className="flex items-center gap-1" data-testid="comment-count">
                <MessageCircle className="w-4 h-4" />
                <span>{note.comments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
