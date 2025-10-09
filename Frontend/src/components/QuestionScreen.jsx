import React, { useCallback, useState, useMemo, useEffect } from "react";
import QuizLogo from "./ui/QuizLogo";
import Button from "./ui/Button";
import ProgressBar from "./ui/ProgressBar";
import Card from "./ui/Card";
import clsx from "clsx";
import useQuestionContext from "../hooks/useQuestionContext";
import handleError  from "../utils/handleError";
import validateAnswerAPI from "../api/validateAnswers"; // make sure this exists
import correctCheckMark from "../assets/white-checkmark.svg";
import incorrectCheckMark from "../assets/incorrect-cross.svg";
import NextArrow from "../assets/chevron-left-rounded.svg";

function NextArrowIcon() {
  return <img src={NextArrow} alt="Next Question" />;
}

const QuestionScreen = ({showResultScreen}) => {
  const [loading, setLoading] = useState(false);
  const [userSelectedOption, setUserSelectedOption] = useState("");
  const {
    updateQuestionStatus,
    activeQuestion,
    activeQuestionNumber,
    totalQuestions,
    activeNextQuestion,
  } = useQuestionContext();

    useEffect(() => {
      setUserSelectedOption("");
  
    }, [activeQuestion._id]);


  // handle API response
  const handleResponse = useCallback(
    (responseData) => {
      const isCorrectAnswer = responseData.status === 1;
      updateQuestionStatus(isCorrectAnswer);
    },
    [updateQuestionStatus]
  );

  // handle option click
  const handleClick = useCallback(
    (selectedOption) => {
      setUserSelectedOption(selectedOption.id);

      validateAnswerAPI(
        activeQuestion._id,
        selectedOption, // FIX: use selectedOption.id instead of state
        handleResponse,
        handleError,
        setLoading
      );
    },
    [activeQuestion?._id, handleResponse]
  );

  const hasAttempted = Boolean(userSelectedOption);

  const ifFinalQuestion = useMemo(
    () => activeQuestionNumber === totalQuestions,
    [activeQuestionNumber, totalQuestions]
  );

  return (
    <section className="question-section">
      <QuizLogo />
      <ProgressBar />
      <div className="question-content">
        <Card className="question-card">
          <div className="question-number">
            {`${activeQuestionNumber}/${totalQuestions}`}
          </div>
          <p className="question-text">{activeQuestion.question}</p>

          <div className="question-options">
            {activeQuestion.options.map((option) => {
              const isThisSelected = option.id === userSelectedOption;
              const isOptionCorrect =
                isThisSelected && activeQuestion.isAnswerCorrect;
              const isOptionIncorrect =
                isThisSelected && !activeQuestion.isAnswerCorrect;
              const isLoading = isThisSelected && loading;
              return (
                <button
                  className={clsx(
                    "option",
                    !hasAttempted && "not-answered",
                    isLoading && "loading",
                    isOptionCorrect && "correct-answer",
                    isOptionIncorrect && "incorrect-answer"
                  )}
                  key={activeQuestion._id + "-" + option.id}
                  onClick={() => handleClick(option)}
                  disabled={hasAttempted}
                >
                  {option.value}

                  {isThisSelected ? (
                    <span>
                      {isOptionCorrect && (
                        <img
                          src={correctCheckMark}
                          alt="correct answer"
                          className="answer-icon"
                        />
                      )}
                      {isOptionIncorrect && (
                        <img
                          src={incorrectCheckMark}
                          alt="incorrect answer"
                          className="answer-icon"
                        />
                      )}
                    </span>
                  ) : (
                    <span className="unattempted-radio" />
                  )}
                </button>
              );
            })}
          </div>
          {ifFinalQuestion ? (
            <Button
              onClick={showResultScreen}
              disabled={!activeQuestion.hasAttempted}
              icon={<NextArrowIcon />}
              iconPosition="right"
              size="small"
            >
              Submit
            </Button>
          ) : (
            <Button
              disabled={!activeQuestion.hasAttempted}
              icon={<NextArrowIcon />}
              iconPosition="right"
              size="small"
              onClick={() => activeNextQuestion()}
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
