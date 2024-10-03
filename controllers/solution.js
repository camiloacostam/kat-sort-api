import Test from '../models/tests.js'
import Solution from '../models/solution.js'

export const startTest = async (req, res) => {
  try {
    const { accessLink, userEmail, sort } = req.body

    const test = await Test.findOne({ accessLink })

    if (!test) {
      return res.status(404).json({ message: 'Test no encontrado' })
    }

    const newSolution = new Solution({
      testId: test._id,
      userEmail: userEmail.toLowerCase(),
      startedAt: new Date(),
      completedAt: null,
      answers: [],
      sort: sort
    })

    await newSolution.save()

    res.status(201).json({
      message: 'Test iniciado exitosamente',
      solution: newSolution
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar el test', error })
  }
}

export const saveAnswers = async (req, res) => {
  try {
    const { solutionId, answers } = req.body

    const existingSolution = await Solution.findById(solutionId)
    if (!existingSolution) {
      return res.status(404).json({ message: 'Solución no encontrada' })
    }

    existingSolution.answers = answers

    await existingSolution.save()

    res.status(200).json({
      message: 'Respuestas guardadas exitosamente',
      solution: existingSolution
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar las respuestas', error })
  }
}

export const completeTest = async (req, res) => {
  try {
    const { solutionId, sort } = req.body

    const existingSolution = await Solution.findById(solutionId)
    if (!existingSolution) {
      return res.status(404).json({ message: 'Solución no encontrada' })
    }

    existingSolution.sort = sort
    existingSolution.completedAt = new Date()

    await existingSolution.save()

    res.status(200).json({
      message: 'Test completado exitosamente',
      solution: existingSolution
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar las respuestas', error })
  }
}

export const addCommentToSort = async (req, res) => {
  try {
    const solutions = await Solution.find()

    const bulkOps = solutions.map((solution) => {
      solution.sort = solution.sort.map((item) => ({
        ...item,
        comment: item.comment !== undefined ? item.comment : null, // Establece null si no existe
        isErasable: false
      }))

      return {
        updateOne: {
          filter: { _id: solution._id },
          update: { $set: { sort: solution.sort } }
        }
      }
    })

    await Solution.bulkWrite(bulkOps)

    res
      .status(200)
      .json({ message: 'Comments set to null for sort items successfully!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error updating solutions', error })
  }
}
