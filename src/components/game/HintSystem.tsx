/**
 * MathQuest Odyssey - Hint System
 *
 * Progressive hints following Finnish approach (zero stress):
 * - Level 1: General strategy hint
 * - Level 2: Highlight specific area
 * - Level 3: Show bar model visualization
 * - NEVER: Direct solution
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Puzzle, HintLevel } from '../../types';

interface HintSystemProps {
  puzzle: Puzzle;
  currentGrid: any[][];
  onShowHint?: (hint: HintLevel) => void;
}

export function HintSystem({
  puzzle,
  currentGrid,
  onShowHint,
}: HintSystemProps) {
  const [currentHintLevel, setCurrentHintLevel] = useState<1 | 2 | 3 | 4>(1);
  const [showHint, setShowHint] = useState(false);
  const [hintMessage, setHintMessage] = useState('');

  /**
   * Generate hint based on current puzzle state
   */
  const generateHint = (level: 1 | 2 | 3 | 4): HintLevel => {
    // Find empty cells
    const emptyCells: { row: number; col: number }[] = [];
    currentGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.value === null && !cell.isFixed) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    // Find easiest cell (with most constraints/clues)
    const easiestCell = findEasiestCell(emptyCells);

    switch (level) {
      case 1:
        return {
          level: 1,
          message:
            '💡 Astuce : Commence par chercher les équations avec un seul nombre manquant !',
        };

      case 2:
        if (easiestCell) {
          return {
            level: 2,
            message: `🎯 Regarde cette zone... Il y a un indice intéressant !`,
            highlightCells: [easiestCell],
          };
        }
        return {
          level: 2,
          message: '🎯 Essaie de résoudre ligne par ligne ou colonne par colonne.',
        };

      case 3:
        if (easiestCell) {
          const operation = getOperationForCell(easiestCell);
          return {
            level: 3,
            message: `👁️ Visualise l'équation ! Clique sur "Visualiser" pour voir le Bar Model.`,
            highlightCells: [easiestCell],
            showBarModel: true,
            operation,
          };
        }
        return {
          level: 3,
          message: '💭 Pense à voix haute : Quelle opération peux-tu résoudre en premier ?',
        };

      case 4:
        return {
          level: 4,
          message:
            '🌟 Tu es presque là ! Vérifie chaque équation une par une. Quelle est la plus simple ?',
        };

      default:
        return {
          level: 1,
          message: '💡 Continue comme ça ! Tu progresses bien.',
        };
    }
  };

  /**
   * Find the easiest cell to fill (most constraints)
   */
  const findEasiestCell = (
    emptyCells: { row: number; col: number }[]
  ): { row: number; col: number } | null => {
    if (emptyCells.length === 0) return null;

    // Score each empty cell by number of filled neighbors
    const scored = emptyCells.map((cell) => {
      let score = 0;

      // Check row
      const row = currentGrid[cell.row];
      const filledInRow = row.filter((c: any) => c.value !== null).length;
      score += filledInRow;

      // Check column
      const col = currentGrid.map((r) => r[cell.col]);
      const filledInCol = col.filter((c: any) => c.value !== null).length;
      score += filledInCol;

      return { cell, score };
    });

    // Return cell with highest score
    scored.sort((a, b) => b.score - a.score);
    return scored[0].cell;
  };

  /**
   * Get operation related to a cell
   */
  const getOperationForCell = (cell: {
    row: number;
    col: number;
  }): '+' | '-' | '×' | '÷' => {
    // Get horizontal operation if available
    if (cell.col > 0) {
      return puzzle.operations.horizontal[cell.row][cell.col - 1] as '+' | '-' | '×' | '÷';
    }

    // Get vertical operation if available
    if (cell.row > 0) {
      return puzzle.operations.vertical[cell.col][cell.row - 1] as '+' | '-' | '×' | '÷';
    }

    return '+';
  };

  /**
   * Handle hint request
   */
  const handleHintRequest = () => {
    const hint = generateHint(currentHintLevel);
    setHintMessage(hint.message);
    setShowHint(true);

    onShowHint?.(hint);

    // Auto-hide hint after 8 seconds
    setTimeout(() => {
      setShowHint(false);
    }, 8000);

    // Increase hint level for next time (max 4)
    if (currentHintLevel < 4) {
      setCurrentHintLevel((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Hint Button */}
      <motion.button
        className="btn-primary shadow-2xl"
        onClick={handleHintRequest}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Request hint"
      >
        💡 Indice
      </motion.button>

      {/* Hint Display */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="mt-4 max-w-sm"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="feedback-message">
              <p className="text-sm md:text-base leading-relaxed">
                {hintMessage}
              </p>

              <div className="mt-3 flex justify-between items-center text-xs text-green-600">
                <span>Niveau {currentHintLevel}/4</span>
                <button
                  onClick={() => setShowHint(false)}
                  className="hover:text-green-800 transition-colors"
                  aria-label="Close hint"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hint Counter Display (for analytics, not shown to child)
 */
interface HintCounterProps {
  hintsUsed: number;
  show?: boolean;
}

export function HintCounter({ hintsUsed, show = false }: HintCounterProps) {
  if (!show) return null;

  return (
    <div className="text-sm text-gray-600">
      <span>Indices utilisés: {hintsUsed}</span>
    </div>
  );
}
