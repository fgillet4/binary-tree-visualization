/**
 * animationUtils.js
 * Utilities for tree operation animations
 */

/**
 * Applies animation states to tree nodes based on animation history
 * @param {Object} tree - The binary search tree
 * @param {Array} animations - Animation history
 * @param {number} currentStep - The current animation step
 * @returns {Object} Updated tree with highlight states
 */
export const applyAnimationStep = (tree, animations, currentStep) => {
    if (!tree || !tree.root || !animations || animations.length === 0) {
      return tree;
    }
    
    // Reset all node highlight states
    const resetHighlights = (node) => {
      if (!node) return;
      node.highlightState = 'normal';
      resetHighlights(node.left);
      resetHighlights(node.right);
    };
    
    resetHighlights(tree.root);
    
    // Apply highlights for all steps up to the current one
    for (let i = 0; i <= currentStep && i < animations.length; i++) {
      const animation = animations[i];
      
      switch (animation.type) {
        case 'insert':
          applyInsertAnimation(animation);
          break;
        case 'search':
          applySearchAnimation(animation);
          break;
        case 'delete':
          applyDeleteAnimation(animation);
          break;
        default:
          break;
      }
    }
    
    return tree;
    
    // Helper functions for different animation types
    function applyInsertAnimation(animation) {
      const { node, step } = animation;
      if (!node) return;
      
      switch (step) {
        case 'comparing':
          node.highlightState = 'highlight';
          break;
        case 'goLeft':
          node.highlightState = 'highlight';
          break;
        case 'goRight':
          node.highlightState = 'highlight';
          break;
        case 'complete':
          node.highlightState = 'inserting';
          break;
        default:
          break;
      }
    }
    
    function applySearchAnimation(animation) {
      const { node, step } = animation;
      if (!node && step !== 'notFound') return;
      
      switch (step) {
        case 'visiting':
          node.highlightState = 'highlight';
          break;
        case 'goLeft':
        case 'goRight':
          node.highlightState = 'searching';
          break;
        case 'found':
          node.highlightState = 'found';
          break;
        default:
          break;
      }
    }
    
    function applyDeleteAnimation(animation) {
      const { node, step } = animation;
      if (!node && !['notFound', 'complete'].includes(step)) return;
      
      switch (step) {
        case 'visiting':
          node.highlightState = 'highlight';
          break;
        case 'goLeft':
        case 'goRight':
          node.highlightState = 'searching';
          break;
        case 'found':
          node.highlightState = 'highlight';
          break;
        case 'removeLeaf':
        case 'replaceWithLeft':
        case 'replaceWithRight':
        case 'replaceWithSuccessor':
          node.highlightState = 'deleting';
          break;
        case 'findSuccessor':
        case 'findingMin':
        case 'foundSuccessor':
          node.highlightState = 'highlight';
          break;
        default:
          break;
      }
    }
  };