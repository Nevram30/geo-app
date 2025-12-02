# ZoniTrack+ 🗺️

**A Mobile-Enabled Geo-Intelligent Decision Support System for Location Assessment and Zoning Compliance with Land Use Suitability Analysis**

Municipal Planning and Development Office - Santo Tomas, Davao del Norte

---

## 📋 Overview

ZoniTrack+ is a comprehensive geo-intelligent decision support system built with the T3 Stack that automates zoning compliance checks, hazard zone detection, and spatial analysis for business permit applications.

### Key Features

✅ **Automated Zoning Compliance** - GIS-based validation of business locations against land use classifications and proximity rules

⚠️ **Hazard Zone Detection** - Automatically detect and flag applications in flood-prone or hazard-designated areas

📊 **Interactive Spatial Dashboards** - Monitor, filter, and analyze business application trends across all barangays

🎯 **Spatial Clustering Analysis** - Identify high-density business areas and support zoning adjustment recommendations

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Railway)
- **ORM**: [Prisma](https://www.prisma.io/)
- **API**: [tRPC](https://trpc.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **GIS Libraries**: 
  - [Leaflet](https://leafletjs.com/) - Interactive maps
  - [React Leaflet](https://react-leaflet.js.org/) - React components for Leaflet
  - [Turf.js](https://turfjs.org/) - Geospatial analysis

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database (or use Railway/Supabase)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd geo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and configure:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   AUTH_SECRET="your-secret-key"
   ```

4. **Run database migrations**
   ```bash
   npm run db:generate
   ```

5. **Seed the database with sample data**
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
geo-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Sample data seeder
│   └── migrations/            # Database migrations
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx          # Home page
│   │   ├── applications/     # Business applications
│   │   │   ├── page.tsx      # Applications list
│   │   │   └── new/          # New application form
│   │   ├── dashboard/        # Analytics dashboard
│   │   └── map/              # Interactive map view
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/      # tRPC API routes
│   │   │   │   ├── barangay.ts
│   │   │   │   ├── business.ts
│   │   │   │   ├── category.ts
│   │   │   │   ├── zone.ts
│   │   │   │   └── hazard.ts
│   │   │   ├── root.ts       # API router configuration
│   │   │   └── trpc.ts       # tRPC setup
│   │   ├── auth/             # Authentication
│   │   └── db.ts             # Database client
│   ├── trpc/                 # tRPC client setup
│   └── styles/               # Global styles
└── package.json
```

---

## 🗄️ Database Schema

### Core Models

- **Barangay** - Administrative divisions with boundaries
- **ZoneType** - Zoning classifications (R1, C1, I1, A1, etc.)
- **Zone** - Specific zones with GeoJSON polygons
- **BusinessCategory** - Business types with allowed zones
- **Business** - Business permit applications
- **HazardZone** - Flood, landslide, and other hazard areas
- **PointOfInterest** - Schools, churches, hospitals
- **ProximityRule** - Distance requirements between businesses

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Create migration
npm run db:push          # Push schema to database
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run typecheck        # Run TypeScript checks
npm run format:check     # Check code formatting
npm run format:write     # Format code
```

---

## 🎯 Core Features Implementation

### 1. Automated Zoning Compliance

The system automatically validates business locations using Turf.js:

```typescript
// Check if point is within zone polygon
const businessPoint = turf.point([longitude, latitude]);
const zonePolygon = turf.polygon(zone.boundary.coordinates);
const isInZone = turf.booleanPointInPolygon(businessPoint, zonePolygon);
```

### 2. Hazard Zone Detection

Automatically flags applications in hazard zones:

```typescript
// Check intersection with hazard zones
for (const hazard of hazardZones) {
  const hazardPolygon = turf.polygon(hazard.boundary.coordinates);
  if (turf.booleanPointInPolygon(businessPoint, hazardPolygon)) {
    riskFlags.push({
      type: "HAZARD_ZONE",
      severity: hazard.severity,
      message: `Location intersects with ${hazard.type} hazard zone`
    });
  }
}
```

### 3. Proximity Rules

Validates minimum distance requirements:

```typescript
// Check distance to nearby businesses
const distance = turf.distance(businessPoint, nearbyPoint, { units: "meters" });
if (distance < category.minDistance) {
  violations.push({ businessName, distance, required: category.minDistance });
}
```

---

## 📊 API Routes (tRPC)

### Business Routes
- `business.getAll` - Get all businesses with filters
- `business.getById` - Get single business details
- `business.create` - Submit new application (with auto-compliance checks)
- `business.updateStatus` - Update application status
- `business.getStats` - Get statistics dashboard data

### Barangay Routes
- `barangay.getAll` - Get all barangays
- `barangay.getById` - Get barangay details
- `barangay.create` - Create new barangay

### Zone Routes
- `zone.getAll` - Get all zones
- `zone.getZoneTypes` - Get zone classifications
- `zone.create` - Create new zone

### Hazard Routes
- `hazard.getAll` - Get all hazard zones
- `hazard.getByType` - Filter by hazard type
- `hazard.create` - Create new hazard zone

### Category Routes
- `category.getAll` - Get all business categories
- `category.create` - Create new category

---

## 🗺️ GIS Data Format

All spatial data uses GeoJSON format:

```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [125.648, 7.370],
      [125.650, 7.370],
      [125.650, 7.368],
      [125.648, 7.368],
      [125.648, 7.370]
    ]
  ]
}
```

---

## 🔐 Authentication

The system uses NextAuth.js for authentication. Configure providers in `src/server/auth/config.ts`.

---

## 📱 Mobile Support

The application is fully responsive and mobile-enabled with:
- Geolocation API for current location
- Touch-friendly map controls
- Responsive layouts for all screen sizes

---

## 🚧 Development Roadmap

### Phase 1: Foundation (✅ Complete)
- [x] Database schema design
- [x] API routes implementation
- [x] Basic UI pages
- [x] Automated compliance checks

### Phase 2: Advanced Features (In Progress)
- [ ] Interactive map dashboard with Leaflet
- [ ] Spatial clustering analysis
- [ ] Advanced filtering and search
- [ ] Report generation

### Phase 3: Enhancement
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Document management
- [ ] Advanced analytics

---

## 🤝 Contributing

This is a government project for the Municipal Planning and Development Office of Santo Tomas, Davao del Norte.

---

## 📄 License

Proprietary - Municipal Planning and Development Office, Santo Tomas, Davao del Norte

---

## 📞 Support

For technical support or inquiries, contact the Municipal Planning and Development Office.

---

## 🙏 Acknowledgments

- Municipal Planning and Development Office - Santo Tomas, Davao del Norte
- T3 Stack Community
- Open Source GIS Libraries (Leaflet, Turf.js)

---

**Built with ❤️ using the T3 Stack**
