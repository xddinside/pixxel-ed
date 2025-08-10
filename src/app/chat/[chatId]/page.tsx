'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/nextjs';
import './page.css';
import { SendHorizonal, Download, Image as ImageIcon, FileText } from 'lucide-react';
import { UploadButton } from '@/utils/uploadthing';
import { toast } from 'sonner';
import { Id } from '@/convex/_generated/dataModel';
import Image from 'next/image'; 

type UploadFileResponse = {
  url: string;
  name: string;
  type: string;
};

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const messages = useQuery(api.messages.list, { chatId });
  const sendMessage = useMutation(api.messages.send);
  const [newMessageText, setNewMessageText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const { user: clerkUser } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);

  const otherUserId = chatId?.split('_').find(id => id !== currentUser?._id) as Id<"users"> | undefined;
  const otherUser = useQuery(api.users.getUserById, otherUserId ? { userId: otherUserId } : 'skip');

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessageText.trim() !== "") {
      await sendMessage({ chatId, text: newMessageText });
      setNewMessageText("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const onUploadComplete = async (res: UploadFileResponse[]) => {
    if (res && res.length > 0) {
      const file = res[0];
      try {
        await sendMessage({
          chatId,
          fileUrl: file.url,
          fileName: file.name,
          fileType: file.type,
        });
        toast.success("Upload complete and message sent!");
      } catch (error) {
        console.error("Failed to send message:", error);
        toast.error("Upload succeeded, but the message failed to send.", {
          description: String(error),
        });
      }
    } else {
      toast.error("Upload finished but no file data was returned.");
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <h2 className="font-bold text-2xl">
            {otherUser ? `Chat with ${otherUser.name}` : 'Chat'}
          </h2>
        </div>
        <div ref={listRef} className="chat-messages">
          {messages?.map((message) => (
            <div
              key={message._id}
              className={`message-container ${message.clerkId === clerkUser?.id ? 'sent' : 'received'}`}
            >
              <div className="message-bubble">
                <div className="message-author">{message.author}</div>
                {message.text && <p className="message-text">{message.text}</p>}
                {message.fileUrl && (
                  message.fileType?.startsWith('image/') ? (
                    <Image src={message.fileUrl} alt={message.fileName || 'Uploaded image'} className="uploaded-image" width={300} height={300} style={{ width: '100%', height: 'auto' }} />
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
          <form onSubmit={handleSubmit} className="flex items-end gap-1">
            <div className="flex items-baseline gap-2">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={onUploadComplete}
                onUploadError={onUploadError}
                className='pb-8 ml-1 mr-[-1rem]'
                content={{
                  button({ ready }) {
                    return (
                      <Button asChild variant="ghost" size="icon" disabled={!ready}>
                        <div>
                          <ImageIcon size={20} className="text-foreground" />
                          <span className="sr-only">Upload Image</span>
                        </div>
                      </Button>
                    );
                  },
                  allowedContent() {
                    return (
                      <div className="w-16 text-center text-xs text-muted-foreground">
                        Image
                      </div>
                    );
                  }
                }}
              />
              <UploadButton
                endpoint="docUploader"
                onClientUploadComplete={onUploadComplete}
                onUploadError={onUploadError}
                className='ml-[-0.5rem] mr-[-1rem]'
                content={{
                  button({ ready }) {
                    return (
                      <Button asChild variant="ghost" size="icon" disabled={!ready}>
                        <div>
                          <FileText size={20} className="text-foreground" />
                          <span className="sr-only">Upload Document</span>
                        </div>
                      </Button>
                    );
                  },
                  allowedContent() {
                    return (
                      <div className="w-16 text-center text-xs text-muted-foreground">
                        Text & PDFs
                      </div>
                    );
                  }
                }}
              />
            </div>

            <div className="relative flex-grow px-6 py-4">
              <Textarea
                value={newMessageText}
                onChange={(event) => setNewMessageText(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                className="flex-grow resize-none pr-12"
                rows={3}
              />
              <Button
                type="submit"
                disabled={!newMessageText.trim()}
                size="icon"
                className='absolute bottom-6 right-8 bg-blue-500 hover:bg-blue-600'
              >
                <SendHorizonal size={20} />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
