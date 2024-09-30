import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function CreateClassroomModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [classroomName, setClassroomName] = useState('')
  const [courseName, setCourseName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Classroom created:', { classroomName, courseName })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] py-20 px-20">
        <DialogHeader className=''>
          <DialogTitle className=" text-center font-black">Create ClassRoom</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="classroomName" className="text-sm font-medium">
              Classroom Name
            </label>
            <Input
              id="classroomName"
              placeholder="e.g Math"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="courseName" className="text-sm font-medium">
              Course Name
            </label>
            <Input
              id="courseName"
              placeholder="e.g Math for Grade 3"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Create Classroom
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}