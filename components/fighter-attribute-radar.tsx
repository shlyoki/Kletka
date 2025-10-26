'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface FighterAttributeRadarProps {
  attributes?: { power: number; cardio: number; grappling: number; striking: number } | null;
}

export function FighterAttributeRadar({ attributes }: FighterAttributeRadarProps) {
  const chartData = attributes
    ? [
        { attribute: 'Power', value: attributes.power },
        { attribute: 'Cardio', value: attributes.cardio },
        { attribute: 'Grappling', value: attributes.grappling },
        { attribute: 'Striking', value: attributes.striking },
      ]
    : [];

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <header className="text-xs uppercase tracking-wide text-white/50">Attributes</header>
      <div className="mt-4 h-64">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-white/60">Coach ratings coming soon.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} outerRadius={90}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="attribute" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9ca3af" tick={{ fontSize: 10 }} />
              <Radar
                name="Rating"
                dataKey="value"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.35}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
