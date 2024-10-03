import mongoose from 'mongoose'
import { nullable } from 'zod'

const sortSchema = new mongoose.Schema({
  id: { type: String, required: true },
  category: { type: String, required: true },
  cards: { type: [String], required: true },
  comment: { type: String, default: null },
  isErasable: { type: Boolean, default: false }
})

const solutionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    reft: 'Test',
    required: true
  },
  userEmail: { type: String, required: true },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date, default: null },
  answers: { type: [String], default: [] },
  sort: [sortSchema]
})

const Solution = mongoose.model('Solution', solutionSchema)

export default Solution
