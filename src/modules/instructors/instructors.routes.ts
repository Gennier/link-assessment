import { Elysia } from "elysia";
import {
  ListInstructorDto,
  type IListInstructor,
} from "./instructors.interfaces";
import { InstructorService } from "./instructors.services";

const instructorService = new InstructorService();

export const instructorRoutes = new Elysia({ prefix: "/instructors" }).get(
  "/",
  ({ query }: { query: IListInstructor }) => instructorService.findAll(query),
  {
    query: ListInstructorDto,
  }
);
