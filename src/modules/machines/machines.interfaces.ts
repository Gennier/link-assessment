import { t } from "elysia";
import {
  PaginationQuerySchema,
  type IPagination,
  type IPaginationQuery,
} from "../../commons/interfaces/pagination.interfaces";
import { type Machine } from "@prisma/client";

export interface IPaginatedMachine extends IPagination<Machine> {}

export interface IListMachine extends IPaginationQuery {
  startDate: Date;
  endDate: Date;
}

export const ListMachineDto = t.Object({
  ...PaginationQuerySchema.properties,
  startDate: t.Date(),
  endDate: t.Date(),
});
