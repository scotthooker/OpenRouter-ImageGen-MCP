/**
 * Unit tests for ImageProcessor
 * Testing image processing logic in isolation
 */

// Mock node-fetch to avoid ESM import issues
jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { ImageProcessor } from '../services/ImageProcessor.js';
import { ImageProcessingError } from '../domain/errors.js';

describe('ImageProcessor', () => {
  let processor: ImageProcessor;

  beforeEach(() => {
    processor = new ImageProcessor();
  });

  describe('extractImageUrl', () => {
    it('should extract URL from structured images array', () => {
      const images = [{ image_url: { url: 'https://example.com/image.png' } }];
      const result = processor.extractImageUrl('', images);

      expect(result).toBe('https://example.com/image.png');
    });

    it('should return null if images array is empty', () => {
      const result = processor.extractImageUrl('', []);

      expect(result).toBeNull();
    });

    it('should extract direct HTTP URL from content', () => {
      const content = 'https://example.com/image.png';
      const result = processor.extractImageUrl(content);

      expect(result).toBe('https://example.com/image.png');
    });

    it('should extract direct HTTPS URL from content', () => {
      const content = 'http://example.com/image.jpg';
      const result = processor.extractImageUrl(content);

      expect(result).toBe('http://example.com/image.jpg');
    });

    it('should extract data URL from content', () => {
      const content = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
      const result = processor.extractImageUrl(content);

      expect(result).toBe(content);
    });

    it('should extract URL from markdown format', () => {
      const content = 'Here is your image: ![alt text](https://example.com/image.png)';
      const result = processor.extractImageUrl(content);

      expect(result).toBe('https://example.com/image.png');
    });

    it('should extract URL from text containing URL', () => {
      const content = 'The image is available at https://example.com/image.png for download';
      const result = processor.extractImageUrl(content);

      expect(result).toBe('https://example.com/image.png');
    });

    it('should return null when no URL found', () => {
      const content = 'No URL here';
      const result = processor.extractImageUrl(content);

      expect(result).toBeNull();
    });
  });

  describe('sanitizeFilename', () => {
    it('should replace special characters with underscores', () => {
      const result = processor.sanitizeFilename('file name with spaces');

      expect(result).toBe('file_name_with_spaces');
    });

    it('should remove non-alphanumeric characters except dash and underscore', () => {
      const result = processor.sanitizeFilename('file@#$%name!');

      expect(result).toBe('file_name_');
    });

    it('should truncate long filenames', () => {
      const longName = 'a'.repeat(100);
      const result = processor.sanitizeFilename(longName);

      expect(result.length).toBeLessThanOrEqual(64);
    });

    it('should preserve valid characters', () => {
      const result = processor.sanitizeFilename('valid-file_name123');

      expect(result).toBe('valid-file_name123');
    });
  });

  describe('resolveImage', () => {
    it('should throw ImageProcessingError when no image data provided', async () => {
      await expect(processor.resolveImage({})).rejects.toThrow(ImageProcessingError);
    });

    it('should resolve image from base64 string', async () => {
      const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAUA';
      const result = await processor.resolveImage({ base64 });

      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.extension).toBe('png');
    });

    it('should resolve image from b64_json', async () => {
      const b64_json = 'iVBORw0KGgoAAAANSUhEUgAAAAUA';
      const result = await processor.resolveImage({ b64_json, mimeType: 'image/jpeg' });

      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.extension).toBe('jpg');
    });

    it('should resolve image from Buffer bytes', async () => {
      const buffer = Buffer.from('fake image data');
      const result = await processor.resolveImage({ bytes: buffer, mimeType: 'image/png' });

      expect(result.buffer).toBe(buffer);
      expect(result.extension).toBe('png');
    });

    it('should resolve image from Uint8Array bytes', async () => {
      const uint8 = new Uint8Array([1, 2, 3, 4]);
      const result = await processor.resolveImage({ bytes: uint8, mimeType: 'image/webp' });

      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.extension).toBe('webp');
    });

    it('should default to png extension when mime type is unknown', async () => {
      const base64 = 'somedata';
      const result = await processor.resolveImage({ base64 });

      expect(result.extension).toBe('png');
    });
  });
});
