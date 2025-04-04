import { Elysia } from "elysia";
import { instructorRoutes } from "./src/modules/instructors/instructors.routes";
import { machineRoutes } from "./src/modules/machines/machines.routes";
import { authRoutes } from "./src/modules/auth/auth.routes";
import { userRoutes } from "./src/modules/users/users.routes";
import { bookingRoutes } from "./src/modules/bookings/bookings.routes";
import jwt from "@elysiajs/jwt";

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET || "supersecretkey",
      exp: "1d",
    })
  )
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
