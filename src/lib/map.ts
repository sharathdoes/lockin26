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
    ...dto,
    imageUrl: dto.imageUrl ?? null,
    paths: Array.isArray(dto.paths)
      ? (dto.paths as DrawPath[])
      : [], // ✅ GUARANTEED DrawPath[]
  }
}
