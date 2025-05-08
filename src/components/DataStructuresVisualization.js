/**
 * DataStructuresVisualization.js
 * Component for visualizing and comparing various data structures
 * like Sets, Maps, Objects, etc.
 */

import React, { useState, useEffect } from 'react';

const DataStructuresVisualization = () => {
  // State to track data for each structure
  const [setData, setSetData] = useState(new Set(['apple', 'banana', 'cherry']));
  const [mapData, setMapData] = useState(new Map([
    ['name', 'John'],
    ['age', 30],
    ['city', 'New York']
  ]));
  const [objectData, setObjectData] = useState({
    name: 'Jane',
    age: 28,
    city: 'San Francisco'
  });

  // Selected data structure
  const [activeStructure, setActiveStructure] = useState('set'); // 'set', 'map', 'object'
  
  // Key-value inputs
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [message, setMessage] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  
  // Animation and visualization
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [operationSteps, setOperationSteps] = useState([]);
  
  // Methods to manipulate data structures
  const handleAdd = () => {
    if (!keyInput && activeStructure !== 'set') {
      setMessage('Please enter a key');
      return;
    }
    
    if (!valueInput && activeStructure !== 'set') {
      setMessage('Please enter a value');
      return;
    }
    
    if (activeStructure === 'set') {
      if (!valueInput) {
        setMessage('Please enter a value to add to the set');
        return;
      }
      
      // Animation steps for Set
      const steps = [
        { type: 'message', content: `Adding "${valueInput}" to Set...` },
        { type: 'highlight', content: valueInput },
        { type: 'message', content: `Checking if "${valueInput}" already exists...` },
        { type: 'result', exists: setData.has(valueInput) }
      ];
      
      setOperationSteps(steps);
      startAnimation(() => {
        // Operation that will execute after animation
        const newSet = new Set(setData);
        newSet.add(valueInput);
        setSetData(newSet);
        setMessage(setData.has(valueInput) 
          ? `Value "${valueInput}" already exists in Set (Sets only store unique values)` 
          : `Added "${valueInput}" to Set`);
        setValueInput('');
      });
    } else if (activeStructure === 'map') {
      // Animation steps for Map
      const steps = [
        { type: 'message', content: `Adding key-value pair: "${keyInput}" => "${valueInput}"...` },
        { type: 'highlight', content: keyInput },
        { type: 'message', content: `Checking if key "${keyInput}" already exists...` },
        { type: 'result', exists: mapData.has(keyInput) }
      ];
      
      setOperationSteps(steps);
      startAnimation(() => {
        // Operation that will execute after animation
        const newMap = new Map(mapData);
        newMap.set(keyInput, valueInput);
        setMapData(newMap);
        setMessage(mapData.has(keyInput) 
          ? `Updated key "${keyInput}" with value "${valueInput}"` 
          : `Added new key-value pair: "${keyInput}" => "${valueInput}"`);
        setKeyInput('');
        setValueInput('');
      });
    } else if (activeStructure === 'object') {
      // Animation steps for Object
      const steps = [
        { type: 'message', content: `Adding property: "${keyInput}" => "${valueInput}"...` },
        { type: 'highlight', content: keyInput },
        { type: 'message', content: `Checking if property "${keyInput}" already exists...` },
        { type: 'result', exists: keyInput in objectData }
      ];
      
      setOperationSteps(steps);
      startAnimation(() => {
        // Operation that will execute after animation
        const newObject = { ...objectData };
        newObject[keyInput] = valueInput;
        setObjectData(newObject);
        setMessage(keyInput in objectData 
          ? `Updated property "${keyInput}" with value "${valueInput}"` 
          : `Added new property: "${keyInput}" => "${valueInput}"`);
        setKeyInput('');
        setValueInput('');
      });
    }
  };
  
  const handleDelete = () => {
    if (!keyInput && activeStructure !== 'set') {
      setMessage('Please enter a key to delete');
      return;
    }
    
    if (!valueInput && activeStructure === 'set') {
      setMessage('Please enter a value to delete from the set');
      return;
    }
    
    if (activeStructure === 'set') {
      // Animation steps for Set deletion
      const steps = [
        { type: 'message', content: `Deleting "${valueInput}" from Set...` },
        { type: 'highlight', content: valueInput },
        { type: 'message', content: `Checking if "${valueInput}" exists...` },
        { type: 'result', exists: setData.has(valueInput) }
      ];
      
      setOperationSteps(steps);
      startAnimation(() => {
        // Operation that will execute after animation
        const newSet = new Set(setData);
        const didDelete = newSet.delete(valueInput);
        setSetData(newSet);
        setMessage(didDelete 
          ? `Deleted "${valueInput}" from Set` 
          : `Value "${valueInput}" not found in Set`);
        setValueInput('');
      });
    } else if (activeStructure === 'map') {
      // Animation steps for Map deletion
      const steps = [
        { type: 'message', content: `Deleting key "${keyInput}" from Map...` },
        { type: 'highlight', content: keyInput },
        { type: 'message', content: `Checking if key "${keyInput}" exists...` },
        { type: 'result', exists: mapData.has(keyInput) }
      ];
      
      setOperationSteps(steps);
      startAnimation(() => {
        // Operation that will execute after animation
        const newMap = new Map(mapData);
        const didDelete = newMap.delete(keyInput);
        setMapData(newMap);
        setMessage(didDelete 
          ? `Deleted key "${keyInput}" from Map` 
          : `Key "${keyInput}" not found in Map`);
        setKeyInput('');
      });
    } else if (activeStructure === 'object') {
      // Animation steps for Object deletion
      const steps = [
        { type: 'message', content: `Deleting property "${keyInput}" from Object...` },
        { type: 'highlight', content: keyInput },
        { type: 'message', content: `Checking if property "${keyInput}" exists...` },
        { type: 'result', exists: keyInput in objectData }
      ];
      
      setOperationSteps(steps);
      startAnimation(() => {
        // Operation that will execute after animation
        const newObject = { ...objectData };
        const didExist = keyInput in newObject;
        delete newObject[keyInput];
        setObjectData(newObject);
        setMessage(didExist 
          ? `Deleted property "${keyInput}" from Object` 
          : `Property "${keyInput}" not found in Object`);
        setKeyInput('');
      });
    }
  };
  
  const handleSearch = () => {
    const searchTerm = searchKey.trim();
    if (!searchTerm) {
      setMessage('Please enter a value to search for');
      return;
    }
    
    if (activeStructure === 'set') {
      // Animation steps for Set search
      const steps = [
        { type: 'message', content: `Searching for "${searchTerm}" in Set...` },
        { type: 'highlight', content: searchTerm },
        { type: 'message', content: `Checking if "${searchTerm}" exists...` },
        { type: 'result', exists: setData.has(searchTerm) }
      ];
      
      setOperationSteps(steps);
      startAnimation(() => {
        // Operation that will execute after animation
        const exists = setData.has(searchTerm);
        setSearchResult(exists ? 'Found' : 'Not found');
        setMessage(exists 
          ? `Found "${searchTerm}" in Set` 
          : `Value "${searchTerm}" not found in Set`);
        setHighlightedItem(exists ? searchTerm : null);
      });
    } else if (activeStructure === 'map') {
      // Animation steps for Map search
      const steps = [
        { type: 'message', content: `Searching for key "${searchTerm}" in Map...` },
        { type: 'highlight', content: searchTerm },
        { type: 'message', content: `Checking if key "${searchTerm}" exists...` },
        { type: 'result', exists: mapData.has(searchTerm) }
      ];
      
      setOperationSteps(steps);
      startAnimation(() => {
        // Operation that will execute after animation
        const exists = mapData.has(searchTerm);
        const value = exists ? mapData.get(searchTerm) : null;
        setSearchResult(exists ? value : 'Not found');
        setMessage(exists 
          ? `Found key "${searchTerm}" with value "${value}" in Map` 
          : `Key "${searchTerm}" not found in Map`);
        setHighlightedItem(exists ? searchTerm : null);
      });
    } else if (activeStructure === 'object') {
      // Animation steps for Object search
      const steps = [
        { type: 'message', content: `Searching for property "${searchTerm}" in Object...` },
        { type: 'highlight', content: searchTerm },
        { type: 'message', content: `Checking if property "${searchTerm}" exists...` },
        { type: 'result', exists: searchTerm in objectData }
      ];
      
      setOperationSteps(steps);
      startAnimation(() => {
        // Operation that will execute after animation
        const exists = searchTerm in objectData;
        const value = exists ? objectData[searchTerm] : null;
        setSearchResult(exists ? value : 'Not found');
        setMessage(exists 
          ? `Found property "${searchTerm}" with value "${value}" in Object` 
          : `Property "${searchTerm}" not found in Object`);
        setHighlightedItem(exists ? searchTerm : null);
      });
    }
  };
  
  // Reset search when changing structures
  useEffect(() => {
    setSearchResult(null);
    setHighlightedItem(null);
    setSearchKey('');
  }, [activeStructure]);
  
  // Animation control
  const startAnimation = (callback) => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    // Reset search result at the start of a new operation
    setSearchResult(null);
    setHighlightedItem(null);
    
    const animationInterval = setInterval(() => {
      setAnimationStep(prevStep => {
        const nextStep = prevStep + 1;
        
        // Check if animation is complete
        if (nextStep >= operationSteps.length) {
          clearInterval(animationInterval);
          setIsAnimating(false);
          
          // Execute the operation after animation completes
          if (callback) callback();
          
          return 0; // Reset step
        }
        
        // Handle highlight step
        if (operationSteps[nextStep].type === 'highlight') {
          setHighlightedItem(operationSteps[nextStep].content);
        }
        
        return nextStep;
      });
    }, 1000); // 1 second delay between steps
    
    return () => clearInterval(animationInterval);
  };
  
  // Reset all data
  const handleReset = () => {
    if (activeStructure === 'set') {
      setSetData(new Set(['apple', 'banana', 'cherry']));
    } else if (activeStructure === 'map') {
      setMapData(new Map([
        ['name', 'John'],
        ['age', 30],
        ['city', 'New York']
      ]));
    } else if (activeStructure === 'object') {
      setObjectData({
        name: 'Jane',
        age: 28,
        city: 'San Francisco'
      });
    }
    
    setMessage(`Reset ${activeStructure} to default values`);
    setSearchResult(null);
    setHighlightedItem(null);
  };
  
  // Render structure-specific visualizations
  const renderSetVisualization = () => {
    // Convert set to array for rendering
    const items = Array.from(setData);
    
    return (
      <div className="set-visualization">
        <div className="set-container">
          {items.length === 0 ? (
            <div className="empty-set">Empty Set</div>
          ) : (
            items.map((item, index) => (
              <div 
                key={index} 
                className={`set-item ${item === highlightedItem ? 'highlighted' : ''}`}
              >
                {item}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  const renderMapVisualization = () => {
    // Convert map to array for rendering
    const entries = Array.from(mapData.entries());
    
    return (
      <div className="map-visualization">
        <div className="map-container">
          {entries.length === 0 ? (
            <div className="empty-map">Empty Map</div>
          ) : (
            entries.map(([key, value], index) => (
              <div 
                key={index} 
                className={`map-entry ${key === highlightedItem ? 'highlighted' : ''}`}
              >
                <div className="map-key">{key}</div>
                <div className="map-arrow">→</div>
                <div className="map-value">{value.toString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  const renderObjectVisualization = () => {
    // Convert object to entries for rendering
    const entries = Object.entries(objectData);
    
    return (
      <div className="object-visualization">
        <div className="object-container">
          {entries.length === 0 ? (
            <div className="empty-object">Empty Object</div>
          ) : (
            <div className="object-bracket">{'{'}</div>
          )}
          
          <div className="object-properties">
            {entries.map(([key, value], index) => (
              <div 
                key={index} 
                className={`object-prop ${key === highlightedItem ? 'highlighted' : ''}`}
              >
                <span className="object-key">"{key}"</span>
                <span className="object-colon">: </span>
                <span className="object-value">
                  {typeof value === 'string' ? `"${value}"` : value.toString()}
                </span>
                {index < entries.length - 1 && <span className="object-comma">,</span>}
              </div>
            ))}
          </div>
          
          {entries.length > 0 && (
            <div className="object-bracket">{'}'}</div>
          )}
        </div>
      </div>
    );
  };
  
  // Render help text for each data structure
  const renderStructureInfo = () => {
    const structureInfo = {
      set: {
        title: 'Set',
        description: 'A collection of unique values with no duplicates.',
        timeComplexity: {
          add: 'O(1)',
          delete: 'O(1)',
          has: 'O(1)'
        },
        usage: 'Used when you need to store unique values and quickly check if a value exists.',
        examples: [
          'Filtering out duplicate values',
          'Checking for presence of elements',
          'Mathematical set operations (union, intersection)'
        ],
        syntax: `
const mySet = new Set();
mySet.add('value');  // Add a value
mySet.delete('value');  // Remove a value
mySet.has('value');  // Check if a value exists
mySet.size;  // Get the number of values`
      },
      map: {
        title: 'Map',
        description: 'A collection of key-value pairs where keys are unique.',
        timeComplexity: {
          set: 'O(1)',
          delete: 'O(1)',
          get: 'O(1)',
          has: 'O(1)'
        },
        usage: 'Used when you need to associate values with keys and retrieve them efficiently.',
        examples: [
          'Caching results by a unique key',
          'Storing user data keyed by user ID',
          'Counting occurrences of items'
        ],
        syntax: `
const myMap = new Map();
myMap.set('key', 'value');  // Add or update a key-value pair
myMap.delete('key');  // Remove a key-value pair
myMap.get('key');  // Get the value for a key
myMap.has('key');  // Check if a key exists
myMap.size;  // Get the number of key-value pairs`
      },
      object: {
        title: 'Object',
        description: 'A collection of key-value pairs where keys are strings or symbols.',
        timeComplexity: {
          add: 'O(1)',
          delete: 'O(1)',
          access: 'O(1)',
          in: 'O(1)'
        },
        usage: 'Used for storing structured data and as a fundamental building block in JavaScript.',
        examples: [
          'Storing configuration settings',
          'Representing entities with properties',
          'JSON data structure'
        ],
        syntax: `
const myObject = {};
myObject['key'] = 'value';  // Add or update a property
// OR
myObject.key = 'value';
delete myObject.key;  // Remove a property
myObject.key;  // Access a property
'key' in myObject;  // Check if a property exists
Object.keys(myObject).length;  // Get the number of properties`
      }
    };
    
    const info = structureInfo[activeStructure];
    
    return (
      <div className="structure-info">
        <h3>{info.title}</h3>
        <p className="structure-description">{info.description}</p>
        
        <div className="time-complexity">
          <h4>Time Complexity</h4>
          <table className="complexity-table">
            <tbody>
              {Object.entries(info.timeComplexity).map(([operation, complexity], index) => (
                <tr key={index}>
                  <td className="operation">{operation}</td>
                  <td className="complexity">{complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="structure-usage">
          <h4>When to Use</h4>
          <p>{info.usage}</p>
          <h4>Examples</h4>
          <ul>
            {info.examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>
        
        <div className="structure-syntax">
          <h4>Syntax</h4>
          <pre>
            <code>{info.syntax}</code>
          </pre>
        </div>
      </div>
    );
  };
  
  // Compare with other data structures
  const renderComparison = () => {
    return (
      <div className="structure-comparison">
        <h3>Data Structure Comparison</h3>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Set</th>
              <th>Map</th>
              <th>Object</th>
              <th>Array</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Key Type</td>
              <td>N/A (values only)</td>
              <td>Any (objects, functions, primitives)</td>
              <td>Strings, Symbols</td>
              <td>Numeric indices</td>
            </tr>
            <tr>
              <td>Ordered</td>
              <td>Yes (insertion order)</td>
              <td>Yes (insertion order)</td>
              <td>Partially (string keys are sorted)</td>
              <td>Yes (by index)</td>
            </tr>
            <tr>
              <td>Iteration</td>
              <td>forEach, for...of</td>
              <td>forEach, for...of</td>
              <td>Object.keys, Object.entries</td>
              <td>forEach, for...of</td>
            </tr>
            <tr>
              <td>Size/Length</td>
              <td>size property</td>
              <td>size property</td>
              <td>Object.keys(obj).length</td>
              <td>length property</td>
            </tr>
            <tr>
              <td>Performance</td>
              <td>Fast lookups</td>
              <td>Fast lookups</td>
              <td>Fast lookups</td>
              <td>Fast by index, slow for search</td>
            </tr>
            <tr>
              <td>Use Case</td>
              <td>Unique values</td>
              <td>Key-value with any key type</td>
              <td>Simple key-value store</td>
              <td>Ordered collection</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  // Animation display
  const renderAnimationStep = () => {
    if (!isAnimating || operationSteps.length === 0) return null;
    
    const currentStep = operationSteps[animationStep];
    if (!currentStep) return null;
    
    return (
      <div className="animation-container">
        <div className="animation-step">
          {currentStep.type === 'message' && (
            <div className="animation-message">{currentStep.content}</div>
          )}
          {currentStep.type === 'result' && (
            <div className={`animation-result ${currentStep.exists ? 'success' : 'failure'}`}>
              {currentStep.exists ? 'Found!' : 'Not found!'}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="data-structures-container">
      <header className="data-structures-header">
        <h1>Data Structures Visualization</h1>
        <p className="description">
          Interactive visualization of key-value collections: Set, Map, and Object
        </p>
      </header>
      
      <div className="structure-tabs">
        <button 
          className={`tab-button ${activeStructure === 'set' ? 'active' : ''}`}
          onClick={() => setActiveStructure('set')}
        >
          Set
        </button>
        <button 
          className={`tab-button ${activeStructure === 'map' ? 'active' : ''}`}
          onClick={() => setActiveStructure('map')}
        >
          Map
        </button>
        <button 
          className={`tab-button ${activeStructure === 'object' ? 'active' : ''}`}
          onClick={() => setActiveStructure('object')}
        >
          Object
        </button>
      </div>
      
      <div className="data-structure-content">
        <div className="controls-panel">
          <div className="operation-controls">
            <h3>Operations</h3>
            
            <div className="input-group">
              {activeStructure !== 'set' && (
                <div className="input-field">
                  <label>Key:</label>
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder={activeStructure === 'map' ? "Enter key" : "Enter property name"}
                    disabled={isAnimating}
                  />
                </div>
              )}
              
              <div className="input-field">
                <label>{activeStructure === 'set' ? 'Value:' : 'Value:'}</label>
                <input
                  type="text"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  placeholder={activeStructure === 'set' ? "Enter value" : "Enter value"}
                  disabled={isAnimating}
                />
              </div>
            </div>
            
            <div className="button-group">
              <button 
                className="operation-button add-button"
                onClick={handleAdd}
                disabled={isAnimating}
              >
                {activeStructure === 'set' ? 'Add' : 'Add/Update'}
              </button>
              
              <button 
                className="operation-button delete-button"
                onClick={handleDelete}
                disabled={isAnimating}
              >
                Delete
              </button>
              
              <button 
                className="operation-button reset-button"
                onClick={handleReset}
                disabled={isAnimating}
              >
                Reset
              </button>
            </div>
            
            <div className="search-group">
              <div className="input-field">
                <label>Search:</label>
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder={activeStructure === 'set' ? "Search value" : "Search key"}
                  disabled={isAnimating}
                />
              </div>
              
              <button 
                className="operation-button search-button"
                onClick={handleSearch}
                disabled={isAnimating}
              >
                Search
              </button>
              
              {searchResult !== null && (
                <div className="search-result">
                  <span className="result-label">Result:</span>
                  <span className="result-value">{searchResult.toString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="message-display">
            {message && <div className="operation-message">{message}</div>}
            {renderAnimationStep()}
          </div>
        </div>
        
        <div className="visualization-panel">
          <h3>Visualization</h3>
          <div className="visualization-container">
            {activeStructure === 'set' && renderSetVisualization()}
            {activeStructure === 'map' && renderMapVisualization()}
            {activeStructure === 'object' && renderObjectVisualization()}
          </div>
        </div>
        
        <div className="info-panel">
          {renderStructureInfo()}
          {renderComparison()}
        </div>
      </div>
    </div>
  );
};

export default DataStructuresVisualization;