/**
 * App.js - Simplified version focusing on reliable insertion
 */

import React, { useState, useEffect } from 'react';
import TreeVisualization from './TreeVisualization';
import TreeControls from './TreeControls';
import InfoPanel from './InfoPanel';

// Tree Node Class
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
    this.highlightState = 'normal';
  }
}

// Simple Binary Search Tree Implementation
class SimpleTree {
  constructor() {
    this.root = null;
    this.nodeCount = 0;
  }
  
  insert(value) {
    const newNode = new TreeNode(value);
    this.nodeCount++;
    
    if (!this.root) {
      this.root = newNode;
      return;
    }
    
    const insertNode = (node, newNode) => {
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          insertNode(node.left, newNode);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
        } else {
          insertNode(node.right, newNode);
        }
      }
    };
    
    insertNode(this.root, newNode);
  }
  
  search(value) {
    if (!this.root) return { found: false };
    
    const searchNode = (node, value) => {
      if (!node) return { found: false };
      
      if (node.value === value) {
        return { found: true, node };
      }
      
      if (value < node.value) {
        return searchNode(node.left, value);
      } else {
        return searchNode(node.right, value);
      }
    };
    
    return searchNode(this.root, value);
  }
  
  delete(value) {
    if (!this.root) return;
    
    const findMin = (node) => {
      let current = node;
      while (current.left !== null) {
        current = current.left;
      }
      return current.value;
    };
    
    const removeNode = (node, value) => {
      if (node === null) return null;
      
      if (value < node.value) {
        node.left = removeNode(node.left, value);
        return node;
      } else if (value > node.value) {
        node.right = removeNode(node.right, value);
        return node;
      } else {
        // Node with no children
        if (node.left === null && node.right === null) {
          this.nodeCount--;
          return null;
        }
        
        // Node with one child
        if (node.left === null) {
          this.nodeCount--;
          return node.right;
        }
        if (node.right === null) {
          this.nodeCount--;
          return node.left;
        }
        
        // Node with two children
        const minValue = findMin(node.right);
        node.value = minValue;
        node.right = removeNode(node.right, minValue);
        return node;
      }
    };
    
    this.root = removeNode(this.root, value);
  }
  
  // Calculate positions for visualization
  calculatePositions(width = 800, height = 500) {
    if (!this.root) return;
    
    const yOffset = 50;
    const levelHeight = 80;
    
    const getTreeHeight = (node) => {
      if (!node) return 0;
      return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
    };
    
    const treeHeight = getTreeHeight(this.root);
    const totalWidth = width;
    
    const position = (node, level = 0, leftBound = 0, rightBound = totalWidth) => {
      if (!node) return;
      
      const mid = (leftBound + rightBound) / 2;
      node.x = mid;
      node.y = level * levelHeight + yOffset;
      
      position(node.left, level + 1, leftBound, mid);
      position(node.right, level + 1, mid, rightBound);
    };
    
    position(this.root);
  }
}

// Main App Component
const App = () => {
  const [tree, setTree] = useState(new SimpleTree());
  const [message, setMessage] = useState('Welcome! Add values to build a tree.');
  const [treeVersion, setTreeVersion] = useState(0);
  
  // Calculate positions whenever the tree changes
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
      
      // Insert the value
      tree.insert(numValue);
      setMessage(`Inserted ${numValue} into the tree.`);
      
      // Force a re-render
      setTreeVersion(v => v + 1);
    } catch (error) {
      console.error("Error inserting value:", error);
      setMessage(`Error inserting value: ${error.message}`);
    }
  };
  
  // Search for a value
  const handleSearch = (value) => {
    if (isNaN(parseInt(value))) {
      setMessage(`Please enter a valid number.`);
      return;
    }
    
    try {
      const numValue = parseInt(value);
      const result = tree.search(numValue);
      
      if (result.found) {
        setMessage(`Found ${numValue} in the tree!`);
        
        // Highlight the found node
        const highlightNode = (node, target) => {
          if (!node) return;
          
          if (node.value === target) {
            node.highlightState = 'found';
          } else {
            node.highlightState = 'normal';
          }
          
          highlightNode(node.left, target);
          highlightNode(node.right, target);
        };
        
        highlightNode(tree.root, numValue);
        setTreeVersion(v => v + 1);
      } else {
        setMessage(`Value ${numValue} not found in the tree.`);
      }
    } catch (error) {
      console.error("Error searching for value:", error);
      setMessage(`Error searching for value: ${error.message}`);
    }
  };
  
  // Delete a value
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
      
      // Delete the value
      tree.delete(numValue);
      setMessage(`Deleted ${numValue} from the tree.`);
      
      // Force a re-render
      setTreeVersion(v => v + 1);
    } catch (error) {
      console.error("Error deleting value:", error);
      setMessage(`Error deleting value: ${error.message}`);
    }
  };
  
  // Reset the tree
  const handleReset = () => {
    setTree(new SimpleTree());
    setMessage('Tree has been reset.');
  };
  
  // Generate a random tree
  const handleRandomTree = () => {
    try {
      const newTree = new SimpleTree();
      const usedValues = new Set();
      
      // Generate 7 random unique values
      for (let i = 0; i < 7; i++) {
        let value;
        do {
          value = Math.floor(Math.random() * 100) + 1;
        } while (usedValues.has(value));
        
        usedValues.add(value);
        newTree.insert(value);
      }
      
      setTree(newTree);
      setMessage('Generated a random tree.');
    } catch (error) {
      console.error("Error generating random tree:", error);
      setMessage(`Error generating random tree: ${error.message}`);
    }
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Binary Search Tree Visualization</h1>
        <p className="app-description">
          An educational tool to visualize binary search tree operations
        </p>
      </header>
      
      <div className="main-content">
        <div className="left-panel">
          <div className="controls-panel">
            <h2>Tree Operations</h2>
            <TreeControls
              onInsert={handleInsert}
              onSearch={handleSearch}
              onDelete={handleDelete}
              onReset={handleReset}
              onRandomTree={handleRandomTree}
              onTraversal={() => {}}
              animationInProgress={false}
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
                <li><strong>Nodes:</strong> {tree.nodeCount}</li>
                <li><strong>Height:</strong> {tree.root ? Math.log2(tree.nodeCount + 1) | 0 : 0}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="right-panel">
          <div className="visualization-container">
            <TreeVisualization
              tree={tree}
              animationInProgress={false}
              onNodeClick={(node) => setMessage(`Selected node with value: ${node.value}`)}
              key={treeVersion}
            />
          </div>
        </div>
      </div>
      
      <footer className="app-footer">
        <p>
          Binary Search Tree Visualization - Educational Tool
        </p>
      </footer>
    </div>
  );
};

export default App;