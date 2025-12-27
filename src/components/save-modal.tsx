"use client";
import { Plus } from 'lucide-react'

import { useState } from "react";
import { X } from "lucide-react";
import { DrawPath } from "@/types";
import { saveNote } from "@/actions/notes";
import { Prisma } from "@prisma/client";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteData: {
    content: string;
    paths: DrawPath[];
    rotation: number;
  };
  onSaveSuccess: () => void;
}

export default function SaveModal({
  isOpen,
  onClose,
  noteData,
  onSaveSuccess,
}: SaveModalProps) {
  const [email, setEmail] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [reminderType, setReminderType] = useState<"monthly" | "date">(
    "monthly"
  );
  const [reminderDate, setReminderDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;
  const CLOUD_NAME = 'dmzeq8qdf'
const UPLOAD_PRESET = 'lockin2026_unsigned'

async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!res.ok) {
    throw new Error('Image upload failed')
  }

  const data = await res.json()
  return data.secure_url
}

 const handleSave = async () => {
  try {
    setIsUploading(true)
    if (reminderType === 'date' && !reminderDate) {
  alert('Please select a reminder date')
  return
}


    let imageUrl: string | undefined = undefined

    if (imageFile) {
      imageUrl = await uploadImageToCloudinary(imageFile)
    }

    await saveNote({
      email,
      content: noteData.content,
      paths: noteData.paths as unknown as Prisma.InputJsonValue,
      rotation: noteData.rotation,
      isPublic,
      reminderType,
      reminderDate,
      imageUrl,
    })

    onSaveSuccess()
    onClose()
  } catch (err) {
    console.error(err)
    alert('Failed to save note')
  } finally {
    setIsUploading(false)
  }
}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      data-testid="save-modal"
    >
      <div className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Save Your LockIn</h2>
          <button
            onClick={onClose}
            data-testid="close-modal"
            className="text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

       <div className="flex items-center justify-center">
  <label
    htmlFor="image-upload"
    className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-black transition"
  >
    {imageFile ? (
      <img
        src={URL.createObjectURL(imageFile)}
        alt="Preview"
        className="w-full h-full object-cover rounded-full"
      />
    ) : (
      <Plus className="w-8 h-8 text-gray-400" />
    )}
  </label>

  <input
    id="image-upload"
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        alert('Only images allowed')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be under 5MB')
        return
      }

      setImageFile(file)
    }}
    className="hidden"
  />
</div>


        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              data-testid="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
            />
          </div>

          <div className="space-y-4">
            {/* Reminder Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder type
              </label>

              <select
                value={reminderType}
                onChange={(e) =>
                  setReminderType(e.target.value as "monthly" | "date")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Remind me every month</option>
                <option value="date">Remind me on a specific date</option>
              </select>
            </div>

            {/* Monthly info */}
            {reminderType === "monthly" && (
              <p className="text-sm text-gray-500">
                You’ll get a reminder once every month.
              </p>
            )}

            {/* Specific date */}
            {reminderType === "date" && (
              <div>
                <label
                  htmlFor="reminderDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select reminder date
                </label>

                <input
                  type="date"
                  id="reminderDate"
                  data-testid="reminder-input"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              data-testid="public-checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isPublic"
              className="text-sm font-medium text-gray-700"
            >
              Make this public on /2026
            </label>
          </div>

          <button
            onClick={handleSave}
            data-testid="save-note-button"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save resolution
          </button>
          <div>
            {" "}
            <a target="_blank" href="https://github.com/sharathdoes">
              by @sharathdoes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
