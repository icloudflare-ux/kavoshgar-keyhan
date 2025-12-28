
import React from 'react';
import { motion, Variants } from 'framer-motion';
import CosmicClock from './CosmicClock';

const Hero: React.FC = () => {
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.section 
      id="hero"
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden pt-24"
    >
      <CosmicClock />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 mt-12">
        <motion.h2 
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-100 leading-tight font-lalezar tracking-wide drop-shadow-[0_0_20px_rgba(192,132,252,0.5)]"
        >
          کاوش در <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400">اسرار</span> آسمان
        </motion.h2>

        <motion.h3
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
          className="mt-6 text-2xl md:text-3xl font-lalezar tracking-wider text-amber-300"
          style={{ textShadow: '0 0 15px rgba(252, 211, 77, 0.5)' }}
        >
          {"هویت ما: شهودِ ماه، حکمتِ عدد ۹"}
        </motion.h3>

        <motion.p 
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-tanha leading-relaxed font-medium bg-black/20 backdrop-blur-sm p-3 md:p-4 rounded-xl"
        >
          {"سفر خود را در سه مدار کیهانی آغاز کنید: رصد زنده بازار در «اتاق فرمان»، کشف درون با «آزمایشگاه اسرار» و یادگیری عمیق در «گنجینه حکمت»."}
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Hero;
