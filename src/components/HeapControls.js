/**
 * HeapControls.js
 * User controls specific to binary heap operations
 */

import React, { useState } from 'react';
import AnimationControls from './AnimationControls';

const HeapControls = ({
  onInsert,
  onExtract,
  onHeapify,
  onReset,
  onRandomHeap,
  onHeapTypeChange,
  animationInProgress,
  animationSpeed,
  onAnimationSpeedChange,
  onAnimationToggle,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState('insert');
  const [batchInput, setBatchInput] = useState('');
  const [heapType, setHeapType] = useState('min');
  const [error, setError] = useState(null);
  
  // Handle form submission for heap operations
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input for operations that need a value
    if (operation === 'insert' && !inputValue) {
      setError('Please enter a value');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Handle different operations
    switch (operation) {
      case 'insert':
        const numValue = parseInt(inputValue, 10);
        if (isNaN(numValue) || numValue < 0 || numValue > 999) {
          setError('Please enter a valid number (0-999)');
          return;
        }
        onInsert(numValue);
        setInputValue('');
        break;
      case 'extract':
        onExtract();
        break;
      case 'reset':
        onReset();
        break;
      case 'random':
        onRandomHeap(heapType);
        break;
      default:
        break;
    }
  };
  
  // Handle batch heapify
  const handleHeapify = (e) => {
    e.preventDefault();
    
    if (!batchInput.trim()) {
      setError('Please enter comma-separated values');
      return;
    }
    
    // Parse batch input
    const values = batchInput.split(',').map(val => val.trim());
    const numbers = [];
    
    // Validate all values are valid numbers
    for (const val of values) {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0 || num > 999) {
        setError(`Invalid value: ${val}. Please use numbers 0-999.`);
        return;
      }
      numbers.push(num);
    }
    
    // Clear error and heapify all values
    setError(null);
    onHeapify(numbers, heapType);
    
    // Clear batch input
    setBatchInput('');
  };
  
  // Handle heap type change
  const handleHeapTypeChange = (e) => {
    const newType = e.target.value;
    setHeapType(newType);
    onHeapTypeChange(newType);
  };
  
  return (
    <div className="heap-controls">
      <div className="heap-type-selector">
        <label htmlFor="heap-type">Heap Type:</label>
        <select
          id="heap-type"
          value={heapType}
          onChange={handleHeapTypeChange}
          disabled={animationInProgress}
          className="heap-type-select"
        >
          <option value="min">Min Heap</option>
          <option value="max">Max Heap</option>
        </select>
      </div>
      
      {/* Main operation controls */}
      <form onSubmit={handleSubmit} className="operation-form">
        <div className="control-group">
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            disabled={animationInProgress}
            className="operation-select"
          >
            <option value="insert">Insert</option>
            <option value="extract">Extract Root</option>
            <option value="reset">Reset Heap</option>
            <option value="random">Random Heap</option>
          </select>
          
          {operation === 'insert' && (
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value (0-999)"
              min="0"
              max="999"
              disabled={animationInProgress}
              className="value-input"
            />
          )}
          
          <button 
            type="submit" 
            disabled={animationInProgress}
            className="operation-button"
          >
            {operation === 'insert' ? 'Insert' : 
              operation === 'extract' ? 'Extract' : 
              operation === 'reset' ? 'Reset' : 'Generate'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
      </form>
      
      {/* Batch heapify controls */}
      <form onSubmit={handleHeapify} className="batch-form">
        <div className="control-group">
          <input
            type="text"
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="Heapify values (comma-separated)"
            disabled={animationInProgress}
            className="batch-input"
          />
          
          <button 
            type="submit" 
            disabled={animationInProgress}
            className="batch-button"
          >
            Heapify
          </button>
        </div>
      </form>
      
      {/* Animation controls */}
      <AnimationControls
        animationInProgress={animationInProgress}
        animationSpeed={animationSpeed}
        onAnimationSpeedChange={onAnimationSpeedChange}
        onAnimationToggle={onAnimationToggle}
      />
    </div>
  );
};

export default HeapControls;