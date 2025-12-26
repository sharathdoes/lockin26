'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Note, Comment } from '@/types'

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
  })

  revalidatePath('/2026')
  return note
}

export async function getPublicNotes() {
  return prisma.note.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    include: { comments: true },
  })
}

export async function getNoteById(id: string) {
  return prisma.note.findUnique({
    where: { id },
    include: { comments: true },
  })
}

export async function cheerNote(noteId: string) {
  return prisma.note.update({
    where: { id: noteId },
    data: { cheers: { increment: 1 } },
  })
}

export async function addComment(
  noteId: string,
  userEmail: string,
  text: string
) {
  return prisma.comment.create({
    data: {
      noteId,
      userEmail,
      text,
    },
  })
}
