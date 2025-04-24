/**
 * TreeEdge.js
 * Component for rendering connections between tree nodes
 */

import React from 'react';
import { COLORS } from '../constants/colors';

const TreeEdge = ({ parent, child, type = 'normal' }) => {
  if (!parent || !child) return null;
  
  // Determine edge color based on type
  const getEdgeColor = () => {
    switch (type) {
      case 'highlight':
        return COLORS.EDGE_HIGHLIGHT;
      case 'inserting':
        return COLORS.EDGE_INSERTING;
      case 'deleting':
        return COLORS.EDGE_DELETING;
      default:
        return COLORS.EDGE_NORMAL;
    }
  };
  
  // Determine edge style based on parent and child highlight states
  const determineEdgeType = () => {
    if (parent.highlightState === 'inserting' && child.highlightState === 'inserting') {
      return 'inserting';
    }
    if (parent.highlightState === 'deleting' || child.highlightState === 'deleting') {
      return 'deleting';
    }
    if (parent.highlightState === 'searching' && child.highlightState === 'searching') {
      return 'highlight';
    }
    if (parent.highlightState === 'highlight' && child.highlightState === 'highlight') {
      return 'highlight';
    }
    if (parent.highlightState === 'found' || child.highlightState === 'found') {
      return 'highlight';
    }
    return 'normal';
  };
  
  const edgeType = type === 'normal' ? determineEdgeType() : type;
  const edgeColor = getEdgeColor();
  
  return (
    <line 
      x1={parent.x} 
      y1={parent.y} 
      x2={child.x} 
      y2={child.y} 
      stroke={edgeColor} 
      strokeWidth={2} 
      className={`tree-edge ${edgeType}`}
    />
  );
};

export default TreeEdge;