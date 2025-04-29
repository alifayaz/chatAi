'use client';
import React, { useState } from 'react';

type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    parts: { type: 'text'; text: string }[];
};

export default function HomePage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            parts: [{ type: 'text', text: input }],
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error);
                return;
            }

            setMessages(data.messages);
        } catch (error) {
            console.error('Error fetching assistant reply:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
            <h1 className="text-xl font-bold mb-4">Chat with GPT-4o</h1>

            <div className="space-y-4 mb-6">
                {messages.map((msg) => (
                    <div key={msg?.id}>
                        <strong className="capitalize">{msg?.role}:</strong>{' '}
                        {msg?.parts.map((part, i) => (
                            <span key={i}>{part?.type === 'text' ? part?.text : '[non-text]'}</span>
                        ))}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="flex-1 border px-3 py-2 rounded"
                    autoComplete="true"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {isLoading ? 'loading ...' : 'Send'}
                </button>
            </form>
        </main>
    );
}
