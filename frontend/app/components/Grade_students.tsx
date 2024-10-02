import React from "react";
import { usePostGradesMutation } from "@/lib/redux/api/getApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { Parameter, Student, studentsData } from "@/utils/grades";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";

interface Props {
  student: Student;
  parameters: Parameter[];
  updateScore: (studentId: number, param: string, score: number) => void;
  calculateTotal: (scores: { [key: string]: number }) => number;
  toggleEdit: (studentId: number) => void;
}
interface scores {
  record_name: string;
  grade: string;
  max_grade: string;
}

const Grade_students = ({
  student,
  parameters,
  updateScore,
  calculateTotal,
  toggleEdit,
}: Props) => {
  const [postGrades, { isError, isLoading, isSuccess }] =
    usePostGradesMutation();
  let tok = useSelector((state: any) => state.token.accessToken);
  const token = tok.payload;

  const handleSubmit = async () => {
    const score: any = [];
    const class_id = "66fc5f1764ea1026d3b5813d";
    const student_id = "66fba6d880e72f71b4a21f9b";
    // const temp_token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzQXQiOiIyMDI0LTEwLTAzVDA2OjE2OjA0Ljk2ODA1NjQrMDM6MDAiLCJpZCI6IjY2ZmM1ZWNhNjRlYTEwMjZkM2I1ODEzYyIsInJvbGUiOiJ0ZWFjaGVyIiwidG9rZW5UeXBlIjoiYWNjZXNzVG9rZW4ifQ.-3KCqqCqzBtUvfhSUEbsOoAZKX9GYcT8k9riuw9gA2s";
    const token = localStorage.getItem('token');
    for (let param in student.scores) {
      for (let an_param in parameters) {
        if (param === parameters[an_param].name) {
          score.push({
            record_name: param,
            grade: student.scores[param],
            max_grade: parameters[an_param].points,
          });
        }
      }
    }
    const res = { grades: score };
    const result = await postGrades({
      data: res,
      token: token,
      class_id: class_id,
      student_id: student_id,
    });
    const { data } = result;
    console.log("works? ", data);
  };

  return (
    <TableRow key={student.id}>
      <TableCell>{student.name}</TableCell>
      {parameters.map((param) => (
        <TableCell key={param.name}>
          {student.isEditing ? (
            <Input
              type="number"
              value={student.scores[param.name] || 0}
              onChange={(e) =>
                updateScore(student.id, param.name, Number(e.target.value))
              }
              className="w-20"
              aria-label={`${student.name}'s ${param.name} score`}
              min={0}
              max={param.points}
            />
          ) : (
            <span>{student.scores[param.name] || 0}</span>
          )}
        </TableCell>
      ))}
      <TableCell>{calculateTotal(student.scores)}</TableCell>
      <TableCell>
        <Button
          onClick={() => {
            if (student.isEditing) {
              handleSubmit();
            }
            toggleEdit(student.id);
          }}
          size="sm"
          variant={student.isEditing ? "outline" : "default"}
        >
          {student.isEditing ? (
            <button className="w-6 h-4 pr-10 font-bold">Submit</button>
          ) : (
            <Edit className="w-4 h-4" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Grade_students;
