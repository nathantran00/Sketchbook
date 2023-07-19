//Function to convert hex colors to RGB
// >Because RGB is more compatible/flexible when working with canvas graphics (color blending with opacity)
function hexToRgb(hex) {
  // Ref: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  // Expression used to match shorthand hex (#abc)
  // Captures the 3 hex digits (r,g,b) as seperate groups
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  // Replaces shorthand hex (3digits(#abc)) with expanded (6digits(#aabbcc))
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  // Matches expanded format
  // Captures 2 hex digits for each color as seperate groups
  // Ex. #aabbcc would capure "aa", "bb", "cc" as seperate
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  // Return the result which is the RGB value as a *string
  // Ternary operator to see if $result is true
  // If it is not null, it starts the first part of expression
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : null;
}

// Initialize variables
const canvas = document.querySelector("#drawArea");
const ctx = canvas.getContext("2d");
const colors = document.querySelectorAll(".color");
const selectedColorDisplay = document.querySelector("#selectedColor");
const clearButton = document.querySelector("#clearButton");
const brushThicknessSlider = document.querySelector("#brushThickness");
const brushOpacitySlider = document.querySelector("#brushOpacity");

let selectedColor = "black";
let drawing = false;
let brushThickness = 5;
let brushOpacity = 1;

// Attaches event listeners to brushThicknessSlider and brushOpacitySlider to listen to changes in the slider
// e.target.value = the current value of the respectable slider (thickness or opacity)
brushThicknessSlider.addEventListener("input", (e) => {
  brushThickness = e.target.value;
});
brushOpacitySlider.addEventListener("input", (e) => {
  brushOpacity = e.target.value;
});

// Listens for when the mouse is pressed down
canvas.addEventListener("mousedown", (e) => {
    
    // Indicates the user is drawing
  drawing = true;
  // Starts a new drawing path on canvas
  ctx.beginPath();
  // New variable for mouse position = cursor relative to the canvas
  let pos = getMousePos(canvas, e);
  // Function used to move the drawing position to the obtained mouse position
  ctx.moveTo(pos.x, pos.y);
});

// Event triggered when user releases mouse button on the canvas
// stopDrawing = (drawing = false)
canvas.addEventListener("mouseup", stopDrawing);
// Event triggered when the cursor leaves canvas area
// stopDrawing = (drawing = false)
canvas.addEventListener("mouseleave", stopDrawing);

// Event triggered as the user moves the cursor over the canvas
canvas.addEventListener("mousemove", draw);

// Iterates over each color option
colors.forEach((color) => {
    // Click event listener added to each
    // selectColor() function is called to handle color selection process
  color.addEventListener("click", selectColor);
});

// Click event listener added to clearButton element
// whihc triggers the clearCanvas() function to clear any Masterpiece on the canvas
clearButton.addEventListener("click", clearCanvas);

// Called when the user moves the cursor over the Canvas area
function draw(e) {
    // If drawing = false, function exits early b/c no drawing currently happening
  if (!drawing) return;
    // position variable = current mouse position relative to the canvas
  let pos = getMousePos(canvas, e);
  // Drawing style 
  ctx.strokeStyle = `rgba(${hexToRgb(selectedColor)}, ${brushOpacity})`;
  ctx.lineWidth = brushThickness;
  ctx.lineCap = "round";

  // Function that connects current position to new mouse position, effectively creating a line/path
  ctx.lineTo(pos.x, pos.y);
  // Line is actually drawn on canvas
  ctx.stroke();
  // Resetting of drawing path to prepare the next line segment
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

// Click event called when color clicked
function selectColor(e) {
    // Removes "selected" class from all colors using forEach
  colors.forEach((color) => color.classList.remove("selected"));

  // Retrieves the selected color from the clicked color element's "data-color" attribute(hex)
  selectedColor = e.target.dataset.color;
  // selectedColorDisplay updated to show color's actual name
  selectedColorDisplay.textContent = `Selected Color: ${e.target.dataset.name}`;
  // The clicked color is given "selected" class
  e.target.classList.add("selected");
}

// Clears canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to stop the drawing process on canvas
function stopDrawing() {
  drawing = false;
  // Closes current path to actualize drawn shape or line
  ctx.closePath();
}

// Assigns canvasContainer variable to #canvasContainer div in html 
const canvasContainer = document.querySelector("#canvasContainer");

// Responsive canvas
// Function to resize canvas into container div whenever the window is resized
function resizeCanvas() {
  canvas.width = canvasContainer.clientWidth;
  canvas.height = canvasContainer.clientHeight;
}

// Calculates the mouse position relative to the canvas
// canvas and mouse event obj as parameters
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    // Subtraction of top and left offsets of canvas from mouse coordinates to obtain *mouse pos relative to the canvas*
    // obj returned with x + y coordinates
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

// Adds avent listener to the window object for the "resize" event
window.addEventListener("resize", resizeCanvas);
// Resizes canvas dimensions accordingly
resizeCanvas();

// Initialize download button
const downloadButton = document.querySelector("#downloadButton");
downloadButton.addEventListener("click", downloadImage);

// Triggers the downloading of their masterpiece!
function downloadImage() {
  // Create a temporary link element
  const link = document.createElement("a");
  link.href = canvas.toDataURL(); 
  link.download = "myMasterpiece.png"; 

  // Simulate a click on the link to trigger the download
  link.click();
}
