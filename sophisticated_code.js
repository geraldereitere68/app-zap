/* 
Filename: sophisticated_code.js
Description: This code implements a sophisticated image processing algorithm using convolution matrices and various image manipulation techniques.
*/

// Create a canvas element and load an image
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const image = new Image();
image.src = 'image.jpg';

// Wait for the image to load
image.onload = function() {
  // Set the canvas size to match the image size
  canvas.width = image.width;
  canvas.height = image.height;
  
  // Draw the image onto the canvas
  ctx.drawImage(image, 0, 0);
  
  // Get the image data (pixel values)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  
  // Apply a grayscale filter to the image
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const grayscale = 0.2989 * r + 0.5870 * g + 0.1140 * b;
    pixels[i] = grayscale;
    pixels[i + 1] = grayscale;
    pixels[i + 2] = grayscale;
  }
  
  // Apply a sharpening filter to the image
  const kernel = [
    [-1, -1, -1],
    [-1,  9, -1],
    [-1, -1, -1]
  ];
  const halfKernelSize = Math.floor(kernel.length / 2);
  const modifiedPixels = new Uint8ClampedArray(pixels.length);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let r = 0, g = 0, b = 0;
      
      for (let ky = 0; ky < kernel.length; ky++) {
        for (let kx = 0; kx < kernel.length; kx++) {
          const px = x + kx - halfKernelSize;
          const py = y + ky - halfKernelSize;
          
          if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
            const i = (py * canvas.width + px) * 4;
            const k = kernel[ky][kx];
            
            r += pixels[i] * k;
            g += pixels[i + 1] * k;
            b += pixels[i + 2] * k;
          }
        }
      }
      
      const i = (y * canvas.width + x) * 4;
      modifiedPixels[i] = pixels[i] + r;
      modifiedPixels[i + 1] = pixels[i + 1] + g;
      modifiedPixels[i + 2] = pixels[i + 2] + b;
      modifiedPixels[i + 3] = pixels[i + 3];
    }
  }
  
  // Apply a brightness adjustment to the image
  const brightness = 50;
  for (let i = 0; i < modifiedPixels.length; i += 4) {
    modifiedPixels[i] += brightness;
    modifiedPixels[i + 1] += brightness;
    modifiedPixels[i + 2] += brightness;
  }
  
  // Update the canvas with the modified image data
  const modifiedImageData = new ImageData(modifiedPixels, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.putImageData(modifiedImageData, 0, 0);
  
  // Display the modified image
  document.body.appendChild(canvas);
};