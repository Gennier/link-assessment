import { PrismaClient, MachineType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.instructor.deleteMany({});
  await prisma.machine.deleteMany({});

  // Seed Machines
  const machines = [
    {
      name: "Bench Press Station 1",
      type: MachineType.BENCH_PRESS,
      location: "Weight Room - Section A",
      description:
        "Professional grade bench press with adjustable settings and safety spotters.",
    },
    {
      name: "Dumbbell Rack - Light",
      type: MachineType.DUMBBELL,
      location: "Free Weights Area",
      description: "Set of dumbbells ranging from 5lbs to 30lbs.",
    },
    {
      name: "Olympic Barbell Set 1",
      type: MachineType.BARBELL,
      location: "Weight Room - Section B",
      description: "Olympic barbell with weight plates from 2.5kg to 25kg.",
    },
    {
      name: "Squat Rack 1",
      type: MachineType.SQUAT_MACHINE,
      location: "Weight Room - Section C",
      description:
        "Heavy-duty squat rack with adjustable safety bars and weight storage.",
    },
    {
      name: "Leg Press Machine 1",
      type: MachineType.LEG_PRESS_MACHINE,
      location: "Leg Area - Section A",
      description:
        "Hydraulic leg press machine with adjustable seat and weight stack.",
    },
    {
      name: "Leg Extension Machine 1",
      type: MachineType.LEG_EXTENSION_MACHINE,
      location: "Leg Area - Section B",
      description: "Isolated leg extension machine for quadriceps development.",
    },
    {
      name: "Leg Curl Machine 1",
      type: MachineType.LEG_CURL_MACHINE,
      location: "Leg Area - Section B",
      description: "Isolated leg curl machine for hamstring development.",
    },
  ];

  await prisma.machine.createMany({
    data: machines,
  });

  console.log("Machines seeded successfully");

  // Seed Instructors
  const instructors = [
    {
      name: "John Smith",
      email: "john@gym.com",
      phoneNumber: "6011222222",
      ratePerHour: 45.55,
    },
    {
      name: "Sarah Sim",
      email: "sarah@gym.com",
      phoneNumber: "6011244444",
      ratePerHour: 50.2,
    },
    {
      name: "Mike Test",
      email: "mike@gym.com",
      phoneNumber: "6011666666",
      ratePerHour: 55,
    },
    {
      name: "Emily Wong",
      email: "emily@gym.com",
      phoneNumber: "6011888888",
      ratePerHour: 48.99,
    },
    {
      name: "David Chew",
      email: "david@gym.com",
      phoneNumber: "601156239811",
      ratePerHour: 52.0,
    },
  ];

  await prisma.instructor.createMany({
    data: instructors,
  });

  console.log("Instructors seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
