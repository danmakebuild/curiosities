console.log("v3.03");

// Draw stuff
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let mode = "brush";
var currentSticker =
  "https://assets.website-files.com/62c4ba8818b0e1ab28f85ca3/6319e2804c793641acebe091_cut-out--orange.webp";
const colors = ["#EB9E00", "#017F01", "#D40032", "#E10198", "#880090", "#41B5E6"]; // add your desired color options here
let currentColor = "#EB9E00";
let currentThickness = document.getElementById("thickness-slider").value;
let history = []; // Add this line to store the history of the canvas

function saveCanvasState() {
  history.push(canvas.toDataURL());
}

function restoreCanvasState() {
  const previousState = history.pop();
  if (previousState) {
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
}

function clearCanvas() {
	saveCanvasState();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function resetCanvasPosition() {
  const rect = canvas.getBoundingClientRect();
  canvasX = rect.left + window.scrollX;
  canvasY = rect.top + window.scrollY;
}

// Add an event listener for the undo button
document.getElementById("undo-btn").addEventListener("click", () => {
	restoreCanvasState();
});

// Add an event listener for the clear button
document.getElementById("clear-btn").addEventListener("click", () => {
	clearCanvas();
});

// Call resetCanvasPosition whenever the canvas size changes
window.addEventListener("resize", resetCanvasPosition);

// Call resetCanvasPosition when the user scrolls the page
window.addEventListener("scroll", resetCanvasPosition);


$("#sticker-container > a").on("click",function(){
	$("#sticker-container > a").removeClass("active");
  $(this).addClass("active");
	currentSticker = $(this).find("img").attr("src");
});

ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
canvas.addEventListener("click", addSticker);

// Add touch event listeners
canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing, { passive: false });
canvas.addEventListener("touchcancel", stopDrawing, { passive: false });


function startDrawing(e) {
  e.preventDefault();
  if (!isDrawing) {
    saveCanvasState(); // Save the canvas state before drawing
  }
  isDrawing = true;
  setCanvasPosition();
  draw(e);
}

let canvasX;
let canvasY;

// Wait for the page to finish rendering before getting the coordinates of the canvas
window.addEventListener("load", () => {
  setCanvasPosition();
});

// Get the coordinates of the canvas
const setCanvasPosition = () => {
    const rect = canvas.getBoundingClientRect();
    canvasX = rect.left + window.scrollX;
    canvasY = rect.top + window.scrollY;
  };

function draw(e) {
  if (!isDrawing) return;
  ctx.lineWidth = currentThickness;
  ctx.lineCap = "round";
  if (mode === "eraser") {
    ctx.strokeStyle = "#fff";
  } else {
    ctx.strokeStyle = currentColor;
  }
  if (mode === "brush" || mode === "eraser") {
    // Use touch event coordinates for touch events
    const x = e.type.includes("touch") ? e.touches[0].clientX - canvasX : e.offsetX;
    const y = e.type.includes("touch") ? e.touches[0].clientY - canvasY : e.offsetY;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
}


function stopDrawing(e) {
    isDrawing = false;
    if (mode === "sticker") {
      // Use touch event coordinates for touch events
      const x = e.type.includes("touch") ? e.changedTouches[0].clientX - canvasX : e.offsetX;
      const y = e.type.includes("touch") ? e.changedTouches[0].clientY - canvasY : e.offsetY;
      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, x - 25, y - 25, 50, 50);
      };
      img.src = currentSticker;
      img.crossOrigin = "anonymous";
    }
    ctx.beginPath();
  }

function fillCanvasWithTexture(textureUrl) {
	saveCanvasState(); 
  const img = new Image();
  img.src = textureUrl;
  img.crossOrigin = "anonymous";
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

document.querySelectorAll(".texture-swatch").forEach((a) => {
  a.addEventListener("click", () => {
    const textureUrl = a.dataset.src;
    fillCanvasWithTexture(textureUrl);
  });
});

function addSticker(e) {
    if (mode === "sticker") {
      e.preventDefault();
      // Use touch event coordinates for touch events
      const x = e.type.includes("touch") ? e.touches[0].clientX - canvasX : e.offsetX;
      const y = e.type.includes("touch") ? e.touches[0].clientY - canvasY : e.offsetY;
      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, x - 25, y - 25, 50, 50);
      };
      img.src = currentSticker;
      img.crossOrigin = "anonymous";
    }
  }


document.getElementById("brush-btn").addEventListener("click", () => {
  mode = "brush";
  updateColorContainer();
  $(".canvas-controls").show();
  $(".canvas-controls--stickers").hide();
  $(".canvas-controls--swatches").show();
  $(".canvas-controls--textures").hide();
  $(".canvas-range").show();
});

document.getElementById("eraser-btn").addEventListener("click", () => {
  mode = "eraser";
  $(".canvas-controls").hide();
  $(".canvas-range").show();
});

document.getElementById("sticker-btn").addEventListener("click", () => {
  mode = "sticker";
  $(".canvas-controls").show();
  $(".canvas-controls--swatches").hide();
  $(".canvas-controls--stickers").show();
  $(".canvas-controls--textures").hide();
  $(".canvas-range").hide();
});

document.getElementById("texture-btn").addEventListener("click", () => {
  mode = "texture";
  $(".canvas-controls").show();
  $(".canvas-controls--swatches").hide();
  $(".canvas-controls--stickers").hide();
  $(".canvas-controls--textures").show();
  $(".canvas-range").hide();
});

