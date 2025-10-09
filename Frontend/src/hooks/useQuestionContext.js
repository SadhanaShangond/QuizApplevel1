import { useContext } from "react";
import QuestionContext from "../context/QuestionContext";

function useQuestionContext(){
    return useContext(QuestionContext);

}

export default useQuestionContext;