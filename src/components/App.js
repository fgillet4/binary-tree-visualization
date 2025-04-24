/**
 * App.js - Updated with node details panel and support for panning
 */

import React, { useState, useEffect } from 'react';
import TreeVisualization from './TreeVisualization';
import TreeControls from './TreeControls';
import InfoPanel from './InfoPanel';
import NodeDetailsPanel from './NodeDetailsPanel';

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
  
  // Get tree height (maximum depth)
  getHeight() {
    const calculateHeight = (node) => {
      if (!node) return 0;
      return 1 + Math.max(calculateHeight(node.left), calculateHeight(node.right));
    };
    
    return calculateHeight(this.root) - 1; // Height is 0-based
  }
  
  // Check if tree is balanced
  isBalanced() {
    const checkBalance = (node) => {
      if (!node) return { balanced: true, height: 0 };
      
      const left = checkBalance(node.left);
      const right = checkBalance(node.right);
      
      if (!left.balanced || !right.balanced) {
        return { balanced: false, height: 0 };
      }
      
      if (Math.abs(left.height - right.height) > 1) {
        return { balanced: false, height: 0 };
      }
      
      return { 
        balanced: true, 
        height: 1 + Math.max(left.height, right.height) 
      };
    };
    
    return checkBalance(this.root).balanced;
  }
}

// Main App Component
const App = () => {
  const [tree, setTree] = useState(new SimpleTree());
  const [message, setMessage] = useState('Welcome! Add values to build a tree.');
  const [treeVersion, setTreeVersion] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeRelationships, setNodeRelationships] = useState(null);
  
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
      
      // Clear selected node if any
      setSelectedNode(null);
      setNodeRelationships(null);
    } catch (error) {
      console.error("Error inserting value:", error);
      setMessage(`Error inserting value: ${error.message}`);
    }
  };
  
  // Handle batch insertion
  const handleBatchInsert = (values) => {
    if (!values.trim()) {
      setMessage(`Please enter comma-separated values.`);
      return;
    }
    
    try {
      // Parse the values
      const valueArray = values.split(',').map(v => v.trim());
      let insertedCount = 0;
      
      // Insert each value
      for (const val of valueArray) {
        const numValue = parseInt(val);
        
        if (isNaN(numValue)) {
          continue; // Skip invalid values
        }
        
        // Skip duplicates
        if (tree.search(numValue).found) {
          continue;
        }
        
        // Insert the value
        tree.insert(numValue);
        insertedCount++;
      }
      
      setMessage(`Inserted ${insertedCount} values into the tree.`);
      
      // Force a re-render
      setTreeVersion(v => v + 1);
      
      // Clear selected node if any
      setSelectedNode(null);
      setNodeRelationships(null);
    } catch (error) {
      console.error("Error batch inserting values:", error);
      setMessage(`Error batch inserting values: ${error.message}`);
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
        
        // Set as selected node
        setSelectedNode(result.node);
        
        // Calculate relationships
        const relationships = calculateNodeRelationships(tree, result.node);
        setNodeRelationships(relationships);
        
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
        // Clear selected node
        setSelectedNode(null);
        setNodeRelationships(null);
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
      
      // If deleting the selected node, clear selection
      if (selectedNode && selectedNode.value === numValue) {
        setSelectedNode(null);
        setNodeRelationships(null);
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
    setSelectedNode(null);
    setNodeRelationships(null);
    setTreeVersion(v => v + 1);
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
      setSelectedNode(null);
      setNodeRelationships(null);
      setTreeVersion(v => v + 1);
    } catch (error) {
      console.error("Error generating random tree:", error);
      setMessage(`Error generating random tree: ${error.message}`);
    }
  };
  
  // Handle node click
  const handleNodeClick = (node, relationships) => {
    setSelectedNode(node);
    setNodeRelationships(relationships);
    setMessage(`Selected node: ${node.value}`);
    
    // Highlight the selected node
    const highlightNode = (treeNode, target) => {
      if (!treeNode) return;
      
      if (treeNode.value === target.value) {
        treeNode.highlightState = 'found';
      } else {
        treeNode.highlightState = 'normal';
      }
      
      highlightNode(treeNode.left, target);
      highlightNode(treeNode.right, target);
    };
    
    highlightNode(tree.root, node);
    setTreeVersion(v => v + 1);
  };
  
  // Close node details panel
  const handleCloseNodeDetails = () => {
    setSelectedNode(null);
    setNodeRelationships(null);
    
    // Reset all highlights
    const resetHighlights = (node) => {
      if (!node) return;
      node.highlightState = 'normal';
      resetHighlights(node.left);
      resetHighlights(node.right);
    };
    
    resetHighlights(tree.root);
    setTreeVersion(v => v + 1);
  };
  
  // Calculate node relationships
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
    
    // Calculate node height (max depth of subtree)
    const getHeight = (node) => {
      if (!node) return 0;
      return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    };
    
    const height = getHeight(node) - 1; // Convert to 0-based height
    
    // Calculate node depth (distance from root)
    const depth = path.length - 1;
    
    // Determine if node is a leaf
    const isLeaf = !node.left && !node.right;
    
    // Count children
    const childCount = (node.left ? 1 : 0) + (node.right ? 1 : 0);
    
    // Return all relationships
    return {
      parent,
      siblings,
      ancestors: path.slice(0, -1), // All nodes in the path except the target node
      path,
      height,
      depth,
      isLeaf,
      childCount
    };
  };
  
  // Generate tree statistics
  const getTreeStats = () => {
    return {
      nodeCount: tree.nodeCount,
      height: tree.getHeight(),
      isBalanced: tree.isBalanced()
    };
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
              onBatchInsert={handleBatchInsert}
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
                <li><strong>Height:</strong> {tree.getHeight()}</li>
                <li><strong>Balanced:</strong> {tree.isBalanced() ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            
            <div className="info-tips">
              <h3>Interaction Tips</h3>
              <ul>
                <li>Click on any node to view detailed information</li>
                <li>Hold Ctrl and drag to pan the visualization</li>
                <li>Use Ctrl + mouse wheel to zoom in/out</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="right-panel">
          <div className="visualization-container">
            <TreeVisualization
              tree={tree}
              animationInProgress={false}
              onNodeClick={handleNodeClick}
              key={treeVersion}
            />
            
            {selectedNode && nodeRelationships && (
              <NodeDetailsPanel
                node={selectedNode}
                relationships={nodeRelationships}
                onClose={handleCloseNodeDetails}
              />
            )}
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