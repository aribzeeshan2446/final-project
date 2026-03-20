'use server';
/**
 * @fileOverview A Genkit flow for verifying the factual accuracy of claims found within an image (e.g., screenshots of news or social media).
 *
 * - verifyImageAccuracy - A function that extracts text from an image and verifies its accuracy.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SourceSchema = z.object({
  title: z.string().describe('The name of the source or article.'),
  url: z.string().describe('The URL of the source.'),
});

const VerifyImageAccuracyInputSchema = z.object({
  imageDataUri: z.string().describe("A photo of a text snippet, tweet, or headline as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type VerifyImageAccuracyInput = z.infer<typeof VerifyImageAccuracyInputSchema>;

const VerifyImageAccuracyOutputSchema = z.object({
  extractedText: z.string().describe('The primary factual claim or text extracted from the image.'),
  verdict: z.enum(['Likely Accurate', 'Needs Verification', 'Potentially Misleading']).describe('The factual accuracy verdict for the extracted text.'),
  suggestedCorrectionOrContext: z.string().nullable().describe('A brief suggested correction or additional context.'),
  reasoning: z.string().describe('Detailed explanation of why this verdict was reached.'),
  sources: z.array(SourceSchema).describe('Authoritative sources that back up this analysis.'),
});
export type VerifyImageAccuracyOutput = z.infer<typeof VerifyImageAccuracyOutputSchema>;

export async function verifyImageAccuracy(input: VerifyImageAccuracyInput): Promise<VerifyImageAccuracyOutput> {
  return verifyImageAccuracyFlow(input);
}

const verifyImageAccuracyPrompt = ai.definePrompt({
  name: 'verifyImageAccuracyPrompt',
  input: { schema: VerifyImageAccuracyInputSchema },
  output: { schema: VerifyImageAccuracyOutputSchema },
  prompt: `You are an expert fact-checker and researcher. 

Analyze the provided image.
1. Extract the core factual claim or text found in the image.
2. Determine the factual accuracy verdict: 'Likely Accurate', 'Needs Verification', or 'Potentially Misleading'.
3. Provide a brief correction or context if needed.
4. Provide a detailed reasoning (2-3 sentences) explaining the historical, scientific, or current events context.
5. List 2-3 high-authority sources (e.g., Wikipedia, NASA, BBC, Reuters) that verify or debunk this claim.

Image: {{media url=imageDataUri}}`,
});

const verifyImageAccuracyFlow = ai.defineFlow(
  {
    name: 'verifyImageAccuracyFlow',
    inputSchema: VerifyImageAccuracyInputSchema,
    outputSchema: VerifyImageAccuracyOutputSchema,
  },
  async (input) => {
    const { output } = await verifyImageAccuracyPrompt(input);
    if (!output) {
      throw new Error('No output received from the image fact-checking prompt.');
    }
    return output;
  }
);
