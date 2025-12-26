'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/* -------------------------------
   Helpers
-------------------------------- */

function serializeNote(note: any) {
  if (!note) return null

  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    comments: note.comments?.map((c: any) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })) ?? [],
  }
}

/* -------------------------------
   Actions
-------------------------------- */

export async function saveNote(data: {
  email: string
  content: string
  paths: any[]
  rotation: number
  isPublic: boolean
  reminderDate?: string
}) {
  const note = await prisma.note.create({
    data: {
      email: data.email,
      content: data.content,
      paths: data.paths,
      rotation: data.rotation,
      isPublic: data.isPublic,
      reminderDate: data.reminderDate
        ? new Date(data.reminderDate)
        : null,
    },
    include: {
      comments: true,
    },
  })

  revalidatePath('/2026')
  return serializeNote(note)
}

export async function getPublicNotes() {
  const notes = await prisma.note.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    include: { comments: true },
  })

  return notes.map(serializeNote)
}

export async function getNoteById(id: string) {
  const note = await prisma.note.findUnique({
    where: { id },
    include: { comments: true },
  })

  return serializeNote(note)
}

export async function cheerNote(noteId: string) {
  const note = await prisma.note.update({
    where: { id: noteId },
    data: { cheers: { increment: 1 } },
    include: { comments: true },
  })

  revalidatePath('/2026')
  revalidatePath(`/note/${noteId}`)

  return serializeNote(note)
}

export async function addComment(
  noteId: string,
  userEmail: string,
  text: string
) {
  const comment = await prisma.comment.create({
    data: {
      noteId,
      userEmail,
      text,
    },
  })

  revalidatePath(`/note/${noteId}`)

  return {
    ...comment,
    createdAt: comment.createdAt.toISOString(),
  }
}
