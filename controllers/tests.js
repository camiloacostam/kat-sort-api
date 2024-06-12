import Test from "../models/tests";
import crypto from "crypto";

export const createTest = async (req, res) => {
  try {
    const { testName, testType, carts, categories, questions } = req.body;
    const userId = req.user._id; // Suponiendo que el middleware de autenticación ya añadió el usuario a req.user

    const accessLink = crypto.randomBytes(16).toString("hex"); // Generar un identificador único

    const newTest = new Test({
      testName,
      testType,
      carts,
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
