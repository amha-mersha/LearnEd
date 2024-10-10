"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateClassroomMutation } from "@/lib/redux/api/getApi";
import Cookies from "js-cookie";

export default function CreateClassroomModal({
  isOpen,
  onClose,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) {
  const [classroomName, setClassroomName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [season, setSeason] = useState("");
  const [year, setYear] = useState("");
  const [createClassroom, { isLoading, isError, isSuccess }] =
    useCreateClassroomMutation();
  const accessToken = Cookies.get("token");

  const handleSubmit =async (e: React.FormEvent)=> {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Classroom created:", {
      classroomName,
      courseName,
      season,
      year,
    });
    const payload = {
      name: classroomName,
      course_name: courseName,
      season: `${season} ${year}`,
    };

    try {
      await createClassroom({ data: payload, accessToken }).unwrap();  // Pass both data and accessToken
      refetch(); // Refetch the classrooms data
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Failed to create classroom:", error);
    }
    // onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] py-20 px-16">
        <DialogHeader className="">
          <DialogTitle className="text-center font-black">
            Create Classroom
          </DialogTitle>
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Season and Year</label>
            <div className="flex space-x-4">
              <Select onValueChange={(value: string) => setSeason(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Season</SelectLabel>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                    <SelectItem value="Winter">Winter</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                id="year"
                placeholder="e.g 2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                type="number"
                min="1900"
                max={new Date().getFullYear() + 10}
                className="w-[100px]"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Classroom"}
          </Button>
          {isError && <p className="text-red-500">Failed to create classroom.</p>}
          {isSuccess && <p className="text-green-500">Classroom created successfully!</p>}
          
        </form>
      </DialogContent>
    </Dialog>
  );
}
