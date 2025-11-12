import { PrismaClient, Severity } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding 100 fake emergency markers...");

  const severities = Object.values(Severity);

  const markers = Array.from({ length: 100 }).map(() => ({
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    latitude: faker.location.latitude({
      max: 9.923749,
      min: 8.2,
    }),
    longitude: faker.location.longitude({
      max: 126.671778,
      min: 125.671778,
    }),
    contact_number: faker.phone.imei(),
    landmarks: Array.from({ length: 3 }).map(() =>
      faker.location.cardinalDirection()
    ),
    severity: faker.helpers.arrayElement(severities),
  }));

  await prisma.emergencyMarker.createMany({
    data: markers,
  });

  console.log("✅ Done seeding 100 EmergencyMarker records!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
