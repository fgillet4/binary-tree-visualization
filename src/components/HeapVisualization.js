/**
 * HeapVisualization.js
 * Main component for Binary Heap visualization
 */

import React, { useState, useEffect } from 'react';
import TreeVisualization from './TreeVisualization';
import HeapControls from './HeapControls';
import HeapInfoPanel from './HeapInfoPanel';
import NodeDetailsPanel from './NodeDetailsPanel';
import AnimationArrow from './AnimationArrow';
import BinaryHeap from '../models/BinaryHeap';

const HeapVisualization = () => {
  // State for the binary heap
  const [heap, setHeap] = useState(new BinaryHeap('min'));
  const [message, setMessage] = useState('Welcome! Add values to build a heap.');
  const [heapVersion, setHeapVersion] = useState(0);
  const [heapType, setHeapType] = useState('min');
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeRelationships, setNodeRelationships] = useState(null);
  
  // Animation state
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // Slower default speed
  const [animationPaused, setAnimationPaused] = useState(false);
  const [currentSwap, setCurrentSwap] = useState(null); // For tracking current swap animation
  const [swapDirection, setSwapDirection] = useState(null); // 'up' or 'down'
  
  // Calculate positions whenever the heap changes
  useEffect(() => {
    if (heap) {
      heap.calculatePositions();
    }
  }, [heap, heapVersion]);
  
  // Insert a value into the heap
  const handleInsert = (value, animate = true) => {
    if (isNaN(parseInt(value))) {
      setMessage(`Please enter a valid number.`);
      return;
    }
    
    try {
      const numValue = parseInt(value);
      
      // Insert the value
      const result = heap.insert(numValue, animate);
      setMessage(`Inserted ${numValue} into the ${heapType} heap.`);
      
      if (animate) {
        // Animate the insertion
        playAnimation(result.animations);
      } else {
        // Force re-render
        setHeapVersion(v => v + 1);
      }
      
      // Clear selected node if any
      setSelectedNode(null);
      setNodeRelationships(null);
    } catch (error) {
      console.error("Error inserting value:", error);
      setMessage(`Error inserting value: ${error.message}`);
    }
  };
  
  // Extract the root value from the heap
  const handleExtract = (animate = true) => {
    try {
      // Check if heap is empty
      if (heap.nodeCount === 0) {
        setMessage(`The heap is empty. Nothing to extract.`);
        return;
      }
      
      // Extract the root
      const result = heap.extractRoot(animate);
      
      if (result.value !== null) {
        setMessage(`Extracted ${result.value} from the ${heapType} heap.`);
        
        if (animate) {
          // Animate the extraction
          playAnimation(result.animations);
        } else {
          // Force re-render
          setHeapVersion(v => v + 1);
        }
        
        // Clear selected node if any
        setSelectedNode(null);
        setNodeRelationships(null);
      }
    } catch (error) {
      console.error("Error extracting root:", error);
      setMessage(`Error extracting root: ${error.message}`);
    }
  };
  
  // Heapify an array of values
  const handleHeapify = (values, type, animate = true) => {
    try {
      // Create a new heap with the values
      const newHeap = BinaryHeap.heapify(values, type, animate);
      
      setHeap(newHeap);
      setMessage(`Created a ${type} heap from ${values.length} values.`);
      
      if (animate) {
        // Animate the heapify process
        playAnimation(newHeap.animationHistory);
      } else {
        // Force re-render
        setHeapVersion(v => v + 1);
      }
      
      // Clear selected node if any
      setSelectedNode(null);
      setNodeRelationships(null);
    } catch (error) {
      console.error("Error heapifying values:", error);
      setMessage(`Error heapifying values: ${error.message}`);
    }
  };
  
  // Change the heap type (min or max)
  const handleHeapTypeChange = (type) => {
    setHeapType(type);
    
    // Create a new heap of the selected type with the same values
    const values = heap.toArray();
    if (values.length > 0) {
      const newHeap = BinaryHeap.heapify(values, type, false);
      setHeap(newHeap);
      setMessage(`Converted to a ${type} heap.`);
      setHeapVersion(v => v + 1);
    }
    
    // Clear selected node if any
    setSelectedNode(null);
    setNodeRelationships(null);
  };
  
  // Reset the heap
  const handleReset = () => {
    setHeap(new BinaryHeap(heapType));
    setMessage('Heap has been reset.');
    setSelectedNode(null);
    setNodeRelationships(null);
    setHeapVersion(v => v + 1);
  };
  
  // Generate a random heap
  const handleRandomHeap = (type = heapType) => {
    try {
      const randomHeap = BinaryHeap.createRandomHeap(7, 1, 100, type);
      setHeap(randomHeap);
      setMessage(`Generated a random ${type} heap.`);
      setSelectedNode(null);
      setNodeRelationships(null);
      setHeapVersion(v => v + 1);
    } catch (error) {
      console.error("Error generating random heap:", error);
      setMessage(`Error generating random heap: ${error.message}`);
    }
  };
  
  // Play animation sequence for heap operations
  const playAnimation = (animations) => {
    if (!animations || animations.length === 0) return;
    
    setAnimationInProgress(true);
    setAnimationPaused(false);
    
    // Reset all highlights and clear any existing arrows
    heap.resetHighlights();
    setCurrentSwap(null);
    setSwapDirection(null);
    
    let step = 0;
    let animationTimer = null;
    
    const applyAnimation = () => {
      // If paused, wait and check again
      if (animationPaused) {
        animationTimer = setTimeout(applyAnimation, 100);
        return;
      }
      
      const animation = animations[step];
      
      // Skip if animation is undefined
      if (!animation) {
        step++;
        if (step < animations.length) {
          animationTimer = setTimeout(applyAnimation, animationSpeed);
        } else {
          // End of animation
          finishAnimation();
        }
        return;
      }
      
      // Update message based on animation step
      setMessage(animation.message || 'Performing operation...');
      
      // Clear previous swap before starting a new one
      if (animation.type !== 'swap' || animation.step === 'beforeSwap') {
        setCurrentSwap(null);
      }
      
      // Set swap direction based on animation type
      if (animation.type === 'heapifyUp' || 
          (animation.type === 'swap' && animations[step-1]?.type === 'heapifyUp')) {
        setSwapDirection('up');
      } else if (animation.type === 'heapifyDown' || 
                (animation.type === 'swap' && animations[step-1]?.type === 'heapifyDown')) {
        setSwapDirection('down');
      }
      
      // Apply different highlight effects based on animation type
      switch (animation.type) {
        case 'insert':
          highlightInsertStep(animation);
          break;
        case 'heapifyUp':
          highlightHeapifyUpStep(animation);
          break;
        case 'extract':
          highlightExtractStep(animation);
          break;
        case 'heapifyDown':
          highlightHeapifyDownStep(animation);
          break;
        case 'swap':
          highlightSwapStep(animation);
          // Track the current swap for drawing arrows
          if (animation.indices && animation.indices.length === 2) {
            setCurrentSwap({
              index1: animation.indices[0],
              index2: animation.indices[1],
              active: animation.step === 'beforeSwap' || animation.step === 'afterSwap'
            });
          }
          break;
        case 'heapify':
          highlightHeapifyStep(animation);
          break;
        default:
          break;
      }
      
      // Force re-render
      setHeapVersion(v => v + 1);
      
      // Move to next step
      step++;
      if (step < animations.length) {
        animationTimer = setTimeout(applyAnimation, animationSpeed);
      } else {
        // End of animation
        finishAnimation();
      }
    };
    
    const finishAnimation = () => {
      // Clear any pending timeouts
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
      
      // Reset highlights and swap state
      setTimeout(() => {
        heap.resetHighlights();
        setCurrentSwap(null);
        setSwapDirection(null);
        setHeapVersion(v => v + 1);
        setAnimationInProgress(false);
      }, animationSpeed);
    };
    
    // Start animation
    applyAnimation();
    
    // Cleanup function to handle component unmounting during animation
    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  };
  
  // Animation helper functions
  const highlightInsertStep = (animation) => {
    if (!animation || !animation.index) return;
    
    const node = heap.treeNodes[animation.index];
    if (!node) return;
    
    switch (animation.step) {
      case 'add':
        node.highlightState = 'inserting';
        break;
      case 'complete':
        node.highlightState = 'found';
        break;
      default:
        node.highlightState = 'highlight';
    }
  };
  
  const highlightHeapifyUpStep = (animation) => {
    if (!animation) return;
    
    // Current node being heapified
    const currentNode = heap.treeNodes[animation.index];
    if (currentNode) {
      currentNode.highlightState = 'highlight';
    }
    
    // Parent node for comparison
    if (animation.parentIndex !== undefined) {
      const parentNode = heap.treeNodes[animation.parentIndex];
      if (parentNode) {
        parentNode.highlightState = animation.step === 'compare' ? 'searching' : 'highlight';
      }
    }
    
    if (animation.step === 'complete' && currentNode) {
      currentNode.highlightState = 'found';
    }
  };
  
  const highlightExtractStep = (animation) => {
    if (!animation) return;
    
    if (animation.step === 'extractRoot' && animation.index !== undefined) {
      const rootNode = heap.treeNodes[animation.index];
      if (rootNode) {
        rootNode.highlightState = 'deleting';
      }
    }
    
    if (animation.step === 'replaceRoot' && animation.index !== undefined) {
      const rootNode = heap.treeNodes[animation.index];
      if (rootNode) {
        rootNode.highlightState = 'inserting';
      }
    }
  };
  
  const highlightHeapifyDownStep = (animation) => {
    if (!animation) return;
    
    // Current node being heapified
    const currentNode = heap.treeNodes[animation.index];
    if (currentNode) {
      currentNode.highlightState = 'highlight';
    }
    
    // Left child for comparison
    if (animation.leftChildIndex !== undefined) {
      const leftChild = heap.treeNodes[animation.leftChildIndex];
      if (leftChild) {
        leftChild.highlightState = 'searching';
      }
    }
    
    // Right child for comparison
    if (animation.rightChildIndex !== undefined) {
      const rightChild = heap.treeNodes[animation.rightChildIndex];
      if (rightChild) {
        rightChild.highlightState = 'searching';
      }
    }
    
    // Selected child for swapping
    if (animation.step === 'selectChild' && animation.compareChildIndex !== undefined) {
      const compareChild = heap.treeNodes[animation.compareChildIndex];
      if (compareChild) {
        compareChild.highlightState = 'found';
      }
    }
    
    if (animation.step === 'complete' && currentNode) {
      currentNode.highlightState = 'found';
    }
  };
  
  const highlightSwapStep = (animation) => {
    if (!animation || !animation.indices) return;
    
    const [index1, index2] = animation.indices;
    const node1 = heap.treeNodes[index1];
    const node2 = heap.treeNodes[index2];
    
    if (node1) {
      node1.highlightState = animation.step === 'beforeSwap' ? 'deleting' : 'inserting';
    }
    
    if (node2) {
      node2.highlightState = animation.step === 'beforeSwap' ? 'deleting' : 'inserting';
    }
  };
  
  const highlightHeapifyStep = (animation) => {
    if (!animation) return;
    
    if (animation.index !== undefined) {
      const node = heap.treeNodes[animation.index];
      if (node) {
        switch (animation.step) {
          case 'startHeapify':
          case 'heapifyNode':
            node.highlightState = 'highlight';
            break;
          case 'complete':
            node.highlightState = 'found';
            break;
          default:
            node.highlightState = 'normal';
        }
      }
    }
  };
  
  // Handle animation speed change
  const handleAnimationSpeedChange = (speed) => {
    setAnimationSpeed(speed);
  };
  
  // Handle animation pause/resume
  const handleAnimationToggle = () => {
    setAnimationPaused(!animationPaused);
  };
  
  // Handle node click for detailed information
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    
    // Calculate relationships in the heap
    const relationships = calculateNodeRelationships(heap, node);
    setNodeRelationships(relationships);
    
    setMessage(`Selected node: ${node.value}`);
    
    // Highlight the selected node
    heap.resetHighlights();
    node.highlightState = 'found';
    setHeapVersion(v => v + 1);
  };
  
  // Close node details panel
  const handleCloseNodeDetails = () => {
    setSelectedNode(null);
    setNodeRelationships(null);
    
    // Reset all highlights
    heap.resetHighlights();
    setHeapVersion(v => v + 1);
  };
  
  // Calculate node relationships in the heap
  const calculateNodeRelationships = (heap, node) => {
    if (!heap || !node) return null;
    
    // Find node's index in the heap array
    let nodeIndex = -1;
    for (const [index, treeNode] of Object.entries(heap.treeNodes)) {
      if (treeNode === node) {
        nodeIndex = parseInt(index);
        break;
      }
    }
    
    if (nodeIndex === -1) return null;
    
    // Get parent, siblings, children
    const parentIndex = heap.getParentIndex(nodeIndex);
    const leftChildIndex = heap.getLeftChildIndex(nodeIndex);
    const rightChildIndex = heap.getRightChildIndex(nodeIndex);
    
    const relationships = {
      parent: heap.treeNodes[parentIndex] || null,
      siblings: [],
      children: [],
      isRoot: nodeIndex === 0,
      level: Math.floor(Math.log2(nodeIndex + 1)),
      position: nodeIndex
    };
    
    // Find siblings (nodes with the same parent)
    if (parentIndex >= 0) {
      // Get sibling index (if this is left child, sibling is right child and vice versa)
      const siblingIndex = nodeIndex % 2 === 1 
        ? parentIndex * 2 + 2  // This is left child, sibling is right child
        : parentIndex * 2 + 1; // This is right child, sibling is left child
      
      if (heap.treeNodes[siblingIndex]) {
        relationships.siblings.push(heap.treeNodes[siblingIndex]);
      }
    }
    
    // Find children
    if (heap.treeNodes[leftChildIndex]) {
      relationships.children.push(heap.treeNodes[leftChildIndex]);
    }
    
    if (heap.treeNodes[rightChildIndex]) {
      relationships.children.push(heap.treeNodes[rightChildIndex]);
    }
    
    return relationships;
  };
  
  // Render animation arrows for swaps
  const renderAnimationArrows = () => {
    if (!currentSwap || !heap) return null;
    
    const { index1, index2, active } = currentSwap;
    const node1 = heap.treeNodes[index1];
    const node2 = heap.treeNodes[index2];
    
    if (!node1 || !node2) return null;
    
    // Direction is important for the arrow curvature and labels
    const direction = swapDirection || 'up';
    
    return (
      <g className="animation-arrows">
        <AnimationArrow 
          sourceX={node1.x}
          sourceY={node1.y}
          targetX={node2.x}
          targetY={node2.y}
          active={active}
          direction={direction}
        />
        <AnimationArrow 
          sourceX={node2.x}
          sourceY={node2.y}
          targetX={node1.x}
          targetY={node1.y}
          active={active}
          direction={direction}
        />
      </g>
    );
  };
  
  return (
    <div className="heap-visualization-app">
      <header className="app-header">
        <h1>Binary Heap Visualization</h1>
        <p className="app-description">
          An educational tool to visualize binary heap operations
        </p>
      </header>
      
      <div className="main-content">
        <div className="left-panel">
          <div className="controls-panel">
            <h2>Heap Operations</h2>
            <HeapControls
              onInsert={handleInsert}
              onExtract={handleExtract}
              onHeapify={handleHeapify}
              onReset={handleReset}
              onRandomHeap={handleRandomHeap}
              onHeapTypeChange={handleHeapTypeChange}
              animationInProgress={animationInProgress}
              animationSpeed={animationSpeed}
              onAnimationSpeedChange={handleAnimationSpeedChange}
              onAnimationToggle={handleAnimationToggle}
            />
          </div>
          
          <HeapInfoPanel
            heap={heap}
            message={message}
            heapType={heapType}
          />
        </div>
        
        <div className="right-panel">
          <div className="visualization-container">
            <div className="tree-visualization-container">
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'visible',
                }}
              >
                <svg 
                  width="100%"
                  height="100%"
                  className="tree-visualization"
                  style={{
                    overflow: 'visible',
                  }}
                >
                  {renderAnimationArrows()}
                </svg>
              </div>
              
              <TreeVisualization
                tree={heap}
                animationInProgress={animationInProgress}
                onNodeClick={handleNodeClick}
                key={heapVersion}
              />
            </div>
            
            {selectedNode && nodeRelationships && (
              <NodeDetailsPanel
                node={selectedNode}
                relationships={nodeRelationships}
                onClose={handleCloseNodeDetails}
                isHeap={true}
                heapType={heapType}
              />
            )}
            
            {animationInProgress && (
              <div className="animation-status">
                <div className={`animation-indicator ${animationPaused ? 'paused' : 'playing'}`}>
                  {animationPaused ? 'Paused' : 'Playing'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="app-footer">
        <p>
          Binary Heap Visualization - Educational Tool
        </p>
      </footer>
    </div>
  );
};

export default HeapVisualization;