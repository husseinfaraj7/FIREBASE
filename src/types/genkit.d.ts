declare module 'genkit' {
  import type { ZodTypeAny, infer as ZodInfer } from 'zod';
  export { z } from 'zod';

  interface PromptOptions<I extends ZodTypeAny, O extends ZodTypeAny> {
    name: string;
    input: { schema: I };
    output: { schema: O };
    prompt: string;
  }

  type PromptHandler<I extends ZodTypeAny, O extends ZodTypeAny> = (
    input: ZodInfer<I>
  ) => Promise<{ output?: ZodInfer<O> } | undefined>;

  interface FlowOptions<I extends ZodTypeAny, O extends ZodTypeAny> {
    name: string;
    inputSchema: I;
    outputSchema: O;
  }

  export interface GenkitInstance {
    definePrompt<I extends ZodTypeAny, O extends ZodTypeAny>(
      options: PromptOptions<I, O>
    ): (input: ZodInfer<I>) => Promise<{ output?: ZodInfer<O> } | undefined>;

    defineFlow<I extends ZodTypeAny, O extends ZodTypeAny>(
      options: FlowOptions<I, O>,
      handler: (input: ZodInfer<I>) => Promise<ZodInfer<O>>
    ): (input: ZodInfer<I>) => Promise<ZodInfer<O>>;
  }

  export interface GenkitConfig {
    plugins?: unknown[];
    model?: string;
  }

  export function genkit(config: GenkitConfig): GenkitInstance;
}

declare module '@genkit-ai/google-genai' {
  export interface GoogleAIOptions {
    [key: string]: unknown;
  }

  export function googleAI(options?: GoogleAIOptions): unknown;
}
