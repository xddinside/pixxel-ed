'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import './page.css';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const messages = useQuery(api.messages.list, { chatId });
  const sendMessage = useMutation(api.messages.send);
  const [newMessageText, setNewMessageText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newMessageText.trim() !== "") {
      // Send a new message and clear the input field.
      await sendMessage({ chatId, text: newMessageText });
      setNewMessageText("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room</h2>
      </div>
      <div ref={listRef} className="chat-messages">
        {messages?.map((message) => (
          <div
            key={message._id}
            className={`message-bubble ${message.clerkId === user?.id ? 'sent' : 'received'
}`}
          >
            <div className="message-author">{message.author}</div>
            <div className="message-text">{message.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <form onSubmit={handleSubmit} className="flex w-full">
          <Input
            value={newMessageText}
            onChange={(event) => setNewMessageText(event.target.value)}
            placeholder="Write a message…"
            className="flex-grow"
          />
          <Button type="submit" disabled={!newMessageText.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
