/**
 * TreeVisualization.js
 * Fixed version with improved boundary handling and full tree visibility
 */

import React, { useEffect, useRef, useState } from 'react';
import TreeNode from './TreeNode';
import TreeEdge from './TreeEdge';

const TreeVisualization = ({ 
  tree, 
  animationInProgress, 
  onNodeClick,
  width = 800,
  height = 500,
  showBalanceFactors = false,
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width, height });
  
  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  
  // Zoom state
  const [scale, setScale] = useState(1);
  
  // Find tree dimensions
  const findTreeDimensions = (node, depth = 0, position = 0, result = { minX: Infinity, maxX: -Infinity, maxDepth: 0 }) => {
    if (!node) return result;
    
    // Update tree boundaries
    result.minX = Math.min(result.minX, position);
    result.maxX = Math.max(result.maxX, position);
    result.maxDepth = Math.max(result.maxDepth, depth);
    
    // Process left and right children with adjusted positions
    const leftSpread = Math.pow(1.5, result.maxDepth - depth); // Spread more at the top
    const rightSpread = leftSpread;
    
    findTreeDimensions(node.left, depth + 1, position - leftSpread, result);
    findTreeDimensions(node.right, depth + 1, position + rightSpread, result);
    
    return result;
  };
  
  // Calculate proper tree layout
  const calculateTreeLayout = () => {
    if (!tree || !tree.root) return;
    
    // Find dimensions needed for this tree
    const dimensions = findTreeDimensions(tree.root);
    
    // Calculate scale factors to fit the tree
    const horizontalSpace = dimensions.maxX - dimensions.minX + 2; // Add padding
    const verticalSpace = dimensions.maxDepth + 1;
    
    // Calculate node positions using the dimensions
    const nodeSpacing = 60; // Base horizontal spacing between nodes
    const levelHeight = 80; // Vertical spacing between levels
    
    const setNodePositions = (node, depth = 0, position = 0) => {
      if (!node) return;
      
      // Convert logical position to actual x coordinate
      // Center the tree horizontally in the container
      const scaleFactor = containerSize.width / horizontalSpace;
      const baseX = containerSize.width / 2; // Center point
      
      // Calculate final coordinates
      node.x = baseX + position * nodeSpacing * 2;
      node.y = depth * levelHeight + 50;
      
      // Position children
      const leftSpread = Math.pow(1.5, dimensions.maxDepth - depth); // Wider at the top
      const rightSpread = leftSpread;
      
      setNodePositions(node.left, depth + 1, position - leftSpread);
      setNodePositions(node.right, depth + 1, position + rightSpread);
    };
    
    // Start positioning from root
    setNodePositions(tree.root);
  };
  
  // Update container size and recalculate layout
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({
          width: clientWidth,
          height: clientHeight
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
  }, []);
  
  // Recalculate tree layout when container size or tree changes
  useEffect(() => {
    calculateTreeLayout();
  }, [tree, containerSize]);
  
  // Mouse wheel event handler for zooming
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * 0.1;
      const newScale = Math.max(0.5, Math.min(2, scale + delta));
      setScale(newScale);
    }
  };
  
  // Add/remove wheel event listener with proper options
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel, { passive: false });
      };
    }
  }, [scale]);
  
  // Disable context menu (right-click)
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
      };
      
      container.addEventListener('contextmenu', handleContextMenu);
      return () => {
        container.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);

  // Mouse event handlers for panning
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      
      setPanOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  // Handle node click for detailed information
  const handleNodeClick = (node, e) => {
    if (!isPanning && onNodeClick) {
      e.stopPropagation();
      const nodeInfo = getNodeRelationships(tree, node);
      onNodeClick(node, nodeInfo);
    }
  };

  // Find node relationships (parent, siblings, ancestors)
  const getNodeRelationships = (tree, targetNode) => {
    if (!tree || !tree.root) return {};
    
    const relationships = {
      parent: null,
      siblings: [],
      ancestors: [],
      path: [],
      height: 0,
      depth: 0,
      isLeaf: !targetNode.left && !targetNode.right,
      childCount: (targetNode.left ? 1 : 0) + (targetNode.right ? 1 : 0)
    };
    
    // Find height of node's subtree
    const findHeight = (node) => {
      if (!node) return 0;
      return 1 + Math.max(findHeight(node.left), findHeight(node.right));
    };
    relationships.height = findHeight(targetNode) - 1;
    
    // Find path to node, parent, and ancestors
    const findPathToNode = (node, value, path = []) => {
      if (!node) return null;
      
      // Add current node to path
      path.push(node);
      
      // Found target node
      if (node.value === value) {
        return path;
      }
      
      // Continue search
      const leftPath = findPathToNode(node.left, value, [...path]);
      if (leftPath) return leftPath;
      
      const rightPath = findPathToNode(node.right, value, [...path]);
      if (rightPath) return rightPath;
      
      return null;
    };
    
    const path = findPathToNode(tree.root, targetNode.value);
    if (path && path.length > 1) {
      relationships.path = path;
      relationships.ancestors = path.slice(0, -1);
      relationships.parent = path[path.length - 2];
      relationships.depth = path.length - 1;
      
      // Find siblings
      if (relationships.parent) {
        const parent = relationships.parent;
        if (parent.left && parent.left.value !== targetNode.value) {
          relationships.siblings.push(parent.left);
        }
        if (parent.right && parent.right.value !== targetNode.value) {
          relationships.siblings.push(parent.right);
        }
      }
    }
    
    return relationships;
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
  const renderNodes = (node, showBalanceFactors = false) => {
    if (!node) return [];
    
    let nodes = [
      <TreeNode 
        key={`node-${node.value}-${node.x}-${node.y}`} 
        node={node} 
        animationInProgress={animationInProgress}
        onClick={handleNodeClick}
        showBalanceFactor={showBalanceFactors}
      />
    ];
    
    if (node.left) {
      nodes = [...nodes, ...renderNodes(node.left, showBalanceFactors)];
    }
    
    if (node.right) {
      nodes = [...nodes, ...renderNodes(node.right, showBalanceFactors)];
    }
    
    return nodes;
  };
  
  // Empty state when there's no tree
  if (!tree || !tree.root) {
    return (
      <div 
        className="tree-visualization-container" 
        ref={containerRef}
        style={{ 
          overflow: 'hidden',
          height: '600px',
          maxHeight: '600px',
          position: 'relative',
          cursor: isPanning ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
      >
        <svg 
          className="tree-visualization tree-empty"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <text
            x="50%"
            y="50%"
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
  
  // Calculate the outer boundaries of the tree to ensure it's fully rendered
  // Find min/max X and Y coordinates
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  const findBoundaries = (node) => {
    if (!node) return;
    
    // Check if node has coordinates
    if (node.x !== undefined && node.y !== undefined) {
      minX = Math.min(minX, node.x - 30); // Add node radius padding
      maxX = Math.max(maxX, node.x + 30);
      minY = Math.min(minY, node.y - 30);
      maxY = Math.max(maxY, node.y + 30);
    }
    
    findBoundaries(node.left);
    findBoundaries(node.right);
  };
  
  findBoundaries(tree.root);
  
  // Ensure we have valid boundaries
  if (minX === Infinity) {
    minX = 0;
    maxX = containerSize.width;
    minY = 0;
    maxY = containerSize.height;
  }
  
  // Add some padding around the boundaries
  const padding = 100;
  minX -= padding;
  maxX += padding;
  minY -= padding;
  maxY += padding;
  
  // Calculate the viewBox for the SVG to include all nodes
  const viewBoxWidth = maxX - minX;
  const viewBoxHeight = maxY - minY;
  
  return (
    <div 
      className="tree-visualization-container" 
      ref={containerRef}
      style={{ 
        overflow: 'hidden',
        height: '600px',
        maxHeight: '600px',
        position: 'relative',
        cursor: isPanning ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="panning-controls">
        <div className="panning-instructions">
          <p>Click and drag to pan the visualization.</p>
        </div>
      </div>
      
      {/* Use a div with position absolute to create a large canvas for panning */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible', // This is crucial - allows content outside container
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
          transformOrigin: 'center',
          transition: isPanning ? 'none' : 'transform 0.1s',
        }}
      >
        <svg 
          width={viewBoxWidth}
          height={viewBoxHeight}
          viewBox={`${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`}
          className={`tree-visualization ${animationInProgress ? 'animating' : ''}`}
          style={{
            overflow: 'visible', // This is crucial - allows rendering outside the SVG bounds
          }}
        >
          <g className="edges-container">
            {renderEdges(tree.root)}
          </g>
          <g className="nodes-container">
            {renderNodes(tree.root, showBalanceFactors)}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default TreeVisualization;