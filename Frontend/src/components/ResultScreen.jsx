import React, { useCallback, useMemo, useState } from "react";
import QuizLogo from "../components/ui/QuizLogo.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Tropy from "../assets/trophy.png";
import RestartIcon from "../assets/restart-icon.svg";
import useQuestionContext from "../hooks/useQuestionContext.js";
import fetchQuestionAPI from "../api/fetchQuestions.js";
import handleError from "../utils/handleError";

function RestartIconFC() {
  return <img src={RestartIcon} alt="restart icon" />;
}

const ResultScreen = ({ showQuestionScreen }) => {
  const [loading, setLoading] = useState(false);

  const { totalQuestions, correctAnswers, processQuestions } =
    useQuestionContext();

  const feedbackText = useMemo(() => {
    const percentage = (correctAnswers / totalQuestions) * 100;

    if (percentage >= 90) return "EXCELLENT JOB";
    if (percentage >= 70) return "GOOD JOB";
    if (percentage >= 50) return "YOU DID OK";
    return "YOU COULD DO BETTER";
  }, [correctAnswers, totalQuestions]);

  const handleResponse = useCallback(
    (responseData) => {
      processQuestions(responseData.questions);
      showQuestionScreen();
    },
    [processQuestions, showQuestionScreen],
  );

  const beginQuiz = useCallback(() => {
    fetchQuestionAPI(handleResponse, handleError, setLoading);
  }, [handleResponse]);

  return (
    <section className="result-section">
      <QuizLogo size="large" />
      <Card className="result-card">
        <div className="result-icon-wrapper">
          <img src={Tropy} alt="trophy" />
        </div>

        <h1 className="result-text">{feedbackText}</h1>

        <div className="result-details">
          <span className="correct-answers">{correctAnswers}</span>
          <p className="total-questions">
            Questions
            <br />
            out of <span className="weight-700">{totalQuestions}</span>
          </p>
        </div>

        <Button
          size="small"
          icon={<RestartIconFC />}
          iconPosition="right"
          onClick={beginQuiz}
          loading={loading}
        >
          Restart
        </Button>
      </Card>
    </section>
  );
};

export default ResultScreen;
