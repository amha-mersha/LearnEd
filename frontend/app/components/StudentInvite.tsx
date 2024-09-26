import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function StudentInvite({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [classroomName, setClassroomName] = useState('')
  const [courseName, setCourseName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Classroom created:', { classroomName, courseName })
    // onClose()
    setClassroomName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] py-24 px-20">
        <DialogHeader className=''>
          <DialogTitle className=" text-center font-black">Invite Students</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-20 mt-2">
          <div className="space-y-2">
            <Input
              id="classroomName"
              placeholder="Email of the student"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
              required
            />
          </div>
         
          <Button type="submit" className="w-full">
            Invite
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}