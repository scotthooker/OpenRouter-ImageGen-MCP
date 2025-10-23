#!/usr/bin/env node
/**
 * OpenRouter Image Generation MCP Server
 * Refactored version following SOLID principles and clean code practices
 *
 * Architecture:
 * - Dependency Injection for testability
 * - Single Responsibility Principle - each class has one job
 * - Open/Closed Principle - extensible without modification
 * - Clear separation of concerns
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Configuration
import { SERVER_INFO, API_KEY_CONFIG } from './config/constants.js';
import { TOOL_SCHEMAS } from './config/toolSchemas.js';

// Domain
import { ImageGenerationRequest, ImageInput } from './domain/models.js';

// Services
import { ApiClient } from './services/ApiClient.js';
import { ImageProcessor } from './services/ImageProcessor.js';
import { ImageRepository } from './services/ImageRepository.js';

// Validators
import { ApiKeyValidator } from './validators/ApiKeyValidator.js';
import { RequestValidator } from './validators/RequestValidator.js';

// Formatters
import { ResponseFormatter } from './formatters/ResponseFormatter.js';

// Utils
import { Logger } from './utils/logger.js';

/**
 * Main MCP Server orchestrating all services
 * Follows Single Responsibility: Server setup and request routing only
 */
export class OpenRouterImageServer {
  private readonly server: Server;
  private readonly logger: Logger;
  private readonly apiKeyValidator: ApiKeyValidator;
  private readonly requestValidator: RequestValidator;
  private readonly responseFormatter: ResponseFormatter;
  private readonly imageProcessor: ImageProcessor;
  private readonly imageRepository: ImageRepository;
  private readonly apiClient: ApiClient | null;

  constructor() {
    this.logger = new Logger('OpenRouterImageServer');
    this.server = this.initializeServer();

    // Initialize validators and processors
    this.apiKeyValidator = new ApiKeyValidator();
    this.requestValidator = new RequestValidator();
    this.responseFormatter = new ResponseFormatter();
    this.imageProcessor = new ImageProcessor();
    this.imageRepository = new ImageRepository(this.imageProcessor);

    // Initialize API client if key is valid
    const apiKey = process.env[API_KEY_CONFIG.ENV_VAR_NAME];
    this.apiClient = this.initializeApiClient(apiKey);

    this.setupHandlers();
  }

  private initializeServer(): Server {
    return new Server(
      {
        name: SERVER_INFO.NAME,
        version: SERVER_INFO.VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
  }

  private initializeApiClient(apiKey: string | undefined): ApiClient | null {
    if (!apiKey) {
      this.logger.warn('OPENROUTER_API_KEY environment variable is not set');
      return null;
    }

    this.logger.info(`API Key loaded: ${this.apiKeyValidator.getMaskedKey(apiKey)}`);
    return new ApiClient(apiKey);
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, () => ({
      tools: TOOL_SCHEMAS,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'generate_image':
          return await this.handleGenerateImage(args as unknown as ImageGenerationRequest);
        case 'list_models':
          return this.handleListModels();
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private async handleGenerateImage(request: ImageGenerationRequest) {
    // Validate API key before proceeding
    const apiKey = process.env[API_KEY_CONFIG.ENV_VAR_NAME];
    this.apiKeyValidator.validate(apiKey);

    if (!this.apiClient) {
      throw new Error('API client not initialized');
    }

    // Normalize and validate arguments
    const args = this.requestValidator.normalizeImageGenerationRequest(request);

    try {
      // Call API to generate image
      const apiResponse = await this.apiClient.generateImage(args.prompt, args.model);

      // Extract image URL from response
      const imageUrl = this.imageProcessor.extractImageUrl(
        apiResponse.choices[0]?.message?.content ?? '',
        apiResponse.choices[0]?.message?.images
      );

      // Save to file if requested
      let savedFile: string | null = null;
      if (args.saveToFile && imageUrl) {
        savedFile = await this.saveImageToFile(imageUrl, args.filename);
      }

      // Format and return response
      return this.responseFormatter.formatImageGenerationResponse({
        prompt: args.prompt,
        model: args.model,
        imageUrl,
        savedFile,
        apiResponse,
        showFullResponse: args.showFullResponse,
      });
    } catch (error) {
      this.logger.error('Failed to generate image', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  private handleListModels() {
    return this.responseFormatter.formatModelListResponse();
  }

  private async saveImageToFile(imageUrl: string, filename: string): Promise<string> {
    const imageInput: ImageInput = imageUrl.startsWith('data:') || imageUrl.startsWith('http')
      ? { url: imageUrl }
      : { base64: imageUrl };

    const savedFiles = await this.imageRepository.saveImages([imageInput], filename);
    return savedFiles[0] || '';
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('OpenRouter Image Generation MCP Server running on stdio');
  }
}

// Bootstrap the application
const server = new OpenRouterImageServer();
server.run().catch(console.error);
