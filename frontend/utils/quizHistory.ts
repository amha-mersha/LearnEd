// utils/quizHistory.ts
interface QuizResult {
    title: string;
    timestamp: number;
    questions: {
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }[];
    score: number;
    totalQuestions: number;
  }
  
  export const saveQuizResult = (
    title: string, 
    questions: any[], 
    userAnswers: { [key: number]: string }
  ) => {
    // Prepare quiz result object
    const quizResult: QuizResult = {
      title,
      timestamp: Date.now(),
      questions: questions.map((question, index) => ({
        question: question.question,
        userAnswer: userAnswers[index] || 'Not answered',
        correctAnswer: question.choices[question.correct_answer],
        isCorrect: userAnswers[index] === question.choices[question.correct_answer]
      })),
      score: questions.reduce((score, question, index) => 
        userAnswers[index] === question.choices[question.correct_answer] ? score + 1 : score, 
        0
      ),
      totalQuestions: questions.length
    };
  
    // Retrieve existing history or create new array
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    
    // Add new result
    quizHistory.push(quizResult);
    
    // Save back to localStorage
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
  };
  
  export const getQuizHistory = (): QuizResult[] => {
    return JSON.parse(localStorage.getItem('quizHistory') || '[]');
  };