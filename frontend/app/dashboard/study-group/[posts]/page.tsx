"use client";
import Posts from "@/app/components/post/Posts";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useParams } from 'next/navigation';
import StudyStudentInvite from "@/app/components/StudyGroup/StudyStudentInvite";
import SuccessAlert from "@/app/components/core/SuccessAlert";


const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State to track success alert
  const params = useParams();
  const { posts: id } = params;
  const studyGroupId = Array.isArray(id) ? id[0] : id || '';

  const handleInviteSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000); // Hide after 5 seconds
  };

  return (
    <div className="bg-[#F6F6F6] pt-10 min-h-screen ">
      <div className="flex justify-end">
        <Button className="mr-40" onClick={() => setIsModalOpen(true)}>
          Invite Students
        </Button>
      </div>
      
      <Posts />
      
      <StudyStudentInvite
        studyGroupId={studyGroupId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleInviteSuccess} // Pass success handler
      />
      
      {showSuccessMessage && <SuccessAlert message="Student invited successfully!" />} {/* Show success alert */}
    </div>
  );
};

export default Page;
