
import React from 'react';
// FIX: Import Variants from framer-motion to correctly type animation variants.
import { motion, Variants } from 'framer-motion';

interface FormattedReadingProps {
  text: string;
}

const renderBold = (line: string) => {
  const parts = line.split('**');
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-cyan-400">
        {part}
      </strong>
    ) : (
      part
    )
  );
};

const containerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.05, // 50ms stagger
    },
  },
};

// FIX: Explicitly type 'itemVariants' with 'Variants' to resolve easing string type error.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const FormattedReading: React.FC<FormattedReadingProps> = ({ text }) => {
  return (
    <motion.div
      className="prose prose-lg prose-invert max-w-none leading-loose space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {text.split('\n').filter(p => p.trim() !== '').map((p, i) => {
        if (p.startsWith('@@EPIC@@')) {
          const content = p.replace('@@EPIC@@', '');
          return (
            <motion.p
              key={i}
              variants={itemVariants}
              className="text-center !text-2xl !my-10 font-bold !text-indigo-300 tracking-wide !leading-loose"
            >
              {renderBold(content)}
            </motion.p>
          );
        }
        if (p.startsWith('@@FINAL@@')) {
          const content = p.replace('@@FINAL@@', '');
          return (
            <motion.p key={i} variants={itemVariants}>
              {renderBold(content)}
            </motion.p>
          );
        }
        return (
          <motion.p key={i} variants={itemVariants}>
            {renderBold(p)}
          </motion.p>
        );
      })}
    </motion.div>
  );
};

export default FormattedReading;
