import {
  BookingStatus,
  BookingType,
  type Instructor,
  type Machine,
} from "@prisma/client";
import prisma from "../../../prisma/prisma";
import type { ICreateBooking, IListBooking } from "./bookings.interfaces";

export class BookingService {
  async create(data: ICreateBooking, userId: string) {
    const { instructorId, machineId, startDate, endDate } = data;

    const entities = [
      {
        entityId: instructorId,
        type: BookingType.INSTRUCTOR,
        startDate,
        endDate,
        userId,
        status: BookingStatus.CONFIRMED,
      },
      {
        entityId: machineId,
        type: BookingType.MACHINE,
        startDate,
        endDate,
        userId,
        status: BookingStatus.CONFIRMED,
      },
    ];

    const toValidateEntity = entities.map((entity) => {
      return this.checkAvailability(
        entity.entityId,
        entity.type,
        entity.startDate,
        entity.endDate
      );
    });

    await Promise.all(toValidateEntity);

    const bookings = await prisma.booking.createMany({
      data: entities,
    });

    return bookings;
  }

  private async checkAvailability(
    entityId: string,
    type: BookingType,
    startDate: Date,
    endDate: Date
  ): Promise<void> {
    switch (type) {
      case BookingType.INSTRUCTOR:
        await this.checkInstructorAvailability(entityId, startDate, endDate);
        break;
      case BookingType.MACHINE:
        await this.checkMachineAvailability(entityId, startDate, endDate);
        break;
    }
  }

  private async checkInstructorAvailability(
    instructorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Instructor> {
    const instructor = await prisma.instructor.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) {
      throw new Error("Instructor not found");
    }

    const bookings = await prisma.booking.findMany({
      where: {
        entityId: instructorId,
        type: BookingType.INSTRUCTOR,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });

    if (bookings.length > 0) {
      throw new Error("Instructor is not available");
    }

    return instructor;
  }

  private async checkMachineAvailability(
    machineId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Machine> {
    const machine = await prisma.machine.findUnique({
      where: { id: machineId },
    });

    if (!machine) {
      throw new Error("Machine not found");
    }

    // 10mins cooldown between bookings
    const startDateCooldown = new Date(startDate.getTime() - 10 * 60 * 1000);
    const endDateCooldown = new Date(endDate.getTime() + 10 * 60 * 1000);

    const bookings = await prisma.booking.findMany({
      where: {
        entityId: machineId,
        type: BookingType.MACHINE,
        startDate: { lte: endDateCooldown },
        endDate: { gte: startDateCooldown },
      },
    });

    if (bookings.length > 0) {
      throw new Error("Machine is not available");
    }

    return machine;
  }

  async findAll(query: IListBooking) {
    const { page, perPage } = query;

    const whereQuery = {};

    const instructors = await prisma.booking.findMany({
      where: whereQuery,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.booking.count({
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
