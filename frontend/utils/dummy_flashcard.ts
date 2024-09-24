import { Flashcard } from "@/types/flashcard"

// Simulate fetching flashcards from backend
export const getFlashcards = (): Promise<Flashcard[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { question: "What is React?", answer: "A JavaScript library for building user interfaces" },
          { question: "What is JSX?", answer: "A syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files" },
          { question: "What is a component in React?", answer: "A reusable piece of UI that can be composed to create complex interfaces" }
        ])
      }, 1000) // Simulate network delay
    })
  }
  