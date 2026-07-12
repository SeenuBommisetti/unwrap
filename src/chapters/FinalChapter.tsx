import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../hooks/useExperience';

export const FinalChapter: React.FC = () => {
  const { recipientName, senderName, resetExperience } = useExperience();
  const [showButton, setShowButton] = useState(false);

  // Fade in the replay button after card lines finish animating
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.55,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto h-full relative select-none selection:bg-transparent">
      {/* Decorative Elegant glow backing */}
      <div className="absolute w-[60%] h-[60%] rounded-full bg-radial from-rose-950/10 via-amber-950/5 to-transparent blur-[100px] pointer-events-none z-0" />

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="z-10 flex flex-col items-center justify-center w-full"
      >
        {/* Dynamic header / recipientName */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-8 tracking-tight leading-tight"
        >
          Happy Birthday,{' '}
          <span className="bg-gradient-to-r from-amber-200 via-rose-350 to-indigo-300 bg-clip-text text-transparent font-medium">
            {recipientName}
          </span>{' '}
          ❤️
        </motion.h1>

        {/* Message body */}
        <motion.div variants={itemVariants} className="space-y-3 mb-10 max-w-sm md:max-w-md mx-auto">
          <p className="text-zinc-350 text-base md:text-lg font-light leading-relaxed">
            May this year bring you happiness,
          </p>
          <p className="text-zinc-350 text-base md:text-lg font-light leading-relaxed">
            wonderful memories,
          </p>
          <p className="text-zinc-350 text-base md:text-lg font-light leading-relaxed">
            and endless reasons to smile.
          </p>
        </motion.div>

        {/* Sign-off */}
        <motion.div variants={itemVariants} className="mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-550 block mb-1">
            With love,
          </span>
          <span className="font-serif italic text-lg text-zinc-200">
            {senderName}
          </span>
        </motion.div>

        {/* Replay action */}
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence>
            {showButton && (
              <motion.button
                onClick={resetExperience}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.04, borderColor: 'rgba(255,255,255,0.25)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                className="px-8 py-3.5 bg-zinc-950 text-zinc-300 font-medium rounded-full text-xs tracking-widest uppercase border border-zinc-800 hover:border-zinc-700 shadow-md cursor-pointer transition-all duration-300"
              >
                ✨ Experience Again
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
