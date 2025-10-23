/**
 * Image Processor Service
 * Single Responsibility: Process and resolve images from various formats
 */

import fetch from 'node-fetch';
import * as path from 'path';
import { MIME_TYPE_MAP, FILE_CONFIG } from '../config/constants.js';
import { ImageInput, ResolvedImage, ParsedDataUrl } from '../domain/models.js';
import { ImageProcessingError, InvalidDataUrlError } from '../domain/errors.js';

export class ImageProcessor {
  /**
   * Resolves an image from various input formats to a buffer with extension
   */
  async resolveImage(image: ImageInput): Promise<ResolvedImage> {
    try {
      const { buffer, mime, ext } = await this.extractImageData(image);

      if (!buffer) {
        throw new ImageProcessingError('No image data found in input');
      }

      const extension = this.resolveExtension(mime, ext);
      return { buffer, extension };
    } catch (error) {
      this.handleResolutionError(error);
    }
  }

  /**
   * Extracts image data from various input formats
   */
  private async extractImageData(image: ImageInput): Promise<{
    buffer: Buffer | undefined;
    mime: string | undefined;
    ext: string | undefined;
  }> {
    if (image.url) {
      return await this.resolveFromUrl(image.url);
    }

    if (image.b64_json ?? image.base64) {
      const { buffer, mime } = this.resolveFromBase64(image.b64_json ?? image.base64!, image);
      return { buffer, mime, ext: undefined };
    }

    if (image.bytes) {
      return {
        buffer: this.resolveFromBytes(image.bytes),
        mime: image.mimeType ?? image.contentType,
        ext: undefined,
      };
    }

    return { buffer: undefined, mime: undefined, ext: undefined };
  }

  /**
   * Handles errors during image resolution
   */
  private handleResolutionError(error: unknown): never {
    if (error instanceof ImageProcessingError || error instanceof InvalidDataUrlError) {
      throw error;
    }
    throw new ImageProcessingError(
      'Failed to resolve image',
      error instanceof Error ? error : undefined
    );
  }

  /**
   * Extracts image URL from API response content
   * Handles multiple formats: direct URL, data URL, markdown-embedded URL
   */
  extractImageUrl(content: string, images?: Array<{ image_url?: { url: string } }>): string | null {
    // Check structured images array first (Gemini format)
    if (images && images.length > 0) {
      const firstImage = images[0];
      if (firstImage.image_url?.url) {
        return firstImage.image_url.url;
      }
    }

    // Check if content is a direct URL
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return content;
    }

    // Check if content is a data URL
    if (content.startsWith('data:image')) {
      return content;
    }

    // Try to extract URL from markdown format
    const markdownMatch = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
    if (markdownMatch) {
      return markdownMatch[1];
    }

    // Try to extract any URL from the content
    const urlMatch = content.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      return urlMatch[0];
    }

    return null;
  }

  /**
   * Sanitizes filename to be filesystem-safe
   */
  sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9_-]+/gi, '_')
      .slice(0, FILE_CONFIG.MAX_FILENAME_LENGTH);
  }

  private async resolveFromUrl(url: string): Promise<{ buffer: Buffer; mime: string | undefined; ext: string | undefined }> {
    if (url.startsWith('data:')) {
      const parsed = this.parseDataUrl(url);
      return { buffer: parsed.buffer, mime: parsed.mime, ext: undefined };
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new ImageProcessingError(
          `Failed to fetch image from ${url}: ${response.status} ${response.statusText}`
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mime = response.headers.get('content-type') ?? undefined;
      const ext = this.extractExtensionFromUrl(url);

      return { buffer, mime, ext };
    } catch (error) {
      throw new ImageProcessingError(
        `Failed to fetch image from URL: ${url}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  private resolveFromBase64(
    base64Data: string,
    image: ImageInput
  ): { buffer: Buffer; mime: string | undefined } {
    const cleanBase64 = base64Data.replace(/^data:.*;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const mime = image.mimeType ?? image.contentType;
    return { buffer, mime };
  }

  private resolveFromBytes(bytes: ArrayBuffer | Uint8Array | Buffer): Buffer {
    if (Buffer.isBuffer(bytes)) return bytes;
    if (bytes instanceof Uint8Array) return Buffer.from(bytes);
    if (bytes instanceof ArrayBuffer) return Buffer.from(bytes);
    throw new ImageProcessingError('Unsupported bytes format');
  }

  private parseDataUrl(dataUrl: string): ParsedDataUrl {
    const match = dataUrl.match(/^data:([^;,]+)?(;base64)?,(.*)$/i);
    if (!match) throw new InvalidDataUrlError();

    const [, mime, isBase64Flag, data] = match;
    const buffer = isBase64Flag
      ? Buffer.from(data, 'base64')
      : Buffer.from(decodeURIComponent(data), 'utf8');

    return { buffer, mime };
  }

  private resolveExtension(mime?: string, ext?: string): string {
    return this.mimeToExtension(mime) ?? ext ?? 'png';
  }

  private mimeToExtension(mime?: string | null): string | undefined {
    if (!mime) return undefined;
    return MIME_TYPE_MAP[mime.split(';')[0].trim().toLowerCase()];
  }

  private extractExtensionFromUrl(url: string): string | undefined {
    try {
      const ext = path.extname(new URL(url).pathname).slice(1).toLowerCase();
      const allowedExtensions = FILE_CONFIG.ALLOWED_EXTENSIONS as readonly string[];
      if (!ext || !allowedExtensions.includes(ext)) {
        return undefined;
      }
      return ext === 'jpeg' ? 'jpg' : ext;
    } catch {
      return undefined;
    }
  }
}
