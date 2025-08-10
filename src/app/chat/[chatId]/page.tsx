'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/nextjs';
import './page.css';
import { SendHorizonal, Download, Image, FileText } from 'lucide-react';
import { UploadButton } from '@/utils/uploadthing';
import { toast } from 'sonner';

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
        fileUrl: file.url,
        fileName: file.name,
        fileType: file.type,
      });
    }
    toast.success("Upload complete!");
  };

  const onUploadError = (error: Error) => {
    toast.error(`Upload Failed: ${error.message}`);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        {/* Chat Header and Messages remain the same */}
        <div className="chat-header">
          <h2 className="font-bold text-2xl">Chat</h2>
        </div>
        <div ref={listRef} className="chat-messages">
          {messages?.map((message) => (
            <div
              key={message._id}
              className={`message-container ${message.clerkId === user?.id ? 'sent' : 'received'}`}
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
          {/* START: Reduced gap on the form */}
          <form onSubmit={handleSubmit} className="flex items-end gap-1">
            {/* START: Changed to items-baseline and added a gap between buttons */}
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
                          <Image size={20} />
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
                          <FileText size={20} />
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
            {/* END: ClassName changes */}
            
            <div className="relative flex-grow px-6 py-4">
              <Textarea
                value={newMessageText}
                onChange={(event) => setNewMessageText(event.target.value)}
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
          {/* END: ClassName changes */}
        </div>
      </div>
    </div>
  );
}
