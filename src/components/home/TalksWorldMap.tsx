import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTalks } from "@/hooks/use-content";
import { Globe, MapPin, X, Calendar, Mic, Users, Headphones, MessageSquare } from "lucide-react";

// Country name → approximate [lat, lng] center
const COUNTRY_COORDS: Record<string, [number, number]> = {
  Armenia: [40.2, 44.5],
  Russia: [61.5, 90.0],
  USA: [37.1, -95.7],
  "United States": [37.1, -95.7],
  Germany: [51.2, 10.4],
  France: [46.2, 2.2],
  "United Kingdom": [55.4, -3.4],
  UK: [55.4, -3.4],
  Spain: [40.5, -3.7],
  Italy: [41.9, 12.6],
  Netherlands: [52.1, 5.3],
  Poland: [51.9, 19.1],
  Ukraine: [48.4, 31.2],
  Georgia: [42.3, 43.4],
  Azerbaijan: [40.1, 47.6],
  Turkey: [38.9, 35.2],
  UAE: [23.4, 53.8],
  "United Arab Emirates": [23.4, 53.8],
  India: [20.6, 78.9],
  China: [35.9, 104.2],
  Japan: [36.2, 138.3],
  Singapore: [1.4, 103.8],
  Thailand: [15.9, 100.9],
  "South Korea": [35.9, 127.8],
  Australia: [-25.3, 133.8],
  Canada: [56.1, -106.3],
  Brazil: [-14.2, -51.9],
  Mexico: [23.6, -102.6],
  Argentina: [-38.4, -63.6],
  "Czech Republic": [49.8, 15.5],
  Romania: [45.9, 24.9],
  Hungary: [47.2, 19.5],
  Sweden: [60.1, 18.6],
  Norway: [60.5, 8.5],
  Finland: [61.9, 25.7],
  Denmark: [56.3, 9.5],
  Switzerland: [46.8, 8.2],
  Austria: [47.5, 14.6],
  Belgium: [50.5, 4.5],
  Portugal: [39.4, -8.2],
  Greece: [39.1, 21.8],
  Serbia: [44.0, 21.0],
  Kazakhstan: [48.0, 66.9],
  Uzbekistan: [41.4, 64.6],
  Belarus: [53.7, 27.9],
  Lithuania: [55.2, 23.9],
  Latvia: [56.9, 24.6],
  Estonia: [58.6, 25.0],
  Israel: [31.0, 34.9],
  Egypt: [26.8, 30.8],
  "South Africa": [-30.6, 22.9],
  Nigeria: [9.1, 8.7],
  Morocco: [31.8, -7.1],
};

// Simple equirectangular projection to SVG coords
function latLngToXY(lat: number, lng: number, w: number, h: number): [number, number] {
  const x = ((lng + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return [x, y];
}

const TYPE_ICON: Record<string, typeof Mic> = {
  "Conference Talk": Mic,
  Keynote: Mic,
  Workshop: Mic,
  "Panel Discussion": Users,
  Podcast: Headphones,
  Interview: MessageSquare,
};

export function TalksWorldMap() {
  const { data: talks = [] } = useTalks();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const W = 800;
  const H = 400;

  // Group talks by country
  const byCountry = useMemo(() => {
    const map: Record<string, typeof talks> = {};
    for (const t of talks) {
      if (!t.country) continue;
      if (!map[t.country]) map[t.country] = [];
      map[t.country].push(t);
    }
    return map;
  }, [talks]);

  const countries = Object.keys(byCountry);
  const selectedTalks = selectedCountry ? (byCountry[selectedCountry] ?? []) : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Globe className="h-5 w-5 text-accent" />
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Global footprint
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          {talks.length} appearances · {countries.length} countries
        </h2>
        <p className="mt-2 text-muted-foreground">Click a marker to see events in that country.</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          {/* Map */}
          <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ background: "transparent" }}>
              {/* Simple world land masses as filled rect approximation — use a minimal world SVG path */}
              <rect x="0" y="0" width={W} height={H} fill="oklch(0.18 0.03 265)" />

              {/* Latitude grid lines */}
              {[-60, -30, 0, 30, 60].map((lat) => {
                const [, y] = latLngToXY(lat, 0, W, H);
                return (
                  <line
                    key={lat}
                    x1={0}
                    y1={y}
                    x2={W}
                    y2={y}
                    stroke="oklch(0.32 0.03 265)"
                    strokeWidth="0.5"
                    strokeDasharray={lat === 0 ? "none" : "4 4"}
                  />
                );
              })}
              {/* Longitude grid lines */}
              {[-120, -60, 0, 60, 120].map((lng) => {
                const [x] = latLngToXY(0, lng, W, H);
                return (
                  <line
                    key={lng}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={H}
                    stroke="oklch(0.32 0.03 265)"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Country markers */}
              {countries.map((country) => {
                const coords = COUNTRY_COORDS[country];
                if (!coords) return null;
                const [x, y] = latLngToXY(coords[0], coords[1], W, H);
                const count = byCountry[country].length;
                const isSelected = selectedCountry === country;
                const r = Math.min(4 + count * 1.5, 16);
                return (
                  <g
                    key={country}
                    onClick={() => setSelectedCountry(isSelected ? null : country)}
                    className="cursor-pointer"
                  >
                    <circle cx={x} cy={y} r={r + 6} fill="transparent" />
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? r + 3 : r}
                      fill={isSelected ? "oklch(0.72 0.14 210)" : "oklch(0.55 0.22 295)"}
                      fillOpacity={isSelected ? 0.95 : 0.85}
                      stroke={isSelected ? "oklch(0.90 0.08 210)" : "oklch(0.75 0.12 295)"}
                      strokeWidth={isSelected ? 2 : 1}
                      className="transition-all duration-200"
                    />
                    {count > 1 && (
                      <text
                        x={x}
                        y={y + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={r > 8 ? "8" : "6"}
                        fill="white"
                        fontWeight="600"
                        pointerEvents="none"
                      >
                        {count}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-xl border border-border bg-card/80 px-3 py-2 backdrop-blur text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />1 event
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-primary" />
                Multiple
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                Selected
              </span>
            </div>
          </div>

          {/* Selected country panel */}
          <AnimatePresence>
            {selectedCountry && selectedTalks.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-border"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <h3 className="font-display text-lg font-semibold">{selectedCountry}</h3>
                      <span className="text-xs text-muted-foreground">
                        ({selectedTalks.length} {selectedTalks.length === 1 ? "event" : "events"})
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedCountry(null)}
                      className="rounded-full p-1.5 hover:bg-muted transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {selectedTalks
                      .sort((a, b) => (b.event_date ?? "").localeCompare(a.event_date ?? ""))
                      .map((t) => {
                        const Icon = TYPE_ICON[t.type ?? ""] ?? Mic;
                        return (
                          <div
                            key={t.id}
                            className="rounded-xl border border-border bg-background p-4"
                          >
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Icon className="h-3.5 w-3.5 text-accent" />
                              <span>{t.type}</span>
                              {t.event_date && (
                                <>
                                  <span>·</span>
                                  <Calendar className="h-3 w-3" />
                                  <span>{t.event_date}</span>
                                </>
                              )}
                            </div>
                            <p className="mt-2 text-sm font-medium leading-snug">
                              {t.title_en ?? t.title_hy ?? t.title_ru}
                            </p>
                            {t.organization && (
                              <p className="mt-1 text-xs text-muted-foreground">{t.organization}</p>
                            )}
                            {t.city && (
                              <p className="mt-1 text-xs text-muted-foreground">{t.city}</p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
