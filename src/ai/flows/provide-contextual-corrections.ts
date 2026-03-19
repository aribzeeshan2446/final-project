'use server';
/**
 * @fileOverview This file implements a Genkit flow for factual verification of selected text.
 * It analyzes the text and provides a verdict on its accuracy, along with optional corrections or additional context.
 *
 * - provideContextualCorrections - A function that initiates the factual verification process.
 * - ProvideContextualCorrectionsInput - The input type for the provideContextualCorrections function.
 * - ProvideContextualCorrectionsOutput - The return type for the provideContextualCorrections function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProvideContextualCorrectionsInputSchema = z.object({
  selectedText: z.string().describe('The text selected by the user for factual verification.'),
});
export type ProvideContextualCorrectionsInput = z.infer<typeof ProvideContextualCorrectionsInputSchema>;

const VerdictSchema = z
  .enum(['Likely Accurate', 'Needs Verification', 'Potentially Misleading'])
  .describe('The factual accuracy verdict for the selected text.');

const ProvideContextualCorrectionsOutputSchema = z.object({
  verdict: VerdictSchema,
  correctionOrContext: z.string().optional().describe('Brief suggested correction or additional context if inaccuracies are identified.'),
});
export type ProvideContextualCorrectionsOutput = z.infer<typeof ProvideContextualCorrectionsOutputSchema>;

export async function provideContextualCorrections(input: ProvideContextualCorrectionsInput): Promise<ProvideContextualCorrectionsOutput> {
  return provideContextualCorrectionsFlow(input);
}

const contextualCorrectionPrompt = ai.definePrompt({
  name: 'contextualCorrectionPrompt',
  input: { schema: ProvideContextualCorrectionsInputSchema },
  output: { schema: ProvideContextualCorrectionsOutputSchema },
  prompt: `You are an expert fact-checker. Your task is to analyze the provided text for factual accuracy.
Compare the text against commonly accepted facts and reliable general knowledge.
Based on your analysis, provide one of the following verdicts: 'Likely Accurate', 'Needs Verification', or 'Potentially Misleading'.

If the verdict is 'Needs Verification' or 'Potentially Misleading', you MUST provide a brief, concise suggestion for correction or additional context to clarify the information. This should be no more than 2-3 sentences.
If the verdict is 'Likely Accurate', leave the 'correctionOrContext' field empty.

Selected Text:
{{{selectedText}}}`,
});

const provideContextualCorrectionsFlow = ai.defineFlow(
  {
    name: 'provideContextualCorrectionsFlow',
    inputSchema: ProvideContextualCorrectionsInputSchema,
    outputSchema: ProvideContextualCorrectionsOutputSchema,
  },
  async (input) => {
    const { output } = await contextualCorrectionPrompt(input);
    return output!;
  }
);
