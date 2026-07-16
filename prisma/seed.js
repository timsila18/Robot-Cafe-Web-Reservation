import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const branches = [
  {
    id: "lana-plaza",
    name: "Robot Cafe - Lana Plaza",
    shortName: "Lana Plaza",
    address: "Lana Plaza, Oloitoktok Rd, Nairobi",
    phone: "0769 30 30 30",
    phoneIntl: "+254 769 303030",
    reservationInbox: "reservations@robotcafe.co.ke",
    reservationRoutingLabel: "Lana Plaza reservation desk",
    diaryPlaceName: "Robot Cafe - Lana Plaza",
  },
  {
    id: "imaara-mall",
    name: "Robot Cafe - Imaara Mall",
    shortName: "Imaara Mall",
    address: "Ground Floor, Imaara Mall along Mombasa Road",
    phone: "0140 30 30 30",
    phoneIntl: "+254 140 303030",
    reservationInbox: "imaara.reservations@robotcafe.co.ke",
    reservationRoutingLabel: "Imaara Mall reservation desk",
    diaryPlaceName: "Robot Cafe - Imaara Mall",
  },
];

async function main() {
  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { id: branch.id },
      update: branch,
      create: branch,
    });
  }

  const count = await prisma.branch.count();
  console.log(`Seeded ${count} Robot Cafe branches.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
