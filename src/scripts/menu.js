// src/scripts/menu.js
export function createMenu() {
  const button = document.createElement("button");
  button.textContent = "Toggle Lines";
  button.style.position = "absolute";
  button.style.top = "10px";
  button.style.right = "10px";
  button.style.padding = "10px";
  button.style.background = "#333";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";

  document.body.appendChild(button);

  let linesVisible = true;
  button.addEventListener("click", () => {
    linesVisible = !linesVisible;
    toggleLines(linesVisible);
  });
}

// Function to toggle road and connection lines
function toggleLines(visible) {
  scene.children.forEach((child) => {
    if (child.isLine) {
      child.visible = visible;
    }
  });
}
