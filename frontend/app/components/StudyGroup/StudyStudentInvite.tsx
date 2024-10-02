import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useInviteToStudyGroupMutation } from '@/lib/redux/api/getApi';

export default function StudyStudentInvite({ isOpen, onClose, studyGroupId }: { isOpen: boolean; onClose: () => void; studyGroupId: string }) {
  const [studentEmail, setStudentEmail] = useState('')
  const [inviteToStudyGroup, { isLoading, isError, isSuccess }] =
  useInviteToStudyGroupMutation();
  const accessToken =
    localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Student invited:", {studentEmail});

    const payload = {
        email: studentEmail
    };

    try{
        await inviteToStudyGroup({studyGroupId, data: payload, accessToken }).unwrap();
        console.log("Successfully invited student");
        onClose(); 
    } catch (error){
        console.error("Failed to invite student:", error);
    }
    
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] py-10 px-20">
        <DialogHeader className=''>
          <DialogTitle className=" text-center font-black">Invite Students</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-10 mt-2">
          <div className="space-y-2">
            <Input
              id="studentEmail"
              placeholder="Email of the student"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
            />
          </div>
         
          <Button type="submit" className="w-full">
            Invite
          </Button>
          {isError && <p className="text-red-500">Failed to invite student.</p>}
          {isSuccess && <p className="text-green-500">Student invited successfully!</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}