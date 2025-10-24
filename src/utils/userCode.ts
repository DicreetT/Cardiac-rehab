/**
 * Utility functions for managing user code
 */

const USER_CODE_KEY = 'bolita-salud-user-code';

/**
 * Save user code to localStorage
 */
export function saveUserCode(code: string): void {
  const formattedCode = code.trim().toUpperCase();
  localStorage.setItem(USER_CODE_KEY, formattedCode);
}

/**
 * Get user code from localStorage
 */
export function getUserCode(): string | null {
  return localStorage.getItem(USER_CODE_KEY);
}

/**
 * Clear user code from localStorage
 */
export function clearUserCode(): void {
  localStorage.removeItem(USER_CODE_KEY);
}

/**
 * Check if user code exists
 */
export function hasUserCode(): boolean {
  return getUserCode() !== null;
}
