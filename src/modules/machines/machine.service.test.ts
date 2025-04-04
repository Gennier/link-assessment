import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";
import { MachineService } from "./machines.services";
import { BookingStatus, BookingType, MachineType } from "@prisma/client";
import prisma from "../../../prisma/prisma";
import { BadRequestError } from "../../commons/errors/errors";

const mockedMachine1 = {
  id: "machine-1",
  name: "Machine 1",
  type: MachineType.BENCH_PRESS,
  location: "Location 1",
  description: "Description 1",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
const mockedMachine2 = {
  id: "machine-2",
  name: "Machine 2",
  type: MachineType.DUMBBELL,
  location: "Location 2",
  description: "Description 2",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockedMachines = [mockedMachine1, mockedMachine2];

// Mocking for prisma, with default values
mock.module("../../../prisma/prisma", () => {
  return {
    default: {
      booking: {
        findMany: mock(() => []),
      },
      machine: {
        findMany: mock(() => mockedMachines),
        count: mock(() => 2),
      },
    },
  };
});

describe("MachineService", () => {
  let machineService: MachineService;

  beforeEach(() => {
    machineService = new MachineService();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("findAll", () => {
    test("should return available machines with pagination metadata", async () => {
      const query = {
        page: 1,
        perPage: 10,
        startDate: new Date("2023-01-01T10:00:00Z"),
        endDate: new Date("2023-01-01T12:00:00Z"),
      };

      const result = await machineService.findAll(query);

      expect(result).toEqual({
        data: mockedMachines,
        metadata: {
          total: 2,
          page: 1,
          perPage: 10,
          totalPages: 1,
        },
      });

      expect(prisma.booking.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.booking.findMany).toHaveBeenCalledWith({
        where: {
          type: BookingType.MACHINE,
          status: BookingStatus.CONFIRMED,
          startDate: { lte: expect.any(Date) },
          endDate: { gte: expect.any(Date) },
        },
        select: {
          entityId: true,
        },
      });

      expect(prisma.machine.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.machine.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            notIn: [],
          },
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    test("should exclude booked machines from results", async () => {
      const query = {
        page: 1,
        perPage: 10,
        startDate: new Date("2023-01-01T10:00:00Z"),
        endDate: new Date("2023-01-01T12:00:00Z"),
      };

      // Mock booked machines
      (prisma.booking.findMany as any).mockImplementationOnce(() => [
        { entityId: "machine-3" },
        { entityId: "machine-4" },
      ]);

      await machineService.findAll(query);

      expect(prisma.machine.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            notIn: ["machine-3", "machine-4"],
          },
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    test("should throw error when start date is after end date", async () => {
      const query = {
        page: 1,
        perPage: 10,
        startDate: new Date("2023-01-01T14:00:00Z"), // Later than end date
        endDate: new Date("2023-01-01T12:00:00Z"),
      };

      expect(async () => {
        await machineService.findAll(query);
      }).toThrow(new BadRequestError("Start date must be before end date"));
    });
  });
});
