/**
 * MathQuest Odyssey - Core Type Definitions
 *
 * Types following pedagogical principles:
 * - Singapore Method (CPA)
 * - Finnish approach (zero stress)
 * - Japanese multi-strategy
 * - Korean AI adaptation
 */

export type Operation = '+' | '-' | '×' | '÷';

export interface Cell {
  row: number;
  col: number;
  value: number | null;
  isFixed: boolean;  // Cellule pré-remplie
  isCorrect?: boolean;  // Pour validation
  isHighlighted?: boolean;  // Pour indices
}

export interface Puzzle {
  id: string;
  grid: Cell[][];
  operations: {
    horizontal: Operation[][];  // Opérations horizontales
    vertical: Operation[][];     // Opérations verticales
  };
  size: number;  // 3, 4, 5, ou 6
  difficulty: 1 | 2 | 3 | 4 | 5;
  solution: number[][];  // Solution complète (pour vérification)
  world: World;
  level: number;
  targetedSkills: SkillType[];  // Compétences ciblées
}

export type World = 'egypt' | 'maya' | 'greece' | 'china' | 'future';

export type SkillType =
  | 'vision'          // Repérer patterns
  | 'speed'           // Calcul mental fluide
  | 'logic'           // Déduction systématique
  | 'creativity'      // Solutions alternatives
  | 'collaboration'   // Travail d'équipe
  | 'perseverance'    // Résilience
  | 'mastery';        // Automatisation

export interface SkillPillars {
  vision: number;        // 0-100
  speed: number;
  logic: number;
  creativity: number;
  collaboration: number;
  perseverance: number;
  mastery: number;
}

export type StrategyType =
  | 'systematic'      // Ligne par ligne
  | 'opportunistic'   // Cases faciles d'abord
  | 'analytical'      // Intersections d'abord
  | 'intuitive';      // Essai-erreur intelligent

export interface PuzzlePerformance {
  puzzleId: string;
  completed: boolean;
  timeSeconds: number;
  errors: number;
  hintsUsed: number;
  strategy: StrategyType;
  solvingSequence: number[];  // Ordre des cases remplies
  timestamp: Date;
}

export interface HintLevel {
  level: 1 | 2 | 3 | 4;
  message: string;
  highlightCells?: { row: number; col: number }[];
  showBarModel?: boolean;
  operation?: Operation;
}

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  skills: SkillPillars;
  currentWorld: World;
  currentLevel: number;
  history: PuzzlePerformance[];
  preferences: AccessibilityPreferences;
  createdAt: Date;
  lastPlayedAt: Date;
}

export interface AccessibilityPreferences {
  dyslexiaMode: boolean;
  colorblindPalette: ColorblindPalette | null;
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  audioNarration: boolean;
  reducedMotion: boolean;
  extendedTime: boolean;  // Pour dyscalculie
}

export type ColorblindPalette =
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'monochrome';

export interface GameState {
  currentPuzzle: Puzzle | null;
  puzzleState: Cell[][];
  hintsUsed: number;
  errors: number;
  startTime: Date | null;
  isPaused: boolean;
  showingHint: HintLevel | null;
  showingBarModel: boolean;
}

export interface PuzzleConstraints {
  gridSize: 3 | 4 | 5 | 6;
  operations: Operation[];
  numberRange: [number, number];
  difficulty: 1 | 2 | 3 | 4 | 5;
  userProfile?: UserProfile;
}

/**
 * Bar Model (Singapore Method) - Visualisation concrète
 */
export interface BarModel {
  equation: string;  // Ex: "2 × ? = 6"
  parts: BarPart[];
  total: number;
  operation: Operation;
}

export interface BarPart {
  value: number | null;
  label: string;
  color: string;
  isUnknown: boolean;
}

/**
 * Temple de progression (visualisation)
 */
export interface TempleProgress {
  sections: {
    [key in SkillType]: {
      level: number;  // 0-10
      visualState: 'ruins' | 'building' | 'complete';
    }
  };
  overallCompletion: number;  // 0-100%
}

/**
 * Feedback positif (approche finlandaise)
 */
export interface PositiveFeedback {
  type: 'encouragement' | 'hint' | 'celebration' | 'insight';
  message: string;
  animation?: string;
  soundEffect?: string;
}

/**
 * Analytics (invisibles pour l'enfant)
 */
export interface LearningAnalytics {
  userId: string;
  strengths: SkillType[];
  weaknesses: SkillType[];
  operationMastery: {
    [key in Operation]: number;  // 0-100%
  };
  averageTimePerPuzzle: number;
  frustrationLevel: 'low' | 'medium' | 'high';
  engagementLevel: 'low' | 'medium' | 'high';
  recommendedDifficulty: number;  // 1.0-5.0
  lastUpdated: Date;
}
