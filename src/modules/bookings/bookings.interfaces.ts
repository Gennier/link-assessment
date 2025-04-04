import { t } from "elysia";
import {
  PaginationQuerySchema,
  type IPaginationQuery,
} from "../../commons/interfaces/pagination.interfaces";

export interface ICreateBooking {
  instructorId: string;
  machineId: string;
  startDate: Date;
  endDate: Date;
}

export interface IListBooking extends IPaginationQuery {}

export const CreateBookingDto = t.Object({
  instructorId: t.String(),
  machineId: t.String(),
  startDate: t.Date(),
  endDate: t.Date(),
});

export const ListBookingDto = t.Object({
  ...PaginationQuerySchema.properties,
});
