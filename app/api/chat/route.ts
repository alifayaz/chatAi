import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

function getErrorMessage(error: unknown) {
    if (error == null) return 'Unknown error';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return JSON.stringify(error);
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const result = await streamText({
            model: openai('gpt-4o'),
            messages,
            system: 'You are a helpful assistant.',
        });

        return result.toDataStreamResponse({
            getErrorMessage,
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
