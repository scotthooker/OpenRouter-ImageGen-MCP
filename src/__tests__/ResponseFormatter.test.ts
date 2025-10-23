/**
 * Unit tests for ResponseFormatter
 * Testing response formatting logic in isolation
 */

import { ResponseFormatter } from '../formatters/ResponseFormatter.js';
import { OpenRouterResponse, ImageGenerationResponse } from '../domain/models.js';

describe('ResponseFormatter', () => {
  let formatter: ResponseFormatter;

  beforeEach(() => {
    formatter = new ResponseFormatter();
  });

  describe('formatImageGenerationResponse', () => {
    const mockApiResponse: OpenRouterResponse = {
      choices: [
        {
          message: {
            content: 'Image generated successfully',
          },
        },
      ],
      usage: {
        total_tokens: 100,
      },
    };

    it('should format successful response with URL image', () => {
      const result = formatter.formatImageGenerationResponse({
        prompt: 'test prompt',
        model: 'google/gemini-2.5-flash-image-preview',
        imageUrl: 'https://example.com/image.png',
        savedFile: null,
        apiResponse: mockApiResponse,
        showFullResponse: false,
      });

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const parsed = JSON.parse(result.content[0].text) as ImageGenerationResponse;
      expect(parsed.success).toBe(true);
      expect(parsed.model).toBe('google/gemini-2.5-flash-image-preview');
      expect(parsed.prompt).toBe('test prompt');
      expect(parsed.image!.type).toBe('url');
      expect(parsed.image!.url).toBe('https://example.com/image.png');
      expect(parsed.usage!.tokens).toBe(100);
    });

    it('should format response with base64 image (concise mode)', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
      const result = formatter.formatImageGenerationResponse({
        prompt: 'test prompt',
        model: 'openai/gpt-5-image',
        imageUrl: dataUrl,
        savedFile: null,
        apiResponse: mockApiResponse,
        showFullResponse: false,
      });

      const parsed = JSON.parse(result.content[0].text) as ImageGenerationResponse;
      expect(parsed.image!.type).toBe('base64');
      expect(parsed.image!.data).toBeUndefined(); // Should not include data in concise mode
      expect(parsed.image!.size).toBeDefined();
      expect(parsed.image!.format).toBe('png');
    });

    it('should format response with base64 image (full mode)', () => {
      const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD';
      const result = formatter.formatImageGenerationResponse({
        prompt: 'test prompt',
        model: 'openai/gpt-5-image',
        imageUrl: dataUrl,
        savedFile: null,
        apiResponse: mockApiResponse,
        showFullResponse: true,
      });

      const parsed = JSON.parse(result.content[0].text) as ImageGenerationResponse;
      expect(parsed.image!.type).toBe('base64');
      expect(parsed.image!.data).toBe(dataUrl); // Should include data in full mode
      expect(parsed.image!.size).toBeDefined();
      expect(parsed.image!.format).toBe('jpeg');
    });

    it('should include saved file path when provided', () => {
      const result = formatter.formatImageGenerationResponse({
        prompt: 'test prompt',
        model: 'google/gemini-2.5-flash-image',
        imageUrl: 'https://example.com/image.png',
        savedFile: '/path/to/saved/image.png',
        apiResponse: mockApiResponse,
        showFullResponse: false,
      });

      const parsed = JSON.parse(result.content[0].text) as ImageGenerationResponse;
      expect(parsed.savedTo).toBe('/path/to/saved/image.png');
    });

    it('should handle response without image URL', () => {
      const result = formatter.formatImageGenerationResponse({
        prompt: 'test prompt',
        model: 'openai/gpt-5-image-mini',
        imageUrl: null,
        savedFile: null,
        apiResponse: mockApiResponse,
        showFullResponse: false,
      });

      const parsed = JSON.parse(result.content[0].text) as ImageGenerationResponse;
      expect(parsed.success).toBe(true);
      expect(parsed.image).toBeUndefined();
    });

    it('should handle response without usage data', () => {
      const noUsageResponse: OpenRouterResponse = {
        choices: [{ message: { content: 'test' } }],
      };

      const result = formatter.formatImageGenerationResponse({
        prompt: 'test prompt',
        model: 'google/gemini-2.5-flash-image-preview',
        imageUrl: 'https://example.com/image.png',
        savedFile: null,
        apiResponse: noUsageResponse,
        showFullResponse: false,
      });

      const parsed = JSON.parse(result.content[0].text) as ImageGenerationResponse;
      expect(parsed.usage).toBeUndefined();
    });
  });

  describe('formatModelListResponse', () => {
    it('should return properly formatted model list', () => {
      const result = formatter.formatModelListResponse();

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Available OpenRouter Image Generation Models');
      expect(result.content[0].text).toContain('openai/gpt-5-image');
      expect(result.content[0].text).toContain('google/gemini-2.5-flash-image-preview');
      expect(result.content[0].text).toContain('Default model:');
      expect(result.content[0].text).toContain('Examples:');
    });
  });
});
