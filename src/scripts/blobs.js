import * as THREE from 'three';

// Parameters for the blobs
const BLOB_COUNT = 50; // Total number of blobs
const BLOB_RADIUS = 0.5; // Radius of the blobs
const MOVEMENT_SPEED = 0.1; // Speed of blob movement

// Array to store all blobs
const blobs = [];

/**
 * Creates blobs and adds them to the scene.
 * @param {THREE.Scene} scene - The main scene where blobs will be added.
 */
export function createBlobs(scene) {
  const blobGeometry = new THREE.SphereGeometry(BLOB_RADIUS, 16, 16);

  for (let i = 0; i < BLOB_COUNT; i++) {
    const blobMaterial = new THREE.MeshBasicMaterial({
      color: i === 0 ? 0xff0000 : 0x0000ff, // First blob is "infected" (red), others are healthy (blue)
    });

    const blob = new THREE.Mesh(blobGeometry, blobMaterial);

    // Set random initial position
    blob.position.set(
      Math.random() * 40 - 20, // X position within the ground plane
      BLOB_RADIUS,            // Slightly above the ground
      Math.random() * 40 - 20 // Z position within the ground plane
    );

    // Add infection status to the blob's userData
    blob.userData = {
      infected: i === 0, // First blob is infected
    };

    // Add the blob to the global array and the scene
    blobs.push(blob);
    scene.add(blob);
  }
}

/**
 * Animates the blobs, moving them randomly and handling infection spread.
 */
export function animateBlobs() {
  blobs.forEach((blob) => {
    // Move blobs randomly
    blob.position.x += (Math.random() - 0.5) * MOVEMENT_SPEED;
    blob.position.z += (Math.random() - 0.5) * MOVEMENT_SPEED;

    // Keep blobs within the bounds of the plane (-20 to 20 in X and Z)
    blob.position.x = Math.max(-20, Math.min(20, blob.position.x));
    blob.position.z = Math.max(-20, Math.min(20, blob.position.z));
  });

  // Infection spread logic
  for (let i = 0; i < blobs.length; i++) {
    for (let j = i + 1; j < blobs.length; j++) {
      const blobA = blobs[i];
      const blobB = blobs[j];

      // Check if blobs are close enough to spread infection
      if (
        blobA.position.distanceTo(blobB.position) < BLOB_RADIUS * 2 &&
        (blobA.userData.infected || blobB.userData.infected)
      ) {
        blobA.userData.infected = blobB.userData.infected = true;

        // Update material color to red for infected blobs
        blobA.material.color.set(0xff0000);
        blobB.material.color.set(0xff0000);
      }
    }
  }
}
