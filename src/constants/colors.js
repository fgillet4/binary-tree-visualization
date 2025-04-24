/**
 * colors.js
 * Color constants for tree visualization
 */

export const COLORS = {
    // Node background colors
    NODE_NORMAL: '#ffffff',       // White - default state
    NODE_HIGHLIGHT: '#ffd700',    // Yellow - being examined
    NODE_SEARCHING: '#ff9900',    // Orange - in search path
    NODE_FOUND: '#00cc66',        // Green - found value
    NODE_INSERTING: '#66ccff',    // Light blue - being inserted
    NODE_DELETING: '#ff6666',     // Light red - being deleted
    NODE_WARNING: '#ff3333',      // Bright red - error state
    
    // Node border colors
    BORDER_NORMAL: '#333333',     // Dark gray - default border
    BORDER_HIGHLIGHT: '#000000',  // Black - highlighted node border
    BORDER_EMPHASIS: '#0066cc',   // Blue - emphasized node
    
    // Edge colors
    EDGE_NORMAL: '#666666',       // Gray - normal edge
    EDGE_HIGHLIGHT: '#ff9900',    // Orange - highlighted edge
    EDGE_INSERTING: '#66ccff',    // Light blue - insertion path
    EDGE_DELETING: '#ff6666',     // Light red - deletion path
    
    // Animation colors - for sequence visualization
    ANIM_STEP_1: '#e6f7ff',       // Lightest blue
    ANIM_STEP_2: '#b3e0ff',       // Light blue
    ANIM_STEP_3: '#80caff',       // Medium light blue
    ANIM_STEP_4: '#4db8ff',       // Medium blue
    ANIM_STEP_5: '#1aa3ff',       // Darker blue
    
    // Text colors
    TEXT_NORMAL: '#000000',       // Black - normal text
    TEXT_HIGHLIGHT: '#ffffff',    // White - text on dark backgrounds
    TEXT_EMPHASIS: '#0066cc',     // Blue - emphasized text
    
    // UI elements
    BUTTON_PRIMARY: '#4d94ff',    // Blue - primary button
    BUTTON_SUCCESS: '#00cc66',    // Green - success button
    BUTTON_WARNING: '#ff9900',    // Orange - warning button
    BUTTON_DANGER: '#ff4d4d',     // Red - danger button
    BACKGROUND: '#f8f9fa',        // Light gray - app background
    
    // Animation state mapping - map state names to actual colors
    STATE_COLORS: {
      'normal': '#ffffff',
      'highlight': '#ffd700',
      'searching': '#ff9900',
      'found': '#00cc66',
      'inserting': '#66ccff',
      'deleting': '#ff6666',
      'warning': '#ff3333'
    }
  };