import { renderer, scene, camera } from './scene';
import { blobs } from './blobs';

/**
 * Animation and simulation logic
 */
function animate() {
  requestAnimationFrame(animate);

  // Move blobs randomly and handle infection spread
  blobs.forEach((blob, index) => {
    // Randomly move the blobs within boundaries
    blob.position.x += (Math.random() - 0.5) * 0.1; // Random X movement
    blob.position.z += (Math.random() - 0.5) * 0.1; // Random Z movement

    // Keep blobs within the boundaries of the scene
    blob.position.x = Math.max(-25, Math.min(25, blob.position.x));
    blob.position.z = Math.max(-25, Math.min(25, blob.position.z));

    // Check for collisions to spread infection
    blobs.forEach((otherBlob) => {
      if (
        blob !== otherBlob && // Avoid self-check
        blob.position.distanceTo(otherBlob.position) < 1 && // Collision distance
        blob.userData.infected // Infection condition
      ) {
        // Spread infection to the other blob
        otherBlob.userData.infected = true;
        otherBlob.material.color.set(0xff0000); // Change color to red
      }
    });
  });

  // Render the scene
  renderer.render(scene, camera);
}

export { animate };
