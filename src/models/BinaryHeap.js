/**
 * BinaryHeap.js
 * Implementation of a binary heap data structure (Min Heap by default)
 */

import TreeNode from './TreeNode';

class BinaryHeap {
  /**
   * Create a new binary heap
   * @param {string} type - The type of heap ('min' or 'max')
   */
  constructor(type = 'min') {
    this.heap = [];
    this.heapType = type; // 'min' or 'max'
    this.animationHistory = [];
    this.nodeCount = 0;
    this.treeNodes = {}; // Map numeric indices to TreeNode objects for visualization
  }

  /**
   * Get the index of the parent node
   * @param {number} index - The index of the current node
   * @returns {number} The parent index or -1 if no parent
   */
  getParentIndex(index) {
    if (index <= 0) return -1;
    return Math.floor((index - 1) / 2);
  }

  /**
   * Get the index of the left child
   * @param {number} index - The index of the current node
   * @returns {number} The left child index
   */
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  /**
   * Get the index of the right child
   * @param {number} index - The index of the current node
   * @returns {number} The right child index
   */
  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  /**
   * Check if node at index has a parent
   * @param {number} index - The index to check
   * @returns {boolean} True if the node has a parent
   */
  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }

  /**
   * Check if node at index has a left child
   * @param {number} index - The index to check
   * @returns {boolean} True if the node has a left child
   */
  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }

  /**
   * Check if node at index has a right child
   * @param {number} index - The index to check
   * @returns {boolean} True if the node has a right child
   */
  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.heap.length;
  }

  /**
   * Get the parent value
   * @param {number} index - The index of the current node
   * @returns {number} The parent value
   */
  parent(index) {
    return this.heap[this.getParentIndex(index)];
  }

  /**
   * Get the left child value
   * @param {number} index - The index of the current node
   * @returns {number} The left child value
   */
  leftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }

  /**
   * Get the right child value
   * @param {number} index - The index of the current node
   * @returns {number} The right child value
   */
  rightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }

  /**
   * Compare two values according to heap type
   * @param {number} a - First value
   * @param {number} b - Second value
   * @returns {boolean} True if a should be higher in the heap than b
   */
  shouldSwap(a, b) {
    if (this.heapType === 'min') {
      return a > b; // In min heap, smaller values go up
    } else {
      return a < b; // In max heap, larger values go up
    }
  }

  /**
   * Swap two elements in the heap
   * @param {number} i - First index
   * @param {number} j - Second index
   * @param {boolean} animate - Whether to record animation step
   */
  swap(i, j, animate = false) {
    if (animate) {
      this.animationHistory.push({
        type: 'swap',
        indices: [i, j],
        values: [this.heap[i], this.heap[j]],
        step: 'beforeSwap',
        message: `Swapping ${this.heap[i]} and ${this.heap[j]}`
      });
    }
    
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;

    // Also update TreeNode references for visualization
    const iNodeRef = this.treeNodes[i];
    const jNodeRef = this.treeNodes[j];
    
    if (iNodeRef && jNodeRef) {
      // Swap the values in the visual nodes
      const tempValue = iNodeRef.value;
      iNodeRef.value = jNodeRef.value;
      jNodeRef.value = tempValue;
      
      // Update the map
      this.treeNodes[i] = jNodeRef;
      this.treeNodes[j] = iNodeRef;
    }
    
    if (animate) {
      this.animationHistory.push({
        type: 'swap',
        indices: [i, j],
        values: [this.heap[i], this.heap[j]],
        step: 'afterSwap',
        message: `Swapped ${this.heap[j]} and ${this.heap[i]}`
      });
    }
  }

  /**
   * Insert a value into the heap
   * @param {number} value - The value to insert
   * @param {boolean} animate - Whether to record animation steps
   * @returns {Object} The heap instance and animation history
   */
  insert(value, animate = false) {
    if (animate) this.animationHistory = [];
    
    // Add the element at the end of the heap array
    this.heap.push(value);
    const currentIndex = this.heap.length - 1;
    this.nodeCount++;
    
    // Create a tree node for visualization
    this.treeNodes[currentIndex] = new TreeNode(value);
    
    if (animate) {
      this.animationHistory.push({
        type: 'insert',
        index: currentIndex,
        value,
        step: 'add',
        message: `Added ${value} to the heap`
      });
    }
    
    // Heapify up - move the element to its correct position
    this.heapifyUp(currentIndex, animate);
    
    // Update tree structure for visualization
    this.updateTreeStructure();
    
    return { heap: this, animations: this.animationHistory };
  }

  /**
   * Restore heap property by moving an element up
   * @param {number} index - The index to start heapifying up from
   * @param {boolean} animate - Whether to record animation steps
   */
  heapifyUp(index, animate = false) {
    let currentIndex = index;
    
    while (this.hasParent(currentIndex) && 
           this.shouldSwap(this.parent(currentIndex), this.heap[currentIndex])) {
      
      const parentIndex = this.getParentIndex(currentIndex);
      
      if (animate) {
        this.animationHistory.push({
          type: 'heapifyUp',
          index: currentIndex,
          parentIndex,
          step: 'compare',
          message: `Comparing ${this.heap[currentIndex]} with parent ${this.parent(currentIndex)}`
        });
      }
      
      this.swap(parentIndex, currentIndex, animate);
      currentIndex = parentIndex;
    }
    
    if (animate && index !== currentIndex) {
      this.animationHistory.push({
        type: 'heapifyUp',
        index: currentIndex,
        step: 'complete',
        message: `Element ${this.heap[currentIndex]} is now in the correct position`
      });
    }
  }

  /**
   * Extract the root element from the heap (min or max value)
   * @param {boolean} animate - Whether to record animation steps
   * @returns {Object} The extracted value and animation history
   */
  extractRoot(animate = false) {
    if (animate) this.animationHistory = [];
    
    if (this.heap.length === 0) {
      if (animate) {
        this.animationHistory.push({
          type: 'extract',
          step: 'empty',
          message: 'Heap is empty, nothing to extract'
        });
      }
      return { value: null, animations: this.animationHistory };
    }
    
    const rootValue = this.heap[0];
    
    if (animate) {
      this.animationHistory.push({
        type: 'extract',
        index: 0,
        value: rootValue,
        step: 'extractRoot',
        message: `Extracting root value ${rootValue}`
      });
    }
    
    // If only one element, just remove it
    if (this.heap.length === 1) {
      this.heap.pop();
      this.treeNodes = {};
      this.nodeCount--;
      
      if (animate) {
        this.animationHistory.push({
          type: 'extract',
          step: 'complete',
          message: `Removed the only element ${rootValue}`
        });
      }
      
      return { value: rootValue, animations: this.animationHistory };
    }
    
    // Replace root with the last element
    const lastElement = this.heap.pop();
    this.heap[0] = lastElement;
    this.nodeCount--;
    
    // Update tree node for root
    if (this.treeNodes[0]) {
      this.treeNodes[0].value = lastElement;
    }
    
    // Remove last tree node reference
    delete this.treeNodes[this.heap.length];
    
    if (animate) {
      this.animationHistory.push({
        type: 'extract',
        index: 0,
        value: lastElement,
        step: 'replaceRoot',
        message: `Replaced root with last element ${lastElement}`
      });
    }
    
    // Restore heap property
    this.heapifyDown(0, animate);
    
    // Update tree structure for visualization
    this.updateTreeStructure();
    
    return { value: rootValue, animations: this.animationHistory };
  }

  /**
   * Restore heap property by moving an element down
   * @param {number} index - The index to start heapifying down from
   * @param {boolean} animate - Whether to record animation steps
   */
  heapifyDown(index, animate = false) {
    let currentIndex = index;
    let nextIndex = null;
    
    // Continue until we reach a leaf node
    while (this.hasLeftChild(currentIndex)) {
      // Find the child to swap with (smaller for min heap, larger for max heap)
      let compareChildIndex = this.getLeftChildIndex(currentIndex);
      
      if (animate) {
        this.animationHistory.push({
          type: 'heapifyDown',
          index: currentIndex,
          leftChildIndex: compareChildIndex,
          step: 'compareLeft',
          message: `Comparing with left child ${this.heap[compareChildIndex]}`
        });
      }
      
      // If there's a right child and it should be compared instead
      if (this.hasRightChild(currentIndex)) {
        const rightChildIndex = this.getRightChildIndex(currentIndex);
        
        if (animate) {
          this.animationHistory.push({
            type: 'heapifyDown',
            index: currentIndex,
            rightChildIndex,
            step: 'compareRight',
            message: `Comparing with right child ${this.heap[rightChildIndex]}`
          });
        }
        
        // Determine which child to compare with based on heap type
        if (this.shouldSwap(this.heap[compareChildIndex], this.heap[rightChildIndex])) {
          compareChildIndex = rightChildIndex;
          
          if (animate) {
            this.animationHistory.push({
              type: 'heapifyDown',
              index: currentIndex,
              compareChildIndex,
              step: 'selectChild',
              message: `Selected right child ${this.heap[compareChildIndex]} for comparison`
            });
          }
        } else if (animate) {
          this.animationHistory.push({
            type: 'heapifyDown',
            index: currentIndex,
            compareChildIndex,
            step: 'selectChild',
            message: `Selected left child ${this.heap[compareChildIndex]} for comparison`
          });
        }
      }
      
      // If heap property is satisfied, we're done
      if (!this.shouldSwap(this.heap[currentIndex], this.heap[compareChildIndex])) {
        if (animate) {
          this.animationHistory.push({
            type: 'heapifyDown',
            index: currentIndex,
            step: 'maintainsHeapProperty',
            message: `${this.heap[currentIndex]} already satisfies heap property`
          });
        }
        break;
      }
      
      // Otherwise swap with the appropriate child
      this.swap(currentIndex, compareChildIndex, animate);
      currentIndex = compareChildIndex;
    }
    
    if (animate && index !== currentIndex) {
      this.animationHistory.push({
        type: 'heapifyDown',
        index: currentIndex,
        step: 'complete',
        message: `Element ${this.heap[currentIndex]} is now in the correct position`
      });
    }
  }

  /**
   * Get the value at the root without removing it
   * @returns {number} The root value
   */
  peek() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  /**
   * Create tree nodes for visualization
   */
  updateTreeStructure() {
    // Clear existing tree nodes
    this.treeNodes = {};
    
    // Create a tree node for each heap element
    for (let i = 0; i < this.heap.length; i++) {
      this.treeNodes[i] = new TreeNode(this.heap[i]);
      
      // Set parent-child relationships
      const parentIndex = this.getParentIndex(i);
      if (parentIndex >= 0) {
        if (i % 2 === 1) { // Left child
          this.treeNodes[parentIndex].left = this.treeNodes[i];
        } else { // Right child
          this.treeNodes[parentIndex].right = this.treeNodes[i];
        }
      }
    }
  }

  /**
   * Calculate positions for visualization
   * @param {number} width - Available width for the visualization
   * @param {number} height - Available height for the visualization
   */
  calculatePositions(width = 800, height = 500) {
    if (this.heap.length === 0) return;
    
    const yOffset = 50;  // Top margin
    const nodeRadius = 25; // Node circle radius
    const levelHeight = 80; // Height between levels
    
    // Calculate the height of the heap (log base 2)
    const heapHeight = Math.floor(Math.log2(this.heap.length)) + 1;
    
    // Set positions for each node
    for (let i = 0; i < this.heap.length; i++) {
      const node = this.treeNodes[i];
      if (!node) continue;
      
      // Calculate the level of this node in the tree
      const level = Math.floor(Math.log2(i + 1));
      
      // Calculate the node's position within its level
      // This determines the x-position
      const nodesInLevel = Math.pow(2, level);
      const positionInLevel = i - (Math.pow(2, level) - 1);
      
      // Calculate spacing for this level
      const levelWidth = width;
      const nodeSpacing = levelWidth / (nodesInLevel + 1);
      
      // Set node coordinates
      node.x = (positionInLevel + 1) * nodeSpacing;
      node.y = level * levelHeight + yOffset;
    }
  }

  /**
   * Reset all highlights in the tree
   */
  resetHighlights() {
    for (const index in this.treeNodes) {
      if (this.treeNodes.hasOwnProperty(index)) {
        this.treeNodes[index].highlightState = 'normal';
        this.treeNodes[index].animationStep = 0;
      }
    }
  }

  /**
   * Create a heap with random values
   * @param {number} count - Number of nodes to create
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @param {string} type - Heap type ('min' or 'max')
   * @returns {BinaryHeap} A new heap with random values
   */
  static createRandomHeap(count = 7, min = 1, max = 100, type = 'min') {
    const heap = new BinaryHeap(type);
    const usedValues = new Set();
    
    // Generate unique random values
    for (let i = 0; i < count; i++) {
      let value;
      do {
        value = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (usedValues.has(value));
      
      usedValues.add(value);
      heap.insert(value);
    }
    
    return heap;
  }

  /**
   * Get the root node for visualization
   * @returns {TreeNode} The root node
   */
  get root() {
    return this.treeNodes[0] || null;
  }

  /**
   * Create a new binary heap and then heapify all elements
   * @param {Array} arr - Array of elements to heapify
   * @param {string} type - Heap type ('min' or 'max')
   * @param {boolean} animate - Whether to record animation steps
   * @returns {BinaryHeap} A new heap containing the array elements
   */
  static heapify(arr, type = 'min', animate = false) {
    const heap = new BinaryHeap(type);
    if (animate) heap.animationHistory = [];
    
    // First insert all elements
    for (const value of arr) {
      heap.heap.push(value);
      heap.nodeCount++;
      
      if (animate) {
        heap.animationHistory.push({
          type: 'heapify',
          value,
          step: 'insert',
          message: `Added ${value} to the heap`
        });
      }
    }
    
    // Create tree structure
    heap.updateTreeStructure();
    
    // Then heapify down starting from the last non-leaf node
    const firstNonLeafIndex = Math.floor(heap.heap.length / 2) - 1;
    
    if (animate) {
      heap.animationHistory.push({
        type: 'heapify',
        index: firstNonLeafIndex,
        step: 'startHeapify',
        message: `Starting heapify from last non-leaf node at index ${firstNonLeafIndex}`
      });
    }
    
    for (let i = firstNonLeafIndex; i >= 0; i--) {
      if (animate) {
        heap.animationHistory.push({
          type: 'heapify',
          index: i,
          step: 'heapifyNode',
          message: `Heapifying subtree rooted at index ${i} with value ${heap.heap[i]}`
        });
      }
      
      heap.heapifyDown(i, animate);
    }
    
    if (animate) {
      heap.animationHistory.push({
        type: 'heapify',
        step: 'complete',
        message: `Heapify complete! ${type === 'min' ? 'Min' : 'Max'} heap created successfully`
      });
    }
    
    return heap;
  }

  /**
   * Get the heap as an array
   * @returns {Array} The heap array
   */
  toArray() {
    return [...this.heap];
  }
}

export default BinaryHeap;