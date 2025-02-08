import { createMenu, addRoadLine, addConnectionLine } from './menu.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Import assets through Webpack
import flatModel from '../assets/Flat.gltf';
import flat2Model from '../assets/Flat2.gltf';
import houseModel from '../assets/House.gltf';
import houseTexturePath from '../assets/HouseTexture1.png';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); // White background
document.body.appendChild(renderer.domElement);

// Improved Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Stronger main light
directionalLight.position.set(10, 15, 10);
scene.add(directionalLight);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(-10, 10, -10);
scene.add(backLight);

const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1.5); // Softer ambient light
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemiLight.position.set(0, 30, 0);
scene.add(hemiLight);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.2;
controls.maxPolarAngle = Math.PI / 2.2;
controls.maxDistance = 60; // Maximum zoom (prevents zooming too far)
controls.minDistance = 8; // Minimum zoom (prevents getting too close)
// Loaders
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const houseTexture1 = textureLoader.load(houseTexturePath);

// Function to load models with proper scaling
const modelsArray = []; // Store loaded models

function loadModel(path, texture = null, position, scale, rotation) {
  gltfLoader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(position.x, position.y, position.z);
      model.scale.set(scale.x, scale.y, scale.z);
      model.rotation.set(rotation.x, rotation.y, rotation.z);

      model.traverse((child) => {
        if (child.isMesh) {
          if (texture) {
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
          child.material.color.set(0xffffff);
          child.material.metalness = 0.4;
          child.material.roughness = 0.4;
        }
      });

      scene.add(model);
      
      // Compute bounding box
      const box = new THREE.Box3().setFromObject(model);
      modelsArray.push({ model, box });
    },
    undefined,
    (error) => console.error(`Error loading model ${path}:`, error)
  );
}


// Create 5x5 grid of blocks, each containing 2x2 models
const blockSize = 10; // Size of each block (spacing between models)
const gridSize = 5; // 5x5 grid

// Middle of the entire grid
const totalSize = (gridSize - 1) * blockSize;
const middleX = totalSize / 2;
const middleZ = totalSize / 2;

for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    const centerX = i * blockSize - middleX; // Shift grid to center
    const centerZ = j * blockSize - middleZ; // Shift grid to center

    const models = [
      { model: flatModel, position: { x: centerX - 1.5, y: 0, z: centerZ + 1.5 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, rotation: { x: 0, y: 0, z: 0 } },
      { model: flat2Model, position: { x: centerX + 1.5, y: 0, z: centerZ + 1.5 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, rotation: { x: 0, y: 0, z: 0 } },
      { model: houseModel, position: { x: centerX - 1.5, y: 0, z: centerZ - 1.5 }, scale: { x: 2.5, y: 2.5, z: 2.5 }, rotation: { x: 0, y: Math.PI, z: 0 } },
      { model: flatModel, position: { x: centerX + 1.5, y: 0, z: centerZ - 1.5 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, rotation: { x: 0, y: Math.PI, z: 0 } },
    ];

    models.forEach(modelData => {
      loadModel(modelData.model, houseTexture1, modelData.position, modelData.scale, modelData.rotation);
    });
  }
}

// Adjust camera position & focus
camera.position.set(middleX, 20, middleZ + 30); // Higher & slightly behind
camera.lookAt(middleX, 0, middleZ);


function checkCameraInsideModels() {
  modelsArray.forEach(({ model, box }) => {
    box.setFromObject(model); // Update bounding box in case of changes
    if (box.containsPoint(camera.position)) {
      model.visible = false; // Hide model if camera is inside
    } else {
      model.visible = true; // Show model otherwise
    }
  });
}
const movingBlobs = []; // Store moving blobs and their paths
// animate remember here
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  checkCameraInsideModels(); // Check and hide models dynamically
  updateMovingBlobs();// Move blobs each frame
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// Function to create roads
function createRoad(width, height, position) {
  const roadGeometry = new THREE.PlaneGeometry(width, height);
  const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.rotation.x = -Math.PI / 2; // Rotate to lay flat
  road.position.set(position.x, position.y, position.z);
  scene.add(road);
}

// Road properties
const roadWidth = 3; // Width of the roads
const roadY = -0.01; // Slightly below the buildings

// Add roads around each block
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    const centerX = i * blockSize - middleX; 
    const centerZ = j * blockSize - middleZ;

    // Horizontal roads (top & bottom of block)
    createRoad(blockSize + roadWidth, roadWidth, { x: centerX, y: roadY, z: centerZ + blockSize / 2 });
    createRoad(blockSize + roadWidth, roadWidth, { x: centerX, y: roadY, z: centerZ - blockSize / 2 });

    // Vertical roads (left & right of block)
    createRoad(roadWidth, blockSize + roadWidth, { x: centerX - blockSize / 2, y: roadY, z: centerZ });
    createRoad(roadWidth, blockSize + roadWidth, { x: centerX + blockSize / 2, y: roadY, z: centerZ });
  }
}
createMenu();

