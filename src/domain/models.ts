/**
 * Domain Models and Types
 * Strongly typed domain entities following domain-driven design principles
 */

import { ModelId } from '../config/constants.js';

/**
 * Image generation request parameters
 */
export interface ImageGenerationRequest {
  readonly prompt: string;
  readonly model?: string;
  readonly saveToFile?: boolean;
  readonly filename?: string;
  readonly showFullResponse?: boolean;
}

/**
 * Normalized image generation arguments
 */
export interface NormalizedImageGenerationArgs {
  readonly prompt: string;
  readonly model: ModelId;
  readonly saveToFile: boolean;
  readonly filename: string;
  readonly showFullResponse: boolean;
}

/**
 * API response from OpenRouter
 */
export interface OpenRouterResponse {
  readonly choices: Array<{
    readonly message: {
      readonly content?: string;
      readonly images?: Array<{
        readonly image_url?: {
          readonly url: string;
        };
      }>;
    };
  }>;
  readonly usage?: {
    readonly total_tokens?: number;
  };
}

/**
 * Represents different image data sources
 */
export interface ImageInput {
  readonly url?: string;
  readonly b64_json?: string;
  readonly base64?: string;
  readonly bytes?: ArrayBuffer | Uint8Array | Buffer;
  readonly mimeType?: string;
  readonly contentType?: string;
}

/**
 * Resolved image data ready for file operations
 */
export interface ResolvedImage {
  readonly buffer: Buffer;
  readonly extension: string;
}

/**
 * Data URL parsing result
 */
export interface ParsedDataUrl {
  readonly buffer: Buffer;
  readonly mime?: string;
}

/**
 * Image information for response
 */
export interface ImageInfo {
  readonly type: 'url' | 'base64';
  readonly url?: string;
  readonly data?: string;
  readonly size?: string;
  readonly format?: string;
}

/**
 * Complete image generation response
 */
export interface ImageGenerationResponse {
  success: boolean;
  model: ModelId;
  prompt: string;
  message: string;
  image?: ImageInfo;
  savedTo?: string;
  usage?: {
    tokens: number;
  };
}

// Removed ToolResponse - we return the response object directly
