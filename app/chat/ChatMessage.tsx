import { IMessageDetail } from '@/app/action';
import Tooltip from '@/shared-ui/Tooltip';
import { getDateTime } from '@/util/getDateTime';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const ChatMessage = ({ message }: { message: IMessageDetail }) => {
  const session = useSession();
  const isOwnMessage = message.email === session?.data?.user?.email;

  const isTextRight = isOwnMessage ? 'text-right' : '';
  const isFlexRight = isOwnMessage ? 'flex-row-reverse' : '';
  const isPrimaryBackground = isOwnMessage
    ? 'bg-teal-500 text-white'
    : 'bg-white';

  return (
    <div className={isTextRight}>
      <div className={`flex items-center gap-4 ${isFlexRight}`}>
        <Tooltip
          title={message.User?.name as string}
          side={isOwnMessage ? 'left' : 'right'}
        >
          <Image
            src={message.User?.image ?? ''}
            alt='Profile image of user'
            className='w-12 h-12 object-cover rounded-lg'
            width={50}
            height={50}
          />
        </Tooltip>

        <Tooltip
          title={getDateTime(message.createAt)}
          side={isOwnMessage ? 'left' : 'right'}
        >
          <div
            className={`rounded-full px-4 py-2 shadow-md self-start ${isPrimaryBackground}`}
          >
            {message.message}
          </div>
        </Tooltip>
      </div>

      {/* <p className='font-light text-sm text-gray-600'>
        {getDateTime(message.createAt)}
      </p> */}
    </div>
  );
};

export default ChatMessage;
