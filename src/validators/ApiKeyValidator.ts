/**
 * API Key Validator
 * Single Responsibility: Validate API key format and presence
 */

import { API_KEY_CONFIG } from '../config/constants.js';
import { ApiKeyError } from '../domain/errors.js';

export class ApiKeyValidator {
  /**
   * Validates that an API key is present and well-formed
   * @throws {ApiKeyError} if the API key is invalid
   */
  validate(apiKey: string | undefined): asserts apiKey is string {
    if (!apiKey) {
      throw new ApiKeyError(
        `${API_KEY_CONFIG.ENV_VAR_NAME} environment variable is not set. ` +
        'Please set it in your Claude Desktop config or environment.'
      );
    }

    if (apiKey.length < API_KEY_CONFIG.MIN_LENGTH) {
      throw new ApiKeyError(
        `${API_KEY_CONFIG.ENV_VAR_NAME} appears to be invalid (too short). ` +
        'Please check your API key.'
      );
    }

    if (!apiKey.startsWith(API_KEY_CONFIG.EXPECTED_PREFIX)) {
      console.warn(
        `Warning: OpenRouter API keys typically start with "${API_KEY_CONFIG.EXPECTED_PREFIX}". ` +
        'Your key may be invalid.'
      );
    }
  }

  /**
   * Gets a masked version of the API key for logging
   */
  getMaskedKey(apiKey: string | undefined): string {
    if (!apiKey) {
      return '[NOT SET]';
    }

    if (apiKey.length < 14) {
      return '[TOO SHORT]';
    }

    return `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`;
  }
}
