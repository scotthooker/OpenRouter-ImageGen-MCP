/**
 * Image Repository
 * Single Responsibility: Handle all file system operations for images
 * Follows Repository Pattern for data persistence abstraction
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { FILE_CONFIG } from '../config/constants.js';
import { ImageInput } from '../domain/models.js';
import { FileOperationError } from '../domain/errors.js';
import { ImageProcessor } from './ImageProcessor.js';

export class ImageRepository {
  private readonly imageProcessor: ImageProcessor;
  private readonly outputDirectory: string;

  constructor(
    imageProcessor: ImageProcessor,
    outputDirectory: string = FILE_CONFIG.OUTPUT_DIR
  ) {
    this.imageProcessor = imageProcessor;
    this.outputDirectory = outputDirectory;
  }

  /**
   * Saves multiple images to disk
   * @returns Array of saved file paths
   */
  async saveImages(images: ImageInput[], baseFilename: string): Promise<string[]> {
    try {
      await this.ensureOutputDirectoryExists();

      const savedFiles: string[] = [];

      for (let i = 0; i < images.length; i++) {
        try {
          const filepath = await this.saveImage(images[i], baseFilename, i);
          savedFiles.push(filepath);
        } catch (error) {
          console.error(`Failed to save image #${i + 1}:`, error);
        }
      }

      return savedFiles;
    } catch (error) {
      throw new FileOperationError(
        'Failed to save images',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Saves a single image to disk
   */
  private async saveImage(image: ImageInput, baseFilename: string, index: number): Promise<string> {
    const resolved = await this.imageProcessor.resolveImage(image);
    const filepath = this.generateFilePath(baseFilename, resolved.extension, index);

    try {
      await fs.writeFile(filepath, resolved.buffer);
      console.error(`Saved image to: ${filepath}`);
      return filepath;
    } catch (error) {
      throw new FileOperationError(
        `Failed to write image file`,
        filepath,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Generates a unique file path with timestamp
   */
  private generateFilePath(baseFilename: string, extension: string, index: number): string {
    const safeBase = this.imageProcessor.sanitizeFilename(
      baseFilename || FILE_CONFIG.DEFAULT_FILENAME
    );
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${safeBase}_${timestamp}_${index + 1}.${extension}`;

    return path.join(this.getAbsoluteOutputDirectory(), filename);
  }

  /**
   * Ensures the output directory exists
   */
  private async ensureOutputDirectoryExists(): Promise<void> {
    try {
      await fs.mkdir(this.getAbsoluteOutputDirectory(), { recursive: true });
    } catch (error) {
      throw new FileOperationError(
        'Failed to create output directory',
        this.getAbsoluteOutputDirectory(),
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Gets absolute path to output directory
   */
  private getAbsoluteOutputDirectory(): string {
    return path.join(process.cwd(), this.outputDirectory);
  }
}
