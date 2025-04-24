/**
 * TreeNode.js
 * Visual component for rendering a tree node in the visualization
 */

import React from 'react';
import { COLORS } from '../constants/colors';

const TreeNode = ({ node, animationInProgress, onClick }) => {
  if (!node) return null;
  
  // Determine node style based on highlight state
  const getNodeColor = () => {
    return COLORS.STATE_COLORS[node.highlightState] || COLORS.NODE_NORMAL;
  };
  
  const getBorderColor = () => {
    return node.highlightState === 'normal' ? COLORS.BORDER_NORMAL : COLORS.BORDER_HIGHLIGHT;
  };
  
  // Animation classes
  const animationClass = animationInProgress ? 'animating' : '';
  
  // Handle node click
  const handleClick = () => {
    if (onClick) {
      onClick(node);
    }
  };
  
  return (
    <g 
      className={`tree-node ${animationClass} ${node.highlightState}`}
      onClick={handleClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      data-value={node.value}
    >
      {/* Node circle */}
      <circle 
        cx={node.x} 
        cy={node.y} 
        r={25} 
        fill={getNodeColor()} 
        stroke={getBorderColor()} 
        strokeWidth={2}
        className="node-circle"
      />
      
      {/* Node value text */}
      <text 
        x={node.x} 
        y={node.y} 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fontSize={14}
        fontWeight="bold"
        fill={COLORS.TEXT_NORMAL}
        className="node-text"
      >
        {node.value}
      </text>
    </g>
  );
};

export default TreeNode;