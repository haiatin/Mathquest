/**
 * MathQuest Odyssey - Main Application
 *
 * Revolutionary educational math puzzle game combining:
 * - Singapore Method (CPA)
 * - Finnish Approach (zero stress)
 * - Japanese Multi-strategy
 * - Korean AI Adaptation
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PuzzleGrid } from './components/game/PuzzleGrid';
import { HintSystem } from './components/game/HintSystem';
import { BarModelVisualizer } from './components/game/BarModelVisualizer';
import { generatePuzzle } from './utils/puzzleGenerator';
import { useGameStore } from './stores/gameStore';
import type { HintLevel } from './types';

function App() {
  const hasHydrated = useGameStore((state) => state._hasHydrated);
  const userProfile = useGameStore((state) => state.userProfile);
  const createProfile = useGameStore((state) => state.createProfile);
  const currentPuzzle = useGameStore((state) => state.currentPuzzle);
  const setCurrentPuzzle = useGameStore((state) => state.setCurrentPuzzle);
  const completePuzzle = useGameStore((state) => state.completePuzzle);
  const currentLevel = useGameStore((state) => state.currentLevel);
  const advanceToNextLevel = useGameStore((state) => state.advanceToNextLevel);

  const [showWelcome, setShowWelcome] = useState(!userProfile);
  const [playerName, setPlayerName] = useState('');
  const [showBarModel, setShowBarModel] = useState(false);

  /**
   * Update welcome screen when hydration completes
   */
  useEffect(() => {
    if (hasHydrated) {
      setShowWelcome(!userProfile);
    }
  }, [hasHydrated, userProfile]);

  /**
   * Initialize first puzzle when user profile created
   */
  useEffect(() => {
    if (hasHydrated && userProfile && !currentPuzzle) {
      startNewPuzzle(1);
    }
  }, [hasHydrated, userProfile, currentPuzzle]);

  /**
   * Start a new puzzle
   */
  const startNewPuzzle = (difficulty: 1 | 2 | 3 | 4 | 5 = 1) => {
    try {
      const puzzle = generatePuzzle(difficulty);
      setCurrentPuzzle(puzzle);
    } catch (error) {
      console.error('Failed to generate puzzle:', error);
      // Fallback to easier difficulty
      if (difficulty > 1) {
        startNewPuzzle((difficulty - 1) as 1 | 2 | 3 | 4 | 5);
      }
    }
  };

  /**
   * Handle profile creation
   */
  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      createProfile(playerName.trim());
      setShowWelcome(false);
    }
  };

  /**
   * Handle puzzle completion
   */
  const handlePuzzleComplete = (timeSeconds: number, errors: number) => {
    completePuzzle(timeSeconds, errors);

    // Show celebration
    setTimeout(() => {
      advanceToNextLevel();
      // Generate next puzzle with adaptive difficulty
      const nextDifficulty = calculateNextDifficulty(errors, timeSeconds);
      startNewPuzzle(nextDifficulty);
    }, 3000);
  };

  /**
   * Calculate next puzzle difficulty (adaptive)
   */
  const calculateNextDifficulty = (
    errors: number,
    timeSeconds: number
  ): 1 | 2 | 3 | 4 | 5 => {
    // If solved quickly with few errors, increase difficulty
    if (errors <= 2 && timeSeconds < 120) {
      return Math.min(5, (currentPuzzle?.difficulty || 1) + 1) as 1 | 2 | 3 | 4 | 5;
    }

    // If many errors or took long time, decrease difficulty
    if (errors > 5 || timeSeconds > 300) {
      return Math.max(1, (currentPuzzle?.difficulty || 1) - 1) as 1 | 2 | 3 | 4 | 5;
    }

    // Otherwise keep same difficulty
    return (currentPuzzle?.difficulty || 1) as 1 | 2 | 3 | 4 | 5;
  };

  /**
   * Handle hint shown
   */
  const handleHintShown = (hint: HintLevel) => {
    if (hint.showBarModel) {
      setShowBarModel(true);
    }
  };

  // Wait for hydration
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-xl text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="card max-w-2xl w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            🏛️ MathQuest Odyssey
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Embarque pour une aventure mathématique extraordinaire !
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <form onSubmit={handleCreateProfile} className="space-y-6">
              <div>
                <label
                  htmlFor="playerName"
                  className="block text-lg font-semibold text-gray-700 mb-2"
                >
                  Comment t'appelles-tu ?
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-6 py-4 text-xl rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all"
                  placeholder="Ton prénom..."
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="btn-primary w-full text-xl py-4">
                🚀 Commencer l'aventure !
              </button>
            </form>
          </motion.div>

          <motion.div
            className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              🌟 Développe tes compétences mathématiques à travers des puzzles
              captivants
              <br />
              💡 Apprends à ton rythme, sans stress ni pression
              <br />
              🎨 Découvre les mathématiques à travers 5 civilisations
              fascinantes
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.header
        className="max-w-7xl mx-auto mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600">
              🏛️ MathQuest Odyssey
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Bonjour, {userProfile?.name} ! 👋
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="card py-2 px-4">
              <p className="text-sm text-gray-600">Niveau</p>
              <p className="text-2xl font-bold text-purple-600">
                {currentLevel}
              </p>
            </div>

            <button
              className="btn-secondary"
              onClick={() => setShowBarModel(true)}
              aria-label="Show visualization"
            >
              👁️ Visualiser
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Game Area */}
      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {currentPuzzle ? (
            <motion.div
              key={currentPuzzle.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <PuzzleGrid
                puzzle={currentPuzzle}
                onComplete={handlePuzzleComplete}
              />

              {/* Hint System */}
              <HintSystem
                puzzle={currentPuzzle}
                currentGrid={currentPuzzle.grid}
                onShowHint={handleHintShown}
              />
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="loading-spinner mx-auto mb-4" />
              <p className="text-xl text-gray-600">
                Préparation de ton puzzle...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bar Model Visualizer */}
      {currentPuzzle && (
        <BarModelVisualizer
          equation="2 × ? = 6"
          operation="×"
          values={[2, null, 6]}
          show={showBarModel}
          onClose={() => setShowBarModel(false)}
        />
      )}

      {/* Footer */}
      <motion.footer
        className="max-w-7xl mx-auto mt-12 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>
          MathQuest Odyssey - Apprendre les mathématiques avec joie 🌟
        </p>
        <p className="mt-2">
          Combinant les meilleures méthodes pédagogiques mondiales
        </p>
      </motion.footer>
    </div>
  );
}

export default App;
