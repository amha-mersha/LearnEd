"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: string
  explanation: string
}

const questions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    explanation: "Paris is the capital and most populous city of France, known for its iconic landmarks like the Eiffel Tower and the Louvre Museum."
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    explanation: "Mars is often called the Red Planet due to its reddish appearance in the night sky, caused by iron oxide (rust) on its surface."
  },
  {
    id: 3,
    text: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
    explanation: "The Mona Lisa was painted by the Italian Renaissance artist Leonardo da Vinci between 1503 and 1506. It's one of the most famous paintings in the world."
  }
]

export function QuizComponent() {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [openExplanations, setOpenExplanations] = useState<{ [key: number]: boolean }>({})

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const toggleExplanation = (questionId: number) => {
    setOpenExplanations((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const isCorrect = (question: Question) => userAnswers[question.id] === question.correctAnswer

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <style jsx global>{`
        @keyframes borderAnimation {
          0% {
            border-color: #3b82f6;
          }
          33% {
            border-color: #10b981;
          }
          66% {
            border-color: #f59e0b;
          }
          100% {
            border-color: #3b82f6;
          }
        }
      `}</style>
      <h1 className="text-2xl font-bold mb-6">Quiz</h1>
      {questions.map((question) => (
        <div
          key={question.id}
          className={`p-6 rounded-lg shadow-md ${
            submitted
              ? isCorrect(question)
                ? "bg-green-100 dark:bg-green-900"
                : "bg-red-100 dark:bg-red-900"
              : "bg-white dark:bg-gray-800"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">{question.text}</h2>
          <RadioGroup
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            value={userAnswers[question.id]}
            disabled={submitted}
          >
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          {submitted && (
            <div className="mt-4">
              <p className={`font-semibold ${isCorrect(question) ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {isCorrect(question) ? "Correct!" : `Incorrect. The correct answer is: ${question.correctAnswer}`}
              </p>
              <Collapsible>
                <CollapsibleTrigger
                  onClick={() => toggleExplanation(question.id)}
                  className="flex items-center text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-2"
                >
                  {openExplanations[question.id] ? (
                    <ChevronUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 mr-1" />
                  )}
                  {openExplanations[question.id] ? "Hide" : "Show"} Explanation
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-sm">
                  {question.explanation}
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      ))}
      {!submitted && (
        <Button
          onClick={handleSubmit}
          className="mt-6 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out relative overflow-hidden"
          style={{
            animation: 'borderAnimation 4s linear infinite',
            backgroundImage: 'linear-gradient(45deg, #4b5563, #6b7280)',
            border: '3px solid transparent',
          }}
        >
          <span className="relative z-10">Submit Answers</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-50 filter blur-xl"></span>
        </Button>
      )}
    </div>
  )
}