export const mockInvoices = [
  {
    id: 11,
    clientNumber: "7005400387",
    referenceMonth: "NOV/2023",
    createdAt: new Date("2024-05-21T22:50:34.446Z").toISOString(),
    electricEnergyId: 11,
    sceeEnergyId: 10,
    compensatedEnergyId: 6,
    municipalPublicLightingContributionId: 11,
    electricEnergy: {
      id: 11,
      quantity: 50,
      value: 47.62,
      createdAt: new Date("2024-05-21T22:50:34.452Z").toISOString(),
    },
    sceeEnergy: {
      id: 10,
      quantity: 625,
      value: 317.65,
      createdAt: new Date("2024-05-21T22:50:34.462Z").toISOString(),
    },
    compensatedEnergy: {
      id: 6,
      quantity: 625,
      value: -304.58,
      createdAt: new Date("2024-05-21T22:50:34.478Z").toISOString(),
    },
    municipalPublicLightingContribution: {
      id: 11,
      value: 49.43,
      createdAt: new Date("2024-05-21T22:50:34.493Z").toISOString(),
    },
  },
];
