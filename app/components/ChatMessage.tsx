'use client';

import { useState } from 'react';
import Image from 'next/image';
import { nanoid } from 'nanoid';
import Pusher from 'pusher-js';

const Chat = () => {
  const [allMessage] = useState([
    {
      message: 'Hello',
      User: {
        name: 'John Doe',
        image:
          'https://images.unsplash.com/photo-1498019559366-a1cbd07b5160?q=80&w=2058&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    },
  ]);

  console.log(process.env.NEXT_PUBLIC_PUSHER_APP_KEY)

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
  });

  const channel = pusher.subscribe('my-channel');
  channel.bind('my-event', function (data: unknown) {
    alert(JSON.stringify(data));
  });

  return (
    <div className='p-6 flex-grow max-h-screen overflow-y-auto py-32'>
      <div className='flex flex-col gap-4'>
        {allMessage.map((message, index) => (
          <div key={nanoid()}>
            <div className='flex items-center'>
              <Image
                src={message.User.image}
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
              {message.User.name}
              Van
            </p>
          </div>
        ))}
        {/* <div ref={messageEndRef}></div> */}
      </div>
    </div>
  );
};

export default Chat;
