/**
 * OpenRouter API Client
 * Single Responsibility: Handle HTTP communication with OpenRouter API
 * Follows Dependency Inversion Principle - depends on abstractions (fetch interface)
 */

import fetch, { Response } from 'node-fetch';
import { API_CONFIG, HTTP_STATUS, ModelId } from '../config/constants.js';
import { OpenRouterResponse } from '../domain/models.js';
import { AuthenticationError, ImageGenerationError } from '../domain/errors.js';

export class ApiClient {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generates an image using the OpenRouter API
   */
  async generateImage(prompt: string, model: ModelId): Promise<OpenRouterResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(this.buildRequestBody(prompt, model)),
      });

      await this.handleResponseErrors(response);

      return await response.json() as OpenRouterResponse;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new ImageGenerationError(
        'Failed to generate image via API',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Builds HTTP headers for API request
   */
  private buildHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': API_CONFIG.REFERER,
      'X-Title': API_CONFIG.APP_TITLE,
    };
  }

  /**
   * Builds request body for image generation
   */
  private buildRequestBody(prompt: string, model: ModelId) {
    return {
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };
  }

  /**
   * Handles HTTP error responses
   */
  private async handleResponseErrors(response: Response): Promise<void> {
    if (response.ok) {
      return;
    }

    const errorText = await response.text();

    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      throw new AuthenticationError(
        `Authentication failed (401): Invalid API key. Please check your OPENROUTER_API_KEY. Error: ${errorText}`,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (response.status === HTTP_STATUS.FORBIDDEN) {
      throw new AuthenticationError(
        `Access denied (403): Your API key may not have access to this model. Error: ${errorText}`,
        HTTP_STATUS.FORBIDDEN
      );
    }

    throw new ImageGenerationError(`OpenRouter API error: ${response.status} - ${errorText}`);
  }
}
