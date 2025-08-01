import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY || 'default_key',
});

const AI_MODEL = 'gpt-4o-mini';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    });

    const result = {
      content: response.choices[0].message.content,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    };

    return Response.json(result);
  } catch (error: unknown) {
    console.error('OpenAI API error:', error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to process request',
      },
      { status: 500 },
    );
  }
}
