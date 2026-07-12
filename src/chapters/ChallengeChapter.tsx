import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../hooks/useExperience';

interface Balloon {
  id: number;
  color: string;
  size: number;
  speed: number;
  delay: number;
  xOffset: number;
  isTarget: boolean;
  isPopped: boolean;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  angle: number;
  distance: number;
  rotation: number;
}

const BALLOON_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Gold
  '#8b5cf6', // Purple
];

const generateConfetti = (count: number): ConfettiParticle[] => {
  const colors = ['#fde047', '#fda4af', '#a78bfa', '#3b82f6', '#10b981', '#f97316'];
  const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
  return Array.from({ length: count }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 160;
    const size = 5 + Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const rotation = Math.random() * 360;
    return {
      id: i,
      x: 0,
      y: 0,
      size,
      color,
      shape,
      angle,
      distance,
      rotation,
    };
  });
};

// Synth beep sound for popping wrong balloons
const playPopSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
};

// Synth arpeggio sound for popping the correct balloon
const playSuccessSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    playTone(523.25, 0.0, 0.35); // C5
    playTone(659.25, 0.08, 0.35); // E5
    playTone(783.99, 0.16, 0.35); // G5
    playTone(1046.50, 0.24, 0.55); // C6
  } catch (e) {}
};

export const ChallengeChapter: React.FC = () => {
  const { nextChapter } = useExperience();
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [correctPopped, setCorrectPopped] = useState(false);
  const [message, setMessage] = useState('Find the lucky balloon to charge your birthday energy!');
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);

  // Initialize balloon configs once
  useEffect(() => {
    const targetIndex = Math.floor(Math.random() * 5);
    const xOffsets = [12, 30, 48, 66, 84]; // spread horizontally
    const speeds = [7.5, 9.0, 10.5, 8.0, 9.5];
    const delays = [0, 1.2, 0.5, 2.0, 1.6];

    const initial = BALLOON_COLORS.map((color, i) => ({
      id: i,
      color,
      size: 70 + Math.random() * 15,
      speed: speeds[i],
      delay: delays[i],
      xOffset: xOffsets[i],
      isTarget: i === targetIndex,
      isPopped: false,
    }));
    setBalloons(initial);
  }, []);

  // Transition to next chapter when complete
  useEffect(() => {
    if (correctPopped) {
      const timer = setTimeout(() => {
        nextChapter();
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [correctPopped, nextChapter]);

  const handlePop = useCallback((id: number, isTarget: boolean) => {
    if (correctPopped) return;

    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPopped: true } : b))
    );

    if (isTarget) {
      playSuccessSound();
      setConfetti(generateConfetti(45));
      setCorrectPopped(true);
      setMessage('Birthday Energy Fully Charged! 🎉');
    } else {
      playPopSound();
      const failMessages = [
        'Almost!',
        'Not this one! 🤔',
        'Nice try!',
        'Keep going! 🎈',
      ];
      const randomMsg = failMessages[Math.floor(Math.random() * failMessages.length)];
      setMessage(randomMsg);
    }
  }, [correctPopped]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between text-center overflow-hidden py-10 selection:bg-transparent">
      {/* Background glow when correct is popped */}
      <AnimatePresence>
        {correctPopped && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-radial from-amber-450/5 via-transparent to-transparent pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Header Info */}
      <header className="z-10 px-6 max-w-md mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-550 mb-3 font-semibold block">
          Almost there...
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-light mb-4 tracking-tight leading-tight">
          {correctPopped ? (
            <span className="text-amber-300 font-medium">Energy Charged</span>
          ) : (
            'Lucky Balloon Pop'
          )}
        </h1>
        <p className="text-zinc-400 text-sm font-light px-4 leading-relaxed min-h-10 flex items-center justify-center">
          {message}
        </p>
      </header>

      {/* Main interaction space */}
      <main className="flex-1 w-full relative z-10">
        <AnimatePresence>
          {!correctPopped &&
            balloons.map(
              (b) =>
                !b.isPopped && (
                  <motion.div
                    key={b.id}
                    initial={{ y: '110dvh' }}
                    animate={{ y: '-20dvh' }}
                    exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
                    transition={{
                      y: {
                        duration: b.speed,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: b.delay,
                      },
                    }}
                    onClick={() => handlePop(b.id, b.isTarget)}
                    className="absolute cursor-pointer flex flex-col items-center touch-none select-none"
                    style={{
                      left: `${b.xOffset}%`,
                      width: b.size,
                    }}
                  >
                    {/* Balloon body */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        backgroundColor: b.color,
                        width: b.size,
                        height: b.size * 1.25,
                        boxShadow: `inset -6px -6px 15px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.3)`,
                      }}
                      className="rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] relative"
                    >
                      {/* Glossy shine overlay */}
                      <div className="absolute top-[12%] left-[16%] w-[22%] h-[10%] bg-white/20 rounded-full rotate-[-25deg]" />
                    </motion.div>

                    {/* Knot */}
                    <div
                      style={{ borderBottomColor: b.color }}
                      className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] -mt-[1px] z-10"
                    />

                    {/* Balloon string */}
                    <svg width="10" height="50" className="opacity-30">
                      <path
                        d="M 5 0 Q 2 15 8 30 T 5 50"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </motion.div>
                )
            )}
        </AnimatePresence>

        {/* Success Ceremony */}
        <AnimatePresence>
          {correctPopped && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              {/* Confetti blast particles */}
              <div className="absolute w-1 h-1 flex items-center justify-center">
                {confetti.map((particle) => (
                  <motion.div
                    key={particle.id}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                      x: Math.cos(particle.angle) * particle.distance,
                      y: Math.sin(particle.angle) * particle.distance - (Math.random() * 40 + 20),
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1.2, 1, 0],
                      rotate: particle.rotation + 360,
                    }}
                    transition={{
                      duration: 2.2,
                      ease: [0.16, 1, 0.3, 1] as const,
                      delay: Math.random() * 0.1,
                    }}
                    style={{
                      position: 'absolute',
                      width: particle.size,
                      height: particle.size,
                      backgroundColor: particle.shape === 'triangle' ? 'transparent' : particle.color,
                      borderRadius: particle.shape === 'circle' ? '50%' : '0%',
                      borderLeft: particle.shape === 'triangle' ? `${particle.size / 2}px solid transparent` : undefined,
                      borderRight: particle.shape === 'triangle' ? `${particle.size / 2}px solid transparent` : undefined,
                      borderBottom: particle.shape === 'triangle' ? `${particle.size}px solid ${particle.color}` : undefined,
                      boxShadow: `0 0 5px ${particle.color}`,
                    }}
                  />
                ))}
              </div>

              {/* Glowing Birthday Cake Icon */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                className="w-32 h-32 rounded-full bg-zinc-950 border border-amber-400/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.15)] mb-4"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-14 h-14 text-amber-350"
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
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Spacer to keep layouts clean */}
      <footer className="z-10 h-6" />
    </div>
  );
};
