//GradeReportCard.tsx
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import React from "react";

interface GradeReportCardProps {
  classroom: {
    classroom_name: string;
    grades: {
      student_id: string;
      records: { record_name: string; grade: number; max_grade: number }[];
    };
  };
}

const GradeReportCard: React.FC<GradeReportCardProps> = ({ classroom }) => {
  const records = classroom.grades.records;

  const totalGrade =
    (records.reduce((acc, record) => acc + record.grade, 0) /
      records.reduce((acc, record) => acc + record.max_grade, 0)) *
    100;

  return (
    <div className="">
      <Card className="mt-6 mb-6 bg-[#DBEAFE] p-6 pl-0">
        <div className="flex flex-row justify-around mb-3 w-[70%]">
          {/* Course Name */}
          <div className="flex flex-row">
            <p className="text-lg">Teacher:</p>
            <p className="text-lg font-semibold pl-1">
              Prof. Simon D
            </p>
          </div>
          <div className="flex flex-row">
            <p className="text-lg">Class:</p>
            <p className="text-lg font-semibold pl-1">
              {classroom.classroom_name}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="text-lg">Total Students:</p>
            <p className="text-lg font-semibold pl-1">
              34
            </p>
          </div>
        </div>
        <Table className="ml-52 max-w-xl">
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index} className="border-gray-400">
                <TableHead>{record.record_name}</TableHead>
                <TableCell>{`${record.grade}/${record.max_grade}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-row justify-around mt-4">
          <p className="text-lg font-semibold">Total Grade</p>
          <Progress value={totalGrade} className="w-[50%] mt-2" />
          <p>{totalGrade.toFixed(2)}%</p>
        </div>
      </Card>
    </div>
  );
};

export default GradeReportCard;
