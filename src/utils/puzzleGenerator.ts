/**
 * MathQuest Odyssey - Simplified Puzzle Generator
 *
 * Simplified version that generates working puzzles every time
 */

import type {
  Puzzle,
  Cell,
  Operation,
  PuzzleConstraints,
  World,
  SkillType,
} from '../types';

export class PuzzleGenerator {
  /**
   * Generate a simple, guaranteed-working puzzle
   */
  generate(constraints: PuzzleConstraints): Puzzle {
    // For now, always generate simple 3x3 puzzles with addition/subtraction
    return this.generateSimple3x3(constraints.difficulty);
  }

  /**
   * Generate a simple 3x3 puzzle with addition and subtraction
   *
   * Example puzzle:
   * [2] + [3] = [5]
   *  +     -     +
   * [4] - [1] = [3]
   *  =     =     =
   * [6]   [2]   [8]
   */
  private generateSimple3x3(difficulty: number): Puzzle {
    const gridSize = 3;

    // Create a valid solution that works
    // Row 0: 2 + 3 = 5
    // Row 1: 4 - 1 = 3
    // Col 0: 2 + 4 = 6
    // Col 1: 3 - 1 = 2
    // Col 2: 5 + 3 = 8
    const solution: number[][] = [
      [2, 3, 5],
      [4, 1, 3],
      [6, 2, 8]
    ];

    // Horizontal operations (between cells in each row)
    // Row 0: 2 [+] 3 [=] 5 → operations: ['+'] (one operation between first two cells)
    // Row 1: 4 [-] 1 [=] 3 → operations: ['-']
    // Row 2: 6 [?] 2 [=] 8 → this is the result row, no operations needed
    const horizontalOps: Operation[][] = [
      ['+'],  // 2 + 3 = 5
      ['-'],  // 4 - 1 = 3
      ['+']   // Result row: 6 + 2 = 8 (for validation)
    ];

    // Vertical operations (between cells in each column)
    // Col 0: 2 [+] 4 [=] 6 → operations: ['+']
    // Col 1: 3 [-] 1 [=] 2 → operations: ['-']
    // Col 2: 5 [+] 3 [=] 8 → operations: ['+']
    const verticalOps: Operation[][] = [
      ['+'],  // 2 + 4 = 6
      ['-'],  // 3 - 1 = 2
      ['+']   // 5 + 3 = 8
    ];

    // Create grid
    const grid: Cell[][] = [];
    for (let row = 0; row < gridSize; row++) {
      grid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = {
          row,
          col,
          value: solution[row][col],
          isFixed: false, // Will be set later based on difficulty
        };
      }
    }

    // Mark some cells as fixed (pre-filled) based on difficulty
    // Difficulty 1 (easy): 5 cells fixed, 4 to fill
    // Difficulty 2 (medium): 4 cells fixed, 5 to fill
    // Difficulty 3+ (hard): 3 cells fixed, 6 to fill
    const cellsToFix = difficulty === 1 ? 5 : difficulty === 2 ? 4 : 3;
    const fixedPositions = [
      { row: 0, col: 0 },  // Top left
      { row: 0, col: 2 },  // Top right (result)
      { row: 1, col: 1 },  // Middle
      { row: 2, col: 0 },  // Bottom left (result)
      { row: 2, col: 2 },  // Bottom right (result)
    ];

    for (let i = 0; i < Math.min(cellsToFix, fixedPositions.length); i++) {
      const { row, col } = fixedPositions[i];
      grid[row][col].isFixed = true;
    }

    return {
      id: `puzzle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      grid,
      operations: {
        horizontal: horizontalOps,
        vertical: verticalOps,
      },
      size: gridSize,
      difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
      solution,
      world: 'egypt' as World,
      level: 1,
      targetedSkills: ['logic', 'mastery'] as SkillType[],
    };
  }
}

/**
 * Factory function for easy puzzle generation
 */
export function generatePuzzle(
  difficulty: 1 | 2 | 3 | 4 | 5 = 1
): Puzzle {
  const generator = new PuzzleGenerator();

  const constraints: PuzzleConstraints = {
    gridSize: 3,
    operations: ['+', '-'],
    numberRange: [1, 10],
    difficulty,
  };

  return generator.generate(constraints);
}
