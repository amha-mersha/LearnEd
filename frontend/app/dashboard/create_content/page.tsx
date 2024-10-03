"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Upload, Send, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEnhanceContentMutation, usePostContentMutation } from "@/lib/redux/api/getApi";

const tagOptions = [
  { id: 1, name: "Homework", color: "bg-blue-500" },
  { id: 2, name: "Lecture", color: "bg-green-500" },
  { id: 3, name: "Quiz", color: "bg-yellow-500" },
  { id: 4, name: "Project", color: "bg-purple-500" },
  { id: 5, name: "Reading", color: "bg-red-500" },
];

export default function PostClassroomContent() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [allowProcessing, setAllowProcessing] = useState(false);
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [enhancedAssignmentDescription, setEnhancedAssignmentDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [postContent] = usePostContentMutation();
  const [enhanceContent] = useEnhanceContentMutation();
  const classroomId = "66fd9fdc72e376efe1b34e4f";
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzQXQiOiIyMDI0LTEwLTAzVDAxOjU1OjM5LjgzMTQ3NzQrMDM6MDAiLCJpZCI6IjY2ZmQ5ZmM3NzJlMzc2ZWZlMWIzNGU0ZSIsInJvbGUiOiJ0ZWFjaGVyIiwidG9rZW5UeXBlIjoiYWNjZXNzVG9rZW4ifQ.sMM9xRs6A2yxz6fyLLUzyYJYlTfdaOYnHIlMVl6YdNo";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleElaborateDescription = async () => {
    try {
      const enhancedDescription = await enhanceContent({
        currentState: assignmentDescription, // text from your input field
        accessToken: accessToken,
      }).unwrap();
  
      // Set the response (enhanced description) to your form field or state
      setEnhancedAssignmentDescription(enhancedDescription.message);
    } catch (error) {
      console.error("Error enhancing content", error);
    }
  };
  

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handlePreview = () => {
    console.log("Preview clicked");
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Append fields to the FormData object
    formData.append("content", content);
    formData.append("is_assignment", "true"); // Always true for now
    formData.append("is_processed", allowProcessing.toString());

    // If a file is provided, append it to FormData
    if (file) {
      formData.append("file", file);
    }

    try {
      await postContent({
        classroomId,
        data: formData,
        accessToken,
      }).unwrap();

      console.log("Content posted successfully");
    } catch (error) {
      console.error("Error posting content", error);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white ">
      <div className="container ml-10 p-4 max-w-4xl min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Post Classroom Content
          </h1>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-blue-600">
              Content Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="content-textarea"
                  className="text-lg font-semibold"
                >
                  Content
                </Label>
                <Textarea
                  id="content-textarea"
                  placeholder="Enter your content here"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold">File Upload</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" /> Upload File
                    </Button>
                    <span className="text-sm text-gray-600">
                      {file ? file.name : "No file chosen"}
                    </span>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow-processing"
                    checked={allowProcessing}
                    onCheckedChange={setAllowProcessing}
                  />
                  <Label htmlFor="allow-processing">Allow Processing</Label>
                </div>
                <p className="text-sm text-blue-600">
                  AI will process the file if allowed.
                </p>
              </div>

              <Separator />
              <div>
                <Label className="text-lg font-semibold">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-4">
                  {tagOptions.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={
                        selectedTags.includes(tag.id) ? "default" : "outline"
                      }
                      className={`cursor-pointer ${tag.color} hover:${tag.color} transition-colors`}
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-blue-600">
              Assignment Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter assignment description"
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleElaborateDescription}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Generate Content ✨
              </Button>
              {enhancedAssignmentDescription && (
                <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-700">
                    AI-Enhanced Description:
                  </h3>
                  <p className="text-gray-700">{enhancedAssignmentDescription}</p>
                </div>
              )}
              <Separator />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="mr-2 h-4 w-4" /> Post Content
          </Button>
        </div>
      </div>
    </div>
  );
}
