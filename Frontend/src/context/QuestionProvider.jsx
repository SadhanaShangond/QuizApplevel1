import { useCallback, useEffect, useMemo, useState } from "react";
import QuestionContext from "../context/QuestionContext";

export default function QuestionProvider({children}){
  //Api Calling ,functions,Properties

  const [questions, setQuestions] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState("");

  const processQuestions = useCallback((questionAPIResponse) => {
    setQuestions(
      questionAPIResponse.map((question) => ({
        ...question,
        hasAttempted: false,
        isAnswerCorrect: false,
      }))
    );
    setActiveQuestionId(questionAPIResponse[0]._id);
  });

  const activeQuestion = useMemo(
    () => questions.find((question) => question._id === activeQuestionId),
    [activeQuestionId, questions]
  );

  const activeQuestionNumber = useMemo(
    () =>
      questions.findIndex((question) => question._id === activeQuestionId) + 1,
    [activeQuestionId, questions]
  );

  const totalQuestions = useMemo(() => questions.length, [questions]);

  const updateQuestionStatus = useCallback(
    (isAnswerCorrect) => {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question._id === activeQuestionId
            ? { ...question, hasAttempted: true, isAnswerCorrect }
            : question
        )
      );
    },
    [activeQuestionId]
  ); //hasAttempted=true,isAnswerCorrect = true

  useEffect(() => {
    //this code will run after the component re render due to questions changing
    console.log("Question state have been updated", questions);
  }, [questions]);

  //Function to update active questionId
  // whenever we click on next button the activequestionid  should increase by 1 and if  totalquestions=activequestionid it is the last question

  const activeNextQuestion = useCallback(() => {
    const currentIndex = questions.findIndex(
      (question) => question._id === activeQuestionId
    );

    if (currentIndex !== -1 && currentIndex + 1 < questions.length) {
      setActiveQuestionId(questions[currentIndex + 1]._id);
    }
  }, [activeQuestionId, questions]);

//   const activeNextQuestion = useCallback(() => {
//     const currentIndex = questions.findIndex(
//       (question) => question._id === activeQuestionId
//     );

//     if (currentIndex !== -1 && currentIndex + 1 < questions.length) {
//       setActiveQuestionId(questions[currentIndex + 1]._id);
//     }
//   }, [activeQuestionId, questions]);


  //Function to find out no. of correct answers
  const correctAnswers = useMemo(() => {
    const noOfCorrectAnswers = questions.filter(
      (question) => question.isAnswerCorrect
    ).length;

    return noOfCorrectAnswers;
  }, [questions]);

  const contextValue = useMemo(
    () => ({
      activeQuestion,
      activeQuestionNumber,
      totalQuestions,
      correctAnswers,
      processQuestions,
      updateQuestionStatus,
      activeNextQuestion,
    }),
    [
      activeQuestion,
      activeQuestionNumber,
      totalQuestions,
      correctAnswers,
      processQuestions,
      updateQuestionStatus,
      activeNextQuestion,
    ]
  );

  return (
    <QuestionContext.Provider value={contextValue}>{children}</QuestionContext.Provider>
  );
}