'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import './page.css';
import { SendHorizonal, Download } from 'lucide-react'; // Import Download icon
import { UploadButton } from '@/utils/uploadthing';

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

  const onUploadComplete = (res: any) => {
    if (res) {
      const file = res[0];
      sendMessage({
        chatId,
        // No redundant text, just the file details
        fileUrl: file.url,
        fileName: file.name,
        fileType: file.type,
      });
    }
    // Changed from alert to toast for better UX
    toast.success("Upload complete!");
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
                {message.text && <p className="message-text">{message.text}</p>}
                {message.fileUrl && (
                  message.fileType?.startsWith('image/') ? (
                    <img src={message.fileUrl} alt={message.fileName || 'Uploaded image'} className="uploaded-image" />
                  ) : (
                      <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="file-download-link">
                        <Download className="file-download-icon" />
                        <span>{message.fileName}</span>
                      </a>
                    )
                )}
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
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={onUploadComplete}
              onUploadError={(error: Error) => {
                toast.error(`Upload Failed: ${error.message}`);
              }}
            />
            <UploadButton
              endpoint="docUploader"
              onClientUploadComplete={onUploadComplete}
              onUploadError={(error: Error) => {
                toast.error(`Upload Failed: ${error.message}`);
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
