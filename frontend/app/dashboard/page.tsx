import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Card from "../components/Card";
import { cardinfo } from "@/utils/carddummy";

const page = () => {
  const cards = cardinfo;

  return (
    <div className=" bg-[#F6F6F6] min-h-screen  pr-36 pt-16 pb-10">
      <h1 className="text-3xl font-black ml-24">Classes</h1>
      <div className="  justify-center w-full flex flex-wrap">
        {cards.map((item, ind) => (
          <div key={ind} className="w-5/12 ml-8 mt-6">
            <Card info={cardinfo[ind]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
