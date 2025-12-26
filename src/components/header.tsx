'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSave?: () => void;
  showSaveButton?: boolean;
}

export default function Header({
  onSave,
  showSaveButton = false,
}: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="w-screen bg-black">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 md:px-8 py-2">
        
        {/* LEFT */}
        <Link
          href="/"
          className="shrink-0 text-xl md:text-2xl font-bold text-white"
        >
          2026
        </Link>

        {/* RIGHT */}
        <nav className="flex shrink-0 items-center gap-4 md:gap-8">
          <Link
            href="/"
            className={cn(
              'text-sm md:text-base',
              pathname === '/'
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            )}
          >
            Home
          </Link>

          <Link
            href="/2026"
            className={cn(
              'text-sm md:text-base font-signature',
              pathname === '/2026'
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            )}
          >
            /2026
          </Link>

          

          {showSaveButton && onSave && (
            <button
              onClick={onSave}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold  text-black hover:bg-gray-200"
            >
              Save
            </button>
          )}
        </nav>

      </div>
    </header>
  );
}
