/**
 * TreeNode.js
 * Visual component for rendering a tree node in the visualization
 */

import React from 'react';
import { COLORS } from '../constants/colors';

const TreeNode = ({ node, animationInProgress, onClick, showBalanceFactor = false }) => {
  if (!node) return null;
  
  // Determine node style based on highlight state
  const getNodeColor = () => {
    return COLORS.STATE_COLORS[node.highlightState] || COLORS.NODE_NORMAL;
  };
  
  const getBorderColor = () => {
    return node.highlightState === 'normal' ? COLORS.BORDER_NORMAL : COLORS.BORDER_HIGHLIGHT;
  };
  
  // Get color for balance factor
  const getBalanceFactorColor = () => {
    if (!node.balanceFactor) return '#555';
    if (node.balanceFactor > 1 || node.balanceFactor < -1) return '#f44336'; // Red for imbalance
    if (node.balanceFactor === 1 || node.balanceFactor === -1) return '#ff9800'; // Orange for borderline
    return '#4CAF50'; // Green for perfect balance
  };
  
  // Handle node click
  const handleClick = (e) => {
    if (onClick) {
      onClick(node, e);
    }
  };
  
  return (
    <g 
      className={`tree-node ${node.highlightState}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
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
        pointerEvents="none" // This ensures clicks pass through to the circle
      >
        {node.value}
      </text>
      
      {/* Balance factor indicator for AVL trees */}
      {showBalanceFactor && node.balanceFactor !== undefined && (
        <g className="balance-factor">
          <circle
            cx={node.x + 20}
            cy={node.y - 20}
            r={10}
            fill="white"
            stroke={getBalanceFactorColor()}
            strokeWidth={1.5}
          />
          <text
            x={node.x + 20}
            y={node.y - 20}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fontWeight="bold"
            fill={getBalanceFactorColor()}
            pointerEvents="none"
          >
            {node.balanceFactor || 0}
          </text>
        </g>
      )}
    </g>
  );
};

export default TreeNode;