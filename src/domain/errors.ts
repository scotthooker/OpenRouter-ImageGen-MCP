/**
 * Custom Error Classes
 * Following the Single Responsibility Principle - each error type represents a specific failure scenario
 */

export class ApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiKeyError';
    Object.setPrototypeOf(this, ApiKeyError.prototype);
  }
}

export class AuthenticationError extends Error {
  constructor(message: string, public readonly statusCode: number = 401) {
    super(message);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class ModelNotSupportedError extends Error {
  constructor(
    public readonly requestedModel: string,
    public readonly availableModels: readonly string[]
  ) {
    super(
      `Unsupported model "${requestedModel}". Available models: ${availableModels.join(', ')}`
    );
    this.name = 'ModelNotSupportedError';
    Object.setPrototypeOf(this, ModelNotSupportedError.prototype);
  }
}

export class ImageGenerationError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'ImageGenerationError';
    Object.setPrototypeOf(this, ImageGenerationError.prototype);
  }
}

export class ImageProcessingError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'ImageProcessingError';
    Object.setPrototypeOf(this, ImageProcessingError.prototype);
  }
}

export class FileOperationError extends Error {
  constructor(message: string, public readonly filepath?: string, public readonly cause?: Error) {
    super(message);
    this.name = 'FileOperationError';
    Object.setPrototypeOf(this, FileOperationError.prototype);
  }
}

export class InvalidDataUrlError extends Error {
  constructor(message: string = 'Invalid data URL format') {
    super(message);
    this.name = 'InvalidDataUrlError';
    Object.setPrototypeOf(this, InvalidDataUrlError.prototype);
  }
}
