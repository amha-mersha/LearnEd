"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText } from "lucide-react";
import { PostType } from "@/types/postType";
import Comment from "./Comment";
import { useAddCommentMutation } from "@/lib/redux/api/getApi";

interface Props {
  info: PostType;
}

const Post = ({ info }: Props) => {
  const [more, setMore] = useState(false);
  const [comment, setComment] = useState("");
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* <Avatar className="w-10 h-10 bg-gray-200" /> */}
          <div className="w-7 h-7 mt-1 bg-blue-900 rounded-full"></div>
          <div>
            <h3 className="">
              <span className="font-bold">{info.name}</span> has posted some
              notes
            </h3>
            <p className="text-xs text-gray-500">{info.createdAt}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {info.file && (
        <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="text-sm">Biology chapter 1 & 2.pdf</span>
          <span className="text-xs text-gray-500">45.7kb</span>
        </div>
      )}
      {!more && (
        <div className="flex justify-end">
          <h1
            onClick={() => setMore(true)}
            className="font-semibold text-sm bg-[#F6F6F6] py-1 px-2 rounded-2xl cursor-pointer"
          >
            Show More
          </h1>
        </div>
      )}
      {more && (
        <div className="mt-4 ml-16">
          <Textarea
            placeholder="Add comment"
            className="w-full"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end mt-2 space-x-2">
            <Button
              className=" rounded-full text-xs px-3 py-0"
              variant="outline"
              onClick={() => setComment('')}
            >
              Cancel
            </Button>
            {/* --------------------- add comment ----------------------*/}
            <Button className=" rounded-full text-xs px-3 py-0" onClick={
              () => {
                const [addComment] = useAddCommentMutation();
                addComment({ postId: info.id, content: comment });
              } 
            }>Comment</Button>
          </div>
        </div>
      )}
      {more &&
        info.comments.map((item, ind) => <Comment key={ind} info={item} />)}

      {more && (
        <div className="flex justify-end">
          <h1
            onClick={() => setMore(false)}
            className="font-semibold text-sm bg-[#F6F6F6] py-1 px-2 rounded-2xl cursor-pointer"
          >
            Show less
          </h1>
        </div>
      )}
    </div>
  );
};

export default Post;
