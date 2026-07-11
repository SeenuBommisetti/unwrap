import React from 'react';
import { useExperience } from '../hooks/useExperience';

export const GiftChapter: React.FC = () => {
  const { nextChapter } = useExperience();

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto h-full">
      <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 font-semibold">
        Chapter 04
      </span>
      <h1 className="font-serif text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
        Unwrap Your Gift
      </h1>
      <p className="text-zinc-400 text-base mb-12 font-light leading-relaxed">
        It is time to open your virtual box. Tap the lid to lift the cover and reveal what is inside.
      </p>

      <div className="w-40 h-40 border border-dashed border-zinc-800 rounded-lg flex items-center justify-center mb-12 relative group hover:border-indigo-450 transition-colors duration-300">
        <span className="text-xs text-zinc-600 group-hover:text-indigo-355 transition-colors duration-300">
          [Gift Box Placeholder]
        </span>
      </div>

      <button
        onClick={nextChapter}
        className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium rounded-full text-sm tracking-wide shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
      >
        Open Gift & Continue
      </button>
    </div>
  );
};
