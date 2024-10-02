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
// import { getSession } from "next-auth/react";

interface Props {
  student: Student;
  parameters: Parameter[];
  updateScore: (studentId: number, param: string, score: number) => void;
  calculateTotal: (scores: { [key: string]: number }) => number;
  toggleEdit: (studentId: number) => void;
}
interface scores {
  record_name: string,
  grade: string,
  max_grade: string
}

const Grade_students = ({
  student,
  parameters,
  updateScore,
  calculateTotal,
  toggleEdit,
}: Props) => {
  const [postGrades, { isError, isLoading, isSuccess }] = usePostGradesMutation();
  let tok = useSelector((state: any) => state.token.accessToken);
  const token = tok.payload

  
  const handleSubmit = async () => {
    // const session = await getSession();
    const score:any = []
    for (let param in student.scores) {
      for (let an_param in parameters){
        if (param === parameters[an_param].name){
          score.push({
            "record_name": param,
            "grade": student.scores[param],
            "max_grade": parameters[an_param].points.toString()
          })
        }
      }
    }
    if (token){
      const res = {"grades": score}
      const result = await postGrades({data: res, token: token})
      const { data } = result;
    }
  };

  return (
    <TableRow key={student.id}>
      <TableCell>{student.name}</TableCell>
      {parameters.map(
        (param) => (
          (
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
          )
        )
      )}
      <TableCell>{calculateTotal(student.scores)}</TableCell>
      <TableCell>
        <Button
          onClick={() => {
            toggleEdit(student.id)
            handleSubmit()
          }}
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
