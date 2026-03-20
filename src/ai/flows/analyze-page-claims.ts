'use server';
/**
 * @fileOverview A Genkit flow for analyzing an entire webpage's content for factual claims.
 *
 * - analyzePageClaims - Identifies and verifies multiple claims within a larger text block.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClaimAnalysisSchema = z.object({
  claimText: z.string().describe('The exact snippet of text identified as a factual claim.'),
  verdict: z.enum(['Accurate', 'Misleading', 'Needs Proof']).describe('The factual status of this specific claim.'),
  context: z.string().describe('A brief (1 sentence) explanation for the verdict.'),
});

const AnalyzePageClaimsInputSchema = z.object({
  pageText: z.string().describe('The full text content of the webpage to be analyzed.'),
});
export type AnalyzePageClaimsInput = z.infer<typeof AnalyzePageClaimsInputSchema>;

const AnalyzePageClaimsOutputSchema = z.object({
  claims: z.array(ClaimAnalysisSchema).describe('A list of factual claims found in the text with their verdicts.'),
  overallHealth: z.number().min(0).max(100).describe('An aggregate truth score for the entire page (0-100).'),
});
export type AnalyzePageClaimsOutput = z.infer<typeof AnalyzePageClaimsOutputSchema>;

export async function analyzePageClaims(input: AnalyzePageClaimsInput): Promise<AnalyzePageClaimsOutput> {
  return analyzePageClaimsFlow(input);
}

const analyzePageClaimsPrompt = ai.definePrompt({
  name: 'analyzePageClaimsPrompt',
  input: { schema: AnalyzePageClaimsInputSchema },
  output: { schema: AnalyzePageClaimsOutputSchema },
  prompt: `You are an elite automated fact-checker. 

Analyze the following text from a webpage. 
1. Identify 3-5 of the most significant factual claims (names, dates, statistics, scientific facts).
2. For each claim, provide the EXACT text snippet found in the document.
3. Determine if the claim is 'Accurate', 'Misleading', or 'Needs Proof' based on authoritative data.
4. Calculate an 'overallHealth' score from 0 to 100 based on the density of accurate vs misleading information.

Page Text:
{{{pageText}}}`,
});

const analyzePageClaimsFlow = ai.defineFlow(
  {
    name: 'analyzePageClaimsFlow',
    inputSchema: AnalyzePageClaimsInputSchema,
    outputSchema: AnalyzePageClaimsOutputSchema,
  },
  async (input) => {
    const { output } = await analyzePageClaimsPrompt(input);
    if (!output) {
      throw new Error('Failed to analyze page claims.');
    }
    return output;
  }
);
