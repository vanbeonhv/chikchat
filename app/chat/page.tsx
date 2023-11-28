import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Form from '@/app/chat/Form';
import { prisma } from '@/app/lib/db';
import { IMessageDetail } from '@/app/action';
import Conversation from '@/app/chat/Conversation';

export interface IGroupMessage {
  [key: string]: IMessageDetail[];
}

const getAllMessage = async () => {
  const data: IMessageDetail[] = await prisma.message.findMany({
    select: {
      id: true,
      message: true,
      email: true,
      createAt: true,
      User: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createAt: 'asc',
    },
    take: 50,
  });
  return data;
};

export const dynamic = 'force-dynamic';
const ChatHomePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const messageList = await getAllMessage();
  const groupMessageByDate = messageList.reduce(
    (groupMessages: IGroupMessage, message: IMessageDetail) => {
      const date = message.createAt.toISOString().split('T')[0];
      groupMessages[date] = [...(groupMessages[date] ?? []), message];
      return groupMessages;
    },
    {}
  );

  return (
    <div className='h-screen bg-gray-200 flex flex-col'>
      <Conversation groupMessageByDate={groupMessageByDate} />
      <Form />
    </div>
  );
};

export default ChatHomePage;
