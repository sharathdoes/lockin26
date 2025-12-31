'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react';
import { DrawPath } from '@/types'
import Header from '@/components/header'
import SaveModal from '@/components/save-modal'


const DynamicRippedPaper = dynamic(
  () => import('@/components/ripped-paper'),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-xl md:text-xl font-bold animate-pulse">
          Happy New Year 
        </h1>
      </div>
    ),
  }
)

export default function Home() {
  
  const [content, setContent] = useState('')
  const [paths, setPaths] = useState<DrawPath[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [rotation, setRotation] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

 useEffect(() => {
    setRotation(Math.random() * 10 - 5);
  }, []);

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      // Reset for new note
      setContent('');
      setPaths([]);
      setRotation(Math.random() * 10 - 5);
    }, 2000);
  };

  return (
    <>
     <Header onSave={handleSave} showSaveButton={true} />
      
      {saveSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2  px-6 py-3 rounded-lg z-50 shadow-lg" data-testid="success-message">
          ✓ LockIn saved successfully!
        </div>
      )}
<DynamicRippedPaper
  content={content}
  onContentChange={handleContentChange}
  paths={paths}
  onPathsChange={setPaths}
/>
      
       <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        noteData={{
          content,
          paths,
      
          rotation,
        }}
        onSaveSuccess={handleSaveSuccess}
      />
      </>
  )
}

