"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  Eye,
  Send,
  Calendar as CalendarIcon,
  Link,
  FileText,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const tagOptions = [
  { id: 1, name: "Homework", color: "bg-blue-500" },
  { id: 2, name: "Lecture", color: "bg-green-500" },
  { id: 3, name: "Quiz", color: "bg-yellow-500" },
  { id: 4, name: "Project", color: "bg-purple-500" },
  { id: 5, name: "Reading", color: "bg-red-500" },
];

export default function PostClassroomContent() {
  const [contentType, setContentType] = useState("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [generateSummary, setGenerateSummary] = useState(false);
  const [generateQuiz, setGenerateQuiz] = useState(false);
  const [generateFlashCard, setGenerateFlashCard] = useState(false);
  const [description, setDescription] = useState("");
  const [elaboratedDescription, setElaboratedDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [dueDate, setDueDate] = useState<Date>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleElaborateDescription = () => {
    setElaboratedDescription(`Elaborated: ${description}`);
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

  const handleSubmit = () => {
    console.log("Submit clicked");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-gradient-to-b from-blue-50 to-white min-h-screen">
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
              <Label htmlFor="title" className="text-lg font-semibold">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-lg font-semibold">Content Type</Label>
              <RadioGroup
                value={contentType}
                onValueChange={setContentType}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="link" id="link" />
                  <Label htmlFor="link" className="flex items-center">
                    <Link className="mr-2 h-4 w-4" /> Link
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" /> Text
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file" />
                  <Label htmlFor="file" className="flex items-center">
                    <File className="mr-2 h-4 w-4" /> File
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {contentType === "link" && (
              <div>
                <Label htmlFor="link-input" className="text-lg font-semibold">
                  URL
                </Label>
                <Input
                  id="link-input"
                  type="url"
                  placeholder="Paste URL here"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            {contentType === "text" && (
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
                  rows={6}
                />
              </div>
            )}

            {contentType === "file" && (
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
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="generate-summary"
                      checked={generateSummary}
                      onCheckedChange={setGenerateSummary}
                    />
                    <Label htmlFor="generate-summary">Generate Summary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="generate-quiz"
                      checked={generateQuiz}
                      onCheckedChange={setGenerateQuiz}
                    />
                    <Label htmlFor="generate-quiz">Generate Quiz</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="generate-flashcard"
                      checked={generateFlashCard}
                      onCheckedChange={setGenerateFlashCard}
                    />
                    <Label htmlFor="generate-FlashCard">
                      Generate FlashCard
                    </Label>
                  </div>
                </div>
                <p className="text-sm text-blue-600">
                  AI will process the file to generate a summary and/or quiz
                  based on the content.
                </p>
              </div>
            )}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <Button
              onClick={handleElaborateDescription}
              className="bg-[#7C67FF] hover:bg-[#9483FF] text-white"
            >
              Generate Content ✨
            </Button>
            {elaboratedDescription && (
              <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-700">
                  AI-Enhanced Description:
                </h3>
                <p className="text-gray-700">{elaboratedDescription}</p>
              </div>
            )}
            <Separator />

            <div>
              <Label htmlFor="due-date" className="text-lg font-semibold">
                Due Date
              </Label>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? (
                        format(dueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
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
  );
}
