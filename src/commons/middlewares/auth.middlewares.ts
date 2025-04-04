import { Elysia, type Context } from "elysia";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma/prisma";

export const authenticateMiddleware = async (context: Context) => {
  const authBearerHeader = context.request.headers.get("authorization");

  if (!authBearerHeader || !authBearerHeader.startsWith("Bearer ")) {
    context.set.status = 401;
    throw new Error("Unauthorized: Missing or invalid token");
  }

  const token = authBearerHeader.split(" ")[1];

  if (!token) {
    context.set.status = 401;
    throw new Error("Unauthorized: Invalid token");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey"
    ) as any;

    if (!decoded.userId) {
      context.set.status = 401;
      throw new Error("Unauthorized: Invalid token");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      context.set.status = 401;
      throw new Error("Unauthorized: Invalid token");
    }

    // @ts-ignore
    context.user = user;
  } catch (error) {
    context.set.status = 401;
    throw new Error("Unauthorized: Invalid token");
  }
};
