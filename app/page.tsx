'use client';

import { useChat } from '@ai-sdk/react';

export default function HomePage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    status,
  } = useChat({
    api: '/api/chat',
  });

  return (
      <main className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
        <h1 className="text-xl font-bold mb-4">Chat with GPT-4o</h1>

        <div className="space-y-4 mb-6">
          {messages.map((msg) => (
              <div key={msg.id}>
                <strong className="capitalize">{msg.role}:</strong>{' '}
                {msg.parts.map((part, i) => (
                    <span key={i}>{part.type === 'text' ? part.text : '[non-text]'}</span>
                ))}
              </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              disabled={isLoading || status !== 'ready'}
              className="flex-1 border px-3 py-2 rounded"
          />
          <button
              type="submit"
              disabled={isLoading || status !== 'ready'}
              className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </form>
      </main>
  );
}
