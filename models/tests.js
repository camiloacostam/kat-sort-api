import mongoose from 'mongoose'

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  cards: { type: [String], required: true },
  categories: { type: [String], required: true },
  questions: { type: [String], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accessLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
})

const Test = mongoose.model('Test', testSchema)

export default Test
