import { BookingStatus, BookingType } from "@prisma/client";
import prisma from "../../../prisma/prisma";
import type { IListMachine } from "./machines.interfaces";
import { BadRequestError } from "../../commons/errors/errors";

export class MachineService {
  async findAll(query: IListMachine) {
    const { page, perPage, startDate, endDate } = query;

    // Improvement: to add validation for startDate and endDate
    // Improvement: to allow only startDate as well as endDate as well as both

    // 10mins cooldown between bookings (same as in bookings service)
    const startDateCooldown = new Date(
      new Date(startDate).getTime() - 10 * 60 * 1000
    );
    const endDateCooldown = new Date(
      new Date(endDate).getTime() + 10 * 60 * 1000
    );

    if (startDateCooldown > endDateCooldown) {
      throw new BadRequestError("Start date must be before end date");
    }

    // To fetch all overlapping machines
    // If user search 8AM to 12PM, but there is a booked machine between 11AM to 1PM, then that machien will not be returned
    // Solution: To maybe list all and return their booked times to user, so frontend can grey out those booked machines
    const bookedMachines = await prisma.booking.findMany({
      where: {
        type: BookingType.MACHINE,
        status: BookingStatus.CONFIRMED,
        startDate: { lte: endDateCooldown },
        endDate: { gte: startDateCooldown },
      },
      select: {
        entityId: true,
      },
    });

    const bookedMachineIds = bookedMachines.map((booking) => booking.entityId);

    const whereQuery = {
      id: {
        notIn: bookedMachineIds,
      },
    };

    const machines = await prisma.machine.findMany({
      where: whereQuery,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.machine.count({
      where: whereQuery,
    });

    return {
      data: machines,
      metadata: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
}
