/**
 * TreeVisualization.js
 * Component for rendering the entire binary tree visualization
 */

import React, { useEffect, useRef, useState } from 'react';
import TreeNode from './TreeNode';
import TreeEdge from './TreeEdge';
import { optimizeTreeLayout } from '../utils/treeLayout';

const TreeVisualization = ({ 
  tree, 
  animationInProgress, 
  onNodeClick,
  width = 800,
  height = 500,
}) => {
  const svgRef = useRef(null);
  const [svgDimensions, setSvgDimensions] = useState({ width, height });
  
  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current && svgRef.current.parentElement) {
        const containerWidth = svgRef.current.parentElement.clientWidth;
        setSvgDimensions({
          width: Math.min(containerWidth, width),
          height
        });
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Listen for resize events
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [width, height]);
  
  // Recalculate node positions when tree changes
  useEffect(() => {
    // First make sure tree exists and has the required method
    if (tree && tree.root && typeof tree.calculatePositions === 'function') {
      try {
        tree.calculatePositions(svgDimensions.width, svgDimensions.height);
        // Only optimize layout if tree has nodes positioned
        if (tree.root.x !== undefined && tree.root.y !== undefined) {
          optimizeTreeLayout(tree.root);
        }
      } catch (error) {
        console.error("Error calculating tree positions:", error);
      }
    } else if (tree && tree.root) {
      // Fallback in case calculatePositions is not available
      calculatePositionsFallback(tree, svgDimensions.width, svgDimensions.height);
    }
  }, [tree, svgDimensions]);
  
  // Fallback positioning function in case the tree object doesn't have calculatePositions
  const calculatePositionsFallback = (tree, width, height) => {
    if (!tree || !tree.root) return;
    
    const root = tree.root;
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
    
    const maxDepth = findMaxDepth(root);
    
    // Calculate level height based on available height and tree depth
    const levelHeight = Math.min(
      90, // Maximum distance between levels
      (height - yOffset) / (maxDepth || 1) // Distribute available height
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
    positionNode(root);
  };

  // Generate all edges in the tree
  const renderEdges = (node) => {
    if (!node) return [];
    
    let edges = [];
    
    if (node.left) {
      edges.push(
        <TreeEdge 
          key={`${node.value}-${node.left.value}`} 
          parent={node} 
          child={node.left} 
        />
      );
      edges = [...edges, ...renderEdges(node.left)];
    }
    
    if (node.right) {
      edges.push(
        <TreeEdge 
          key={`${node.value}-${node.right.value}`} 
          parent={node} 
          child={node.right} 
        />
      );
      edges = [...edges, ...renderEdges(node.right)];
    }
    
    return edges;
  };
  
  // Generate all nodes in the tree
  const renderNodes = (node) => {
    if (!node) return [];
    
    let nodes = [
      <TreeNode 
        key={`node-${node.value}-${node.x}-${node.y}`} 
        node={node} 
        animationInProgress={animationInProgress}
        onClick={onNodeClick} 
      />
    ];
    
    if (node.left) {
      nodes = [...nodes, ...renderNodes(node.left)];
    }
    
    if (node.right) {
      nodes = [...nodes, ...renderNodes(node.right)];
    }
    
    return nodes;
  };
  
  // Render empty state when there's no tree
  if (!tree || !tree.root) {
    return (
      <div className="tree-visualization-container">
        <svg 
          ref={svgRef}
          width={svgDimensions.width} 
          height={svgDimensions.height} 
          className="tree-visualization tree-empty"
        >
          <text
            x={svgDimensions.width / 2}
            y={svgDimensions.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={16}
            fill="#666666"
          >
            Tree is empty. Add nodes to visualize.
          </text>
        </svg>
      </div>
    );
  }
  
  // Ensure node positions are calculated
  if (tree.root && (tree.root.x === undefined || tree.root.y === undefined)) {
    calculatePositionsFallback(tree, svgDimensions.width, svgDimensions.height);
  }
  
  return (
    <div className="tree-visualization-container">
      <svg 
        ref={svgRef}
        width={svgDimensions.width} 
        height={svgDimensions.height} 
        className={`tree-visualization ${animationInProgress ? 'animating' : ''}`}
      >
        <g className="edges-container">
          {renderEdges(tree.root)}
        </g>
        <g className="nodes-container">
          {renderNodes(tree.root)}
        </g>
      </svg>
    </div>
  );
};

export default TreeVisualization;