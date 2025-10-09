const express = require("express");

const { getQuestions, addAnswer } = require("../controllers/questionController");

const questionRouter = express.Router();

questionRouter.get("/",getQuestions);
questionRouter.post("/validate-answer", addAnswer);
module.exports={questionRouter};