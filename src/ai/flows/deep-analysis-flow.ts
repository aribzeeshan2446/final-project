'use server';
/**
 * @fileOverview A Genkit flow for 2nd Tier Deep Verification.
 * This flow performs a more exhaustive check, looking for semantic nuances,
 * potential biases, and additional authoritative cross-references.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CrossReferenceSchema = z.object({
  title: z.string(),
  url: z.string().url().describe('A valid URL to an authoritative source.'),
  context: z.string().describe('How this source specifically clarifies the nuance of the claim.'),
});

const DeepAnalysisInputSchema = z.object({
  originalText: z.string().describe('The claim being deep-analyzed.'),
  initialVerdict: z.string().describe('The verdict from the first tier verification.'),
});
export type DeepAnalysisInput = z.infer<typeof DeepAnalysisInputSchema>;

const DeepAnalysisOutputSchema = z.object({
  nuanceAnalysis: z.string().describe('A deeper dive into the semantic nuances or common misconceptions related to the claim.'),
  crossReferences: z.array(CrossReferenceSchema).describe('Additional specific sources for deeper study.'),
  confidenceScore: z.number().min(0).max(100).describe('The confidence level of the AI in this deep analysis.'),
});
export type DeepAnalysisOutput = z.infer<typeof DeepAnalysisOutputSchema>;

export async function initiateDeepAnalysis(input: DeepAnalysisInput): Promise<DeepAnalysisOutput> {
  return deepAnalysisFlow(input);
}

const deepAnalysisPrompt = ai.definePrompt({
  name: 'deepAnalysisPrompt',
  input: { schema: DeepAnalysisInputSchema },
  output: { schema: DeepAnalysisOutputSchema },
  prompt: `You are an elite investigative researcher performing a "2nd Tier Deep Scan" on a claim.

The initial verification resulted in: "{{initialVerdict}}".

Your task is to:
1. Identify any "Gray Areas" or subtle semantic nuances that a standard fact-check might miss.
2. Look for common cultural or scientific misconceptions often bundled with this claim.
3. Provide 2-3 additional high-authority cross-references that offer deeper context.
4. Assign a final "Confidence Score" for the entire verification chain.

Claim:
{{{originalText}}}`,
});

const deepAnalysisFlow = ai.defineFlow(
  {
    name: 'deepAnalysisFlow',
    inputSchema: DeepAnalysisInputSchema,
    outputSchema: DeepAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await deepAnalysisPrompt(input);
    if (!output) {
      throw new Error('Deep analysis failed.');
    }
    return output;
  }
);
