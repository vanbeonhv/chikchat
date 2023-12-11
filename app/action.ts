'use server';

import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { Message } from '@prisma/client';
import { nanoid } from 'nanoid';

export interface IMessageDetail extends Message {
  User: {
    name: string | null;
    image: string | null;
  } | null;
}

const dev_list_email = [
  'nguyenvannhv26@gmail.com',
  'nguyen_huuvan@wohhup.com.vn',
];

export const postData = async (formData: FormData) => {
  'user server';

  const Pusher = require('pusher');
  const session = await getServerSession(authOptions);
  const message = formData.get('message');

  let messageData: IMessageDetail;

  if (!dev_list_email.includes(session?.user?.email as string)) {
    messageData = {
      id: nanoid(),
      message: message as string,
      email: session?.user?.email as string,
      createAt: new Date(),
      User: {
        name: session?.user?.name as string,
        image: session?.user?.image as string,
      },
    };
  } else {
    messageData = await prisma.message.create({
      data: {
        message: message as string,
        email: session?.user?.email,
      },
      include: {
        User: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
    secret: process.env.PUSHER_APP_SECRET as string,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
    useTLS: true,
  });

  await pusher.trigger('my-channel', 'my-event', messageData);
};
