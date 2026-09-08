import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GARAGE, getStateColor, type City } from "@/lib/cities";

interface RouteMapProps {
  origin: City | null;
  destination: City | null;
  /** Rota real (lat/lng) pelas rodovias; quando ausente, linha reta tracejada */
  route?: [number, number][] | null;
}

function resolveColor(el: HTMLElement, uf: string) {
  const varName = `--${getStateColor(uf)}`;
  const value = getComputedStyle(el).getPropertyValue(varName).trim();
  return value || "#22c55e";
}

function pinIcon(color: string, label: string) {
  return L.divIcon({
    className: "",
    html: `<div style="display:grid;place-items:center;width:28px;height:28px;border-radius:9999px;background:${color};color:#0a0a0a;font:700 12px/1 system-ui,sans-serif;border:2px solid rgba(255,255,255,.85);box-shadow:0 2px 8px rgba(0,0,0,.5)">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function RouteMap({
  origin,
  destination,
  route,
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView([GARAGE.lat, GARAGE.lng], 6);
    const tiles = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      },
    ).addTo(map);
    tiles
      .getContainer()
      ?.style.setProperty(
        "filter",
        "invert(1) hue-rotate(180deg) brightness(0.85) contrast(1.1) saturate(0.7)",
      );
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    const el = containerRef.current;
    if (!map || !layer || !el) return;
    layer.clearLayers();

    const stops: Array<{
      city: City;
      label: string;
      color: string;
      title: string;
    }> = [
      {
        city: GARAGE,
        label: "1",
        color: resolveColor(el, GARAGE.uf),
        title: "Garagem — Ubá MG",
      },
    ];
    if (origin) {
      stops.push({
        city: origin,
        label: "2",
        color: resolveColor(el, origin.uf),
        title: `Origem — ${origin.name} - ${origin.uf}`,
      });
    }
    if (destination) {
      stops.push({
        city: destination,
        label: "3",
        color: resolveColor(el, destination.uf),
        title: `Destino — ${destination.name} - ${destination.uf}`,
      });
    }

    stops.forEach((s) => {
      L.marker([s.city.lat, s.city.lng], { icon: pinIcon(s.color, s.label) })
        .bindTooltip(s.title, { direction: "top", offset: [0, -16] })
        .addTo(layer);
    });

    const points = stops.map(
      (s) => [s.city.lat, s.city.lng] as [number, number],
    );
    if (route && route.length > 1) {
      // Trajeto real pelas rodovias
      L.polyline(route, { color: "#22c55e", weight: 5, opacity: 0.35 }).addTo(
        layer,
      );
      L.polyline(route, { color: "#22c55e", weight: 2.5, opacity: 1 }).addTo(
        layer,
      );
      map.fitBounds(L.latLngBounds(route).pad(0.2));
    } else if (points.length > 1) {
      L.polyline(points, {
        color: "#22c55e",
        weight: 3,
        opacity: 0.9,
        dashArray: "8 8",
      }).addTo(layer);
      map.fitBounds(L.latLngBounds(points).pad(0.25));
    } else {
      map.setView(points[0] ?? [GARAGE.lat, GARAGE.lng], 7);
    }
    setTimeout(() => map.invalidateSize(), 60);
  }, [origin, destination, route]);

  return (
    <div
      ref={containerRef}
      className="h-72 w-full sm:h-96"
      aria-label="Prévia do trajeto no mapa"
    />
  );
}
