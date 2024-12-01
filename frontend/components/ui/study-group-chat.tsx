import MessageInput from './message-input'
import { MessageFeed } from './message-feed'

interface Props {
  studygroup_id : string | string[]
}

export default function StudyGroupChat({studygroup_id}: Props) {
  return (
    <div className="flex flex-col ">
      <MessageInput studyGroupId = {studygroup_id} />
    </div>
  )
}

