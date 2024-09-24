import React from "react";
import logo from "../../../public/Images/LearnEd.svg";
import classroom from "../../../public/Images/mdi_google-classroom.svg";
import history from "../../../public/Images/history.svg";
import setting from "../../../public/Images/uil_setting.svg";
import hamburger from "../../../public/Images/solar_hamburger-menu-broken.svg"
import logout from "../../../public/Images/logout.svg";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { collapse } from "@/lib/redux/slices/sidebarSlice";

const SidebarRelaxed = () => {
  const dispatch = useDispatch();

  return (
    <div className=" w-1/5 bg-white bottom-0 top-0 absolute">
      <div className="flex cursor-pointer justify-start pl-10 pt-2 ">
        <Image
          className="border w-6 h-6 mr-2 mt-6 flex"
          onClick={() => dispatch(collapse())}
          src={hamburger}
          alt=""
        ></Image>
      </div>

      <div className="flex h-28 justify-center mt-1">
        <Image src={logo} className=" w-32 py-4" alt="logo"></Image>
      </div>

      <div className=" flex flex-col ml-16 space-y-4">
        <div className="flex space-x-3">
          <Image className="w-6" src={classroom} alt="class"></Image>
          <h1 className="font-semibold">Class Rooms</h1>
        </div>

        <div className="flex space-x-3">
          <Image className="w-7" src={history} alt=""></Image>
          <h1 className="font-semibold">History</h1>
        </div>
      </div>

      <div className=" flex bottom-8 left-2 absolute flex-col ml-16 space-y-4">
        <div className="flex space-x-3">
          <Image className="w-7" src={setting} alt=""></Image>
          <h1 className="font-semibold">Setting</h1>
        </div>

        <div className="flex space-x-3">
          <Image className="w-7" src={logout} alt=""></Image>
          <h1 className="font-semibold">Sign Out</h1>
        </div>
      </div>
    </div>
  );
};

export default SidebarRelaxed;
