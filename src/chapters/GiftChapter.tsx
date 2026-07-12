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
              className="w-40 h-10 bg-rose-500 rounded-t-md relative z-20 flex justify-center shadow-md border-b border-rose-600/30"
            >
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
                isBoxOpen
                  ? { scaleY: [1, 0.8, 1.05, 1], scaleX: [1, 1.05, 0.95, 1] }
                  : { scaleY: 1 }
              }
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="w-36 h-36 bg-rose-600 rounded-b-md relative z-10 flex justify-center shadow-lg overflow-hidden"
            >
              {!ribbonDragged && (
                <div className="w-6 h-full bg-amber-400 shadow-inner z-10" />
              )}

              {!ribbonDragged && (
                <div className="absolute top-[40%] left-0 right-0 h-6 bg-amber-400 shadow-inner z-10" />
              )}

              {/* Glowing pool inside box */}
              {isBoxOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-1.5 bg-gradient-to-b from-amber-300 to-amber-500 rounded-md blur-[2px] z-0 flex items-center justify-center text-zinc-950 font-bold font-serif shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                />
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
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-7 z-30 cursor-grab active:cursor-grabbing flex flex-col items-center animate-pulse"
                >
                  <svg
                    viewBox="0 0 100 60"
                    className="w-20 h-12 text-amber-450 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] fill-current"
                  >
                    <path d="M 50 30 C 20 5, 10 30, 50 30" stroke="#b45309" strokeWidth="1" />
                    <path d="M 50 30 C 80 5, 90 30, 50 30" stroke="#b45309" strokeWidth="1" />
                    <circle cx="50" cy="30" r="8" fill="#fbbf24" stroke="#b45309" strokeWidth="1.2" />
                    <path d="M 46 34 L 30 55 L 42 50 L 48 38" fill="#fbbf24" />
                    <path d="M 54 34 L 70 55 L 58 50 L 52 38" fill="#fbbf24" />
                  </svg>
                  
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
