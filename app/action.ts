'use server';

import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import {Message} from "@prisma/client";

export interface IMessageDetail extends Message {
    User: {
        name: string | null;
        image: string | null;
    } | null;
}
export const postData = async (formData: FormData) => {
  'user server';

  const Pusher = require('pusher');
  const session = await getServerSession(authOptions);
  const message = formData.get('message');

  const data : IMessageDetail = await prisma.message.create({
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

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
    secret: process.env.PUSHER_APP_SECRET as string,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
    useTLS: true,
  });

  await pusher.trigger('my-channel', 'my-event', data);
};
