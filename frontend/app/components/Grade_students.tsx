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

interface Props {
  student: Student;
  parameters: Parameter[];
  updateScore: (studentId: number, param: string, score: number) => void;
  calculateTotal: (scores: { [key: string]: number }) => number;
  toggleEdit: (studentId: number) => void;
  class_id: string | string[];
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
  class_id,
}: Props) => {
  const [postGrades, { isError, isLoading, isSuccess }] =
    usePostGradesMutation();
  console.log("trtrt", student.id);
  const student_id = student.id;
  const handleSubmit = async () => {
    const score: any = [];

    const token = localStorage.getItem("token");
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
    console.log("score", score);

    const res = { grades: score };
    console.log("res", res);
    try {
      const result = await postGrades({
        class_id,
        student_id,
        token,
        data: res,
      }).unwrap();
      console.log("works? ", result);
    } catch (e) {
      console.error("failed", e);
    }
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
