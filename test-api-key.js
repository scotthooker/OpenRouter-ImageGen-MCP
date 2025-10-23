#!/usr/bin/env node

// Test script to verify API key loading
console.log('Testing OpenRouter API Key loading...\n');

// Check environment variable
const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('❌ OPENROUTER_API_KEY is NOT set in environment');
  console.log('\nTo set it, run:');
  console.log('export OPENROUTER_API_KEY="your-api-key-here"');
  console.log('\nOr add it to your Claude Desktop config file.');
  process.exit(1);
} else {
  console.log('✅ OPENROUTER_API_KEY is set');
  console.log(`   Length: ${apiKey.length} characters`);
  console.log(`   Preview: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  
  if (apiKey.startsWith('sk-or-')) {
    console.log('✅ API key format looks correct (starts with "sk-or-")');
  } else {
    console.log('⚠️  Warning: OpenRouter API keys typically start with "sk-or-"');
    console.log('   Your key starts with: ' + apiKey.substring(0, 6));
  }
  
  if (apiKey.length < 20) {
    console.log('❌ API key seems too short (less than 20 characters)');
  } else {
    console.log('✅ API key length seems reasonable');
  }
}

console.log('\nNote: This script only checks if the key is loaded, not if it\'s valid.');
console.log('To test validity, try using the MCP server to generate an image.');