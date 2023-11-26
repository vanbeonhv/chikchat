import Image from 'next/image';
import { IMessageDetail } from '@/app/action';
import { useSession } from 'next-auth/react';


const ChatMessage = ({ message }: { message: IMessageDetail }) => {
  const session = useSession();
  const isOwnMessage = message.email === session?.data?.user?.email;

  const isTextRight = isOwnMessage ? 'text-right' : '';
  const isFlexRight = isOwnMessage ? 'flex-row-reverse' : '';
  const isPrimaryBackground = isOwnMessage ? 'bg-teal-500 text-white' : 'bg-white';


  return (
    <div className={isTextRight}>
      <div className={`flex items-center gap-4 ${isFlexRight}`}>
        <Image
          src={message.User?.image ?? ''}
          alt='Profile image of user'
          className='w-12 h-12 object-cover rounded-lg'
          width={50}
          height={50}
        />
        <div className={`rounded-full px-4 py-2 shadow-md self-start ${isPrimaryBackground}`}>
          {message.message}
        </div>
      </div>

      <p className='font-light text-sm text-gray-600'>
        {message.User?.name}
      </p>
    </div>
  );
};

export default ChatMessage;
