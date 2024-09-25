import { ThumbsUp, ThumbsDown, MoreHorizontal, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Avatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea";

export default function Posts() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {[1, 2, 3].map((postIndex) => (
        <div
          key={postIndex}
          className="bg-white rounded-lg shadow-md p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* <Avatar className="w-10 h-10 bg-gray-200" /> */}
              <div>
                <h3 className="font-semibold">Mr. Mehari has posted some notes</h3>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>


          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-sm">Biology chapter 1 & 2.pdf</span>
            <span className="text-xs text-gray-500">45.7kb</span>
          </div>

          {postIndex === 1 && (
            <div className="mt-4 ml-10">
              <Textarea placeholder="Add comment" className="w-full" />
              <div className="flex justify-end mt-2 space-x-2">
                <Button className=" rounded-full px-3 py-0" variant="outline">Cancel</Button>
                <Button className=" rounded-full px-3 py-0">Comment</Button>
              </div>
            </div>
          )}

          {postIndex === 1 && (
            <div className="space-y-4 ml-10">
              {["Bob wozniac", "Markus Rashford"].map((name, index) => (
                <div key={index} className="flex space-x-3">
                  {/* <Avatar className="w-8 h-8 bg-gray-200" /> */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{name}</h4>
                      <p className="text-sm text-gray-500">5 hours ago</p>
                    </div>
                    <p className="text-sm">
                      Do we have to do the questions listed on the documents
                    </p>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
