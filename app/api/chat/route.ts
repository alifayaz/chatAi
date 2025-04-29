import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        const openAIMessages = messages.map((msg: any) => ({
            role: msg.role,
            content: msg.parts?.map((p: any) => p.text).join('') ?? '',
        }));

        const response = await fetch('https://api.avalai.ir/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: openAIMessages,
                stream: false,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('OpenAI API error:', data);
            return Response.json({ error: data.message || 'OpenAI API Error' }, { status: 500 });
        }

        const content = data?.choices?.[0]?.message?.content ?? 'not response';

        const assistantMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            parts: [{ type: 'text', text: content }],
        };

        return Response.json({
            messages: [...messages, assistantMessage],
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return Response.json({ error: 'server error' }, { status: 500 });
    }
}
