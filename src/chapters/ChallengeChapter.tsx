import React from 'react';
import { useExperience } from '../hooks/useExperience';

export const ChallengeChapter: React.FC = () => {
  const { nextChapter } = useExperience();

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto h-full">
      <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 font-semibold">
        Chapter 02
      </span>
      <h1 className="font-serif text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight">
        A Fun Challenge
      </h1>
      <p className="text-zinc-400 text-base mb-12 font-light leading-relaxed">
        Before your gift is revealed, you must prove your knowledge. Answer a fun birthday challenge to proceed to the next chapter.
      </p>

      <div className="w-full p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl mb-12 text-left">
        <h3 className="text-sm font-semibold text-zinc-350 mb-3">Riddle:</h3>
        <p className="text-zinc-450 text-sm font-light mb-4">
          I am only given once a year, but I grow larger each time. What am I?
        </p>
        <div className="space-y-2">
          <button className="w-full text-left p-3.5 rounded-lg border border-zinc-800 hover:border-zinc-700/50 bg-zinc-900 text-zinc-400 text-sm transition-all cursor-pointer">
            A Shadow
          </button>
          <button className="w-full text-left p-3.5 rounded-lg border border-zinc-850 bg-zinc-950 text-zinc-400 text-sm transition-all cursor-pointer hover:border-zinc-700/50">
            Your Age
          </button>
        </div>
      </div>

      <button
        onClick={nextChapter}
        className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium rounded-full text-sm tracking-wide shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
      >
        Answer Correctly & Continue
      </button>
    </div>
  );
};
