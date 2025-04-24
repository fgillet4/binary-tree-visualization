/**
 * educationalContent.js
 * Educational text content about binary search trees
 */

export const EDUCATIONAL_CONTENT = {
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
  };