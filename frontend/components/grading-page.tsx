"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X } from 'lucide-react'

interface Student {
  id: number
  name: string
  scores: { [key: string]: number }
}

export function GradingPageComponent() {
  const [parameters, setParameters] = useState<string[]>(["Mid Exam", "Final Exam"])
  const [newParameter, setNewParameter] = useState("")
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "William Donds", scores: { "Mid Exam": 45, "Final Exam": 45 } },
    { id: 2, name: "Alan Becker", scores: { "Mid Exam": 45, "Final Exam": 45 } },
    { id: 3, name: "Emma Thompson", scores: { "Mid Exam": 42, "Final Exam": 48 } },
    { id: 4, name: "Michael Chen", scores: { "Mid Exam": 47, "Final Exam": 43 } },
    { id: 5, name: "Sophia Rodriguez", scores: { "Mid Exam": 44, "Final Exam": 46 } },
    { id: 6, name: "Liam O'Connor", scores: { "Mid Exam": 46, "Final Exam": 44 } },
    { id: 7, name: "Zoe Nakamura", scores: { "Mid Exam": 43, "Final Exam": 47 } },
    { id: 8, name: "Hassan Al-Farsi", scores: { "Mid Exam": 48, "Final Exam": 42 } },
  ])

  const addParameter = () => {
    if (newParameter && !parameters.includes(newParameter)) {
      setParameters([...parameters, newParameter])
      setNewParameter("")
      setStudents(students.map(student => ({
        ...student,
        scores: { ...student.scores, [newParameter]: 0 }
      })))
    }
  }

  const removeParameter = (param: string) => {
    setParameters(parameters.filter(p => p !== param))
    setStudents(students.map(student => {
      const { [param]: _, ...rest } = student.scores
      return { ...student, scores: rest }
    }))
  }

  const updateScore = (studentId: number, param: string, score: number) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, scores: { ...student.scores, [param]: score } }
        : student
    ))
  }

  const calculateTotal = (scores: { [key: string]: number }) => 
    Object.values(scores).reduce((sum, score) => sum + score, 0)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Grading Parameters</h1>
      
      <div className="flex gap-2 mb-4">
        <Input 
          placeholder="New Parameter e.g. Project, Quiz" 
          value={newParameter}
          onChange={(e) => setNewParameter(e.target.value)}
          className="flex-grow"
          aria-label="New grading parameter"
        />
        <Button onClick={addParameter}>Add</Button>
      </div>

      <div className="flex gap-2 mb-4">
        {parameters.map(param => (
          <span key={param} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
            {param}
            <button
              onClick={() => removeParameter(param)}
              className="ml-1 p-1"
              aria-label={`Remove ${param} parameter`}
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {parameters.map(param => (
              <TableHead key={param}>{param}</TableHead>
            ))}
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(student => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              {parameters.map(param => (
                <TableCell key={param}>
                  <Input 
                    type="number"
                    value={student.scores[param] || 0}
                    onChange={(e) => updateScore(student.id, param, Number(e.target.value))}
                    className="w-20"
                    aria-label={`${student.name}'s ${param} score`}
                  />
                </TableCell>
              ))}
              <TableCell>{calculateTotal(student.scores)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}