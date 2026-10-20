import React from 'react';
import { DimensionKey, ScoreProfile } from '../types';
import { DIMENSION_INFO, DIMENSION_KEYS } from '../utils/scoringEngine';

/* ───────────────────────── Radar ───────────────────────── */

export const RadarChart: React.FC<{ profile: ScoreProfile; id?: string }> = ({
  profile,
  id = 'radar',
}) => {
  const size = 380;
  const c = size / 2;
  const R = 112;
  const n = DIMENSION_KEYS.length;

  const point = (i: number, pct: number, extra = 0) => {
    const a = ((Math.PI * 2) / n) * i - Math.PI / 2;
    const r = (pct / 100) * R + extra;
    return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
  };

  const poly = (pct: (k: DimensionKey, i: number) => number) =>
    DIMENSION_KEYS.map((k, i) => {
      const p = point(i, pct(k, i));
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');

  const userPoly = poly((k) => Math.max(8, profile.dimensions[k].percentage));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[420px] mx-auto" role="img" aria-label="Gráfico radar do seu perfil de liderança">
      <defs>
        <radialGradient id={`${id}-fill`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0.25" />
        </radialGradient>
        <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#EA580C" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* anéis */}
      {[25, 50, 75, 100].map((ring) => (
        <polygon
          key={ring}
          points={poly(() => ring)}
          fill={ring === 100 ? '#FFFBEB' : 'none'}
          stroke="#E7E5E4"
          strokeWidth={ring === 100 ? 1.8 : 1}
          strokeDasharray={ring === 100 ? undefined : '3 4'}
        />
      ))}
      {/* eixos */}
      {DIMENSION_KEYS.map((_, i) => {
        const p = point(i, 100);
        return <line key={i} x1={c} y1={c} x2={p.x} y2={p.y} stroke="#E7E5E4" strokeWidth="1" />;
      })}

      {/* área do jogador */}
      <polygon
        points={userPoly}
        fill={`url(#${id}-fill)`}
        stroke={`url(#${id}-stroke)`}
        strokeWidth="3.5"
        strokeLinejoin="round"
        filter={`url(#${id}-glow)`}
      />

      {/* pontos e rótulos */}
      {DIMENSION_KEYS.map((k, i) => {
        const info = DIMENSION_INFO[k];
        const pct = profile.dimensions[k].percentage;
        const p = point(i, Math.max(8, pct));
        const l = point(i, 100, 36);
        const isTop = profile.top.includes(k);
        return (
          <g key={k}>
            <circle cx={p.x} cy={p.y} r="6.5" fill={info.color} stroke="#fff" strokeWidth="2.5" />
            <circle cx={l.x} cy={l.y} r="20" fill={info.colorSoft} stroke={info.color} strokeWidth={isTop ? 2.5 : 1.2} />
            <text x={l.x} y={l.y + 5} textAnchor="middle" fontSize="17">
              {info.icon}
            </text>
            <text
              x={l.x}
              y={l.y + 36}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={info.color}
            >
              {pct}%
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ───────────────────────── Donut ───────────────────────── */

export const DonutChart: React.FC<{ profile: ScoreProfile }> = ({ profile }) => {
  const size = 220;
  const c = size / 2;
  const r = 78;
  const stroke = 26;
  const circ = 2 * Math.PI * r;
  const total = Math.max(1, profile.totalChoices);

  let offset = 0;
  const segments = profile.ranking
    .filter((k) => profile.dimensions[k].picks > 0)
    .map((k) => {
      const len = (profile.dimensions[k].picks / total) * circ;
      const seg = { key: k, len, offset };
      offset += len;
      return seg;
    });

  const topInfo = DIMENSION_INFO[profile.top[0]];

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[240px] h-auto" role="img" aria-label="Distribuição das suas escolhas por estilo">
        <circle cx={c} cy={c} r={r} fill="none" stroke="#F5F5F4" strokeWidth={stroke} />
        <g transform={`rotate(-90 ${c} ${c})`}>
          {segments.map((s) => (
            <circle
              key={s.key}
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={DIMENSION_INFO[s.key].color}
              strokeWidth={stroke}
              strokeDasharray={`${Math.max(0, s.len - 3)} ${circ - Math.max(0, s.len - 3)}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="butt"
            />
          ))}
        </g>
        <text x={c} y={c - 2} textAnchor="middle" fontSize="38">
          {topInfo.icon}
        </text>
        <text x={c} y={c + 24} textAnchor="middle" fontSize="12" fontWeight="800" fill="#57534E">
          {profile.totalChoices} escolhas
        </text>
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
        {profile.ranking
          .filter((k) => profile.dimensions[k].picks > 0)
          .map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-stone-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: DIMENSION_INFO[k].color }} />
              {DIMENSION_INFO[k].label.split(' ').slice(-1)[0]} · {profile.dimensions[k].picks}
            </span>
          ))}
      </div>
    </div>
  );
};

/* ───────────────────────── Barras ───────────────────────── */

export const DimensionBars: React.FC<{ profile: ScoreProfile; showDescription?: boolean }> = ({
  profile,
  showDescription = false,
}) => (
  <div className="space-y-3.5">
    {profile.ranking.map((k) => {
      const info = DIMENSION_INFO[k];
      const res = profile.dimensions[k];
      return (
        <div key={k}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="flex items-center gap-2 text-sm font-extrabold text-stone-800 min-w-0">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                style={{ background: info.colorSoft }}
              >
                {info.icon}
              </span>
              <span className="truncate">{info.label}</span>
            </span>
            <span className="text-sm font-black shrink-0" style={{ color: info.color }}>
              {res.percentage}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(3, res.percentage)}%`,
                background: `linear-gradient(90deg, ${info.color}99, ${info.color})`,
              }}
            />
          </div>
          {showDescription && (
            <p className="mt-1 text-xs text-stone-500 leading-snug">{info.description}</p>
          )}
        </div>
      );
    })}
  </div>
);
