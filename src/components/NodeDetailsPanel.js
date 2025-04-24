/**
 * NodeDetailsPanel.js
 * Component to display detailed information about a selected tree node
 */

import React from 'react';

const NodeDetailsPanel = ({ node, relationships, onClose }) => {
  if (!node) return null;
  
  const { 
    parent,
    siblings,
    ancestors,
    path,
    height,
    depth,
    isLeaf,
    childCount
  } = relationships || {};
  
  return (
    <div className={`node-details-panel visible`}>
      <button className="close-button" onClick={onClose}>&times;</button>
      <h3>Node Details: {node.value}</h3>
      
      <div className="detail-section">
        <div className="detail-item">
          <span className="detail-label">Value:</span>
          <span className="detail-value">{node.value}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Type:</span>
          <span className="detail-value">
            {isLeaf ? 'Leaf Node' : 
             node === relationships?.ancestors[0] ? 'Root Node' : 
             `Internal Node (${childCount} ${childCount === 1 ? 'child' : 'children'})`}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Height:</span>
          <span className="detail-value">{height}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Depth:</span>
          <span className="detail-value">{depth}</span>
        </div>
      </div>
      
      {parent && (
        <div className="detail-section">
          <h4>Parent Node</h4>
          <div className="node-list">
            <div className="node-chip">{parent.value}</div>
          </div>
        </div>
      )}
      
      {siblings && siblings.length > 0 && (
        <div className="detail-section">
          <h4>Siblings</h4>
          <div className="node-list">
            {siblings.map(sibling => (
              <div key={sibling.value} className="node-chip">{sibling.value}</div>
            ))}
          </div>
        </div>
      )}
      
      {node.left || node.right ? (
        <div className="detail-section">
          <h4>Children</h4>
          <div className="node-list">
            {node.left && <div className="node-chip">Left: {node.left.value}</div>}
            {node.right && <div className="node-chip">Right: {node.right.value}</div>}
          </div>
        </div>
      ) : null}
      
      {ancestors && ancestors.length > 0 && (
        <div className="detail-section">
          <h4>Ancestors</h4>
          <div className="node-list">
            {ancestors.map(ancestor => (
              <div key={ancestor.value} className="node-chip">{ancestor.value}</div>
            ))}
          </div>
        </div>
      )}
      
      {path && path.length > 0 && (
        <div className="detail-section">
          <h4>Path from Root</h4>
          <div className="detail-value">
            {path.map(p => p.value).join(' → ')}
          </div>
        </div>
      )}
      
      <div className="detail-section">
        <h4>Binary Search Tree Properties</h4>
        <div className="detail-item">
          <span className="detail-label">Position:</span>
          <span className="detail-value">
            {parent ? 
              (parent.left === node ? 'Left child of ' + parent.value : 
               'Right child of ' + parent.value) : 
              'Root'}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">All left descendants:</span>
          <span className="detail-value">&lt; {node.value}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">All right descendants:</span>
          <span className="detail-value">&ge; {node.value}</span>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsPanel;