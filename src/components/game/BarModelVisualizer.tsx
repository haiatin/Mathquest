/**
 * MathQuest Odyssey - Bar Model Visualizer
 *
 * Singapore Method (CPA - Concrete-Pictorial-Abstract)
 * Visual representation of equations using bars
 *
 * Examples:
 * - "2 × ? = 6" → Two groups of ? = 6 total
 * - "12 ÷ ? = 3" → 12 divided into ? parts = 3 each
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { BarModel, Operation } from '../../types';

interface BarModelVisualizerProps {
  equation: string;
  operation: Operation;
  values: (number | null)[];
  show?: boolean;
  onClose?: () => void;
}

export function BarModelVisualizer({
  equation,
  operation,
  values,
  show = false,
  onClose,
}: BarModelVisualizerProps) {
  if (!show) return null;

  const barModel = generateBarModel(operation, values);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bar-model-container max-w-2xl w-full"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-orange-800">
              👁️ Visualisation
            </h3>
            <button
              onClick={onClose}
              className="text-orange-600 hover:text-orange-800 text-2xl transition-colors"
              aria-label="Close visualization"
            >
              ✕
            </button>
          </div>

          {/* Equation */}
          <div className="text-center mb-8">
            <p className="text-3xl font-bold text-gray-800">{equation}</p>
          </div>

          {/* Bar Model Visualization */}
          <div className="space-y-6">
            {barModel.parts.map((part, index) => (
              <BarPart
                key={index}
                part={part}
                index={index}
              />
            ))}
          </div>

          {/* Explanation */}
          <div className="mt-8 p-4 bg-white rounded-lg border-2 border-orange-200">
            <p className="text-lg text-gray-700 leading-relaxed">
              {generateExplanation(operation, values)}
            </p>
          </div>

          <button
            className="btn-primary w-full mt-6"
            onClick={onClose}
          >
            J'ai compris ! ✨
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Individual Bar Part Component
 */
interface BarPartProps {
  part: {
    value: number | null;
    label: string;
    color: string;
    isUnknown: boolean;
  };
  index: number;
}

