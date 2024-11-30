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
import SuccessAlert from "@/app/components/core/SuccessAlert";
import ErrorAlert from "@/app/components/core/ErrorAlert";
import Cookie from "js-cookie";
import { useTranslations } from "next-intl";


const tagOptions = [
  { id: 1, name: "Homework", color: "bg-blue-500" },
  { id: 2, name: "Lecture", color: "bg-green-500" },
  { id: 3, name: "Quiz", color: "bg-yellow-500" },
  { id: 4, name: "Project", color: "bg-purple-500" },
  { id: 5, name: "Reading", color: "bg-red-500" },
];

export default function PostClassroomContent({ searchParams }: { searchParams: any }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [allowProcessing, setAllowProcessing] = useState(false);
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [enhancedAssignmentDescription, setEnhancedAssignmentDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const [postContent] = usePostContentMutation();
  const [enhanceContent] = useEnhanceContentMutation();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);  // Success message state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);      // Error message state
  const t = useTranslations("CreateContent")

  // const accessToken = localStorage.getItem("token");
  const accessToken = Cookie.get("token");
  const classroomId = searchParams.class_id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleElaborateDescription = async () => {
    try {
      const enhancedDescription = await enhanceContent({
        currentState: assignmentDescription,
        accessToken: accessToken,
      }).unwrap();

      setEnhancedAssignmentDescription(enhancedDescription.message);
      setSuccessMessage("Assignment description enhanced successfully!"); // Trigger success alert
    } catch (error) {
      console.error("Error enhancing content", error);
      setErrorMessage("Failed to enhance assignment description.");        // Trigger error alert
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
    formData.append("content", content);
    formData.append("is_assignment", "true");
    formData.append("is_processed", allowProcessing.toString());

    if (file) {
      formData.append("file", file);
    }

    try {
      await postContent({
        classroomId,
        data: formData,
        accessToken,
      }).unwrap();

      setSuccessMessage("Content posted successfully!");  // Trigger success alert
    } catch (error) {
      console.error("Error posting content", error);
      setErrorMessage("Failed to post content.");         // Trigger error alert
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white">
      <div className="container ml-10 p-4 max-w-4xl min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">{t("Post Classroom Content")}</h1>
        </header>

        {/* Show Success Alert */}
        {successMessage && <SuccessAlert message={successMessage} />}
        {/* Show Error Alert */}
        {errorMessage && <ErrorAlert message={errorMessage} />}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-blue-600">{t("Content Details")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="content-textarea" className="text-lg font-semibold">{t("Content")}</Label>
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
                  <Label className="text-lg font-semibold">{t("File Upload")}</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> {t("Upload File")}
                    </Button>
                    <span className="text-sm text-gray-600">
                      {file ? file.name : "No file chosen"}
                    </span>
                  </div>
                  <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow-processing"
                    checked={allowProcessing}
                    onCheckedChange={setAllowProcessing}
                  />
                  <Label htmlFor="allow-processing">{t("Allow Processing")}</Label>
                </div>
                <p className="text-sm text-blue-600">{t("AI will process the file if allowed")}</p>
              </div>

              <Separator />
              <div>
                <Label className="text-lg font-semibold">{t("Tags")}</Label>
                <div className="flex flex-wrap gap-2 mt-4">
                  {tagOptions.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
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
            <CardTitle className="text-xl text-blue-600">{t("Assignment Description")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter assignment description"
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
                rows={4}
              />
              <Button onClick={handleElaborateDescription} className="bg-blue-600 hover:bg-blue-700 text-white">
                {t("Generate Content")} ✨
              </Button>
              {enhancedAssignmentDescription && (
                <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-700">{t("AI-Enhanced Description")}:</h3>
                  <p className="text-gray-700">{enhancedAssignmentDescription}</p>
                </div>
              )}
              <Separator />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" /> {t("Preview")}
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Send className="mr-2 h-4 w-4" /> {t("Post Content")}
          </Button>
        </div>
      </div>
    </div>
  );
}
