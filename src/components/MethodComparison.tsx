import { TrendingUp, DollarSign, Clock, ArrowUpDown, Gem } from "lucide-react";
import type { RefiningData } from "../uex-api";
import { RATING_LABELS } from "../data/refineries";

function RatingDots({ value, max = 3, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-all ${
            i < value ? color : "bg-dark-700"
          }`}
        />
      ))}
    </div>
  );
}

export default function MethodComparison({ data }: { data: RefiningData }) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ArrowUpDown size={18} className="text-accent-purple" />
        Method Comparison
      </h2>
      <p className="text-sm text-text-dim mb-6">
        All 9 refining methods compared. Higher yield = more refined output. Higher speed = faster
        processing. Lower cost = cheaper.
      </p>

      <div className="overflow-x-auto -mx-1.5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left py-3 px-3 text-text-dim font-medium">Method</th>
              <th className="text-center py-3 px-3 text-text-dim font-medium">
                <span className="flex items-center justify-center gap-1">
                  <TrendingUp size={12} /> Yield
                </span>
              </th>
              <th className="text-center py-3 px-3 text-text-dim font-medium">
                <span className="flex items-center justify-center gap-1">
                  <DollarSign size={12} /> Cost
                </span>
              </th>
              <th className="text-center py-3 px-3 text-text-dim font-medium">
                <span className="flex items-center justify-center gap-1">
                  <Clock size={12} /> Speed
                </span>
              </th>
              <th className="text-center py-3 px-3 text-text-dim font-medium">Best For</th>
            </tr>
          </thead>
          <tbody>
            {data.methods.map((method) => {
              const bestFor =
                method.ratingYield === 3 && method.ratingCost <= 2
                  ? "Max Profit"
                  : method.ratingSpeed === 3 && method.ratingYield >= 1
                    ? "Quick Runs"
                    : method.ratingCost === 1
                      ? "Budget"
                      : method.ratingYield >= 2 && method.ratingSpeed >= 2
                        ? "Balanced"
                        : "Niche";
              const bestForColor =
                bestFor === "Max Profit"
                  ? "text-accent-green bg-accent-green/10"
                  : bestFor === "Quick Runs"
                    ? "text-accent-blue bg-accent-blue/10"
                    : bestFor === "Budget"
                      ? "text-accent-amber bg-accent-amber/10"
                      : bestFor === "Balanced"
                        ? "text-accent-purple bg-accent-purple/10"
                        : "text-text-muted bg-dark-700";

              return (
                <tr
                  key={method.id}
                  className="border-b border-dark-700/50 hover:bg-dark-800/50 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="font-medium">{method.name}</div>
                    <div className="font-mono text-xs text-text-muted">{method.code}</div>
                  </td>
                  <td className="py-3 px-3">
                    <RatingDots value={method.ratingYield} color="bg-accent-green" />
                    <div className="text-xs text-center mt-1 text-text-muted font-mono">
                      {RATING_LABELS[method.ratingYield]}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <RatingDots
                      value={method.ratingCost}
                      color={method.ratingCost <= 1 ? "bg-accent-green" : method.ratingCost === 2 ? "bg-accent-amber" : "bg-accent-red"}
                    />
                    <div className="text-xs text-center mt-1 text-text-muted font-mono">
                      {RATING_LABELS[method.ratingCost]}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <RatingDots value={method.ratingSpeed} color="bg-accent-blue" />
                    <div className="text-xs text-center mt-1 text-text-muted font-mono">
                      {RATING_LABELS[method.ratingSpeed]}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${bestForColor}`}
                    >
                      {bestFor}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-accent-green/20 bg-accent-green/5">
          <div className="flex items-center gap-2 mb-2">
            <Gem size={16} className="text-accent-green" />
            <span className="font-semibold text-sm text-accent-green">Best Yield</span>
          </div>
          <div className="text-sm text-text-secondary">
            {data.methods
              .filter((m) => m.ratingYield === 3)
              .map((m) => m.name)
              .join(", ")}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-accent-amber/20 bg-accent-amber/5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-accent-amber" />
            <span className="font-semibold text-sm text-accent-amber">Cheapest</span>
          </div>
          <div className="text-sm text-text-secondary">
            {data.methods
              .filter((m) => m.ratingCost === 1)
              .map((m) => m.name)
              .join(", ")}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-accent-blue/20 bg-accent-blue/5">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-accent-blue" />
            <span className="font-semibold text-sm text-accent-blue">Fastest</span>
          </div>
          <div className="text-sm text-text-secondary">
            {data.methods
              .filter((m) => m.ratingSpeed === 3)
              .map((m) => m.name)
              .join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
}
