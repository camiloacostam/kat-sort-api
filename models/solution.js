import mongoose from "mongoose";
import { nullable } from "zod";

const answerSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  answer: { type: String, required: true },
});

const sortSchema = new mongoose.Schema({
  id: { type: String, required: true },
  category: { type: String, required: true },
  cards: { type: [String], required: true },
});

const solutionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    reft: "Test",
    required: true,
  },
  userEmail: { type: String, required: true },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date, default: null },
  answers: [answerSchema],
  sort: [sortSchema],
});

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
