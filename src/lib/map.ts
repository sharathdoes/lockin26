import { Note, DrawPath } from '@/types'
export type ReminderType = 'monthly' | 'date';

type NoteDTO = {
  id: string
  email: string
  content: string
  paths: unknown
  rotation: number
  isPublic: boolean
  cheers: number
  createdAt: string
    reminderType?: ReminderType | null;
  
  reminderDate: string | null
  imageUrl?: string | null
  comments: {
    id: string
    noteId: string
    userEmail: string
    text: string
    createdAt: string
  }[]
}

export function mapNoteDTO(dto: NoteDTO): Note {
  return {
    id: dto.id,
    email: dto.email,
    content: dto.content,
    rotation: dto.rotation,
    isPublic: dto.isPublic,
    cheers: dto.cheers,
    createdAt: dto.createdAt,

    // ✅ normalize optional → explicit
    reminderType: dto.reminderType ?? null,
    reminderDate: dto.reminderDate ?? null,

    imageUrl: dto.imageUrl ?? null,

    paths: Array.isArray(dto.paths)
      ? (dto.paths as DrawPath[])
      : [],

    comments: dto.comments,
  }
}
