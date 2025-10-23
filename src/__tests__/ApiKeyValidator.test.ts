/**
 * Unit tests for ApiKeyValidator
 * Testing validation logic in isolation
 */

import { ApiKeyValidator } from '../validators/ApiKeyValidator.js';
import { ApiKeyError } from '../domain/errors.js';

describe('ApiKeyValidator', () => {
  let validator: ApiKeyValidator;

  beforeEach(() => {
    validator = new ApiKeyValidator();
  });

  describe('validate', () => {
    it('should pass validation for valid API key', () => {
      const validKey = 'sk-or-v1-1234567890abcdef1234567890abcdef';
      expect(() => validator.validate(validKey)).not.toThrow();
    });

    it('should throw ApiKeyError when API key is undefined', () => {
      expect(() => validator.validate(undefined)).toThrow(ApiKeyError);
      expect(() => validator.validate(undefined)).toThrow(/not set/);
    });

    it('should throw ApiKeyError when API key is too short', () => {
      const shortKey = 'sk-or-short';
      expect(() => validator.validate(shortKey)).toThrow(ApiKeyError);
      expect(() => validator.validate(shortKey)).toThrow(/too short/);
    });

    it('should warn when API key does not have expected prefix', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const keyWithoutPrefix = 'invalid-1234567890abcdef1234567890abcdef';

      validator.validate(keyWithoutPrefix);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('sk-or-')
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('getMaskedKey', () => {
    it('should return [NOT SET] for undefined key', () => {
      expect(validator.getMaskedKey(undefined)).toBe('[NOT SET]');
    });

    it('should return [TOO SHORT] for short key', () => {
      expect(validator.getMaskedKey('short')).toBe('[TOO SHORT]');
    });

    it('should mask valid key correctly', () => {
      const key = 'sk-or-v1-1234567890abcdef';
      const masked = validator.getMaskedKey(key);

      expect(masked).toContain('sk-or-v1-');
      expect(masked).toContain('...');
      expect(masked).toContain('cdef');
      expect(masked).not.toContain('1234567890abcd');
    });
  });
});
