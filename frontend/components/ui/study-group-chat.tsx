import MessageInput from './message-input'
import { MessageFeed } from './message-feed'

const SAMPLE_MESSAGES = [
  {
    id: '1',
    content: 'This is a trial message',
    timestamp: '2024-11-30T14:54:34.374Z',
    author: {
      name: 'User 1',
      avatar: '/placeholder.svg'
    }
  },
  {
    id: '2',
    content: 'Another test message',
    timestamp: '2024-11-30T15:52:58.223Z',
    author: {
      name: 'User 2',
      avatar: '/placeholder.svg'
    }
  }
]

export default function StudyGroupChat() {
  return (
    <div className="flex flex-col ">
      <MessageInput />
    </div>
  )
}

