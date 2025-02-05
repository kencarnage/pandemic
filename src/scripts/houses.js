import * as THREE from 'three';

// Function to create a single house
function createHouse(x, z) {
  const houseGeometry = new THREE.BoxGeometry(2, 2, 2); // Size of the house
  const houseMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 }); // House color
  const house = new THREE.Mesh(houseGeometry, houseMaterial);

  // Position the house
  house.position.set(x, 1, z); // Y is set to 1 to place the house on the ground
  house.castShadow = true; // Enable shadows
  house.receiveShadow = true;

  return house;
}

// Function to create and add multiple houses to the scene
export function addHouses(scene, count = 30) {
  const houses = []; // Array to store all house meshes

  for (let i = 0; i < count; i++) {
    // Generate random positions for houses
    const x = Math.random() * 40 - 20; // Random X position (-20 to 20)
    const z = Math.random() * 40 - 20; // Random Z position (-20 to 20)

    const house = createHouse(x, z);
    houses.push(house);
    scene.add(house); // Add the house to the scene
  }

  return houses; // Return all houses for further reference (if needed)
}

// Alias for `addHouses`, exported as `createHouses`
export const createHouses = addHouses;
