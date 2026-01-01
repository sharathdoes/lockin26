'use client';

import { Note, DrawPath, Point } from '@/types';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface NoteCardProps {
  note: Note;
  onCheerUpdate?: () => void;
}

export default function NoteCard({ note }: NoteCardProps) {
  if (!note) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const pointsToPath = (points: Point[]) => {
    if (!points || points.length === 0) return '';
    return points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(' ');
  };

  return (
    <Link href={`/note/${note.id}`} data-testid={`note-card-${note.id}`}>
      <div className="group bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-white transition-all cursor-pointer">
        {/* Thumbnail */}
        <div className="aspect-[4/5] bg-black flex items-center justify-center p-4">
          <div
            className="w-full h-full bg-[#efefef] rounded-sm relative overflow-hidden"
            style={{ transform: `rotate(${note.rotation}deg)` }}
          >
            {/* 🧠 DRAW PATHS */}
            <svg
              viewBox="0 0 400 500"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 w-full h-full"
            >
              {note.paths?.map((path: DrawPath) => (
                <path
                  key={path.id}
                  d={pointsToPath(path.points)}
                  stroke={path.color}
                  strokeWidth={path.width}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>

            {/* Image */}
            {note.imageUrl && (
              <img
                src={note.imageUrl}
                alt="Attached"
                className="absolute top-20 left-1/2 -translate-x-1/2 w-20 h-20 object-cover rounded-sm shadow-md"
              />
            )}

            {/* Header */}
            <div className="absolute top-4 left-4 right-4">
              <h3 className="text-2xl md:text-3xl font-bold text-blue-600 leading-none">
                NY 2026
              </h3>
            </div>

            {/* Text */}
            {note.content && (
              <div className="px-4 text-blue-600 text-sm md:text-base line-clamp-6 mt-12 relative">
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

            <div className="flex items-center gap-1" data-testid="comment-count">
              <MessageCircle className="w-4 h-4" />
              <span>{note.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
