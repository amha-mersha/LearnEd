"use client";
import { useState, useEffect } from "react";
import { getQuizHistory } from "@/utils/quizHistory";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function QuizHistoryPage() {
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [openQuizzes, setOpenQuizzes] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    const history = getQuizHistory();
    setQuizHistory(history);
  }, []);

  const toggleQuizDetails = (index: number) => {
    setOpenQuizzes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  console.info("quizHistory", quizHistory);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quiz History</h1>
      {quizHistory.length === 0 ? (
        <p>No quiz history found.</p>
      ) : (
        quizHistory.map((quiz, index) => (
          <Collapsible 
            key={index} 
            open={openQuizzes[index]}
            onOpenChange={() => toggleQuizDetails(index)}
          >
            <CollapsibleTrigger asChild>
              <div 
                className="bg-white shadow-md rounded-lg p-6 mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Quiz from: {quiz.title}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {new Date(quiz.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">
                      Score: {quiz.score} / {quiz.totalQuestions}
                    </p>
                    {openQuizzes[index] ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="bg-white shadow-md rounded-b-lg p-6">
                {quiz.questions.map((q: any, qIndex: number) => (
                  <div 
                    key={qIndex} 
                    className={`mb-4 p-4 rounded-md ${
                      q.isCorrect ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <p className="font-semibold mb-2">{q.question}</p>
                    <p>Your Answer: {q.userAnswer}</p>
                    <p className="text-sm text-gray-600">
                      Correct Answer: {q.correctAnswer}
                    </p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      )}
    </div>
  );
}