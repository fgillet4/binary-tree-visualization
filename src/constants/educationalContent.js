/**
 * educationalContent.js
 * Educational text content about binary search trees and binary heaps
 */

export const EDUCATIONAL_CONTENT = {
  // Binary Search Tree content
  bst: {
    // Introduction to binary search trees
    introduction: {
      title: "Binary Search Trees",
      content: `
        A Binary Search Tree (BST) is a tree data structure where each node has at most two children 
        (left and right), and all nodes follow the BST property: nodes in the left subtree have values 
        less than the node's value, and nodes in the right subtree have values greater than or equal to 
        the node's value.
        
        This property makes BSTs efficient for many operations like search, insertion, and deletion,
        with average-case time complexity of O(log n), where n is the number of nodes.
      `
    },
    
    // Operation details
    operations: {
      insert: {
        title: "Insertion in BST",
        content: `
          To insert a value in a BST:
          
          1. Start at the root
          2. If the tree is empty, create a new node as the root
          3. Otherwise, compare the value with the current node:
             - If the value is less, go to the left child
             - If the value is greater or equal, go to the right child
          4. Repeat until finding an empty spot (null reference)
          5. Create a new node at that position
          
          Time Complexity: Average O(log n), Worst O(n)
        `
      },
      search: {
        title: "Searching in BST",
        content: `
          To search for a value in a BST:
          
          1. Start at the root
          2. Compare the value with the current node:
             - If equal, the value is found
             - If less, go to the left child
             - If greater, go to the right child
          3. Repeat until finding the value or reaching a null reference (not found)
          
          Time Complexity: Average O(log n), Worst O(n)
        `
      },
      delete: {
        title: "Deletion in BST",
        content: `
          Deleting a node from a BST is more complex and involves three cases:
          
          1. Node with no children (leaf): Simply remove the node
          2. Node with one child: Replace the node with its child
          3. Node with two children:
             - Find the inorder successor (smallest value in right subtree)
             - Replace the node's value with the successor's value
             - Delete the successor node (which has at most one child)
          
          Time Complexity: Average O(log n), Worst O(n)
        `
      },
      traversal: {
        title: "Tree Traversal Methods",
        content: `
          Binary trees can be traversed in different orders:
          
          - Inorder (Left, Root, Right): Visits nodes in ascending order in a BST
          - Preorder (Root, Left, Right): Useful for copying the tree
          - Postorder (Left, Right, Root): Useful for deleting the tree
          - Level Order: Visits nodes level by level, from left to right
          
          Time Complexity: O(n) for all traversal methods
        `
      }
    },
    
    // Time complexity information
    timeComplexity: {
      title: "Time Complexity of BST Operations",
      content: `
        The efficiency of BST operations depends on the tree's height:
        
        - Balanced tree: Height is O(log n)
        - Degenerate tree (like a linked list): Height is O(n)
        
        Operation | Average Case | Worst Case
        --------- | ------------ | ----------
        Search    | O(log n)     | O(n)
        Insert    | O(log n)     | O(n)
        Delete    | O(log n)     | O(n)
        
        To ensure O(log n) performance, balanced BST variants like AVL trees or 
        Red-Black trees can be used.
      `
    },
    
    // Tips for understanding
    tips: [
      "The 'Binary Search' in BST refers to how values are organized (left < node < right), similar to binary search on sorted arrays.",
      "A BST's inorder traversal always produces values in ascending order.",
      "An empty BST is still a valid BST.",
      "BSTs can become unbalanced, leading to worst-case O(n) performance.",
      "Self-balancing variants like AVL and Red-Black trees maintain O(log n) operations.",
      "Duplicate values are handled differently in different implementations (here they go to the right)."
    ],
    
    // Practical applications
    applications: {
      title: "Applications of Binary Search Trees",
      content: `
        BSTs are used in many real-world applications:
        
        - Implementing set and map data structures
        - Database indexing
        - Priority queues
        - Expression evaluation
        - Syntax trees in compilers
        - Hierarchical data organization
      `
    },
    
    // Comparison with other data structures
    comparison: {
      title: "Comparison with Other Data Structures",
      content: `
        Data Structure | Search    | Insert    | Delete    | Space    | Ordered
        -------------- | --------- | --------- | --------- | -------- | -------
        Array          | O(n)      | O(1)/O(n) | O(n)      | O(n)     | No
        Sorted Array   | O(log n)  | O(n)      | O(n)      | O(n)     | Yes
        Linked List    | O(n)      | O(1)      | O(n)      | O(n)     | No
        BST (balanced) | O(log n)  | O(log n)  | O(log n)  | O(n)     | Yes
        BST (worst)    | O(n)      | O(n)      | O(n)      | O(n)     | Yes
        Hash Table     | O(1)      | O(1)      | O(1)      | O(n)     | No
      `
    }
  },
  
  // Binary Heap content
  heap: {
    // Introduction to binary heaps
    introduction: {
      title: "Binary Heaps",
      content: `
        A Binary Heap is a complete binary tree that satisfies the heap property. In a complete 
        binary tree, all levels are fully filled except possibly the last level, which is filled 
        from left to right.
        
        There are two types of binary heaps:
        - Min Heap: The value of each node is greater than or equal to its parent (min at root)
        - Max Heap: The value of each node is less than or equal to its parent (max at root)
        
        Binary heaps are commonly implemented using arrays, where for a node at index i:
        - Parent is at index (i-1)/2
        - Left child is at index 2i+1
        - Right child is at index 2i+2
      `
    },
    
    // Operation details
    operations: {
      insert: {
        title: "Insertion in Heap",
        content: `
          To insert a value into a binary heap:
          
          1. Add the new element at the end of the heap (last level, leftmost available position)
          2. Compare it with its parent:
             - For Min Heap: If smaller than parent, swap
             - For Max Heap: If larger than parent, swap
          3. Continue comparing and swapping up the tree (heapify-up) until the heap property is restored
          
          Time Complexity: O(log n) in worst case
        `
      },
      extractRoot: {
        title: "Extract Root from Heap",
        content: `
          Extracting the root (min value in Min Heap, max value in Max Heap):
          
          1. Store the root value to return it
          2. Replace the root with the last element in the heap
          3. Remove the last element
          4. Compare the new root with its children:
             - For Min Heap: Swap with the smaller child if it's smaller than the current node
             - For Max Heap: Swap with the larger child if it's larger than the current node
          5. Continue comparing and swapping down the tree (heapify-down) until the heap property is restored
          
          Time Complexity: O(log n) in worst case
        `
      },
      heapify: {
        title: "Building a Heap (Heapify)",
        content: `
          To build a heap from an unsorted array:
          
          1. Start with the raw array
          2. Find the last non-leaf node (index (n/2)-1, where n is size of the array)
          3. Perform heapify-down operation on each node from the last non-leaf node down to the root
          
          This bottom-up approach builds a valid heap in O(n) time, which is more efficient than 
          inserting elements one-by-one.
          
          Time Complexity: O(n) surprisingly (not O(n log n) as might be expected)
        `
      }
    },
    
    // Time complexity information
    timeComplexity: {
      title: "Time Complexity of Heap Operations",
      content: `
        Binary heaps provide efficient operations with the following time complexities:
        
        Operation       | Time Complexity
        --------------- | --------------
        Find Min/Max    | O(1)
        Insert          | O(log n)
        Extract Min/Max | O(log n)
        Heapify (build) | O(n)
        Delete          | O(log n)
        
        Unlike binary search trees, heaps are always complete binary trees, so they never degenerate 
        into O(n) performance like an unbalanced BST can.
      `
    },
    
    // Tips for understanding
    tips: [
      "The heap is always a complete binary tree, meaning it's filled at all levels except possibly the last, which is filled from left to right.",
      "Heaps are not designed for searching for arbitrary elements (would require O(n) time).",
      "A binary heap can be efficiently represented as an array without pointers.",
      "Heaps are the underlying data structure for heap sort and priority queues.",
      "In a min heap, the minimum element is always at the root, making it O(1) to find.",
      "The array representation makes binary heaps very memory-efficient compared to node-pointer-based trees."
    ],
    
    // Practical applications
    applications: {
      title: "Applications of Binary Heaps",
      content: `
        Binary heaps are used in various applications:
        
        - Priority Queues: Efficiently maintain a collection with quick access to highest/lowest priority element
        - Heap Sort: An efficient comparison-based sorting algorithm
        - Graph Algorithms: Dijkstra's shortest path and Prim's minimum spanning tree
        - Operating Systems: Process scheduling
        - Event-driven simulation
        - Media streaming
      `
    },
    
    // Comparison with other priority queue implementations
    comparison: {
      title: "Heap vs Other Priority Queue Implementations",
      content: `
        Data Structure      | Extract Min/Max | Insert    | Build      | Space
        ------------------- | --------------- | --------- | ---------- | --------
        Unsorted Array      | O(n)            | O(1)      | O(n)       | O(n)
        Sorted Array        | O(1)            | O(n)      | O(n log n) | O(n)
        Binary Heap         | O(log n)        | O(log n)  | O(n)       | O(n)
        Binomial Heap       | O(log n)        | O(1)*     | O(n)       | O(n)
        Fibonacci Heap      | O(log n)        | O(1)*     | O(n)       | O(n)
        
        * Amortized time complexity
        
        Binary heaps offer a good balance of simplicity and performance for most applications.
      `
    },
    
    // Heap vs BST
    vsBST: {
      title: "Binary Heap vs Binary Search Tree",
      content: `
        Binary Heap:
        - Always complete binary tree (predictable shape)
        - Faster insertion/deletion in worst case (O(log n) guaranteed)
        - O(1) access to min/max element
        - Cannot efficiently search for arbitrary elements (O(n))
        - More memory-efficient (array-based implementation)
        - Simpler implementation
        
        Binary Search Tree:
        - May become unbalanced (unless using self-balancing variants)
        - O(log n) for all operations only if balanced
        - Efficient searching for any element (O(log n) if balanced)
        - In-order traversal gives sorted order
        - Supports operations like predecessor, successor, range queries
        - More complex implementation (especially for balanced variants)
      `
    }
  }
};