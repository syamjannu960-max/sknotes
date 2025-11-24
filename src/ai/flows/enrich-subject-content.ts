'use server';

/**
 * @fileOverview An AI agent that enriches subject content with suggested topics.
 *
 * - enrichSubjectContent - A function that handles the subject content enrichment process.
 * - EnrichSubjectContentInput - The input type for the enrichSubjectContent function.
 * - EnrichSubjectContentOutput - The return type for the enrichSubjectContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnrichSubjectContentInputSchema = z.object({
  subjectText: z
    .string()
    .describe('The existing text content of the subject.'),
});
export type EnrichSubjectContentInput = z.infer<
  typeof EnrichSubjectContentInputSchema
>;

const EnrichSubjectContentOutputSchema = z.object({
  suggestedTopics: z
    .string()
    .describe('Suggested topics to enrich the subject content with.'),
});
export type EnrichSubjectContentOutput = z.infer<
  typeof EnrichSubjectContentOutputSchema
>;

export async function enrichSubjectContent(
  input: EnrichSubjectContentInput
): Promise<EnrichSubjectContentOutput> {
  return enrichSubjectContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enrichSubjectContentPrompt',
  input: {schema: EnrichSubjectContentInputSchema},
  output: {schema: EnrichSubjectContentOutputSchema},
  prompt: `You are an AI assistant helping to enrich educational subject content.

  Based on the existing subject text, suggest additional topics that could be added to improve the material.

  Existing Subject Text: {{{subjectText}}}

  Suggested Topics:`,
});

const enrichSubjectContentFlow = ai.defineFlow(
  {
    name: 'enrichSubjectContentFlow',
    inputSchema: EnrichSubjectContentInputSchema,
    outputSchema: EnrichSubjectContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
