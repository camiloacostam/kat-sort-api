import Test from '../models/tests.js'
import Solution from '../models/solution.js'
import crypto from 'crypto'

export const createTest = async (req, res) => {
  try {
    const { name, type, cards, categories, questions, userId } = req.body
    // Suponiendo que el middleware de autenticación ya añadió el usuario a req.user

    const accessLink = crypto.randomBytes(16).toString('hex') // Generar un identificador único

    const newTest = new Test({
      name,
      type,
      cards,
      categories,
      questions,
      userId,
      accessLink
    })

    await newTest.save()

    res.status(201).json({
      message: 'Test creado exitosamente',
      test: newTest
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el test', error })
  }
}

export const editTestName = async (req, res) => {
  const { testId } = req.params
  const { name } = req.body

  try {
    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      { name: name, updatedAt: new Date() },
      { new: true }
    )

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test no encontrado' })
    }

    res.status(200).json({
      message: 'Nombre del test actualizado',
      test: updatedTest
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error actualizando la prueba', error })
  }
}

export const softDeleteTest = async (req, res) => {
  const { id } = req.params // Obtenemos el ID del test desde los parámetros de la URL

  try {
    // Buscar el test por su ID y actualizar el campo isActive a false
    const updatedTest = await Test.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() }, // Seteamos isActive a false y actualizamos updatedAt
      { new: true } // Devolvemos el documento actualizado
    )

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test no encontrado' })
    }

    return res.status(200).json({
      message: 'Test desactivado exitosamente (soft delete)',
      updatedTest
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error desactivando el test', error })
  }
}

export const getUserTests = async (req, res) => {
  try {
    const { userId } = req.params
    const tests = await Test.find(
      { userId, isActive: true },
      'id name isActive accessLink createdAt'
    )

    res.status(200).json({ tests })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los tests', error })
  }
}

export const getTestByAccessLink = async (req, res) => {
  try {
    const { accessLink } = req.params
    const test = await Test.findOne(
      { accessLink, isActive: true },
      'id name type isActive cards categories questions'
    )

    if (!test) {
      return res.status(404).json({ message: 'Test no encontrado' })
    }

    res.status(200).json(test)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el test', error })
  }
}

export const getTestDetails = async (req, res) => {
  try {
    const testId = req.params.testId

    const test = await Test.findOne({ _id: testId, isActive: true })

    if (!test) {
      return res.status(404).json({ message: 'Test not found' })
    }

    const solutions = await Solution.find({ testId })

    const totalOfSolutions = solutions.length
    const totalOfCompleted = solutions.filter(
      (solution) => solution.completedAt !== null
    ).length
    const percentageOfCompleted =
      totalOfSolutions > 0
        ? ((totalOfCompleted / totalOfSolutions) * 100).toFixed(2)
        : 0
    const averageTimeOfCompleted =
      totalOfCompleted > 0
        ? (
            solutions
              .filter((solution) => solution.completedAt !== null)
              .reduce(
                (acc, solution) =>
                  acc +
                  (new Date(solution.completedAt) -
                    new Date(solution.startedAt)),
                0
              ) /
            totalOfCompleted /
            (1000 * 60)
          ).toFixed(2)
        : 0

    // Obtener categorías del test
    const testCategories = test.categories.filter(
      (category) => category != null
    )

    // Obtener categorías creadas en las soluciones
    // const createdCategories = solutions
    //   .flatMap((solution) => solution.sort.map((s) => s.categoryIndex))
    //   .filter((category) => category != null)
    // const uniqueCreatedCategories = [...new Set(createdCategories)]
    const uniqueCreatedCategories = new Set()
    const predefinedCategories = new Set(
      test.categories.filter(
        (category) => category !== null && category !== 'Sin Categoría'
      )
    )

    // Procesar todas las soluciones para identificar categorías creadas, excluyendo "Sin Categoría"
    solutions.forEach((solution) => {
      solution.sort.forEach((column) => {
        if (
          column.category !== 'Sin Categoría' &&
          column.category !== null &&
          !predefinedCategories.has(column.category)
        ) {
          uniqueCreatedCategories.add(column.category)
        }
      })
    })

    // Combinar categorías del test y creadas en soluciones, sin duplicados
    const combinedCategories = [
      ...new Set([...testCategories, ...uniqueCreatedCategories])
    ]

    const testDetail = {
      _id: test._id,
      name: test.name,
      type: test.type,
      accessLink: test.accessLink,
      createdAt: test.createdAt,
      completedAt: test.completedAt,
      isActive: test.isActive,
      totalOfSolutions: totalOfSolutions,
      totalOfCompleted: totalOfCompleted,
      percentageOfCompleted: percentageOfCompleted,
      averageTimeOfCompleted: averageTimeOfCompleted,
      cards: test.cards,
      sorts: solutions.map((solution) => solution.sort),
      categories: combinedCategories,
      numberOfCreatedCategories: uniqueCreatedCategories.size,
      participants: solutions.map((solution) => {
        const initialColumnId = 'column-cards'
        const initialColumn = solution.sort.find(
          (s) => s.id === initialColumnId
        )
        const initialCardsCount = initialColumn ? initialColumn.cards.length : 0
        const totalCards = solution.sort.reduce(
          (acc, s) => acc + s.cards.length,
          0
        )
        const movedCards = totalCards - initialCardsCount
        const movedCardsPercentage =
          totalCards > 0 ? ((movedCards / totalCards) * 100).toFixed(2) : 0
        const participantCreatedCategories = new Set(
          solution.sort
            .map((column) => column.category)
            .filter((category) => {
              return (
                category !== 'Sin Categoría' &&
                category !== null &&
                !predefinedCategories.has(category)
              )
            })
        )

        return {
          email: solution.userEmail,
          timeTaken: solution.completedAt
            ? (
                (new Date(solution.completedAt) -
                  new Date(solution.startedAt)) /
                (1000 * 60)
              ).toFixed(2)
            : null,
          status: solution.completedAt ? 'completed' : 'incomplete',
          numberOfCreatedCategories: participantCreatedCategories.size,
          movedCardsPercentage: parseFloat(movedCardsPercentage)
        }
      }),
      questions: test.questions.map((question, index) => ({
        question: question,
        answers: solutions.map((solution) => {
          const answerArr = solution.answers[index]
          return answerArr ? answerArr : null
        })
      }))
    }

    res.status(200).json(testDetail)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getDendrogramData = async (req, res) => {
  try {
    const { testId } = req.params

    // Filtrar soluciones completadas
    const solutions = await Solution.find({
      testId,
      completedAt: { $ne: null }
    })

    if (!solutions.length) {
      return res.status(404).json({ message: 'No valid solutions found' })
    }

    let cardCategoryRelations = {}

    // Analizar las relaciones entre cartas y categorías
    solutions.forEach((solution) => {
      solution.sort.forEach(({ category, cards }) => {
        if (!cardCategoryRelations[category]) {
          cardCategoryRelations[category] = new Set()
        }
        cards.forEach((card) => {
          cardCategoryRelations[category].add(card)
        })
      })
    })

    // Convertir las relaciones en una estructura jerárquica
    const dendrogram = {
      name: 'Root',
      children: Object.keys(cardCategoryRelations).map((category) => ({
        name: category,
        children: Array.from(cardCategoryRelations[category]).map((card) => ({
          name: card
        }))
      }))
    }

    res.status(200).json({ dendrogram })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getResultsAnalysis = async (req, res) => {
  try {
    const { testId } = req.params

    const test = await Test.findById(testId)
    const solutions = await Solution.find({ testId })

    if (!test) {
      return res.status(404).json({ message: 'Test not found' })
    }

    if (!solutions.length) {
      return res.status(404).json({ message: 'No solutions found' })
    }

    // Filtrar soluciones completadas (donde completedAt no es null)
    const completedSolutions = solutions.filter(
      (solution) => solution.completedAt !== null
    )

    // Verificar si existen soluciones completadas
    if (!completedSolutions.length) {
      return res.status(404).json({ message: 'No completed solutions found' })
    }

    const cardsAnalysis = {}
    const categoriesAnalysis = {}

    completedSolutions.forEach((solution) => {
      solution.sort.forEach((sort) => {
        sort.cards.forEach((card) => {
          // Análisis de Cartas
          if (!cardsAnalysis[card]) {
            cardsAnalysis[card] = {
              cardName: card,
              categories: {},
              totalFrequency: 0
            }
          }

          if (!cardsAnalysis[card].categories[sort.category]) {
            cardsAnalysis[card].categories[sort.category] = {
              count: 0,
              solutions: new Set()
            }
          }

          if (
            !cardsAnalysis[card].categories[sort.category].solutions.has(
              solution._id.toString()
            )
          ) {
            cardsAnalysis[card].categories[sort.category].count++
            cardsAnalysis[card].categories[sort.category].solutions.add(
              solution._id.toString()
            )
          }

          cardsAnalysis[card].totalFrequency++

          // Análisis de Categorías
          if (!categoriesAnalysis[sort.category]) {
            categoriesAnalysis[sort.category] = {
              categoryName: sort.category,
              cards: {},
              totalCards: 0
            }
          }

          if (!categoriesAnalysis[sort.category].cards[card]) {
            categoriesAnalysis[sort.category].cards[card] = {
              frequency: 0
            }
          }

          categoriesAnalysis[sort.category].cards[card].frequency++
          categoriesAnalysis[sort.category].totalCards++
        })
      })
    })

    const CardAnalysisTableData = Object.values(cardsAnalysis).map((detail) => {
      const categoriesArray = Object.keys(detail.categories).map(
        (category) => ({
          category,
          frequency: detail.categories[category].count
        })
      )

      return {
        card: detail.cardName,
        sortedInto: categoriesArray.length,
        categories: categoriesArray,
        totalFrequency: detail.totalFrequency
      }
    })

    const CategoryAnalysisTableData = Object.values(categoriesAnalysis).map(
      (detail) => {
        const cardsArray = Object.keys(detail.cards).map((card) => ({
          card,
          frequency: detail.cards[card].frequency
        }))

        return {
          category: detail.categoryName,
          contains: `${cardsArray.length}`,
          cards: cardsArray
        }
      }
    )

    const cardSet = new Set()

    completedSolutions.forEach((solution) => {
      solution.sort.forEach(({ cards }) => {
        cards.forEach((card) => cardSet.add(card))
      })
    })

    const similarityMatrix = {}
    const cards = Array.from(cardSet)

    // Initialize matrix
    cards.forEach((card) => {
      similarityMatrix[card] = {}
      cards.forEach((otherCard) => {
        similarityMatrix[card][otherCard] = 0
      })
    })

    // Calculate similarity
    completedSolutions.forEach((solution) => {
      solution.sort.forEach(({ cards }) => {
        for (let i = 0; i < cards.length; i++) {
          for (let j = 0; j < cards.length; j++) {
            if (i !== j) {
              similarityMatrix[cards[i]][cards[j]]++
            }
          }
        }
      })
    })

    return res.status(200).json({
      cardsAnalysis: CardAnalysisTableData,
      categoriesAnalysis: CategoryAnalysisTableData,
      similarityMatrix
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
