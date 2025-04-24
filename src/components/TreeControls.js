/**
 * TreeControls.js
 * User controls for tree operations
 */

import React, { useState } from 'react';
import AnimationControls from './AnimationControls';

const TreeControls = ({
  onInsert,
  onSearch,
  onDelete,
  onReset,
  onRandomTree,
  onTraversal,
  animationInProgress,
  animationSpeed,
  onAnimationSpeedChange,
  onAnimationToggle,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState('insert');
  const [batchInput, setBatchInput] = useState('');
  const [error, setError] = useState(null);
  
  // Handle form submission for tree operations
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (operation !== 'reset' && operation !== 'random' && !inputValue) {
      setError('Please enter a value');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Convert input to number if needed
    const numValue = parseInt(inputValue, 10);
    
    // Validate number conversion
    if (operation !== 'reset' && operation !== 'random' && (isNaN(numValue) || numValue < 0 || numValue > 999)) {
      setError('Please enter a valid number (0-999)');
      return;
    }
    
    // Execute selected operation
    switch (operation) {
      case 'insert':
        onInsert(numValue);
        break;
      case 'search':
        onSearch(numValue);
        break;
      case 'delete':
        onDelete(numValue);
        break;
      case 'reset':
        onReset();
        break;
      case 'random':
        onRandomTree();
        break;
      default:
        break;
    }
    
    // Clear input on successful operation
    if (operation !== 'reset' && operation !== 'random') {
      setInputValue('');
    }
  };
  
  // Handle batch insertion
  const handleBatchInsert = (e) => {
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
    
    // Clear error and insert all values
    setError(null);
    
    // Insert the values one by one
    for (const num of numbers) {
      onInsert(num, false); // Don't animate individual inserts in batch mode
    }
    
    // Clear batch input
    setBatchInput('');
  };
  
  // Handle traversal selection
  const handleTraversalChange = (e) => {
    const traversalType = e.target.value;
    onTraversal(traversalType);
  };
  
  return (
    <div className="tree-controls">
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
            <option value="search">Search</option>
            <option value="delete">Delete</option>
            <option value="reset">Reset Tree</option>
            <option value="random">Random Tree</option>
          </select>
          
          {operation !== 'reset' && operation !== 'random' && (
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
              operation === 'search' ? 'Search' : 
              operation === 'delete' ? 'Delete' : 
              operation === 'reset' ? 'Reset' : 'Generate'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
      </form>
      
      {/* Batch insertion controls */}
      <form onSubmit={handleBatchInsert} className="batch-form">
        <div className="control-group">
          <input
            type="text"
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="Batch insert (comma-separated)"
            disabled={animationInProgress}
            className="batch-input"
          />
          
          <button 
            type="submit" 
            disabled={animationInProgress}
            className="batch-button"
          >
            Batch Insert
          </button>
        </div>
      </form>
      
      {/* Traversal controls */}
      <div className="traversal-controls">
        <label htmlFor="traversal-select">Traversal Type:</label>
        <select
          id="traversal-select"
          onChange={handleTraversalChange}
          disabled={animationInProgress}
          className="traversal-select"
          defaultValue="inorder"
        >
          <option value="inorder">In-order</option>
          <option value="preorder">Pre-order</option>
          <option value="postorder">Post-order</option>
          <option value="levelorder">Level-order</option>
        </select>
      </div>
      
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

export default TreeControls;