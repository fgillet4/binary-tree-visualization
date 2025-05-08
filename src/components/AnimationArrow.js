/**
 * AnimationArrow.js
 * Component to show directional arrows during heap node swaps
 */

import React from 'react';

const AnimationArrow = ({ sourceX, sourceY, targetX, targetY, active, direction }) => {
  // Skip rendering if positions aren't defined
  if (sourceX === undefined || sourceY === undefined || 
      targetX === undefined || targetY === undefined) {
    return null;
  }
  
  // Calculate the midpoint for the arrow (for curved paths)
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  // Calculate the distance between points
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate the angle for the arrowhead
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
  
  // Arrowhead size and control point offset
  const arrowSize = 10;
  const controlPointOffset = Math.min(distance * 0.5, 50); // Curve intensity
  
  // Adjust the control point based on whether we're going up or down
  const controlY = direction === 'up' 
    ? Math.min(sourceY, targetY) - controlPointOffset 
    : Math.max(sourceY, targetY) + controlPointOffset;
  
  // Calculate arrowhead points
  const arrowPoint1X = targetX - arrowSize * Math.cos(angle - Math.PI / 6);
  const arrowPoint1Y = targetY - arrowSize * Math.sin(angle - Math.PI / 6);
  const arrowPoint2X = targetX - arrowSize * Math.cos(angle + Math.PI / 6);
  const arrowPoint2Y = targetY - arrowSize * Math.sin(angle + Math.PI / 6);
  
  // Define path for curved arrow
  const path = `
    M ${sourceX} ${sourceY}
    Q ${midX} ${controlY}, ${targetX} ${targetY}
  `;
  
  // Style based on active state
  const arrowStyle = {
    stroke: active ? '#ff5722' : '#ccc',
    strokeWidth: active ? 2.5 : 1.5,
    fill: 'none',
    opacity: active ? 1 : 0.5,
    strokeDasharray: active ? 'none' : '5,5',
  };
  
  const arrowHeadStyle = {
    fill: active ? '#ff5722' : '#ccc',
    opacity: active ? 1 : 0.5,
  };
  
  return (
    <g className="animation-arrow">
      {/* Curved line */}
      <path 
        d={path} 
        style={arrowStyle}
      />
      
      {/* Arrowhead */}
      <polygon 
        points={`${targetX},${targetY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
        style={arrowHeadStyle}
      />
      
      {/* Direction label */}
      <text
        x={midX}
        y={direction === 'up' ? controlY - 10 : controlY + 15}
        textAnchor="middle"
        fill={active ? '#ff5722' : '#777'}
        fontSize="12"
        fontWeight={active ? 'bold' : 'normal'}
      >
        {direction === 'up' ? 'Heapify Up' : 'Heapify Down'}
      </text>
    </g>
  );
};

export default AnimationArrow;