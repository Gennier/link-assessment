import { Elysia } from "elysia";
import { ListUserDto, type IListUser } from "./users.interfaces";
import { UserService } from "./users.services";
import { authenticateMiddleware } from "../../commons/middlewares/auth.middlewares";

const userService = new UserService();

export const userRoutes = new Elysia({ prefix: "/users" })
  .derive(async (context) => {
    return await authenticateMiddleware(context);
  })
  .get("/", ({ query }: { query: IListUser }) => userService.findAll(query), {
    query: ListUserDto,
  });
