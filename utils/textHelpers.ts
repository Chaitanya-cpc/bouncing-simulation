import { PIXEL_MAP } from './pixelMap';

/**
 * Validates if all characters in a string can be rendered using the pixel map
 * @param text The text to validate
 * @returns True if all characters are valid, false otherwise
 */
export const validateText = (text: string): boolean => {
  if (!text) return false;
  
  // Convert to uppercase since our pixel map only has uppercase characters
  const upperText = text.toUpperCase();
  
  // Check if all characters exist in the PIXEL_MAP
  return upperText.split('').every(char => char in PIXEL_MAP || char === ' ');
};

/**
 * Transforms input text to be compatible with our rendering system
 * @param text Input text
 * @returns Transformed text suitable for rendering
 */
export const prepareTextForRendering = (text: string): string => {
  if (!text) return '';
  
  // Convert to uppercase but don't trim whitespace
  let processed = text.toUpperCase();
  
  // Replace any unsupported characters with spaces
  processed = processed.split('').map(char => 
    char in PIXEL_MAP || char === ' ' ? char : ' '
  ).join('');
  
  return processed;
}; 