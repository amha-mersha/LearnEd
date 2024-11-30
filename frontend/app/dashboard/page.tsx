"use client";
import React, { useEffect, useState } from "react";
import Card from "../components/ClassroomCard";
import Link from "next/link";
import CreateClassroomModal from "../components/ClassroomPopup";
import { Button } from "@/components/ui/button";
import { useGetClassroomsQuery } from "@/lib/redux/api/getApi";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import Cookie from "js-cookie";
import {useTranslations} from 'next-intl';

interface Classroom {
  id: string;
  name: string;
  course_name: string;
  season: string;
  teachers: string[]; // Array of teacher IDs
  students: string[]; // Array of student IDs
}

const Page = () => {
  // const token = localStorage.getItem('token');
  const token = Cookie.get("token"); // Retrieve token from cookie
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState<string | undefined>(undefined);
  const t = useTranslations('Home');
  const td = useTranslations("DashboardCore")

  // Retrieve role and token from localStorage
  useEffect(() => {
    // const storedRole = localStorage.getItem("role");
    const storedRole = Cookie.get("role");
    setRole(storedRole);
  }, []);
  const {
    data: classrooms = [],
    isLoading,
    error,
    refetch,
  } = useGetClassroomsQuery(
    token
  ); // Fetch classrooms data
  
  return (
    <div className=" bg-[#F6F6F6] min-h-screen w-full pr-36 pt-10">
      <div className="ml-24 flex justify-between">
        <h1 className="text-3xl font-black">{t('title')}</h1>
        {role !== "student" && ( // Conditionally render the button if the role is not 'student'
          <Button className="mr-16" onClick={() => setIsModalOpen(true)}>
            {td("Create Class")}
          </Button>
        )}

      </div>
      <div className="justify-center w-full flex flex-wrap">
        {isLoading ? (
          // Render skeletons when loading
          <>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-5/12 ml-8 mt-6">
                <SkeletonCard />
              </div>
            ))}
          </>
        ) : error ? (
          <p>{td("Error fetching classrooms")}</p>
        ) : classrooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-64">
            <p className="text-gray-500 text-lg font-medium">
              {td("No classrooms joined yet")}
            </p>
          </div>
        ): (
          classrooms.map((classroom: Classroom) => (
            <Link
              key={classroom.id}
              href={`/dashboard/${classroom.id}`}
              className="w-5/12 ml-8 mt-6"
            >
              <Card
                info={{
                  className: classroom.name,
                  courseName: classroom.course_name,
                  season: classroom.season,
                  teacher: classroom.teachers[0], // Display first teacher ID
                  numStudents: classroom.students.length.toString(), // Display number of students
                }}
              />
            </Link>
          ))
        )}
      </div>
      <CreateClassroomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refetch={refetch}
      />
    </div>
  );
};

// Skeleton component styled like ClassroomCard
const SkeletonCard = () => {
  return (
    <div className="w-full h-52 p-4 flex flex-col shadow-md justify-between rounded-3xl bg-white">
      <div className="flex justify-between w-full align-middle">
        <div>
          <Skeleton className="w-32 h-8" /> {/* Skeleton for class name */}
          <Skeleton className="w-24 h-5 mt-2" />{" "}
          {/* Skeleton for course name */}
        </div>
        <Skeleton className="w-16 h-5 mt-2" /> {/* Skeleton for season */}
      </div>
      <div className="flex justify-between w-full mt-4">
        <div className="flex justify-center align-middle space-x-2">
          <Skeleton className="w-5 h-5" /> {/* Skeleton for book icon */}
          <Skeleton className="w-20 h-6" /> {/* Skeleton for teacher name */}
        </div>
        <div className="flex justify-center align-middle space-x-2">
          <Skeleton className="w-6 h-6" /> {/* Skeleton for people icon */}
          <Skeleton className="w-16 h-6" /> {/* Skeleton for students count */}
        </div>
      </div>
    </div>
  );
};

export default Page;
