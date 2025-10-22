# OpenRouter ImageGen MCP

A Model Context Protocol (MCP) server that enables AI assistants like Claude to generate images using multiple AI models via the OpenRouter API.

🌐 **[Visit our landing page at imageroutermcp.com](https://imageroutermcp.com)** for interactive documentation and examples!

## Features

- 🎨 **Multiple Model Support**: OpenAI GPT-5 Image, GPT-5 Image Mini, Google Gemini 2.5 Flash Image
- 💾 **Local Saving**: Save generated images to your filesystem
- 🔄 **Flexible Input**: Supports various image data formats (URLs, base64, data URLs)
- ⚡ **Type-Safe**: Built with TypeScript for reliability
- 🧪 **Well-Tested**: Comprehensive test coverage

## Supported Models

| Model | Description | Best For |
|-------|-------------|----------|
| `openai/gpt-5-image` | Highest quality general-purpose | Professional quality images |
| `openai/gpt-5-image-mini` | Faster, balanced quality | Quick iterations |
| `google/gemini-2.5-flash-image` | Fast Gemini model | Speed-focused tasks |
| `google/gemini-2.5-flash-image-preview` | Latest preview (default) | Latest features |

## Installation

### Prerequisites

- Node.js 18 or higher
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/scotthooker/OpenRouter-ImageGen-MCP.git
   cd OpenRouter-ImageGen-MCP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Get your OpenRouter API key**
   - Sign up at [OpenRouter](https://openrouter.ai/)
   - Generate an API key from your dashboard

## Configuration

### For Claude Desktop

Add to your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "openrouter-imagegen": {
      "command": "node",
      "args": [
        "/absolute/path/to/OpenRouter-ImageGen-MCP/dist/index.js"
      ],
      "env": {
        "OPENROUTER_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### For Other MCP Clients

Set the `OPENROUTER_API_KEY` environment variable:

```bash
export OPENROUTER_API_KEY="your-api-key-here"
npm start
```

## Usage

Once configured, your AI assistant can generate images using natural language:

### Basic Examples

```
"Generate a photorealistic sunset over mountains"

"Create a watercolor painting of a cat in a garden"

"Make a minimalist logo for a tech startup"
```

### Advanced Examples

```
"Generate a square image of a futuristic city at night, cyberpunk style, ultra HD"

"Create a landscape orientation image of a serene lake, oil painting style"

"Generate 3 variations of an abstract pattern, digital art style"
```

### Saving Images

```
"Generate an image of a dragon and save it as 'dragon_art'"
```

Images are saved to the `generated_images` folder in your current working directory.

## Available Tools

### `generate_image`

Generate images using AI models.

**Parameters:**
- `prompt` (required): Text description of the image to generate
- `model` (optional): Model ID to use (defaults to `google/gemini-2.5-flash-image-preview`)
- `save_to_file` (optional): Boolean, save image locally
- `filename` (optional): Base filename for saved image
- `show_full_response` (optional): Boolean, include full response data

**Example:**
```json
{
  "prompt": "A serene mountain landscape at sunset",
  "model": "openai/gpt-5-image",
  "save_to_file": true,
  "filename": "mountain_sunset"
}
```

### `list_models`

List all available image generation models with descriptions.

## Development

### Run Tests
```bash
npm test
```

### Run with Coverage
```bash
npm run test:coverage
```

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Type Check
```bash
npm run typecheck
```

### Website Development

To preview the landing page locally:
```bash
npm run website:serve
```

To validate the website structure:
```bash
npm run website:validate
```

See [website/README.md](website/README.md) for more details on website development and deployment.

## Project Structure

```
├── src/
│   ├── config/           # Configuration constants
│   ├── domain/           # Domain models and errors
│   ├── services/         # Business logic services
│   ├── validators/       # Input validation
│   ├── formatters/       # Response formatting
│   ├── utils/            # Utility functions
│   ├── __tests__/        # Test suites
│   └── index.ts          # Main entry point
├── website/              # Landing page (imageroutermcp.com)
│   ├── index.html        # Main landing page
│   ├── styles.css        # Styling
│   ├── script.js         # Interactive features
│   └── README.md         # Website documentation
├── dist/                 # Compiled JavaScript
└── generated_images/     # Saved images (created automatically)
```

## Architecture

Built following SOLID principles with clean architecture:

- **Separation of Concerns**: Each module has a single responsibility
- **Dependency Injection**: Services are loosely coupled
- **Type Safety**: Full TypeScript coverage
- **Testability**: Comprehensive unit and integration tests

## Troubleshooting

### "API key not set" error
- Ensure `OPENROUTER_API_KEY` is set in your environment or configuration file
- Verify the key starts with `sk-or-`

### "Model not supported" error
- Check the model ID matches one of the supported models
- Use `list_models` tool to see available options

### Images not saving
- Check write permissions in the current directory
- Verify the `generated_images` folder can be created

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/anthropics/model-context-protocol)
- Powered by [OpenRouter](https://openrouter.ai/)
- Supports models from OpenAI and Google

## Support

- 🌐 [Website](https://imageroutermcp.com) - Interactive documentation and examples
- 📫 [Report Issues](https://github.com/scotthooker/OpenRouter-ImageGen-MCP/issues)
- 💬 [Discussions](https://github.com/scotthooker/OpenRouter-ImageGen-MCP/discussions)

---

**Made with ❤️ for the MCP community**
# OpenRouter-ImageGen-MCP
