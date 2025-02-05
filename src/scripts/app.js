// Import necessary modules
import { initScene, initCamera, initRenderer, addLighting, addGround } from './scene.js';
import { createHouses } from './houses.js';
import { createBlobs, animateBlobs } from './blobs.js';

// Initialize the scene, camera, and renderer
const scene = initScene();
const camera = initCamera();
const renderer = initRenderer();

// Add lighting and ground to the scene
addLighting(scene);
addGround(scene);

// Create houses and add them to the scene
const houses = createHouses(30); // Create 30 houses
houses.forEach((house) => scene.add(house));

// Create blobs and add them to the scene
const blobs = createBlobs(50); // Create 50 blobs (1 infected, 49 healthy)
blobs.forEach((blob) => scene.add(blob));

// Set the camera position
camera.position.set(0, 30, 30);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Animate the blobs (movement and infection logic)
  animateBlobs(blobs);

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
