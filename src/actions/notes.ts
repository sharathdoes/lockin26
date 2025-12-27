'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

/* -------------------------------
   Helpers
-------------------------------- */

type NoteWithComments = Prisma.NoteGetPayload<{
  include: { comments: true }
}>

function serializeNote(note: NoteWithComments | null) {
  if (!note) return null

  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    reminderDate: note.reminderDate?.toISOString() ?? null,
    reminderType: note.reminderType ?? null,
    imageUrl: note.imageUrl ?? null,
    comments: note.comments.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
  }
}


/* -------------------------------
   Actions
-------------------------------- */
export async function saveNote(data: {
  email: string
  content: string
  paths: Prisma.InputJsonValue
  rotation: number
  isPublic: boolean

  reminderType?: 'monthly' | 'date'
  reminderDate?: string

  imageUrl?: string
}) {
  return prisma.note.create({
    data: {
      email: data.email,
      content: data.content,
      paths: data.paths,
      rotation: data.rotation,
      isPublic: data.isPublic,

      reminderType: data.reminderType ?? null,

      reminderDate:
        data.reminderType === 'date' && data.reminderDate
          ? new Date(data.reminderDate)
          : null,

      imageUrl: data.imageUrl ?? null, 

    },
  })
}


export async function getPublicNotes() {
  const notes = await prisma.note.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    include: { comments: true },
  })

  return notes
    .map(serializeNote)
    .filter((n): n is NonNullable<typeof n> => n !== null)
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
