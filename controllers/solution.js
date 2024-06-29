import Test from "../models/tests.js";
import Solution from "../models/solution.js";

export const startTest = async (req, res) => {
  try {
    const { accessLink, userEmail, sort } = req.body;

    const test = await Test.findOne({ accessLink });

    if (!test) {
      return res.status(404).json({ message: "Test no encontrado" });
    }

    const newSolution = new Solution({
      testId: test._id,
      userEmail: userEmail.toLowerCase(),
      startedAt: new Date(),
      completedAt: null,
      answers: [],
      sort: sort,
    });

    await newSolution.save();

    res.status(201).json({
      message: "Test iniciado exitosamente",
      solution: newSolution,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar el test", error });
  }
};
