import { useState, useMemo } from "react";
import { Search, TrendingUp, Clock, DollarSign } from "lucide-react";
import type { RefiningData } from "../uex-api";
import { RATING_LABELS } from "../data/refineries";

type SortKey = "yield" | "cost" | "speed";

export default function Optimizer({ data }: { data: RefiningData }) {
  const [search, setSearch] = useState("");
  const [selectedOreId, setSelectedOreId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("yield");

  const filteredOres = useMemo(
    () =>
      data.ores.filter(
        (o) =>
          o.name.toLowerCase().includes(search.toLowerCase()) ||
          o.code.toLowerCase().includes(search.toLowerCase())
      ),
    [data.ores, search]
  );

  const selectedOre = useMemo(
    () => data.ores.find((o) => o.rawId === selectedOreId) ?? null,
    [data.ores, selectedOreId]
  );

  const sorted = useMemo(() => {
    const methods = [...data.methods];
    switch (sortBy) {
      case "yield":
        return methods.sort((a, b) => b.ratingYield - a.ratingYield || a.ratingCost - b.ratingCost);
      case "cost":
        return methods.sort((a, b) => a.ratingCost - b.ratingCost || b.ratingYield - a.ratingYield);
      case "speed":
        return methods.sort((a, b) => b.ratingSpeed - a.ratingSpeed || b.ratingYield - a.ratingYield);
    }
  }, [data.methods, sortBy]);

  const yieldColor = (val: number) =>
    val === 3 ? "text-accent-green" : val === 2 ? "text-accent-amber" : "text-accent-red";
  const costColor = (val: number) =>
    val === 1 ? "text-accent-green" : val === 2 ? "text-accent-amber" : "text-accent-red";
  const speedColor = (val: number) =>
    val === 3 ? "text-accent-green" : val === 2 ? "text-accent-amber" : "text-accent-red";

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search size={18} className="text-accent-blue" />
          Select Ore
        </h2>
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search ores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
          {filteredOres.map((ore) => (
            <button
              key={ore.rawId}
              onClick={() => setSelectedOreId(ore.rawId === selectedOreId ? null : ore.rawId)}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                ore.rawId === selectedOreId
                  ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                  : "border-dark-700 bg-dark-800/50 text-text-secondary hover:border-dark-600 hover:bg-dark-700/50"
              }`}
            >
              <span className="font-medium block truncate">{ore.name}</span>
              <span className="font-mono text-xs text-text-muted">
                {ore.refinedPriceSell.toLocaleString()} aUEC
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp size={18} className="text-accent-green" />
            {selectedOre ? `Best Methods for ${selectedOre.name}` : "All Methods Ranked"}
          </h2>
          <div className="flex gap-1">
            {(["yield", "cost", "speed"] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  sortBy === key
                    ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/30"
                    : "bg-dark-800 text-text-dim border border-dark-700 hover:bg-dark-700"
                }`}
              >
                {key === "yield" && <TrendingUp size={12} />}
                {key === "cost" && <DollarSign size={12} />}
                {key === "speed" && <Clock size={12} />}
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {sorted.map((method, idx) => (
            <div
              key={method.id}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                idx === 0
                  ? "border-accent-green/30 bg-accent-green/5"
                  : "border-dark-700 bg-dark-800/30"
              }`}
            >
              <span
                className={`font-mono text-lg font-bold w-8 text-center ${
                  idx === 0 ? "text-accent-green" : "text-text-muted"
                }`}
              >
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{method.name}</div>
                <span className="font-mono text-xs text-text-muted">{method.code}</span>
              </div>
              <div className="flex gap-6 text-xs">
                <div className="text-center">
                  <div className="text-text-muted mb-0.5 flex items-center gap-1">
                    <TrendingUp size={10} /> Yield
                  </div>
                  <div className={`font-mono font-semibold ${yieldColor(method.ratingYield)}`}>
                    {RATING_LABELS[method.ratingYield]}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-text-muted mb-0.5 flex items-center gap-1">
                    <DollarSign size={10} /> Cost
                  </div>
                  <div className={`font-mono font-semibold ${costColor(method.ratingCost)}`}>
                    {RATING_LABELS[method.ratingCost]}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-text-muted mb-0.5 flex items-center gap-1">
                    <Clock size={10} /> Speed
                  </div>
                  <div className={`font-mono font-semibold ${speedColor(method.ratingSpeed)}`}>
                    {RATING_LABELS[method.ratingSpeed]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
