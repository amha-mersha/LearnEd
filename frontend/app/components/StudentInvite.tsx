import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useInviteToClassroomsMutation } from '@/lib/redux/api/getApi';
import Cookie from 'js-cookie';


export default function StudentInvite({ isOpen, onClose, classroomId, onSuccess }: { isOpen: boolean; onClose: () => void; classroomId: string; onSuccess: () => void }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [inviteToClassroom, { isLoading, isError, isSuccess }] = useInviteToClassroomsMutation();
  // const accessToken = localStorage.getItem('token');
  const accessToken = Cookie.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      email: studentEmail
  };

  try {
      await inviteToClassroom({classroomId, data: payload, accessToken }).unwrap();
      onClose(); 
      onSuccess(); // Trigger success action in parent component
  } catch (err) {
    const error = err as BackendError; // Cast the error

      console.error("Invite failed:", error);

      if (error?.data?.error) {
        setErrorMessage(error.data.error);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
  }
    
  }

  return (
    <>
    
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] py-24 px-20">
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
          {isError && <p className="text-red-500">Failed to invite student. {errorMessage}</p>}
        </form>
      </DialogContent>
    </Dialog>
              </>
  )
}