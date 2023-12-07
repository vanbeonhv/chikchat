import { IMessageDetail } from '@/app/action';
import Tooltip from '@/shared-ui/Tooltip';
import { getDateTime } from '@/util/getDateTime';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import './style.css'
import { MessagePosition } from '../type/common';

interface IChatMessageProps  {
  message: IMessageDetail;
  isShowAvatar: boolean;
  position: MessagePosition;
}

const ChatMessage = ({
  message,
  isShowAvatar,
  position
}: IChatMessageProps
 
) => {
  console.log('position:', position)
  const session = useSession();
  const isOwnMessage = message.email === session?.data?.user?.email;

  const isTextRight = isOwnMessage ? 'text-right' : '';
  const isFlexRight = isOwnMessage ? 'flex-row-reverse' : '';
  const isPrimaryBackground = isOwnMessage
    ? 'bg-teal-500 text-white'
    : 'bg-white';
  
  return (
    <div className={`${isTextRight}`}>
      <div className={`flex items-center gap-4 h-11 ${isFlexRight}`}>
        {isShowAvatar ? (
          <Tooltip
            title={message.User?.name as string}
            side={isOwnMessage ? 'left' : 'right'}
          >
            <Image
              src={message.User?.image ?? ''}
              alt='Profile image of user'
              className='w-12 object-cover rounded-lg'
              width={50}
              height={50}
            />
          </Tooltip>
        ) : (
          <div className='w-12 bg-gray-200'></div>
        )}

        <Tooltip
          title={getDateTime(message.createAt)}
          side={isOwnMessage ? 'left' : 'right'}
        >
          <div
            className={`message-border-radius px-4 py-2 shadow-md self-start ${isPrimaryBackground} ${position}`}
          >
            {message.message}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChatMessage;
