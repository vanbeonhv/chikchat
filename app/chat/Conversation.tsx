'use client';

import Pusher from 'pusher-js';
import { memo, useEffect, useRef, useState } from 'react';
import { IGroupMessage } from './page';
import { IMessageDetail } from '../action';
import { TIME_HOLD_SESSION } from '@/util/constant';
import ChatSession from '@/app/chat/ChatSession';

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
    channel.bind('my-event', function (data: any) {
      const parsedData = {
        ...data,
        createAt: new Date(data.createAt),
      } as IMessageDetail;

      setAllMessage((prevState) => {
        const tempMessageList = [...prevState];
        const lastSession = tempMessageList[tempMessageList.length - 1];
        const lastMessage = lastSession[lastSession.length - 1];
        if (lastMessage.id === parsedData.id) return prevState;

        const gapTime =
          new Date(parsedData.createAt).getTime() -
          lastMessage.createAt.getTime();
        gapTime < TIME_HOLD_SESSION
          ? tempMessageList[tempMessageList.length - 1].push(parsedData)
          : tempMessageList.push([parsedData]);
        return tempMessageList;
      });
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
            <ChatSession
              key={session[0].createAt.getTime()}
              session={session}
            />
          );
        })}
        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
};

export default memo(Conversation);
