/**
 * treeOperations.js
 * Additional tree utilities and operations
 */

/**
 * Get tree statistics and information
 * @param {Object} tree - The binary search tree
 * @returns {Object} Statistics about the tree
 */
export const getTreeStats = (tree) => {
    if (!tree || !tree.root) {
      return {
        nodeCount: 0,
        height: 0,
        isBalanced: true,
        minValue: null,
        maxValue: null
      };
    }
    
    // Calculate tree height
    const getHeight = (node) => {
      if (!node) return 0;
      return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    };
    
    // Check if tree is balanced
    const isBalanced = (node) => {
      if (!node) return true;
      
      const leftHeight = getHeight(node.left);
      const rightHeight = getHeight(node.right);
      
      if (Math.abs(leftHeight - rightHeight) <= 1 && 
          isBalanced(node.left) && 
          isBalanced(node.right)) {
        return true;
      }
      
      return false;
    };
    
    // Find minimum value
    const findMin = (node) => {
      if (!node) return null;
      if (!node.left) return node.value;
      return findMin(node.left);
    };
    
    // Find maximum value
    const findMax = (node) => {
      if (!node) return null;
      if (!node.right) return node.value;
      return findMax(node.right);
    };
    
    return {
      nodeCount: tree.nodeCount || 0,
      height: getHeight(tree.root),
      isBalanced: isBalanced(tree.root),
      minValue: findMin(tree.root),
      maxValue: findMax(tree.root)
    };
  };
  
  /**
   * Generate traversal animations for educational purposes
   * @param {Object} tree - The binary search tree
   * @param {string} traversalType - The type of traversal ('inorder', 'preorder', 'postorder', 'levelorder')
   * @returns {Array} Animation steps for visualization
   */
  export const generateTraversalAnimation = (tree, traversalType = 'inorder') => {
    if (!tree || !tree.root) {
      return [];
    }
    
    const animations = [];
    
    switch (traversalType) {
      case 'inorder':
        inOrderTraversal(tree.root);
        break;
      case 'preorder':
        preOrderTraversal(tree.root);
        break;
      case 'postorder':
        postOrderTraversal(tree.root);
        break;
      case 'levelorder':
        levelOrderTraversal(tree.root);
        break;
      default:
        inOrderTraversal(tree.root);
    }
    
    return animations;
    
    // Traversal methods
    function inOrderTraversal(node) {
      if (!node) return;
      
      // Visit left subtree
      animations.push({
        type: 'traversal',
        traversalType: 'inorder',
        node,
        step: 'visitLeft',
        message: node.left ? `Going to left child of ${node.value}` : `${node.value} has no left child`
      });
      inOrderTraversal(node.left);
      
      // Visit node
      animations.push({
        type: 'traversal',
        traversalType: 'inorder',
        node,
        step: 'visitNode',
        message: `Visiting node ${node.value} (In-order)`
      });
      
      // Visit right subtree
      animations.push({
        type: 'traversal',
        traversalType: 'inorder',
        node,
        step: 'visitRight',
        message: node.right ? `Going to right child of ${node.value}` : `${node.value} has no right child`
      });
      inOrderTraversal(node.right);
    }
    
    function preOrderTraversal(node) {
      if (!node) return;
      
      // Visit node
      animations.push({
        type: 'traversal',
        traversalType: 'preorder',
        node,
        step: 'visitNode',
        message: `Visiting node ${node.value} (Pre-order)`
      });
      
      // Visit left subtree
      animations.push({
        type: 'traversal',
        traversalType: 'preorder',
        node,
        step: 'visitLeft',
        message: node.left ? `Going to left child of ${node.value}` : `${node.value} has no left child`
      });
      preOrderTraversal(node.left);
      
      // Visit right subtree
      animations.push({
        type: 'traversal',
        traversalType: 'preorder',
        node,
        step: 'visitRight',
        message: node.right ? `Going to right child of ${node.value}` : `${node.value} has no right child`
      });
      preOrderTraversal(node.right);
    }
    
    function postOrderTraversal(node) {
      if (!node) return;
      
      // Visit left subtree
      animations.push({
        type: 'traversal',
        traversalType: 'postorder',
        node,
        step: 'visitLeft',
        message: node.left ? `Going to left child of ${node.value}` : `${node.value} has no left child`
      });
      postOrderTraversal(node.left);
      
      // Visit right subtree
      animations.push({
        type: 'traversal',
        traversalType: 'postorder',
        node,
        step: 'visitRight',
        message: node.right ? `Going to right child of ${node.value}` : `${node.value} has no right child`
      });
      postOrderTraversal(node.right);
      
      // Visit node
      animations.push({
        type: 'traversal',
        traversalType: 'postorder',
        node,
        step: 'visitNode',
        message: `Visiting node ${node.value} (Post-order)`
      });
    }
    
    function levelOrderTraversal(root) {
      const queue = [root];
      let level = 0;
      
      while (queue.length > 0) {
        const levelSize = queue.length;
        
        animations.push({
          type: 'traversal',
          traversalType: 'levelorder',
          node: null,
          step: 'newLevel',
          message: `Processing level ${level}`
        });
        
        for (let i = 0; i < levelSize; i++) {
          const node = queue.shift();
          
          animations.push({
            type: 'traversal',
            traversalType: 'levelorder',
            node,
            step: 'visitNode',
            message: `Visiting node ${node.value} at level ${level}`
          });
          
          if (node.left) {
            queue.push(node.left);
          }
          
          if (node.right) {
            queue.push(node.right);
          }
        }
        
        level++;
      }
    }
  };
  
  /**
   * Get time complexity information for operations
   * @param {string} operation - The tree operation
   * @returns {Object} Information about time complexity
   */
  export const getOperationComplexity = (operation) => {
    const complexityInfo = {
      insert: {
        average: 'O(log n)',
        worst: 'O(n)',
        best: 'O(1)',
        description: 'In a balanced tree, insertion takes logarithmic time as we eliminate half the tree at each step. In the worst case (degenerate tree), it may take linear time.'
      },
      search: {
        average: 'O(log n)',
        worst: 'O(n)',
        best: 'O(1)',
        description: 'Searching follows the same pattern as insertion, with logarithmic time for balanced trees and linear time for degenerate trees.'
      },
      delete: {
        average: 'O(log n)',
        worst: 'O(n)',
        best: 'O(1)',
        description: 'Deletion involves searching for the node (logarithmic time) and may require finding a successor (another logarithmic operation in the worst case).'
      },
      traversal: {
        average: 'O(n)',
        worst: 'O(n)',
        best: 'O(n)',
        description: 'Any traversal method needs to visit each node exactly once, resulting in linear time complexity.'
      }
    };
    
    return complexityInfo[operation] || {
      average: 'Unknown',
      worst: 'Unknown',
      best: 'Unknown',
      description: 'No information available for this operation.'
    };
  };