function updateColorContainer() {
  const colorContainer = document.getElementById("color-container");
  colorContainer.innerHTML = "";
  colors.forEach((color) => {
    const colorSwatch = document.createElement("div");
    colorSwatch.classList.add("color-swatch");
    colorSwatch.style.backgroundColor = color;
    if (color === currentColor) {
      colorSwatch.classList.add("selected");
    }
    colorSwatch.addEventListener("click", () => {
      $(".canvas-controls--swatches").find(".selected").removeClass("selected");
      $("#color-picker-wrapper").removeClass("selected");
      $("#color-picker-wrapper").css("box-shadow","0 0 0 0");
      currentColor = color;
      updateColorContainer();
    });
    colorContainer.appendChild(colorSwatch);
  });
}

updateColorContainer();

document.getElementById("thickness-slider").addEventListener("input", (e) => {
  currentThickness = e.target.value;
});

$("#color-picker-wrapper").on("click", function(){
  $(this).addClass("selected");
  $(".color-swatch").removeClass("selected");
});

const colorPicker = document.querySelector('.js-color-picker');

colorPicker.addEventListener('change', event => {
  currentColor = event.target.value;
  $("#color-picker-wrapper.selected").css("box-shadow","0 0 0 4px " + currentColor);
});

const selectColour = e => {
  colorPicker.value = event.target.id;
  currentColor = event.target.id;
}

$(".canvas-tool").on("click",function(){
$(".canvas-tool").removeClass("active");
$(this).addClass("active");
});

const paintCanvas = document.querySelector('.js-paint');
const context = paintCanvas.getContext('2d');

model.addEventListener("load", () => {
const loader = document.getElementById("loader--curiosities")
loader.hidden = true

const material = model.model.materials[0]

const createAndApplyTexture = async (channel, JPG) => {
// Creates a new texture.
const texture = await model.createTexture(JPG);
// Set the texture name
texture.name = "canvas_img"
// Applies the new texture to the specified channel.
material.pbrMetallicRoughness[channel].setTexture(texture);
}

model.addEventListener('model-visibility', function(evt) {
});

document.getElementById('apply').addEventListener('click', function (e) {
	//customisedModelViewerDismissPoster();
	let canvasJPG = paintCanvas.toDataURL("image/png", 0.25);
	createAndApplyTexture("baseColorTexture", canvasJPG);
});

document.getElementById('clear-btn').addEventListener('click', function (e) {
const paintCanvas = document.querySelector('.js-paint');
const context = paintCanvas.getContext('2d');
context.fillStyle = "white";
context.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
});

const patternButtons = document.getElementsByClassName("pattern")

const applyPattern = e => {
createAndApplyTexture("baseColorTexture", e.target.src)
}

for (let item of patternButtons) {
item.addEventListener("click", applyPattern);
}

});

// Prevent scrolling while drawing on touch devices
document.addEventListener("touchmove", function (e) {
if (isDrawing) {
e.preventDefault();
}
}, { passive: false });








// Save and share stuff
// Use html2canvas to power the download button
$(document).ready(function() {
	const saveButton = document.querySelector('#customiser__save__download');
  saveButton.addEventListener('click', () => {
    const dataUrl = sessionStorage.getItem('imageToShare');
    if(dataUrl) {
      const link = document.createElement('a'); 
      link.download = 'my-fruittella-curiosity.jpg';
      link.href = dataUrl;
      link.click();
    }
  });
});

// Share 2.0
$(document).ready(function() {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const saveAndShareButton = document.querySelector('#triggerCanvasCapture');
  saveAndShareButton.addEventListener('click', () => {
      setTimeout(() => {
        const wrapperDiv = document.querySelector('.postcard-output-wrapper');
        const originalDisplayStyle = wrapperDiv.style.display;
        wrapperDiv.style.display = 'flex';

        html2canvas(wrapperDiv, {
          allowTaint: false,
          height: 960,
          width: 540,
          scale: 2,
          useCORS: true,
          logging: true,
          timeout: 10000,
          onclone: (clonedDoc) => {
            // Find the canvas element in the cloned document
            const canvas = clonedDoc.querySelector('canvas');
            canvas.click();
            console.log("html2canvas cloned the canvas");
          }
        }).then(canvas => {
          // Get the data URL of the canvas image
          const dataURL = canvas.toDataURL("image/jpeg", 1);
          console.log("html2canvas generated a dataURL from the canvas");
          // console.log(dataURL);

          // Save the data URL to sessionStorage
          //sessionStorage.setItem("imageToShare", dataURL);

          $("#customiser__save__preview-img").attr("src",dataURL);

          wrapperDiv.style.display = originalDisplayStyle;
          $("#customiser__save__loader .customiser__save__loader__share-wrap").addClass("show");
          $("#customiser__save__loader .customiser__save__loader__inner").removeClass("show");
        });
      }, 500); // 1-second delay
    });      
});

function shareImage() {
  const dataUrl = sessionStorage.getItem('imageToShare');
  if (navigator.share && dataUrl) {
    try {
      // Convert the data URL to a blob object
      const blob = dataURItoBlob(dataUrl);

      // Create a new File object from the blob
      const fileName = 'my-fruittella-curiosity.jpg';
      const fileSize = blob.size;
      const lastModified = Date.now();
      const file = new File([blob], fileName, { type: 'image/jpeg', lastModified });

      // Set the name and size properties of the file
      Object.defineProperty(file, 'name', { value: fileName });
      Object.defineProperty(file, 'size', { value: fileSize });

      // Share the file using the navigator.share API
      const shareData = {
        files: [file],
        title: ''
      };
      navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  } else {
    console.warn('Sharing not supported or image not found');
  }
}

// Add click event listener to the share button
document.querySelector('#customiser__save__share').addEventListener('click', shareImage);

function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}