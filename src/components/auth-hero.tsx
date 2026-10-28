"use client";

import { useEffect, useState } from "react";

const heroPhrases = [
  "A little space for your whole life.",
  "Make room for what matters.",
  "Your life, a little more balanced.",
  "One place for your everyday.",
  "Plan less. Live more.",
  "A calmer way to manage life.",
  "Your days, in better balance.",
  "Small steps, meaningful progress.",
  "Make every day feel lighter.",
  "More clarity, less chaos.",
  "A little more organized, every day.",
  "Your time, money, and health.",
  "Find balance in the everyday.",
  "A simpler way to stay on track.",
  "Build habits that feel like you.",
  "Take control, one day at a time.",
  "Everything important, in one place.",
  "Make space for a better you.",
  "Feel good about your everyday.",
  "Life feels lighter with PELITA.",
];

export default function AuthHero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = heroPhrases[phraseIndex];
    const phraseIsComplete = displayedText === phrase;

    const delay = isDeleting
      ? displayedText.length === 0
        ? 350
        : 35
      : phraseIsComplete
        ? 1800
        : 75;

    const timer = window.setTimeout(() => {
      // Once the whole sentence has been typed, pause before deleting it.
      if (!isDeleting && phraseIsComplete) {
        setIsDeleting(true);
        return;
      }

      // When the sentence is fully erased, choose a different one.
      if (isDeleting && displayedText.length === 0) {
        setPhraseIndex((currentIndex) => {
          let nextIndex = currentIndex;

          while (nextIndex === currentIndex) {
            nextIndex = Math.floor(Math.random() * heroPhrases.length);
          }

          return nextIndex;
        });
        setIsDeleting(false);
        return;
      }

      setDisplayedText(
        isDeleting
          ? phrase.slice(0, displayedText.length - 1)
          : phrase.slice(0, displayedText.length + 1)
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex]);

  return (
    <section className="mb-10 w-full px-2 text-center">
      <h1 className="mx-auto min-h-[2em] max-w-4xl text-[2rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2rem]">
        <span className="sr-only">{heroPhrases[phraseIndex]}</span>
        <span aria-hidden="true">
          {displayedText}
          <span className="ml-1 inline-block h-[0.9em] w-[2px] animate-pulse bg-foreground align-middle" />
        </span>
      </h1>
      <p className="text-sm text-foreground/50">
        Plan your time. Control your money. Understand your health.
      </p>
    </section>
  );
}
