import { t } from "elysia";

export interface IRegister {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export const RegisterDto = t.Object({
  name: t.String(),
  phoneNumber: t.String(),
  email: t.String(),
  password: t.String(),
});

export const LoginDto = t.Object({
  email: t.String(),
  password: t.String(),
});
