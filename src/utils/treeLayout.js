/**
 * treeLayout.js
 * Utilities for calculating tree node positions for visualization
 */

/**
 * Calculate positions for all nodes in a binary tree
 * @param {Object} root - The root node of the tree
 * @param {number} width - Available width for the visualization
 * @param {number} height - Available height for the visualization
 * @param {number} topMargin - Space from the top 
 * @param {number} nodeSize - Radius/size of the node
 */
export const calculateTreeLayout = (root, width = 800, height = 500, topMargin = 50, nodeSize = 25) => {
    if (!root) return;
    
    // Find maximum depth of the tree
    const findMaxDepth = (node, depth = 0) => {
      if (!node) return depth;
      return Math.max(
        findMaxDepth(node.left, depth + 1),
        findMaxDepth(node.right, depth + 1)
      );
    };
    
    const maxDepth = findMaxDepth(root);
    
    // Calculate level height based on available height and tree depth
    const levelHeight = Math.min(
      90, // Maximum distance between levels
      (height - topMargin) / (maxDepth || 1) // Distribute available height
    );
    
    // Calculate horizontal spacing - adaptive based on tree width
    const widthFactor = Math.min(
      1,  // Don't scale up if there's plenty of space
      width / (Math.pow(2, maxDepth) * nodeSize * 1.5) // Scale down if tree is wide
    );
    
    // Position nodes - recursive function to set x,y coordinates
    const positionNode = (node, level = 0, leftBound = 0, rightBound = width) => {
      if (!node) return;
      
      // Calculate horizontal position (centered between bounds)
      const mid = (leftBound + rightBound) / 2;
      node.x = mid;
      
      // Calculate vertical position (based on level)
      node.y = level * levelHeight + topMargin;
      
      // Position children recursively, dividing the available space
      positionNode(node.left, level + 1, leftBound, mid);
      positionNode(node.right, level + 1, mid, rightBound);
    };
    
    // Start positioning from the root
    positionNode(root);
    
    return root;
  };
  
  /**
   * Optimize tree layout to prevent node overlapping in complex trees
   * @param {Object} root - The root node of the tree
   * @param {number} nodeSize - Radius/size of the node
   */
  export const optimizeTreeLayout = (root, nodeSize = 25) => {
    if (!root) return;
    
    // First pass: Mark overlapping nodes
    const checkOverlaps = (node, nodesToCheck = []) => {
      if (!node) return;
      
      // Check if this node overlaps with any previously visited nodes
      const minDistance = nodeSize * 2; // Minimum distance between node centers
      
      for (const otherNode of nodesToCheck) {
        const distance = Math.sqrt(
          Math.pow(node.x - otherNode.x, 2) + 
          Math.pow(node.y - otherNode.y, 2)
        );
        
        if (distance < minDistance) {
          // Nodes are overlapping
          node.overlapping = true;
          otherNode.overlapping = true;
          
          // Adjust horizontally to prevent overlap
          const adjustment = (minDistance - distance) / 2;
          const angle = Math.atan2(node.y - otherNode.y, node.x - otherNode.x);
          
          node.x += adjustment * Math.cos(angle);
          otherNode.x -= adjustment * Math.cos(angle);
        }
      }
      
      // Add this node to the list of nodes to check
      nodesToCheck.push(node);
      
      // Check children
      checkOverlaps(node.left, [...nodesToCheck]);
      checkOverlaps(node.right, [...nodesToCheck]);
    };
    
    // Start checking from the root
    checkOverlaps(root);
    
    return root;
  };
  
  /**
   * Calculate paths for edges between connected nodes
   * @param {Object} parent - Parent node
   * @param {Object} child - Child node
   * @returns {string} SVG path string
   */
  export const calculateEdgePath = (parent, child) => {
    if (!parent || !child) return '';
    
    // Simple straight line
    return `M ${parent.x} ${parent.y} L ${child.x} ${child.y}`;
  };
  
  /**
   * Find the ideal width and height for a tree visualization
   * @param {Object} root - The root node of the tree
   * @param {number} nodeSize - Size of each node
   * @returns {Object} Recommended width and height
   */
  export const getRecommendedCanvasSize = (root, nodeSize = 25) => {
    if (!root) return { width: 400, height: 300 };
    
    const findMaxDepth = (node, depth = 0) => {
      if (!node) return depth;
      return Math.max(
        findMaxDepth(node.left, depth + 1),
        findMaxDepth(node.right, depth + 1)
      );
    };
    
    const maxDepth = findMaxDepth(root);
    
    // Calculate maximum width based on the maximum possible number of nodes at the deepest level
    const maxWidth = Math.pow(2, maxDepth) * nodeSize * 3;
    
    // Calculate height based on the depth of the tree
    const height = (maxDepth + 1) * nodeSize * 3;
    
    return {
      width: Math.min(maxWidth, 1000), // Cap at 1000px
      height: Math.min(height, 600)    // Cap at 600px
    };
  };