# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-23

### Added
- Initial public release
- Support for multiple AI image generation models via OpenRouter API:
  - OpenAI GPT-5 Image
  - OpenAI GPT-5 Image Mini
  - Google Gemini 2.5 Flash Image
  - Google Gemini 2.5 Flash Image Preview (default)
- `generate_image` tool with parameters:
  - `prompt` (required): Text description of image to generate
  - `model` (optional): Model ID to use
  - `save_to_file` (optional): Save image locally
  - `filename` (optional): Custom filename for saved images
  - `show_full_response` (optional): Include full API response data
- `list_models` tool to view all available models
- Local image saving to `generated_images` folder
- Support for various image formats (URLs, base64, data URLs)
- Full TypeScript implementation with type safety
- Comprehensive test suite with >70% coverage
- Clean architecture following SOLID principles:
  - Configuration layer
  - Domain models and errors
  - Service layer (API client, image processor, repository)
  - Validators and formatters
  - Utility functions
- Claude Code MCP integration
- Professional landing page at imageroutermcp.com
- Deployment configurations for Netlify, Vercel, GitHub Pages
- Comprehensive documentation:
  - Installation guide
  - Configuration for Claude Code
  - Usage examples
  - API documentation
  - Contributing guidelines
  - Deployment guide

### Security
- API key validation
- Secure environment variable handling
- Input sanitization and validation

### Developer Experience
- ESLint configuration for code quality
- Prettier for code formatting
- Jest for testing with ESM support
- TypeScript strict mode
- NPM scripts for common tasks:
  - `npm run build` - Compile TypeScript
  - `npm test` - Run test suite
  - `npm run lint` - Check code quality
  - `npm run format` - Format code
  - `npm run website:serve` - Preview landing page locally
  - `npm run website:validate` - Validate website structure

[1.0.0]: https://github.com/scotthooker/OpenRouter-ImageGen-MCP/releases/tag/v1.0.0
