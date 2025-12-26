import { Note, DrawPath } from '@/types'

type NoteDTO = {
  id: string
  email: string
  content: string
  paths: unknown
  rotation: number
  isPublic: boolean
  cheers: number
  createdAt: string
  reminderDate: string | null
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
    paths: Array.isArray(dto.paths)
      ? (dto.paths as DrawPath[])
      : [], // ✅ GUARANTEED DrawPath[]
  }
}
