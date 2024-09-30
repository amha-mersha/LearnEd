"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Card from "../components/ClassroomCard";
import { cardinfo } from "@/utils/carddummy";
import Link from "next/link";
import CreateClassroomModal from "../components/ClassroomPopup";
import { Button } from "@/components/ui/button";

const page = () => {
  const cards = cardinfo;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className=" bg-[#F6F6F6] min-h-screen  pr-36 pt-16">
      <div className="ml-24 flex justify-between">
        <h1 className="text-3xl font-black ">Classes</h1>
        <Button className="mr-16" onClick={() => setIsModalOpen(true)}>Create Class</Button>
      </div>
      <div className="  justify-center w-full flex flex-wrap">
        {cards.map((item, ind) => (
          <Link key={ind} href={`/dashboard/1`} className="w-5/12 ml-8 mt-6">
            <div className="">
              <Card info={cardinfo[ind]} />
            </div>
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

export default page;
