"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// GIS libraries like Leaflet and GeoJSON use dynamic types that are difficult to strictly type

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Business {
  id: string;
  applicationNo: string;
  businessName: string;
  ownerName: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  barangay: { name: string };
  category: { name: string };
}

interface Zone {
  id: string;
  name: string;
  boundary: any;
  zoneType: {
    name: string;
    color: string | null;
  };
}

interface Hazard {
  id: string;
  name: string;
  type: string;
  severity: string;
  boundary: any;
  description: string | null;
}

interface MapViewProps {
  businesses: Business[];
  zones: Zone[];
  hazards: Hazard[];
  selectedLayers: {
    zones: boolean;
    hazards: boolean;
    businesses: boolean;
    heatmap?: boolean;
  };
}

export default function MapView({ businesses, zones, hazards, selectedLayers }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<{
    zones: L.LayerGroup;
    hazards: L.LayerGroup;
    businesses: L.LayerGroup;
    heatmap: L.LayerGroup;
  } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map centered on Santo Tomas, Davao del Norte
    const map = L.map(mapContainerRef.current).setView([7.37, 125.648], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add Santo Tomas municipality boundary highlight
    // Approximate boundary coordinates for Santo Tomas, Davao del Norte
    const santoTomasBoundary: L.LatLngExpression[] = [
      [7.45, 125.60],
      [7.45, 125.70],
      [7.30, 125.70],
      [7.30, 125.60],
      [7.45, 125.60],
    ];

    L.polygon(santoTomasBoundary, {
      color: "#3b82f6",
      weight: 4,
      opacity: 0.8,
      fillColor: "#3b82f6",
      fillOpacity: 0.05,
      dashArray: "10, 10",
      className: "municipality-boundary",
    }).addTo(map).bindPopup(`
      <div class="p-3">
        <h3 class="font-bold text-lg text-blue-900">Santo Tomas</h3>
        <p class="text-sm text-gray-600">Davao del Norte</p>
        <p class="text-xs text-gray-500 mt-1">Municipality Boundary</p>
      </div>
    `);

    // Create layer groups
    layersRef.current = {
      zones: L.layerGroup().addTo(map),
      hazards: L.layerGroup().addTo(map),
      businesses: L.layerGroup().addTo(map),
      heatmap: L.layerGroup().addTo(map),
    };

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update zones layer
  useEffect(() => {
    if (!layersRef.current || !selectedLayers.zones) {
      layersRef.current?.zones.clearLayers();
      return;
    }

    layersRef.current.zones.clearLayers();

    zones.forEach((zone) => {
      if (zone.boundary?.coordinates) {
        try {
          const coordinates = zone.boundary.coordinates[0].map((coord: number[]) => [
            coord[1],
            coord[0],
          ]);

          const polygon = L.polygon(coordinates, {
            color: zone.zoneType.color ?? "#3b82f6",
            fillColor: zone.zoneType.color ?? "#3b82f6",
            fillOpacity: 0.2,
            weight: 2,
          });

          polygon.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-gray-900">${zone.name}</h3>
              <p class="text-sm text-gray-600">Type: ${zone.zoneType.name}</p>
            </div>
          `);

          polygon.addTo(layersRef.current!.zones);
        } catch (error) {
          console.error("Error rendering zone:", zone.name, error);
        }
      }
    });
  }, [zones, selectedLayers.zones]);

  // Update hazards layer
  useEffect(() => {
    if (!layersRef.current || !selectedLayers.hazards) {
      layersRef.current?.hazards.clearLayers();
      return;
    }

    layersRef.current.hazards.clearLayers();

    hazards.forEach((hazard) => {
      if (hazard.boundary?.coordinates) {
        try {
          const coordinates = hazard.boundary.coordinates[0].map((coord: number[]) => [
            coord[1],
            coord[0],
          ]);

          const severityColors: Record<string, string> = {
            LOW: "#fbbf24",
            MODERATE: "#f97316",
            HIGH: "#ef4444",
            VERY_HIGH: "#991b1b",
          };

          const polygon = L.polygon(coordinates, {
            color: severityColors[hazard.severity] ?? "#ef4444",
            fillColor: severityColors[hazard.severity] ?? "#ef4444",
            fillOpacity: 0.3,
            weight: 2,
            dashArray: "5, 5",
          });

          polygon.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-red-900">${hazard.name}</h3>
              <p class="text-sm text-gray-600">Type: ${hazard.type}</p>
              <p class="text-sm text-gray-600">Severity: ${hazard.severity}</p>
              ${hazard.description ? `<p class="text-xs text-gray-500 mt-1">${hazard.description}</p>` : ""}
            </div>
          `);

          polygon.addTo(layersRef.current!.hazards);
        } catch (error) {
          console.error("Error rendering hazard:", hazard.name, error);
        }
      }
    });
  }, [hazards, selectedLayers.hazards]);

  // Update businesses layer
  useEffect(() => {
    if (!layersRef.current || !selectedLayers.businesses) {
      layersRef.current?.businesses.clearLayers();
      return;
    }

    layersRef.current.businesses.clearLayers();

    businesses.forEach((business) => {
      const statusColors: Record<string, string> = {
        APPROVED: "#22c55e",
        PENDING: "#eab308",
        UNDER_REVIEW: "#3b82f6",
        REJECTED: "#ef4444",
        REQUIRES_REVISION: "#f97316",
      };

      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background-color: ${statusColors[business.status] ?? "#6b7280"};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([business.latitude, business.longitude], { icon });

      marker.bindPopup(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-gray-900 mb-1">${business.businessName}</h3>
          <div class="space-y-1 text-sm text-gray-600">
            <p><strong>App No:</strong> ${business.applicationNo}</p>
            <p><strong>Owner:</strong> ${business.ownerName}</p>
            <p><strong>Category:</strong> ${business.category.name}</p>
            <p><strong>Barangay:</strong> ${business.barangay.name}</p>
            <p><strong>Address:</strong> ${business.address}</p>
            <p class="mt-2">
              <span class="inline-block px-2 py-1 text-xs font-semibold rounded" style="
                background-color: ${statusColors[business.status]}20;
                color: ${statusColors[business.status]};
              ">
                ${business.status.replace("_", " ")}
              </span>
            </p>
          </div>
          <a href="/applications/${business.id}" class="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800">
            View Details →
          </a>
        </div>
      `);

      marker.addTo(layersRef.current!.businesses);
    });
  }, [businesses, selectedLayers.businesses]);

  // Update heatmap layer
  useEffect(() => {
    if (!layersRef.current || !selectedLayers.heatmap) {
      layersRef.current?.heatmap.clearLayers();
      return;
    }

    layersRef.current.heatmap.clearLayers();

    // Only show heatmap for approved businesses
    const approvedBusinesses = businesses.filter(b => b.status === "APPROVED");
    
    if (approvedBusinesses.length === 0) return;

    // Calculate density using grid-based approach
    const gridSize = 0.01; // approximately 1km
    const densityMap = new Map<string, { lat: number; lng: number; count: number }>();

    approvedBusinesses.forEach((business) => {
      const gridX = Math.floor(business.latitude / gridSize);
      const gridY = Math.floor(business.longitude / gridSize);
      const key = `${gridX},${gridY}`;
      
      if (!densityMap.has(key)) {
        densityMap.set(key, {
          lat: (gridX + 0.5) * gridSize,
          lng: (gridY + 0.5) * gridSize,
          count: 0,
        });
      }
      
      const cell = densityMap.get(key)!;
      cell.count++;
    });

    // Find max count for normalization
    const maxCount = Math.max(...Array.from(densityMap.values()).map(c => c.count));

    // Create heatmap circles
    densityMap.forEach((cell) => {
      const intensity = cell.count / maxCount;
      const radius = 500 + (intensity * 500); // 500m to 1000m radius
      const opacity = 0.2 + (intensity * 0.4); // 0.2 to 0.6 opacity

      // Color gradient from yellow to red
      const hue = 60 - (intensity * 60); // 60 (yellow) to 0 (red)
      const color = `hsl(${hue}, 100%, 50%)`;

      const circle = L.circle([cell.lat, cell.lng], {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: opacity,
        weight: 1,
        opacity: opacity + 0.2,
      });

      circle.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-gray-900">Business Density</h3>
          <p class="text-sm text-gray-600">${cell.count} business${cell.count > 1 ? 'es' : ''} in this area</p>
          <p class="text-xs text-gray-500 mt-1">Intensity: ${(intensity * 100).toFixed(0)}%</p>
        </div>
      `);

      circle.addTo(layersRef.current!.heatmap);
    });
  }, [businesses, selectedLayers.heatmap]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Loading indicator */}
      {(!businesses.length && !zones.length && !hazards.length) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm text-gray-600">Loading map data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
