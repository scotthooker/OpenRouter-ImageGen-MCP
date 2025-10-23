#!/usr/bin/env node
/**
 * Generate MCP Configuration Script
 * Generates the correct Claude Code MCP configuration based on the current repository location
 */

import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { platform } from 'os';
import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the repository root (one level up from scripts/)
const repoRoot = resolve(__dirname, '..');
const distPath = join(repoRoot, 'dist', 'index.js');

/**
 * Find a suitable Node.js binary (version 18+)
 * Prefers the currently active nvm version if it meets requirements
 */
function findNodeBinary() {
  try {
    // First, check current active node version (what's running this script)
    const currentVersion = process.version;
    const majorVersion = parseInt(currentVersion.slice(1).split('.')[0]);

    if (majorVersion >= 18) {
      // Use the current Node.js if it's >= 18
      // This will be the active nvm version or system node
      return process.execPath;
    }

    // Try to find Node 18+ via nvm
    const homedir = process.env.HOME || process.env.USERPROFILE;
    const nvmDir = process.env.NVM_DIR || join(homedir, '.nvm');
    const versionsDir = join(nvmDir, 'versions', 'node');

    if (existsSync(versionsDir)) {
      try {
        // Get all installed Node versions
        const installedVersions = readdirSync(versionsDir)
          .filter(dir => dir.startsWith('v'))
          .map(dir => {
            const version = dir.slice(1); // Remove 'v' prefix
            const [major] = version.split('.');
            return { dir, major: parseInt(major), version };
          })
          .filter(v => v.major >= 18)
          .sort((a, b) => b.major - a.major); // Sort by major version descending

        if (installedVersions.length > 0) {
          const latest = installedVersions[0];
          const nodePath = platform() === 'win32'
            ? join(versionsDir, latest.dir, 'node.exe')
            : join(versionsDir, latest.dir, 'bin', 'node');

          if (existsSync(nodePath)) {
            return nodePath;
          }
        }
      } catch (e) {
        // Continue to fallback
      }
    }

    // Fall back to system node (but warn user)
    console.warn('\n⚠️  Warning: Could not find Node.js 18+. Using system node binary.');
    console.warn('   This may cause issues if your system Node.js is < v18.\n');
    return 'node';
  } catch (error) {
    return 'node'; // Fall back to system node
  }
}

// Determine the config file location based on platform
function getConfigPath() {
  const homedir = process.env.HOME || process.env.USERPROFILE || '~';

  if (platform() === 'win32') {
    const appData = process.env.APPDATA || join(homedir, 'AppData', 'Roaming');
    return join(appData, 'Claude Code', 'mcp_settings.json');
  } else {
    // macOS and Linux
    return join(homedir, '.config', 'claude-code', 'mcp_settings.json');
  }
}

// Find the best Node.js binary to use
const nodeBinary = findNodeBinary();

// Get Node version for display
let nodeVersionInfo = '';
try {
  const versionOutput = execSync(`"${nodeBinary}" --version`, { encoding: 'utf8' }).trim();
  nodeVersionInfo = versionOutput;
} catch (e) {
  nodeVersionInfo = 'unknown';
}

// Generate the MCP configuration
const mcpConfig = {
  mcpServers: {
    'openrouter-imagegen': {
      command: nodeBinary,
      args: [distPath],
      env: {
        OPENROUTER_API_KEY: 'your-openrouter-api-key-here'
      }
    }
  }
};

// Output the configuration
console.log('\n' + '='.repeat(70));
console.log('🎨 OpenRouter Image Generation MCP Server Configuration');
console.log('='.repeat(70) + '\n');

console.log('📍 Repository Location:');
console.log(`   ${repoRoot}\n`);

console.log('🔧 Node.js Binary:');
console.log(`   ${nodeBinary}`);
console.log(`   Version: ${nodeVersionInfo}\n`);

console.log('📝 Configuration File Location:');
console.log(`   ${getConfigPath()}\n`);

console.log('⚙️  Configuration to add to your mcp_settings.json:');
console.log('─'.repeat(70));
console.log(JSON.stringify(mcpConfig, null, 2));
console.log('─'.repeat(70) + '\n');

console.log('📋 Instructions:');
console.log('   1. Build the project first: npm run build');
console.log('   2. Get your OpenRouter API key from: https://openrouter.ai/keys');
console.log('   3. Copy the configuration above');
console.log(`   4. Add it to: ${getConfigPath()}`);
console.log('   5. Replace "your-openrouter-api-key-here" with your actual API key');
console.log('   6. Restart Claude Code\n');

console.log('💡 Quick Setup:');
console.log('   If the file doesn\'t exist, create it with the configuration above.');
console.log('   If it exists, add the "openrouter-imagegen" entry to the "mcpServers" object.\n');

console.log('🔒 Security Note:');
console.log('   Never commit your API key to version control!');
console.log('   Keep your mcp_settings.json file secure.\n');

console.log('✨ Testing:');
console.log('   After setup, try: "Generate an image of a sunset over mountains"\n');
