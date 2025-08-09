'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import './page.css';
import { SendHorizonal } from 'lucide-react';

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
      await sendMessage({ chatId, text: newMessageText });
      setNewMessageText("");
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <h2 className="font-bold text-2xl">Chat</h2>
        </div>
        <div ref={listRef} className="chat-messages">
          {messages?.map((message) => (
            <div
              key={message._id}
              className={`message-container ${message.clerkId === user?.id ? 'sent' : 'received'
}`}
            >
              <div className="message-bubble">
                <div className="message-author">{message.author}</div>
                <p className="message-text">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={newMessageText}
              onChange={(event) => setNewMessageText(event.target.value)}
              placeholder="Type a message…"
              className="flex-grow"
            />
            <Button type="submit" disabled={!newMessageText.trim()} size="icon" className='bg-blue-500 hover:bg-blue-600'>
              <SendHorizonal size={20} />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
