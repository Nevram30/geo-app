import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create Barangays
  console.log("Creating barangays...");
  const barangays = await Promise.all([
    prisma.barangay.create({
      data: {
        name: "Poblacion",
        code: "BRG-001",
        population: 5000,
        area: 2.5,
      },
    }),
    prisma.barangay.create({
      data: {
        name: "Kimamon",
        code: "BRG-002",
        population: 3500,
        area: 3.2,
      },
    }),
    prisma.barangay.create({
      data: {
        name: "Salvacion",
        code: "BRG-003",
        population: 4200,
        area: 2.8,
      },
    }),
    prisma.barangay.create({
      data: {
        name: "Tulalian",
        code: "BRG-004",
        population: 2800,
        area: 4.1,
      },
    }),
  ]);
  console.log(`✅ Created ${barangays.length} barangays`);

  // Create Zone Types
  console.log("Creating zone types...");
  const zoneTypes = await Promise.all([
    prisma.zoneType.create({
      data: {
        code: "R1",
        name: "Residential Low Density",
        description: "Single-family residential areas",
        color: "#90EE90",
      },
    }),
    prisma.zoneType.create({
      data: {
        code: "R2",
        name: "Residential Medium Density",
        description: "Multi-family residential areas",
        color: "#98FB98",
      },
    }),
    prisma.zoneType.create({
      data: {
        code: "C1",
        name: "Commercial",
        description: "Retail and commercial establishments",
        color: "#FFB6C1",
      },
    }),
    prisma.zoneType.create({
      data: {
        code: "I1",
        name: "Light Industrial",
        description: "Light manufacturing and warehousing",
        color: "#DDA0DD",
      },
    }),
    prisma.zoneType.create({
      data: {
        code: "A1",
        name: "Agricultural",
        description: "Farming and agricultural use",
        color: "#F0E68C",
      },
    }),
  ]);
  console.log(`✅ Created ${zoneTypes.length} zone types`);

  // Create Zones (sample polygons for Santo Tomas area)
  // Centered around 7.5093° N, 125.6314° E
  console.log("Creating zones...");
  const zones = await Promise.all([
    prisma.zone.create({
      data: {
        name: "Poblacion Commercial District",
        zoneTypeId: zoneTypes[2].id, // C1
        boundary: {
          type: "Polygon",
          coordinates: [
            [
              [125.6314, 7.5093],
              [125.6344, 7.5093],
              [125.6344, 7.5063],
              [125.6314, 7.5063],
              [125.6314, 7.5093],
            ],
          ],
        },
        area: 50000,
      },
    }),
    prisma.zone.create({
      data: {
        name: "Kimamon Residential Area",
        zoneTypeId: zoneTypes[0].id, // R1
        boundary: {
          type: "Polygon",
          coordinates: [
            [
              [125.6284, 7.5143],
              [125.6314, 7.5143],
              [125.6314, 7.5113],
              [125.6284, 7.5113],
              [125.6284, 7.5143],
            ],
          ],
        },
        area: 75000,
      },
    }),
    prisma.zone.create({
      data: {
        name: "Salvacion Agricultural Zone",
        zoneTypeId: zoneTypes[4].id, // A1
        boundary: {
          type: "Polygon",
          coordinates: [
            [
              [125.6364, 7.5043],
              [125.6414, 7.5043],
              [125.6414, 7.4993],
              [125.6364, 7.4993],
              [125.6364, 7.5043],
            ],
          ],
        },
        area: 120000,
      },
    }),
  ]);
  console.log(`✅ Created ${zones.length} zones`);

  // Create Business Categories
  console.log("Creating business categories...");
  const categories = await Promise.all([
    prisma.businessCategory.create({
      data: {
        name: "Retail Store",
        code: "CAT-001",
        description: "General merchandise and retail",
        allowedZones: ["C1", "R2"],
        minDistance: 50,
      },
    }),
    prisma.businessCategory.create({
      data: {
        name: "Restaurant",
        code: "CAT-002",
        description: "Food service establishments",
        allowedZones: ["C1"],
        minDistance: 100,
      },
    }),
    prisma.businessCategory.create({
      data: {
        name: "Sari-Sari Store",
        code: "CAT-003",
        description: "Small neighborhood convenience store",
        allowedZones: ["R1", "R2", "C1"],
        minDistance: 25,
      },
    }),
    prisma.businessCategory.create({
      data: {
        name: "Manufacturing",
        code: "CAT-004",
        description: "Light manufacturing facility",
        allowedZones: ["I1"],
        minDistance: 200,
      },
    }),
    prisma.businessCategory.create({
      data: {
        name: "Agricultural Supply",
        code: "CAT-005",
        description: "Farm supplies and equipment",
        allowedZones: ["A1", "C1"],
        minDistance: 100,
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} business categories`);

  // Create Hazard Zones
  // Centered around Santo Tomas coordinates
  console.log("Creating hazard zones...");
  const hazardZones = await Promise.all([
    prisma.hazardZone.create({
      data: {
        name: "Tulalian Creek Flood Zone",
        type: "FLOOD",
        severity: "HIGH",
        barangayId: barangays[3].id,
        boundary: {
          type: "Polygon",
          coordinates: [
            [
              [125.6294, 7.5123],
              [125.6324, 7.5123],
              [125.6324, 7.5103],
              [125.6294, 7.5103],
              [125.6294, 7.5123],
            ],
          ],
        },
        description: "Flood-prone area near Tulalian Creek",
        source: "Municipal Disaster Risk Reduction Office",
      },
    }),
    prisma.hazardZone.create({
      data: {
        name: "Salvacion Landslide Risk Area",
        type: "LANDSLIDE",
        severity: "MODERATE",
        barangayId: barangays[2].id,
        boundary: {
          type: "Polygon",
          coordinates: [
            [
              [125.6374, 7.5023],
              [125.6394, 7.5023],
              [125.6394, 7.5003],
              [125.6374, 7.5003],
              [125.6374, 7.5023],
            ],
          ],
        },
        description: "Moderate landslide risk in hilly terrain",
        source: "Provincial Geohazard Assessment",
      },
    }),
  ]);
  console.log(`✅ Created ${hazardZones.length} hazard zones`);

  // Create sample businesses
  // Using Santo Tomas coordinates: 7.5093° N, 125.6314° E
  console.log("Creating sample businesses...");
  const businesses = await Promise.all([
    prisma.business.create({
      data: {
        applicationNo: "BA-2025-00001",
        businessName: "Santo Tomas General Merchandise",
        ownerName: "Juan Dela Cruz",
        ownerContact: "09171234567",
        ownerEmail: "juan@example.com",
        address: "Main Street, Poblacion, Santo Tomas",
        barangayId: barangays[0].id,
        latitude: 7.5078,
        longitude: 125.6329,
        categoryId: categories[0].id,
        description: "General merchandise store",
        zoneId: zones[0].id,
        status: "APPROVED",
        complianceChecks: {
          zoneCheck: { passed: true, message: "Business category allowed in this zone" },
          proximityCheck: { passed: true, violations: [] },
          hazardCheck: { passed: true, hazards: [] },
        },
        approvedAt: new Date(),
      },
    }),
    prisma.business.create({
      data: {
        applicationNo: "BA-2025-00002",
        businessName: "Kimamon Sari-Sari Store",
        ownerName: "Maria Santos",
        ownerContact: "09187654321",
        address: "Purok 3, Kimamon, Santo Tomas",
        barangayId: barangays[1].id,
        latitude: 7.5128,
        longitude: 125.6299,
        categoryId: categories[2].id,
        description: "Neighborhood convenience store",
        zoneId: zones[1].id,
        status: "APPROVED",
        complianceChecks: {
          zoneCheck: { passed: true, message: "Business category allowed in this zone" },
          proximityCheck: { passed: true, violations: [] },
          hazardCheck: { passed: true, hazards: [] },
        },
        approvedAt: new Date(),
      },
    }),
    prisma.business.create({
      data: {
        applicationNo: "BA-2025-00003",
        businessName: "Poblacion Restaurant",
        ownerName: "Pedro Reyes",
        ownerContact: "09191112222",
        ownerEmail: "pedro@example.com",
        address: "Commercial Area, Poblacion, Santo Tomas",
        barangayId: barangays[0].id,
        latitude: 7.5085,
        longitude: 125.6320,
        categoryId: categories[1].id,
        description: "Filipino cuisine restaurant",
        zoneId: zones[0].id,
        status: "PENDING",
        complianceChecks: {
          zoneCheck: { passed: true, message: "Business category allowed in this zone" },
          proximityCheck: { passed: true, violations: [] },
          hazardCheck: { passed: true, hazards: [] },
        },
      },
    }),
    prisma.business.create({
      data: {
        applicationNo: "BA-2025-00004",
        businessName: "Salvacion Agri-Supply",
        ownerName: "Rosa Martinez",
        ownerContact: "09181234567",
        ownerEmail: "rosa@example.com",
        address: "National Highway, Salvacion, Santo Tomas",
        barangayId: barangays[2].id,
        latitude: 7.5018,
        longitude: 125.6389,
        categoryId: categories[4].id,
        description: "Agricultural supplies and equipment",
        zoneId: zones[2].id,
        status: "APPROVED",
        complianceChecks: {
          zoneCheck: { passed: true, message: "Business category allowed in this zone" },
          proximityCheck: { passed: true, violations: [] },
          hazardCheck: { passed: true, hazards: [] },
        },
        approvedAt: new Date(),
      },
    }),
    prisma.business.create({
      data: {
        applicationNo: "BA-2025-00005",
        businessName: "Tulalian Mini Mart",
        ownerName: "Carlos Ramos",
        ownerContact: "09171112233",
        address: "Barangay Road, Tulalian, Santo Tomas",
        barangayId: barangays[3].id,
        latitude: 7.5113,
        longitude: 125.6309,
        categoryId: categories[2].id,
        description: "Convenience store and mini mart",
        zoneId: zones[1].id,
        status: "UNDER_REVIEW",
        complianceChecks: {
          zoneCheck: { passed: true, message: "Business category allowed in this zone" },
          proximityCheck: { passed: true, violations: [] },
          hazardCheck: { passed: false, hazards: ["Located near flood zone"] },
        },
      },
    }),
  ]);
  console.log(`✅ Created ${businesses.length} sample businesses`);

  console.log("✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
