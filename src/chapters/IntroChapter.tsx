import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../hooks/useExperience';

type IntroStage = 'hey' | 'waiting' | 'question' | 'wrong_person' | 'yes_confirmed';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  distance: number;
}

const generateSparkles = (count: number): Sparkle[] => {
  const colors = ['#fde047', '#fda4af', '#a78bfa', '#818cf8', '#6ee7b7'];
  return Array.from({ length: count }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 120;
    const size = 4 + Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      id: i,
      x: 0,
      y: 0,
      size,
      color,
      angle,
      distance,
    };
  });
};

export const IntroChapter: React.FC = () => {
  const { nextChapter } = useExperience();
  const [stage, setStage] = useState<IntroStage>('hey');
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (stage === 'hey') {
      const timer = setTimeout(() => {
        setStage('waiting');
      }, 2500);
      return () => clearTimeout(timer);
    }
    if (stage === 'waiting') {
      const timer = setTimeout(() => {
        setStage('question');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleNotReally = useCallback(() => {
    setStage('wrong_person');
    const timer = setTimeout(() => {
      setStage('question');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleYes = useCallback(() => {
    setSparkles(generateSparkles(30));
    setStage('yes_confirmed');
    const timer = setTimeout(() => {
      nextChapter();
    }, 3000);
    return () => clearTimeout(timer);
  }, [nextChapter]);

  // Easing presets
  const textTransition = { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const };
  const textVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: textTransition },
    exit: { opacity: 0, y: -10, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Full screen local background glow when yes is confirmed */}
      <AnimatePresence>
        {stage === 'yes_confirmed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0 }}
            className="absolute inset-0 bg-radial from-[#e0a82e]/5 via-[#aa3bff]/5 to-transparent pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <div className="z-10 w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {stage === 'hey' && (
            <motion.div
              key="hey"
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex items-center justify-center"
            >
              <p className="font-serif text-5xl md:text-7xl font-light text-zinc-100 tracking-wide">
                Hey...
              </p>
            </motion.div>
          )}

          {stage === 'waiting' && (
            <motion.div
              key="waiting"
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex items-center justify-center"
            >
              <p className="font-serif text-3xl md:text-5xl font-light text-zinc-200 tracking-wide leading-relaxed px-4 text-center">
                We've been waiting for you.
              </p>
            </motion.div>
          )}

          {stage === 'question' && (
            <motion.div
              key="question"
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center px-4"
            >
              <h1 className="font-serif text-4xl md:text-6xl font-light text-zinc-100 tracking-tight leading-tight mb-12 text-center max-w-2xl">
                Are you today's birthday star?
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  onClick={handleYes}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(253, 224, 71, 0.15)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 bg-white text-black font-semibold rounded-full text-sm tracking-wide shadow-lg cursor-pointer transition-colors duration-250 flex items-center gap-2 border border-white"
                >
                  <span>✨</span> Yes, that's me
                </motion.button>
                <motion.button
                  onClick={handleNotReally}
                  whileHover={{ scale: 1.04, borderColor: 'rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 bg-zinc-950 text-zinc-300 font-medium rounded-full text-sm tracking-wide cursor-pointer transition-all duration-250 border border-zinc-800"
                >
                  🤔 Not really
                </motion.button>
              </div>
            </motion.div>
          )}

          {stage === 'wrong_person' && (
            <motion.div
              key="wrong_person"
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center px-4"
            >
              <p className="font-serif text-2xl md:text-4xl font-light text-zinc-300 tracking-wide leading-relaxed max-w-lg mb-4 text-center">
                Then someone sent you the wrong surprise 😄
              </p>
              <p className="text-zinc-500 text-xs font-light tracking-widest uppercase">
                Redirecting
              </p>
            </motion.div>
          )}

          {stage === 'yes_confirmed' && (
            <motion.div
              key="yes_confirmed"
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center relative px-4"
            >
              {/* Sparkling particle burst effect */}
              <div className="absolute w-1 h-1 flex items-center justify-center">
                {sparkles.map((sparkle) => (
                  <motion.div
                    key={sparkle.id}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{
                      x: Math.cos(sparkle.angle) * sparkle.distance,
                      y: Math.sin(sparkle.angle) * sparkle.distance,
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1.2, 1, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
                      delay: Math.random() * 0.25,
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
                ))}
              </div>

              <motion.h2
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
                className="font-serif text-5xl md:text-7xl font-light tracking-wide text-center"
              >
                Wonderful.
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 1.0 }}
                className="text-zinc-500 text-[10px] md:text-xs font-light mt-6 tracking-widest uppercase text-center"
              >
                Initializing Verification Sequence
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
