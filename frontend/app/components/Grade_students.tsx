import React from "react";
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
}

const Grade_students = ({
  student,
  parameters,
  updateScore,
  calculateTotal,
  toggleEdit,
}: Props) => {

    const handleSubmit = async () => {

    }



  return (
    <TableRow key={student.id}>
      <TableCell>{student.name}</TableCell>
      {parameters.map((param) => (
        console.log(param.points),
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
          onClick={() => toggleEdit(student.id)}
          size="sm"
          variant={student.isEditing ? "outline" : "default"}
        >
          {student.isEditing ? (
            <Save className="w-4 h-4" />
          ) : (
            <Edit className="w-4 h-4" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Grade_students;
