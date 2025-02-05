// utils.js

/**
 * Generates a random position within a specified range.
 * @param {number} minX - Minimum X-coordinate value.
 * @param {number} maxX - Maximum X-coordinate value.
 * @param {number} minZ - Minimum Z-coordinate value.
 * @param {number} maxZ - Maximum Z-coordinate value.
 * @returns {Object} An object with random x, y, and z coordinates.
 */
export function getRandomPosition(minX, maxX, minZ, maxZ) {
    return {
      x: Math.random() * (maxX - minX) + minX,
      y: 0.5, // Keep blobs slightly above the ground
      z: Math.random() * (maxZ - minZ) + minZ
    };
  }
  
  /**
   * Detects if two objects are within a specified distance.
   * @param {THREE.Vector3} position1 - The position of the first object.
   * @param {THREE.Vector3} position2 - The position of the second object.
   * @param {number} threshold - The distance threshold for collision detection.
   * @returns {boolean} True if the objects are within the threshold distance, false otherwise.
   */
  export function detectCollision(position1, position2, threshold) {
    return position1.distanceTo(position2) < threshold;
  }
  
  /**
   * Generates a random color in hexadecimal format.
   * @returns {number} A random color as a hexadecimal value.
   */
  export function getRandomColor() {
    return Math.floor(Math.random() * 0xffffff); // Random hex color
  }
  
  /**
   * Clamps a value within a specified range.
   * @param {number} value - The value to clamp.
   * @param {number} min - The minimum allowed value.
   * @param {number} max - The maximum allowed value.
   * @returns {number} The clamped value.
   */
  export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  
  /**
   * Moves a position randomly within a specified speed range.
   * @param {THREE.Vector3} position - The current position to update.
   * @param {number} speed - The maximum movement speed.
   */
  export function moveRandomly(position, speed) {
    position.x += (Math.random() - 0.5) * speed;
    position.z += (Math.random() - 0.5) * speed;
  }
  
  