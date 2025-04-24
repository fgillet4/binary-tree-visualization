/**
 * BinarySearchTree.js
 * Implementation of a binary search tree data structure
 */

import TreeNode from './TreeNode';

class BinarySearchTree {
  /**
   * Create a new binary search tree
   */
  constructor() {
    this.root = null;
    this.animationHistory = [];
    this.nodeCount = 0;
  }

  /**
   * Insert a new value into the tree
   * @param {number} value - The value to insert
   * @param {boolean} animate - Whether to record animation steps
   * @returns {Object} The tree instance (for chaining) and animation history
   */
  insert(value, animate = false) {
    if (animate) this.animationHistory = [];
    
    const newNode = new TreeNode(value);
    this.nodeCount++;
    
    // If tree is empty, set as root
    if (this.root === null) {
      this.root = newNode;
      if (animate) {
        this.animationHistory.push({
          type: 'insert',
          node: this.root,
          step: 'complete',
          message: `Added ${value} as the root node`
        });
      }
      return { tree: this, animations: this.animationHistory };
    }
    
    // Otherwise, find the correct position
    return this._insertNode(this.root, newNode, animate);
  }
  
  /**
   * Helper method to recursively insert a node
   * @private
   */
  _insertNode(node, newNode, animate) {
    if (animate) {
      this.animationHistory.push({
        type: 'insert',
        node: node,
        step: 'comparing',
        message: `Comparing ${newNode.value} with ${node.value}`
      });
    }
    
    // Go left if new value is less than current node
    if (newNode.value < node.value) {
      if (animate) {
        this.animationHistory.push({
          type: 'insert',
          node: node,
          step: 'goLeft',
          message: `${newNode.value} < ${node.value}, going left`
        });
      }
      
      if (node.left === null) {
        node.left = newNode;
        if (animate) {
          this.animationHistory.push({
            type: 'insert',
            node: newNode,
            step: 'complete',
            message: `Added ${newNode.value} as left child of ${node.value}`
          });
        }
        return { tree: this, animations: this.animationHistory };
      }
      
      return this._insertNode(node.left, newNode, animate);
    } 
    // Go right if new value is greater than or equal to current node
    else {
      if (animate) {
        this.animationHistory.push({
          type: 'insert',
          node: node,
          step: 'goRight',
          message: `${newNode.value} >= ${node.value}, going right`
        });
      }
      
      if (node.right === null) {
        node.right = newNode;
        if (animate) {
          this.animationHistory.push({
            type: 'insert',
            node: newNode,
            step: 'complete',
            message: `Added ${newNode.value} as right child of ${node.value}`
          });
        }
        return { tree: this, animations: this.animationHistory };
      }
      
      return this._insertNode(node.right, newNode, animate);
    }
  }
  
  /**
   * Search for a value in the tree
   * @param {number} value - The value to search for
   * @param {boolean} animate - Whether to record animation steps
   * @returns {Object} Result containing the node (if found) and animation path
   */
  search(value, animate = false) {
    if (animate) this.animationHistory = [];
    
    // Record the search path and results
    const searchResult = {
      found: false,
      node: null,
      path: [],
      animations: []
    };
    
    const searchNode = (node, val) => {
      if (node === null) return null;
      
      // Record this step in the search path
      searchResult.path.push(node);
      
      if (animate) {
        this.animationHistory.push({
          type: 'search',
          node: node,
          step: 'visiting',
          message: `Checking node with value ${node.value}`
        });
      }
      
      // If we found the value
      if (node.value === val) {
        searchResult.found = true;
        searchResult.node = node;
        
        if (animate) {
          this.animationHistory.push({
            type: 'search',
            node: node,
            step: 'found',
            message: `Found ${val} at this node!`
          });
        }
        
        return node;
      }
      
      // Decide whether to go left or right
      if (val < node.value) {
        if (animate) {
          this.animationHistory.push({
            type: 'search',
            node: node,
            step: 'goLeft',
            message: `${val} < ${node.value}, going left`
          });
        }
        return searchNode(node.left, val);
      } else {
        if (animate) {
          this.animationHistory.push({
            type: 'search',
            node: node,
            step: 'goRight',
            message: `${val} > ${node.value}, going right`
          });
        }
        return searchNode(node.right, val);
      }
    };
    
    searchNode(this.root, value);
    searchResult.animations = this.animationHistory;
    
    // If value wasn't found, add a "not found" animation
    if (!searchResult.found && animate) {
      this.animationHistory.push({
        type: 'search',
        node: null,
        step: 'notFound',
        message: `Value ${value} not found in the tree`
      });
    }
    
    return searchResult;
  }
  
