# 🏛️ MathQuest Odyssey

## Revolutionary Educational Math Puzzle Game

MathQuest Odyssey is an innovative educational game that transforms mathematics learning into a joyful adventure. It combines the world's best pedagogical approaches:

- **🇸🇬 Singapore Method (CPA)**: Concrete-Pictorial-Abstract visualization
- **🇫🇮 Finnish Approach**: Zero stress, positive reinforcement only
- **🇯🇵 Japanese Multi-strategy**: Multiple problem-solving approaches
- **🇰🇷 Korean AI Adaptation**: Real-time difficulty adjustment

## ✨ Features

### Core Gameplay
- **CrossMath Puzzles**: Fill grids with numbers to solve horizontal and vertical equations
- **Unique Solutions**: Every puzzle has exactly one solution, mathematically guaranteed
- **Progressive Difficulty**: From simple addition (3×3) to complex operations (5×5)
- **5 Civilizations**: Journey through Egypt, Maya, Greece, China, and Future worlds

### Pedagogical Innovation
- **Bar Model Visualization**: Singapore method for understanding operations
- **Progressive Hints**: 4-level hint system that guides without solving
- **Positive Feedback Only**: No "game over" or stress-inducing mechanics
- **Strategy Recognition**: Identifies and celebrates your problem-solving approach
- **Adaptive Learning**: AI adjusts difficulty to maintain optimal flow state

### Accessibility
- **Dyslexia Mode**: OpenDyslexic font with increased spacing
- **Colorblind Palettes**: 4 different color schemes
- **Keyboard Navigation**: Full game playable with keyboard
- **Screen Reader Support**: ARIA labels throughout
- **Reduced Motion**: Respects user preferences
- **Font Size Options**: Adjustable text size

### Progress Tracking
- **7 Skill Pillars**: Vision, Speed, Logic, Creativity, Collaboration, Perseverance, Mastery
- **Temple Visualization**: Watch your personal temple grow as you progress
- **Performance Analytics**: Track improvement over time (hidden from child view)

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### First Launch

1. Open the game in your browser
2. Enter your name to create a profile
3. Start with tutorial puzzles (Level 1)
4. Use hints whenever needed - they're designed to help!
5. Click "Visualiser" to see bar model representations

## 🎮 How to Play

### Objective
Fill empty cells so that all horizontal and vertical equations are correct.

### Controls
- **Mouse/Touch**: Click cells to select, click numbers to fill
- **Keyboard**: Arrow keys to navigate, number keys to fill, Delete to clear
- **Hints**: Click 💡 for progressive hints
- **Visualize**: Click 👁️ to see bar model representation

### Example Puzzle (3×3)

```
[ 2] × [?] = [ 6]
 ÷      +      -
[?] + [ 1] = [ 3]
 =      =      =
[ 1]   [?]   [ 3]
```

Solution: Fill [?] with 3, 2, 2, and 3 to make all equations valid!

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Project Structure
```
src/
├── components/
│   ├── game/           # Core game components
│   │   ├── Cell.tsx
│   │   ├── PuzzleGrid.tsx
│   │   ├── HintSystem.tsx
│   │   └── BarModelVisualizer.tsx
│   ├── progression/    # Progress tracking
│   ├── narrative/      # Story elements
│   └── accessibility/  # A11y features
├── stores/            # Zustand state management
├── utils/             # Puzzle generation algorithms
├── types/             # TypeScript definitions
└── assets/            # Media files
```

### Puzzle Generation Algorithm

The core algorithm ensures:
1. **Valid Completion**: Starts with a fully valid grid
2. **Strategic Removal**: Removes cells while maintaining uniqueness
3. **Backtracking Validation**: Verifies exactly one solution exists
4. **Difficulty Balancing**: Calculates actual difficulty vs. target
5. **Operation Balance**: Ensures variety in operations

## 🎯 Pedagogical Principles

### Singapore Method (CPA)
Every equation can be visualized as bars:
- **Concrete**: Visual representation with colored bars
- **Pictorial**: Bar models showing relationships
- **Abstract**: Numerical equations

### Finnish Zero-Stress Approach
- No time pressure visible to child
- No "game over" or lives system
- Only positive, encouraging feedback
- Hints are always available
- Mistakes are learning opportunities

### Japanese Multi-Strategy
The game recognizes and celebrates different approaches:
- **Systematic**: Solving row by row
- **Opportunistic**: Finding easy cells first
- **Analytical**: Using intersections
- **Intuitive**: Creative problem-solving

### Korean Adaptive Learning
Silent background tracking adjusts:
- Puzzle difficulty based on performance
- Hint timing based on hesitation
- Operation mix based on mastery
- Maintains "flow state" (70-80% success rate)

## 🌟 Educational Benefits

### Mathematical Skills
- Mental arithmetic fluency
- Pattern recognition
- Logical deduction
- Strategic thinking
- Operation relationships

### Cognitive Development
- Problem-solving strategies
- Perseverance and resilience
- Metacognition (thinking about thinking)
- Spatial reasoning
- Working memory

### Socio-Emotional Growth
- Confidence in mathematics
- Growth mindset
- Stress-free learning
- Intrinsic motivation
- Celebration of diverse approaches

## 🎨 Customization

### Accessibility Settings
Access via the settings panel (coming soon):
- Toggle dyslexia mode
- Select colorblind palette
- Adjust font size
- Enable/disable animations
- Turn on audio narration

### Difficulty Preferences
- Manual difficulty selection
- Adaptive mode (recommended)
- Practice mode (unlimited hints)
- Zen mode (no tracking)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Puzzle generates successfully
- [ ] All cells are interactive
- [ ] Validation works correctly
- [ ] Hints display properly
- [ ] Bar model visualizes accurately
- [ ] Progress saves and loads
- [ ] Accessibility features work
- [ ] Responsive on mobile

### Performance Testing
- Puzzle generation: < 100ms
- UI responsiveness: 60fps animations
- Bundle size: < 500KB (gzipped)

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This is an educational project. Contributions welcome in:
- Puzzle generation algorithms
- Accessibility improvements
- Pedagogical enhancements
- Bug fixes
- Translations

## 📄 License

MIT License + Educational Priority Clause

Free for:
- Personal use
- Educational institutions
- Non-profit organizations

Commercial use requires attribution.

## 🙏 Acknowledgments

Inspired by:
- Singapore Ministry of Education (Mathematics Framework)
- Finnish National Agency for Education
- Japanese MEXT Curriculum
- Korean AI Education initiatives
- Montessori concrete learning principles

## 📧 Support

For questions or feedback:
- Open an issue on GitHub
- Contact: mathquest@example.com (placeholder)

---

**Made with ❤️ for young mathematicians worldwide**

Transform mathematics from a challenge into an adventure! 🚀✨
