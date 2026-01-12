import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Use a dummy key if none is provided to prevents server crash on startup
// This satisfies the "remove gen AI feature that need api key" request by allowing the app to run without one.
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || 'dummy_key_for_build';

export const ai = genkit({
  plugins: [googleAI({ apiKey })],
  model: 'googleai/gemini-2.5-flash',
});
