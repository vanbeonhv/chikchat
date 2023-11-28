'use client';

import ChatMessage from '@/app/chat/ChatMessage';
import { getDateTime } from '@/util/getDateTime';
import { nanoid } from 'nanoid';
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';
import { IGroupMessage } from './page';

const Conversation = ({
  groupMessageByDate,
}: {
  groupMessageByDate: IGroupMessage;
}) => {
  const [allMessage, setAllMessage] =
    useState<IGroupMessage>(groupMessageByDate);
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
      }
    );

    const channel = pusher.subscribe('my-channel');
    // channel.bind('my-event', function(data: any) {
    //   setAllMessage((prev) => [...prev, data]);
    // });

    return () => pusher.unsubscribe('my-channel');
  }, []);

  useEffect(() => {
    scrollNewMessage();
  }, [allMessage]);

  return (
    <div className='p-6 flex-grow max-h-screen overflow-y-auto py-32'>
      <div className='flex flex-col gap-4'>
        {Object.keys(allMessage).map((date) => (
          <div key={date}>
            <p className='text-center py-4 text-slate-700'>
              {getDateTime(allMessage[date][0].createAt)}
            </p>
            {allMessage[date].map((message) => (
              <ChatMessage key={nanoid()} message={message} />
            ))}
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
};

export default Conversation;
