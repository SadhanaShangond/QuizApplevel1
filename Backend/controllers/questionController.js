const Question = require("../models/questionsModel.js");

const MAX_QUESTION_COUNT = 30;

//GEt questions

const getQuestions = async(req,res)=>{
    try{
        const questions = await Question.aggregate([{$sample:{size:MAX_QUESTION_COUNT}},
            {$project:{question:1,options:1}},
        ]);
        // console.log(questions);
        res.status(200).json({success:true,questions});
    }catch (error){
        console.error("erroe while fetching questions",error);
        res.status(500).json({success:false,message:error.message});

    }
}


const addAnswer = async(req,res)=>{
    try {
        const {qId,answer} = req.body;

        if(!qId || !answer){
            return res.status(400).json({
                success:false,
                message:"Bad request - need qId and Answer"
            })
        }

        const question = await Question.findById(qId);
        if(!question){
            return res.status(400).json({
              success: false,
              message: " No question found",
            });
        }
         const isCorrect = question.answer.id === answer.id;
         return res.status(200).json({
           success: true,
           status: isCorrect ? 1:0,
           message:`${isCorrect ? "correct":"wrong"} answer ${isCorrect ? "correct" :"wrong"}`,
         });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
           success: false,
           message: " Server error",
         });
    }
}
module.exports={getQuestions,addAnswer};