/**
 * InfoPanel.js
 * Educational information display about BST operations
 */

import React from 'react';
import { EDUCATIONAL_CONTENT } from '../constants/educationalContent';
import { getOperationComplexity } from '../utils/treeOperations';

const InfoPanel = ({
  currentOperation,
  operationMessage,
  treeStats,
  currentStep,
  totalSteps,
}) => {
  // Get the relevant educational content based on current operation
  const getOperationContent = () => {
    switch (currentOperation) {
      case 'insert':
        return EDUCATIONAL_CONTENT.operations.insert;
      case 'search':
        return EDUCATIONAL_CONTENT.operations.search;
      case 'delete':
        return EDUCATIONAL_CONTENT.operations.delete;
      case 'traversal':
        return EDUCATIONAL_CONTENT.operations.traversal;
      default:
        return EDUCATIONAL_CONTENT.introduction;
    }
  };
  
  // Get time complexity info
  const getComplexityInfo = () => {
    if (!currentOperation || currentOperation === 'intro') {
      return EDUCATIONAL_CONTENT.timeComplexity;
    }
    
    return getOperationComplexity(currentOperation);
  };
  
  const operationContent = getOperationContent();
  const complexityInfo = getComplexityInfo();
  
  return (
    <div className="info-panel">
      {/* Operation Header */}
      <div className="info-header">
        <h2>{operationContent.title}</h2>
        {currentStep !== undefined && totalSteps > 0 && (
          <div className="step-counter">
            Step {currentStep + 1} of {totalSteps}
          </div>
        )}
      </div>
      
      {/* Current operation message */}
      {operationMessage && (
        <div className="operation-message">
          <strong>Current Action:</strong> {operationMessage}
        </div>
      )}
      
      {/* Tree Statistics */}
      {treeStats && (
        <div className="tree-stats">
          <h3>Tree Statistics</h3>
          <ul>
            <li><strong>Nodes:</strong> {treeStats.nodeCount}</li>
            <li><strong>Height:</strong> {treeStats.height}</li>
            <li>
              <strong>Balanced:</strong> {treeStats.isBalanced ? 'Yes' : 'No'}
              {!treeStats.isBalanced && (
                <span className="stat-note"> (affects performance)</span>
              )}
            </li>
            {treeStats.minValue !== null && (
              <li><strong>Min Value:</strong> {treeStats.minValue}</li>
            )}
            {treeStats.maxValue !== null && (
              <li><strong>Max Value:</strong> {treeStats.maxValue}</li>
            )}
          </ul>
        </div>
      )}
      
      {/* Educational Content */}
      <div className="educational-content">
        <div className="operation-description">
          {operationContent.content}
        </div>
        
        {/* Time complexity information */}
        <div className="complexity-info">
          <h3>Time Complexity</h3>
          <ul>
            <li><strong>Average:</strong> {complexityInfo.average}</li>
            <li><strong>Worst:</strong> {complexityInfo.worst}</li>
            <li><strong>Best:</strong> {complexityInfo.best}</li>
          </ul>
          <p className="complexity-description">{complexityInfo.description}</p>
        </div>
        
        {/* Learning tips */}
        <div className="learning-tips">
          <h3>Learning Tip</h3>
          <p>{EDUCATIONAL_CONTENT.tips[Math.floor(Math.random() * EDUCATIONAL_CONTENT.tips.length)]}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;