//import { createMenu, addRoadLine, addConnectionLine } from './menu.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";

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

// animate remember here
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  checkCameraInsideModels(); // Check and hide models dynamically
  
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
// Store created road and connection lines in arrays
let roadLines = [];
let connectionLines = [];
let movingBlobs = [];

// ✅ Create Road Line (Orange)
function createRoadLine(start, end) {
    console.log(`Creating Road Line: Start (${start.x}, ${start.z}) → End (${end.x}, ${end.z})`);
    const material = new THREE.LineBasicMaterial({ color: 0xffa500, linewidth: 3 });
    const points = [new THREE.Vector3(start.x, start.y, start.z), new THREE.Vector3(end.x, end.y, end.z)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    addRoadLine({ start, end, line });
}

function addRoadLine(road) {
    roadLines.push(road);
}

// ✅ Create Connection Line (Blue)
function createConnectionLine(modelPos, blockCenter, rotation) {
  
    
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 });
    const start = new THREE.Vector3(modelPos.x, connectionLineY, modelPos.z);
    let end;
    console.log("Creating Connection Line with:", start, end, rotation); // Debug log
    console.log(`Start X: ${start.x}, Start Z: ${start.z}`); // Potential issue here
    console.log(`End X: ${end.x}, End Z: ${end.z}`);
    if (rotation.y === 0) {
        end = new THREE.Vector3(modelPos.x, connectionLineY, blockCenter.z + blockSize / 2);
    } else if (Math.abs(rotation.y - Math.PI) < 0.001) {
        end = new THREE.Vector3(modelPos.x, connectionLineY, blockCenter.z - blockSize / 2);
    } else {
        return;
    }

    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    connectionLines.push({ start, end, line });
}

// ✅ Get a random connection line
function getRandomConnectionLine() {
    return connectionLines.length > 0 ? connectionLines[Math.floor(Math.random() * connectionLines.length)] : null;
}

// ✅ Find a valid path between models using both connection & road lines
function findPath(startPos, targetPos) {
  if (!startPos || !targetPos) {
      console.warn("Invalid start or target position.", startPos, targetPos);
      return [];
  }

  console.log(`Finding path from (${startPos.x}, ${startPos.z}) to (${targetPos.x}, ${targetPos.z})`);
  
  let queue = [{ pos: startPos, path: [] }];
  let visited = new Set();

  while (queue.length > 0) {
      let { pos, path } = queue.shift();

      // ✅ If reached the target, return the path
      if (pos.x === targetPos.x && pos.z === targetPos.z) {
          console.log("✅ Path found:", path);
          return path;
      }

      // ✅ Explore road connections (BIDIRECTIONAL)
      for (let road of roadLines) {
          let nextPos = null;
          if (pos.x === road.start.x && pos.z === road.start.z) {
              nextPos = road.end;
          } else if (pos.x === road.end.x && pos.z === road.start.z) {
              nextPos = road.start;
          }
          if (nextPos) {
              let key = `${nextPos.x},${nextPos.z}`;
              if (!visited.has(key)) {
                  console.log(`➡️ Visiting Road: ${key}`);
                  visited.add(key);
                  queue.push({ pos: nextPos, path: [...path, road] });
              }
          }
      }

      // ✅ Explore connection lines (BIDIRECTIONAL)
      for (let conn of connectionLines) {
          let nextPos = null;
          if (pos.x === conn.start.x && pos.z === conn.start.z) {
              nextPos = conn.end;
          } else if (pos.x === conn.end.x && pos.z === conn.start.z) {
              nextPos = conn.start;
          }
          if (nextPos) {
              let key = `${nextPos.x},${nextPos.z}`;
              if (!visited.has(key)) {
                  console.log(`➡️ Visiting Connection: ${key}`);
                  visited.add(key);
                  queue.push({ pos: nextPos, path: [...path, conn] });
              }
          }
      }
  }
  
  console.warn("❌ No valid path found between:", startPos, "and", targetPos);
  console.warn("Total roadLines:", roadLines.length, "Total connectionLines:", connectionLines.length);
  return [];
}


// ✅ Move blob through the path
function moveBlob(blob, path, onComplete) {
    if (path.length === 0) {
        if (onComplete) onComplete();
        return;
    }

    let nextSegment = path.shift();

    new TWEEN.Tween(blob.position)
        .to({ x: nextSegment.end.x, z: nextSegment.end.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => moveBlob(blob, path, onComplete))
        .start();
}

// ✅ Create and move a blob along roads
function startBlobMovement() {
  if (connectionLines.length === 0 || roadLines.length === 0) {
      console.warn("No valid paths available.");
      return;
  }

  // ✅ Ensure start and target connections exist
  const startConnection = getRandomConnectionLine();
  if (!startConnection) {
      console.warn("No valid start connection found.");
      return;
  }
  const startPos = startConnection.end;

  let targetConnection;
  do {
      targetConnection = getRandomConnectionLine();
  } while (targetConnection === startConnection && connectionLines.length > 1);

  if (!targetConnection) {
      console.warn("No valid target connection found.");
      return;
  }
  const targetPos = targetConnection.end;

  // ✅ Ensure pathToTarget is valid
  const pathToTarget = findPath(startPos, targetPos);
  if (!pathToTarget || pathToTarget.length === 0) {
      console.warn("No valid path found.");
      return;
  }

  const pathBack = [...pathToTarget].reverse();

  // ✅ Create the blob
  const geometry = new THREE.SphereGeometry(0.2, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const blob = new THREE.Mesh(geometry, material);

  blob.position.copy(startPos);
  scene.add(blob);
  movingBlobs.push(blob);

  // ✅ Move the blob
  moveBlob(blob, pathToTarget, () => {
      setTimeout(() => moveBlob(blob, pathBack, () => console.log("Blob returned!")), 1000);
  });
}

// ✅ Start Simulation (Create multiple blobs)
function startSimulation() {
    for (let i = 0; i < 5; i++) {
        startBlobMovement();
    }
}

// Call this after setting up roads and connections


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
      console.log("Model Position:", modelData.position);
      console.log("Block Center:", blockCenter);
      console.log("Rotation:", modelData.rotation);
      

      createConnectionLine(modelData.position, blockCenter, modelData.rotation);
    });
  }
}
const gol=startSimulation();
console.log(gol)