import { Elysia } from "elysia";
import { instructorRoutes } from "./src/modules/instructors/instructors.routes";
import { machineRoutes } from "./src/modules/machines/machines.routes";
import { authRoutes } from "./src/modules/auth/auth.routes";
import { userRoutes } from "./src/modules/users/users.routes";
import { bookingRoutes } from "./src/modules/bookings/bookings.routes";
import jwt from "@elysiajs/jwt";
import { AppError } from "./src/commons/errors/errors";

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET || "supersecretkey",
      exp: "1d",
    })
  )
  .onError(({ code, error }) => {
    if (error instanceof AppError) {
      return new Response(
        JSON.stringify({
          message: error.toString(),
          code: error.code,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: error.statusCode,
        }
      );
    } else {
      console.error(error);
      return new Response(
        JSON.stringify({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  })
  .use(authRoutes)
  .use(instructorRoutes)
  .use(machineRoutes)
  .use(userRoutes)
  .use(bookingRoutes)
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
