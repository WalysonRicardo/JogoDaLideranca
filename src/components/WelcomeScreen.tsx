import React, { useRef, useState } from 'react';
import { ArrowRight, Clock, ListChecks, Sparkles, CalendarDays, Hand, KeyRound } from 'lucide-react';
import { CharacterConfig, DimensionKey } from '../types';
import { AvatarRenderer } from './AvatarRenderer';
import { DIMENSION_INFO, DIMENSION_KEYS } from '../utils/scoringEngine';

interface WelcomeScreenProps {
  onStart: () => void;
  totalSituations: number;
  hasResult?: boolean;
  onOpenArea?: () => void;
}

/** Visuais que o boneco troca quando o jogador toca nele. */
const LOOKS: CharacterConfig[] = [
  { name: 'Gabriel', gender: 'masculino', hair: 'cacheado', skinColor: 'marrom', outfit: 'calca_camiseta', footwear: 'tenis', glasses: false, bibleInHand: true },
  { name: 'Ana', gender: 'feminino', hair: 'liso', skinColor: 'branco', outfit: 'vestido', footwear: 'sandalia', glasses: true, bibleInHand: true },
  { name: 'Davi', gender: 'masculino', hair: 'black_power', skinColor: 'preto', outfit: 'terno_gravata', footwear: 'tenis', glasses: false, bibleInHand: true },
  { name: 'Bia', gender: 'feminino', hair: 'crespo', skinColor: 'amarelo', outfit: 'saia_blusa', footwear: 'tenis', glasses: false, bibleInHand: true },
  { name: 'Lucas', gender: 'masculino', hair: 'careca', skinColor: 'branco', outfit: 'bermuda_camiseta', footwear: 'sandalia', glasses: true, bibleInHand: true },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, totalSituations, hasResult, onOpenArea }) => {
  const [active, setActive] = useState<DimensionKey | null>(null);
  const [look, setLook] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [par, setPar] = useState({ x: 0, y: 0 });

  const onMove = (e: React.PointerEvent) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    setPar({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  const info = active ? DIMENSION_INFO[active] : null;

  return (
    <div
      ref={stageRef}
      onPointerMove={onMove}
      className="relative overflow-hidden text-white min-h-[calc(100svh-56px)]"
      style={{ background: 'radial-gradient(120% 90% at 50% 0%, #3b1d0f 0%, #17100d 55%, #0d0908 100%)' }}
    >
      {/* Luzes de fundo com parallax */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px]" style={{ transform: `translate(${par.x * 40}px, ${par.y * 40}px)`, transition: 'transform .3s ease-out' }}>
          <div className="blob-a w-full h-full rounded-full bg-amber-500/40 blur-[90px]" />
        </div>
        <div className="absolute top-1/3 -right-32 w-[460px] h-[460px]" style={{ transform: `translate(${par.x * -50}px, ${par.y * -30}px)`, transition: 'transform .3s ease-out' }}>
          <div className="blob-b w-full h-full rounded-full bg-fuchsia-600/30 blur-[100px]" />
        </div>
        <div className="absolute -bottom-32 left-1/4 w-[420px] h-[420px]" style={{ transform: `translate(${par.x * 30}px, ${par.y * -40}px)`, transition: 'transform .3s ease-out' }}>
          <div className="blob-a w-full h-full rounded-full bg-sky-500/25 blur-[100px]" />
        </div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 pt-8 pb-10 sm:pt-12 flex flex-col items-center text-center">
        <span className="rise inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur text-[11px] sm:text-xs font-bold tracking-wide text-amber-200">
          <Sparkles className="w-3.5 h-3.5" /> Jogo de liderança · Jovens do Jardim do Ingá
        </span>

        <h1 className="rise mt-4 text-[34px] sm:text-6xl font-black tracking-tight leading-[1.05]" style={{ animationDelay: '.08s' }}>
          Que tipo de{' '}
          <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">líder</span>{' '}
          você é?
        </h1>

        {/* Palco interativo: boneco + 7 estilos orbitando */}
        <div className="rise mt-6 relative" style={{ ['--size' as string]: 'min(82vw, 340px)', width: 'var(--size)', height: 'var(--size)', animationDelay: '.16s' } as React.CSSProperties}>
          <div className="absolute inset-[9%] rounded-full border border-white/10" />
          <div className="absolute inset-[22%] rounded-full border border-dashed border-white/10" />

          <div className={`orbit-ring absolute inset-0 ${active ? 'paused' : ''}`}>
            {DIMENSION_KEYS.map((k, i) => {
              const a = (360 / DIMENSION_KEYS.length) * i;
              const d = DIMENSION_INFO[k];
              const isOn = active === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setActive(isOn ? null : k)}
                  aria-label={d.label}
                  aria-pressed={isOn}
                  className="absolute left-1/2 top-1/2 w-[54px] h-[54px] -ml-[27px] -mt-[27px]"
                  style={{ transform: `rotate(${a}deg) translateY(calc(var(--size) / -2 + 27px)) rotate(${-a}deg)` }}
                >
                  <span
                    className="orbit-icon flex w-full h-full items-center justify-center rounded-2xl text-2xl backdrop-blur border transition-transform hover:scale-110 active:scale-95"
                    style={{
                      background: isOn ? d.color : 'rgba(255,255,255,0.12)',
                      borderColor: isOn ? '#fff' : 'rgba(255,255,255,0.25)',
                      boxShadow: isOn ? `0 0 28px ${d.color}` : undefined,
                      transform: isOn ? 'scale(1.18)' : undefined,
                    }}
                  >
                    {d.icon}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Boneco central: toque para trocar o visual */}
          <button
            type="button"
            onClick={() => setLook((l) => (l + 1) % LOOKS.length)}
            aria-label="Trocar o visual do boneco"
            className="absolute inset-[24%] rounded-full bg-white/10 border border-white/20 backdrop-blur overflow-hidden flex items-end justify-center active:scale-95 transition-transform"
          >
            <span className="w-[78%] h-[92%] block translate-y-[4%]">
              <AvatarRenderer config={LOOKS[look]} size="fill" showFullBody />
            </span>
          </button>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 text-[10px] font-bold text-white/60">
            <Hand className="w-3 h-3 wave-hand" /> toque no boneco
          </span>
        </div>

        {/* Cartão do estilo selecionado */}
        <div className="mt-6 w-full max-w-md min-h-[84px]">
          {info ? (
            <div key={active} className="rise rounded-2xl bg-white/10 border border-white/15 backdrop-blur p-4 text-left">
              <p className="font-black text-base" style={{ color: info.color === '#1F6FB5' ? '#7cc0f5' : info.color }}>
                {info.icon} {info.label}
              </p>
              <p className="mt-0.5 text-sm text-white/80 leading-snug">{info.description}</p>
            </div>
          ) : (
            <p className="text-sm text-white/65 leading-relaxed px-2">
              Existem <b className="text-white">7 jeitos de liderar</b> e nenhum é melhor que o outro.
              Toque nos ícones para conhecê-los, depois descubra o seu.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="shimmer relative overflow-hidden mt-6 w-full sm:w-auto sm:min-w-[320px] h-16 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black text-xl shadow-[0_10px_40px_-8px_rgba(249,115,22,.7)] hover:scale-[1.02] active:scale-[0.98] transition-transform inline-flex items-center justify-center gap-3"
        >
          Começar agora
          <ArrowRight className="w-6 h-6" />
        </button>

        {hasResult && onOpenArea && (
          <button
            type="button"
            onClick={onOpenArea}
            className="mt-3 w-full sm:w-auto sm:min-w-[320px] h-12 px-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur text-white font-bold text-base hover:bg-white/20 inline-flex items-center justify-center gap-2"
          >
            <KeyRound className="w-5 h-5 text-amber-300" /> Ver meu resultado e meu devocional
          </button>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2 w-full max-w-md text-[11px] sm:text-xs font-bold text-white/80">
          <div className="rounded-xl bg-white/8 border border-white/10 px-2 py-2.5 flex flex-col items-center gap-1" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <ListChecks className="w-4 h-4 text-amber-300" />
            {totalSituations} situações
          </div>
          <div className="rounded-xl border border-white/10 px-2 py-2.5 flex flex-col items-center gap-1" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <Clock className="w-4 h-4 text-amber-300" />
            cerca de 10 min
          </div>
          <div className="rounded-xl border border-white/10 px-2 py-2.5 flex flex-col items-center gap-1" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <CalendarDays className="w-4 h-4 text-amber-300" />
            plano de 7 dias
          </div>
        </div>

        <p className="mt-6 text-[11px] text-white/45 leading-relaxed max-w-sm">
          Não existe resposta certa. Baseado em «Liderança Cristã», de Roger Smalling, e em «Família Equilibrada, Igreja Abençoada», de Wanda de Assumpção.
        </p>
      </div>
    </div>
  );
};
