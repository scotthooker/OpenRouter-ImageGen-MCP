#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

async function testImageGeneration() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENROUTER_API_KEY not set');
    return;
  }
  
  console.log('🔑 API Key loaded:', apiKey.substring(0, 10) + '...');
  
  // Test with Gemini image generation - correct model
  const requestBody = {
    model: 'google/gemini-2.5-flash-image-preview:free',
    messages: [
      {
        role: 'user',
        content: 'Generate an ultra-realistic 4K photo: A peaceful mountain landscape with a clear blue sky and some clouds'
      }
    ],
    temperature: 0.7,
    max_tokens: 4096
  };
  
  console.log('\n📤 Sending request to OpenRouter...');
  console.log('Model:', requestBody.model);
  console.log('Prompt:', requestBody.messages[0].content);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/openrouter-image-gen-mcp',
        'X-Title': 'OpenRouter Image Test'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('\n📥 Response Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('\n✅ Response received!');
    
    // Log the full response structure
    console.log('\n📊 Response structure:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0]) {
      const content = data.choices[0].message.content;
      console.log('\n📝 Content type:', typeof content);
      console.log('Content length:', content.length);
      
      // Check if it's a URL
      if (content.startsWith('http')) {
        console.log('\n🔗 Got URL:', content);
        await saveImageFromUrl(content);
      }
      // Check if it's a data URL
      else if (content.startsWith('data:image')) {
        console.log('\n🖼️ Got data URL');
        await saveImageFromDataUrl(content);
      }
      // Check if it contains a URL in the text or a markdown image
      else if (content.includes('http') || content.includes('![')) {
        // First try to find markdown image syntax
        const markdownMatch = content.match(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/);
        if (markdownMatch) {
          console.log('\n🔗 Found image URL in markdown:', markdownMatch[1]);
          await saveImageFromUrl(markdownMatch[1]);
        } else {
          // Fall back to plain URL matching
          const urlMatch = content.match(/https?:\/\/[^\s\]]+/);
          if (urlMatch) {
            console.log('\n🔗 Found URL in content:', urlMatch[0]);
            await saveImageFromUrl(urlMatch[0]);
          }
        }
      }
      // Otherwise it might be base64 or text
      else {
        console.log('\n📄 Content preview (first 200 chars):');
        console.log(content.substring(0, 200));
        
        // Try to decode as base64
        if (content.length > 1000 && !content.includes(' ')) {
          console.log('\n🔍 Attempting to decode as base64...');
          await saveImageFromBase64(content);
        } else {
          console.log('\n⚠️ Content appears to be text, not an image');
        }
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

async function saveImageFromUrl(url) {
  console.log('\n💾 Downloading image from URL...');
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const filename = `test_image_${Date.now()}.png`;
    await fs.writeFile(filename, Buffer.from(buffer));
    console.log('✅ Image saved as:', filename);
  } catch (error) {
    console.error('❌ Failed to save image from URL:', error.message);
  }
}

async function saveImageFromDataUrl(dataUrl) {
  console.log('\n💾 Saving image from data URL...');
  try {
    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid data URL format');
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];
    const ext = mimeType.split('/')[1] || 'png';
    
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `test_image_${Date.now()}.${ext}`;
    await fs.writeFile(filename, buffer);
    console.log('✅ Image saved as:', filename);
  } catch (error) {
    console.error('❌ Failed to save image from data URL:', error.message);
  }
}

async function saveImageFromBase64(base64) {
  console.log('\n💾 Saving image from base64...');
  try {
    const buffer = Buffer.from(base64, 'base64');
    const filename = `test_image_${Date.now()}.png`;
    await fs.writeFile(filename, buffer);
    console.log('✅ Image saved as:', filename);
  } catch (error) {
    console.error('❌ Failed to save image from base64:', error.message);
  }
}

// Run the test
testImageGeneration();