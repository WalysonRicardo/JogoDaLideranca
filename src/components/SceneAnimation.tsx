import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Mood, PersonItem, SCENES, SceneItem } from '../data/scenes';

const SKIN = ['#F9D3B4', '#F2C27F', '#B97A4E', '#6A412B'];

const Person: React.FC<{ p: PersonItem }> = ({ p }) => {
  const skin = SKIN[p.skin ?? 2];
  const hair = p.hair ?? '#2A1F1A';
  const mood: Mood = p.mood ?? 'ok';
  const gray = hair.toLowerCase() === '#d6d6d6';
  return (
    <svg viewBox="0 0 60 100" className="w-full h-auto block" style={p.flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      {/* pernas e corpo */}
      <rect x="18" y="68" width="10" height="28" rx="5" fill="#2F5D9E" />
      <rect x="32" y="68" width="10" height="28" rx="5" fill="#2F5D9E" />
      <rect x="14" y="38" width="32" height="38" rx="14" fill={p.c} />
      <rect x="7" y="42" width="9" height="28" rx="4.5" fill={skin} />
      <rect x="44" y="42" width="9" height="28" rx="4.5" fill={skin} />
      {/* cabeça */}
      <rect x="19" y="8" width="22" height="28" rx="11" fill={skin} />
      <path
        d={gray ? 'M18 20 C18 2 42 2 42 20 C38 12 22 12 18 20Z' : 'M18 22 C16 2 44 2 42 22 C38 12 22 12 18 22Z'}
        fill={hair}
      />
      {/* olhos */}
      <circle cx="26" cy="23" r="1.7" fill="#1D1613" />
      <circle cx="34" cy="23" r="1.7" fill="#1D1613" />
      {mood === 'angry' && (
        <>
          <path d="M23 18 L29 20.5" stroke="#1D1613" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M37 18 L31 20.5" stroke="#1D1613" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {mood === 'sad' && (
        <>
          <path d="M23 19.5 L29 18" stroke="#1D1613" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M37 19.5 L31 18" stroke="#1D1613" strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
      {/* boca */}
      {mood === 'ok' && <path d="M26 29 Q30 33 34 29" stroke="#5A2A22" strokeWidth="1.8" fill="none" strokeLinecap="round" />}
      {mood === 'shy' && (
        <>
          <path d="M27 30 Q30 32 33 30" stroke="#5A2A22" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <ellipse cx="23" cy="27" rx="2.4" ry="1.4" fill="#F4A38C" opacity="0.7" />
          <ellipse cx="37" cy="27" rx="2.4" ry="1.4" fill="#F4A38C" opacity="0.7" />
        </>
      )}
      {mood === 'sad' && <path d="M26 31 Q30 27.5 34 31" stroke="#5A2A22" strokeWidth="1.8" fill="none" strokeLinecap="round" />}
      {mood === 'angry' && <path d="M26 30.5 L34 30.5" stroke="#5A2A22" strokeWidth="1.9" strokeLinecap="round" />}
      {mood === 'wow' && <ellipse cx="30" cy="30.5" rx="2.2" ry="2.8" fill="#5A2A22" />}
    </svg>
  );
};

const animClass = (a?: string) => (a ? `sc-a-${a}` : 'sc-a-pop');

const renderItem = (it: SceneItem, i: number) => {
  const d = { ['--d' as string]: `${it.d ?? 0}s` } as React.CSSProperties;
  if (it.k === 'p') {
    return (
      <div
        key={i}
        className="absolute"
        style={{ left: `${it.x}%`, top: `${it.y}%`, width: `${13 * (it.s ?? 1)}%`, transform: 'translate(-50%,-100%)' }}
      >
        <div className={animClass(it.a)} style={d}>
          <Person p={it} />
        </div>
      </div>
    );
  }
  if (it.k === 'e') {
    return (
      <div key={i} className="absolute" style={{ left: `${it.x}%`, top: `${it.y}%`, transform: 'translate(-50%,-50%)' }}>
        <div className={animClass(it.a)} style={{ ...d, fontSize: `calc(${it.s ?? 1} * 5.4cqw)`, lineHeight: 1 }}>
          {it.e}
        </div>
      </div>
    );
  }
  return (
    <div key={i} className="absolute z-10" style={{ left: `${it.x}%`, top: `${it.y}%`, transform: 'translate(-50%,-100%)' }}>
      <div className={`sc-a-pop sc-bubble sc-${it.tone ?? 'say'}`} style={d}>
        {it.t}
      </div>
    </div>
  );
};

export const SceneAnimation: React.FC<{ dilemmaId: string }> = ({ dilemmaId }) => {
  const [run, setRun] = useState(0);
  const scene = SCENES[dilemmaId];
  if (!scene) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-inner" style={{ background: scene.sky }}>
      <div key={`${dilemmaId}-${run}`} className="sc-stage relative w-full aspect-[16/9] sm:aspect-[2/1]">
        <div className="absolute inset-x-0 bottom-0 h-[11%]" style={{ background: scene.ground }} />
        {scene.items.map(renderItem)}
      </div>
      <span className="absolute left-2.5 top-2.5 px-2.5 py-1 rounded-full bg-black/45 text-white text-[11px] font-bold backdrop-blur">
        {scene.label}
      </span>
      <button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/85 text-stone-700 text-[11px] font-bold hover:bg-white"
        aria-label="Rever a cena"
      >
        <RotateCcw className="w-3 h-3" /> Rever
      </button>
    </div>
  );
};
