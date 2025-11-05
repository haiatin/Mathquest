/**
 * MathQuest Odyssey - Game Store (Zustand)
 *
 * Global state management for:
 * - Current puzzle
 * - User progress
 * - Accessibility preferences
 * - Performance tracking
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Puzzle,
  UserProfile,
  GameState,
  PuzzlePerformance,
  AccessibilityPreferences,
  SkillPillars,
} from '../types';

interface GameStore {
  // Hydration state
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // User Profile
  userProfile: UserProfile | null;
  createProfile: (name: string, age?: number) => void;
  updateSkills: (skills: Partial<SkillPillars>) => void;

  // Current Game
  currentPuzzle: Puzzle | null;
  gameState: GameState;
  setCurrentPuzzle: (puzzle: Puzzle) => void;
  updateCellValue: (row: number, col: number, value: number | null) => void;
  incrementErrors: () => void;
  incrementHints: () => void;
  resetGameState: () => void;

  // Puzzle Completion
  completePuzzle: (timeSeconds: number, errors: number) => void;
  puzzleHistory: PuzzlePerformance[];

  // Accessibility
  accessibilityPrefs: AccessibilityPreferences;
  updateAccessibility: (prefs: Partial<AccessibilityPreferences>) => void;

  // Progression
  currentLevel: number;
  currentWorld: string;
  advanceToNextLevel: () => void;
}

const initialAccessibilityPrefs: AccessibilityPreferences = {
  dyslexiaMode: false,
  colorblindPalette: null,
  fontSize: 'normal',
  highContrast: false,
  audioNarration: false,
  reducedMotion: false,
  extendedTime: false,
};

const initialSkills: SkillPillars = {
  vision: 0,
  speed: 0,
  logic: 0,
  creativity: 0,
  collaboration: 0,
  perseverance: 0,
  mastery: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Hydration state
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      // User Profile
      userProfile: null,

      createProfile: (name: string, age?: number) => {
        const profile: UserProfile = {
          id: `user_${Date.now()}`,
          name,
          age,
          skills: initialSkills,
          currentWorld: 'egypt',
          currentLevel: 1,
          history: [],
          preferences: initialAccessibilityPrefs,
          createdAt: new Date(),
          lastPlayedAt: new Date(),
        };

        set({ userProfile: profile });
      },

      updateSkills: (skillUpdates: Partial<SkillPillars>) => {
        const profile = get().userProfile;
        if (!profile) return;

        const updatedSkills: SkillPillars = {
          ...profile.skills,
        };

        // Apply updates and cap at 100
        Object.entries(skillUpdates).forEach(([skill, value]) => {
          if (value !== undefined) {
            updatedSkills[skill as keyof SkillPillars] = Math.min(
              100,
              updatedSkills[skill as keyof SkillPillars] + value
            );
          }
        });

        set({
          userProfile: {
            ...profile,
            skills: updatedSkills,
            lastPlayedAt: new Date(),
          },
        });
      },

      // Current Game
      currentPuzzle: null,
      gameState: {
        currentPuzzle: null,
        puzzleState: [],
        hintsUsed: 0,
        errors: 0,
        startTime: null,
        isPaused: false,
        showingHint: null,
        showingBarModel: false,
      },

      setCurrentPuzzle: (puzzle: Puzzle) => {
        set({
          currentPuzzle: puzzle,
          gameState: {
            currentPuzzle: puzzle,
            puzzleState: puzzle.grid.map((row) =>
              row.map((cell) => ({ ...cell }))
            ),
            hintsUsed: 0,
            errors: 0,
            startTime: new Date(),
            isPaused: false,
            showingHint: null,
            showingBarModel: false,
          },
        });
      },

      updateCellValue: (row: number, col: number, value: number | null) => {
        const gameState = get().gameState;

        const newPuzzleState = gameState.puzzleState.map((r, rIndex) =>
          r.map((cell, cIndex) => {
            if (rIndex === row && cIndex === col) {
              return { ...cell, value };
            }
            return cell;
          })
        );

        set({
          gameState: {
            ...gameState,
            puzzleState: newPuzzleState,
          },
        });
      },

      incrementErrors: () => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            errors: state.gameState.errors + 1,
          },
        }));
      },

      incrementHints: () => {
        set((state) => ({
          gameState: {
            ...state.gameState,
            hintsUsed: state.gameState.hintsUsed + 1,
          },
        }));
      },

      resetGameState: () => {
        set({
          gameState: {
            currentPuzzle: null,
            puzzleState: [],
            hintsUsed: 0,
            errors: 0,
            startTime: null,
            isPaused: false,
            showingHint: null,
            showingBarModel: false,
          },
        });
      },

      // Puzzle Completion
      puzzleHistory: [],

      completePuzzle: (timeSeconds: number, errors: number) => {
        const { currentPuzzle, gameState, userProfile } = get();
        if (!currentPuzzle || !userProfile) return;

        const performance: PuzzlePerformance = {
          puzzleId: currentPuzzle.id,
          completed: true,
          timeSeconds,
          errors,
          hintsUsed: gameState.hintsUsed,
          strategy: 'systematic', // TODO: Detect actual strategy
          solvingSequence: [], // TODO: Track cell order
          timestamp: new Date(),
        };

        // Calculate skill improvements
        const skillUpdates: Partial<SkillPillars> = {
          mastery: errors === 0 ? 3 : 1,
          speed: timeSeconds < 120 ? 3 : 1,
          logic: 2,
          perseverance: gameState.hintsUsed < 2 ? 2 : 1,
        };

        // Update skills
        get().updateSkills(skillUpdates);

        // Add to history
        set((state) => ({
          puzzleHistory: [...state.puzzleHistory, performance],
        }));
      },

      // Accessibility
      accessibilityPrefs: initialAccessibilityPrefs,

      updateAccessibility: (prefs: Partial<AccessibilityPreferences>) => {
        set((state) => ({
          accessibilityPrefs: {
            ...state.accessibilityPrefs,
            ...prefs,
          },
        }));

        // Apply accessibility changes to DOM
        if (typeof window !== 'undefined') {
          applyAccessibilityToDOM(get().accessibilityPrefs);
        }
      },

      // Progression
      currentLevel: 1,
      currentWorld: 'egypt',

      advanceToNextLevel: () => {
        set((state) => ({
          currentLevel: state.currentLevel + 1,
        }));
      },
    }),
    {
      name: 'mathquest-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userProfile: state.userProfile,
        puzzleHistory: state.puzzleHistory,
        accessibilityPrefs: state.accessibilityPrefs,
        currentLevel: state.currentLevel,
        currentWorld: state.currentWorld,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/**
 * Apply accessibility preferences to DOM
 */
function applyAccessibilityToDOM(prefs: AccessibilityPreferences): void {
  if (typeof window === 'undefined') return;
  
  const body = document.body;

  // Dyslexia mode
  if (prefs.dyslexiaMode) {
    body.classList.add('dyslexia-mode');
  } else {
    body.classList.remove('dyslexia-mode');
  }

  // Colorblind palettes
  body.classList.remove(
    'colorblind-protanopia',
    'colorblind-deuteranopia',
    'colorblind-tritanopia',
    'colorblind-monochrome'
  );

  if (prefs.colorblindPalette) {
    body.classList.add(`colorblind-${prefs.colorblindPalette}`);
  }

  // Font size
  body.classList.remove('text-large', 'text-xlarge');
  if (prefs.fontSize === 'large') {
    body.classList.add('text-large');
  } else if (prefs.fontSize === 'xlarge') {
    body.classList.add('text-xlarge');
  }

  // High contrast
  if (prefs.highContrast) {
    body.classList.add('high-contrast');
  } else {
    body.classList.remove('high-contrast');
  }

  // Reduced motion
  if (prefs.reducedMotion) {
    body.style.setProperty('--animation-duration', '0.01ms');
  } else {
    body.style.removeProperty('--animation-duration');
  }
}
