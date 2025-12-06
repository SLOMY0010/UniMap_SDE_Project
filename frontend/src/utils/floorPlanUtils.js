/**
 * Utility functions for floor plan coordinate calculations
 */

// Standard reference dimensions for floor plans (based on typical floor plan images)
export const FLOOR_PLAN_DIMENSIONS = {
  width: 600,   // Standard width reference for coordinate calculations
  height: 800,  // Standard height reference for coordinate calculations
};

// Actual container dimensions for different UI contexts
export const CONTAINER_DIMENSIONS = {
  'search-results': {
    width: 512,   // Effective width for h-80 container with padding
    height: 320   // h-80 = 320px
  },
  'building-map': {
    width: 600,   // Building map uses larger container
    height: 500   // Fixed height for building map
  }
};

/**
 * Calculate pin position percentage based on room coordinates
 * Uses a reference coordinate system and converts to percentages for the actual container
 * @param {number|null} mapX - X coordinate from database
 * @param {number|null} mapY - Y coordinate from database
 * @param {string} containerType - Type of container ('search-results' or 'building-map')
 * @returns {Object} - {x: percentage, y: percentage}
 */
export const calculatePinPosition = (mapX, mapY, containerType = 'search-results') => {
  // Default to center if no coordinates
  if (mapX === null || mapY === null) {
    return { x: 50, y: 50 };
  }

  // Get container dimensions
  const container = CONTAINER_DIMENSIONS[containerType] || CONTAINER_DIMENSIONS['search-results'];

  // Calculate percentages based on reference dimensions
  // This converts from the database coordinate system to percentage-based positioning
  const xPercent = Math.min(Math.max((mapX / FLOOR_PLAN_DIMENSIONS.width) * 100, 2), 98);
  const yPercent = Math.min(Math.max((mapY / FLOOR_PLAN_DIMENSIONS.height) * 100, 2), 98);

  return { x: xPercent, y: yPercent };
};

/**
 * Get container dimensions for different screen sizes
 * @param {string} containerType - Type of container ('search-results' or 'building-map')
 * @returns {Object} - {width: number, height: number}
 */
export const getContainerDimensions = (containerType = 'search-results') => {
  return CONTAINER_DIMENSIONS[containerType] || CONTAINER_DIMENSIONS['search-results'];
};

/**
 * Adjust coordinates for different image aspect ratios
 * @param {number} xPercent - X percentage
 * @param {number} yPercent - Y percentage
 * @param {number} imageWidth - Actual image width
 * @param {number} imageHeight - Actual image height
 * @param {number} containerWidth - Container width
 * @param {number} containerHeight - Container height
 * @returns {Object} - Adjusted {x: percentage, y: percentage}
 */
export const adjustForAspectRatio = (xPercent, yPercent, imageWidth, imageHeight, containerWidth, containerHeight) => {
  // Calculate aspect ratios
  const imageAspect = imageWidth / imageHeight;
  const containerAspect = containerWidth / containerHeight;

  let adjustedX = xPercent;
  let adjustedY = yPercent;

  if (imageAspect > containerAspect) {
    // Image is wider than container - height will be constrained
    const scale = containerHeight / imageHeight;
    const scaledWidth = imageWidth * scale;
    const xOffset = (scaledWidth - containerWidth) / 2;
    adjustedX = ((xPercent / 100) * scaledWidth - xOffset) / containerWidth * 100;
  } else {
    // Image is taller than container - width will be constrained
    const scale = containerWidth / imageWidth;
    const scaledHeight = imageHeight * scale;
    const yOffset = (scaledHeight - containerHeight) / 2;
    adjustedY = ((yPercent / 100) * scaledHeight - yOffset) / containerHeight * 100;
  }

  return {
    x: Math.min(Math.max(adjustedX, 2), 98),
    y: Math.min(Math.max(adjustedY, 2), 98)
  };
};