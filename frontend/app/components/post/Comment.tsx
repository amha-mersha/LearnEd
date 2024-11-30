import { Button } from "@/components/ui/button";
import { useRemoveCommentMutation } from "@/lib/redux/api/getApi";
import { commentType } from "@/types/commentType";
import React from "react";
import Cookie from "js-cookie";
import { useFormatter } from "next-intl";
interface Props {
  info: any;
  post_id: string | string[]
  class_id: string | string[]
}

const Comment = ({ info, post_id, class_id }: Props) => {
  const [deleteComment, { data, isSuccess, isError }] = useRemoveCommentMutation();
  // const token = localStorage.getItem("token")
  const token = Cookie.get("token");
  const format = useFormatter(); 
  const handleDelete = () => {
    deleteComment({
      postId: post_id,
      accessToken: token,
      classroomId: class_id,
      commentId: info.id
    });

  }
  return (
    <div className="space-y-4 hover:bg-[#F6F6F6] rounded-xl p-2 ml-16">
      <div className="flex justify-between">
        <div className="flex space-x-3">
          {/* <Avatar className="w-8 h-8 bg-gray-200" /> */}
          <div className="w-7 h-7 mt-2 bg-blue-900 rounded-full"></div>
          <div className="flex-1">
            <div className="flex justify-start  flex-col">
              <h4 className="font-bold">{info.creator_name}</h4>
              <p className="text-xs text-gray-500">{format.relativeTime(info.created_at)}</p>
            </div>
          </div>
        </div>
        <Button className="w-16 h-10 mt-3 mr-2" onClick={handleDelete} >Delete</Button>
      </div>
      <p className="text-sm ml-10 font-semibold">{info.content}</p>
    </div>
  );
};

export default Comment;
