#!/usr/bin/env node

import fs from 'fs/promises';
import fetch from 'node-fetch';

async function testConciseOutput() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENROUTER_API_KEY not set');
    return;
  }
  
  console.log('🔑 API Key loaded:', apiKey.substring(0, 10) + '...');
  
  // Test 1: Default (concise) response
  console.log('\n📝 Test 1: Default concise response (show_full_response: false or undefined)');
  await testWithOption(apiKey, false);
  
  // Test 2: Full response
  console.log('\n📝 Test 2: Full response (show_full_response: true)');
  await testWithOption(apiKey, true);
}

async function testWithOption(apiKey, showFullResponse) {
  const requestBody = {
    model: 'google/gemini-2.5-flash-image-preview:free',
    messages: [
      {
        role: 'user',
        content: 'Generate a simple test image: A red circle on white background'
      }
    ],
    temperature: 0.7,
    max_tokens: 4096
  };
  
  console.log('  → Model:', requestBody.model);
  console.log('  → Show full response:', showFullResponse);
  
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('  ❌ Error Response:', errorText);
      return;
    }
    
    const data = await response.json();
    
    // Simulate MCP server processing
    const responseData = {
      success: true,
      model: requestBody.model,
      prompt: requestBody.messages[0].content,
      message: 'Image generated successfully'
    };
    
    // Check for images in the response
    const message = data.choices[0].message;
    if (message.images && message.images.length > 0) {
      const firstImage = message.images[0];
      if (firstImage.image_url && firstImage.image_url.url) {
        const imageUrl = firstImage.image_url.url;
        
        if (imageUrl.startsWith('data:image')) {
          if (showFullResponse) {
            responseData.image = {
              type: 'base64',
              data: imageUrl, // Include full data
              size: `${Math.round(imageUrl.length / 1024)}KB`,
              format: imageUrl.substring(11, imageUrl.indexOf(';')) || 'unknown'
            };
          } else {
            responseData.image = {
              type: 'base64',
              size: `${Math.round(imageUrl.length / 1024)}KB`, // Only size info
              format: imageUrl.substring(11, imageUrl.indexOf(';')) || 'unknown'
            };
          }
        } else {
          responseData.image = {
            type: 'url',
            url: imageUrl
          };
        }
      }
    }
    
    responseData.usage = {
      tokens: data.usage?.total_tokens || 0,
      model: data.model
    };
    
    // Display the response
    console.log('\n  📊 Response (as it would appear in MCP):');
    const responseStr = JSON.stringify(responseData, null, 2);
    
    if (showFullResponse && responseStr.length > 1000) {
      console.log('  [First 500 chars of response]');
      console.log(responseStr.substring(0, 500) + '...');
      console.log(`  [Total response size: ${Math.round(responseStr.length / 1024)}KB]`);
    } else {
      console.log(responseStr);
    }
    
  } catch (error) {
    console.error('  ❌ Error:', error.message);
  }
}

// Run the tests
testConciseOutput();