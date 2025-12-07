/**
 * LLM Configuration Module
 * Centralized configuration for all LLM providers
 * Currently supports: Ollama (default for local dev)
 */

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'ollama';

/**
 * Validate that all required env vars are set for the chosen provider
 */
function validateConfig() {
  if (LLM_PROVIDER === 'ollama') {
    const baseUrl = process.env.OLLAMA_BASE_URL;
    const model = process.env.OLLAMA_MODEL;

    if (!baseUrl) {
      throw new Error('OLLAMA_BASE_URL is required when LLM_PROVIDER=ollama');
    }
    if (!model) {
      throw new Error('OLLAMA_MODEL is required when LLM_PROVIDER=ollama');
    }

    return {
      provider: 'ollama',
      baseUrl,
      model,
      endpoint: `${baseUrl}/chat/completions`,
    };
  }

  if (LLM_PROVIDER === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required when LLM_PROVIDER=openai');
    }
    if (!model) {
      throw new Error('OPENAI_MODEL is required when LLM_PROVIDER=openai');
    }

    return {
      provider: 'openai',
      apiKey,
      model,
      endpoint: 'https://api.openai.com/v1/chat/completions',
    };
  }

  if (LLM_PROVIDER === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required when LLM_PROVIDER=anthropic');
    }
    if (!model) {
      throw new Error('ANTHROPIC_MODEL is required when LLM_PROVIDER=anthropic');
    }

    return {
      provider: 'anthropic',
      apiKey,
      model,
      endpoint: 'https://api.anthropic.com/v1/messages',
    };
  }

  throw new Error(`Unknown LLM_PROVIDER: ${LLM_PROVIDER}. Supported: ollama, openai, anthropic`);
}

let config;

try {
  config = validateConfig();
} catch (error) {
  console.error('❌ LLM Configuration Error:', error.message);
  console.error('   Please check your .env file and ensure required variables are set.');
  console.error('   Supported providers: ollama (default), openai, anthropic');
  process.exit(1);
}

module.exports = config;
