# OpenRouter ImageGen MCP

A Model Context Protocol (MCP) server that enables Claude Code to generate images using multiple AI models via the OpenRouter API.

🌐 **[Visit our landing page at imageroutermcp.com](https://imageroutermcp.com)** for interactive documentation and examples!

> **Built for Claude Code** - The official CLI for Claude by Anthropic

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

### Quick Setup (Recommended)

1. **Clone and setup in one command**
   ```bash
   git clone https://github.com/scotthooker/OpenRouter-ImageGen-MCP.git
   cd OpenRouter-ImageGen-MCP
   npm run setup
   ```

2. **Copy the generated configuration**
   - The `npm run setup` command will display your custom configuration
   - Copy the JSON configuration shown in the output

3. **Add to Claude Code**
   - Open `~/.config/claude-code/mcp_settings.json` (macOS/Linux)
   - Or `%APPDATA%\Claude Code\mcp_settings.json` (Windows)
   - Paste the configuration (create the file if it doesn't exist)
   - Replace `your-openrouter-api-key-here` with your actual API key

4. **Restart Claude Code**

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/scotthooker/OpenRouter-ImageGen-MCP.git
   cd OpenRouter-ImageGen-MCP
   ```

2. **Install and build**
   ```bash
   npm install
   npm run build
   ```

3. **Generate configuration**
   ```bash
   npm run config
   ```
   This will show you the exact configuration for your setup.

4. **Get your OpenRouter API key**
   - Sign up at [OpenRouter](https://openrouter.ai/)
   - Generate an API key from your dashboard

## Configuration

### For Claude Code

The `npm run config` command generates the exact configuration you need based on where you cloned the repository.

**Configuration file locations:**
- **macOS/Linux**: `~/.config/claude-code/mcp_settings.json`
- **Windows**: `%APPDATA%\Claude Code\mcp_settings.json`

**Example configuration:**
```json
{
  "mcpServers": {
    "openrouter-imagegen": {
      "command": "node",
      "args": [
        "/your/path/to/OpenRouter-ImageGen-MCP/dist/index.js"
      ],
      "env": {
        "OPENROUTER_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

> 💡 **Tip**: Run `npm run config` anytime to see your current configuration

### For Other MCP Clients

Set the `OPENROUTER_API_KEY` environment variable:

```bash
export OPENROUTER_API_KEY="your-api-key-here"
npm start
```

## Usage

Once configured, Claude Code can generate images using natural language commands:

### Basic Examples

In your Claude Code terminal, simply ask:

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

### Usage with Claude Code

Claude Code automatically detects and uses the MCP server when you request image generation:

```bash
# Start Claude Code in your project directory
claude-code

# Then simply ask:
> "Generate a hero image for my landing page, modern gradient style"
> "Create an icon for my app, minimalist design, 512x512"
> "Generate a diagram showing microservices architecture"
```

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

### Available Commands

#### Setup & Configuration
```bash
npm run setup        # Complete setup: install, build, and show configuration
npm run config       # Generate MCP configuration for your installation path
npm install          # Install dependencies
npm run build        # Build the TypeScript project
```

#### Running
```bash
npm start            # Start the MCP server
npm run dev          # Build and start in development mode
```

#### Testing & Quality
```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # Lint TypeScript files
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run typecheck    # Run TypeScript type checking
```

#### Utilities
```bash
npm run clean        # Clean build artifacts and coverage
npm run website:serve    # Serve landing page locally
npm run website:validate # Validate website structure
```

> 📖 See [website/README.md](website/README.md) for website development and deployment details.

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
