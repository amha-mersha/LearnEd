export interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export const questions: Question[] = [
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
