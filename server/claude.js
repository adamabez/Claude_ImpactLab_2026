const Anthropic = require('@anthropic-ai/sdk');

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Single swap point: once ANTHROPIC_API_KEY is set in server/.env, every
// route automatically starts calling the real Claude API instead of using
// its mock fallback.
async function callClaude(prompt, mockResponse) {
  if (!client) {
    await new Promise((resolve) => setTimeout(resolve, 400)); // simulate latency
    return mockResponse;
  }

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : '';
}

module.exports = { callClaude };
