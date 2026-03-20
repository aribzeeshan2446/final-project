
'use server';
/**
 * @fileOverview A Genkit flow for verifying the factual accuracy of selected text from a webpage.
 *
 * - verifySelectedTextAccuracy - A function that handles the factual accuracy verification process.
 * - VerifySelectedTextAccuracyInput - The input type for the verifySelectedTextAccuracy function.
 * - VerifySelectedTextAccuracyOutput - The return type for the verifySelectedTextAccuracy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SourceSchema = z.object({
  title: z.string().describe('The name of the source or article.'),
  url: z.string().describe('The URL of the source.'),
});

const VerifySelectedTextAccuracyInputSchema = z.object({
  selectedText: z.string().describe('The text selected by the user from a webpage to be fact-checked.'),
});
export type VerifySelectedTextAccuracyInput = z.infer<typeof VerifySelectedTextAccuracyInputSchema>;

const VerifySelectedTextAccuracyOutputSchema = z.object({
  verdict: z.enum(['Likely Accurate', 'Needs Verification', 'Potentially Misleading']).describe('The factual accuracy verdict for the selected text.'),
  suggestedCorrectionOrContext: z.string().nullable().describe('A brief suggested correction or additional context.'),
  reasoning: z.string().describe('Detailed explanation of why this verdict was reached.'),
  sources: z.array(SourceSchema).describe('Authoritative sources that back up this analysis.'),
});
export type VerifySelectedTextAccuracyOutput = z.infer<typeof VerifySelectedTextAccuracyOutputSchema>;

export async function verifySelectedTextAccuracy(input: VerifySelectedTextAccuracyInput): Promise<VerifySelectedTextAccuracyOutput> {
  return verifySelectedTextAccuracyFlow(input);
}

const verifySelectedTextAccuracyPrompt = ai.definePrompt({
  name: 'verifySelectedTextAccuracyPrompt',
  input: {schema: VerifySelectedTextAccuracyInputSchema},
  output: {schema: VerifySelectedTextAccuracyOutputSchema},
  prompt: `You are an expert fact-checker and researcher. Analyze the provided text for factual accuracy.

1. Determine the verdict: 'Likely Accurate', 'Needs Verification', or 'Potentially Misleading'.
2. Provide a brief correction if needed.
3. Provide a detailed reasoning (2-3 sentences) explaining the historical or scientific context.
4. List 2-3 high-authority sources (e.g., Wikipedia, NASA, BBC, Britannica, specialized scientific journals) that verify or debunk this claim. If the source URL is not known exactly, provide a highly probable search-based URL for that source.

Selected Text:
{{{selectedText}}}`,
});

const verifySelectedTextAccuracyFlow = ai.defineFlow(
  {
    name: 'verifySelectedTextAccuracyFlow',
    inputSchema: VerifySelectedTextAccuracyInputSchema,
    outputSchema: VerifySelectedTextAccuracyOutputSchema,
  },
  async input => {
    const {output} = await verifySelectedTextAccuracyPrompt(input);
    if (!output) {
      throw new Error('No output received from the fact-checking prompt.');
    }
    return output;
  }
);
