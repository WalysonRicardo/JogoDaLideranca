import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Check, FileText, HandHeart, Lightbulb, Users2, Heart } from 'lucide-react';
import { CharacterConfig, Dilemma, PersonalizedDay, ScoreProfile } from '../types';
import { DIMENSION_INFO } from '../utils/scoringEngine';
import { downloadReportPdf } from '../utils/pdfReport';
import { dayNumber } from '../utils/storage';

interface DevotionalViewProps {
  character: CharacterConfig;
  profile: ScoreProfile;
  plan: PersonalizedDay[];
  dilemmas: Dilemma[];
  done: number[];
  startDate?: string;
  onToggleDay: (position: number) => void;
  onBack: () => void;
}

const LEVEL_LABEL = {
  forca: 'Sua força',
  equilibrio: 'Em equilíbrio',
  atencao: 'Ponto de atenção',
} as const;

export const DevotionalView: React.FC<DevotionalViewProps> = ({
  character,
  profile,
  plan,
  dilemmas,
  done,
  startDate,
  onToggleDay,
  onBack,
}) => {
  const today = dayNumber(startDate);
  const [activePos, setActivePos] = useState(Math.min(today, plan.length));
  const toggleDone = onToggleDay;

  const active = plan.find((d) => d.position === activePos) ?? plan[0];
  const info = DIMENSION_INFO[active.dimension];
  const completed = plan.filter((d) => done.includes(d.position)).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 sm:py-8 pb-24">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-500 hover:text-stone-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao resultado
      </button>

      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-amber-700">Plano devocional de {character.name}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">7 dias para o seu perfil</h1>
        </div>
        <button
          type="button"
          onClick={() => downloadReportPdf({ character, profile, plan, dilemmas })}
          className="h-11 px-4 rounded-xl bg-stone-900 text-white text-sm font-bold inline-flex items-center gap-2"
        >
          <FileText className="w-4 h-4" /> Baixar PDF
        </button>
      </div>

      {/* Progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-xs font-bold text-stone-500 mb-1">
          <span>{completed} de 7 dias concluídos</span>
          <span>{Math.round((completed / 7) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all"
            style={{ width: `${(completed / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Seletor de dias (rolável no celular) */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
        {plan.map((d) => {
          const di = DIMENSION_INFO[d.dimension];
          const isActive = d.position === activePos;
          const isDone = done.includes(d.position);
          return (
            <button
              key={d.day}
              type="button"
              onClick={() => setActivePos(d.position)}
              className={`snap-start shrink-0 w-[84px] rounded-2xl border-2 px-2 py-2.5 text-center transition-all ${
                isActive ? 'bg-white shadow-md' : 'bg-white/60 border-stone-200'
              }`}
              style={isActive ? { borderColor: di.color } : undefined}
            >
              <span className="block text-[10px] font-black uppercase text-stone-400">Dia {d.position}{d.position === today ? ' · hoje' : ''}</span>
              <span className="block text-2xl my-0.5">{isDone ? '✅' : di.icon}</span>
              <span className="block text-[10px] font-bold text-stone-600 leading-tight">{di.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo do dia */}
      <article className="mt-3 bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <header className="p-5 sm:p-7 text-white" style={{ background: `linear-gradient(135deg, ${info.color}, #44281A)` }}>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-wider text-white/85">
            <span>Dia {active.position}{active.position === today ? ' · hoje' : ''}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20">{LEVEL_LABEL[active.level]}</span>
            <span>{active.dimensionPercentage}%</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black leading-tight">{active.title}</h2>
          <p className="mt-1 text-sm text-white/85">{active.theme}</p>
        </header>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Nota pessoal */}
          <div className="rounded-2xl p-4 border" style={{ background: info.colorSoft, borderColor: info.color + '55' }}>
            <p className="text-xs font-black uppercase tracking-wider" style={{ color: info.color }}>
              Para você, {character.name}
            </p>
            <p className="mt-1 text-sm sm:text-base text-stone-800 leading-relaxed">{active.note}</p>
            {active.relatedChoices.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-xs text-stone-600">
                {active.relatedChoices.slice(0, 3).map((rc) => (
                  <li key={rc.situation} className="leading-snug">
                    <span className="font-bold">{rc.situation}:</span> {rc.chosen}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Versículo */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Leitura do dia · {active.scriptureRef}
            </p>
            <p className="mt-2 text-lg sm:text-xl text-stone-800 italic leading-relaxed font-serif">{active.scriptureText}</p>
            <p className="mt-2 text-xs text-stone-500">
              <span className="font-bold">Leitura de apoio:</span> {active.supportingScriptures.join(' · ')}
            </p>
          </div>

          <div>
            <h3 className="font-black text-stone-900 mb-1">Princípio do livro</h3>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">{active.smallingPrinciple}</p>
          </div>

          <div>
            <h3 className="font-black text-stone-900 mb-1">Reflexão</h3>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">{active.reflection}</p>
          </div>

          <div>
            <h3 className="font-black text-stone-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" /> Para meditar
            </h3>
            <ul className="space-y-2">
              {active.meditationQuestions.map((q) => (
                <li key={q} className="flex gap-2 text-sm sm:text-base text-stone-700 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: info.color }} />
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
              <h3 className="font-black text-emerald-900 text-sm mb-1 flex items-center gap-1.5">
                <HandHeart className="w-4 h-4" /> Prática do dia
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">{active.practicalAction}</p>
            </div>
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
              <h3 className="font-black text-rose-900 text-sm mb-1 flex items-center gap-1.5">
                <Heart className="w-4 h-4" /> Oração
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed italic">{active.prayerFocus}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4">
            <h3 className="font-black text-indigo-900 text-sm mb-1 flex items-center gap-1.5">
              <Users2 className="w-4 h-4" /> Compartilhar e orar juntos
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">{active.mutualAccountabilityPrompt}</p>
          </div>

          <button
            type="button"
            onClick={() => toggleDone(active.position)}
            className={`w-full h-12 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
              done.includes(active.position)
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                : 'bg-stone-900 text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            {done.includes(active.position) ? 'Dia concluído' : 'Marcar este dia como concluído'}
          </button>
        </div>
      </article>

      <div className="mt-4 flex justify-between gap-3">
        <button
          type="button"
          disabled={activePos === 1}
          onClick={() => setActivePos((p) => Math.max(1, p - 1))}
          className="h-11 px-4 rounded-xl border border-stone-200 bg-white text-sm font-bold text-stone-700 disabled:opacity-30"
        >
          ← Dia anterior
        </button>
        <button
          type="button"
          disabled={activePos === plan.length}
          onClick={() => setActivePos((p) => Math.min(plan.length, p + 1))}
          className="h-11 px-4 rounded-xl border border-stone-200 bg-white text-sm font-bold text-stone-700 disabled:opacity-30"
        >
          Próximo dia →
        </button>
      </div>
    </div>
  );
};
