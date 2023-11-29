import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Form from '@/app/chat/Form';
import { prisma } from '@/app/lib/db';
import { IMessageDetail } from '@/app/action';
import Conversation from '@/app/chat/Conversation';

export type IGroupMessage = IMessageDetail[];

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
export const timeHoldSession = 5 * 60 * 1000;

const ChatHomePage = async () => {
  const session = await getServerSession(authOptions);

  //5 minutes

  if (!session) {
    redirect('/');
  }

  const messageList = await getAllMessage();

  let messageListBySession: IGroupMessage[] = [];
  let currentSession: IGroupMessage = [];

  messageList.forEach((message, index) => {
    if (index === 0) {
      currentSession.push(message);
    } else {
      const gapTime =
        message.createAt.getTime() - messageList[index - 1].createAt.getTime();
      if (gapTime <= timeHoldSession) {
        currentSession.push(message);
      } else {
        messageListBySession.push(currentSession);
        currentSession = [];
        currentSession.push(message);
      }
    }
  });

  // const groupMessageByDate = messageList.reduce(
  //   (groupMessages: IGroupMessage, message: IMessageDetail) => {

  //     const date = message.createAt.toISOString().split('T')[0];
  //     groupMessages[date] = [...(groupMessages[date] ?? []), message];
  //     return groupMessages;
  //   },
  //   {}
  // );
  console.log('messageList:', messageList);

  return (
    <div className='h-screen bg-gray-200 flex flex-col'>
      <Conversation messageListBySession={messageListBySession} />
      <Form />
    </div>
  );
};

export default ChatHomePage;
