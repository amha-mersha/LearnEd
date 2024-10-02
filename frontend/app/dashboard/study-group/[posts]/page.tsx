"use client";
import Posts from "@/app/components/post/Posts";
import StudentInvite from "@/app/components/StudentInvite";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useParams } from 'next/navigation';
import StudyStudentInvite from "@/app/components/StudyGroup/StudyStudentInvite";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const { posts: id } = params;

  // Ensure `id` is a string, handle the case where `id` might be an array or undefined
  const studyGroupId = Array.isArray(id) ? id[0] : id || '';

  return (
    <div className="bg-[#F6F6F6] pt-10 min-h-screen ">
      <div className="flex justify-end">
        <Button className="mr-40" onClick={() => setIsModalOpen(true)}>
          Invite Students
        </Button>
      </div>
      <Posts />
      <StudyStudentInvite
        studyGroupId={studyGroupId}  // Now `studyGroupId` is always a string
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Page;
