export const branchSeeds = [
  {
    id: "lana-plaza",
    name: "Robot Cafe - Lana Plaza",
    shortName: "Lana Plaza",
    address: "Lana Plaza, Oloitoktok Rd, Nairobi",
    reservationInbox: "reservations@robotcafe.co.ke",
    reservationRoutingLabel: "Lana Plaza reservation desk",
    diaryPlaceName: "Robot Cafe - Lana Plaza",
  },
  {
    id: "imaara-mall",
    name: "Robot Cafe - Imaara Mall",
    shortName: "Imaara Mall",
    address: "Ground Floor, Imaara Mall along Mombasa Road",
    reservationInbox: "imaara.reservations@robotcafe.co.ke",
    reservationRoutingLabel: "Imaara Mall reservation desk",
    diaryPlaceName: "Robot Cafe - Imaara Mall",
  },
];

export async function ensureBranches(prisma) {
  await Promise.all(
    branchSeeds.map((branch) =>
      prisma.branch.upsert({
        where: { id: branch.id },
        update: branch,
        create: branch,
      })
    )
  );
}
