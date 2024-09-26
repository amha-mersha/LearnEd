import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Card from "../components/ClassroomCard";
import { cardinfo } from "@/utils/carddummy";
import Link from "next/link";

const page = () => {
  const cards = cardinfo;

  return (
    <div className=" bg-[#F6F6F6] min-h-screen  pr-36 pt-16">
      <h1 className="text-3xl font-black ml-24">Classes</h1>
      <div className="  justify-center w-full flex flex-wrap">
        {cards.map((item, ind) => (
          <Link key={ind} href={`/dashboard/1`} className="w-5/12 ml-8 mt-6">
            <div className="">
              <Card info={cardinfo[ind]} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
