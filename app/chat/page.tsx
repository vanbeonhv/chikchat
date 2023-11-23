import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Form from '@/app/components/Form';
import Chat from '../components/ChatMessage';

const ChatHomePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className='h-screen bg-gray-200 flex flex-col'>
      <Chat />

      <Form />
    </div>
  );
};

export default ChatHomePage;
