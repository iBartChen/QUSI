/**
 * Applies a "punch" distortion to the image data.
 * This pushes pixels away from the center (or pulls them in) to create a dent/bulge effect.
 */
export const applyPunch = (
  imageData: ImageData, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  intensity: number
): ImageData => {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // Create a copy to read from, so we don't sample modified pixels
  const buffer = new Uint8ClampedArray(data);
  
  // Bounding box optimization: only loop through pixels within the effect radius
  const minX = Math.max(0, Math.floor(centerX - radius));
  const maxX = Math.min(width, Math.ceil(centerX + radius));
  const minY = Math.max(0, Math.floor(centerY - radius));
  const maxY = Math.min(height, Math.ceil(centerY + radius));

  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        // Calculate the distortion amount
        // 1.0 at center, 0.0 at edge
        const amount = 1 - distance / radius;
        
        // Non-linear distortion for better look (smoothstep-ish)
        const distortion = Math.sin(amount * Math.PI / 2) * intensity;
        
        // Calculate source coordinates
        // We look "inwards" or "outwards" depending on intensity sign
        const sourceX = x - (dx * distortion);
        const sourceY = y - (dy * distortion);

        // Bilinear interpolation could be used here for quality, 
        // but nearest neighbor is faster and fits the "rough/glitchy" aesthetic better for rapid clicks.
        const srcXInt = Math.floor(sourceX);
        const srcYInt = Math.floor(sourceY);

        // Clamp source coords
        if (srcXInt >= 0 && srcXInt < width && srcYInt >= 0 && srcYInt < height) {
          const targetIndex = (y * width + x) * 4;
          const sourceIndex = (srcYInt * width + srcXInt) * 4;

          data[targetIndex] = buffer[sourceIndex];     // R
          data[targetIndex + 1] = buffer[sourceIndex + 1]; // G
          data[targetIndex + 2] = buffer[sourceIndex + 2]; // B
          // Alpha remains unchanged usually, or copy it too
          data[targetIndex + 3] = buffer[sourceIndex + 3];
        }
      }
    }
  }
  
  return imageData;
};