import { IMessageDetail } from '@/app/action';
import { getDateTime } from '@/util/getDateTime';
import ChatMessage from './ChatMessage';
import { MessagePosition } from '../type/common';

const ChatSession = ({ session }: { session: IMessageDetail[] }) => {
  //Split message group by each User to apply style
  const messageGroupByUser: IMessageDetail[][] = [];
  let currentGroup: IMessageDetail[] = [];
  session.forEach((message, index) => {
    if (index === 0 || message.User?.name != session[index - 1].User?.name) {
      if (currentGroup.length > 0) {
        messageGroupByUser.push(currentGroup);
      }
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }

    if (index === session.length - 1) messageGroupByUser.push(currentGroup);
  });

  const messageComponent = messageGroupByUser.map((msgGroup) => {
    const messageComponet = msgGroup.map((message, index) => {
      //Check show avatar
      let isShowAvatar: boolean = false;
      if (index === msgGroup.length - 1) {
        isShowAvatar = true;
      }

      //Get message position to apply style
      let messagePosition: MessagePosition;
      if (msgGroup.length === 1) {
        messagePosition = 'single';
      } else {
        switch (index) {
          case 0:
            messagePosition = 'top';
            break;
          case msgGroup.length - 1:
            messagePosition = 'bottom';
            break;
          default:
            messagePosition = 'middle';
            break;
        }
      }
      return (
        <ChatMessage
          key={message.id}
          message={message}
          isShowAvatar={isShowAvatar}
          position={messagePosition}
        />
      );
    });

    return messageComponet;
  });

  return (
    <div>
      <p className='text-center py-4 text-slate-700'>
        {getDateTime(session[0].createAt)}
      </p>
      {messageComponent}
    </div>
  );
};

export default ChatSession;
