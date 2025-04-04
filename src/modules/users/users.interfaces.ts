import { t } from "elysia";
import {
  PaginationQuerySchema,
  type IPagination,
  type IPaginationQuery,
} from "../../commons/interfaces/pagination.interfaces";
import type { User } from "@prisma/client";

export interface IPaginatedUser extends IPagination<User> {}

export interface IListUser extends IPaginationQuery {
  email?: string;
}

export const ListUserDto = t.Object({
  ...PaginationQuerySchema.properties,
  email: t.Optional(t.String()),
});
