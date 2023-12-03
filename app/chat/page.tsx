import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Form from '@/app/chat/Form';
import { prisma } from '@/app/lib/db';
import { IMessageDetail } from '@/app/action';
import Conversation from '@/app/chat/Conversation';
import { TIME_HOLD_SESSION } from '@/util/constant';

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
      createAt: 'desc',
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

  const messageList = (await getAllMessage()).reverse();

  let messageListBySession: IGroupMessage[] = [];
  let currentSession: IGroupMessage = [];

  messageList.forEach((message, index) => {
    if (index === 0) {
      currentSession.push(message);
    } else {
      const gapTime =
        message.createAt.getTime() - messageList[index - 1].createAt.getTime();
      if (gapTime <= TIME_HOLD_SESSION) {
        currentSession.push(message);
        index === messageList.length - 1 &&
          messageListBySession.push(currentSession);
      } else {
        messageListBySession.push(currentSession);
        currentSession = [];
        currentSession.push(message);
      }
    }
  });
  return (
    <div className='h-screen bg-gray-200 flex flex-col'>
      <Conversation messageListBySession={messageListBySession} />
      <Form />
    </div>
  );
};

export default ChatHomePage;
