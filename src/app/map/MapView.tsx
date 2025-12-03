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
    // Coordinates: 7.5093° N, 125.6314° E (7°32'02"N, 125°37'25"E)
    const map = L.map(mapContainerRef.current).setView([7.5093, 125.6314], 14);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add Santo Tomas municipality boundary highlight
    // Approximate boundary coordinates for Santo Tomas, Davao del Norte
    // Centered around 7.5093° N, 125.6314° E
    const santoTomasBoundary: L.LatLngExpression[] = [
      [7.58, 125.58],
      [7.58, 125.68],
      [7.44, 125.68],
      [7.44, 125.58],
      [7.58, 125.58],
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
      <div class="p-4 min-w-[280px]">
        <h3 class="font-bold text-xl text-blue-900 mb-2">Municipality of Santo Tomas</h3>
        <div class="space-y-2 text-sm">
          <div class="border-b border-gray-200 pb-2">
            <p class="text-gray-700"><strong>Province:</strong> Davao del Norte</p>
            <p class="text-gray-700"><strong>Region:</strong> Region XI (Davao Region)</p>
          </div>
          <div class="border-b border-gray-200 pb-2">
            <p class="text-gray-600"><strong>Coordinates:</strong></p>
            <p class="text-xs text-gray-500 ml-2">7.5093° N, 125.6314° E</p>
            <p class="text-xs text-gray-500 ml-2">(7°32'02"N, 125°37'25"E)</p>
          </div>
          <div class="bg-blue-50 p-2 rounded">
            <p class="text-xs text-blue-800 font-medium">📍 Municipality Boundary</p>
            <p class="text-xs text-blue-600 mt-1">Zoning and business permit tracking area</p>
          </div>
        </div>
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
            <div class="p-4 min-w-[260px]">
              <h3 class="font-bold text-lg text-gray-900 mb-2">🏘️ ${zone.name}</h3>
              <div class="space-y-2 text-sm">
                <div class="bg-blue-50 p-2 rounded">
                  <p class="text-gray-700"><strong>Zone Type:</strong> ${zone.zoneType.name}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <div style="width: 20px; height: 20px; background-color: ${zone.zoneType.color ?? "#3b82f6"}; border-radius: 4px; border: 1px solid #ddd;"></div>
                    <span class="text-xs text-gray-500">Zone Color</span>
                  </div>
                </div>
                <div class="border-t border-gray-200 pt-2">
                  <p class="text-xs text-gray-600"><strong>Zone ID:</strong> ${zone.id}</p>
                  <p class="text-xs text-gray-500 mt-1">📍 Click to view zone regulations and permitted business types</p>
                </div>
              </div>
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

          const severityIcons: Record<string, string> = {
            LOW: "⚠️",
            MODERATE: "⚠️",
            HIGH: "🚨",
            VERY_HIGH: "🔴",
          };

          const severityLabels: Record<string, string> = {
            LOW: "Low Risk",
            MODERATE: "Moderate Risk",
            HIGH: "High Risk",
            VERY_HIGH: "Very High Risk",
          };

          polygon.bindPopup(`
            <div class="p-4 min-w-[280px]">
              <h3 class="font-bold text-lg text-red-900 mb-2">${severityIcons[hazard.severity] ?? "⚠️"} ${hazard.name}</h3>
              <div class="space-y-2 text-sm">
                <div class="bg-red-50 p-2 rounded border border-red-200">
                  <p class="text-gray-700"><strong>Hazard Type:</strong> ${hazard.type}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <div style="width: 20px; height: 20px; background-color: ${severityColors[hazard.severity] ?? "#ef4444"}; border-radius: 4px; border: 1px solid #ddd;"></div>
                    <span class="text-xs font-semibold" style="color: ${severityColors[hazard.severity] ?? "#ef4444"};">${severityLabels[hazard.severity] ?? hazard.severity}</span>
                  </div>
                </div>
                ${hazard.description ? `
                <div class="border-t border-gray-200 pt-2">
                  <p class="text-xs text-gray-700"><strong>Description:</strong></p>
                  <p class="text-xs text-gray-600 mt-1">${hazard.description}</p>
                </div>
                ` : ""}
                <div class="border-t border-gray-200 pt-2">
                  <p class="text-xs text-gray-600"><strong>Hazard ID:</strong> ${hazard.id}</p>
                  <p class="text-xs text-orange-600 mt-1 font-medium">⚠️ Business permits in this area require additional safety compliance</p>
                </div>
              </div>
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

      // Create popup that opens on hover and stays open with close button
      const popup = L.popup({
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
        className: 'custom-hover-popup',
        maxWidth: 320
      }).setContent(`
        <div class="p-4 min-w-[280px]">
          <h3 class="font-bold text-lg text-gray-900 mb-2">🏢 ${business.businessName}</h3>
          <div class="space-y-2 text-sm">
            <div class="bg-slate-50 p-2 rounded border border-slate-200">
              <p class="text-gray-700"><strong>Application No:</strong> ${business.applicationNo}</p>
              <p class="text-gray-700"><strong>Business ID:</strong> ${business.id}</p>
            </div>
            
            <div class="border-t border-gray-200 pt-2">
              <p class="text-gray-700"><strong>👤 Owner:</strong> ${business.ownerName}</p>
              <p class="text-gray-700"><strong>📂 Category:</strong> ${business.category.name}</p>
            </div>
            
            <div class="border-t border-gray-200 pt-2">
              <p class="text-gray-700"><strong>📍 Location:</strong></p>
              <p class="text-xs text-gray-600 ml-2 mt-1">${business.address}</p>
              <p class="text-xs text-gray-600 ml-2"><strong>Barangay:</strong> ${business.barangay.name}</p>
              <p class="text-xs text-gray-500 ml-2 mt-1"><strong>Coordinates:</strong></p>
              <p class="text-xs text-gray-500 ml-4">${business.latitude.toFixed(6)}° N, ${business.longitude.toFixed(6)}° E</p>
            </div>
            
            <div class="border-t border-gray-200 pt-2">
              <p class="text-xs text-gray-700 mb-1"><strong>Permit Status:</strong></p>
              <span class="inline-block px-3 py-1.5 text-xs font-semibold rounded-lg" style="
                background-color: ${statusColors[business.status]}20;
                color: ${statusColors[business.status]};
                border: 1px solid ${statusColors[business.status]}40;
              ">
                ${business.status.replace("_", " ")}
              </span>
            </div>
          </div>
          <a href="/applications/${business.id}" class="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-semibold hover:underline">
            View Full Details →
          </a>
        </div>
      `);

      marker.bindPopup(popup);

      // Open popup on hover
      marker.on('mouseover', function(this: L.Marker) {
        this.openPopup();
      });

      // Don't close popup on mouseout - user must click close button
      // This allows users to interact with the popup content

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
