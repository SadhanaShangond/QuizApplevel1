import clsx from 'clsx';
import React, { useMemo } from 'react'
import useQuestionContext from '../../hooks/useQuestionContext';

const ProgressBar = () => {
   

    const {activeQuestionNumber,totalQuestions}= useQuestionContext();

   const progressText =useMemo( () => `${((activeQuestionNumber/totalQuestions)*100).toFixed(2)}%`,[activeQuestionNumber,totalQuestions]);

   const isFinalQuestion = useMemo(()=> activeQuestionNumber === totalQuestions,[activeQuestionNumber,totalQuestions])
  return (
    <progress
      value={activeQuestionNumber}
      max={totalQuestions}
      className={clsx("progress-bar", isFinalQuestion && "progress-bar-final")}
    >
      {progressText}
    </progress>
  );
}

export default ProgressBar