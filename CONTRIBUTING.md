# Contributing to OpenRouter ImageGen MCP

Thank you for your interest in contributing to OpenRouter ImageGen MCP! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title**: Describe the issue concisely
2. **Description**: Detailed explanation of the problem
3. **Steps to reproduce**: List the exact steps to reproduce the issue
4. **Expected behavior**: What you expected to happen
5. **Actual behavior**: What actually happened
6. **Environment**:
   - OS (macOS, Linux, Windows)
   - Node.js version
   - Claude Code version
   - OpenRouter ImageGen MCP version

**Example:**
```markdown
**Bug**: Image generation fails with timeout error

**Steps to reproduce:**
1. Configure MCP server in Claude Code
2. Request: "Generate a sunset image"
3. Wait for response

**Expected:** Image generates successfully
**Actual:** Timeout error after 30 seconds

**Environment:**
- macOS 14.0
- Node.js 20.10.0
- Claude Code 1.0.0
- OpenRouter ImageGen MCP 1.0.0
```

### Suggesting Features

We welcome feature suggestions! Please create an issue with:

1. **Clear title**: Describe the feature concisely
2. **Problem statement**: What problem does this solve?
3. **Proposed solution**: How should it work?
4. **Alternatives**: Other approaches you considered
5. **Additional context**: Screenshots, examples, etc.

### Pull Requests

We love pull requests! Here's how to submit one:

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/OpenRouter-ImageGen-MCP.git
cd OpenRouter-ImageGen-MCP
```

#### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming conventions:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

#### 3. Set Up Development Environment

```bash
# Install dependencies
npm install

# Run tests to verify everything works
npm test

# Build the project
npm run build
```

#### 4. Make Your Changes

Follow these guidelines:

**Code Style:**
- Use TypeScript for all new code
- Follow the existing code style
- Run `npm run lint` to check for issues
- Run `npm run format` to auto-format code

**Testing:**
- Write tests for new features
- Ensure all tests pass: `npm test`
- Maintain or improve code coverage: `npm run test:coverage`
- Tests should be in `src/__tests__/` directory
- Follow the existing test patterns

**Commits:**
- Write clear, concise commit messages
- Use present tense ("Add feature" not "Added feature")
- Reference issues when applicable (#123)

**Examples:**
```bash
git commit -m "Add support for custom image sizes"
git commit -m "Fix timeout error in API client"
git commit -m "Update documentation for new model"
git commit -m "Refactor image processor for better error handling"
```

#### 5. Test Your Changes

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Type check
npm run typecheck

# Test the built package
npm run build
npm start
```

**Manual Testing:**
1. Configure the MCP server in Claude Code
2. Test your changes with real API calls
3. Verify error handling works correctly
4. Test edge cases

#### 6. Update Documentation

If your changes affect usage:
- Update README.md
- Update relevant documentation
- Add examples if applicable
- Update CHANGELOG.md

#### 7. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:

**Title:** Clear, concise description of changes

**Description:**
- What changes were made
- Why these changes were needed
- How to test the changes
- Related issues (#123)
- Screenshots (if UI changes)

**Example PR description:**
```markdown
## Description
Adds support for custom image dimensions in the generate_image tool.

## Changes
- Added `width` and `height` parameters to generate_image tool
- Updated OpenRouter API client to send dimension parameters
- Added validation for dimension values (min 256, max 2048)
- Added tests for dimension validation
- Updated documentation

## Testing
1. Configure MCP server
2. Request: "Generate a 512x512 image of a cat"
3. Verify image is generated with correct dimensions

Closes #45
```

## Development Guidelines

### Architecture

This project follows clean architecture principles:

```
src/
├── config/           # Configuration constants
├── domain/           # Domain models and errors
├── services/         # Business logic
├── validators/       # Input validation
├── formatters/       # Response formatting
├── utils/            # Utility functions
└── __tests__/        # Test suites
```

**Guidelines:**
- Keep services focused on single responsibilities
- Use dependency injection
- Avoid circular dependencies
- Keep domain models pure (no business logic)

### Code Quality Standards

**TypeScript:**
- Enable strict mode
- Use explicit types (avoid `any`)
- Use interfaces for contracts
- Use type aliases for complex types

**Error Handling:**
- Use custom error classes from `domain/errors.js`
- Provide helpful error messages
- Include context in errors
- Log errors appropriately

**Testing:**
- Write unit tests for business logic
- Mock external dependencies
- Test error cases
- Aim for >70% coverage

**Performance:**
- Avoid unnecessary async/await
- Cache when appropriate
- Handle large files efficiently
- Consider memory usage

### What We Look For

✅ **Good PRs:**
- Focused on a single change
- Include tests
- Follow code style
- Update documentation
- Have clear commit messages

❌ **Avoid:**
- Mixing multiple unrelated changes
- Breaking existing functionality
- Skipping tests
- Ignoring linter errors
- Large, unexplained changes

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/scotthooker/OpenRouter-ImageGen-MCP/discussions)
- **Bugs**: Open an [Issue](https://github.com/scotthooker/OpenRouter-ImageGen-MCP/issues)
- **Security**: Email security concerns privately (see SECURITY.md)

## Release Process

Maintainers handle releases:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release
6. (Optional) Publish to npm

## Recognition

Contributors will be:
- Listed in GitHub contributors
- Mentioned in release notes (for significant contributions)
- Credited in documentation (for major features)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to OpenRouter ImageGen MCP!** 🎨
