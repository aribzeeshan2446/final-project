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

const VerifySelectedTextAccuracyInputSchema = z.object({
  selectedText: z.string().describe('The text selected by the user from a webpage to be fact-checked.'),
});
export type VerifySelectedTextAccuracyInput = z.infer<typeof VerifySelectedTextAccuracyInputSchema>;

const VerifySelectedTextAccuracyOutputSchema = z.object({
  verdict: z.enum(['Likely Accurate', 'Needs Verification', 'Potentially Misleading']).describe('The factual accuracy verdict for the selected text. Can be "Likely Accurate", "Needs Verification", or "Potentially Misleading".'),
  suggestedCorrectionOrContext: z.string().nullable().describe('A brief suggested correction or additional context if the verdict is not "Likely Accurate". Null if the text is deemed "Likely Accurate".'),
});
export type VerifySelectedTextAccuracyOutput = z.infer<typeof VerifySelectedTextAccuracyOutputSchema>;

export async function verifySelectedTextAccuracy(input: VerifySelectedTextAccuracyInput): Promise<VerifySelectedTextAccuracyOutput> {
  return verifySelectedTextAccuracyFlow(input);
}

const verifySelectedTextAccuracyPrompt = ai.definePrompt({
  name: 'verifySelectedTextAccuracyPrompt',
  input: {schema: VerifySelectedTextAccuracyInputSchema},
  output: {schema: VerifySelectedTextAccuracyOutputSchema},
  prompt: `You are an expert fact-checker. Your task is to analyze the provided text for factual accuracy. Based on your knowledge and comparison against reliable sources, determine if the text is 'Likely Accurate', 'Needs Verification', or 'Potentially Misleading'.

If the text is not 'Likely Accurate', provide a brief suggested correction or additional context to clarify or correct the information. If the text is 'Likely Accurate', set 'suggestedCorrectionOrContext' to null.

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
