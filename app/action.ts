'use server';

import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export const postData = async (formData: FormData) => {
  'user server';

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
};
