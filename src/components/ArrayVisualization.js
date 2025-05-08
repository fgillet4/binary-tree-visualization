/**
 * ArrayVisualization.js
 * Component for visualizing array operations and sorting algorithms
 */

import React, { useState, useEffect, useRef } from 'react';
import '../styles/ArrayVisualization.css';

const ArrayVisualization = () => {
  // Array data state
  const [array, setArray] = useState([28, 77, 21, 42, 89, 33, 17, 65, 91, 53]);
  const [originalArray, setOriginalArray] = useState([...array]);
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [message, setMessage] = useState('Welcome to Array Visualization');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDelay, setAnimationDelay] = useState(800); // Slower default for better visualization
  const [animationPaused, setAnimationPaused] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const animationTimer = useRef(null);
  
  // Recursion stack visualization
  const [recursionStack, setRecursionStack] = useState([]);
  const [activeFrameIndex, setActiveFrameIndex] = useState(-1);
  
  // Input and controls
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [activeAlgorithm, setActiveAlgorithm] = useState('linear-search');
  const [maxArraySize, setMaxArraySize] = useState(15);
  
  // Reset animation state when changing algorithms
  useEffect(() => {
    resetAnimationState();
  }, [activeAlgorithm]);
  
  // Clean up any timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, []);
  
  // Reset animation highlights
  const resetAnimationState = () => {
    setHighlightIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setPivotIndex(-1);
    setAnimationStep(0);
    setMessage(`Selected algorithm: ${getAlgorithmName(activeAlgorithm)}`);
    setSearchResult(null);
    setRecursionStack([]);
    setActiveFrameIndex(-1);
    
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
    }
  };
  
  // Handle array input change
  const handleArrayInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  // Add a value to the array
  const handleAddValue = () => {
    if (!inputValue.trim()) {
      setMessage('Please enter a value');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    if (array.length >= maxArraySize) {
      setMessage(`Maximum array size of ${maxArraySize} reached`);
      return;
    }
    
    setArray([...array, value]);
    setOriginalArray([...array, value]);
    setInputValue('');
    setMessage(`Added ${value} to the array`);
  };
  
  // Add a value at a specific index
  const handleAddAtIndex = () => {
    if (!inputValue.trim() || !inputIndex.trim()) {
      setMessage('Please enter both a value and an index');
      return;
    }
    
    const value = parseInt(inputValue);
    const index = parseInt(inputIndex);
    
    if (isNaN(value) || isNaN(index)) {
      setMessage('Please enter valid numbers');
      return;
    }
    
    if (index < 0 || index > array.length) {
      setMessage(`Index must be between 0 and ${array.length}`);
      return;
    }
    
    if (array.length >= maxArraySize) {
      setMessage(`Maximum array size of ${maxArraySize} reached`);
      return;
    }
    
    const newArray = [...array];
    newArray.splice(index, 0, value);
    setArray(newArray);
    setOriginalArray(newArray);
    setInputValue('');
    setInputIndex('');
    setMessage(`Added ${value} at index ${index}`);
  };
  
  // Remove a value from the array
  const handleRemoveAtIndex = () => {
    if (!inputIndex.trim()) {
      setMessage('Please enter an index');
      return;
    }
    
    const index = parseInt(inputIndex);
    
    if (isNaN(index)) {
      setMessage('Please enter a valid index');
      return;
    }
    
    if (index < 0 || index >= array.length) {
      setMessage(`Index must be between 0 and ${array.length - 1}`);
      return;
    }
    
    const newArray = [...array];
    const removedValue = newArray.splice(index, 1)[0];
    setArray(newArray);
    setOriginalArray(newArray);
    setInputIndex('');
    setMessage(`Removed ${removedValue} from index ${index}`);
  };
  
  // Generate a random array
  const handleGenerateArray = () => {
    const size = Math.floor(Math.random() * 6) + 5; // 5 to 10 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    setOriginalArray(newArray);
    resetAnimationState();
    setMessage(`Generated a random array of size ${size}`);
  };
  
  // Reset the array to its original state
  const handleResetArray = () => {
    setArray([...originalArray]);
    resetAnimationState();
    setMessage('Reset array to original state');
  };
  
  // Get algorithm friendly name
  const getAlgorithmName = (algorithm) => {
    const names = {
      'linear-search': 'Linear Search',
      'binary-search': 'Binary Search',
      'bubble-sort': 'Bubble Sort',
      'insertion-sort': 'Insertion Sort',
      'selection-sort': 'Selection Sort',
      'merge-sort': 'Merge Sort',
      'quick-sort': 'Quick Sort'
    };
    return names[algorithm] || algorithm;
  };
  
  // Start animation for the selected algorithm
  const startAlgorithmAnimation = () => {
    if (isAnimating) return;
    
    if (activeAlgorithm === 'linear-search' || activeAlgorithm === 'binary-search') {
      // For search algorithms, check if search value is provided
      if (!searchValue.trim()) {
        setMessage('Please enter a value to search for');
        return;
      }
      
      const value = parseInt(searchValue);
      if (isNaN(value)) {
        setMessage('Please enter a valid number to search for');
        return;
      }
      
      // For binary search, we need a sorted array
      if (activeAlgorithm === 'binary-search' && !isSorted(array)) {
        const sortedArray = [...array].sort((a, b) => a - b);
        setArray(sortedArray);
        setMessage('Array has been sorted for binary search');
        
        // Short delay to show the sorted array before starting search
        setTimeout(() => {
          setIsAnimating(true);
          setMessage(`Starting binary search for ${value}...`);
          animateBinarySearch(sortedArray, value);
        }, 1000);
      } else {
        setIsAnimating(true);
        if (activeAlgorithm === 'linear-search') {
          setMessage(`Starting linear search for ${value}...`);
          animateLinearSearch(array, value);
        } else {
          setMessage(`Starting binary search for ${value}...`);
          animateBinarySearch(array, value);
        }
      }
    } else {
      // For sorting algorithms
      setIsAnimating(true);
      setMessage(`Starting ${getAlgorithmName(activeAlgorithm)}...`);
      
      if (activeAlgorithm === 'bubble-sort') {
        animateBubbleSort([...array]);
      } else if (activeAlgorithm === 'insertion-sort') {
        animateInsertionSort([...array]);
      } else if (activeAlgorithm === 'selection-sort') {
        animateSelectionSort([...array]);
      } else if (activeAlgorithm === 'merge-sort') {
        animateMergeSort([...array]);
      } else if (activeAlgorithm === 'quick-sort') {
        animateQuickSort([...array]);
      }
    }
  };
  
  // Toggle animation pause/resume
  const toggleAnimationPause = () => {
    setAnimationPaused(!animationPaused);
  };
  
  // Check if array is sorted
  const isSorted = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  };
  
  // Animation for linear search
  const animateLinearSearch = (arr, target) => {
    const animations = [];
    const n = arr.length;
    
    for (let i = 0; i < n; i++) {
      animations.push({
        type: 'compare',
        indices: [i],
        message: `Checking if ${arr[i]} equals ${target}...`
      });
      
      if (arr[i] === target) {
        animations.push({
          type: 'found',
          indices: [i],
          message: `Found ${target} at index ${i}!`
        });
        break;
      }
      
      if (i === n - 1) {
        animations.push({
          type: 'not-found',
          message: `${target} not found in the array`
        });
      }
    }
    
    playAnimations(animations);
  };
  
  // Animation for binary search
  const animateBinarySearch = (arr, target) => {
    const animations = [];
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      animations.push({
        type: 'range',
        indices: [left, right],
        midIndex: mid,
        message: `Searching in range [${left}...${right}], middle is ${mid}`
      });
      
      animations.push({
        type: 'compare',
        indices: [mid],
        message: `Comparing ${arr[mid]} with ${target}`
      });
      
      if (arr[mid] === target) {
        animations.push({
          type: 'found',
          indices: [mid],
          message: `Found ${target} at index ${mid}!`
        });
        break;
      } else if (arr[mid] < target) {
        left = mid + 1;
        animations.push({
          type: 'move-right',
          indices: [],
          message: `${arr[mid]} < ${target}, searching right half`
        });
      } else {
        right = mid - 1;
        animations.push({
          type: 'move-left',
          indices: [],
          message: `${arr[mid]} > ${target}, searching left half`
        });
      }
      
      if (left > right) {
        animations.push({
          type: 'not-found',
          message: `${target} not found in the array`
        });
      }
    }
    
    playAnimations(animations);
  };
  
  // Animation for bubble sort
  const animateBubbleSort = (arr) => {
    const animations = [];
    const n = arr.length;
    let swapped;
    
    animations.push({
      type: 'message',
      message: 'Bubble sort repeatedly compares adjacent elements and swaps them if they are in the wrong order'
    });
    
    for (let i = 0; i < n; i++) {
      swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        animations.push({
          type: 'compare',
          indices: [j, j + 1],
          message: `Comparing ${arr[j]} and ${arr[j + 1]}`
        });
        
        if (arr[j] > arr[j + 1]) {
          animations.push({
            type: 'swap',
            indices: [j, j + 1],
            message: `Swapping ${arr[j]} and ${arr[j + 1]}`
          });
          
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;
          
          animations.push({
            type: 'update',
            array: [...arr],
            message: 'Updated array after swap'
          });
        }
      }
      
      animations.push({
        type: 'sorted',
        index: n - i - 1,
        message: `Element ${arr[n - i - 1]} is now in its sorted position`
      });
      
      if (!swapped) {
        animations.push({
          type: 'early-exit',
          message: 'No swaps in this pass, array is sorted'
        });
        break;
      }
    }
    
    animations.push({
      type: 'complete',
      message: 'Bubble sort complete!'
    });
    
    playAnimations(animations);
  };
  
  // Animation for insertion sort
  const animateInsertionSort = (arr) => {
    const animations = [];
    const n = arr.length;
    
    animations.push({
      type: 'message',
      message: 'Insertion sort builds the sorted array one item at a time'
    });
    
    // First element is already "sorted"
    animations.push({
      type: 'sorted',
      indices: [0],
      message: 'First element is considered sorted'
    });
    
    for (let i = 1; i < n; i++) {
      const current = arr[i];
      
      animations.push({
        type: 'highlight',
        indices: [i],
        message: `Considering element ${current} at index ${i}`
      });
      
      let j = i - 1;
      
      while (j >= 0 && arr[j] > current) {
        animations.push({
          type: 'compare',
          indices: [j, j + 1],
          message: `${arr[j]} > ${current}, shifting ${arr[j]} to the right`
        });
        
        arr[j + 1] = arr[j];
        
        animations.push({
          type: 'update',
          array: [...arr],
          message: `Shifted ${arr[j]} to position ${j + 1}`
        });
        
        j--;
      }
      
      arr[j + 1] = current;
      
      animations.push({
        type: 'insert',
        index: j + 1,
        value: current,
        array: [...arr],
        message: `Insert ${current} at position ${j + 1}`
      });
      
      animations.push({
        type: 'sorted',
        indices: Array.from({ length: i + 1 }, (_, idx) => idx),
        message: `Elements 0 through ${i} are now sorted`
      });
    }
    
    animations.push({
      type: 'complete',
      message: 'Insertion sort complete!'
    });
    
    playAnimations(animations);
  };
  
  // Animation for selection sort
  const animateSelectionSort = (arr) => {
    const animations = [];
    const n = arr.length;
    
    animations.push({
      type: 'message',
      message: 'Selection sort finds the minimum element and places it at the beginning'
    });
    
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      
      animations.push({
        type: 'highlight',
        indices: [i],
        message: `Finding minimum element to place at position ${i}`
      });
      
      for (let j = i + 1; j < n; j++) {
        animations.push({
          type: 'compare',
          indices: [minIndex, j],
          message: `Comparing current minimum ${arr[minIndex]} with ${arr[j]}`
        });
        
        if (arr[j] < arr[minIndex]) {
          animations.push({
            type: 'new-min',
            oldMinIndex: minIndex,
            newMinIndex: j,
            message: `New minimum found: ${arr[j]} < ${arr[minIndex]}`
          });
          
          minIndex = j;
        }
      }
      
      if (minIndex !== i) {
        animations.push({
          type: 'swap',
          indices: [i, minIndex],
          message: `Swapping ${arr[i]} and ${arr[minIndex]}`
        });
        
        const temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
        
        animations.push({
          type: 'update',
          array: [...arr],
          message: 'Updated array after swap'
        });
      } else {
        animations.push({
          type: 'no-swap',
          index: i,
          message: `${arr[i]} is already the minimum`
        });
      }
      
      animations.push({
        type: 'sorted',
        indices: Array.from({ length: i + 1 }, (_, idx) => idx),
        message: `Elements 0 through ${i} are now sorted`
      });
    }
    
    animations.push({
      type: 'complete',
      message: 'Selection sort complete!'
    });
    
    playAnimations(animations);
  };
  
  // Animation for merge sort
  const animateMergeSort = (arr) => {
    const animations = [];
    const tempArray = [...arr];
    let stackDepth = 0;
    
    animations.push({
      type: 'message',
      message: 'Merge sort uses divide and conquer to sort the array'
    });
    
    // Clear recursion stack
    animations.push({
      type: 'reset-stack',
      message: 'Starting recursion for merge sort'
    });
    
    const mergeSortHelper = (array, temp, left, right, depth) => {
      // Push to call stack
      const subArray = array.slice(left, right + 1);
      animations.push({
        type: 'push-stack',
        frame: {
          depth,
          left,
          right,
          array: subArray,
          action: 'Dividing subarray'
        },
        message: `Recursion level ${depth}: Processing subarray [${left}...${right}]`,
        activeFrameIndex: depth
      });
      
      if (left >= right) {
        animations.push({
          type: 'update-frame',
          frameIndex: depth,
          updateData: {
            action: 'Base case: Single element or empty array'
          },
          message: `Base case reached: subarray [${left}...${right}] has 1 or 0 elements`,
          activeFrameIndex: depth
        });
        
        animations.push({
          type: 'pop-stack',
          frameIndex: depth,
          message: `Returning from recursion level ${depth}`,
          activeFrameIndex: Math.max(0, depth - 1)
        });
        
        return;
      }
      
      const mid = Math.floor((left + right) / 2);
      
      animations.push({
        type: 'divide',
        indices: [left, mid, right],
        message: `Dividing array into [${left}...${mid}] and [${mid + 1}...${right}]`,
        updateData: {
          action: `Dividing at midpoint ${mid}`
        },
        frameIndex: depth
      });
      
      // Recurse left
      animations.push({
        type: 'update-frame',
        frameIndex: depth,
        updateData: {
          action: `Calling recursively on left half [${left}...${mid}]`
        },
        message: `Going to recursion level ${depth + 1} for left half [${left}...${mid}]`,
        activeFrameIndex: depth
      });
      
      mergeSortHelper(array, temp, left, mid, depth + 1);
      
      // Recurse right
      animations.push({
        type: 'update-frame',
        frameIndex: depth,
        updateData: {
          action: `Calling recursively on right half [${mid + 1}...${right}]`
        },
        message: `Going to recursion level ${depth + 1} for right half [${mid + 1}...${right}]`,
        activeFrameIndex: depth
      });
      
      mergeSortHelper(array, temp, mid + 1, right, depth + 1);
      
      animations.push({
        type: 'merge-start',
        indices: [left, mid, right],
        message: `Merging subarrays [${left}...${mid}] and [${mid + 1}...${right}]`,
        updateData: {
          action: `Merging left [${left}...${mid}] and right [${mid + 1}...${right}]`
        },
        frameIndex: depth
      });
      
      // Merge the two halves
      let i = left;
      let j = mid + 1;
      let k = left;
      
      while (i <= mid && j <= right) {
        animations.push({
          type: 'compare',
          indices: [i, j],
          message: `Comparing ${array[i]} and ${array[j]}`
        });
        
        if (array[i] <= array[j]) {
          animations.push({
            type: 'copy',
            source: i,
            destination: k,
            message: `Copying ${array[i]} to position ${k}`
          });
          
          temp[k++] = array[i++];
        } else {
          animations.push({
            type: 'copy',
            source: j,
            destination: k,
            message: `Copying ${array[j]} to position ${k}`
          });
          
          temp[k++] = array[j++];
        }
      }
      
      // Copy remaining elements
      while (i <= mid) {
        animations.push({
          type: 'copy',
          source: i,
          destination: k,
          message: `Copying remaining element ${array[i]} to position ${k}`
        });
        
        temp[k++] = array[i++];
      }
      
      while (j <= right) {
        animations.push({
          type: 'copy',
          source: j,
          destination: k,
          message: `Copying remaining element ${array[j]} to position ${k}`
        });
        
        temp[k++] = array[j++];
      }
      
      // Copy back from temp to array
      for (let m = left; m <= right; m++) {
        array[m] = temp[m];
      }
      
      const mergedSubArray = array.slice(left, right + 1);
      animations.push({
        type: 'merge-complete',
        indices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        array: [...array],
        message: `Merged subarray [${left}...${right}]`,
        updateData: {
          array: mergedSubArray,
          action: `Merged successfully`
        },
        frameIndex: depth
      });
      
      // Pop from stack
      animations.push({
        type: 'pop-stack',
        frameIndex: depth,
        message: `Returning from recursion level ${depth}`,
        activeFrameIndex: Math.max(0, depth - 1)
      });
    };
    
    mergeSortHelper(arr, tempArray, 0, arr.length - 1, 0);
    
    animations.push({
      type: 'complete',
      message: 'Merge sort complete!'
    });
    
    playAnimations(animations);
  };
  
  // Animation for quicksort
  const animateQuickSort = (arr) => {
    const animations = [];
    
    animations.push({
      type: 'message',
      message: 'Quicksort uses divide and conquer with a pivot element'
    });
    
    // Clear recursion stack
    animations.push({
      type: 'reset-stack',
      message: 'Starting recursion for quicksort'
    });
    
    const quickSortHelper = (array, low, high, depth) => {
      // Push to call stack
      const subArray = array.slice(low, high + 1);
      animations.push({
        type: 'push-stack',
        frame: {
          depth,
          left: low,
          right: high,
          array: subArray,
          action: 'Sorting subarray'
        },
        message: `Recursion level ${depth}: Processing subarray [${low}...${high}]`,
        activeFrameIndex: depth
      });
      
      if (low < high) {
        animations.push({
          type: 'subarray',
          indices: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
          message: `Sorting subarray [${low}...${high}]`
        });
        
        const pivotIndex = partition(array, low, high, animations, depth);
        
        // Update current frame to show we're about to recurse left
        animations.push({
          type: 'update-frame',
          frameIndex: depth,
          updateData: {
            action: `Recursing on left: [${low}...${pivotIndex - 1}]`
          },
          message: `Going to recursion level ${depth + 1} for left portion [${low}...${pivotIndex - 1}]`,
          activeFrameIndex: depth
        });
        
        quickSortHelper(array, low, pivotIndex - 1, depth + 1);
        
        // Update current frame to show we're about to recurse right
        animations.push({
          type: 'update-frame',
          frameIndex: depth,
          updateData: {
            action: `Recursing on right: [${pivotIndex + 1}...${high}]`
          },
          message: `Going to recursion level ${depth + 1} for right portion [${pivotIndex + 1}...${high}]`,
          activeFrameIndex: depth
        });
        
        quickSortHelper(array, pivotIndex + 1, high, depth + 1);
        
        // Update the frame to show completion
        animations.push({
          type: 'update-frame',
          frameIndex: depth,
          updateData: {
            action: `Subarray sorted successfully`,
            array: array.slice(low, high + 1)
          },
          message: `Recursion level ${depth}: Completed sorting subarray [${low}...${high}]`,
          activeFrameIndex: depth
        });
        
      } else if (low === high) {
        animations.push({
          type: 'sorted',
          indices: [low],
          message: `Subarray of size 1 at index ${low} is already sorted`,
          updateData: {
            action: `Base case: single element is already sorted`
          },
          frameIndex: depth
        });
      } else {
        // Empty subarray case
        animations.push({
          type: 'update-frame',
          frameIndex: depth,
          updateData: {
            action: `Base case: empty subarray, nothing to do`
          },
          message: `Base case: empty subarray [${low}...${high}]`,
          activeFrameIndex: depth
        });
      }
      
      // Pop from stack when done with this recursion level
      animations.push({
        type: 'pop-stack',
        frameIndex: depth,
        message: `Returning from recursion level ${depth}`,
        activeFrameIndex: Math.max(0, depth - 1)
      });
    };
    
    const partition = (array, low, high, animations, depth) => {
      const pivot = array[high];
      
      animations.push({
        type: 'pivot',
        index: high,
        value: pivot,
        message: `Selected pivot: ${pivot} at index ${high}`,
        updateData: {
          action: `Selected pivot: ${pivot} at index ${high}`
        },
        frameIndex: depth
      });
      
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        animations.push({
          type: 'compare',
          indices: [j, high],
          message: `Comparing ${array[j]} with pivot ${pivot}`
        });
        
        if (array[j] <= pivot) {
          i++;
          
          if (i !== j) {
            animations.push({
              type: 'swap',
              indices: [i, j],
              message: `${array[j]} <= ${pivot}, swapping ${array[i]} and ${array[j]}`,
              updateData: {
                action: `Swapping ${array[i]} and ${array[j]}`
              },
              frameIndex: depth
            });
            
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            
            animations.push({
              type: 'update',
              array: [...array],
              message: 'Updated array after swap'
            });
          } else {
            animations.push({
              type: 'no-swap',
              index: i,
              message: `${array[j]} <= ${pivot}, but no swap needed (same position)`
            });
          }
        } else {
          animations.push({
            type: 'no-swap',
            message: `${array[j]} > ${pivot}, no swap needed`
          });
        }
      }
      
      // Place pivot in its final position
      const newPivotIndex = i + 1;
      
      if (newPivotIndex !== high) {
        animations.push({
          type: 'swap',
          indices: [newPivotIndex, high],
          message: `Placing pivot ${pivot} in its correct position at index ${newPivotIndex}`,
          updateData: {
            action: `Placing pivot ${pivot} at its final position ${newPivotIndex}`
          },
          frameIndex: depth
        });
        
        const temp = array[newPivotIndex];
        array[newPivotIndex] = array[high];
        array[high] = temp;
        
        animations.push({
          type: 'update',
          array: [...array],
          message: 'Updated array after placing pivot',
          updateData: {
            array: array.slice(low, high + 1)
          },
          frameIndex: depth
        });
      }
      
      animations.push({
        type: 'partition-complete',
        index: newPivotIndex,
        message: `Partition complete, pivot ${pivot} is now at index ${newPivotIndex}`,
        updateData: {
          action: `Partition complete: elements ≤ ${pivot} on the left, > ${pivot} on the right`
        },
        frameIndex: depth
      });
      
      return newPivotIndex;
    };
    
    quickSortHelper(arr, 0, arr.length - 1, 0);
    
    animations.push({
      type: 'complete',
      message: 'Quicksort complete!'
    });
    
    playAnimations(animations);
  };
  
  // Play the sequence of animations
  const playAnimations = (animations) => {
    if (!animations || animations.length === 0) {
      setIsAnimating(false);
      return;
    }
    
    let step = 0;
    
    const processNextStep = () => {
      if (animationPaused) {
        animationTimer.current = setTimeout(processNextStep, 100);
        return;
      }
      
      if (step >= animations.length) {
        setIsAnimating(false);
        setHighlightIndices([]);
        setComparingIndices([]);
        
        if (activeAlgorithm !== 'linear-search' && activeAlgorithm !== 'binary-search') {
          setSortedIndices(Array.from({ length: array.length }, (_, i) => i));
        }
        
        return;
      }
      
      const animation = animations[step++];
      processAnimationStep(animation);
      
      if (step < animations.length) {
        animationTimer.current = setTimeout(processNextStep, animationDelay);
      } else {
        setTimeout(() => {
          setIsAnimating(false);
          
          if (activeAlgorithm !== 'linear-search' && activeAlgorithm !== 'binary-search') {
            setSortedIndices(Array.from({ length: array.length }, (_, i) => i));
          }
        }, animationDelay);
      }
    };
    
    processNextStep();
  };
  
  // Process a single animation step
  const processAnimationStep = (animation) => {
    setMessage(animation.message || '');
    setAnimationStep(prevStep => prevStep + 1);
    
    // If there's an active frame index specified, update it
    if (typeof animation.activeFrameIndex === 'number') {
      setActiveFrameIndex(animation.activeFrameIndex);
    }
    
    // Clear all highlighting first to ensure clean transitions
    const resetAll = () => {
      setHighlightIndices([]);
      setComparingIndices([]);
      setPivotIndex(-1);
    };
    
    switch (animation.type) {
      case 'reset-stack':
        // Reset the recursion stack visualization
        setRecursionStack([]);
        setActiveFrameIndex(-1);
        break;
        
      case 'push-stack':
        // Add a new frame to the recursion stack
        if (animation.frame) {
          setRecursionStack(prev => [...prev, animation.frame]);
        }
        break;
        
      case 'pop-stack':
        // Remove a frame from the recursion stack
        if (typeof animation.frameIndex === 'number') {
          setRecursionStack(prev => prev.filter((_, i) => i !== animation.frameIndex));
        }
        break;
        
      case 'update-frame':
        // Update an existing frame in the recursion stack
        if (typeof animation.frameIndex === 'number' && animation.updateData) {
          setRecursionStack(prev => {
            const newStack = [...prev];
            if (newStack[animation.frameIndex]) {
              newStack[animation.frameIndex] = {
                ...newStack[animation.frameIndex],
                ...animation.updateData
              };
            }
            return newStack;
          });
        }
        break;
      
      case 'compare':
        // For compare operations, reset highlight but keep sorted indices
        setHighlightIndices([]);
        // Set with a slight delay for visual effect
        setTimeout(() => {
          setComparingIndices(animation.indices || []);
        }, 50);
        break;
        
      case 'highlight':
        // For highlight operations, reset comparing but keep sorted indices
        setComparingIndices([]);
        setTimeout(() => {
          setHighlightIndices(animation.indices || []);
        }, 50);
        break;
        
      case 'swap':
        // For swap operations, highlight the indices being swapped
        setHighlightIndices([]);
        setComparingIndices(animation.indices || []);
        
        // Update array with a slight delay to show the comparison first
        if (animation.array) {
          setTimeout(() => {
            setArray(animation.array);
          }, 200);
        }
        
        // Update the recursion frame if specified
        if (typeof animation.frameIndex === 'number' && animation.updateData) {
          setRecursionStack(prev => {
            const newStack = [...prev];
            if (newStack[animation.frameIndex]) {
              newStack[animation.frameIndex] = {
                ...newStack[animation.frameIndex],
                ...animation.updateData
              };
            }
            return newStack;
          });
        }
        break;
        
      case 'update':
        // Update array immediately
        if (animation.array) {
          setArray(animation.array);
        }
        
        // Update the recursion frame if specified
        if (typeof animation.frameIndex === 'number' && animation.updateData) {
          setRecursionStack(prev => {
            const newStack = [...prev];
            if (newStack[animation.frameIndex]) {
              newStack[animation.frameIndex] = {
                ...newStack[animation.frameIndex],
                ...animation.updateData
              };
            }
            return newStack;
          });
        }
        break;
        
      case 'found':
        resetAll();
        // Highlight the found index with a delay for visual effect
        setTimeout(() => {
          setHighlightIndices(animation.indices || []);
          setSearchResult({
            found: true,
            index: animation.indices[0]
          });
        }, 100);
        break;
        
      case 'not-found':
        resetAll();
        setSearchResult({
          found: false
        });
        break;
        
      case 'sorted':
        // For sorted operations, mark elements as sorted
        if (typeof animation.index === 'number') {
          setSortedIndices(prev => [...prev, animation.index]);
        } else if (animation.indices) {
          // For batch sorting, add with a visual cascading effect
          const indices = animation.indices;
          indices.forEach((index, i) => {
            setTimeout(() => {
              setSortedIndices(prev => {
                if (prev.includes(index)) return prev;
                return [...prev, index];
              });
            }, i * 50); // Cascade effect
          });
        }
        
        // Update the recursion frame if specified
        if (typeof animation.frameIndex === 'number' && animation.updateData) {
          setRecursionStack(prev => {
            const newStack = [...prev];
            if (newStack[animation.frameIndex]) {
              newStack[animation.frameIndex] = {
                ...newStack[animation.frameIndex],
                ...animation.updateData
              };
            }
            return newStack;
          });
        }
        break;
        
      case 'pivot':
        // For pivot selection, highlight the pivot with a clear visual
        setPivotIndex(animation.index);
        // Briefly highlight the pivot element
        setHighlightIndices([animation.index]);
        setTimeout(() => {
          setHighlightIndices([]);
        }, 300);
        
        // Update the recursion frame if specified
        if (typeof animation.frameIndex === 'number' && animation.updateData) {
          setRecursionStack(prev => {
            const newStack = [...prev];
            if (newStack[animation.frameIndex]) {
              newStack[animation.frameIndex] = {
                ...newStack[animation.frameIndex],
                ...animation.updateData
              };
            }
            return newStack;
          });
        }
        break;
        
      case 'partition-complete':
        // Mark the pivot as sorted when partition is complete
        setSortedIndices(prev => [...prev, animation.index]);
        // Clear pivot highlight
        setPivotIndex(-1);
        
        // Update the recursion frame if specified
        if (typeof animation.frameIndex === 'number' && animation.updateData) {
          setRecursionStack(prev => {
            const newStack = [...prev];
            if (newStack[animation.frameIndex]) {
              newStack[animation.frameIndex] = {
                ...newStack[animation.frameIndex],
                ...animation.updateData
              };
            }
            return newStack;
          });
        }
        break;
        
      case 'range':
        // For range operations (like in binary search)
        // Create a cascading highlight effect
        const rangeLength = animation.indices[1] - animation.indices[0] + 1;
        const rangeIndices = Array.from({ length: rangeLength }, (_, i) => animation.indices[0] + i);
        
        // Clear first
        setHighlightIndices([]);
        setComparingIndices([]);
        
        // Then add range indices with cascade effect
        rangeIndices.forEach((index, i) => {
          setTimeout(() => {
            setHighlightIndices(prev => [...prev, index]);
          }, i * 30);
        });
        
        // Finally highlight the midpoint
        setTimeout(() => {
          setComparingIndices([animation.midIndex]);
        }, rangeLength * 30 + 100);
        break;
        
      case 'divide':
      case 'merge-start':
      case 'merge-complete':
      case 'subarray':
        // Highlight the relevant subarray
        if (animation.indices) {
          setHighlightIndices(animation.indices);
        }
        
        // Update the recursion frame if specified
        if (typeof animation.frameIndex === 'number' && animation.updateData) {
          setRecursionStack(prev => {
            const newStack = [...prev];
            if (newStack[animation.frameIndex]) {
              newStack[animation.frameIndex] = {
                ...newStack[animation.frameIndex],
                ...animation.updateData
              };
            }
            return newStack;
          });
        }
        break;
        
      default:
        // For other types, just update the message
        break;
    }
  };
  
  // Handle algorithm selection
  const handleAlgorithmChange = (algorithm) => {
    setActiveAlgorithm(algorithm);
    resetAnimationState();
    
    if (algorithm === 'binary-search' && !isSorted(array)) {
      setMessage('Note: Binary search requires a sorted array. The array will be sorted automatically when you start the search.');
    } else {
      setMessage(`Selected algorithm: ${getAlgorithmName(algorithm)}`);
    }
  };
  
  // Handle speed control
  const handleSpeedChange = (e) => {
    const newDelay = parseInt(e.target.value);
    setAnimationDelay(newDelay);
    setMessage(`Animation speed set to ${getSpeedLabel(newDelay)}`);
  };
  
  // Get speed label
  const getSpeedLabel = (delay) => {
    if (delay <= 100) return 'Very Fast';
    if (delay <= 300) return 'Fast';
    if (delay <= 500) return 'Normal';
    if (delay <= 1000) return 'Slow';
    return 'Very Slow';
  };
  
  // Render recursion stack visualization
  const renderRecursionStack = () => {
    if (!recursionStack.length) return null;
    
    return (
      <div className="recursion-stack-container">
        <div className="recursion-stack-title">Recursion Stack</div>
        <div className="recursion-stack">
          {recursionStack.map((frame, index) => {
            const isActive = index === activeFrameIndex;
            return (
              <div 
                key={`${frame.depth}-${frame.left}-${frame.right}`} 
                className={`recursion-frame ${isActive ? 'active' : ''}`}
              >
                <div className="recursion-frame-header">
                  <div className="recursion-frame-depth">
                    Level {frame.depth}
                  </div>
                  <div className="recursion-frame-range">
                    Range [{frame.left}...{frame.right}]
                  </div>
                </div>
                
                <div className="recursion-frame-array">
                  {frame.array && frame.array.map((value, i) => {
                    const globalIndex = frame.left + i;
                    const isHighlighted = highlightIndices.includes(globalIndex);
                    const isComparing = comparingIndices.includes(globalIndex);
                    const isSorted = sortedIndices.includes(globalIndex);
                    const isPivot = globalIndex === pivotIndex;
                    
                    let elementClass = 'recursion-array-element';
                    if (isHighlighted) elementClass += ' highlighted';
                    if (isComparing) elementClass += ' comparing';
                    if (isSorted) elementClass += ' sorted';
                    if (isPivot) elementClass += ' pivot';
                    
                    return (
                      <div 
                        key={i}
                        className={elementClass}
                        title={`Value: ${value}, Index: ${globalIndex}`}
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>
                
                {frame.action && (
                  <div className="recursion-frame-action">
                    {frame.action}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render the array bars
  const renderArrayBars = () => {
    const maxValue = Math.max(...array, 1);
    const minValue = Math.min(...array);
    const range = maxValue - minValue;
    
    return (
      <div className="array-visualization-wrapper">
        {isAnimating && (
          <div className={`animation-status ${animationPaused ? 'paused' : 'playing'}`}>
            <div className="animation-step">
              Step: {animationStep}
            </div>
            <div className="animation-indicator">
              {animationPaused ? 'Paused' : 'Playing'}
              {!animationPaused && (
                <span className="animation-dots">
                  <span className="dot dot1">.</span>
                  <span className="dot dot2">.</span>
                  <span className="dot dot3">.</span>
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="array-visualization">
          {array.map((value, index) => {
            const isHighlighted = highlightIndices.includes(index);
            const isComparing = comparingIndices.includes(index);
            const isSorted = sortedIndices.includes(index);
            const isPivot = index === pivotIndex;
            
            const heightPercentage = range === 0 ? 50 : ((value - minValue) / range) * 80 + 20;
            
            let barClass = 'array-bar';
            if (isHighlighted) barClass += ' highlighted';
            if (isComparing) barClass += ' comparing';
            if (isSorted) barClass += ' sorted';
            if (isPivot) barClass += ' pivot';
            
            return (
              <div key={index} className="array-element">
                <div 
                  className={barClass}
                  style={{ height: `${heightPercentage}%` }}
                  data-value={value}
                ></div>
                <div className="array-index">{index}</div>
                <div className={`array-value ${isComparing || isHighlighted || isPivot ? 'emphasized' : ''}`}>
                  {value}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="message-container">
          <div className="operation-message">
            {message}
          </div>
        </div>
        
        {/* Render recursion stack for recursive algorithms */}
        {(activeAlgorithm === 'merge-sort' || activeAlgorithm === 'quick-sort') && renderRecursionStack()}
      </div>
    );
  };
  
  // Render algorithm content
  const renderAlgorithmContent = () => {
    const algorithmInfo = {
      'linear-search': {
        title: 'Linear Search',
        description: 'Linear search examines each element of the array until it finds a match.',
        timeComplexity: {
          best: 'O(1)',
          average: 'O(n)',
          worst: 'O(n)'
        },
        spaceComplexity: 'O(1)',
        pros: [
          'Simple to implement',
          'Works on unsorted arrays',
          'Good for small arrays'
        ],
        cons: [
          'Slow for large arrays',
          'Inefficient compared to other search algorithms for sorted data'
        ]
      },
      'binary-search': {
        title: 'Binary Search',
        description: 'Binary search works on sorted arrays by repeatedly dividing the search interval in half.',
        timeComplexity: {
          best: 'O(1)',
          average: 'O(log n)',
          worst: 'O(log n)'
        },
        spaceComplexity: 'O(1) iterative, O(log n) recursive',
        pros: [
          'Very efficient for large sorted arrays',
          'Logarithmic time complexity'
        ],
        cons: [
          'Requires sorted data',
          'Not suitable for small arrays (linear search may be faster)',
          'Not applicable to linked lists without random access'
        ]
      },
      'bubble-sort': {
        title: 'Bubble Sort',
        description: 'Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
        timeComplexity: {
          best: 'O(n)',
          average: 'O(n²)',
          worst: 'O(n²)'
        },
        spaceComplexity: 'O(1)',
        pros: [
          'Simple to understand and implement',
          'Works well for nearly sorted data',
          'Space efficient (in-place)'
        ],
        cons: [
          'Very inefficient for large arrays',
          'Poor performance compared to other sorting algorithms'
        ]
      },
      'insertion-sort': {
        title: 'Insertion Sort',
        description: 'Insertion sort builds the final sorted array one item at a time, similar to sorting playing cards in your hand.',
        timeComplexity: {
          best: 'O(n)',
          average: 'O(n²)',
          worst: 'O(n²)'
        },
        spaceComplexity: 'O(1)',
        pros: [
          'Simple implementation',
          'Efficient for small data sets',
          'Adaptive (efficient for nearly sorted data)',
          'Stable (doesn\'t change relative order of equal elements)',
          'In-place (requires little extra memory)'
        ],
        cons: [
          'Inefficient for large data sets',
          'Much less efficient than quicksort, heapsort, or merge sort'
        ]
      },
      'selection-sort': {
        title: 'Selection Sort',
        description: 'Selection sort repeatedly finds the minimum element from the unsorted portion and puts it at the beginning.',
        timeComplexity: {
          best: 'O(n²)',
          average: 'O(n²)',
          worst: 'O(n²)'
        },
        spaceComplexity: 'O(1)',
        pros: [
          'Simple to implement',
          'In-place (requires little extra memory)',
          'Performs well on small arrays'
        ],
        cons: [
          'Inefficient for large lists',
          'Does not adapt to nearly sorted data',
          'Unstable (may change relative order of equal elements)'
        ]
      },
      'merge-sort': {
        title: 'Merge Sort',
        description: 'Merge sort uses the divide and conquer strategy, dividing the array in half, sorting each half, and then merging them.',
        timeComplexity: {
          best: 'O(n log n)',
          average: 'O(n log n)',
          worst: 'O(n log n)'
        },
        spaceComplexity: 'O(n)',
        pros: [
          'Efficient for large data sets',
          'Stable (doesn\'t change relative order of equal elements)',
          'Guaranteed O(n log n) performance'
        ],
        cons: [
          'Requires additional memory space O(n)',
          'Overkill for small arrays',
          'More complex implementation than simple sorts'
        ]
      },
      'quick-sort': {
        title: 'Quick Sort',
        description: 'Quicksort is a divide and conquer algorithm that picks a pivot element and partitions the array around it.',
        timeComplexity: {
          best: 'O(n log n)',
          average: 'O(n log n)',
          worst: 'O(n²)'
        },
        spaceComplexity: 'O(log n)',
        pros: [
          'Very efficient for large datasets',
          'In-place (requires little extra memory)',
          'Works well with virtual memory systems',
          'Cache-friendly'
        ],
        cons: [
          'Unstable (may change relative order of equal elements)',
          'Worst-case performance O(n²) for poorly chosen pivots',
          'Not adaptive to nearly sorted data'
        ]
      }
    };
    
    const info = algorithmInfo[activeAlgorithm];
    
    if (!info) return null;
    
    return (
      <div className="algorithm-info">
        <h3>{info.title}</h3>
        <p className="algorithm-description">{info.description}</p>
        
        <div className="complexity-info">
          <h4>Time Complexity</h4>
          <table className="complexity-table">
            <tbody>
              <tr>
                <td>Best Case:</td>
                <td className="complexity">{info.timeComplexity.best}</td>
              </tr>
              <tr>
                <td>Average Case:</td>
                <td className="complexity">{info.timeComplexity.average}</td>
              </tr>
              <tr>
                <td>Worst Case:</td>
                <td className="complexity">{info.timeComplexity.worst}</td>
              </tr>
              <tr>
                <td>Space Complexity:</td>
                <td className="complexity">{info.spaceComplexity}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="pros-cons">
          <div className="pros">
            <h4>Advantages</h4>
            <ul>
              {info.pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
          </div>
          
          <div className="cons">
            <h4>Disadvantages</h4>
            <ul>
              {info.cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="array-visualization-container">
      <header className="array-header">
        <h2>Array Visualization: Searching and Sorting</h2>
        <p className="description">
          Visualize and compare different array operations and algorithms
        </p>
      </header>
      
      <div className="algorithm-tabs">
        <div className="tab-group">
          <h3>Search Algorithms</h3>
          <button 
            className={`tab-button ${activeAlgorithm === 'linear-search' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('linear-search')}
          >
            Linear Search
          </button>
          <button 
            className={`tab-button ${activeAlgorithm === 'binary-search' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('binary-search')}
          >
            Binary Search
          </button>
        </div>
        
        <div className="tab-group">
          <h3>Simple Sorts</h3>
          <button 
            className={`tab-button ${activeAlgorithm === 'bubble-sort' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('bubble-sort')}
          >
            Bubble Sort
          </button>
          <button 
            className={`tab-button ${activeAlgorithm === 'insertion-sort' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('insertion-sort')}
          >
            Insertion Sort
          </button>
          <button 
            className={`tab-button ${activeAlgorithm === 'selection-sort' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('selection-sort')}
          >
            Selection Sort
          </button>
        </div>
        
        <div className="tab-group">
          <h3>Advanced Sorts</h3>
          <button 
            className={`tab-button ${activeAlgorithm === 'merge-sort' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('merge-sort')}
          >
            Merge Sort
          </button>
          <button 
            className={`tab-button ${activeAlgorithm === 'quick-sort' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('quick-sort')}
          >
            Quick Sort
          </button>
        </div>
      </div>
      
      <div className="array-content">
        <div className="controls-panel">
          <div className="array-controls">
            <h3>Array Operations</h3>
            
            <div className="input-group">
              <div className="input-field">
                <label>Value:</label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={handleArrayInputChange}
                  placeholder="Enter a number"
                  disabled={isAnimating}
                />
              </div>
              
              <div className="input-field">
                <label>Index:</label>
                <input
                  type="number"
                  value={inputIndex}
                  onChange={e => setInputIndex(e.target.value)}
                  placeholder="Enter index"
                  min="0"
                  max={array.length}
                  disabled={isAnimating}
                />
              </div>
            </div>
            
            <div className="button-group">
              <button 
                className="operation-button"
                onClick={handleAddValue}
                disabled={isAnimating}
              >
                Add Value
              </button>
              
              <button 
                className="operation-button"
                onClick={handleAddAtIndex}
                disabled={isAnimating}
              >
                Insert At Index
              </button>
              
              <button 
                className="operation-button"
                onClick={handleRemoveAtIndex}
                disabled={isAnimating}
              >
                Remove At Index
              </button>
            </div>
            
            <div className="button-group">
              <button 
                className="operation-button"
                onClick={handleGenerateArray}
                disabled={isAnimating}
              >
                Generate Random
              </button>
              
              <button 
                className="operation-button"
                onClick={handleResetArray}
                disabled={isAnimating}
              >
                Reset Array
              </button>
            </div>
          </div>
          
          {(activeAlgorithm === 'linear-search' || activeAlgorithm === 'binary-search') && (
            <div className="search-controls">
              <h3>Search Controls</h3>
              
              <div className="input-field">
                <label>Search For:</label>
                <input
                  type="number"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Enter value to search"
                  disabled={isAnimating}
                />
              </div>
              
              {searchResult && (
                <div className={`search-result ${searchResult.found ? 'found' : 'not-found'}`}>
                  {searchResult.found 
                    ? `Found at index ${searchResult.index}!` 
                    : 'Not found in array'}
                </div>
              )}
            </div>
          )}
          
          <div className="algorithm-controls">
            <h3>Algorithm Controls</h3>
            
            <div className="speed-control">
              <label>Animation Speed:</label>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={animationDelay}
                onChange={handleSpeedChange}
                disabled={isAnimating && !animationPaused}
                className="speed-slider"
              />
              <span className="speed-label">{getSpeedLabel(animationDelay)}</span>
            </div>
            
            <div className="button-group">
              <button
                className="start-button"
                onClick={startAlgorithmAnimation}
                disabled={isAnimating}
              >
                Start Algorithm
              </button>
              
              {isAnimating && (
                <button
                  className="pause-button"
                  onClick={toggleAnimationPause}
                >
                  {animationPaused ? 'Resume' : 'Pause'}
                </button>
              )}
            </div>
          </div>
          
          <div className="message-display">
            {message && <div className="operation-message">{message}</div>}
          </div>
        </div>
        
        <div className="visualization-panel">
          <h3>Current Array</h3>
          
          <div className="visualization-container">
            {renderArrayBars()}
          </div>
          
          <div className="array-legend">
            <div className="legend-item">
              <div className="legend-color normal"></div>
              <span>Normal</span>
            </div>
            <div className="legend-item">
              <div className="legend-color highlighted"></div>
              <span>Highlighted</span>
            </div>
            <div className="legend-item">
              <div className="legend-color comparing"></div>
              <span>Comparing</span>
            </div>
            <div className="legend-item">
              <div className="legend-color sorted"></div>
              <span>Sorted</span>
            </div>
            <div className="legend-item">
              <div className="legend-color pivot"></div>
              <span>Pivot</span>
            </div>
          </div>
        </div>
        
        <div className="info-panel">
          {renderAlgorithmContent()}
          
          <div className="comparison-info">
            <h3>Algorithm Comparison</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Best Case</th>
                  <th>Average Case</th>
                  <th>Worst Case</th>
                  <th>Space</th>
                  <th>Stable</th>
                </tr>
              </thead>
              <tbody>
                <tr className={activeAlgorithm === 'bubble-sort' ? 'highlighted-row' : ''}>
                  <td>Bubble Sort</td>
                  <td>O(n)</td>
                  <td>O(n²)</td>
                  <td>O(n²)</td>
                  <td>O(1)</td>
                  <td>Yes</td>
                </tr>
                <tr className={activeAlgorithm === 'insertion-sort' ? 'highlighted-row' : ''}>
                  <td>Insertion Sort</td>
                  <td>O(n)</td>
                  <td>O(n²)</td>
                  <td>O(n²)</td>
                  <td>O(1)</td>
                  <td>Yes</td>
                </tr>
                <tr className={activeAlgorithm === 'selection-sort' ? 'highlighted-row' : ''}>
                  <td>Selection Sort</td>
                  <td>O(n²)</td>
                  <td>O(n²)</td>
                  <td>O(n²)</td>
                  <td>O(1)</td>
                  <td>No</td>
                </tr>
                <tr className={activeAlgorithm === 'merge-sort' ? 'highlighted-row' : ''}>
                  <td>Merge Sort</td>
                  <td>O(n log n)</td>
                  <td>O(n log n)</td>
                  <td>O(n log n)</td>
                  <td>O(n)</td>
                  <td>Yes</td>
                </tr>
                <tr className={activeAlgorithm === 'quick-sort' ? 'highlighted-row' : ''}>
                  <td>Quick Sort</td>
                  <td>O(n log n)</td>
                  <td>O(n log n)</td>
                  <td>O(n²)</td>
                  <td>O(log n)</td>
                  <td>No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualization;