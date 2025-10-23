# OpenRouter ImageGen MCP Landing Page

This is the landing page for the OpenRouter ImageGen MCP server, designed to be hosted at [imageroutermcp.com](https://imageroutermcp.com).

## Overview

A modern, responsive landing page showcasing the features, installation instructions, and usage examples for the OpenRouter ImageGen MCP server.

## Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with gradient accents
- **Interactive Elements**: Copy-to-clipboard functionality for code blocks
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Fast Loading**: Minimal dependencies, optimized for performance

## Structure

```
website/
├── index.html      # Main landing page
├── styles.css      # Styling and responsive design
├── script.js       # Interactive functionality
├── assets/         # Images and other assets
└── README.md       # This file
```

## Local Development

To view the landing page locally:

1. **Option 1: Simple HTTP Server (Python)**
   ```bash
   cd website
   python3 -m http.server 8000
   ```
   Then open http://localhost:8000 in your browser

2. **Option 2: Node.js HTTP Server**
   ```bash
   npx http-server website -p 8000
   ```
   Then open http://localhost:8000 in your browser

3. **Option 3: VS Code Live Server**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

## Deployment

### Static Hosting Options

The website is a static site and can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `website` folder or connect to GitHub
- **Vercel**: Import the GitHub repository and set `website` as the output directory
- **GitHub Pages**: Push to a `gh-pages` branch
- **AWS S3**: Upload files to an S3 bucket with static hosting enabled
- **Cloudflare Pages**: Connect to the GitHub repository

### Example: Netlify Deployment

1. Create a `netlify.toml` in the project root:
   ```toml
   [build]
     publish = "website"
   ```

2. Deploy via Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=website
   ```

### Example: Custom Domain Setup

To host at `imageroutermcp.com`:

1. Deploy to your chosen hosting platform
2. Configure DNS records:
   - Add an A record or CNAME pointing to your hosting provider
   - Follow your hosting provider's custom domain setup guide

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #ec4899;
    /* ... */
}
```

### Content

Update content directly in `index.html`. Main sections include:
- Hero section
- Features
- Supported Models
- Installation
- Usage Examples
- Architecture

### Analytics

To add analytics tracking:

1. Uncomment and configure the analytics code in `script.js`
2. Add your analytics tracking code to `index.html` (e.g., Google Analytics, Plausible)

## Performance

The landing page is optimized for performance:

- Minimal external dependencies
- Font loading optimization with `preconnect`
- CSS variables for efficient styling
- Optimized images (when added)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Same as the main project
