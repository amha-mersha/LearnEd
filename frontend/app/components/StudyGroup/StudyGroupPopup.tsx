import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cookie from "js-cookie";

import { useCreateStudyGroupMutation } from "@/lib/redux/api/getApi";
import { useTranslations } from "next-intl";

export default function CreateStudyGroupModal({
  isOpen,
  onClose,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) {
  const [studyGroupName, setstudyGroupName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [createStudyGroup, { isLoading, isError, isSuccess }] =
    useCreateStudyGroupMutation();
  // const accessToken = localStorage.getItem("token");
  const accessToken = Cookie.get("token");
  const t = useTranslations("StudyGroup")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Classroom created:", {
      studyGroupName,
      courseName,
    });
    const payload = {
      name: studyGroupName,
      course_name: courseName,
    };

    try {
      await createStudyGroup({ data: payload, accessToken }).unwrap(); // Pass both data and accessToken
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
            {t("Create Study Group")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="studyGroupName" className="text-sm font-medium">
              {t("Study Group Name")}
            </label>
            <Input
              id="studyGroupName"
              placeholder="e.g Math"
              value={studyGroupName}
              onChange={(e) => setstudyGroupName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="courseName" className="text-sm font-medium">
              {t("Course Name")}
            </label>
            <Input
              id="courseName"
              placeholder="e.g Math for Grade 3"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Study group"}
          </Button>
          {isError && (
            <p className="text-red-500">{t("Failed to create study group")}</p>
          )}
          {isSuccess && (
            <p className="text-green-500">{t("Study group created successfully")}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
