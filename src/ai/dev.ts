import { config } from 'dotenv';
config();

import '@/ai/flows/provide-contextual-corrections.ts';
import '@/ai/flows/verify-selected-text-accuracy.ts';
import '@/ai/flows/verify-image-accuracy.ts';
import '@/ai/flows/text-to-speech-flow.ts';
import '@/ai/flows/analyze-page-claims.ts';
