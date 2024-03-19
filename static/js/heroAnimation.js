/**
 * Author: ByteMeXpert
 * Date: 2024-03-18
 * Description: Dynamically applies a moving sinusoidal wave effect to an image on HTML5 Canvas,
 * ensuring the image dynamically adjusts to fit the window on resizing, without borders or being obscured.
 **/

window.onload = function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  let phase = 0; // Initial phase for the wave

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animateWaveEffect(); // Trigger the animation to adjust to new canvas size
  }

  // Listen for resize events to adjust canvas and image size dynamically
  window.addEventListener('resize', resizeCanvas, false);

  img.onload = function() {
    resizeCanvas(); // Ensure the image and canvas are correctly sized initially
  };

  img.src = '../images/Asset7.svg'; // Use a pre-rasterized image for optimal performance if necessary

  function applyWaveEffect(phase) {
    // Clear the canvas for the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale and draw the image to fill the canvas, maintaining aspect ratio
    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const scaleToFit = Math.min(scaleX, scaleY);
    const offsetX = (canvas.width - (img.width * scaleToFit)) / 2;
    const offsetY = (canvas.height - (img.height * scaleToFit)) / 2;
    ctx.drawImage(img, offsetX, offsetY, img.width * scaleToFit, img.height * scaleToFit);

    // Apply the wave effect on the scaled image
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const waveData = ctx.createImageData(width, height);

    const amplitude = 60; // Amplitude of the wave
    const frequency = 0.0075; // Frequency of the wave

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tx = x;
        const ty = y + Math.sin(x * frequency + phase) * amplitude; // Apply the wave effect vertically

        const srcIndex = (y * width + x) * 4;
        let dstIndex = (Math.floor(ty) * width + Math.floor(tx)) * 4;

        if (dstIndex >= 0 && dstIndex < waveData.data.length) {
          waveData.data[dstIndex] = data[srcIndex];       // R
          waveData.data[dstIndex + 1] = data[srcIndex + 1]; // G
          waveData.data[dstIndex + 2] = data[srcIndex + 2]; // B
          waveData.data[dstIndex + 3] = data[srcIndex + 3]; // A
        }
      }
    }

    ctx.putImageData(waveData, 0, 0);
  }

  function animateWaveEffect() {
    phase += 0.005; // Adjust this value to control the speed of the wave
    applyWaveEffect(phase);
    requestAnimationFrame(animateWaveEffect);
  }
};
