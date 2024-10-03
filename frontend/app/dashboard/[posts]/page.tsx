"use client";
import Posts from "@/app/components/post/Posts";
import StudentInvite from "@/app/components/StudentInvite";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  console.log('pp', params.posts)
  console.log('tt', localStorage.getItem("token"))

  return (
    <div className="bg-[#F6F6F6] pt-10 min-h-screen ">
      <div className="flex justify-end">
        <Button className="mr-40" onClick={() => setIsModalOpen(true)}>
          Invite Students
        </Button>
        <Link
          className="mr-40"
          href={{
            pathname: `/dashboard/grading`,
            query: { class_id: params.posts },
          }}
        >
          <Button className="mr-40">Upload grades</Button>
        </Link>
      </div>
      <Posts class_id={params.posts} />
      <StudentInvite
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default page;
