import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../hooks/useExperience';

interface ConfettiParticle {
  id: number;
  xOffset: number;
  color: string;
  size: number;
  speed: number;
  delay: number;
  rotationSpeed: number;
}

const generateConfetti = (count: number): ConfettiParticle[] => {
  const colors = ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff', '#fda4af', '#f472b6'];
  return Array.from({ length: count }).map((_, i) => {
    return {
      id: i,
      xOffset: Math.random() * 100, // percentage from left
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 5,
      speed: 3.5 + Math.random() * 4,
      delay: Math.random() * 1.5,
      rotationSpeed: 180 + Math.random() * 360,
    };
  });
};

const playGentleCelebrationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Soft, warm major chords: C4 -> E4 -> G4 -> C5 -> E5
    playTone(261.63, 0.0, 1.2); // C4
    playTone(329.63, 0.05, 1.2); // E4
    playTone(392.00, 0.1, 1.2); // G4
    playTone(523.25, 0.15, 1.4); // C5
    playTone(659.25, 0.2, 1.4); // E5
  } catch (e) {
    console.error('AudioContext synth failed:', e);
  }
};

interface CandleProps {
  candlesExtinguished: boolean;
  showSmoke: boolean;
  isBlowing: boolean;
  onTap: () => void;
}

const Candle: React.FC<CandleProps> = ({
  candlesExtinguished,
  showSmoke,
  isBlowing,
  onTap,
}) => {
  return (
    <div 
      onClick={onTap}
      className="relative w-4 h-16 flex flex-col items-center cursor-pointer group"
    >
      {/* Flame */}
      <AnimatePresence>
        {!candlesExtinguished && (
          <motion.div
            animate={
              isBlowing
                ? {
                    scaleY: [1, 0.4, 1.3, 0.3],
                    scaleX: [1, 0.6, 1.4, 0.4],
                    rotate: [-8, 12, -10, 15, -4],
                    x: [-1, 2, -2, 1, 0],
                  }
                : {
                    scaleY: [1, 1.06, 0.94, 1],
                    scaleX: [1, 0.97, 1.03, 1],
                    rotate: [-1, 1, -1, 0],
                  }
            }
            transition={{
              repeat: Infinity,
              duration: isBlowing ? 0.3 : 1.4,
              ease: "easeInOut",
            }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.35 } }}
            className="w-3.5 h-7 rounded-[50%_50%_20%_20%_/_70%_70%_30%_30%] bg-gradient-to-t from-red-500 via-amber-400 to-yellow-100 shadow-[0_0_15px_#f59e0b] origin-bottom absolute -top-5 z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Smoke particle */}
      <AnimatePresence>
        {candlesExtinguished && showSmoke && (
          <motion.div
            initial={{ y: -5, scale: 0.3, opacity: 0.7 }}
            animate={{ y: -45, scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="w-2 h-2 bg-zinc-500 rounded-full blur-[2px] absolute pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Wick */}
      <div className="w-[1.2px] h-2.5 bg-zinc-700 z-10 pointer-events-none" />

      {/* Candle Stick */}
      <div className="w-2 h-10 bg-gradient-to-b from-sky-400 to-indigo-500 rounded-sm shadow-inner group-hover:brightness-110 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export const CakeChapter: React.FC = () => {
  const { nextChapter, recipientName } = useExperience();
  const [hasMicAccess, setHasMicAccess] = useState<boolean | null>(null);
  const [blowProgress, setBlowProgress] = useState(0);
  const [isBlowing, setIsBlowing] = useState(false);
  const [candlesExtinguished, setCandlesExtinguished] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const isFinished = useRef(false);

  const extinguishCandles = useCallback(() => {
    if (isFinished.current) return;
    isFinished.current = true;
    
    setCandlesExtinguished(true);
    setShowSmoke(true);
    setIsBlowing(false);
    playGentleCelebrationSound();
    setConfetti(generateConfetti(35));

    // Transition to next chapter
    setTimeout(() => {
      nextChapter();
    }, 4500);
  }, [nextChapter]);

  // Set up microphone blow analyzer
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let stream: MediaStream | null = null;
    let animationId: number;

    const initMic = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicAccess(true);
        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContext = new AudioContextClass();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const checkVolume = () => {
          if (!analyser || isFinished.current) return;
          analyser.getByteFrequencyData(dataArray);
          
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          
          // Trigger when blowing sounds are detected
          if (average > 42) {
            setIsBlowing(true);
            setBlowProgress((prev) => {
              const next = prev + 4.2;
              if (next >= 100) {
                extinguishCandles();
                return 100;
              }
              return next;
            });
          } else {
            setIsBlowing(false);
            setBlowProgress((prev) => Math.max(0, prev - 2.0));
          }
          
          animationId = requestAnimationFrame(checkVolume);
        };
        
        checkVolume();
      } catch (err) {
        console.warn('Microphone access denied or error:', err);
        setHasMicAccess(false);
      }
    };

    initMic();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (audioContext) audioContext.close();
    };
  }, [extinguishCandles]);

  const handleTap = () => {
    if (candlesExtinguished) return;
    setBlowProgress(100);
    extinguishCandles();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto h-full relative selection:bg-transparent">
      {/* Full screen warm golden glow when extinguished */}
      <AnimatePresence>
        {candlesExtinguished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0 }}
            className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-transparent pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Gentle drifting confetti snow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {confetti.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ y: '-10vh', x: `${particle.xOffset}vw`, opacity: 0, rotate: 0 }}
            animate={{ y: '110dvh', opacity: [0, 1, 1, 0], rotate: particle.rotationSpeed }}
            transition={{
              duration: particle.speed,
              delay: particle.delay,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: particle.color,
              boxShadow: `0 0 8px ${particle.color}`,
            }}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-550 mb-3 font-semibold">
          Make a wish.
        </span>

        {/* Dynamic Headers */}
        <AnimatePresence mode="wait">
          {candlesExtinguished ? (
            <motion.div
              key="stored"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <h1 className="font-serif text-3xl md:text-4xl font-light mb-4 tracking-tight leading-tight text-amber-300">
                Wish Captured
              </h1>
              <p className="text-zinc-400 text-sm font-light px-4 leading-relaxed h-12 flex items-center justify-center">
                Beautiful wish, {recipientName} ✨
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="font-serif text-3xl md:text-4xl font-light mb-4 tracking-tight leading-tight">
                Make a Wish
              </h1>
              <p className="text-zinc-400 text-sm font-light px-4 leading-relaxed h-12 flex items-center justify-center">
                {hasMicAccess === false
                  ? 'Tap the candles to blow them out.'
                  : 'Close your eyes, think of a wish, and blow.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Frosted Layered Cake Component */}
        <div className="my-10 relative flex flex-col items-center">
          {/* 3 Candles */}
          <div className="flex justify-center space-x-8 -mb-[6px] relative z-25">
            <Candle
              candlesExtinguished={candlesExtinguished}
              showSmoke={showSmoke}
              isBlowing={isBlowing}
              onTap={handleTap}
            />
            <Candle
              candlesExtinguished={candlesExtinguished}
              showSmoke={showSmoke}
              isBlowing={isBlowing}
              onTap={handleTap}
            />
            <Candle
              candlesExtinguished={candlesExtinguished}
              showSmoke={showSmoke}
              isBlowing={isBlowing}
              onTap={handleTap}
            />
          </div>

          {/* Frosted layers */}
          <div className="relative w-52 h-32 flex flex-col items-center">
            {/* Top Tier (Cream/White) */}
            <div className="w-40 h-14 bg-zinc-900 rounded-[50%_/_20%] border-t border-zinc-800 shadow-md relative z-20 flex flex-col justify-end">
              {/* Frosting Drips */}
              <div className="absolute top-[80%] left-[10%] w-5 h-5 bg-zinc-900 rounded-full blur-[0.5px]" />
              <div className="absolute top-[85%] left-[42%] w-4 h-6 bg-zinc-900 rounded-full blur-[0.5px]" />
              <div className="absolute top-[75%] left-[75%] w-6 h-4 bg-zinc-900 rounded-full blur-[0.5px]" />
            </div>

            {/* Bottom Tier (Chocolate) */}
            <div className="w-46 h-16 bg-zinc-950 rounded-[50%_/_15%] -mt-6 border-t border-zinc-900 shadow-lg relative z-10">
              {/* Colorful candy sprinkles */}
              <div className="absolute top-[35%] left-[25%] w-1.2 h-1.2 bg-rose-400 rounded-full opacity-60" />
              <div className="absolute top-[55%] left-[55%] w-1.2 h-1.2 bg-yellow-300 rounded-full opacity-60" />
              <div className="absolute top-[30%] left-[70%] w-1.2 h-1.2 bg-indigo-400 rounded-full opacity-60" />
              <div className="absolute top-[60%] left-[38%] w-1.2 h-1.2 bg-emerald-400 rounded-full opacity-60" />
            </div>

            {/* Silver Base Plate */}
            <div className="w-52 h-5 bg-zinc-850 rounded-full -mt-4 border-t border-zinc-800 shadow-2xl relative z-0" />
          </div>
        </div>

        {/* Blow progress bar (hidden if mic permission is denied or complete) */}
        {!candlesExtinguished && hasMicAccess !== false && (
          <div className="w-44 h-[3px] bg-zinc-950 rounded-full overflow-hidden border border-zinc-900/50">
            <motion.div
              className="h-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"
              initial={{ width: 0 }}
              animate={{ width: `${blowProgress}%` }}
              transition={{ type: 'tween' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
