import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { MoreVerticalIcon } from "lucide-react"
interface Message {
    id: string
    content: string
    timestamp: string
    author: {
      name: string
      avatar: string
    }
  }
  
  export function MessageFeed({ messages }: { messages: Message[] }) {
    return (
      <div className="space-y-6 p-4">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={message.author.avatar} />
              <AvatarFallback>{message.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{message.author.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    has posted some notes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {message.timestamp}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  