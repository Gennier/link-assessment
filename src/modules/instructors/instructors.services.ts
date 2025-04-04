import { BookingType } from "@prisma/client";
import prisma from "../../../prisma/prisma";
import type { IListInstructor } from "./instructors.interfaces";

export class InstructorService {
  async findAll(query: IListInstructor) {
    const { page, perPage, email, startDate, endDate } = query;

    // Improvement: to add validation for startDate and endDate
    // Improvement: to allow only startDate as well as endDate as well as both
    console.log(startDate, endDate);
    if (startDate > endDate) {
      throw new Error("Start date must be before end date");
    }

    const bookedInstructors = await prisma.booking.findMany({
      where: {
        type: BookingType.INSTRUCTOR,
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
