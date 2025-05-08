/**
 * AVLVisualization.js
 * Component for visualizing AVL trees with rotations
 */

import React, { useState, useEffect } from 'react';
import TreeVisualization from './TreeVisualization';
import AnimationControls from './AnimationControls';
import NodeDetailsPanel from './NodeDetailsPanel';
import AnimationArrow from './AnimationArrow';
import AVLTree from '../models/AVLTree';

const AVLVisualization = () => {
  // State for the AVL tree
  const [tree, setTree] = useState(new AVLTree());
  const [message, setMessage] = useState('Welcome! Add values to build an AVL tree.');
  const [treeVersion, setTreeVersion] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeRelationships, setNodeRelationships] = useState(null);
  
  // Animation state
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // Slower default speed
  const [currentRotation, setCurrentRotation] = useState(null);
  const [showBalanceFactors, setShowBalanceFactors] = useState(true);
  
  // Update tree positions when tree changes
  useEffect(() => {
    if (tree) {
      tree.calculatePositions();
    }
  }, [tree, treeVersion]);
  
  // Insert a value into the tree
  const handleInsert = (value) => {
    if (isNaN(parseInt(value))) {
      setMessage(`Please enter a valid number.`);
      return;
    }
    
    try {
      const numValue = parseInt(value);
      
      // Check if value already exists
      if (tree.search(numValue).found) {
        setMessage(`Value ${numValue} already exists in the tree.`);
        return;
      }
      
      // Insert the value with animation
      const result = tree.insert(numValue, true);
      setMessage(`Inserting ${numValue} into the AVL tree.`);
      
      // Play animation
      playAnimation(result.animations);
      
      // Clear selected node if any
      setSelectedNode(null);
      setNodeRelationships(null);
    } catch (error) {
      console.error("Error inserting value:", error);
      setMessage(`Error inserting value: ${error.message}`);
    }
  };
  
  // Delete a value from the tree
  const handleDelete = (value) => {
    if (isNaN(parseInt(value))) {
      setMessage(`Please enter a valid number.`);
      return;
    }
    
    try {
      const numValue = parseInt(value);
      
      // Check if value exists
      if (!tree.search(numValue).found) {
        setMessage(`Value ${numValue} does not exist in the tree.`);
        return;
      }
      
      // If deleting the selected node, clear selection
      if (selectedNode && selectedNode.value === numValue) {
        setSelectedNode(null);
        setNodeRelationships(null);
      }
      
      // Delete the value with animation
      const result = tree.delete(numValue, true);
      setMessage(`Deleting ${numValue} from the AVL tree.`);
      
      // Play animation
      playAnimation(result.animations);
    } catch (error) {
      console.error("Error deleting value:", error);
      setMessage(`Error deleting value: ${error.message}`);
    }
  };
  
  // Search for a value in the tree
  const handleSearch = (value) => {
    if (isNaN(parseInt(value))) {
      setMessage(`Please enter a valid number.`);
      return;
    }
    
    try {
      const numValue = parseInt(value);
      const result = tree.search(numValue, true);
      
      if (result.found) {
        setMessage(`Found ${numValue} in the tree!`);
        
        // Set as selected node
        setSelectedNode(result.node);
        
        // Calculate relationships
        const relationships = calculateNodeRelationships(tree, result.node);
        setNodeRelationships(relationships);
        
        // Play animation
        playAnimation(result.animations);
      } else {
        setMessage(`Value ${numValue} not found in the tree.`);
        playAnimation(result.animations);
        
        // Clear selected node
        setSelectedNode(null);
        setNodeRelationships(null);
      }
    } catch (error) {
      console.error("Error searching for value:", error);
      setMessage(`Error searching for value: ${error.message}`);
    }
  };
  
  // Reset the tree
  const handleReset = () => {
    setTree(new AVLTree());
    setMessage('Tree has been reset.');
    setSelectedNode(null);
    setNodeRelationships(null);
    setTreeVersion(v => v + 1);
  };
  
  // Generate a random tree
  const handleRandomTree = () => {
    try {
      const newTree = AVLTree.createRandomTree(7, 1, 100);
      setTree(newTree);
      setMessage('Generated a random AVL tree.');
      setSelectedNode(null);
      setNodeRelationships(null);
      setTreeVersion(v => v + 1);
    } catch (error) {
      console.error("Error generating random tree:", error);
      setMessage(`Error generating random tree: ${error.message}`);
    }
  };
  
  // Toggle showing balance factors
  const handleToggleBalanceFactors = () => {
    setShowBalanceFactors(!showBalanceFactors);
  };
  
  // Handle animation speed change
  const handleAnimationSpeedChange = (speed) => {
    setAnimationSpeed(speed);
  };
  
  // Handle animation pause/resume
  const handleAnimationToggle = () => {
    setAnimationPaused(!animationPaused);
  };
  
  // Play animation sequence
  const playAnimation = (animations) => {
    if (!animations || animations.length === 0) return;
    
    setAnimationInProgress(true);
    setAnimationPaused(false);
    
    // Reset all highlights and clear any existing rotations
    tree.resetHighlights();
    setCurrentRotation(null);
    
    let step = 0;
    let animationTimer = null;
    
    const applyAnimation = () => {
      // If paused, wait and check again
      if (animationPaused) {
        animationTimer = setTimeout(applyAnimation, 100);
        return;
      }
      
      const animation = animations[step];
      
      // Skip if animation is undefined
      if (!animation) {
        step++;
        if (step < animations.length) {
          animationTimer = setTimeout(applyAnimation, animationSpeed);
        } else {
          // End of animation
          finishAnimation();
        }
        return;
      }
      
      // Update message based on animation step
      setMessage(animation.message || 'Performing operation...');
      
      // Apply different highlight effects based on animation type
      switch (animation.type) {
        case 'insert':
          highlightInsertStep(animation);
          break;
        case 'delete':
          highlightDeleteStep(animation);
          break;
        case 'search':
          highlightSearchStep(animation);
          break;
        case 'balance':
          highlightBalanceStep(animation);
          break;
        case 'rotation':
          highlightRotationStep(animation);
          break;
        default:
          break;
      }
      
      // Force re-render
      setTreeVersion(v => v + 1);
      
      // Move to next step
      step++;
      if (step < animations.length) {
        animationTimer = setTimeout(applyAnimation, animationSpeed);
      } else {
        // End of animation
        finishAnimation();
      }
    };
    
    const finishAnimation = () => {
      // Clear any pending timeouts
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
      
      // Reset highlights and rotation state
      setTimeout(() => {
        tree.resetHighlights();
        setCurrentRotation(null);
        setTreeVersion(v => v + 1);
        setAnimationInProgress(false);
      }, animationSpeed);
    };
    
    // Start animation
    applyAnimation();
    
    // Cleanup function to handle component unmounting during animation
    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  };
  
  // Animation helper functions
  const highlightInsertStep = (animation) => {
    if (!animation || !animation.node) return;
    
    const node = animation.node;
    
    switch (animation.step) {
      case 'start':
        node.highlightState = 'inserting';
        break;
      case 'comparing':
        node.highlightState = 'highlight';
        break;
      case 'goLeft':
      case 'goRight':
        node.highlightState = 'searching';
        break;
      case 'addedNode':
        node.highlightState = 'inserting';
        break;
      case 'complete':
        node.highlightState = 'found';
        break;
      default:
        node.highlightState = 'normal';
    }
  };
  
  const highlightDeleteStep = (animation) => {
    if (!animation) return;
    
    const node = animation.node;
    if (!node) return;
    
    switch (animation.step) {
      case 'visiting':
        node.highlightState = 'highlight';
        break;
      case 'goLeft':
      case 'goRight':
        node.highlightState = 'searching';
        break;
      case 'found':
        node.highlightState = 'found';
        break;
      case 'removeLeaf':
      case 'replaceWithLeft':
      case 'replaceWithRight':
      case 'replaceWithSuccessor':
        node.highlightState = 'deleting';
        break;
      case 'findingMin':
        node.highlightState = 'searching';
        break;
      case 'foundSuccessor':
        node.highlightState = 'found';
        break;
      default:
        node.highlightState = 'normal';
    }
  };
  
  const highlightSearchStep = (animation) => {
    if (!animation) return;
    
    const node = animation.node;
    if (!node) return;
    
    switch (animation.step) {
      case 'visiting':
        node.highlightState = 'highlight';
        break;
      case 'goLeft':
      case 'goRight':
        node.highlightState = 'searching';
        break;
      case 'found':
        node.highlightState = 'found';
        break;
      default:
        node.highlightState = 'normal';
    }
  };
  
  const highlightBalanceStep = (animation) => {
    if (!animation || !animation.node) return;
    
    const node = animation.node;
    
    switch (animation.step) {
      case 'calculating':
        node.highlightState = 'highlight';
        // Update balance factor in visualization
        node.balanceFactor = animation.balanceFactor;
        break;
      case 'imbalance':
        node.highlightState = 'deleting'; // Use deleting state for imbalance highlighting
        node.balanceFactor = animation.balanceFactor;
        break;
      case 'balanced':
        node.highlightState = 'normal';
        node.balanceFactor = animation.balanceFactor;
        break;
      default:
        node.highlightState = 'normal';
    }
  };
  
  const highlightRotationStep = (animation) => {
    if (!animation || !animation.node) return;
    
    const node = animation.node;
    
    switch (animation.step) {
      case 'before':
        node.highlightState = 'highlight';
        
        // Set current rotation for arrow visualization
        setCurrentRotation({
          node: node,
          type: animation.subtype,
          step: 'before'
        });
        break;
      case 'after':
        node.highlightState = 'found';
        
        // Update rotation for arrow visualization
        setCurrentRotation({
          node: node,
          oldRoot: animation.oldRoot,
          newRoot: animation.newRoot,
          type: animation.subtype,
          step: 'after'
        });
        break;
      default:
        node.highlightState = 'normal';
    }
  };
  
  // Handle node click
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    
    // Calculate relationships
    const relationships = calculateNodeRelationships(tree, node);
    setNodeRelationships(relationships);
    
    setMessage(`Selected node: ${node.value} (Balance factor: ${node.balanceFactor || 0})`);
    
    // Highlight the selected node
    tree.resetHighlights();
    node.highlightState = 'found';
    setTreeVersion(v => v + 1);
  };
  
  // Close node details panel
  const handleCloseNodeDetails = () => {
    setSelectedNode(null);
    setNodeRelationships(null);
    
    // Reset all highlights
    tree.resetHighlights();
    setTreeVersion(v => v + 1);
  };
  
  // Calculate node relationships (parent, siblings, etc.)
  const calculateNodeRelationships = (tree, node) => {
    if (!tree || !tree.root || !node) return null;
    
    // Find parent and path to node
    const findPath = (root, target, path = [], parent = null) => {
      if (!root) return null;
      
      // Add current node to the path
      path.push(root);
      
      // Found the target node
      if (root.value === target.value) {
        return { path, parent };
      }
      
      // Search in left subtree
      if (target.value < root.value) {
        return findPath(root.left, target, [...path], root);
      }
      
      // Search in right subtree
      return findPath(root.right, target, [...path], root);
    };
    
    const pathResult = findPath(tree.root, node);
    
    if (!pathResult) return null;
    
    const { path, parent } = pathResult;
    
    // Find siblings
    let siblings = [];
    if (parent) {
      if (parent.left && parent.left.value !== node.value) {
        siblings.push(parent.left);
      }
      if (parent.right && parent.right.value !== node.value) {
        siblings.push(parent.right);
      }
    }
    
    // Calculate node depth (distance from root)
    const depth = path.length - 1;
    
    // Determine if node is a leaf
    const isLeaf = !node.left && !node.right;
    
    // Count children
    const childCount = (node.left ? 1 : 0) + (node.right ? 1 : 0);
    
    // Get balance factor
    const balanceFactor = node.balanceFactor || 0;
    
    // Return all relationships
    return {
      parent,
      siblings,
      ancestors: path.slice(0, -1), // All nodes in the path except the target node
      path,
      height: node.height || 0,
      depth,
      isLeaf,
      childCount,
      balanceFactor
    };
  };
  
  // Render rotation arrows
  const renderRotationArrows = () => {
    if (!currentRotation || !currentRotation.node) return null;
    
    const { node, type, step } = currentRotation;
    
    // Different arrow configurations based on rotation type
    switch (type) {
      case 'left':
        return renderLeftRotationArrows(node, step);
      case 'right':
        return renderRightRotationArrows(node, step);
      default:
        return null;
    }
  };
  
  // Render arrows for left rotation
  const renderLeftRotationArrows = (node, step) => {
    if (!node || !node.right) return null;
    
    const parent = node;
    const pivot = node.right;
    
    return (
      <g className="rotation-arrows">
        <AnimationArrow
          sourceX={parent.x}
          sourceY={parent.y}
          targetX={pivot.x}
          targetY={pivot.y}
          active={step === 'before'}
          direction="down"
        />
        <text
          x={(parent.x + pivot.x) / 2}
          y={(parent.y + pivot.y) / 2 - 20}
          textAnchor="middle"
          fill="#ff5722"
          fontSize={12}
          fontWeight="bold"
        >
          Left Rotation
        </text>
      </g>
    );
  };
  
  // Render arrows for right rotation
  const renderRightRotationArrows = (node, step) => {
    if (!node || !node.left) return null;
    
    const parent = node;
    const pivot = node.left;
    
    return (
      <g className="rotation-arrows">
        <AnimationArrow
          sourceX={parent.x}
          sourceY={parent.y}
          targetX={pivot.x}
          targetY={pivot.y}
          active={step === 'before'}
          direction="down"
        />
        <text
          x={(parent.x + pivot.x) / 2}
          y={(parent.y + pivot.y) / 2 - 20}
          textAnchor="middle"
          fill="#ff5722"
          fontSize={12}
          fontWeight="bold"
        >
          Right Rotation
        </text>
      </g>
    );
  };
  
  // Generate tree statistics
  const getTreeStats = () => {
    return {
      nodeCount: tree.nodeCount,
      height: tree.getHeight ? tree.getHeight() : 0,
      isBalanced: tree.isBalanced ? tree.isBalanced() : true
    };
  };
  
  const stats = getTreeStats();
  
  return (
    <div className="avl-visualization-app">
      <header className="app-header">
        <h1>AVL Tree Visualization</h1>
        <p className="app-description">
          An educational tool to visualize self-balancing AVL trees
        </p>
      </header>
      
      <div className="main-content">
        <div className="left-panel">
          <div className="controls-panel">
            <h2>AVL Tree Operations</h2>
            <div className="control-group">
              <input
                type="number"
                id="value-input"
                placeholder="Enter value"
                min="0"
                max="999"
                disabled={animationInProgress}
                className="value-input"
              />
            </div>
            
            <div className="operation-buttons">
              <button 
                onClick={() => handleInsert(document.getElementById('value-input').value)}
                disabled={animationInProgress}
                className="operation-button"
              >
                Insert
              </button>
              <button 
                onClick={() => handleDelete(document.getElementById('value-input').value)}
                disabled={animationInProgress}
                className="operation-button"
              >
                Delete
              </button>
              <button 
                onClick={() => handleSearch(document.getElementById('value-input').value)}
                disabled={animationInProgress}
                className="operation-button"
              >
                Search
              </button>
            </div>
            
            <div className="utility-buttons">
              <button 
                onClick={handleReset}
                disabled={animationInProgress}
                className="utility-button"
              >
                Reset Tree
              </button>
              <button 
                onClick={handleRandomTree}
                disabled={animationInProgress}
                className="utility-button"
              >
                Random Tree
              </button>
              <button 
                onClick={handleToggleBalanceFactors}
                disabled={animationInProgress}
                className="utility-button"
              >
                {showBalanceFactors ? 'Hide Balance Factors' : 'Show Balance Factors'}
              </button>
            </div>
            
            <AnimationControls
              animationInProgress={animationInProgress}
              animationSpeed={animationSpeed}
              onAnimationSpeedChange={handleAnimationSpeedChange}
              onAnimationToggle={handleAnimationToggle}
            />
          </div>
          
          <div className="info-panel">
            <div className="info-header">
              <h2>Operation Result</h2>
            </div>
            <div className="operation-message">
              {message}
            </div>
            <div className="tree-stats">
              <h3>Tree Statistics</h3>
              <ul>
                <li><strong>Nodes:</strong> {stats.nodeCount}</li>
                <li><strong>Height:</strong> {stats.height}</li>
                <li><strong>Balanced:</strong> {stats.isBalanced ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            
            <div className="avl-explanation">
              <h3>AVL Tree Properties</h3>
              <p>
                AVL trees are self-balancing binary search trees where the heights of child subtrees differ 
                by at most 1. When this balance is violated, the tree is rebalanced using rotations.
              </p>
              <h4>Balance Factor</h4>
              <p>
                Balance Factor = Height(Left Subtree) - Height(Right Subtree)
              </p>
              <ul className="balance-legend">
                <li><span className="balance-good">0</span>: Perfect balance</li>
                <li><span className="balance-ok">+1/-1</span>: Acceptable balance</li>
                <li><span className="balance-bad">+2/-2+</span>: Imbalance (requires rotation)</li>
              </ul>
              <h4>Rotation Types</h4>
              <ul>
                <li><strong>Left Rotation</strong>: For right-heavy subtrees</li>
                <li><strong>Right Rotation</strong>: For left-heavy subtrees</li>
                <li><strong>Left-Right Rotation</strong>: First left, then right</li>
                <li><strong>Right-Left Rotation</strong>: First right, then left</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="right-panel">
          <div className="visualization-container">
            <div className="tree-visualization-container">
              {/* SVG overlay for rotation arrows */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'visible',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              >
                <svg 
                  width="100%"
                  height="100%"
                  className="rotation-visualization"
                  style={{
                    overflow: 'visible',
                  }}
                >
                  {renderRotationArrows()}
                </svg>
              </div>
              
              <TreeVisualization
                tree={tree}
                animationInProgress={animationInProgress}
                onNodeClick={handleNodeClick}
                key={treeVersion}
                showBalanceFactors={showBalanceFactors}
              />
            </div>
            
            {selectedNode && nodeRelationships && (
              <NodeDetailsPanel
                node={selectedNode}
                relationships={nodeRelationships}
                onClose={handleCloseNodeDetails}
                isAVL={true}
              />
            )}
            
            {animationInProgress && (
              <div className="animation-status">
                <div className={`animation-indicator ${animationPaused ? 'paused' : 'playing'}`}>
                  {animationPaused ? 'Paused' : 'Playing'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="app-footer">
        <p>
          AVL Tree Visualization - Educational Tool
        </p>
      </footer>
    </div>
  );
};

export default AVLVisualization;