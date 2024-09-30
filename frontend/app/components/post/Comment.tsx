import { commentType } from "@/types/commentType";
import React from "react";
interface Props {
  info: commentType;
}

const Comment = ({ info }: Props) => {
  return (
    <div className="space-y-4 hover:bg-[#F6F6F6] rounded-xl p-2 ml-16">
      <div className="flex space-x-3">
        {/* <Avatar className="w-8 h-8 bg-gray-200" /> */}
        <div className="w-7 h-7 mt-2 bg-blue-900 rounded-full"></div>
        <div className="flex-1">
          <div className="flex justify-start  flex-col">
            <h4 className="font-bold">{info.name}</h4>
            <p className="text-xs text-gray-500">{info.createdAt}</p>
          </div>
        </div>
      </div>
      <p className="text-sm font-semibold">{info.content}</p>
    </div>
  );
};

export default Comment;
