const mongoose = require('mongoose')

async function connectDB() {
  const connectionString = `mongodb://localhost:27017/cardsorting`
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('MongoDB connected!')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

module.exports = connectDB
