import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create Admin User
  console.log("Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@santotomas.gov.ph" },
    update: {},
    create: {
      email: "admin@santotomas.gov.ph",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Created admin user: ${adminUser.email}`);
  console.log(`   Password: admin123`);

  // Create Barangays
  console.log("Creating barangays...");
  const barangays = await Promise.all([
    prisma.barangay.upsert({
      where: { code: "BRG-001" },
      update: {},
      create: {
        name: "Poblacion",
        code: "BRG-001",
        population: 5000,
        area: 2.5,
      },
    }),
    prisma.barangay.upsert({
      where: { code: "BRG-002" },
      update: {},
      create: {
        name: "Kimamon",
        code: "BRG-002",
        population: 3500,
        area: 3.2,
      },
    }),
    prisma.barangay.upsert({
      where: { code: "BRG-003" },
      update: {},
      create: {
        name: "Salvacion",
        code: "BRG-003",
        population: 4200,
        area: 2.8,
      },
    }),
    prisma.barangay.upsert({
      where: { code: "BRG-004" },
      update: {},
      create: {
        name: "Tulalian",
        code: "BRG-004",
        population: 2800,
        area: 4.1,
      },
    }),
  ]);
  console.log(`✅ Created ${barangays.length} barangays`);

  // Create Zone Types - Official Zoning Map 2007-2016
  // Based on Municipality of Sto. Tomas Urban Zoning Map
  console.log("Creating official zone types...");
  const zoneTypes = await Promise.all([
    prisma.zoneType.upsert({
      where: { code: "RZ" },
      update: {
        name: "Residential Zone",
        description: "Areas designated for residential development and housing",
        color: "#FFFF00",
      },
      create: {
        code: "RZ",
        name: "Residential Zone",
        description: "Areas designated for residential development and housing",
        color: "#FFFF00",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "SHZ" },
      update: {
        name: "Socialized Housing Zone",
        description: "Areas for socialized housing and low-cost residential development",
        color: "#F5DEB3",
      },
      create: {
        code: "SHZ",
        name: "Socialized Housing Zone",
        description: "Areas for socialized housing and low-cost residential development",
        color: "#F5DEB3",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "CZ" },
      update: {
        name: "Commercial Zone",
        description: "Areas designated for commercial and business establishments",
        color: "#DC143C",
      },
      create: {
        code: "CZ",
        name: "Commercial Zone",
        description: "Areas designated for commercial and business establishments",
        color: "#DC143C",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "IZ" },
      update: {
        name: "Institutional Zone",
        description: "Areas for government offices, schools, hospitals, and other institutions",
        color: "#4169E1",
      },
      create: {
        code: "IZ",
        name: "Institutional Zone",
        description: "Areas for government offices, schools, hospitals, and other institutions",
        color: "#4169E1",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "MIZ" },
      update: {
        name: "Medium Industrial Zone",
        description: "Areas designated for medium-scale industrial and manufacturing activities",
        color: "#9932CC",
      },
      create: {
        code: "MIZ",
        name: "Medium Industrial Zone",
        description: "Areas designated for medium-scale industrial and manufacturing activities",
        color: "#9932CC",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "AZ" },
      update: {
        name: "Agricultural Zone",
        description: "Areas preserved for agricultural production and farming activities",
        color: "#228B22",
      },
      create: {
        code: "AZ",
        name: "Agricultural Zone",
        description: "Areas preserved for agricultural production and farming activities",
        color: "#228B22",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "AIZ" },
      update: {
        name: "Agro-Industrial Zone",
        description: "Areas for agro-based industries and food processing",
        color: "#8B008B",
      },
      create: {
        code: "AIZ",
        name: "Agro-Industrial Zone",
        description: "Areas for agro-based industries and food processing",
        color: "#8B008B",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "PRTZ" },
      update: {
        name: "Parks, Recreational and Tourism Zone",
        description: "Areas for parks, recreation facilities, and tourism development",
        color: "#7CFC00",
      },
      create: {
        code: "PRTZ",
        name: "Parks, Recreational and Tourism Zone",
        description: "Areas for parks, recreation facilities, and tourism development",
        color: "#7CFC00",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "WZ" },
      update: {
        name: "Water Zone",
        description: "Waterways, rivers, and water bodies",
        color: "#4682B4",
      },
      create: {
        code: "WZ",
        name: "Water Zone",
        description: "Waterways, rivers, and water bodies",
        color: "#4682B4",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "FZ" },
      update: {
        name: "Forest Zone",
        description: "Forest reserves and protected forest areas",
        color: "#006400",
      },
      create: {
        code: "FZ",
        name: "Forest Zone",
        description: "Forest reserves and protected forest areas",
        color: "#006400",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "OUZ" },
      update: {
        name: "Other Use Zone",
        description: "Areas for special or mixed-use purposes",
        color: "#808080",
      },
      create: {
        code: "OUZ",
        name: "Other Use Zone",
        description: "Areas for special or mixed-use purposes",
        color: "#808080",
      },
    }),
    prisma.zoneType.upsert({
      where: { code: "TZ" },
      update: {
        name: "Tourist Zone",
        description: "Areas designated for tourism development and attractions",
        color: "#00CED1",
      },
      create: {
        code: "TZ",
        name: "Tourist Zone",
        description: "Areas designated for tourism development and attractions",
        color: "#00CED1",
      },
    }),
  ]);
  console.log(`✅ Created ${zoneTypes.length} official zone types`);

  // Create Zones (sample polygons for Santo Tomas area)
  // Centered around 7.5093° N, 125.6314° E
  console.log("Creating zones...");
  
  // Check if zones exist first
  const existingZone1 = await prisma.zone.findFirst({
    where: { name: "Poblacion Commercial District" },
  });
  const existingZone2 = await prisma.zone.findFirst({
    where: { name: "Kimamon Residential Area" },
  });
  const existingZone3 = await prisma.zone.findFirst({
    where: { name: "Salvacion Agricultural Zone" },
  });

  const zones = [
    existingZone1 || await prisma.zone.create({
      data: {
        name: "Poblacion Commercial District",
        zoneTypeId: zoneTypes[2]!.id, // CZ - Commercial Zone
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
    existingZone2 || await prisma.zone.create({
      data: {
        name: "Kimamon Residential Area",
        zoneTypeId: zoneTypes[0]!.id, // RZ - Residential Zone
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
    existingZone3 || await prisma.zone.create({
      data: {
        name: "Salvacion Agricultural Zone",
        zoneTypeId: zoneTypes[5]!.id, // AZ - Agricultural Zone
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
  ];
  console.log(`✅ Created ${zones.length} zones`);

  // Create Business Categories
  console.log("Creating business categories...");
  const categories = await Promise.all([
    prisma.businessCategory.upsert({
      where: { code: "CAT-001" },
      update: {
        allowedZones: ["CZ", "RZ"],
      },
      create: {
        name: "Retail Store",
        code: "CAT-001",
        description: "General merchandise and retail",
        allowedZones: ["CZ", "RZ"],
        minDistance: 50,
      },
    }),
    prisma.businessCategory.upsert({
      where: { code: "CAT-002" },
      update: {
        allowedZones: ["CZ", "TZ"],
      },
      create: {
        name: "Restaurant",
        code: "CAT-002",
        description: "Food service establishments",
        allowedZones: ["CZ", "TZ"],
        minDistance: 100,
      },
    }),
    prisma.businessCategory.upsert({
      where: { code: "CAT-003" },
      update: {
        allowedZones: ["RZ", "SHZ", "CZ"],
      },
      create: {
        name: "Sari-Sari Store",
        code: "CAT-003",
        description: "Small neighborhood convenience store",
        allowedZones: ["RZ", "SHZ", "CZ"],
        minDistance: 25,
      },
    }),
    prisma.businessCategory.upsert({
      where: { code: "CAT-004" },
      update: {
        allowedZones: ["MIZ", "AIZ"],
      },
      create: {
        name: "Manufacturing",
        code: "CAT-004",
        description: "Light manufacturing facility",
        allowedZones: ["MIZ", "AIZ"],
        minDistance: 200,
      },
    }),
    prisma.businessCategory.upsert({
      where: { code: "CAT-005" },
      update: {
        allowedZones: ["AZ", "AIZ", "CZ"],
      },
      create: {
        name: "Agricultural Supply",
        code: "CAT-005",
        description: "Farm supplies and equipment",
        allowedZones: ["AZ", "AIZ", "CZ"],
        minDistance: 100,
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} business categories`);

  // Create Hazard Zones
  // Centered around Santo Tomas coordinates
  console.log("Creating hazard zones...");
  
  const existingHazard1 = await prisma.hazardZone.findFirst({
    where: { name: "Tulalian Creek Flood Zone" },
  });
  const existingHazard2 = await prisma.hazardZone.findFirst({
    where: { name: "Salvacion Landslide Risk Area" },
  });

  const hazardZones = [
    existingHazard1 || await prisma.hazardZone.create({
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
    existingHazard2 || await prisma.hazardZone.create({
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
  ];
  console.log(`✅ Created ${hazardZones.length} hazard zones`);

  // Create sample businesses
  // Using Santo Tomas coordinates: 7.5093° N, 125.6314° E
  console.log("Creating sample businesses...");
  const businesses = await Promise.all([
    prisma.business.upsert({
      where: { applicationNo: "BA-2025-00001" },
      update: {},
      create: {
        applicationNo: "BA-2025-00001",
        businessName: "Santo Tomas General Merchandise",
        ownerName: "Juan Dela Cruz",
        ownerContact: "09171234567",
        ownerEmail: "juan@example.com",
        address: "Main Street, Poblacion, Santo Tomas",
        barangayId: barangays[0]!.id,
        latitude: 7.5078,
        longitude: 125.6329,
        categoryId: categories[0]!.id,
        description: "General merchandise store",
        zoneId: zones[0]!.id,
        status: "APPROVED",
        complianceChecks: {
          zoneCheck: { passed: true, message: "Business category allowed in this zone" },
          proximityCheck: { passed: true, violations: [] },
          hazardCheck: { passed: true, hazards: [] },
        },
        approvedAt: new Date(),
      },
    }),
    prisma.business.upsert({
      where: { applicationNo: "BA-2025-00002" },
      update: {},
      create: {
        applicationNo: "BA-2025-00002",
        businessName: "Kimamon Sari-Sari Store",
        ownerName: "Maria Santos",
        ownerContact: "09187654321",
        address: "Purok 3, Kimamon, Santo Tomas",
        barangayId: barangays[1]!.id,
        latitude: 7.5128,
        longitude: 125.6299,
        categoryId: categories[2]!.id,
        description: "Neighborhood convenience store",
        zoneId: zones[1]!.id,
        status: "APPROVED",
        complianceChecks: {
          zoneCheck: { passed: true, message: "Business category allowed in this zone" },
          proximityCheck: { passed: true, violations: [] },
          hazardCheck: { passed: true, hazards: [] },
        },
        approvedAt: new Date(),
      },
    }),
    prisma.business.upsert({
      where: { applicationNo: "BA-2025-00003" },
      update: {},
      create: {
        applicationNo: "BA-2025-00003",
        businessName: "Poblacion Restaurant",
        ownerName: "Pedro Reyes",
        ownerContact: "09191112222",
        ownerEmail: "pedro@example.com",
        address: "Commercial Area, Poblacion, Santo Tomas",
        barangayId: barangays[0]!.id,
        latitude: 7.5085,
        longitude: 125.6320,
        categoryId: categories[1]!.id,
        description: "Filipino cuisine restaurant",
        zoneId: zones[0]!.id,
        status: "PENDING",
        complianceChecks: {
          zoneCheck: { passed: true, message: "Business category allowed in this zone" },
          proximityCheck: { passed: true, violations: [] },
          hazardCheck: { passed: true, hazards: [] },
        },
      },
    }),
    prisma.business.upsert({
      where: { applicationNo: "BA-2025-00004" },
      update: {},
      create: {
        applicationNo: "BA-2025-00004",
        businessName: "Salvacion Agri-Supply",
        ownerName: "Rosa Martinez",
        ownerContact: "09181234567",
        ownerEmail: "rosa@example.com",
        address: "National Highway, Salvacion, Santo Tomas",
        barangayId: barangays[2]!.id,
        latitude: 7.5018,
        longitude: 125.6389,
        categoryId: categories[4]!.id,
        description: "Agricultural supplies and equipment",
        zoneId: zones[2]!.id,
        status: "APPROVED",
        complianceChecks: {
          zoneCheck: { passed: true, message: "Business category allowed in this zone" },
          proximityCheck: { passed: true, violations: [] },
          hazardCheck: { passed: true, hazards: [] },
        },
        approvedAt: new Date(),
      },
    }),
    prisma.business.upsert({
      where: { applicationNo: "BA-2025-00005" },
      update: {},
      create: {
        applicationNo: "BA-2025-00005",
        businessName: "Tulalian Mini Mart",
        ownerName: "Carlos Ramos",
        ownerContact: "09171112233",
        address: "Barangay Road, Tulalian, Santo Tomas",
        barangayId: barangays[3]!.id,
        latitude: 7.5113,
        longitude: 125.6309,
        categoryId: categories[2]!.id,
        description: "Convenience store and mini mart",
        zoneId: zones[1]!.id,
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
