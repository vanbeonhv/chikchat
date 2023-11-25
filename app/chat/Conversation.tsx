'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { nanoid } from 'nanoid';
import Pusher from 'pusher-js';
import { IMessageDetail } from '@/app/action';
import {useSession} from "next-auth/react";

const Conversation = ({ messageList }: { messageList: IMessageDetail[] }) => {
  const [allMessage, setAllMessage] = useState<IMessageDetail[]>(messageList);
  const messageEndRef = useRef<HTMLDivElement>(null);
  // const session = useSession();

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
          <div key={nanoid()}>
            <div className='flex items-center'>
              <Image
                src={message.User?.image ?? ''}
                alt='Profile image of user'
                className='w-12 h-12 object-cover rounded-lg mr-4'
                width={50}
                height={50}
              />
              <div className='rounded-lg bg-white p-4 shadow-md self-start'>
                {message.message}
              </div>
            </div>

            <p className='font-light text-sm text-gray-600'>
              {message.User?.name}
            </p>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
};

export default Conversation;
