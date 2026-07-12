import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../hooks/useExperience';

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

const generateConfetti = (count: number): ConfettiParticle[] => {
  const colors = ['#fde047', '#fda4af', '#a78bfa', '#3b82f6', '#10b981', '#f97316'];
  const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
  return Array.from({ length: count }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 150;
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

const playSuccessSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    
    // Quick, happy synth arpeggio: C5 -> E5 -> G5 -> C6
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

    playTone(523.25, 0.0, 0.4); // C5
    playTone(659.25, 0.1, 0.4); // E5
    playTone(783.99, 0.2, 0.4); // G5
    playTone(1046.50, 0.3, 0.6); // C6
  } catch (e) {
    console.error('AudioContext synth failed:', e);
  }
};

export const ScannerChapter: React.FC = () => {
  const { nextChapter } = useExperience();
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showConfirmationText, setShowConfirmationText] = useState(false);
  const [interrupted, setInterrupted] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    let intervalId: any;
    
    if (isScanning && !scanComplete) {
      const scanDuration = 2800; // 2.8 seconds
      const intervalTime = 50;
      const step = (intervalTime / scanDuration) * 100;
      
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const next = prev + step;
          if (next >= 100) {
            clearInterval(intervalId);
            setScanComplete(true);
            setIsScanning(false);
            playSuccessSound();
            setConfetti(generateConfetti(45));
            return 100;
          }
          return next;
        });
      }, intervalTime);
    } else if (!isScanning && !scanComplete && progress > 0) {
      // Progress decays if interrupted
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const next = prev - 3.5; // decay slightly faster
          if (next <= 0) {
            clearInterval(intervalId);
            setInterrupted(false);
            return 0;
          }
          return next;
        });
      }, 50);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isScanning, scanComplete, progress]);

  // Transition to next chapter after completion
  useEffect(() => {
    if (scanComplete) {
      const timer = setTimeout(() => {
        nextChapter();
      }, 1650);
      return () => clearTimeout(timer);
    }
  }, [scanComplete, nextChapter]);

  // Delay confirmation text reveal
  useEffect(() => {
    if (scanComplete) {
      const timer = setTimeout(() => {
        setShowConfirmationText(true);
      }, 450);
      return () => clearTimeout(timer);
    } else {
      setShowConfirmationText(false);
    }
  }, [scanComplete]);

  const startScan = (e: React.MouseEvent | React.TouchEvent) => {
    if (scanComplete) return;
    e.preventDefault();
    setIsScanning(true);
    setInterrupted(false);
  };

  const stopScan = () => {
    if (scanComplete) return;
    setIsScanning(false);
    if (progress < 100 && progress > 0) {
      setInterrupted(true);
    }
  };

  const getSubMessage = () => {
    if (showConfirmationText) return 'Birthday Status: Confirmed ✅';
    if (scanComplete) return '';
    if (isScanning) {
      if (progress < 15) return 'Checking birthday database...';
      if (progress < 30) return 'Verifying cake eligibility...';
      if (progress < 45) return 'Counting candles...';
      if (progress < 60) return 'Detecting happiness levels...';
      if (progress < 75) return 'Looking for presents...';
      if (progress < 90) return 'Analyzing cake-to-mouth ratio...';
      return 'Almost there...';
    }
    if (interrupted) return 'Scan interrupted. Keep holding!';
    return 'Hold finger on scanner to verify.';
  };

  // 2 * PI * r (for radius 54, circumference is ~339.292)
  const strokeCircumference = 339.292;
  const strokeDashoffset = strokeCircumference * (1 - progress / 100);

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto h-full relative">
      {/* Background glow shift on success */}
      <AnimatePresence>
        {scanComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <div className="z-10 flex flex-col items-center justify-center">

        
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-6 tracking-tight leading-tight transition-colors duration-500">
          {showConfirmationText ? (
            <span className="text-emerald-400 font-medium">Birthday Confirmed</span>
          ) : (
            'Birthday Verification'
          )}
        </h1>
        
        <p className="text-zinc-400 text-sm md:text-base mb-12 font-light leading-relaxed max-w-sm h-12 flex items-center justify-center">
          {getSubMessage()}
        </p>

        {/* Scanner Container */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-12 select-none">
          {/* Confetti Explosion Layer */}
          <div className="absolute w-1 h-1 flex items-center justify-center z-20">
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

          {/* SVG Progress Ring */}
          <svg className="absolute w-full h-full transform -rotate-90 z-10 pointer-events-none">
            <circle
              cx="80"
              cy="80"
              r="54"
              className="stroke-zinc-900"
              strokeWidth="4"
              fill="transparent"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="54"
              className={scanComplete ? "stroke-emerald-450" : "stroke-rose-500"}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={strokeCircumference}
              strokeDashoffset={strokeDashoffset}
              transition={{ type: 'tween', ease: 'easeOut' }}
            />
          </svg>

          {/* Core Interactive Scanner Button */}
          <motion.div
            onMouseDown={startScan}
            onMouseUp={stopScan}
            onMouseLeave={stopScan}
            onTouchStart={startScan}
            onTouchEnd={stopScan}
            animate={
              isScanning
                ? { scale: 0.95, borderColor: 'rgba(244, 63, 94, 0.4)' }
                : scanComplete
                ? { scale: 1.05, borderColor: 'rgba(16, 185, 129, 0.4)', boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }
                : { scale: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }
            }
            className={`w-28 h-28 rounded-full border-2 bg-zinc-950 flex flex-col items-center justify-center relative cursor-pointer overflow-hidden z-10 select-none touch-none transition-shadow duration-300`}
            style={{ touchAction: 'none' }}
          >
            {/* Pulsing Scan Glow */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.1, 0.25, 0.1] }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-rose-500/20 rounded-full"
                />
              )}
            </AnimatePresence>

            {/* Glowing Scan Laser Line */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ y: -45, opacity: 0 }}
                  animate={{ y: 45, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 1.6,
                      ease: 'easeInOut',
                    },
                    opacity: { duration: 0.3 }
                  }}
                  className="absolute left-0 right-0 h-[2px] bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)] z-20 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Fingerprint Vector Icon */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              animate={
                scanComplete
                  ? {
                      scale: [1, 1.22, 0.96, 1.04, 1],
                      filter: [
                        'drop-shadow(0 0 0px rgba(16, 185, 129, 0))',
                        'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))',
                        'drop-shadow(0 0 0px rgba(16, 185, 129, 0))',
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 0.85,
                ease: 'easeInOut',
                delay: 0.25,
              }}
              className={`w-12 h-12 transition-colors duration-300 pointer-events-none ${
                scanComplete
                  ? 'text-emerald-400'
                  : isScanning
                  ? 'text-rose-455'
                  : 'text-zinc-500'
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.272M6 10.5c0-2.208 1-4.183 2.592-5.5M6 10.5c0 2.92.556 5.709 1.568 8.272M6 10.5c-.714 0-1.393-.153-2-.43M18 10.5c0-2.208-1-4.183-2.592-5.5m2.592 5.5a14.28 14.28 0 0 1-1.568 8.272M18 10.5c.714 0 1.393-.153 2-.43M13.5 10.5c0-1.104-.5-2-1.5-2s-1.5.896-1.5 2M13.5 10.5c0 1.942-.256 3.824-.742 5.623M10.5 10.5c0 1.942.256 3.824.742 5.623m-1.484-5.623c-.362 0-.693-.093-1-.258M12 10.5c0-2.208 1.5-4 3.5-4s3.5 1.792 3.5 4M12 10.5c0 2.92.556 5.709 1.568 8.272"
              />
            </motion.svg>
          </motion.div>
        </div>

        {/* ProgressBar bottom preview (subtle indicator) */}
        <div className="w-48 h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900/50">
          <motion.div
            className={`h-full ${scanComplete ? 'bg-emerald-500' : 'bg-rose-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'tween' }}
          />
        </div>
      </div>
    </div>
  );
};