function BarPart({ part, index }: BarPartProps) {
  const widthPercentage = part.value !== null ? part.value * 10 : 30;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
    >
      <div className="flex items-center gap-4">
        {/* Label */}
        <div className="w-24 text-right font-semibold text-gray-700">
          {part.label}
        </div>

        {/* Bar */}
        <motion.div
          className={`bar-part ${part.color} relative overflow-hidden`}
          style={{
            minWidth: '80px',
            width: `${Math.min(widthPercentage, 100)}%`,
            height: '60px',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(widthPercentage, 100)}%` }}
          transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
        >
          {/* Value or Question Mark */}
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
            {part.isUnknown ? '?' : part.value}
          </div>

          {/* Animated stripes for unknown */}
          {part.isUnknown && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}

          {/* Visual units (dots for small numbers) */}
          {!part.isUnknown && part.value !== null && part.value <= 10 && (
            <div className="absolute inset-0 flex items-center justify-around px-2">
              {[...Array(part.value)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-white bg-opacity-50 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.5 + i * 0.05 }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Generate bar model from operation and values
 */
function generateBarModel(
  operation: Operation,
  values: (number | null)[]
): BarModel {
  const parts: BarModel['parts'] = [];

  switch (operation) {
    case '+':
      // Addition: two parts combine to total
      parts.push({
        value: values[0],
        label: 'Partie 1',
        color: 'bg-blue-300 text-blue-800',
        isUnknown: values[0] === null,
      });
      parts.push({
        value: values[1],
        label: 'Partie 2',
        color: 'bg-green-300 text-green-800',
        isUnknown: values[1] === null,
      });
      parts.push({
        value: values[2],
        label: 'Total',
        color: 'bg-purple-300 text-purple-800',
        isUnknown: values[2] === null,
      });
      break;

    case '-':
      // Subtraction: start with total, remove part
      parts.push({
        value: values[0],
        label: 'Départ',
        color: 'bg-purple-300 text-purple-800',
        isUnknown: values[0] === null,
      });
      parts.push({
        value: values[1],
        label: 'Enlever',
        color: 'bg-red-300 text-red-800',
        isUnknown: values[1] === null,
      });
      parts.push({
        value: values[2],
        label: 'Reste',
        color: 'bg-green-300 text-green-800',
        isUnknown: values[2] === null,
      });
      break;

    case '×':
      // Multiplication: repeated groups
      parts.push({
        value: values[0],
        label: 'Groupes',
        color: 'bg-orange-300 text-orange-800',
        isUnknown: values[0] === null,
      });
      parts.push({
        value: values[1],
        label: 'Par groupe',
        color: 'bg-yellow-300 text-yellow-800',
        isUnknown: values[1] === null,
      });
      parts.push({
        value: values[2],
        label: 'Total',
        color: 'bg-purple-300 text-purple-800',
        isUnknown: values[2] === null,
      });
      break;

    case '÷':
      // Division: split total into equal parts
      parts.push({
        value: values[0],
        label: 'Total',
        color: 'bg-purple-300 text-purple-800',
        isUnknown: values[0] === null,
      });
      parts.push({
        value: values[1],
        label: 'Parties',
        color: 'bg-blue-300 text-blue-800',
        isUnknown: values[1] === null,
      });
      parts.push({
        value: values[2],
        label: 'Chacune',
        color: 'bg-green-300 text-green-800',
        isUnknown: values[2] === null,
      });
      break;
  }

  return {
    equation: '',
    parts,
    total: 0,
    operation,
  };
}

/**
 * Generate explanation text
 */
function generateExplanation(
  operation: Operation,
  values: (number | null)[]
): string {
  const unknownIndex = values.findIndex((v) => v === null);

  switch (operation) {
    case '+':
      if (unknownIndex === 0) {
        return `Pour trouver la première partie, soustrais ${values[1]} de ${values[2]}.`;
      } else if (unknownIndex === 1) {
        return `Pour trouver la deuxième partie, soustrais ${values[0]} de ${values[2]}.`;
      } else {
        return `Pour trouver le total, additionne ${values[0]} et ${values[1]}.`;
      }

    case '-':
      if (unknownIndex === 0) {
        return `Pour trouver le départ, additionne ${values[1]} et ${values[2]}.`;
      } else if (unknownIndex === 1) {
        return `Pour trouver ce qu'on enlève, soustrais ${values[2]} de ${values[0]}.`;
      } else {
        return `Pour trouver ce qui reste, soustrais ${values[1]} de ${values[0]}.`;
      }

    case '×':
      if (unknownIndex === 0) {
        return `Pour trouver le nombre de groupes, divise ${values[2]} par ${values[1]}.`;
      } else if (unknownIndex === 1) {
        return `Pour trouver combien par groupe, divise ${values[2]} par ${values[0]}.`;
      } else {
        return `Pour trouver le total, multiplie ${values[0]} par ${values[1]}.`;
      }

    case '÷':
      if (unknownIndex === 0) {
        return `Pour trouver le total, multiplie ${values[1]} par ${values[2]}.`;
      } else if (unknownIndex === 1) {
        return `Pour trouver le nombre de parties, divise ${values[0]} par ${values[2]}.`;
      } else {
        return `Pour trouver combien chacune, divise ${values[0]} par ${values[1]}.`;
      }

    default:
      return 'Observe bien les barres pour comprendre la relation entre les nombres.';
  }
}

/**
 * Quick Bar Model Button (in game)
 */
interface BarModelButtonProps {
  onClick: () => void;
}

export function BarModelButton({ onClick }: BarModelButtonProps) {
  return (
    <motion.button
      className="btn-secondary"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Show bar model visualization"
    >
      👁️ Visualiser
    </motion.button>
  );
}
