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
    if (speed <= 2000) return 'Very Slow';
    if (speed <= 3000) return 'Super Slow';
    return 'Extremely Slow';
  };
  
  return (
    <div className="animation-controls">
      <div className="speed-control">
        <label htmlFor="animation-speed">Animation Speed:</label>
        <input
          id="animation-speed"
          type="range"
          min="100"
          max="4000"
          step="100"
          value={animationSpeed}
          onChange={(e) => onAnimationSpeedChange(parseInt(e.target.value, 10))}
          disabled={animationInProgress === false}
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
      
      <div className="speed-presets">
        <button 
          className="speed-preset-button"
          onClick={() => onAnimationSpeedChange(200)}
          disabled={animationInProgress === false}
        >
          Fast
        </button>
        <button 
          className="speed-preset-button"
          onClick={() => onAnimationSpeedChange(1000)}
          disabled={animationInProgress === false}
        >
          Slow
        </button>
        <button 
          className="speed-preset-button"
          onClick={() => onAnimationSpeedChange(3000)}
          disabled={animationInProgress === false}
        >
          Very Slow
        </button>
      </div>
    </div>
  );
};

export default AnimationControls;