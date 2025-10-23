/**
 * Application Configuration Constants
 * Centralized configuration to follow DRY principle and enable easy modification
 */

export const API_CONFIG = {
  BASE_URL: 'https://openrouter.ai/api/v1',
  REFERER: 'https://github.com/openrouter-image-gen-mcp',
  APP_TITLE: 'OpenRouter Image Generation MCP Server',
  TIMEOUT_MS: 30000,
} as const;

export const API_KEY_CONFIG = {
  MIN_LENGTH: 20,
  EXPECTED_PREFIX: 'sk-or-',
  ENV_VAR_NAME: 'OPENROUTER_API_KEY',
} as const;

export const AVAILABLE_MODELS = {
  'openai/gpt-5-image':
    'OpenAI GPT-5 Image — highest quality general-purpose image generation.',
  'openai/gpt-5-image-mini':
    'OpenAI GPT-5 Image Mini — faster, lower-cost variant with balanced quality.',
  'google/gemini-2.5-flash-image':
    'Google Gemini 2.5 Flash Image — fast Gemini image generation model.',
  'google/gemini-2.5-flash-image-preview':
    'Google Gemini 2.5 Flash Image Preview — latest Gemini preview image model.'
} as const;

export type ModelId = keyof typeof AVAILABLE_MODELS;

export const DEFAULT_MODEL: ModelId = 'google/gemini-2.5-flash-image-preview';
export const MODEL_IDS = Object.keys(AVAILABLE_MODELS) as ModelId[];

export const FILE_CONFIG = {
  OUTPUT_DIR: 'generated_images',
  DEFAULT_FILENAME: 'generated_image',
  MAX_FILENAME_LENGTH: 64,
  ALLOWED_EXTENSIONS: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'svg', 'ico', 'avif'] as const,
} as const;

export const MIME_TYPE_MAP: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/tiff': 'tiff',
  'image/avif': 'avif',
  'image/svg+xml': 'svg'
} as const;

export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;

export const SERVER_INFO = {
  NAME: 'openrouter-image-gen-mcp',
  VERSION: '1.1.0',
} as const;
