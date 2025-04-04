import { Elysia } from "elysia";

import { AuthService } from "./auth.services";
import {
  LoginDto,
  RegisterDto,
  type ILogin,
  type IRegister,
} from "./auth.interfaces";

const authService = new AuthService();

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    ({ body }: { body: IRegister }) => authService.register(body),
    {
      body: RegisterDto,
    }
  )
  .post("/login", ({ body }: { body: ILogin }) => authService.login(body), {
    body: LoginDto,
  });
