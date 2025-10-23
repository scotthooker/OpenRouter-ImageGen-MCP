/**
 * MCP Tool Schema Definitions
 * Defines the interface schemas for available MCP tools
 */

import { DEFAULT_MODEL, MODEL_IDS } from './constants.js';

export const TOOL_SCHEMAS = [
  {
    name: 'generate_image',
    description: 'Generate images via OpenRouter using configurable models (OpenAI GPT-5 Image, GPT-5 Image Mini, Gemini Flash Image, Gemini Flash Image Preview).',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Text description of the image to generate. Include style details (e.g., "photorealistic", "oil painting"), aspect ratio (e.g., "square image", "landscape"), and composition details directly in the prompt.',
        },
        model: {
          type: 'string',
          description: `Optional model ID. Defaults to ${DEFAULT_MODEL}. Available models: ${MODEL_IDS.join(', ')}`,
          enum: MODEL_IDS,
          default: DEFAULT_MODEL,
        },
        save_to_file: {
          type: 'boolean',
          description: 'Save generated image to local file',
          default: false,
        },
        filename: {
          type: 'string',
          description: 'Base filename for saved image (without extension)',
        },
        show_full_response: {
          type: 'boolean',
          description: 'Show full response including base64 data (default: false)',
          default: false,
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'list_models',
    description: 'List available OpenRouter image generation models and their descriptions.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];
