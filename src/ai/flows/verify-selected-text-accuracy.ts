
'use server';
/**
 * @fileOverview A Genkit flow for verifying the factual accuracy of selected text from a webpage.
 *
 * - verifySelectedTextAccuracy - A function that handles the factual accuracy verification process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SourceSchema = z.object({
  title: z.string().describe('The name of the source or article.'),
  url: z.string().describe('The URL of the source.'),
  reliability: z.enum(['High', 'Medium', 'Mixed']).describe('The AI assessed reliability of the source.'),
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
  recommendedSearchQuery: z.string().describe('A specific search query the user can use to verify this claim further.'),
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
4. List 2-3 high-authority sources (e.g., Wikipedia, NASA, BBC, Britannica). 
5. For each source, assess its reliability: 'High' for primary/peer-reviewed, 'Medium' for mainstream news, 'Mixed' for opinion-heavy or user-generated content.
6. Provide a 'recommendedSearchQuery' that would help a user find more independent verification of this claim.

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
