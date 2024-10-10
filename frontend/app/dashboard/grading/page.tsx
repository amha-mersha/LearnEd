"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllStudentsQuery } from "@/lib/redux/api/getApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Parameter, Student, studentsData } from "@/utils/grades";
import Grade_students from "@/app/components/Grade_students";
import Cookie from "js-cookie";

export default function GradingPage({ searchParams }: { searchParams: any }) {
  let studs: any = [];
  const [newParameter, setNewParameter] = useState("");
  const [newPoints, setNewPoints] = useState("");
  const [students, setStudents] = useState<Student[]>(studs);
  const [incomingCopy, setIncomingCopy] = useState<any>([]);
  // const temp_id_classroom = "66fc5f1764ea1026d3b5813d";

  // const token = localStorage.getItem("token");
  const token = Cookie.get("token");

  const { data, isLoading, isError, isSuccess } = useGetAllStudentsQuery({
    id: searchParams.class_id,
    token: token,
  });
  const [parameters, setParameters] = useState<Parameter[]>([]);

  let incoming = data;

  useEffect(() => {
    const updatedIncoming = incoming?.map((stu: any) => ({
      ...stu,
      isEditing: stu.isEditing ?? false,
    }));
    setIncomingCopy(updatedIncoming);
  }, [incoming]);

  useEffect(() => {
    if (incomingCopy) {
      const initialParameters = incomingCopy[0]?.data?.records.map(
        (record: any) => ({
          name: record.record_name,
          points: record.max_grade,
        })
      );
      setParameters(initialParameters);
    }
  }, [incomingCopy]);

  useEffect(() => {
    let temp: any = {};
    for (let tp in incomingCopy) {
      temp["id"] = incomingCopy[tp]?.data?.student_id;
      temp["name"] = incomingCopy[tp]?.name;
      let scrs: any = {};
      for (let lp in incomingCopy[tp]?.data?.records) {
        scrs[incomingCopy[tp]?.data?.records[lp].record_name] =
          incomingCopy[tp]?.data?.records[lp].grade;
      }
      temp["scores"] = scrs;
      studs.push(temp);
      temp = {};
    }
    setStudents(studs);
  }, [incomingCopy]);

  const addParameter = () => {
    if (
      newParameter &&
      newPoints &&
      !parameters.some((p) => p.name === newParameter)
    ) {
      const points = parseInt(newPoints);
      setParameters([...parameters, { name: newParameter, points }]);
      setNewParameter("");
      setNewPoints("");
      setStudents(
        students.map((student) => ({
          ...student,
          scores: { ...student.scores, [newParameter]: 0 },
        }))
      );
    }
  };

  const updateScore = (studentId: number, param: string, score: number) => {
    const maxPoints = parameters.find((p) => p.name === param)?.points || 0;
    const clampedScore = Math.min(Math.max(score, 0), maxPoints);
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? {
              ...student,
              scores: { ...student.scores, [param]: clampedScore },
            }
          : student
      )
    );
  };

  const calculateTotal = (scores: { [key: string]: number }) =>
    Object.entries(scores).reduce((sum, [param, score]) => {
      const maxPoints = parameters.find((p) => p.name === param)?.points || 0;
      return sum + Math.min(score, maxPoints);
    }, 0);

  const calculateMaxTotal = () =>
    parameters?.reduce((sum, param) => sum + param.points, 0);

  const toggleEdit = (studentId: number) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? { ...student, isEditing: !student.isEditing }
          : student
      )
    );
  };

  if (isSuccess) {
    return (
      <div className="w-[75vw] mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Grading Parameters</h1>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New Parameter e.g. Project, Quiz"
            value={newParameter}
            onChange={(e) => setNewParameter(e.target.value)}
            className="flex-grow"
            aria-label="New grading parameter"
          />
          <Input
            type="number"
            placeholder="Points"
            value={newPoints}
            onChange={(e) => setNewPoints(e.target.value)}
            className="w-24"
            aria-label="Maximum points for new parameter"
          />
          <Button onClick={addParameter}>Add</Button>
        </div>

        <div className="flex gap-2 mb-4">
          {parameters?.map((param) => (
            <span
              key={param.name}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {param.name}: {param.points}
            </span>
          ))}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {parameters?.map((param) => (
                <TableHead key={param.name}>
                  {param.name}({param.points})
                </TableHead>
              ))}
              <TableHead>Total({calculateMaxTotal()})</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student: any, ind: any) => (
              <Grade_students
                key={ind}
                student={student}
                parameters={parameters}
                calculateTotal={calculateTotal}
                toggleEdit={toggleEdit}
                updateScore={updateScore}
                class_id={searchParams.class_id}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
