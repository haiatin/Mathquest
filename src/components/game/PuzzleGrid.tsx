/**
 * MathQuest Odyssey - Puzzle Grid Component
 *
 * Main interactive grid with:
 * - Real-time validation
 * - Number pad input
 * - Positive feedback
 * - Accessibility (keyboard navigation)
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cell, OperationSymbol } from './Cell';
import type { Puzzle, Cell as CellType } from '../../types';

interface PuzzleGridProps {
  puzzle: Puzzle;
  onComplete?: (timeSeconds: number, errors: number) => void;
  onCellChange?: (row: number, col: number, value: number | null) => void;
}

export function PuzzleGrid({
  puzzle,
  onComplete,
  onCellChange,
}: PuzzleGridProps) {
  const [gridState, setGridState] = useState<CellType[][]>(puzzle.grid);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [feedback, setFeedback] = useState<{
    row: number;
    col: number;
    type: 'correct' | 'incorrect';
  } | null>(null);
  const [errors, setErrors] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  // Check if puzzle is complete
  useEffect(() => {
    if (isComplete) return;

    const allFilled = gridState.every((row) =>
      row.every((cell) => cell.value !== null)
    );

    if (allFilled && validateAllEquations()) {
      setIsComplete(true);
      const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
      onComplete?.(timeSeconds, errors);
    }
  }, [gridState, isComplete, startTime, errors, onComplete]);

  /**
   * Validate all equations in the puzzle
   */
  const validateAllEquations = useCallback((): boolean => {
    // Validate horizontal equations
    for (let row = 0; row < puzzle.size; row++) {
      if (!validateEquation(gridState[row], puzzle.operations.horizontal[row])) {
        return false;
      }
    }

    // Validate vertical equations
    for (let col = 0; col < puzzle.size; col++) {
      const column = gridState.map((row) => row[col]);
      if (!validateEquation(column, puzzle.operations.vertical[col])) {
        return false;
      }
    }

    return true;
  }, [gridState, puzzle]);

  /**
   * Validate a single equation (row or column)
   */
  const validateEquation = (
    cells: CellType[],
    operations: string[]
  ): boolean => {
    if (cells.some((cell) => cell.value === null)) return false;

    let result = cells[0].value as number;

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      const nextValue = cells[i + 1].value as number;

      switch (op) {
        case '+':
          result += nextValue;
          break;
        case '-':
          result -= nextValue;
          break;
        case '×':
          result *= nextValue;
          break;
        case '÷':
          if (result % nextValue !== 0) return false;
          result /= nextValue;
          break;
      }
    }

    return true;
  };

  /**
   * Handle cell value change
   */
  const handleCellValueChange = (
    row: number,
    col: number,
    value: number | null
  ) => {
    const newGrid = gridState.map((r, rIndex) =>
      r.map((cell, cIndex) => {
        if (rIndex === row && cIndex === col) {
          return { ...cell, value };
        }
        return cell;
      })
    );

    setGridState(newGrid);
    onCellChange?.(row, col, value);

    // Provide gentle feedback if equation complete
    if (value !== null) {
      checkCellCorrectness(row, col, value);
    }
  };

  /**
   * Check if a cell value makes sense (gentle validation)
   */
  const checkCellCorrectness = (row: number, col: number, value: number) => {
    // Only show feedback after a brief delay (non-intrusive)
    setTimeout(() => {
      const isCorrect = puzzle.solution[row][col] === value;

      setFeedback({ row, col, type: isCorrect ? 'correct' : 'incorrect' });

      if (!isCorrect) {
        setErrors((prev) => prev + 1);
      }

      // Clear feedback after animation
      setTimeout(() => setFeedback(null), 1000);
    }, 300);
  };

  /**
   * Handle cell click
   */
  const handleCellClick = (row: number, col: number) => {
    if (gridState[row][col].isFixed) return;
    setSelectedCell({ row, col });
  };

  /**
   * Handle number pad input
   */
  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    if (gridState[row][col].isFixed) return;

    handleCellValueChange(row, col, num);
  };

  /**
   * Handle clear/delete
   */
  const handleClear = () => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    if (gridState[row][col].isFixed) return;

    handleCellValueChange(row, col, null);
  };

  /**
   * Keyboard navigation
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;

      // Number keys
      if (e.key >= '0' && e.key <= '9') {
        const num = parseInt(e.key);
        if (num > 0) {
          handleNumberInput(num);
        }
      }

      // Arrow keys for navigation
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        let newRow = row;
        let newCol = col;

        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(puzzle.size - 1, row + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(puzzle.size - 1, col + 1);
            break;
        }

        setSelectedCell({ row: newRow, col: newCol });
      }

      // Delete/Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, puzzle.size]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Grid Container */}
      <motion.div
        className="card p-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${puzzle.size * 2 - 1}, auto)` }}>
          {gridState.map((row, rowIndex) => (
            <>
              {row.map((cell, colIndex) => (
                <>
                  <Cell
                    key={`cell-${rowIndex}-${colIndex}`}
                    cell={cell}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    isSelected={
                      selectedCell?.row === rowIndex &&
                      selectedCell?.col === colIndex
                    }
                    showFeedback={
                      feedback?.row === rowIndex && feedback?.col === colIndex
                        ? feedback.type
                        : null
                    }
                  />

                  {/* Horizontal operation */}
                  {colIndex < row.length - 1 && (
                    <OperationSymbol
                      operation={puzzle.operations.horizontal[rowIndex][colIndex]}
                      isHorizontal={true}
                    />
                  )}
                </>
              ))}

              {/* Vertical operations row */}
              {rowIndex < gridState.length - 1 && (
                <>
                  {row.map((_, colIndex) => (
                    <>
                      <OperationSymbol
                        key={`vop-${rowIndex}-${colIndex}`}
                        operation={puzzle.operations.vertical[colIndex][rowIndex]}
                        isHorizontal={false}
                      />
                      {colIndex < row.length - 1 && (
                        <div key={`spacer-${rowIndex}-${colIndex}`} className="w-12" />
                      )}
                    </>
                  ))}
                </>
              )}
            </>
          ))}
        </div>
      </motion.div>

      {/* Number Pad */}
      <motion.div
        className="card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              className="number-key"
              onClick={() => num > 0 && handleNumberInput(num)}
              disabled={num === 0}
              aria-label={`Number ${num}`}
            >
              {num === 0 ? '' : num}
            </button>
          ))}
        </div>

        <button
          className="btn-secondary w-full mt-4"
          onClick={handleClear}
          aria-label="Clear cell"
        >
          🗑️ Effacer
        </button>
      </motion.div>

      {/* Completion Celebration */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="celebration-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="card text-center p-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-purple-600 mb-4">
                🎉 Puzzle Résolu ! 🎉
              </h2>
              <p className="text-xl text-gray-700">
                Temps: {Math.floor((Date.now() - startTime) / 1000)}s
              </p>
              <p className="text-lg text-gray-600 mt-2">
                Excellente stratégie ! 🌟
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
