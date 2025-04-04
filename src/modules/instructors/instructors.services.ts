import { BookingStatus, BookingType } from "@prisma/client";
import prisma from "../../../prisma/prisma";
import type { IListInstructor } from "./instructors.interfaces";
import { BadRequestError } from "../../commons/errors/errors";

export class InstructorService {
  async findAll(query: IListInstructor) {
    const { page, perPage, email, startDate, endDate } = query;

    // Improvement: to add validation for startDate and endDate
    // Improvement: to allow only startDate as well as endDate as well as both

    if (startDate > endDate) {
      throw new BadRequestError("Start date must be before end date");
    }

    // To fetch all overlapping instructors
    const bookedInstructors = await prisma.booking.findMany({
      where: {
        type: BookingType.INSTRUCTOR,
        status: BookingStatus.CONFIRMED,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
      select: {
        entityId: true,
      },
    });

    const bookedInstructorIds = bookedInstructors.map(
      (booking) => booking.entityId
    );

    const whereQuery = {
      ...(email && { email: { contains: email } }),
      id: {
        notIn: bookedInstructorIds,
      },
    };

    const instructors = await prisma.instructor.findMany({
      where: whereQuery,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.instructor.count({
      where: whereQuery,
    });

    return {
      data: instructors,
      metadata: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
}
