/**
 * TreeNode.js
 * Represents a single node in the binary search tree
 */

class TreeNode {
    /**
     * Create a new tree node
     * @param {number} value - The value stored in this node
     */
    constructor(value) {
      this.value = value;
      this.left = null;     // Left child
      this.right = null;    // Right child
      this.x = 0;           // X coordinate for rendering
      this.y = 0;           // Y coordinate for rendering
      this.highlightState = 'normal'; // Visual state: normal, highlight, searching, found, inserting
      this.animationStep = 0;         // Used for sequencing animations
    }
  
    /**
     * Checks if this node is a leaf (has no children)
     * @returns {boolean} True if the node is a leaf
     */
    isLeaf() {
      return this.left === null && this.right === null;
    }
  
    /**
     * Gets the number of children this node has
     * @returns {number} 0, 1, or 2
     */
    childCount() {
      let count = 0;
      if (this.left) count++;
      if (this.right) count++;
      return count;
    }
  }
  
  export default TreeNode;