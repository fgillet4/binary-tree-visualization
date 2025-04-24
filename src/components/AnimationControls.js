/**
 * AnimationControls.js
 * Controls for animation speed and playback
 */

import React from 'react';

const AnimationControls = ({
  animationInProgress,
  animationSpeed,
  onAnimationSpeedChange,
  onAnimationToggle,
}) => {
  // Convert animation speed value to a readable label
  const getSpeedLabel = (speed) => {
    // Speed values are in ms between steps (lower = faster)
    if (speed <= 200) return 'Fast';
    if (speed <= 500) return 'Normal';
    if (speed <= 1000) return 'Slow';
    return 'Very Slow';
  };
  
  return (
    <div className="animation-controls">
      <div className="speed-control">
        <label htmlFor="animation-speed">Animation Speed:</label>
        <input
          id="animation-speed"
          type="range"
          min="100"
          max="1500"
          step="100"
          value={animationSpeed}
          onChange={(e) => onAnimationSpeedChange(parseInt(e.target.value, 10))}
          disabled={!animationInProgress}
          className="speed-slider"
        />
        <span className="speed-label">{getSpeedLabel(animationSpeed)}</span>
      </div>
      
      {/* Pause/Resume button only shown during animations */}
      {animationInProgress && (
        <button
          onClick={onAnimationToggle}
          className="animation-toggle-button"
        >
          {animationInProgress === 'paused' ? 'Resume' : 'Pause'}
        </button>
      )}
    </div>
  );
};

export default AnimationControls;