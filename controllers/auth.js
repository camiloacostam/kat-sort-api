import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const loginUser = async (req, res) => {
  const { email, password } = req.body.email;

  try {
    // Buscar usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Verificar la password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // const token = generateToken(user._id)

    res.status(200).json({
      message: "Login exitoso",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error });
  }
};
