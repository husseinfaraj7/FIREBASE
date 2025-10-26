'use server';

/**
 * @fileOverview A car recommendation AI agent.
 *
 * - recommendCars - A function that recommends similar cars based on a given car's specifications.
 * - CarRecommendationInput - The input type for the recommendCars function.
 * - CarRecommendationOutput - The return type for the recommendCars function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CarRecommendationInputSchema = z.object({
  price: z.number().describe('The price of the car.'),
  mileage: z.number().describe('The mileage of the car.'),
  fuelType: z.string().describe('The fuel type of the car.'),
  transmission: z.string().describe('The transmission type of the car.'),
});
export type CarRecommendationInput = z.infer<typeof CarRecommendationInputSchema>;

const CarRecommendationOutputSchema = z.array(z.string()).describe('An array of similar car descriptions.');
export type CarRecommendationOutput = z.infer<typeof CarRecommendationOutputSchema>;

export async function recommendCars(input: CarRecommendationInput): Promise<CarRecommendationOutput> {
  return recommendCarsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCarsPrompt',
  input: {schema: CarRecommendationInputSchema},
  output: {schema: CarRecommendationOutputSchema},
  prompt: `You are an expert car recommendation agent. Given the following car specifications, recommend 3 similar cars, describing each car briefly:

Price: {{price}}
Mileage: {{mileage}}
Fuel Type: {{fuelType}}
Transmission: {{transmission}}`,
});

const recommendCarsFlow = ai.defineFlow(
  {
    name: 'recommendCarsFlow',
    inputSchema: CarRecommendationInputSchema,
    outputSchema: CarRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