  /**
   * Delete a node with the given value
   * @param {number} value - The value to delete
   * @param {boolean} animate - Whether to record animation steps
   * @returns {Object} The tree and animation history
   */
  delete(value, animate = false) {
    if (animate) this.animationHistory = [];
    
    const removeNode = (node, val) => {
      if (node === null) return null;
      
      if (animate) {
        this.animationHistory.push({
          type: 'delete',
          node: node,
          step: 'visiting',
          message: `Checking node with value ${node.value}`
        });
      }
      
      // If value to delete is less than current node's value, go left
      if (val < node.value) {
        if (animate) {
          this.animationHistory.push({
            type: 'delete',
            node: node,
            step: 'goLeft',
            message: `${val} < ${node.value}, going left`
          });
        }
        node.left = removeNode(node.left, val);
        return node;
      } 
      // If value to delete is greater than current node's value, go right
      else if (val > node.value) {
        if (animate) {
          this.animationHistory.push({
            type: 'delete',
            node: node,
            step: 'goRight',
            message: `${val} > ${node.value}, going right`
          });
        }
        node.right = removeNode(node.right, val);
        return node;
      } 
      // If value equals current node's value, this is the node to remove
      else {
        if (animate) {
          this.animationHistory.push({
            type: 'delete',
            node: node,
            step: 'found',
            message: `Found node to delete: ${node.value}`
          });
        }
        
        // Case 1: Leaf node (no children)
        if (node.left === null && node.right === null) {
          if (animate) {
            this.animationHistory.push({
              type: 'delete',
              node: node,
              step: 'removeLeaf',
              message: `Removing leaf node ${node.value}`
            });
          }
          this.nodeCount--;
          return null;
        }
        
        // Case 2: Node with only one child (right child)
        if (node.left === null) {
          if (animate) {
            this.animationHistory.push({
              type: 'delete',
              node: node,
              step: 'replaceWithRight',
              message: `Replacing node ${node.value} with its right child ${node.right.value}`
            });
          }
          this.nodeCount--;
          return node.right;
        }
        
        // Case 2: Node with only one child (left child)
        if (node.right === null) {
          if (animate) {
            this.animationHistory.push({
              type: 'delete',
              node: node,
              step: 'replaceWithLeft',
              message: `Replacing node ${node.value} with its left child ${node.left.value}`
            });
          }
          this.nodeCount--;
          return node.left;
        }
        
        // Case 3: Node with two children
        // Find the minimum node in the right subtree (successor)
        if (animate) {
          this.animationHistory.push({
            type: 'delete',
            node: node,
            step: 'findSuccessor',
            message: `Finding successor for node with two children`
          });
        }
        
        let successorParent = node;
        let successor = node.right;
        
        // Find the leftmost node in the right subtree
        while (successor.left !== null) {
          successorParent = successor;
          successor = successor.left;
          
          if (animate) {
            this.animationHistory.push({
              type: 'delete',
              node: successor,
              step: 'findingMin',
              message: `Looking for minimum value in right subtree`
            });
          }
        }
        
        if (animate) {
          this.animationHistory.push({
            type: 'delete',
            node: successor,
            step: 'foundSuccessor',
            message: `Found successor: ${successor.value}`
          });
        }
        
        // If successor is not the immediate right child
        if (successorParent !== node) {
          successorParent.left = successor.right;
          successor.right = node.right;
        }
        
        if (animate) {
          this.animationHistory.push({
            type: 'delete',
            node: node,
            step: 'replaceWithSuccessor',
            message: `Replacing ${node.value} with successor ${successor.value}`
          });
        }
        
        // Replace the node to be deleted with the successor
        successor.left = node.left;
        this.nodeCount--;
        return successor;
      }
    };
    
    this.root = removeNode(this.root, value);
    
    return { tree: this, animations: this.animationHistory };
  }
  
  /**
   * Reset all highlights in the tree
   */
  resetHighlights() {
    const resetNode = (node) => {
      if (!node) return;
      node.highlightState = 'normal';
      node.animationStep = 0;
      resetNode(node.left);
      resetNode(node.right);
    };
    
    resetNode(this.root);
  }
  
  /**
   * Calculate positions for visualization
   * @param {number} width - Available width for the visualization
   * @param {number} height - Available height for the visualization
   */
  calculatePositions(width = 800, height = 500) {
    if (!this.root) return;
    
    const yOffset = 50;  // Top margin
    const nodeRadius = 25; // Node circle radius
    
    // Find maximum depth of the tree
    const findMaxDepth = (node, depth = 0) => {
      if (!node) return depth;
      return Math.max(
        findMaxDepth(node.left, depth + 1),
        findMaxDepth(node.right, depth + 1)
      );
    };
    
    const maxDepth = findMaxDepth(this.root);
    
    // Calculate level height based on available height and tree depth
    const levelHeight = Math.min(
      90, // Maximum distance between levels
      (height - yOffset) / (maxDepth || 1) // Distribute available height
    );
    
    // Calculate horizontal spacing based on tree size
    // Large trees need more width to prevent node overlap
    const horizontalFactor = Math.min(
      width / (Math.pow(2, maxDepth) * nodeRadius * 1.5),
      1 // Don't scale up if there's plenty of room
    );
    
    // Position nodes - recursive function to set x,y coordinates
    const positionNode = (node, level = 0, leftBound = 0, rightBound = width) => {
      if (!node) return;
      
      // Calculate horizontal position (centered between bounds)
      const mid = (leftBound + rightBound) / 2;
      node.x = mid;
      
      // Calculate vertical position (based on level)
      node.y = level * levelHeight + yOffset;
      
      // Position children recursively, dividing the available space
      positionNode(node.left, level + 1, leftBound, mid);
      positionNode(node.right, level + 1, mid, rightBound);
    };
    
    // Start positioning from the root
    positionNode(this.root);
  }
  
  /**
   * Create a tree with random values
   * @param {number} count - Number of nodes to create
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {BinarySearchTree} A new tree with random values
   */
  static createRandomTree(count = 7, min = 1, max = 100) {
    const tree = new BinarySearchTree();
    const usedValues = new Set();
    
    // Generate unique random values
    for (let i = 0; i < count; i++) {
      let value;
      do {
        value = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (usedValues.has(value));
      
      usedValues.add(value);
      tree.insert(value);
    }
    
    return tree;
  }
  
  /**
   * Get tree data as an array (in-order traversal)
   * @returns {Array} Sorted array of tree values
   */
  toArray() {
    const result = [];
    
    const inOrderTraversal = (node) => {
      if (node !== null) {
        inOrderTraversal(node.left);
        result.push(node.value);
        inOrderTraversal(node.right);
      }
    };
    
    inOrderTraversal(this.root);
    return result;
  }
}

export default BinarySearchTree;