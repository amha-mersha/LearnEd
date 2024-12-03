"use client";
import SuccessAlert from "@/app/components/core/SuccessAlert";
import Posts from "@/app/components/post/Posts";
import StudentInvite from "@/app/components/StudentInvite";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useTranslations } from "next-intl";
import { ActionDropdown } from "@/app/components/dropdown-menu";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State to track success alert
  const params = useParams();
  const { posts: id } = params;
  const classroomId = Array.isArray(id) ? id[0] : id || "";

  const [role, setRole] = useState<string | undefined>(undefined);
  const t = useTranslations("DashboardPosts");

  // Retrieve role and token from localStorage
  useEffect(() => {
    // const storedRole = localStorage.getItem("role");
    const storedRole = Cookie.get("role");
    setRole(storedRole);
  }, []);

  const handleInviteSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000); // Hide after 5 seconds
  };

  return (
    <div className="bg-[#F6F6F6] pt-10 min-h-screen ">
      {role !== "student" && (
        <div className="flex justify-end mr-40">
          <ActionDropdown
            t={t}
            setIsModalOpen={setIsModalOpen}
            params={params}
          />
        </div>
      )}
      <Posts class_id={params.posts} />
      <StudentInvite
        classroomId={classroomId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleInviteSuccess}
      />
      {showSuccessMessage && (
        <SuccessAlert message="Student invited successfully!" />
      )}{" "}
      {/* Show success alert */}
    </div>
  );
};

export default Page;
