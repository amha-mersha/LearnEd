"use client";
import Posts from "@/app/components/post/Posts";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useParams } from 'next/navigation';
import StudyStudentInvite from "@/app/components/StudyGroup/StudyStudentInvite";
import SuccessAlert from "@/app/components/core/SuccessAlert";
import { useTranslations } from "next-intl";
import { studyPostType } from "@/types/studyPostType";
import StudyPosts from "@/app/components/studyGroupPost/studyPosts";
import StudyGroupChat from "@/components/ui/study-group-chat";
interface searchParamsType {
  post: string
}


const Page = ({searchParams}: {searchParams: searchParamsType}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State to track success alert
  const params = useParams();
  const posts = JSON.parse(searchParams.post)
  console.log(typeof posts, posts)
  const t = useTranslations("StudyGroup")

  const handleInviteSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000); // Hide after 5 seconds
  };

  return (
    <div className="bg-[#F6F6F6] pt-10 min-h-screen ">
      <div className="flex justify-end">
        <Button className="mr-40" onClick={() => setIsModalOpen(true)}>
          {t("Invite Students")}
        </Button>
      </div>
      
      <StudyPosts posts={posts} studygroup_id={params.posts}/>
      
      <StudyStudentInvite
        studyGroupId={params.posts}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleInviteSuccess} // Pass success handler
      />
      
      {showSuccessMessage && <SuccessAlert message="Student invited successfully!" />} {/* Show success alert */}
      <StudyGroupChat />
    </div>
  );
};

export default Page;
