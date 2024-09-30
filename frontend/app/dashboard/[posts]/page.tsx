"use client";
import Posts from "@/app/components/post/Posts";
import StudentInvite from "@/app/components/StudentInvite";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-[#F6F6F6] pt-10 min-h-screen ">
      <div className="flex justify-end">
        <Button className="mr-40" onClick={() => setIsModalOpen(true)}>
          Invite Students
        </Button>
      </div>
      <Posts />
      <StudentInvite
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default page;
