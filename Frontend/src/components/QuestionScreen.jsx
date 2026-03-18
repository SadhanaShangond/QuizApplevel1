import React, { useCallback, useState, useMemo, useEffect } from "react";
import QuizLogo from "./ui/QuizLogo";
import Button from "./ui/Button";
import ProgressBar from "./ui/ProgressBar";
import Card from "./ui/Card";
import clsx from "clsx";
import useQuestionContext from "../hooks/useQuestionContext";
import handleError from "../utils/handleError";
import validateAnswerAPI from "../api/validateAnswers";
import correctCheckMark from "../assets/white-checkmark.svg";
import incorrectCheckMark from "../assets/incorrect-cross.svg";
import NextArrow from "../assets/chevron-left-rounded.svg";

function NextArrowIcon() {
  return <img src={NextArrow} alt="Next Question" />;
}

const QuestionScreen = ({ showResultScreen }) => {
  const [loading, setLoading] = useState(false);
  const [userSelectedOption, setUserSelectedOption] = useState("");

  const {
    updateQuestionStatus,
    activeQuestion,
    activeQuestionNumber,
    totalQuestions,
    activeNextQuestion,
    timeLeft,
  } = useQuestionContext();

  useEffect(() => {
    setUserSelectedOption("");
  }, [activeQuestion?._id]);

  // 🔥 Auto submit when time ends
  useEffect(() => {
    if (timeLeft === 0) {
      showResultScreen();
    }
  }, [timeLeft, showResultScreen]);

  const handleResponse = useCallback(
    (responseData) => {
      const isCorrectAnswer = responseData.status === 1;
      updateQuestionStatus(isCorrectAnswer);
    },
    [updateQuestionStatus],
  );

  const handleClick = useCallback(
    (selectedOption) => {
      if (timeLeft === 0) return;

      setUserSelectedOption(selectedOption.id);

      validateAnswerAPI(
        activeQuestion._id,
        selectedOption,
        handleResponse,
        handleError,
        setLoading,
      );
    },
    [activeQuestion?._id, handleResponse, timeLeft],
  );

  const hasAttempted = Boolean(userSelectedOption);

  const ifFinalQuestion = useMemo(
    () => activeQuestionNumber === totalQuestions,
    [activeQuestionNumber, totalQuestions],
  );

  return (
    <section className="question-section">
      <QuizLogo />

      {/* ⏳ TIMER DISPLAY */}
      <div
        style={{
          textAlign: "right",
          fontWeight: "bold",
          color: timeLeft <= 10 ? "red" : "black",
        }}
      >
        ⏳ Time Left: {timeLeft}s
      </div>

      <ProgressBar />

      <div className="question-content">
        <Card className="question-card">
          <div className="question-number">
            {`${activeQuestionNumber}/${totalQuestions}`}
          </div>

          <p className="question-text">{activeQuestion?.question}</p>

          <div className="question-options">
            {activeQuestion?.options.map((option) => {
              const isThisSelected = option.id === userSelectedOption;
              const isOptionCorrect =
                isThisSelected && activeQuestion.isAnswerCorrect;
              const isOptionIncorrect =
                isThisSelected && !activeQuestion.isAnswerCorrect;
              const isLoading = isThisSelected && loading;

              return (
                <button
                  key={activeQuestion._id + "-" + option.id}
                  className={clsx(
                    "option",
                    !hasAttempted && "not-answered",
                    isLoading && "loading",
                    isOptionCorrect && "correct-answer",
                    isOptionIncorrect && "incorrect-answer",
                  )}
                  onClick={() => handleClick(option)}
                  disabled={hasAttempted || timeLeft === 0}
                >
                  {option.value}
                </button>
              );
            })}
          </div>

          {ifFinalQuestion ? (
            <Button
              onClick={showResultScreen}
              disabled={!activeQuestion?.hasAttempted || timeLeft === 0}
              icon={<NextArrowIcon />}
              iconPosition="right"
              size="small"
            >
              Submit
            </Button>
          ) : (
            <Button
              disabled={!activeQuestion?.hasAttempted || timeLeft === 0}
              icon={<NextArrowIcon />}
              iconPosition="right"
              size="small"
              onClick={activeNextQuestion}
            >
              Next
            </Button>
          )}
        </Card>
      </div>
    </section>
  );
};

export default QuestionScreen;
