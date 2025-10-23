/**
 * Response Formatter
 * Single Responsibility: Format API responses into standardized output
 */

import { ModelId, AVAILABLE_MODELS, DEFAULT_MODEL, MODEL_IDS } from '../config/constants.js';
import { ImageGenerationResponse, ImageInfo, OpenRouterResponse } from '../domain/models.js';

/**
 * Parameters for formatting image generation response
 */
export interface ImageGenerationResponseParams {
  prompt: string;
  model: ModelId;
  imageUrl: string | null;
  savedFile: string | null;
  apiResponse: OpenRouterResponse;
  showFullResponse: boolean;
}

export class ResponseFormatter {
  /**
   * Formats the image generation result into a tool response
   */
  formatImageGenerationResponse(params: ImageGenerationResponseParams) {
    const { prompt, model, imageUrl, savedFile, apiResponse, showFullResponse } = params;
    const content = apiResponse.choices[0]?.message?.content ?? '';

    const response: ImageGenerationResponse = {
      success: true,
      model,
      prompt,
      message: content || 'Image generated successfully',
    };

    if (imageUrl) {
      response.image = this.formatImageInfo(imageUrl, showFullResponse);
    }

    if (savedFile) {
      response.savedTo = savedFile;
    }

    if (apiResponse.usage) {
      response.usage = {
        tokens: apiResponse.usage.total_tokens ?? 0,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  /**
   * Formats the model list response
   */
  formatModelListResponse() {
    const modelList = MODEL_IDS.map((id) => {
      const description = AVAILABLE_MODELS[id];
      return `• ${id}\n  ${description}`;
    }).join('\n\n');

    const text = `Available OpenRouter Image Generation Models:
${modelList}

Default model: ${DEFAULT_MODEL}

Notes:
• Control image style, aspect ratio, and composition directly in your prompt.
• Specify the optional "model" parameter when calling generate_image to switch models.
• Save results locally by setting "save_to_file" to true and providing a "filename".

Examples:
• For multiple images: "Generate 3 variations of..." (note: model may not always follow exact count)
• For square images: Include "square image" in your prompt
• For landscape: Include "landscape orientation" or "16:9 aspect ratio"
• For portrait: Include "portrait orientation" or "9:16 aspect ratio"
• For specific styles: "photorealistic", "oil painting", "watercolor", "digital art", etc.
• For quality: "ultra HD", "4K", "highly detailed", etc.

The model interprets your natural language description to generate images matching your requirements.`;

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * Formats image information based on type and verbosity settings
   */
  private formatImageInfo(imageUrl: string, showFullResponse: boolean): ImageInfo {
    if (imageUrl.startsWith('data:image')) {
      return this.formatBase64ImageInfo(imageUrl, showFullResponse);
    }

    return {
      type: 'url',
      url: imageUrl,
    };
  }

  /**
   * Formats base64 image information
   */
  private formatBase64ImageInfo(dataUrl: string, showFullResponse: boolean): ImageInfo {
    const size = `${Math.round(dataUrl.length / 1024)}KB`;
    const format = this.extractFormatFromDataUrl(dataUrl);

    if (showFullResponse) {
      return {
        type: 'base64',
        data: dataUrl,
        size,
        format,
      };
    }

    // Default: concise info without the actual data
    return {
      type: 'base64',
      size,
      format,
    };
  }

  /**
   * Extracts image format from data URL
   */
  private extractFormatFromDataUrl(dataUrl: string): string {
    const format = dataUrl.substring(11, dataUrl.indexOf(';'));
    return format || 'unknown';
  }
}
