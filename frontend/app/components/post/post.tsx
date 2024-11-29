"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText } from "lucide-react";
import { useAddCommentMutation } from "@/lib/redux/api/getApi";
import Comment from "./Comment";
import Link from "next/link";
import Cookie from "js-cookie";
import BASEURL from "../../../app/baseurl";


interface Props {
  info: any;
  class_id: string | string[];
}

const Post = ({ info, class_id }: Props) => {
  const [more, setMore] = useState(false);
  const [comment, setComment] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // State to manage the menu popup
  // const token = localStorage.getItem("token");
  const token = Cookie.get("token");
  const [addComment, { data, isSuccess, isError }] = useAddCommentMutation();

  const handleComment = () => {
    addComment({
      postId: info.data.id,
      data: { content: comment },
      accessToken: token,
      classroomId: class_id,
    });
    setComment("");
  };
  console.info("info", info);
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 mt-1 bg-blue-900 rounded-full"></div>
          <div>
            <h3 className="">
              <span className="font-bold">{info.creator_name}</span> has posted some notes
            </h3>
            <p className="text-xs text-gray-500">{info.data.created_at}</p>
          </div>
        </div>
        {/* Button that toggles the popup menu */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenuOpen((prev) => !prev)} // Toggle the menu
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>

        {/* Pop-up Menu */}
        {menuOpen && (
        <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md p-2 w-40">
          <ul className="space-y-1">
            {info.data.is_processed ? (
              <Link
                href={{ pathname: "/dashboard/quiz", query: { post_id: info.data.id } }}
                onClick={() => setMenuOpen(false)}
              >
                <li className="hover:bg-gray-100 px-2 py-1 cursor-pointer">
                  Generate Quiz
                </li>
              </Link>
            ) : (
              <li className="text-gray-400 px-2 py-1 cursor-not-allowed">
                Generate Quiz (Processing...)
              </li>
            )}

            {/* Generate Summary Option */}
            {info.data.is_processed ? (
              <Link
                href={{ pathname: "/dashboard/flashcard", query: { post_id: info.data.id } }}
                onClick={() => setMenuOpen(false)}
              >
                <li className="hover:bg-gray-100 px-2 py-1 cursor-pointer">
                  Generate Flashcard
                </li>
              </Link>
            ) : (
              <li className="text-gray-400 px-2 py-1 cursor-not-allowed">
                Generate Flashcard (Processing...)
              </li>
            )}
          </ul>
        </div>
      )}

      </div>


      <div className="font-semibold ml-10">{info.data.content}</div>
      {info.data.file && (
        <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
          <FileText className="h-5 w-5" />
          <a href={`${BASEURL}${info.data.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            View Attached File
          </a>
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
              onClick={() => setComment("")}
            >
              Cancel
            </Button>
            <Button
              className=" rounded-full text-xs px-3 py-0"
              onClick={handleComment}
            >
              Comment
            </Button>
          </div>
        </div>
      )}
      {more &&
        info.data.comments.map((item: any, ind: number) => (
          <Comment key={ind} post_id={info.data.id} class_id={class_id} info={item} />
        ))}

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
