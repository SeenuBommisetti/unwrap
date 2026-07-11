import React from 'react';
import { useExperience } from '../hooks/useExperience';

export const CakeChapter: React.FC = () => {
  const { nextChapter } = useExperience();

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto h-full">
      <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 font-semibold">
        Chapter 03
      </span>
      <h1 className="font-serif text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
        Make a Wish
      </h1>
      <p className="text-zinc-400 text-base mb-12 font-light leading-relaxed">
        A digital birthday cake appears before you. Close your eyes, think of a beautiful wish, and blow out the candles.
      </p>

      <div className="w-40 h-40 border border-dashed border-zinc-800 rounded-full flex items-center justify-center mb-12 relative group hover:border-amber-450 transition-colors duration-300">
        <span className="text-xs text-zinc-600 group-hover:text-amber-350 transition-colors duration-300">
          [Cake Animation Placeholder]
        </span>
      </div>

      <button
        onClick={nextChapter}
        className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium rounded-full text-sm tracking-wide shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
      >
        Blow Out Candles & Continue
      </button>
    </div>
  );
};
