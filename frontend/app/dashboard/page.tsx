"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Card from "../components/ClassroomCard";
import Link from "next/link";
import CreateClassroomModal from "../components/ClassroomPopup";
import { Button } from "@/components/ui/button";
import { useGetClassroomsQuery } from "@/lib/redux/api/getApi";

interface Classroom {
  id: string;
  name: string;
  course_name: string;
  season: string;
  teachers: string[]; // Array of teacher IDs
  students: string[]; // Array of student IDs
}

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: classrooms = [], isLoading, error } = useGetClassroomsQuery(
    "your-access-token-here"
  ); // Fetch classrooms data
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching classrooms</p>;

  return (
    <div className=" bg-[#F6F6F6] min-h-screen  pr-36 pt-16">
      <div className="ml-24 flex justify-between">
        <h1 className="text-3xl font-black ">Classes</h1>
        <Button className="mr-16" onClick={() => setIsModalOpen(true)}>
          Create Class
        </Button>
      </div>
      <div className="justify-center w-full flex flex-wrap">
        {classrooms.map((classroom: Classroom) => (
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
        ))}
      </div>
      <CreateClassroomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Page;
