import React from "react";
import logo from "../../../public/Images/LearnEd.svg";
import classroom from "../../../public/Images/mdi_google-classroom.svg";
import history from "../../../public/Images/history.svg";
import setting from "../../../public/Images/uil_setting.svg";
import logout from "../../../public/Images/logout.svg";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { collapse } from "@/lib/redux/slices/sidebarSlice";

const SidebarRelaxed = () => {
  const dispatch = useDispatch();

  return (
    <div className=" w-1/5 bg-red-200 bottom-0 top-0 absolute">
      <div className="flex cursor-pointer justify-end ">
        <h1
          className="border w-8 h-8 mr-2 mt-2 flex justify-center self-end"
          onClick={() => dispatch(collapse())}
        >
          X
        </h1>
      </div>

      <div className="flex h-32 justify-center mt-2">
        <Image src={logo} className=" w-32 py-4" alt="logo"></Image>
      </div>

      <div className=" flex flex-col ml-16 space-y-4">
        <div className="flex space-x-3">
          <Image className="w-5" src={classroom} alt="class"></Image>
          <h1 className="font-semibold">Class Rooms</h1>
        </div>

        <div className="flex space-x-3">
          <Image className="w-6" src={history} alt=""></Image>
          <h1 className="font-semibold">History</h1>
        </div>
      </div>

      <div className=" flex bottom-8 left-2 absolute flex-col ml-16 space-y-4">
        <div className="flex space-x-3">
          <Image className="w-6" src={setting} alt=""></Image>
          <h1 className="font-semibold">Setting</h1>
        </div>

        <div className="flex space-x-3">
          <Image className="w-6" src={logout} alt=""></Image>
          <h1 className="font-semibold">Sign Out</h1>
        </div>
      </div>
    </div>
  );
};

export default SidebarRelaxed;
