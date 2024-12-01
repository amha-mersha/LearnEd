'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreVertical, Send } from 'lucide-react'
import Cookie from "js-cookie";

export default function MessageInput() {
  const [message, setMessage] = useState('')
  const token = Cookie.get("token")
  console.log(token)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // TODO: Implement your post submission logic here
    console.log('Sending message:', message)
    
    // Clear the input after sending
    setMessage('')
  }

  return (
    <div className="border-t bg-background p-4 sticky bottom-0">
      <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto space-y-4">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={!message.trim()}>
            <Send className="w-4 h-4 mr-2" />
            Post Message
          </Button>
        </div>
      </form>
    </div>
  )
}

