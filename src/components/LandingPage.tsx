import React, { useState } from 'react';
import { useExperience } from '../hooks/useExperience';

interface LandingPageProps {
  onStartSurprise: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartSurprise }) => {
  const { setNames } = useExperience();
  const [recipientInput, setRecipientInput] = useState('');
  const [senderInput, setSenderInput] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const to = recipientInput.trim() || 'Birthday Star';
    const from = senderInput.trim() || 'Someone Special';

    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const link = `${origin}${pathname}?to=${encodeURIComponent(to)}&from=${encodeURIComponent(from)}`;
    setGeneratedLink(link);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handlePreview = () => {
    const to = recipientInput.trim() || 'Birthday Star';
    const from = senderInput.trim() || 'Someone Special';
    
    // Propagate names to ExperienceContext
    setNames(to, from);
    
    // Launch experience
    onStartSurprise();
  };

  return (
    <div className="relative w-screen h-dvh overflow-hidden bg-[#030303] text-zinc-100 flex flex-col justify-center items-center px-6 selection:bg-zinc-800 select-none">
      {/* Background radial glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-950/10 blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="z-10 w-full max-w-md bg-zinc-950/40 p-8 rounded-2xl border border-zinc-900 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <span className="text-2xl mb-3 block">🎁</span>
          <h1 className="font-serif text-2xl md:text-3xl font-light mb-2 tracking-tight leading-tight">
            Create a Birthday Experience
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed">
            Create a personalized birthday surprise and share it with someone special.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Recipient Name Input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
              Recipient Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah"
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-850 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-zinc-700 transition-colors placeholder:text-zinc-600"
              maxLength={25}
            />
          </div>

          {/* Sender Name Input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
              Sender Name
            </label>
            <input
              type="text"
              placeholder="e.g. Seenu"
              value={senderInput}
              onChange={(e) => setSenderInput(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-850 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-zinc-700 transition-colors placeholder:text-zinc-600"
              maxLength={25}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-zinc-100 hover:bg-white active:scale-[0.98] text-zinc-950 font-medium rounded-xl text-sm tracking-wide transition-all cursor-pointer shadow-md"
          >
            Generate Birthday Link
          </button>
        </form>

        {/* Results drawer (fades in once generated) */}
        {generatedLink && (
          <div className="mt-8 pt-6 border-t border-zinc-900 space-y-4 animate-fadeIn">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                Share Link
              </label>
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="w-full px-4 py-2.5 bg-zinc-900/40 border border-zinc-900 rounded-xl text-zinc-400 text-xs focus:outline-none select-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Copy button */}
              <button
                type="button"
                onClick={handleCopy}
                className={`py-3 px-4 font-medium rounded-xl text-xs tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
                  copied
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : 'bg-zinc-900 border-zinc-850 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>

              {/* Start Preview button */}
              <button
                type="button"
                onClick={handlePreview}
                className="py-3 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-750 text-amber-300 font-medium rounded-xl text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer text-center"
              >
                ✨ Start Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
