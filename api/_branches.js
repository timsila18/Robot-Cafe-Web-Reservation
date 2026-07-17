export const branchSeeds = [
  {
    id: "lana-plaza",
    name: "Robot Cafe - Lana Plaza",
    shortName: "Lana Plaza",
    address: "Lana Plaza, Oloitoktok Rd, Nairobi",
    phone: "0769 30 30 30",
    phoneIntl: "+254 769 303030",
    reservationInbox: "reservation@robotcafe.co.ke",
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
    reservationInbox: "reservation@robotcafe.co.ke",
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
