import Test from "../models/tests.js";
import Solution from "../models/solution.js";
import crypto from "crypto";

export const createTest = async (req, res) => {
  try {
    const { name, type, cards, categories, questions, userId } = req.body;
    // Suponiendo que el middleware de autenticación ya añadió el usuario a req.user

    const accessLink = crypto.randomBytes(16).toString("hex"); // Generar un identificador único

    const newTest = new Test({
      name,
      type,
      cards,
      categories,
      questions,
      userId,
      accessLink,
    });

    await newTest.save();

    res.status(201).json({
      message: "Test creado exitosamente",
      test: newTest,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el test", error });
  }
};

export const getUserTests = async (req, res) => {
  try {
    const { userId } = req.params;
    const tests = await Test.find({ userId }, "id name accessLink createdAt");

    res.status(200).json({ tests });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tests", error });
  }
};

export const getTestByAccessLink = async (req, res) => {
  try {
    const { accessLink } = req.params;
    const test = await Test.findOne(
      { accessLink },
      "id name type cards categories questions"
    );

    if (!test) {
      return res.status(404).json({ message: "Test no encontrado" });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el test", error });
  }
};

export const getTestDetails = async (req, res) => {
  try {
    const testId = req.params.testId;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const solutions = await Solution.find({ testId });

    const totalOfSolutions = solutions.length;
    const totalOfCompleted = solutions.filter(
      (solution) => solution.completedAt !== null
    ).length;
    const percentageOfCompleted =
      totalOfSolutions > 0
        ? ((totalOfCompleted / totalOfSolutions) * 100).toFixed(2)
        : 0;
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
        : 0;

    // Obtener categorías del test
    const testCategories = test.categories.filter(
      (category) => category != null
    );

    // Obtener categorías creadas en las soluciones
    const createdCategories = solutions
      .flatMap((solution) => solution.sort.map((s) => s.categoryIndex))
      .filter((category) => category != null);
    const uniqueCreatedCategories = [...new Set(createdCategories)];

    // Combinar categorías del test y creadas en soluciones, sin duplicados
    const combinedCategories = [
      ...new Set([...testCategories, ...uniqueCreatedCategories]),
    ];

    const testDetail = {
      _id: test._id,
      name: test.name,
      type: test.type,
      accessLink: test.accessLink,
      createdAt: test.createdAt,
      completedAt: test.completedAt,
      totalOfSolutions: totalOfSolutions,
      totalOfCompleted: totalOfCompleted,
      percentageOfCompleted: percentageOfCompleted,
      averageTimeOfCompleted: averageTimeOfCompleted,
      cards: test.cards,
      categories: combinedCategories,
      numberOfCreatedCategories: uniqueCreatedCategories.length,
      participants: solutions.map((solution) => {
        const initialColumnId = "column-cards";
        const initialColumn = solution.sort.find(
          (s) => s.id === initialColumnId
        );
        const initialCardsCount = initialColumn
          ? initialColumn.cards.length
          : 0;
        const totalCards = solution.sort.reduce(
          (acc, s) => acc + s.cards.length,
          0
        );
        const movedCards = totalCards - initialCardsCount;
        const movedCardsPercentage =
          totalCards > 0 ? ((movedCards / totalCards) * 100).toFixed(2) : 0;

        return {
          email: solution.userEmail,
          timeTaken: solution.completedAt
            ? (
                (new Date(solution.completedAt) -
                  new Date(solution.startedAt)) /
                (1000 * 60)
              ).toFixed(2)
            : null,
          status: solution.completedAt ? "completed" : "incomplete",
          numberOfCreatedCategories: [
            ...new Set(solution.sort.map((s) => s.categoryIndex)),
          ].filter((category) => category != null).length,
          movedCardsPercentage: parseFloat(movedCardsPercentage),
        };
      }),
      questions: test.questions.map((question) => ({
        question: question.text,
        answers: solutions.map((solution) => {
          const answerObj = solution.answers.find(
            (a) => a.questionId === question._id
          );
          return answerObj ? answerObj.answer : null;
        }),
      })),
    };

    res.status(200).json(testDetail);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
