'use client';

import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import Pusher from 'pusher-js';
import { IMessageDetail } from '@/app/action';
import ChatMessage from '@/app/chat/ChatMessage';

const Conversation = ({ messageList }: { messageList: IMessageDetail[] }) => {
  const [allMessage, setAllMessage] = useState<IMessageDetail[]>(messageList);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollNewMessage = () =>
    messageEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });

  useEffect(() => {
    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
      },
    );

    const channel = pusher.subscribe('my-channel');
    channel.bind('my-event', function(data: any) {
      setAllMessage((prev) => [...prev, data]);
    });

    return () => pusher.unsubscribe('my-channel');
  }, []);

  useEffect(() => {
    scrollNewMessage();
  }, [allMessage]);

  return (
    <div className='p-6 flex-grow max-h-screen overflow-y-auto py-32'>
      <div className='flex flex-col gap-4'>
        {allMessage?.map((message) => (
          <ChatMessage key={nanoid()} message={message} />
        ))}
        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
};

export default Conversation;
