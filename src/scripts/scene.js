import * as THREE from 'three';

// Function to initialize the scene
export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Light blue for the sky
  return scene;
}

// Function to initialize the camera
export function initCamera() {
  const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );

  // Position the camera
  camera.position.set(0, 30, 30); // Above and angled towards the center
  camera.lookAt(0, 0, 0); // Point the camera towards the scene's center
  return camera;
}

// Function to initialize the renderer
export function initRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Enable shadow mapping
  return renderer;
}

// Add lighting to the scene
export function addLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Soft white light
  scene.add(ambientLight);

  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(10, 20, 10); // Position the light
  sun.castShadow = true; // Enable shadows
  sun.shadow.mapSize.width = 1024; // Shadow map resolution
  sun.shadow.mapSize.height = 1024;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 50;
  scene.add(sun);
}

// Add a ground plane to the scene
export function addGround(scene) {
  const planeGeometry = new THREE.PlaneGeometry(50, 50); // 50x50 units
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x90ee90 }); // Light green grass
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2; // Rotate to lie flat
  plane.receiveShadow = true; // Enable shadows on the ground
  scene.add(plane);
}

// Handle window resizing
export function handleResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
