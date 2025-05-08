/**
 * HeapInfoPanel.js
 * Information panel component for binary heap visualization
 */

import React from 'react';
import { EDUCATIONAL_CONTENT } from '../constants/educationalContent';

const HeapInfoPanel = ({ heap, message, heapType }) => {
  const content = EDUCATIONAL_CONTENT.heap;
  
  // Generate heap statistics
  const getHeapStats = () => {
    return {
      nodeCount: heap?.nodeCount || 0,
      rootValue: heap?.peek() || 'None',
      heapType: heapType === 'min' ? 'Min Heap' : 'Max Heap',
      height: heap?.root ? Math.floor(Math.log2(heap.nodeCount)) : 0
    };
  };
  
  const stats = getHeapStats();
  
  return (
    <div className="info-panel heap-info">
      <div className="info-header">
        <h2>Heap Information</h2>
      </div>
      
      <div className="operation-message">
        {message}
      </div>
      
      <div className="heap-stats">
        <h3>Heap Statistics</h3>
        <ul>
          <li><strong>Nodes:</strong> {stats.nodeCount}</li>
          <li><strong>Root Value:</strong> {stats.rootValue}</li>
          <li><strong>Type:</strong> {stats.heapType}</li>
          <li><strong>Height:</strong> {stats.height}</li>
        </ul>
      </div>
      
      <div className="educational-content">
        <h3>{heapType === 'min' ? 'Min Heap' : 'Max Heap'}</h3>
        <p>
          {heapType === 'min' 
            ? 'In a min heap, each node is greater than or equal to its parent, with the minimum value at the root.'
            : 'In a max heap, each node is less than or equal to its parent, with the maximum value at the root.'}
        </p>
        
        <h4>{content.operations.insert.title}</h4>
        <p className="operation-description">
          Insert: Add at the end, then bubble up (heapify-up) until heap property is restored.
        </p>
        
        <h4>{content.operations.extractRoot.title}</h4>
        <p className="operation-description">
          Extract Root: Remove root, replace with last element, then bubble down (heapify-down).
        </p>
        
        <h4>Time Complexity</h4>
        <ul className="complexity-list">
          <li><strong>Insert:</strong> O(log n)</li>
          <li><strong>Extract Root:</strong> O(log n)</li>
          <li><strong>Peek Root:</strong> O(1)</li>
          <li><strong>Build Heap:</strong> O(n)</li>
        </ul>
      </div>
      
      <div className="heap-tips">
        <h3>Tips</h3>
        <ul>
          <li>The heap is always a complete binary tree - all levels except possibly the last are full.</li>
          <li>Click on nodes to see their relationships.</li>
          <li>Use Extract Root to remove the {heapType === 'min' ? 'minimum' : 'maximum'} value.</li>
          <li>Heapify builds a heap from an unordered set of values.</li>
        </ul>
      </div>
    </div>
  );
};

export default HeapInfoPanel;