"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flashcard } from "@/types/flashcard";
import { getFlashcards } from "@/utils/dummy_flashcard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Component() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    getFlashcards().then((data) => {
      setCards(data);
    });
  }, []);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      nextCard();
    }

    if (touchStart - touchEnd < -150) {
      prevCard();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevCard();
      } else if (e.key === "ArrowRight") {
        nextCard();
      } else if (e.key === "Enter") {
        flipCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentCard]);

  // If cards are not loaded yet, show loading message
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[250px] w-[400px] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-[400px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div
          className="relative w-full h-64 [perspective:1000px]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`absolute w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ease-in-out ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <div
              className="absolute w-full h-full bg-white rounded-lg shadow-lg p-6 [backface-visibility:hidden] cursor-pointer"
              onClick={flipCard}
            >
              <h2 className="text-2xl font-bold mb-4">Question:</h2>
              <p className="text-lg">{cards[currentCard].question}</p>
            </div>
            <div
              className="absolute w-full h-full bg-white rounded-lg shadow-lg p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] cursor-pointer"
              onClick={flipCard}
            >
              <h2 className="text-2xl font-bold mb-4">Answer:</h2>
              <p className="text-lg">{cards[currentCard].answer}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={prevCard}
            disabled={currentCard === 0}
            variant="outline"
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={nextCard}
            disabled={currentCard === cards.length - 1}
            variant="outline"
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Progress
          value={((currentCard + 1) / cards.length) * 100}
          className="mt-4"
        />
        <p className="text-center mt-2">
          Card {currentCard + 1} of {cards.length}
        </p>
      </div>
    </div>
  );
}
