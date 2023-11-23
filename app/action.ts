'use server';

import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export const postData = async (formData: FormData) => {
  'user server';

  const Pusher = require('pusher');
  const session = await getServerSession(authOptions);
  const message = formData.get('message');

  const data = await prisma.message.create({
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
    key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    useTLS: true,
  });

  pusher.trigger('my-channel', 'my-event', data);
};
