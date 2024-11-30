"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetStudyGroupsQuery } from "@/lib/redux/api/getApi";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { useSelector } from "react-redux";
import StudyGroupCard from "@/app/components/StudyGroup/StudyGroupCard";
import CreateStudyGroupModal from "@/app/components/StudyGroup/StudyGroupPopup";
import Cookie from "js-cookie";
import { useTranslations } from "next-intl";

interface StudyGroup {
  id: string;
  name: string;
  course_name: string;
  students: string[]; // Array of student IDs
}

const StudyGroupPage = () => {
  // const token = localStorage.getItem('token');
  const token = Cookie.get("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("StudyGroup")

  const {
    data: studyGroups = [],
    isLoading,
    error,
    refetch,
  } = useGetStudyGroupsQuery(token); // Fetch study group data

  return (
    <div className="bg-[#F6F6F6] min-h-screen pr-36 pt-16">
      <div className="ml-24 flex justify-between">
        <h1 className="text-3xl font-black">{t("label")}</h1>
        <Button className="mr-16" onClick={() => setIsModalOpen(true)}>
          {t("Create Study Group")}
        </Button>
      </div>
      <div className="justify-center w-full flex flex-wrap">
        {isLoading ? (
          // Render skeletons while loading
          <>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-5/12 ml-8 mt-6">
                <SkeletonCard />
              </div>
            ))}
          </>
        ) : error ? (
          <p>{t("Error fetching study groups")}</p>
        ) : studyGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-64">
            <p className="text-gray-500 text-lg font-medium">
              {t("No study groups joined yet")}
            </p>
          </div>
        ): (
          studyGroups.map((group: StudyGroup) => (
            <Link
              key={group.id}
              href={`/dashboard/study-group/${group.id}`}
              className="w-5/12 ml-8 mt-6"
            >
              <StudyGroupCard
                info={{
                  groupName: group.name,
                  courseName: group.course_name,
                  numMembers: group.students.length.toString(), // Display number of students
                }}
              />
            </Link>
          ))
        )}
      </div>
      <CreateStudyGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refetch={refetch}
      />
    </div>
    
  );
};

// Skeleton component styled like StudyGroupCard
const SkeletonCard = () => {
  return (
    <div className="w-full h-52 p-4 flex flex-col shadow-md justify-between rounded-3xl bg-white">
      <div className="flex justify-between w-full align-middle">
        <div>
          <Skeleton className="w-32 h-8" /> {/* Skeleton for group name */}
          <Skeleton className="w-24 h-5 mt-2" /> {/* Skeleton for course name */}
        </div>
      </div>
      <div className="flex justify-between w-full mt-4">
        <div className="flex justify-center align-middle space-x-2">
          <Skeleton className="w-6 h-6" /> {/* Skeleton for people icon */}
          <Skeleton className="w-16 h-6" /> {/* Skeleton for members count */}
        </div>
      </div>
    </div>
  );
};

export default StudyGroupPage;
