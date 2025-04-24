# Binary Search Tree Visualization

An interactive educational tool that visually demonstrates how a binary search tree works. This application helps users understand BST operations like insertion, search, deletion, and traversal through step-by-step animations.

## Features

- **Interactive Tree Building**: Add single values or batch insert multiple values
- **Animated Operations**: Visualize insert, search, and delete operations step by step
- **Tree Traversals**: View different traversal methods (in-order, pre-order, post-order, level-order)
- **Educational Content**: Learn about BST properties, operations, and time complexity
- **Animation Controls**: Adjust animation speed and pause/resume animations
- **Tree Statistics**: View node count, tree height, balance status, and other metrics

## Project Structure

```
binary-tree-visualization/
├── public/
│   ├── index.html               # HTML entry point
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/              # React components
│   │   ├── App.js               # Main application component
│   │   ├── TreeVisualization.js # Tree visualization renderer
│   │   ├── TreeControls.js      # User controls
│   │   ├── TreeNode.js          # Visual node component
│   │   ├── TreeEdge.js          # Visual edge component
│   │   ├── InfoPanel.js         # Educational panel
│   │   └── AnimationControls.js # Animation controls
│   ├── models/                  # Data structures
│   │   ├── TreeNode.js          # Tree node class
│   │   └── BinarySearchTree.js  # BST implementation
│   ├── utils/                   # Utility functions
│   │   ├── treeLayout.js        # Tree layout calculations
│   │   ├── animationUtils.js    # Animation helpers
│   │   └── treeOperations.js    # Additional algorithms
│   ├── constants/               # Constants and content
│   │   ├── colors.js            # Color definitions
│   │   └── educationalContent.js # Educational text
│   ├── styles/                  # CSS styles
│   │   ├── App.css              # Main styles
│   │   ├── TreeVisualization.css # Visualization styles
│   │   ├── Controls.css         # Control panel styles
│   │   └── InfoPanel.css        # Info panel styles
│   └── index.js                 # JavaScript entry point
└── package.json                 # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/binary-tree-visualization.git
   cd binary-tree-visualization
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### Adding Nodes

- Use the "Insert" operation with a single value (0-999)
- Use "Batch Insert" with comma-separated values (e.g., "10,5,15,3,7,12,20")
- Click "Generate" with "Random Tree" selected to create a random tree

### Visualizing Operations

1. Select an operation (Insert, Search, Delete)
2. Enter a value
3. Click the operation button to see the animation
4. Use the animation speed slider to adjust the speed
5. Click Pause/Resume to control the animation

### Learning Features

- The Info Panel displays educational content about the current operation
- Tree statistics show information about the current tree structure
- Learning tips provide additional insights about binary search trees
- Time complexity information explains the efficiency of operations

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `build/` directory.

## Technologies Used

- React.js
- JavaScript (ES6+)
- CSS3

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Educational content based on standard computer science curriculum for data structures
- Visualization techniques inspired by various algorithm visualization tools