"use client";

import { useState } from "react";
import type { TestQuestion } from "@/lib/site";

export type AdaptiveAnswer = {
  question: TestQuestion;
  selected: string;
  correct: boolean;
};

const TOTAL_QUESTIONS = 12;

function clamp(value: number) {
  return Math.max(1, Math.min(6, value));
}

function shuffled<T>(items: readonly T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function chooseQuestion(bank: readonly TestQuestion[], usedIds: Set<string>, targetDifficulty: number) {
  const available = bank.filter((question) => !usedIds.has(question.id));
  const pool = available.length ? available : bank;
  const closestDistance = Math.min(...pool.map((question) => Math.abs(question.difficulty - targetDifficulty)));
  const closest = pool.filter((question) => Math.abs(question.difficulty - targetDifficulty) === closestDistance);
  const question = closest[Math.floor(Math.random() * closest.length)];
  return { ...question, options: shuffled(question.options) };
}

export function levelFromEstimate(estimate: number) {
  if (estimate >= 5.5) return "C1";
  if (estimate >= 4.6) return "B2";
  if (estimate >= 3.7) return "B1";
  if (estimate >= 2.7) return "A2";
  return "A1";
}

export function useAdaptiveTest(bank: readonly TestQuestion[]) {
  const [current, setCurrent] = useState(() => chooseQuestion(bank, new Set(), 3));
  const [selected, setSelected] = useState("");
  const [history, setHistory] = useState<AdaptiveAnswer[]>([]);
  const [estimate, setEstimate] = useState(3);
  const [targetDifficulty, setTargetDifficulty] = useState(3);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  function advance() {
    if (!selected || finished) return null;

    const correct = selected === current.answer;
    const nextHistory = [...history, { question: current, selected, correct }];
    const nextEstimate = clamp(estimate + (correct ? 0.48 : -0.62) + (current.difficulty - estimate) * 0.12);
    const nextStreak = correct ? correctStreak + 1 : 0;
    const nextTarget = correct
      ? clamp(targetDifficulty + (nextStreak >= 2 ? 1 : 0))
      : clamp(targetDifficulty - 1);

    setHistory(nextHistory);
    setEstimate(nextEstimate);
    setCorrectStreak(nextStreak >= 2 ? 0 : nextStreak);
    setTargetDifficulty(nextTarget);
    setSelected("");

    if (nextHistory.length >= Math.min(TOTAL_QUESTIONS, bank.length)) {
      setFinished(true);
      return { finished: true, history: nextHistory, level: levelFromEstimate(nextEstimate) };
    }

    setCurrent(chooseQuestion(bank, new Set(nextHistory.map((answer) => answer.question.id)), nextTarget));
    return { finished: false, history: nextHistory, level: levelFromEstimate(nextEstimate) };
  }

  return {
    current,
    selected,
    setSelected,
    history,
    score: history.filter((answer) => answer.correct).length,
    level: levelFromEstimate(estimate),
    step: history.length,
    total: Math.min(TOTAL_QUESTIONS, bank.length),
    finished,
    advance,
  };
}
