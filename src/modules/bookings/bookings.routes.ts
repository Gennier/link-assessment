import { Elysia } from "elysia";

import { BookingService } from "./bookings.services";
import {
  CreateBookingDto,
  type ICreateBooking,
  type IListBooking,
  ListBookingDto,
} from "./bookings.interfaces";
import type { User } from "@prisma/client";
import { authenticateMiddleware } from "../../commons/middlewares/auth.middlewares";

const bookingService = new BookingService();

export const bookingRoutes = new Elysia({ prefix: "/bookings" })
  .get(
    "/",
    ({ query }: { query: IListBooking }) => bookingService.findAll(query),
    {
      query: ListBookingDto,
    }
  )
  .post(
    "/",
    ({ body, user }: { body: ICreateBooking; user: User }) =>
      bookingService.create(body, user.id),
    {
      beforeHandle: async (context) => {
        return await authenticateMiddleware(context);
      },
      body: CreateBookingDto,
    }
  );
