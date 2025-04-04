import prisma from "../../../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { ILogin, IRegister } from "./auth.interfaces";

export class AuthService {
  async register(data: IRegister) {
    const { name, phoneNumber, email, password } = data;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        email,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(user.id);

    return { accessToken: token };
  }

  async login(data: ILogin) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user.id);

    return { accessToken: token };
  }

  private generateToken(userId: string) {
    const secret = process.env.JWT_SECRET || "supersecretkey";

    return jwt.sign({ userId }, secret, { expiresIn: "1d" });
  }
}
