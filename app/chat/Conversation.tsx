'use client';

import ChatMessage from '@/app/chat/ChatMessage';
import { getDateTime } from '@/util/getDateTime';
import { nanoid } from 'nanoid';
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';
import { IGroupMessage } from './page';
import { IMessageDetail } from '../action';

const Conversation = ({
  messageListBySession,
}: {
  messageListBySession: IGroupMessage[];
}) => {
  const [allMessage, setAllMessage] =
    useState<IGroupMessage[]>(messageListBySession);
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
    channel.bind('my-event', function (data: IMessageDetail) {
      console.log("data", data);
      // setAllMessage((prev) => [...prev, data]);
    });

    return () => pusher.unsubscribe('my-channel');
  }, []);

  useEffect(() => {
    scrollNewMessage();
  }, [allMessage]);

  return (
    <div className='p-6 flex-grow max-h-screen overflow-y-auto py-32'>
      <div className='flex flex-col gap-4'>
        {allMessage.map((session) => {
          return (
            <div key={session[0].createAt.getTime()}>
              <p className='text-center py-4 text-slate-700'>
                {getDateTime(session[0].createAt)}
              </p>
              {session.map((message, index) => (
                <ChatMessage
                  key={nanoid()}
                  message={message}
                  isShowAvatar={index === session.length - 1}
                />
              ))}
            </div>
          );
        })}
        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
};

export default Conversation;
