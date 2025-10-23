/**
 * Request Validator
 * Single Responsibility: Validate and normalize incoming requests
 */

import { DEFAULT_MODEL, MODEL_IDS, AVAILABLE_MODELS } from '../config/constants.js';
import { ImageGenerationRequest, NormalizedImageGenerationArgs } from '../domain/models.js';
import { ModelNotSupportedError } from '../domain/errors.js';

export class RequestValidator {
  /**
   * Normalizes and validates image generation request arguments
   */
  normalizeImageGenerationRequest(request: ImageGenerationRequest): NormalizedImageGenerationArgs {
    const requestedModel = this.getRequestedModel(request.model);
    this.validateModel(requestedModel);

    // Handle both snake_case (from MCP tool schema) and camelCase (from TypeScript)
    const saveToFile = (request as any).save_to_file ?? request.saveToFile ?? false;
    const showFullResponse = (request as any).show_full_response ?? request.showFullResponse ?? false;

    return {
      prompt: request.prompt,
      model: requestedModel,
      saveToFile,
      filename: request.filename ?? 'generated_image',
      showFullResponse,
    };
  }

  private getRequestedModel(model?: string): string {
    if (!model || model.trim().length === 0) {
      return DEFAULT_MODEL;
    }
    return model.trim();
  }

  private validateModel(model: string): asserts model is keyof typeof AVAILABLE_MODELS {
    const isSupportedModel = Object.prototype.hasOwnProperty.call(AVAILABLE_MODELS, model);
    if (!isSupportedModel) {
      throw new ModelNotSupportedError(model, MODEL_IDS);
    }
  }
}
