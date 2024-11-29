"use client";
// import { Question, dummy } from "@/utils/questions";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGetQuizQuery } from "@/lib/redux/api/getApi";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import Cookie from "js-cookie";
import { saveQuizResult } from "@/utils/quizHistory";

export default function Component({ searchParams }: { searchParams: any }) {
  // const token = localStorage.getItem("token");
  const token = Cookie.get("token");
  const post_id = searchParams.post_id;
  const title = searchParams.title;

  const choiceMapper = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
  };

  let questions: any = [];
  const id = post_id;
  const { data, isError, isSuccess } = useGetQuizQuery({ token, id });
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [openExplanations, setOpenExplanations] = useState<{
    [key: number]: boolean;
  }>({});
  if (isSuccess) {
    questions = data.message;

    const handleAnswerChange = (questionId: number, answer: string) => {
      setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
      saveQuizResult(title, questions, userAnswers);
      setSubmitted(true);
    };

    const toggleExplanation = (questionId: number) => {
      setOpenExplanations((prev) => ({
        ...prev,
        [questionId]: !prev[questionId],
      }));
    };

    const isCorrect = (question: any, ind: number) =>
      userAnswers[ind] === question.choices[question.correct_answer];

    const getScore = () => {
      let score = 0;
      questions.forEach((question: any, ind: number) => {
        if (isCorrect(question, ind)) {
          score += 1;
        }
      });
      return score;
    };

    return (
      <div className=" bg-slate-100 w-[80vw] justify-center">
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
          {questions.map((question: any, ind: number) => (
            <div
              key={ind}
              className={`p-6 rounded-lg shadow-md ${
                submitted
                  ? isCorrect(question, ind)
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-red-100 dark:bg-red-900"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <h2 className="text-lg font-semibold mb-4">
                {question.question}
              </h2>
              <RadioGroup
                onValueChange={(value: string) =>
                  handleAnswerChange(ind, value)
                }
                value={userAnswers[ind]}
                disabled={submitted}
              >
                {question.choices.map((option: any) => (
                  <div
                    key={option}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <RadioGroupItem value={option} id={`${ind}-${option}`} />
                    <Label htmlFor={`${ind}-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              {submitted && (
                <div className="mt-4">
                  <p
                    className={`font-semibold ${
                      isCorrect(question, ind)
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isCorrect(question, ind)
                      ? "Correct!"
                      : `Incorrect. The correct answer is: ${
                          choiceMapper[
                            question.correct_answer as keyof typeof choiceMapper
                          ]
                        }`}
                  </p>
                  <Collapsible>
                    <CollapsibleTrigger
                      onClick={() => toggleExplanation(ind)}
                      className="flex items-center text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-2"
                    >
                      {openExplanations[ind] ? (
                        <ChevronUp className="w-4 h-4 mr-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 mr-1" />
                      )}
                      {openExplanations[ind] ? "Hide" : "Show"} Explanation
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
                // animation: 'borderAnimation 4s linear infinite',
                backgroundImage: "linear-gradient(45deg, #4b5563, #6b7280)",
                border: "3px solid transparent",
              }}
            >
              <span className="relative z-10">Submit Answers</span>
              {/* <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-50 filter blur-xl"></span> */}
            </Button>
          )}
          {submitted && (
            <div className="mt-6">
              <p className="text-2xl font-bold">
                Total Score: {getScore()} / {questions.length}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
