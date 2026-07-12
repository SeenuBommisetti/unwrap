import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../hooks/useExperience';

type RevealStage =
  | 'idle'
  | 'anticipating'
  | 'open'
  | 'star_rising'
  | 'transforming'
  | 'congratulating';

interface SparkleItem {
  id: string;
  type: 'open' | 'trail' | 'morph';
  x: number;
  y: number | string;
  size: number;
  color: string;
  angle: number;
  distance: number;
  delay: number;
}

const generateOpenSparkles = (count: number): SparkleItem[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `open-${i}`,
    type: 'open',
    x: (Math.random() - 0.5) * 80,
    y: 0,
    size: 2.5 + Math.random() * 4,
    color: '#fbbf24',
    angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.4,
    distance: 60 + Math.random() * 70,
    delay: Math.random() * 0.6,
  }));
};

const generateTrailSparkles = (count: number): SparkleItem[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `trail-${i}`,
    type: 'trail',
    x: 0,
    y: 0,
    size: 2 + Math.random() * 3,
    color: '#fef08a',
    angle: Math.random() * Math.PI * 2,
    distance: 35 + Math.random() * 50,
    delay: Math.random() * 0.7,
  }));
};

const generateMorphSparkles = (count: number): SparkleItem[] => {
  const colors = ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff', '#fda4af', '#fcd34d'];
  return Array.from({ length: count }).map((_, i) => ({
    id: `morph-${i}`,
    type: 'morph',
    x: 0,
    y: 0, // Starts relative to center container (0, 0)
    size: 3 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    angle: Math.random() * Math.PI * 2,
    distance: 60 + Math.random() * 110,
    delay: Math.random() * 0.15,
  }));
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

    // F-major arpeggio celebration sound
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
  const [revealStage, setRevealStage] = useState<RevealStage>('idle');
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);

  const handleUnwrap = useCallback(() => {
    if (ribbonDragged) return;
    setRibbonDragged(true);
    setIsAnticipating(true);
  }, [ribbonDragged]);

  // Sequenced timeline for magical reveal
  useEffect(() => {
    let timerId: any;
    
    if (isAnticipating) {
      timerId = setTimeout(() => {
        setIsAnticipating(false);
        setRevealStage('open');
        playRevealSound();
        setSparkles(generateOpenSparkles(30));
      }, 2200);
    } else if (revealStage === 'open') {
      timerId = setTimeout(() => {
        setRevealStage('star_rising');
        setSparkles((prev) => [...prev, ...generateTrailSparkles(25)]);
      }, 800);
    } else if (revealStage === 'star_rising') {
      timerId = setTimeout(() => {
        setRevealStage('transforming');
        setSparkles((prev) => [...prev, ...generateMorphSparkles(30)]);
      }, 1500);
    } else if (revealStage === 'transforming') {
      timerId = setTimeout(() => {
        setRevealStage('congratulating');
      }, 800);
    } else if (revealStage === 'congratulating') {
      timerId = setTimeout(() => {
        nextChapter();
      }, 2200);
    }
    
    return () => clearTimeout(timerId);
  }, [isAnticipating, revealStage, nextChapter]);

  const isBoxOpen = revealStage !== 'idle' && revealStage !== 'anticipating';

  return (
    <div className="w-full h-full relative selection:bg-transparent overflow-hidden">
      {/* Full-screen ambient glows */}
      <AnimatePresence>
        {isBoxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            className="absolute inset-0 bg-radial from-amber-450/10 via-transparent to-transparent pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* TOP SECTION (Upper third of viewport) */}
      <div className="absolute top-10 md:top-14 left-0 right-0 z-20 flex flex-col items-center text-center px-6 max-w-xl mx-auto select-none pointer-events-none">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-550 mb-3 font-semibold">
          Chapter 04
        </span>

        <AnimatePresence mode="wait">
          {revealStage === 'congratulating' ? (
            <motion.div
              key="congrats-header"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex flex-col items-center"
            >
              <h1 className="font-serif text-[clamp(1.75rem,6vw,2.75rem)] font-light text-amber-250 tracking-wide leading-tight mb-2">
                ✨ Happy Birthday! ✨
              </h1>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Best wishes to you!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="active-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <h1 className="font-serif text-3xl md:text-4xl font-light mb-2 tracking-tight leading-tight">
                One Last Surprise...
              </h1>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                {isAnticipating
                  ? 'Something is happening...'
                  : revealStage === 'open' || revealStage === 'star_rising' || revealStage === 'transforming'
                  ? 'Watch closely...'
                  : 'Slide the gold bow upward to untie the ribbon.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CENTER SECTION (Visual center of screen, y: 0 relative to Center wrapper) */}
      <div className="absolute top-[46%] left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none">
        {/* Sparkles particle layer */}
        <div className="absolute w-1 h-1 flex items-center justify-center">
          {sparkles.map((sparkle) => {
            if (sparkle.type === 'open') {
              return (
                <motion.div
                  key={sparkle.id}
                  initial={{ x: sparkle.x, y: '38vh', opacity: 0, scale: 0 }}
                  animate={{
                    y: '22vh',
                    x: sparkle.x + (Math.random() - 0.5) * 30,
                    opacity: [0, 0.8, 0.8, 0],
                    scale: [0, 1.2, 1, 0],
                  }}
                  transition={{
                    duration: 2.0,
                    ease: 'easeOut',
                    delay: sparkle.delay,
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
              );
            }
            if (sparkle.type === 'trail') {
              return (
                <motion.div
                  key={sparkle.id}
                  initial={{ x: 0, y: '35vh', opacity: 0, scale: 0 }}
                  animate={{
                    x: Math.cos(sparkle.angle) * sparkle.distance,
                    y: Math.sin(sparkle.angle) * (sparkle.distance / 2),
                    opacity: [0, 0.9, 0.9, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeOut',
                    delay: sparkle.delay,
                  }}
                  style={{
                    position: 'absolute',
                    width: sparkle.size,
                    height: sparkle.size,
                    borderRadius: '50%',
                    backgroundColor: sparkle.color,
                    boxShadow: `0 0 6px ${sparkle.color}`,
                  }}
                />
              );
            }
            return (
              <motion.div
                key={sparkle.id}
                initial={{ x: sparkle.x, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: sparkle.x + Math.cos(sparkle.angle) * sparkle.distance,
                  y: Math.sin(sparkle.angle) * sparkle.distance,
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.3, 1, 0],
                }}
                transition={{
                  duration: 1.8,
                  ease: [0.16, 1, 0.3, 1] as const,
                  delay: sparkle.delay,
                }}
                style={{
                  position: 'absolute',
                  width: sparkle.size,
                  height: sparkle.size,
                  borderRadius: '50%',
                  backgroundColor: sparkle.color,
                  boxShadow: `0 0 10px ${sparkle.color}`,
                }}
              />
            );
          })}
        </div>

        {/* Rising Star */}
        <AnimatePresence>
          {(revealStage === 'open' || revealStage === 'star_rising') && (
            <motion.div
              key="rising-star"
              initial={{ y: '38vh', scale: 0.2, rotate: 0, opacity: 0 }}
              animate={
                revealStage === 'open'
                  ? { y: '33vh', scale: 0.6, rotate: 45, opacity: 0.8 }
                  : { y: '0vh', scale: 1.2, rotate: 360, opacity: 1 }
              }
              exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.4 } }}
              transition={{
                y: { duration: revealStage === 'star_rising' ? 1.5 : 0.8, ease: [0.16, 1, 0.3, 1] as const },
                scale: { duration: 0.8 },
                rotate: { duration: 2.2, ease: 'easeOut' },
                opacity: { duration: 0.4 }
              }}
              className="absolute z-35 flex items-center justify-center"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-10 h-10 text-amber-300 fill-current drop-shadow-[0_0_15px_#f59e0b]"
              >
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Morph Cake Icon */}
        <AnimatePresence>
          {(revealStage === 'transforming' || revealStage === 'congratulating') && (
            <motion.div
              key="cake-revealed"
              initial={{ scale: 0.5, opacity: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="absolute z-35 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-zinc-950 border border-amber-400/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.25)]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-10 h-10 text-amber-350"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 3v3M12 2v4M15 3v3" strokeLinecap="round" />
                  <path d="M9 1.5c.2.2.2.5 0 .7M12 .5c.2.2.2.5 0 .7M15 1.5c.2.2.2.5 0 .7" stroke="#fcd34d" strokeLinecap="round" />
                  <rect x="7" y="6" width="10" height="5" rx="1" fill="currentColor" fillOpacity="0.08" />
                  <rect x="5" y="11" width="14" height="6" rx="1.5" fill="currentColor" fillOpacity="0.15" />
                  <path d="M3 17h18" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM SECTION (Grounded Box near lower third of viewport) */}
      <div className="absolute bottom-10 md:bottom-14 left-0 right-0 z-10 flex flex-col items-center select-none">
        <div className="relative w-64 h-48 flex flex-col justify-end items-center">
          {/* Ambient Shadow beneath Box */}
          <motion.div
            animate={
              isBoxOpen
                ? { scale: 0.7, opacity: 0 }
                : { scale: [0.95, 1.08, 0.95], opacity: [0.4, 0.22, 0.4] }
            }
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="absolute bottom-[-10px] w-36 h-3 bg-black/50 rounded-full blur-md z-0 pointer-events-none"
          />

          {/* Gift Box Base & Lid wrapper */}
          <motion.div
            animate={
              isAnticipating
                ? {
                    rotate: [-1.5, 1.5, -1.5],
                    y: [-1, 1, -1],
                  }
                : isBoxOpen
                ? {
                    y: 0,
                  }
                : {
                    y: [-6, 6, -6],
                    rotate: [-0.5, 0.5, -0.5],
                  }
            }
            transition={
              isAnticipating
                ? { repeat: Infinity, duration: 0.15, ease: 'linear' }
                : isBoxOpen
                ? { duration: 0.5 }
                : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
            }
            className="relative flex flex-col items-center z-10"
          >
            {/* Box Lid */}
            <motion.div
              animate={
                isBoxOpen
                  ? { y: -180, rotate: -25, opacity: 0, scale: 0.8 }
                  : isAnticipating
                  ? { y: [-2, 0, -2] }
                  : { y: 0 }
              }
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-40 h-10 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 rounded-t-lg relative z-20 flex justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_4px_8px_rgba(0,0,0,0.35)] border-t border-indigo-500/10 border-b border-indigo-950/40"
            >
              {!ribbonDragged && (
                <div className="w-6 h-full bg-gradient-to-r from-amber-600 via-amber-350 to-amber-600 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)]" />
              )}
            </motion.div>

            {/* Glowing Seam Light Leak */}
            <AnimatePresence>
              {isAnticipating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-36 h-[3px] bg-amber-250 shadow-[0_0_14px_#f59e0b] z-25 absolute top-[39px]"
                />
              )}
            </AnimatePresence>

            {/* Box Base */}
            <motion.div
              animate={
                isBoxOpen
                  ? { scaleY: [1, 0.8, 1.05, 1], scaleX: [1, 1.05, 0.95, 1] }
                  : { scaleY: 1 }
              }
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="w-36 h-36 bg-gradient-to-b from-indigo-900 via-indigo-950 to-zinc-950 rounded-b-xl relative z-10 flex justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),_0_10px_30px_rgba(0,0,0,0.5)] border-x border-b border-indigo-950/40 overflow-hidden"
            >
              {/* Vertical Base Ribbon */}
              {!ribbonDragged && (
                <div className="w-6 h-full bg-gradient-to-r from-amber-600 via-amber-350 to-amber-600 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)] z-10" />
              )}

              {/* Horizontal Base Ribbon */}
              {!ribbonDragged && (
                <div className="absolute top-[40%] left-0 right-0 h-6 bg-gradient-to-b from-amber-600 via-amber-350 to-amber-600 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)] z-10" />
              )}

              {/* Glowing pool inside box */}
              {isBoxOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-1.5 bg-gradient-to-t from-amber-950 via-amber-700 to-amber-500 rounded-md z-0 shadow-[inset_0_4px_20px_rgba(0,0,0,0.85)] flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-radial from-amber-350/45 via-transparent to-transparent blur-md pointer-events-none animate-pulse" />
                </motion.div>
              )}
            </motion.div>

            {/* Draggable Ribbon Bow */}
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
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-10 z-30 cursor-grab active:cursor-grabbing flex flex-col items-center"
                >
                  <svg
                    viewBox="0 0 120 70"
                    className="w-24 h-14 drop-shadow-[0_6px_10px_rgba(0,0,0,0.4)] fill-current"
                  >
                    <defs>
                      <linearGradient id="gold-satin" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="30%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#b45309" />
                        <stop offset="70%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                      <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
                      </filter>
                    </defs>
                    {/* Left Loop */}
                    <path
                      d="M 60 35 C 30 10, 10 30, 60 35"
                      fill="url(#gold-satin)"
                      stroke="#92400e"
                      strokeWidth="0.5"
                      filter="url(#soft-shadow)"
                    />
                    {/* Right Loop */}
                    <path
                      d="M 60 35 C 90 10, 110 30, 60 35"
                      fill="url(#gold-satin)"
                      stroke="#92400e"
                      strokeWidth="0.5"
                      filter="url(#soft-shadow)"
                    />
                    {/* Center Knot */}
                    <circle
                      cx="60"
                      cy="35"
                      r="9"
                      fill="url(#gold-satin)"
                      stroke="#92400e"
                      strokeWidth="0.75"
                    />
                    {/* Left Tail */}
                    <path
                      d="M 56 38 C 45 48, 35 52, 28 62 L 38 60 L 46 48 Z"
                      fill="url(#gold-satin)"
                      stroke="#92400e"
                      strokeWidth="0.25"
                    />
                    {/* Right Tail */}
                    <path
                      d="M 64 38 C 75 48, 85 52, 92 62 L 82 60 L 74 48 Z"
                      fill="url(#gold-satin)"
                      stroke="#92400e"
                      strokeWidth="0.25"
                    />
                  </svg>
                  
                  <motion.span
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-[9px] text-amber-300 font-bold uppercase tracking-widest bg-zinc-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/20 mt-2.5 pointer-events-none shadow-md"
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
