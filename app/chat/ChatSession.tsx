import { getDateTime } from '@/util/getDateTime';
import ChatMessage from '@/app/chat/ChatMessage';
import { nanoid } from 'nanoid';
import { IMessageDetail } from '@/app/action';

const ChatSession = ({ session }: { session: IMessageDetail[] }) => {
  return (
    <div>
      <p className='text-center py-4 text-slate-700'>
        {getDateTime(session[0].createAt)}
      </p>
      {session.map((message, index) => {
        let isShowAvatar: boolean;
        if (index === session.length - 1) {
          isShowAvatar = true;
        } else isShowAvatar = session[index + 1].email !== message.email;

        return (
          <ChatMessage
            key={nanoid()}
            message={message}
            isShowAvatar={isShowAvatar}
          />
        );
      })}
    </div>
  );
};

export default ChatSession;
