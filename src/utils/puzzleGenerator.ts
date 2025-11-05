/**
 * MathQuest Odyssey - Puzzle Generator
 *
 * Generates CrossMath puzzles with guaranteed unique solutions
 *
 * Algorithm:
 * 1. Create a valid completed grid
 * 2. Strategically remove cells
 * 3. Verify unique solution via backtracking
 * 4. Validate difficulty and constraints
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
   * Generate a puzzle with guaranteed unique solution
   */
  generate(constraints: PuzzleConstraints): Puzzle {
    const MAX_ATTEMPTS = 1000;
    let attempts = 0;

    while (attempts++ < MAX_ATTEMPTS) {
      try {
        // 1. Create valid completed grid
        const completedGrid = this.createValidCompletedGrid(constraints);

        // 2. Remove cells strategically to create puzzle
        const puzzle = this.removeCellsStrategically(
          completedGrid,
          constraints
        );

        // 3. Verify unique solution
        if (this.countSolutions(puzzle) !== 1) {
          continue;
        }

        // 4. Validate other constraints
        if (!this.meetsAllConstraints(puzzle, constraints)) {
          continue;
        }

        return puzzle;
      } catch (error) {
        // Try again
        continue;
      }
    }

    throw new Error(
      'Could not generate valid puzzle within attempt limit'
    );
  }

  /**
   * Create a valid completed grid (all cells filled correctly)
   */
  private createValidCompletedGrid(
    constraints: PuzzleConstraints
  ): Puzzle {
    const { gridSize, operations, numberRange, difficulty } = constraints;
    const [minNum, maxNum] = numberRange;

    // Initialize grid with random numbers
    const grid: Cell[][] = [];
    for (let row = 0; row < gridSize; row++) {
      grid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        grid[row][col] = {
          row,
          col,
          value: this.randomInRange(minNum, maxNum),
          isFixed: true,
        };
      }
    }

    // Generate operations
    const horizontalOps: Operation[][] = [];
    const verticalOps: Operation[][] = [];

    for (let i = 0; i < gridSize; i++) {
      horizontalOps[i] = this.generateOperationRow(
        gridSize - 1,
        operations
      );
      verticalOps[i] = this.generateOperationRow(
        gridSize - 1,
        operations
      );
    }

    // Adjust values to make equations valid
    this.adjustGridToMakeValid(grid, horizontalOps, verticalOps);

    // Extract solution
    const solution = grid.map((row) =>
      row.map((cell) => cell.value as number)
    );

    return {
      id: this.generatePuzzleId(),
      grid,
      operations: {
        horizontal: horizontalOps,
        vertical: verticalOps,
      },
      size: gridSize,
      difficulty,
      solution,
      world: this.determineWorld(difficulty),
      level: 1,
      targetedSkills: this.determineTargetedSkills(operations, difficulty),
    };
  }

  /**
   * Adjust grid values to make all equations valid
   */
  private adjustGridToMakeValid(
    grid: Cell[][],
    horizontalOps: Operation[][],
    verticalOps: Operation[][]
  ): void {
    const size = grid.length;

    // Adjust horizontal equations
    for (let row = 0; row < size; row++) {
      this.adjustRowToValid(grid[row], horizontalOps[row]);
    }

    // Adjust vertical equations
    for (let col = 0; col < size; col++) {
      const column = grid.map((row) => row[col]);
      this.adjustRowToValid(column, verticalOps[col]);
      // Update grid with adjusted column
      column.forEach((cell, row) => {
        grid[row][col] = cell;
      });
    }
  }

  /**
   * Adjust a row/column to make the equation valid
   */
  private adjustRowToValid(cells: Cell[], operations: Operation[]): void {
    if (cells.length < 2) return;

    // Calculate what the result should be based on first n-1 numbers
    let result = cells[0].value as number;

    for (let i = 0; i < operations.length - 1; i++) {
      const op = operations[i];
      const nextValue = cells[i + 1].value as number;
      result = this.applyOperation(result, op, nextValue);
    }

    // Set the last cell to make equation valid
    const lastOp = operations[operations.length - 1];
    const secondToLast = cells[cells.length - 2].value as number;

    // Solve for last cell based on operation
    let lastValue: number;

    switch (lastOp) {
      case '+':
        lastValue = result - secondToLast;
        break;
      case '-':
        lastValue = secondToLast - result;
        break;
      case '×':
        lastValue = Math.round(result / secondToLast);
        break;
      case '÷':
        lastValue = Math.round(secondToLast / result);
        break;
      default:
        lastValue = result;
    }

    // Ensure positive integer
    lastValue = Math.max(1, Math.abs(Math.round(lastValue)));
    cells[cells.length - 1].value = lastValue;
  }

  /**
   * Apply an operation to two numbers
   */
  private applyOperation(
    a: number,
    op: Operation,
    b: number
  ): number {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        // Ensure integer division
        return b !== 0 ? Math.round(a / b) : a;
      default:
        return a;
    }
  }

  /**
   * Remove cells strategically to create puzzle
   */
  private removeCellsStrategically(
    completedPuzzle: Puzzle,
    constraints: PuzzleConstraints
  ): Puzzle {
    const puzzle = this.clonePuzzle(completedPuzzle);
    const cellsToRemove = this.calculateCellsToRemove(
      constraints.difficulty,
      constraints.gridSize
    );

    // Get cells in strategic removal order
    const removalOrder = this.calculateRemovalOrder(puzzle);

    let removed = 0;
    for (const cell of removalOrder) {
      if (removed >= cellsToRemove) break;

      const backup = cell.value;
      cell.value = null;
      cell.isFixed = false;

      // Verify solution still unique
      if (this.countSolutions(puzzle) === 1) {
        removed++;
      } else {
        // Restore if solution not unique
        cell.value = backup;
        cell.isFixed = true;
      }
    }

    return puzzle;
  }

  /**
   * Count number of solutions (max 2 for efficiency)
   */
  private countSolutions(puzzle: Puzzle): number {
    let count = 0;
    const emptyCells = this.findEmptyCells(puzzle);

    if (emptyCells.length === 0) return 1;

    const backtrack = (index: number): void => {
      if (count > 1) return; // Early exit if more than 1 solution

      if (index === emptyCells.length) {
        count++;
        return;
      }

      const cell = emptyCells[index];

      // Try values 1-20
      for (let value = 1; value <= 20; value++) {
        if (this.isValidPlacement(puzzle, cell, value)) {
          cell.value = value;
          backtrack(index + 1);
          cell.value = null;
        }
      }
    };

    backtrack(0);
    return count;
  }

  /**
   * Check if placing a value in a cell is valid
   */
  private isValidPlacement(
    puzzle: Puzzle,
    cell: Cell,
    value: number
  ): boolean {
    const { grid, operations } = puzzle;
    cell.value = value;

    // Check horizontal equation if row complete
    const row = grid[cell.row];
    if (this.isRowComplete(row)) {
      if (!this.isEquationValid(row, operations.horizontal[cell.row])) {
        cell.value = null;
        return false;
      }
    }

    // Check vertical equation if column complete
    const col = grid.map((r) => r[cell.col]);
    if (this.isRowComplete(col)) {
      if (!this.isEquationValid(col, operations.vertical[cell.col])) {
        cell.value = null;
        return false;
      }
    }

    cell.value = null;
    return true;
  }

  /**
   * Check if row/column is complete (all cells have values)
   */
  private isRowComplete(cells: Cell[]): boolean {
    return cells.every((cell) => cell.value !== null);
  }

  /**
   * Validate equation (row or column)
   */
  private isEquationValid(cells: Cell[], operations: Operation[]): boolean {
    if (cells.length < 2) return true;

    let result = cells[0].value as number;

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      const nextValue = cells[i + 1].value as number;

      if (nextValue === null) return false;

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
          if (result % nextValue !== 0) return false; // Must be integer division
          result /= nextValue;
          break;
      }
    }

    return true; // All operations applied successfully
  }

  /**
   * Find all empty cells in puzzle
   */
  private findEmptyCells(puzzle: Puzzle): Cell[] {
    const empty: Cell[] = [];
    for (const row of puzzle.grid) {
      for (const cell of row) {
        if (cell.value === null) {
          empty.push(cell);
        }
      }
    }
    return empty;
  }

  /**
   * Calculate number of cells to remove based on difficulty
   */
  private calculateCellsToRemove(
    difficulty: number,
    gridSize: number
  ): number {
    const totalCells = gridSize * gridSize;

    // Easy: 40% empty, Hard: 70% empty
    const emptyPercentage = 0.3 + difficulty * 0.1;
    return Math.floor(totalCells * emptyPercentage);
  }

  /**
   * Calculate strategic order for cell removal
   */
  private calculateRemovalOrder(puzzle: Puzzle): Cell[] {
    const cells: Cell[] = [];

    // Collect all cells
    for (const row of puzzle.grid) {
      for (const cell of row) {
        cells.push(cell);
      }
    }

    // Sort by importance (intersections first)
    return cells.sort((a, b) => {
      const scoreA = this.calculateCellImportance(puzzle, a);
      const scoreB = this.calculateCellImportance(puzzle, b);
      return scoreB - scoreA; // Descending order
    });
  }

  /**
   * Calculate importance score for a cell
   */
  private calculateCellImportance(puzzle: Puzzle, cell: Cell): number {
    let score = 0;

    // Cells at intersections are more important
    if (cell.row > 0 && cell.row < puzzle.size - 1) score += 2;
    if (cell.col > 0 && cell.col < puzzle.size - 1) score += 2;

    // Add randomness for variety
    score += Math.random() * 3;

    return score;
  }

  /**
   * Clone puzzle (deep copy)
   */
  private clonePuzzle(puzzle: Puzzle): Puzzle {
    return {
      ...puzzle,
      grid: puzzle.grid.map((row) => row.map((cell) => ({ ...cell }))),
      operations: {
        horizontal: puzzle.operations.horizontal.map((row) => [...row]),
        vertical: puzzle.operations.vertical.map((col) => [...col]),
      },
      solution: puzzle.solution.map((row) => [...row]),
    };
  }

  /**
   * Validate all constraints are met
   */
  private meetsAllConstraints(
    puzzle: Puzzle,
    constraints: PuzzleConstraints
  ): boolean {
    // Check operation balance (not 90% of one operation)
    if (!this.isOperationBalanced(puzzle, constraints.operations)) {
      return false;
    }

    // Check difficulty matches target
    const actualDifficulty = this.calculateDifficulty(puzzle);
    if (Math.abs(actualDifficulty - constraints.difficulty) > 1) {
      return false;
    }

    return true;
  }

  /**
   * Check if operations are balanced
   */
  private isOperationBalanced(
    puzzle: Puzzle,
    allowedOps: Operation[]
  ): boolean {
    if (allowedOps.length <= 1) return true;

    const counts: { [key in Operation]?: number } = {};
    let total = 0;

    // Count operations
    for (const row of puzzle.operations.horizontal) {
      for (const op of row) {
        counts[op] = (counts[op] || 0) + 1;
        total++;
      }
    }

    for (const col of puzzle.operations.vertical) {
      for (const op of col) {
        counts[op] = (counts[op] || 0) + 1;
        total++;
      }
    }

    // Check no operation exceeds 60%
    for (const op of allowedOps) {
      const count = counts[op] || 0;
      if (count / total > 0.6) return false;
    }

    return true;
  }

  /**
   * Calculate actual difficulty of puzzle
   */
  private calculateDifficulty(puzzle: Puzzle): number {
    let score = 0;

    // Factor 1: Number of empty cells (30%)
    const emptyCells = this.findEmptyCells(puzzle).length;
    const totalCells = puzzle.size * puzzle.size;
    score += (emptyCells / totalCells) * 3;

    // Factor 2: Operation complexity (40%)
    const opComplexity = this.calculateOperationComplexity(puzzle);
    score += opComplexity * 2;

    // Factor 3: Grid size (30%)
    score += ((puzzle.size - 3) / 3) * 1.5;

    return Math.min(5, Math.max(1, score));
  }

  /**
   * Calculate operation complexity
   */
  private calculateOperationComplexity(puzzle: Puzzle): number {
    const weights: { [key in Operation]: number } = {
      '+': 1,
      '-': 1.5,
      '×': 2,
      '÷': 2.5,
    };

    let totalWeight = 0;
    let count = 0;

    for (const row of puzzle.operations.horizontal) {
      for (const op of row) {
        totalWeight += weights[op];
        count++;
      }
    }

    for (const col of puzzle.operations.vertical) {
      for (const op of col) {
        totalWeight += weights[op];
        count++;
      }
    }

    return count > 0 ? totalWeight / count : 1;
  }

  // Helper methods

  private randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateOperationRow(
    length: number,
    allowedOps: Operation[]
  ): Operation[] {
    const row: Operation[] = [];
    for (let i = 0; i < length; i++) {
      row.push(
        allowedOps[Math.floor(Math.random() * allowedOps.length)]
      );
    }
    return row;
  }

  private generatePuzzleId(): string {
    return `puzzle_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  private determineWorld(difficulty: number): World {
    if (difficulty <= 1) return 'egypt';
    if (difficulty <= 2) return 'maya';
    if (difficulty <= 3) return 'greece';
    if (difficulty <= 4) return 'china';
    return 'future';
  }

  private determineTargetedSkills(
    operations: Operation[],
    difficulty: number
  ): SkillType[] {
    const skills: SkillType[] = ['logic', 'mastery'];

    if (operations.includes('×') || operations.includes('÷')) {
      skills.push('vision');
    }

    if (difficulty >= 3) {
      skills.push('perseverance');
    }

    return skills;
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
    gridSize: difficulty <= 2 ? 3 : difficulty <= 4 ? 4 : 5,
    operations:
      difficulty === 1
        ? ['+', '-']
        : difficulty === 2
        ? ['+', '-', '×']
        : ['+', '-', '×', '÷'],
    numberRange: difficulty <= 2 ? [1, 10] : difficulty <= 4 ? [1, 20] : [1, 30],
    difficulty,
  };

  return generator.generate(constraints);
}
