import { Elysia } from "elysia";
import { ListUserDto, type IListUser } from "./users.interfaces";
import { UserService } from "./users.services";

const userService = new UserService();

export const userRoutes = new Elysia({ prefix: "/users" }).get(
  "/",
  ({ query }: { query: IListUser }) => userService.findAll(query),
  {
    query: ListUserDto,
  }
);
