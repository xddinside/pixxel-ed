'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatPage() {
    const { chatId } = useParams<{ chatId: string }>();
    const messages = useQuery(api.messages.list, { chatId });
    const sendMessage = useMutation(api.messages.send);
    const [newMessageText, setNewMessageText] = useState("");
    const listRef = useRef<HTMLDivElement>(null);

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
        <div className="flex flex-col h-screen">
            <Card className="flex-grow flex flex-col m-4">
                <CardHeader>
                    <CardTitle>Chat Room</CardTitle>
                </CardHeader>
                <CardContent ref={listRef} className="flex-grow overflow-y-auto">
                    {messages?.map((message) => (
                        <div key={message._id} className="flex items-center mb-2">
                            <div className="font-bold mr-2">{message.author}:</div>
                            <div>{message.text}</div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <form onSubmit={handleSubmit} className="flex w-full">
                        <Input
                            value={newMessageText}
                            onChange={(event) => setNewMessageText(event.target.value)}
                            placeholder="Write a message…"
                        />
                        <Button type="submit" disabled={!newMessageText.trim()}>
                            Send
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
