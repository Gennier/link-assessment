import { t } from "elysia";
import {
  PaginationQuerySchema,
  type IPagination,
  type IPaginationQuery,
} from "../../commons/interfaces/pagination.interfaces";
import { type Instructor } from "@prisma/client";

export interface IPaginatedInstructor extends IPagination<Instructor> {}

export interface IListInstructor extends IPaginationQuery {
  email: string;
  startDate: Date;
  endDate: Date;
}

export const ListInstructorDto = t.Object({
  ...PaginationQuerySchema.properties,
  email: t.Optional(t.String()),
  startDate: t.Date(),
  endDate: t.Date(),
});
