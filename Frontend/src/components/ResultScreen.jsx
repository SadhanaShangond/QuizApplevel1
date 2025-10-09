import React, { useCallback, useState } from 'react'
import QuizLogo from "../components/ui/QuizLogo.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Tropy from "../assets/trophy.png";
import RestartIcon from "../assets/restart-icon.svg";
import useQuestionContext from '../hooks/useQuestionContext.js';
import { useMemo } from 'react';
import fetchQuestionAPI from '../api/fetchQuestions.js';
import handleError from "../utils/handleError";
function RestartIconFC(){
    return <img src={RestartIcon} alt="restart icon" />
} 
const ResultScreen = ({showQuestionScreen}) => {
  const [loading,setLoading]=useState(false);
  const { totalQuestions, correctAnswers, processQuestions } =
    useQuestionContext();
  //show result based on score

  const feedbackText = useMemo(function(){
    const percentage = (correctAnswers/totalQuestions)*100;
    if (percentage >= 90) {
      return "EXCELLENT JOB";
    } else if (percentage >= 70) {
      return "GOOD JOB";
    } else if (percentage >= 50) {
      return "YOU DID OK";
    } else  {
      return "YOU COULD DO BETTER";
    }
  },[correctAnswers,totalQuestions]);


  const handleResponse = useCallback(
    function (responseData) {
      console.log(responseData);
      processQuestions(responseData.questions);
      //changeScreen
      showQuestionScreen();
    },
    [processQuestions, showQuestionScreen]
  );

  const beginQuiz = useCallback(
    function () {
      fetchQuestionAPI(handleResponse, handleError, setLoading);
    },
    [handleResponse]
  );

  return (
    <section className="result-section">
      <QuizLogo size="large" />
      <Card className="result-card">
        <div className="result-icon-wrapper">
          <img src={Tropy} alt="thropy" />
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

        <Button size="small" icon={<RestartIconFC />} iconPosition="right"  onClick={beginQuiz}
        loading={loading} >
           Restart 
        </Button>
      </Card>
    </section>
  );
}

export default ResultScreen