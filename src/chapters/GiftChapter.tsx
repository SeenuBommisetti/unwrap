import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../hooks/useExperience';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  distance: number;
  rotation: number;
}

const generateSparkles = (count: number): Sparkle[] => {
  const colors = ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff', '#fda4af', '#fcd34d'];
  return Array.from({ length: count }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 160;
    const size = 3 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotation = Math.random() * 360;
    return {
      id: i,
      x: 0,
      y: 0,
      size,
      color,
      angle,
      distance,
      rotation,
    };
  });
};

const playRevealSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    
    const playTone = (freq: number, start: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      
      gain.gain.setValueAtTime(vol, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // F-major arpeggio celebration sound: F4 -> A4 -> C5 -> F5 -> A5 -> C6
    playTone(349.23, 0.0, 0.5, 0.05); // F4
    playTone(440.00, 0.08, 0.5, 0.05); // A4
    playTone(523.25, 0.16, 0.5, 0.05); // C5
    playTone(698.46, 0.24, 0.5, 0.05); // F5
    playTone(880.00, 0.32, 0.6, 0.05); // A5
    playTone(1046.50, 0.4, 0.8, 0.05); // C6
  } catch (e) {
    console.error('AudioContext synth failed:', e);
  }
};

export const GiftChapter: React.FC = () => {
  const { nextChapter } = useExperience();
  const [ribbonDragged, setRibbonDragged] = useState(false);
  const [isAnticipating, setIsAnticipating] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const handleUnwrap = useCallback(() => {
    if (ribbonDragged) return;
    setRibbonDragged(true);
    setIsAnticipating(true);
  }, [ribbonDragged]);

  // Handle anticipation phase to open timing
  useEffect(() => {
    if (isAnticipating) {
      const timer = setTimeout(() => {
        setIsAnticipating(false);
        setIsRevealed(true);
        playRevealSound();
        setSparkles(generateSparkles(45));
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isAnticipating]);

  // Handle open to next chapter transition
  useEffect(() => {
    if (isRevealed) {
      const timer = setTimeout(() => {
        nextChapter();
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, nextChapter]);

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto h-full relative selection:bg-transparent">
      {/* Full screen golden ambient glows on reveal */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            className="absolute inset-0 bg-radial from-amber-450/10 via-transparent to-transparent pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <div className="z-10 flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-550 mb-3 font-semibold">
          Chapter 04
        </span>

        <h1 className="font-serif text-3xl md:text-4xl font-light mb-4 tracking-tight leading-tight">
          {isRevealed ? (
            <span className="text-amber-300 font-medium">Surprise Revealed</span>
          ) : (
            'One Last Surprise...'
          )}
        </h1>

        <p className="text-zinc-400 text-sm font-light px-4 leading-relaxed h-12 flex items-center justify-center mb-10">
          {isRevealed
            ? 'Enjoy your birthday gift!'
            : isAnticipating
            ? 'Something is happening...'
            : 'Slide the gold bow upward to untie the ribbon.'}
        </p>

        {/* Gift Box Interaction Space */}
        <div className="relative w-64 h-64 flex items-center justify-center select-none">
          {/* Sparkles explosion layer */}
          <div className="absolute w-1 h-1 flex items-center justify-center z-30">
            {sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                animate={{
                  x: Math.cos(sparkle.angle) * sparkle.distance,
                  y: Math.sin(sparkle.angle) * sparkle.distance - (Math.random() * 30 + 10),
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.2, 1, 0],
                  rotate: sparkle.rotation + 360,
                }}
                transition={{
                  duration: 2.4,
                  ease: [0.16, 1, 0.3, 1] as const,
                  delay: Math.random() * 0.12,
                }}
                style={{
                  position: 'absolute',
                  width: sparkle.size,
                  height: sparkle.size,
                  borderRadius: '50%',
                  backgroundColor: sparkle.color,
                  boxShadow: `0 0 8px ${sparkle.color}`,
                }}
              />
            ))}
          </div>

          {/* Glowing leaks during anticipation */}
          <AnimatePresence>
            {isAnticipating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.95, 1.05, 0.95] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, repeat: Infinity }}
                className="absolute w-44 h-44 bg-amber-400/20 rounded-full blur-xl pointer-events-none z-0"
              />
            )}
          </AnimatePresence>

          {/* Floating Gift Box Canvas */}
          <motion.div
            animate={
              isAnticipating
                ? {
                    rotate: [-1.5, 1.5, -1.5],
                    y: [-1, 1, -1],
                  }
                : isRevealed
                ? {
                    y: 0,
                  }
                : {
                    y: [-6, 6, -6],
                  }
            }
            transition={
              isAnticipating
                ? { repeat: Infinity, duration: 0.15, ease: 'linear' }
                : isRevealed
                ? { duration: 0.5 }
                : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
            }
            className="relative flex flex-col items-center z-10"
          >
            {/* Box Lid */}
            <motion.div
              animate={
                isRevealed
                  ? { y: -180, rotate: -25, opacity: 0, scale: 0.8 }
                  : isAnticipating
                  ? { y: [-2, 0, -2] }
                  : { y: 0 }
              }
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-40 h-10 bg-rose-500 rounded-t-md relative z-20 flex justify-center shadow-md border-b border-rose-600/30"
            >
              {/* Vertical Lid Ribbon */}
              {!ribbonDragged && (
                <div className="w-6 h-full bg-amber-400 shadow-inner" />
              )}
            </motion.div>

            {/* Glowing Seam Light Leak */}
            <AnimatePresence>
              {isAnticipating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-36 h-[2px] bg-amber-200 shadow-[0_0_10px_#f59e0b] z-25 absolute top-[39px]"
                />
              )}
            </AnimatePresence>

            {/* Box Base */}
            <motion.div
              animate={
                isRevealed
                  ? { scaleY: [1, 0.8, 1.05, 1], scaleX: [1, 1.05, 0.95, 1] }
                  : { scaleY: 1 }
              }
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="w-36 h-36 bg-rose-600 rounded-b-md relative z-10 flex justify-center shadow-lg"
            >
              {/* Vertical Base Ribbon */}
              {!ribbonDragged && (
                <div className="w-6 h-full bg-amber-400 shadow-inner" />
              )}

              {/* Horizontal Base Ribbon */}
              {!ribbonDragged && (
                <div className="absolute top-[40%] left-0 right-0 h-6 bg-amber-400 shadow-inner z-15" />
              )}

              {/* Glow core inside box */}
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-2 bg-gradient-to-b from-amber-300 to-amber-500 rounded-md blur-[2px] z-0 flex items-center justify-center text-zinc-950 font-bold font-serif shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                >
                  🎉
                </motion.div>
              )}
            </motion.div>

            {/* Draggable Ribbon Bow Overlay */}
            <AnimatePresence>
              {!ribbonDragged && (
                <motion.div
                  drag="y"
                  dragConstraints={{ top: -140, bottom: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(_, info) => {
                    if (info.offset.y < -65) {
                      handleUnwrap();
                    }
                  }}
                  exit={{ y: -300, opacity: 0, transition: { duration: 0.8, ease: 'easeOut' } }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-7 z-30 cursor-grab active:cursor-grabbing flex flex-col items-center"
                >
                  {/* Gold Bow Vector Shape */}
                  <svg
                    viewBox="0 0 100 60"
                    className="w-20 h-12 text-amber-450 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] fill-current"
                  >
                    {/* Left Loop */}
                    <path d="M 50 30 C 20 5, 10 30, 50 30" stroke="#b45309" strokeWidth="1" />
                    {/* Right Loop */}
                    <path d="M 50 30 C 80 5, 90 30, 50 30" stroke="#b45309" strokeWidth="1" />
                    {/* Center Knot */}
                    <circle cx="50" cy="30" r="8" fill="#fbbf24" stroke="#b45309" strokeWidth="1.2" />
                    {/* Left Ribbon Tail */}
                    <path d="M 46 34 L 30 55 L 42 50 L 48 38" fill="#fbbf24" />
                    {/* Right Ribbon Tail */}
                    <path d="M 54 34 L 70 55 L 58 50 L 52 38" fill="#fbbf24" />
                  </svg>
                  
                  {/* Subtle drag up indicator arrow */}
                  <motion.span
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-[9px] text-amber-300 font-bold uppercase tracking-widest bg-zinc-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/20 mt-1 pointer-events-none"
                  >
                    Drag Up
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
