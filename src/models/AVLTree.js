/**
 * AVLTree.js
 * Implementation of a self-balancing AVL tree data structure
 */

import TreeNode from './TreeNode';

class AVLTree {
  /**
   * Create a new AVL tree
   */
  constructor() {
    this.root = null;
    this.animationHistory = [];
    this.nodeCount = 0;
  }

  /**
   * Calculate the height of a node
   * @param {TreeNode} node - The node to calculate height for
   * @returns {number} The height of the node (-1 for null nodes)
   */
  height(node) {
    return node ? node.height : -1;
  }

  /**
   * Update the height of a node based on its children
   * @param {TreeNode} node - The node to update
   */
  updateHeight(node) {
    if (!node) return;
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  /**
   * Calculate the balance factor of a node
   * @param {TreeNode} node - The node to calculate balance for
   * @returns {number} The balance factor (left height - right height)
   */
  balanceFactor(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  /**
   * Right rotation
   * @param {TreeNode} y - The root of the subtree to rotate
   * @param {boolean} animate - Whether to record animation steps
   * @returns {TreeNode} The new root after rotation
   */
  rotateRight(y, animate = false) {
    if (!y || !y.left) return y;

    if (animate) {
      this.animationHistory.push({
        type: 'rotation',
        subtype: 'right',
        node: y,
        step: 'before',
        message: `Starting right rotation at node ${y.value}`
      });
    }

    const x = y.left;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    this.updateHeight(y);
    this.updateHeight(x);

    if (animate) {
      this.animationHistory.push({
        type: 'rotation',
        subtype: 'right',
        node: x,
        oldRoot: y,
        newRoot: x,
        step: 'after',
        message: `Completed right rotation, new subtree root is ${x.value}`
      });
    }

    return x;
  }

  /**
   * Left rotation
   * @param {TreeNode} x - The root of the subtree to rotate
   * @param {boolean} animate - Whether to record animation steps
   * @returns {TreeNode} The new root after rotation
   */
  rotateLeft(x, animate = false) {
    if (!x || !x.right) return x;

    if (animate) {
      this.animationHistory.push({
        type: 'rotation',
        subtype: 'left',
        node: x,
        step: 'before',
        message: `Starting left rotation at node ${x.value}`
      });
    }

    const y = x.right;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    this.updateHeight(x);
    this.updateHeight(y);

    if (animate) {
      this.animationHistory.push({
        type: 'rotation',
        subtype: 'left',
        node: y,
        oldRoot: x,
        newRoot: y,
        step: 'after',
        message: `Completed left rotation, new subtree root is ${y.value}`
      });
    }

    return y;
  }

  /**
   * Insert a new value into the AVL tree
   * @param {number} value - The value to insert
   * @param {boolean} animate - Whether to record animation steps
   * @returns {Object} The tree instance and animation history
   */
  insert(value, animate = false) {
    if (animate) this.animationHistory = [];

    // Create a new node
    const newNode = new TreeNode(value);
    newNode.height = 0; // Initialize height for leaf node
    this.nodeCount++;

    if (animate) {
      this.animationHistory.push({
        type: 'insert',
        node: newNode,
        step: 'start',
        message: `Starting insertion of node ${value}`
      });
    }

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

    // Insert node recursively
    this.root = this._insertNode(this.root, newNode, animate);
    
    return { tree: this, animations: this.animationHistory };
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

    // Standard BST insertion
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
            step: 'addedNode',
            message: `Added ${newNode.value} as left child of ${node.value}`
          });
        }
      } else {
        node.left = this._insertNode(node.left, newNode, animate);
      }
    } else {
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
            step: 'addedNode',
            message: `Added ${newNode.value} as right child of ${node.value}`
          });
        }
      } else {
        node.right = this._insertNode(node.right, newNode, animate);
      }
    }

    // Update height
    this.updateHeight(node);
    const balanceFactor = this.balanceFactor(node);
    
    // Track balance factor for visualization
    node.balanceFactor = balanceFactor;
    
    if (animate) {
      this.animationHistory.push({
        type: 'balance',
        node: node,
        balanceFactor: balanceFactor,
        step: 'calculating',
        message: `Calculated balance factor of ${balanceFactor} for node ${node.value}`
      });
    }

    // Perform rotations if needed to balance the tree
    
    // Left Left Case
    if (balanceFactor > 1 && this.balanceFactor(node.left) >= 0) {
      if (animate) {
        this.animationHistory.push({
          type: 'balance',
          node: node,
          balanceFactor: balanceFactor,
          step: 'imbalance',
          subtype: 'LL',
          message: `Left-Left imbalance detected at node ${node.value} (balance factor: ${balanceFactor})`
        });
      }
      
      return this.rotateRight(node, animate);
    }
    
    // Right Right Case
    if (balanceFactor < -1 && this.balanceFactor(node.right) <= 0) {
      if (animate) {
        this.animationHistory.push({
          type: 'balance',
          node: node,
          balanceFactor: balanceFactor,
          step: 'imbalance',
          subtype: 'RR',
          message: `Right-Right imbalance detected at node ${node.value} (balance factor: ${balanceFactor})`
        });
      }
      
      return this.rotateLeft(node, animate);
    }
    
    // Left Right Case
    if (balanceFactor > 1 && this.balanceFactor(node.left) < 0) {
      if (animate) {
        this.animationHistory.push({
          type: 'balance',
          node: node,
          balanceFactor: balanceFactor,
          step: 'imbalance',
          subtype: 'LR',
          message: `Left-Right imbalance detected at node ${node.value} (balance factor: ${balanceFactor})`
        });
      }
      
      node.left = this.rotateLeft(node.left, animate);
      return this.rotateRight(node, animate);
    }
    
    // Right Left Case
    if (balanceFactor < -1 && this.balanceFactor(node.right) > 0) {
      if (animate) {
        this.animationHistory.push({
          type: 'balance',
          node: node,
          balanceFactor: balanceFactor,
          step: 'imbalance',
          subtype: 'RL',
          message: `Right-Left imbalance detected at node ${node.value} (balance factor: ${balanceFactor})`
        });
      }
      
      node.right = this.rotateRight(node.right, animate);
      return this.rotateLeft(node, animate);
    }

    // If no imbalance, just return the node
    if (animate && (balanceFactor >= -1 && balanceFactor <= 1)) {
      this.animationHistory.push({
        type: 'balance',
        node: node,
        balanceFactor: balanceFactor,
        step: 'balanced',
        message: `Node ${node.value} is balanced (balance factor: ${balanceFactor})`
      });
    }
    
    return node;
  }

  /**
   * Delete a node with the given value from the AVL tree
   * @param {number} value - The value to delete
   * @param {boolean} animate - Whether to record animation steps
   * @returns {Object} The tree instance and animation history
   */
  delete(value, animate = false) {
    if (animate) this.animationHistory = [];
    
    if (animate) {
      this.animationHistory.push({
        type: 'delete',
        value: value,
        step: 'start',
        message: `Starting deletion of node with value ${value}`
      });
    }
    
    this.root = this._deleteNode(this.root, value, animate);
    
    return { tree: this, animations: this.animationHistory };
  }

  /**
   * Helper method to recursively delete a node
   * @private
   */
  _deleteNode(node, value, animate) {
    if (!node) {
      if (animate) {
        this.animationHistory.push({
          type: 'delete',
          step: 'notFound',
          message: `Value ${value} not found in the tree`
        });
      }
      return null;
    }
    
    if (animate) {
      this.animationHistory.push({
        type: 'delete',
        node: node,
        step: 'visiting',
        message: `Checking node with value ${node.value}`
      });
    }

    // Standard BST delete
    if (value < node.value) {
      if (animate) {
        this.animationHistory.push({
          type: 'delete',
          node: node,
          step: 'goLeft',
          message: `${value} < ${node.value}, going left`
        });
      }
      
      node.left = this._deleteNode(node.left, value, animate);
    } else if (value > node.value) {
      if (animate) {
        this.animationHistory.push({
          type: 'delete',
          node: node,
          step: 'goRight',
          message: `${value} > ${node.value}, going right`
        });
      }
      
      node.right = this._deleteNode(node.right, value, animate);
    } else {
      // Node to delete found
      if (animate) {
        this.animationHistory.push({
          type: 'delete',
          node: node,
          step: 'found',
          message: `Found node to delete: ${node.value}`
        });
      }
      
      // Case 1: Leaf node
      if (!node.left && !node.right) {
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
      
      // Case 2: Node with only one child
      if (!node.left) {
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
      
      if (!node.right) {
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
      if (animate) {
        this.animationHistory.push({
          type: 'delete',
          node: node,
          step: 'findSuccessor',
          message: `Node has two children, finding in-order successor`
        });
      }
      
      // Find the in-order successor (smallest node in right subtree)
      let successor = node.right;
      while (successor.left) {
        if (animate) {
          this.animationHistory.push({
            type: 'delete',
            node: successor,
            step: 'findingMin',
            message: `Looking for minimum value in right subtree`
          });
        }
        
        successor = successor.left;
      }
      
      if (animate) {
        this.animationHistory.push({
          type: 'delete',
          node: successor,
          step: 'foundSuccessor',
          message: `Found successor: ${successor.value}`
        });
      }
      
      // Copy successor value to the current node
      node.value = successor.value;
      
      if (animate) {
        this.animationHistory.push({
          type: 'delete',
          node: node,
          step: 'replaceWithSuccessor',
          message: `Replaced value with successor: ${successor.value}`
        });
      }
      
      // Delete the successor
      node.right = this._deleteNode(node.right, successor.value, animate);
    }
    
    // If tree is now empty
    if (!node) return null;
    
    // Update height
    this.updateHeight(node);
    const balanceFactor = this.balanceFactor(node);
    
    // Track balance factor for visualization
    node.balanceFactor = balanceFactor;
    
    if (animate) {
      this.animationHistory.push({
        type: 'balance',
        node: node,
        balanceFactor: balanceFactor,
        step: 'calculating',
        message: `Calculated balance factor of ${balanceFactor} for node ${node.value}`
      });
    }
    
    // Same balancing logic as in insertion
    
    // Left Left Case
    if (balanceFactor > 1 && this.balanceFactor(node.left) >= 0) {
      if (animate) {
        this.animationHistory.push({
          type: 'balance',
          node: node,
          balanceFactor: balanceFactor,
          step: 'imbalance',
          subtype: 'LL',
          message: `Left-Left imbalance detected at node ${node.value} (balance factor: ${balanceFactor})`
        });
      }
      
      return this.rotateRight(node, animate);
    }
    
    // Left Right Case
    if (balanceFactor > 1 && this.balanceFactor(node.left) < 0) {
      if (animate) {
        this.animationHistory.push({
          type: 'balance',
          node: node,
          balanceFactor: balanceFactor,
          step: 'imbalance',
          subtype: 'LR',
          message: `Left-Right imbalance detected at node ${node.value} (balance factor: ${balanceFactor})`
        });
      }
      
      node.left = this.rotateLeft(node.left, animate);
      return this.rotateRight(node, animate);
    }
    
    // Right Right Case
    if (balanceFactor < -1 && this.balanceFactor(node.right) <= 0) {
      if (animate) {
        this.animationHistory.push({
          type: 'balance',
          node: node,
          balanceFactor: balanceFactor,
          step: 'imbalance',
          subtype: 'RR',
          message: `Right-Right imbalance detected at node ${node.value} (balance factor: ${balanceFactor})`
        });
      }
      
      return this.rotateLeft(node, animate);
    }
    
    // Right Left Case
    if (balanceFactor < -1 && this.balanceFactor(node.right) > 0) {
      if (animate) {
        this.animationHistory.push({
          type: 'balance',
          node: node,
          balanceFactor: balanceFactor,
          step: 'imbalance',
          subtype: 'RL',
          message: `Right-Left imbalance detected at node ${node.value} (balance factor: ${balanceFactor})`
        });
      }
      
      node.right = this.rotateRight(node.right, animate);
      return this.rotateLeft(node, animate);
    }
    
    return node;
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
   * Get the height of the tree
   * @returns {number} The height of the tree
   */
  getHeight() {
    return this.height(this.root) + 1; // +1 to convert from 0-based to 1-based height
  }

  /**
   * Check if the tree is balanced
   * @returns {boolean} True if the tree is balanced
   */
  isBalanced() {
    const checkBalance = (node) => {
      if (!node) return true;
      
      const balanceFactor = this.balanceFactor(node);
      
      if (Math.abs(balanceFactor) > 1) {
        return false;
      }
      
      return checkBalance(node.left) && checkBalance(node.right);
    };
    
    return checkBalance(this.root);
  }

  /**
   * Create a tree with random values
   * @param {number} count - Number of nodes to create
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {AVLTree} A new tree with random values
   */
  static createRandomTree(count = 7, min = 1, max = 100) {
    const tree = new AVLTree();
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

export default AVLTree;