function createRoadLine(start, end) {
  const material = new THREE.LineBasicMaterial({ color: 0xffa500, linewidth: 3 }); // Orange color
  const points = [new THREE.Vector3(start.x, start.y, start.z), new THREE.Vector3(end.x, end.y, end.z)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  addRoadLine(line);

  // Create a moving blob for this road
  createMovingBlob(start, end);
}

function createMovingBlob(start, end) {
  const geometry = new THREE.SphereGeometry(0.2, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue moving blob
  const blob = new THREE.Mesh(geometry, material);
  blob.position.copy(start); // Start at the beginning of the road
  scene.add(blob);

  movingBlobs.push({ blob, start, end, progress: 0 });
}

// Function to update moving blobs each frame
function updateMovingBlobs() {
  movingBlobs.forEach((item) => {
    item.progress += 0.01; // Speed of movement (adjust as needed)

    if (item.progress > 1) {
      item.progress = 0; // Reset to loop movement
    }

    // Interpolate position along the road line
    item.blob.position.lerpVectors(item.start, item.end, item.progress);
  });
}

// Adjust road line position slightly above the roads
const lineY = roadY + 0.2;

for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    const centerX = i * blockSize - middleX;
    const centerZ = j * blockSize - middleZ;

    // Horizontal road lines
    createRoadLine({ x: centerX - blockSize / 2, y: lineY, z: centerZ + blockSize / 2 },
                   { x: centerX + blockSize / 2, y: lineY, z: centerZ + blockSize / 2 });

    createRoadLine({ x: centerX - blockSize / 2, y: lineY, z: centerZ - blockSize / 2 },
                   { x: centerX + blockSize / 2, y: lineY, z: centerZ - blockSize / 2 });

    // Vertical road lines
    createRoadLine({ x: centerX - blockSize / 2, y: lineY, z: centerZ - blockSize / 2 },
                   { x: centerX - blockSize / 2, y: lineY, z: centerZ + blockSize / 2 });

    createRoadLine({ x: centerX + blockSize / 2, y: lineY, z: centerZ - blockSize / 2 },
                   { x: centerX + blockSize / 2, y: lineY, z: centerZ + blockSize / 2 });
  }
}
// Define the road connection line elevation (just above the road lines)
const connectionLineY = roadY + 0.2;

// Function to create a connection line from a model’s front side to its corresponding road line.
// We pass in the model’s known position (from the block loop), the block center (an object with x and z), and the model’s rotation.
function createConnectionLine(modelPos, blockCenter, rotation) {
  const material = new THREE.LineBasicMaterial({ color: 0xffa500, linewidth: 2 }); // blue line, for example
  // The start point is based on the model’s position; we use connectionLineY so the line is slightly above the road.
  const start = new THREE.Vector3(modelPos.x, connectionLineY, modelPos.z);
  let end;
  if (rotation.y === 0) {
    // Facing +Z: connect to the top road line of the block.
    end = new THREE.Vector3(modelPos.x, connectionLineY, blockCenter.z + blockSize / 2);
  } else if (Math.abs(rotation.y - Math.PI) < 0.001) {
    // Facing -Z: connect to the bottom road line of the block.
    end = new THREE.Vector3(modelPos.x, connectionLineY, blockCenter.z - blockSize / 2);
  } else {
    // Fallback (if needed): no connection
    return;
  }
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  addConnectionLine(line);
}

// In your grid loop, right after you call loadModel for each model,
// also call createConnectionLine using the known position, block center, and rotation.
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    const centerX = i * blockSize - middleX; // Shift grid to center
    const centerZ = j * blockSize - middleZ; // Shift grid to center
    const blockCenter = { x: centerX, z: centerZ };

    const models = [
      { model: flatModel, position: { x: centerX - 1.5, y: 0, z: centerZ + 1.5 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, rotation: { x: 0, y: 0, z: 0 } },
      { model: flat2Model, position: { x: centerX + 1.5, y: 0, z: centerZ + 1.5 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, rotation: { x: 0, y: 0, z: 0 } },
      { model: houseModel, position: { x: centerX - 1.5, y: 0, z: centerZ - 1.5 }, scale: { x: 2.5, y: 2.5, z: 2.5 }, rotation: { x: 0, y: Math.PI, z: 0 } },
      { model: flatModel, position: { x: centerX + 1.5, y: 0, z: centerZ - 1.5 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, rotation: { x: 0, y: Math.PI, z: 0 } },
    ];

    models.forEach(modelData => {
      // Load the model (as before) with the provided parameters.
      loadModel(modelData.model, houseTexture1, modelData.position, modelData.scale, modelData.rotation);

      // Create a connection line from the model’s front side to the road line.
      // (Using the same data from this loop, so the connection is drawn immediately.)
      createConnectionLine(modelData.position, blockCenter, modelData.rotation);
    });
  }
}