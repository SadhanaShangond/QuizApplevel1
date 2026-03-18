import { useCallback, useEffect, useMemo, useState } from "react";
import QuestionContext from "../context/QuestionContext";

export default function QuestionProvider({ children }) {
  const QUIZ_TIME = 60; // ⏳ 1 minute

  const [questions, setQuestions] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState("");
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);

  // 🔥 Process Questions (called after API fetch)
  const processQuestions = useCallback((questionAPIResponse) => {
    const formattedQuestions = questionAPIResponse.map((question) => ({
      ...question,
      hasAttempted: false,
      isAnswerCorrect: false,
    }));

    setQuestions(formattedQuestions);
    setActiveQuestionId(formattedQuestions[0]?._id);
    setTimeLeft(QUIZ_TIME); // 🔥 Reset timer when quiz starts
  }, []);

  const activeQuestion = useMemo(
    () => questions.find((q) => q._id === activeQuestionId),
    [questions, activeQuestionId],
  );

  const activeQuestionNumber = useMemo(
    () => questions.findIndex((q) => q._id === activeQuestionId) + 1,
    [questions, activeQuestionId],
  );

  const totalQuestions = useMemo(() => questions.length, [questions]);

  const updateQuestionStatus = useCallback(
    (isAnswerCorrect) => {
      setQuestions((prev) =>
        prev.map((question) =>
          question._id === activeQuestionId
            ? { ...question, hasAttempted: true, isAnswerCorrect }
            : question,
        ),
      );
    },
    [activeQuestionId],
  );

  const activeNextQuestion = useCallback(() => {
    const currentIndex = questions.findIndex((q) => q._id === activeQuestionId);

    if (currentIndex !== -1 && currentIndex + 1 < questions.length) {
      setActiveQuestionId(questions[currentIndex + 1]._id);
    }
  }, [questions, activeQuestionId]);

  const correctAnswers = useMemo(() => {
    return questions.filter((q) => q.isAnswerCorrect).length;
  }, [questions]);

  // 🔥 Global Countdown Timer
  useEffect(() => {
    if (!totalQuestions) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, totalQuestions]);

  const contextValue = useMemo(
    () => ({
      activeQuestion,
      activeQuestionNumber,
      totalQuestions,
      correctAnswers,
      processQuestions,
      updateQuestionStatus,
      activeNextQuestion,
      timeLeft, // 👈 expose timer
    }),
    [
      activeQuestion,
      activeQuestionNumber,
      totalQuestions,
      correctAnswers,
      processQuestions,
      updateQuestionStatus,
      activeNextQuestion,
      timeLeft,
    ],
  );

  return (
    <QuestionContext.Provider value={contextValue}>
      {children}
    </QuestionContext.Provider>
  );
}
