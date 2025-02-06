// Arrays to store references to the road and connection lines
let roadLines = [];
let connectionLines = [];
let showPaths = false; // Global flag for path visibility (false by default)

let menuDiv; // Store menu reference
let toggleButton; // Store toggle button reference

// Create the control panel with sections for population, disease spread, and controls
export const createMenu = () => {
  menuDiv = document.createElement('div');
  menuDiv.style.position = 'fixed'; // keep it in view on scroll
  menuDiv.style.top = '10px';
  menuDiv.style.left = '10px';
  menuDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  menuDiv.style.color = 'white';
  menuDiv.style.padding = '20px';
  menuDiv.style.borderRadius = '10px';
  menuDiv.style.width = '280px';
  menuDiv.style.maxWidth = '90vw'; // Responsive: maximum width is 90% of viewport
  menuDiv.style.maxHeight = '90vh'; // Maximum height is 90% of viewport height
  menuDiv.style.overflowY = 'auto'; // Scroll if content exceeds max height
  menuDiv.style.fontFamily = 'Arial, sans-serif';
  menuDiv.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
  menuDiv.style.transition = 'opacity 0.3s ease';

  // Helper function to create a slider
  const createSlider = (labelText, min, max, step, defaultValue) => {
    const container = document.createElement('div');
    container.style.marginBottom = '10px';
    
    const label = document.createElement('label');
    label.textContent = `${labelText}: `;
    
    const valueSpan = document.createElement('span');
    valueSpan.textContent = defaultValue;
    valueSpan.style.fontWeight = 'bold';
    valueSpan.style.marginLeft = '5px';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = defaultValue;
    slider.style.width = '100%';
    slider.oninput = () => (valueSpan.textContent = slider.value);
    
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueSpan);
    return { container, slider };
  };

  // Population Section
  const populationTitle = document.createElement('h3');
  populationTitle.textContent = 'Population';
  const { container: popSlider } = createSlider('Population (Reload)', 20, 200, 2, 50);
  const { container: speedSlider } = createSlider('Blob Speed', 0.0005, 0.005, 0.0001, 0.001);

  // Disease Spread Section
  const diseaseTitle = document.createElement('h3');
  diseaseTitle.textContent = 'Disease Spread';
  const { container: infectedSlider } = createSlider('Infected Blobs (Reload)', 1, 100, 1, 10);
  const { container: infectionChanceSlider } = createSlider('Infection Chance (%)', 1, 100, 1, 5);
  const { container: contactsSlider } = createSlider('Physical contacts per blob', 1, 50, 1, 10);

  // Controls Section
  const controlsTitle = document.createElement('h3');
  controlsTitle.textContent = 'Controls';

  // Create the "Show Paths" checkbox that controls path visibility
  const pathCheckbox = document.createElement('input');
  pathCheckbox.type = 'checkbox';
  pathCheckbox.checked = false; // ensure checkbox is unchecked by default
  pathCheckbox.onchange = (e) => updatePathVisibility(e.target.checked);
  
  // Make sure paths are hidden on reload
  updatePathVisibility(false);
  
  const pathLabel = document.createElement('label');
  pathLabel.textContent = ' Show Paths (Reload)';
  pathLabel.style.marginLeft = '5px';

  const playButton = document.createElement('button');
  playButton.textContent = 'Play/Stop Simulation';
  styleButton(playButton);

  const reloadButton = document.createElement('button');
  reloadButton.textContent = 'Reload';
  styleButton(reloadButton);
  
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close Controls';
  styleButton(closeButton);
  closeButton.onclick = () => {
    menuDiv.style.display = 'none';
    toggleButton.style.display = 'block';
  };

  // Append elements to menu
  menuDiv.appendChild(populationTitle);
  menuDiv.appendChild(popSlider);
  menuDiv.appendChild(speedSlider);
  
  menuDiv.appendChild(diseaseTitle);
  menuDiv.appendChild(infectedSlider);
  menuDiv.appendChild(infectionChanceSlider);
  menuDiv.appendChild(contactsSlider);
  
  menuDiv.appendChild(controlsTitle);
  menuDiv.appendChild(pathCheckbox);
  menuDiv.appendChild(pathLabel);
  menuDiv.appendChild(document.createElement('br'));
  menuDiv.appendChild(playButton);
  menuDiv.appendChild(reloadButton);
  menuDiv.appendChild(closeButton);
  
  document.body.appendChild(menuDiv);
  
  createToggleButton();
};

// Create a floating button to reopen the menu
const createToggleButton = () => {
  toggleButton = document.createElement('button');
  toggleButton.textContent = 'Open Controls';
  styleButton(toggleButton);
  toggleButton.style.position = 'fixed';
  toggleButton.style.top = '10px';
  toggleButton.style.left = '10px';
  toggleButton.style.display = 'none';

  toggleButton.onclick = () => {
    menuDiv.style.display = 'block';
    toggleButton.style.display = 'none';
  };

  document.body.appendChild(toggleButton);
};

// Style buttons uniformly
const styleButton = (button) => {
  button.style.margin = '5px 0';
  button.style.padding = '8px 12px';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.backgroundColor = '#007BFF';
  button.style.color = 'white';
  button.style.fontSize = '14px';
  button.style.transition = 'background 0.3s';
  button.onmouseover = () => (button.style.backgroundColor = '#0056b3');
  button.onmouseleave = () => (button.style.backgroundColor = '#007BFF');
};

// Update the visibility of the road and connection lines based on the checkbox state
const updatePathVisibility = (visible) => {
  showPaths = visible;
  roadLines.forEach(line => {
    line.visible = visible;
  });
  connectionLines.forEach(line => {
    line.visible = visible;
  });
};

// Functions to register the lines, now using the global showPaths flag to set visibility
export const addRoadLine = (line) => {
  line.visible = showPaths;
  roadLines.push(line);
};

export const addConnectionLine = (line) => {
  line.visible = showPaths;
  connectionLines.push(line);
};
