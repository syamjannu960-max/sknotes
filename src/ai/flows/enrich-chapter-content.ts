'use server';

/**
 * @fileOverview An AI agent that enriches chapter content with suggested topics.
 *
 * - enrichChapterContent - A function that handles the chapter content enrichment process.
 * - EnrichChapterContentInput - The input type for the enrichChapterContent function.
 * - EnrichChapterContentOutput - The return type for the enrichChapterContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnrichChapterContentInputSchema = z.object({
  chapterText: z
    .string()
    .describe('The existing text content of the chapter.'),
});
export type EnrichChapterContentInput = z.infer<
  typeof EnrichChapterContentInputSchema
>;

const EnrichChapterContentOutputSchema = z.object({
  suggestedTopics: z
    .string()
    .describe('Suggested topics to enrich the chapter content with.'),
});
export type EnrichChapterContentOutput = z.infer<
  typeof EnrichChapterContentOutputSchema
>;

export async function enrichChapterContent(
  input: EnrichChapterContentInput
): Promise<EnrichChapterContentOutput> {
  return enrichChapterContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enrichChapterContentPrompt',
  input: {schema: EnrichChapterContentInputSchema},
  output: {schema: EnrichChapterContentOutputSchema},
  prompt: `You are an AI assistant helping to enrich educational chapter content.

  Based on the existing chapter text, suggest additional topics that could be added to improve the material.

  Existing Chapter Text: {{{chapterText}}}

  Suggested Topics:`,
});

const enrichChapterContentFlow = ai.defineFlow(
  {
    name: 'enrichChapterContentFlow',
    inputSchema: EnrichChapterContentInputSchema,
    outputSchema: EnrichChapterContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
