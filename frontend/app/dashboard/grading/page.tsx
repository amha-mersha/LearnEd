"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Save } from 'lucide-react'
import { Parameter, Student, studentsData } from '@/utils/grades'
import Grade_students from '@/app/components/Grade_students'

export default function GradingPage() {
  const [parameters, setParameters] = useState<Parameter[]>([
    { name: "Mid Exam", points: 50 },
    { name: "Final Exam", points: 50 }
  ])
  const [newParameter, setNewParameter] = useState("")
  const [newPoints, setNewPoints] = useState("")
  const [students, setStudents] = useState<Student[]>(studentsData)

  const addParameter = () => {
    if (newParameter && newPoints && !parameters.some(p => p.name === newParameter)) {
      const points = parseInt(newPoints)
      setParameters([...parameters, { name: newParameter, points }])
      setNewParameter("")
      setNewPoints("")
      setStudents(students.map(student => ({
        ...student,
        scores: { ...student.scores, [newParameter]: 0 }
      })))
    }
  }

  const updateScore = (studentId: number, param: string, score: number) => {
    const maxPoints = parameters.find(p => p.name === param)?.points || 0
    const clampedScore = Math.min(Math.max(score, 0), maxPoints)
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, scores: { ...student.scores, [param]: clampedScore } }
        : student
    ))
  }

  const calculateTotal = (scores: { [key: string]: number }) => 
    Object.entries(scores).reduce((sum, [param, score]) => {
      const maxPoints = parameters.find(p => p.name === param)?.points || 0
      return sum + Math.min(score, maxPoints)
    }, 0)

  const calculateMaxTotal = () => 
    parameters.reduce((sum, param) => sum + param.points, 0)

  const handleSubmit = () => {
    // Send grades to the server
    console.log('Submitting grades:', students)
    alert('Grades submitted successfully!')
  }

  const toggleEdit = (studentId: number) => {
    setStudents(students.map(student =>
      student.id === studentId ? { ...student, isEditing: !student.isEditing } : student
    ))
  }
  console.log(students)

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
        {parameters.map(param => (
          <span key={param.name} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {param.name}: {param.points}
          </span>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {parameters.map(param => (
              <TableHead key={param.name}>{param.name}({param.points})</TableHead>
            ))}
            <TableHead>Total({calculateMaxTotal()})</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, ind) => (
            <Grade_students key={ind} student={student} parameters={parameters} calculateTotal={calculateTotal} toggleEdit={toggleEdit} updateScore={updateScore} />
          ))}
        </TableBody>
      </Table>

      {/* <div className="mt-4 flex justify-end">
        <Button onClick={handleSubmit} className="px-6 py-2">
          Submit Grades
        </Button>
      </div> */}
    </div>
  )
}