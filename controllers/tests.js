import Test from "../models/tests.js";
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
