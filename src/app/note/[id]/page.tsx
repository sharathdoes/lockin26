'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header';
import { storage } from '@/lib/storage';
import { Note, Comment, DrawPath, Point } from '@/types';
import { Heart, MessageCircle, Send } from 'lucide-react';

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [hasCheered, setHasCheered] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    if (params.id) {
      const foundNote = storage.getNoteById(params.id as string);
      if (foundNote) {
        setNote(foundNote);
        setHasCheered(storage.hasCheered(foundNote.id));
      }
    }
  }, [params.id]);

  const handleCheer = () => {
    if (!note || hasCheered) return;
    
    const success = storage.addCheer(note.id);
    if (success) {
      setHasCheered(true);
      setNote({ ...note, cheers: note.cheers + 1 });
    }
  };

  const handleAddComment = () => {
    if (!note || !commentText.trim() || !commentEmail.trim()) {
      alert('Please fill in both email and comment');
      return;
    }

    const newComment: Comment = {
      id: storage.generateId(),
      userEmail: commentEmail,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    storage.addComment(note.id, newComment);
    
    // Reload note
    const updatedNote = storage.getNoteById(note.id);
    if (updatedNote) {
      setNote(updatedNote);
    }
    
    setCommentText('');
    setCommentEmail('');
    setShowCommentForm(false);
  };

  const pointsToPath = (points: Point[]) => {
    if (points.length === 0) return "";
    const pathData = [`M ${points[0].x} ${points[0].y}`];
    for (let i = 1; i < points.length; i++) {
      pathData.push(`L ${points[i].x} ${points[i].y}`);
    }
    return pathData.join(" ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!note) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center text-white">
            <p className="text-xl">Note not found</p>
            <button 
              onClick={() => router.push('/2026')}
              className="mt-4 text-blue-400 hover:underline"
            >
              Back to feed
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Note Display */}
          <div className="space-y-4" data-testid="note-display">
            <div className="bg-black flex items-center justify-center p-8 rounded-lg">
              <div 
                className="w-full max-w-md aspect-[4/5] bg-[#efefef] rounded-sm flex items-center justify-center relative"
                style={{ transform: `rotate(${note.rotation}deg)` }}
              >
                <svg
                  className="absolute top-0 left-0 w-full h-full"
                  viewBox="0 0 400 500"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {note.paths.map((path: DrawPath) => (
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
                
                <div className="absolute top-4 left-4 right-4">
                  <h3 className="text-4xl font-bold leading-none" >
                    NY 2026
                  </h3>
                </div>
                
                {note.content && (
                  <div 
                    className="px-6 text-lg line-clamp-10 mt-16"
                   
                  >
                    {note.content}
                  </div>
                )}
              </div>
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center justify-between text-white bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400" data-testid="note-created-date">
                Created {formatDate(note.createdAt)}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCheer}
                  data-testid="cheer-button-detail"
                  disabled={hasCheered}
                  className={`flex items-center gap-2 transition-colors ${
                    hasCheered ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${hasCheered ? 'fill-current' : ''}`} />
                  <span data-testid="cheer-count-detail">{note.cheers}</span>
                </button>
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageCircle className="w-5 h-5" />
                  <span data-testid="comment-count-detail">{note.comments.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Comments</h2>
              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                data-testid="add-comment-button"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                + Add Comment
              </button>
            </div>

            {/* Comment Form */}
            {showCommentForm && (
              <div className="bg-gray-900 rounded-lg p-4 space-y-3" data-testid="comment-form">
                <input
                  type="email"
                  placeholder="Your email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  data-testid="comment-email-input"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  data-testid="comment-text-input"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddComment}
                    data-testid="submit-comment-button"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </button>
                  <button
                    onClick={() => {
                      setShowCommentForm(false);
                      setCommentText('');
                      setCommentEmail('');
                    }}
                    className="text-gray-400 hover:text-white transition-colors px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3" data-testid="comments-list">
              {note.comments.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                note.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-900 rounded-lg p-4" data-testid={`comment-${comment.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-semibold text-white">
                        {comment.userEmail}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
