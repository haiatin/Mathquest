/**
 * MathQuest Odyssey - Cell Component
 *
 * Individual puzzle cell with:
 * - Smooth animations (Framer Motion)
 * - Positive feedback only
 * - Accessibility support
 */

import { motion } from 'framer-motion';
import type { Cell as CellType } from '../../types';

interface CellProps {
  cell: CellType;
  onClick?: () => void;
  isSelected?: boolean;
  showFeedback?: 'correct' | 'incorrect' | null;
}

export function Cell({
  cell,
  onClick,
  isSelected = false,
  showFeedback = null,
}: CellProps) {
  const { value, isFixed, isHighlighted } = cell;

  // Determine cell style based on state
  const getCellStyle = (): string => {
    const baseStyle = 'puzzle-cell ';

    if (showFeedback === 'correct') {
      return baseStyle + 'puzzle-cell-correct';
    }

    if (showFeedback === 'incorrect') {
      return baseStyle + 'puzzle-cell-incorrect';
    }

    if (isFixed) {
      return baseStyle + 'puzzle-cell-fixed';
    }

    if (value !== null) {
      return baseStyle + 'puzzle-cell-filled';
    }

    return baseStyle + 'puzzle-cell-empty';
  };

  // Animation variants
  const cellVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    tap: { scale: 0.95 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    correct: {
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.5,
        times: [0, 0.2, 0.6, 1],
      },
    },
    incorrect: {
      x: [-5, 5, -5, 5, 0],
      transition: {
        duration: 0.4,
      },
    },
    highlighted: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Determine animation based on state
  const getAnimation = () => {
    if (showFeedback === 'correct') return 'correct';
    if (showFeedback === 'incorrect') return 'incorrect';
    if (isHighlighted) return 'highlighted';
    return 'animate';
  };

  return (
    <motion.button
      className={getCellStyle()}
      onClick={!isFixed ? onClick : undefined}
      disabled={isFixed}
      variants={cellVariants}
      initial="initial"
      animate={getAnimation()}
      whileHover={!isFixed ? 'hover' : undefined}
      whileTap={!isFixed ? 'tap' : undefined}
      aria-label={
        value !== null
          ? `Cell value ${value}${isFixed ? ' (fixed)' : ''}`
          : 'Empty cell'
      }
      aria-pressed={isSelected}
      style={{
        cursor: isFixed ? 'default' : 'pointer',
        ...(isHighlighted && {
          boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)',
        }),
        ...(isSelected && {
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.8)',
          transform: 'scale(1.05)',
        }),
      }}
    >
      {value !== null && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 15,
          }}
          className="font-bold"
        >
          {value}
        </motion.span>
      )}

      {/* Particle effect for correct answers */}
      {showFeedback === 'correct' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-success rounded-full"
              initial={{
                x: '50%',
                y: '50%',
              }}
              animate={{
                x: `${50 + Math.cos((i * Math.PI) / 4) * 100}%`,
                y: `${50 + Math.sin((i * Math.PI) / 4) * 100}%`,
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.button>
  );
}

/**
 * Operation Symbol Component
 */
interface OperationSymbolProps {
  operation: string;
  isHorizontal?: boolean;
}

export function OperationSymbol({
  operation,
  isHorizontal = true,
}: OperationSymbolProps) {
  return (
    <motion.div
      className="operation-symbol"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      aria-label={`Operation ${operation}`}
      style={{
        transform: isHorizontal ? 'none' : 'rotate(0deg)',
      }}
    >
      {operation}
    </motion.div>
  );
}

/**
 * Equals Symbol Component
 */
export function EqualsSymbol({ isHorizontal = true }: { isHorizontal?: boolean }) {
  return (
    <motion.div
      className="operation-symbol text-purple-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      aria-label="Equals"
      style={{
        transform: isHorizontal ? 'none' : 'rotate(0deg)',
      }}
    >
      =
    </motion.div>
  );
}
