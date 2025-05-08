/**
 * NodeDetailsPanel.js
 * Component to display detailed information about a selected tree node
 */

import React from 'react';

const NodeDetailsPanel = ({ node, relationships, onClose, isHeap = false, heapType = 'min' }) => {
  if (!node) return null;
  
  const { 
    parent,
    siblings,
    ancestors,
    path,
    height,
    depth,
    isLeaf,
    childCount,
    children,
    isRoot,
    level,
    position
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
            {isHeap 
              ? (isRoot ? 'Root Node' : 
                 (children && children.length === 0) ? 'Leaf Node' : 'Internal Node')
              : (isLeaf ? 'Leaf Node' : 
                 node === relationships?.ancestors?.[0] ? 'Root Node' : 
                 `Internal Node (${childCount} ${childCount === 1 ? 'child' : 'children'})`)}
          </span>
        </div>
        
        {isHeap ? (
          <div className="detail-item">
            <span className="detail-label">Level:</span>
            <span className="detail-value">{level}</span>
          </div>
        ) : (
          <>
            <div className="detail-item">
              <span className="detail-label">Height:</span>
              <span className="detail-value">{height}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Depth:</span>
              <span className="detail-value">{depth}</span>
            </div>
          </>
        )}
        
        {isHeap && (
          <div className="detail-item">
            <span className="detail-label">Array Index:</span>
            <span className="detail-value">{position}</span>
          </div>
        )}
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
            {siblings.map((sibling, index) => (
              <div key={`sibling-${index}`} className="node-chip">{sibling.value}</div>
            ))}
          </div>
        </div>
      )}
      
      {isHeap && children && children.length > 0 ? (
        <div className="detail-section">
          <h4>Children</h4>
          <div className="node-list">
            {children.map((child, index) => (
              <div key={`child-${index}`} className="node-chip">
                {index === 0 ? 'Left: ' : 'Right: '}{child.value}
              </div>
            ))}
          </div>
        </div>
      ) : (!isHeap && (node.left || node.right)) ? (
        <div className="detail-section">
          <h4>Children</h4>
          <div className="node-list">
            {node.left && <div className="node-chip">Left: {node.left.value}</div>}
            {node.right && <div className="node-chip">Right: {node.right.value}</div>}
          </div>
        </div>
      ) : null}
      
      {ancestors && ancestors.length > 0 && !isHeap && (
        <div className="detail-section">
          <h4>Ancestors</h4>
          <div className="node-list">
            {ancestors.map((ancestor, index) => (
              <div key={`ancestor-${index}`} className="node-chip">{ancestor.value}</div>
            ))}
          </div>
        </div>
      )}
      
      {path && path.length > 0 && !isHeap && (
        <div className="detail-section">
          <h4>Path from Root</h4>
          <div className="detail-value">
            {path.map(p => p.value).join(' → ')}
          </div>
        </div>
      )}
      
      {isHeap ? (
        <div className="detail-section">
          <h4>{heapType === 'min' ? 'Min Heap' : 'Max Heap'} Properties</h4>
          <div className="detail-item">
            <span className="detail-label">Position:</span>
            <span className="detail-value">
              {isRoot ? 'Root' : 
                (position % 2 === 1 ? 'Left child of ' : 'Right child of ') + (parent ? parent.value : 'unknown')}
            </span>
          </div>
          {heapType === 'min' ? (
            <>
              <div className="detail-item">
                <span className="detail-label">Parent value:</span>
                <span className="detail-value">{parent ? `${parent.value} ≤ ${node.value}` : 'N/A (root)'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Children values:</span>
                <span className="detail-value">All ≥ {node.value}</span>
              </div>
            </>
          ) : (
            <>
              <div className="detail-item">
                <span className="detail-label">Parent value:</span>
                <span className="detail-value">{parent ? `${parent.value} ≥ ${node.value}` : 'N/A (root)'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Children values:</span>
                <span className="detail-value">All ≤ {node.value}</span>
              </div>
            </>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default NodeDetailsPanel;