import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const grades = [
  {
    quiz: "10/10",
    mid_term: "18/20",
    assignment: "20/20",
    final_exam: "45/50",
  },
];

const GradeReportCard = () => {
  const grade = grades[0]; // Assuming you're displaying for one student, you can directly access the first entry
  const totalGrade = 93; // Assuming you're calculating the total grade
  return (
    <div className="">
      
      <Card className="mt-6 mb-6 bg-[#DBEAFE] p-6 pl-0">
        <div className="flex flex-row justify-around mb-3 w-[70%]">

        {/* Course Name */}
        <div className="flex flex-row">
          <p className="text-lg">Class:</p>
          <p className="text-lg font-semibold pl-1">Physics</p>
        </div>
        {/* Teacher Name */}
        <div className="flex flex-row">
          <p className="text-lg">Teacher Name:</p>
          <p className="text-lg font-semibold pl-1">Pep Guardiola</p>
        </div>
        {/* Total Student */}
        <div className="flex flex-row">
          <p className="text-lg">Total Student:</p>
          <p className="text-lg font-semibold pl-1">30</p>
        </div>
        </div>
        <Table className="ml-52 max-w-xl">
          <TableBody>
            <TableRow className="border-gray-400">
              <TableHead>Quiz</TableHead>
              <TableCell>{grade.quiz}</TableCell>
            </TableRow>
            <TableRow className="border-gray-400">
              <TableHead>Mid Exam</TableHead>
              <TableCell>{grade.mid_term}</TableCell>
            </TableRow>
            <TableRow className="border-gray-400">
              <TableHead>Assignment</TableHead>
              <TableCell>{grade.assignment}</TableCell>
            </TableRow>
            <TableRow className="border-gray-400">
              <TableHead>Final Exam</TableHead>
              <TableCell>{grade.final_exam}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex flex-row justify-around mt-4">
            <p className="text-lg font-semibold">Total Grade</p>
            <Progress value={totalGrade} className="w-[50%] mt-2"/>
            <p>{totalGrade}%</p>
        </div>
        
      </Card>
    </div>
  );
};

export default GradeReportCard;
