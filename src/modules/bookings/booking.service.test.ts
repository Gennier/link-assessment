import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";
import { BookingService } from "./bookings.services";
import { BookingStatus, BookingType } from "@prisma/client";
import prisma from "../../../prisma/prisma";

// Improvements: Add test for integration test with prisma

// Mocking for prisma, with default values
mock.module("../../../prisma/prisma", () => {
  return {
    default: {
      booking: {
        createMany: mock(() => ({ count: 2 })),
        findMany: mock(() => []),
      },
      instructor: {
        findUnique: mock(() => ({
          id: "instructor-id",
          name: "Test Instructor",
        })),
      },
      machine: {
        findUnique: mock(() => ({ id: "machine-id", name: "Test Machine" })),
      },
    },
  };
});

describe("BookingService", () => {
  let bookingService: BookingService;

  beforeEach(() => {
    bookingService = new BookingService();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("create", () => {
    test("should create bookings for both instructor and machine", async () => {
      const bookingData = {
        instructorId: "instructor-id",
        machineId: "machine-id",
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      };
      const userId = "user-id";

      const result = await bookingService.create(bookingData, userId);

      expect(result).toEqual({ count: 2 });
      expect(prisma.booking.createMany).toHaveBeenCalledTimes(1);
      expect(prisma.booking.createMany).toHaveBeenCalledWith({
        data: [
          {
            entityId: "instructor-id",
            type: BookingType.INSTRUCTOR,
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            userId,
            status: BookingStatus.CONFIRMED,
          },
          {
            entityId: "machine-id",
            type: BookingType.MACHINE,
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            userId,
            status: BookingStatus.CONFIRMED,
          },
        ],
      });
    });

    test("should throw error when instructor is not available", async () => {
      const bookingData = {
        instructorId: "instructor-id",
        machineId: "machine-id",
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      };
      const userId = "user-id";

      // Mock instructor is booked
      (prisma.booking.findMany as any).mockImplementationOnce(() => [
        { id: "booking-id" },
      ]);

      await expect(bookingService.create(bookingData, userId)).rejects.toThrow(
        "Instructor is not available"
      );
    });

    test("should throw error when machine is not available", async () => {
      const bookingData = {
        instructorId: "instructor-id",
        machineId: "machine-id",
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      };
      const userId = "user-id";

      // First call for instructor availability (returns [])
      // Second call for machine availability (returns a booking)
      (prisma.booking.findMany as any).mockImplementationOnce(() => []);
      (prisma.booking.findMany as any).mockImplementationOnce(() => [
        { id: "booking-id" },
      ]);

      await expect(bookingService.create(bookingData, userId)).rejects.toThrow(
        "Machine is not available"
      );
    });

    test("should throw error when instructor is not found", async () => {
      const bookingData = {
        instructorId: "non-existent-id",
        machineId: "machine-id",
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      };
      const userId = "user-id";

      // Mock instructor not found
      (prisma.instructor.findUnique as any).mockImplementationOnce(() => null);

      await expect(bookingService.create(bookingData, userId)).rejects.toThrow(
        "Instructor not found"
      );
    });

    test("should throw error when machine is not found", async () => {
      const bookingData = {
        instructorId: "instructor-id",
        machineId: "non-existent-id",
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      };
      const userId = "user-id";

      // Instructor lookup succeeds, but machine lookup fails
      (prisma.booking.findMany as any).mockImplementationOnce(() => []); // No instructor bookings found
      (prisma.machine.findUnique as any).mockImplementationOnce(() => null); // Machine not found

      await expect(bookingService.create(bookingData, userId)).rejects.toThrow(
        "Machine not found"
      );
    });
  });
});
