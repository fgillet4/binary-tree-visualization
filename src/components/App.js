/**
 * App.js - Binary tree visualization application with support for BST and Heap
 */

import React, { useState } from 'react';
import TreeVisualization from './TreeVisualization';
import TreeControls from './TreeControls';
import InfoPanel from './InfoPanel';
import NodeDetailsPanel from './NodeDetailsPanel';
import HeapVisualization from './HeapVisualization';
import '../styles/App.css';

// Import Tree Classes
import BinarySearchTree from '../models/BinarySearchTree';
import TreeNode from '../models/TreeNode';

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('bst'); // 'bst' or 'heap'
  const [tree, setTree] = useState(new BinarySearchTree());
  const [message, setMessage] = useState('Welcome! Add values to build a tree.');
  const [treeVersion, setTreeVersion] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeRelationships, setNodeRelationships] = useState(null);
  const [animationInProgress, setAnimationInProgress] = useState(false);
  
  // Calculate positions whenever the tree changes
  React.useEffect(() => {
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
    setTree(new BinarySearchTree());
    setMessage('Tree has been reset.');
    setSelectedNode(null);
    setNodeRelationships(null);
    setTreeVersion(v => v + 1);
  };
  
  // Generate a random tree
  const handleRandomTree = () => {
    try {
      const newTree = BinarySearchTree.createRandomTree(7, 1, 100);
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
  
  // Handle traversals
  const handleTraversal = (traversalType) => {
    setMessage(`Selected ${traversalType} traversal`);
    // Implement traversal animation later
  };
  
  // Handle node click
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    
    // Calculate relationships
    const relationships = calculateNodeRelationships(tree, node);
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
      height: tree.getHeight ? tree.getHeight() : 0,
      isBalanced: tree.isBalanced ? tree.isBalanced() : false
    };
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Binary Tree Data Structures Visualization</h1>
        <p className="app-description">
          An educational tool to visualize binary tree data structures
        </p>
        
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'bst' ? 'active' : ''}`}
            onClick={() => setActiveTab('bst')}
          >
            Binary Search Tree
          </button>
          <button 
            className={`tab-button ${activeTab === 'heap' ? 'active' : ''}`}
            onClick={() => setActiveTab('heap')}
          >
            Binary Heap
          </button>
        </div>
      </header>
      
      <div className="main-content">
        {activeTab === 'bst' ? (
          <>
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
                  onTraversal={handleTraversal}
                  animationInProgress={animationInProgress}
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
                    <li><strong>Height:</strong> {tree.getHeight ? tree.getHeight() : 0}</li>
                    <li><strong>Balanced:</strong> {tree.isBalanced ? (tree.isBalanced() ? 'Yes' : 'No') : 'N/A'}</li>
                  </ul>
                </div>
                
                <div className="info-tips">
                  <h3>Interaction Tips</h3>
                  <ul>
                    <li>Click on any node to view detailed information</li>
                    <li>Hold and drag to pan the visualization</li>
                    <li>Use Ctrl + mouse wheel to zoom in/out</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="right-panel">
              <div className="visualization-container">
                <TreeVisualization
                  tree={tree}
                  animationInProgress={animationInProgress}
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
          </>
        ) : (
          <HeapVisualization />
        )}
      </div>
      
      <footer className="app-footer">
        <p>
          Binary Tree Data Structures Visualization - Educational Tool
        </p>
      </footer>
    </div>
  );
};

export default App;