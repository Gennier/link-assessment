import { Elysia } from "elysia";
import {
  ListInstructorDto,
  type IListInstructor,
} from "./instructors.interfaces";
import { InstructorService } from "./instructors.services";
import { authenticateMiddleware } from "../../commons/middlewares/auth.middlewares";

const instructorService = new InstructorService();

export const instructorRoutes = new Elysia({ prefix: "/instructors" })
  .derive(async (context) => {
    return await authenticateMiddleware(context);
  })
  .get(
    "/",
    ({ query }: { query: IListInstructor }) => instructorService.findAll(query),
    {
      query: ListInstructorDto,
    }
  );
