import React from 'react';
import { useExperience } from '../hooks/useExperience';

export const ScannerChapter: React.FC = () => {
  const { nextChapter } = useExperience();

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto h-full">
      <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 font-semibold">
        Chapter 01
      </span>
      <h1 className="font-serif text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
        Identity Verification
      </h1>
      <p className="text-zinc-400 text-base mb-12 font-light leading-relaxed">
        To unlock this greeting, we need to scan your biometric sequence. 
        Place and hold your index finger on the scanner when you are ready.
      </p>
      
      <div className="w-24 h-24 rounded-full border border-zinc-800 flex items-center justify-center mb-12 relative group cursor-pointer hover:border-rose-450 transition-all duration-300">
        <div className="absolute inset-0 rounded-full bg-rose-500/5 scale-75 group-hover:scale-95 transition-transform duration-500" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-10 h-10 text-zinc-500 group-hover:text-rose-400 transition-colors duration-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.272M6 10.5c0-2.208 1-4.183 2.592-5.5M6 10.5c0 2.92.556 5.709 1.568 8.272M6 10.5c-.714 0-1.393-.153-2-.43M18 10.5c0-2.208-1-4.183-2.592-5.5m2.592 5.5a14.28 14.28 0 0 1-1.568 8.272M18 10.5c.714 0 1.393-.153 2-.43M13.5 10.5c0-1.104-.5-2-1.5-2s-1.5.896-1.5 2M13.5 10.5c0 1.942-.256 3.824-.742 5.623M10.5 10.5c0 1.942.256 3.824.742 5.623m-1.484-5.623c-.362 0-.693-.093-1-.258M12 10.5c0-2.208 1.5-4 3.5-4s3.5 1.792 3.5 4M12 10.5c0 2.92.556 5.709 1.568 8.272"
          />
        </svg>
      </div>

      <button
        onClick={nextChapter}
        className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium rounded-full text-sm tracking-wide shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
      >
        Simulate Scan & Continue
      </button>
    </div>
  );
};
