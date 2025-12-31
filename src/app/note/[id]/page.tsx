'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Note, DrawPath, Point } from '@/types'
import { Heart, MessageCircle, Send } from 'lucide-react'
import {
  getNoteById,
  cheerNote,
  addComment,
} from '@/actions/notes'
import { mapNoteDTO } from '@/lib/map'

export default function NotePage() {
  const params = useParams()
  const router = useRouter()

  const [note, setNote] = useState<Note | null>(null)
  const [hasCheered, setHasCheered] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentEmail, setCommentEmail] = useState('')
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [loading, setLoading] = useState(true)

  /* -------------------------------
     Load note
  -------------------------------- */
  useEffect(() => {
    async function load() {
      if (!params.id) return

      const data = await getNoteById(params.id as string)
      if (!data) {
        setLoading(false)
        return
      }

setNote(mapNoteDTO(data))
      setLoading(false)
    }

    load()
  }, [params.id])

  /* -------------------------------
     Cheer
  -------------------------------- */
  const handleCheer = async () => {
    if (!note || hasCheered) return

    setHasCheered(true)
    setNote({ ...note, cheers: note.cheers + 1 })

    await cheerNote(note.id)
  }

  /* -------------------------------
     Add comment
  -------------------------------- */
  const handleAddComment = async () => {
    if (!note || !commentText.trim() || !commentEmail.trim()) {
      alert('Please fill in both email and comment')
      return
    }

    const newComment = await addComment(
      note.id,
      commentEmail,
      commentText
    )

    setNote({
      ...note,
      comments: [...note.comments, newComment],
    })

    setCommentText('')
    setCommentEmail('')
    setShowCommentForm(false)
  }

  /* -------------------------------
     Utils
  -------------------------------- */
  const pointsToPath = (points: Point[]) => {
    if (points.length === 0) return ''
    return points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(' ')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  /* -------------------------------
     States
  -------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="py-24 text-center text-gray-400">
          Loading...
        </main>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="py-24 text-center text-white">
          <p className="text-xl">Note not found</p>
          <button
            onClick={() => router.push('/2026')}
            className="mt-4 text-blue-400 hover:underline"
          >
            Back to feed
          </button>
        </main>
      </div>
    )
  }

  /* -------------------------------
     Render
  -------------------------------- */
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Note */}
          <div className="space-y-4">
            <div className="bg-black flex justify-center p-8 rounded-lg">
              <div
                className="w-full max-w-md aspect-[4/5] bg-[#efefef] rounded-sm relative"
                style={{ transform: `rotate(${note.rotation}deg)` }}
              >
                <svg className="absolute inset-0 w-full h-full">
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
                  <h3 className="text-4xl font-bold">NY 2026</h3>
                </div>

                {note.content && (
                  <div className="px-6 py-8 text-lg mt-16">
                    {note.content}
                  </div>
                )}
              </div>
            </div>
                  {note.imageUrl && (
 <img
  src={note.imageUrl}
  alt="Attached"
  className="
    absolute
    w-16 h-16
    object-cover
    rounded-sm
    shadow-md

    /* 📱 mobile (default) */
    top-32
    left-60
    -translate-x-1/2

    /* 💻 desktop */
    sm:top-20
    sm:right-1/2
    sm:left-auto
    sm:-translate-x-1/2
    sm:w-40
    sm:h-40
  "
/>

)}

            {/* Interaction bar */}
            <div className="flex justify-between bg-gray-900 p-4 rounded-lg text-white">
              <span className="text-sm text-gray-400">
                Created {formatDate(note.createdAt)}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={handleCheer}
                  disabled={hasCheered}
                  className={`flex items-center gap-2 ${
                    hasCheered
                      ? 'text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${hasCheered ? 'fill-current' : ''}`} />
                  {note.cheers}
                </button>

                <div className="flex items-center gap-2 text-gray-400">
                  <MessageCircle className="w-5 h-5" />
                  {note.comments.length}
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold text-white">Comments</h2>
              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="text-blue-400"
              >
                + Add Comment
              </button>
            </div>

            {showCommentForm && (
              <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded"
                />
                <textarea
                  rows={3}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded"
                />
                <button
                  onClick={handleAddComment}
                  className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded text-white"
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </button>
              </div>
            )}

            {note.comments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No comments yet.
              </p>
            ) : (
              note.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-900 p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-semibold">
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
      </main>
    </div>
  )
}