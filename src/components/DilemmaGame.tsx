import React, { useMemo, useState } from 'react';
import { CharacterConfig, ChoiceRecord, Dilemma, DilemmaOption } from '../types';
import { AvatarRenderer } from './AvatarRenderer';
import { SceneAnimation } from './SceneAnimation';
import { ArrowRight, ArrowLeft, BookOpen, Check } from 'lucide-react';

interface DilemmaGameProps {
  character: CharacterConfig;
  dilemmas: Dilemma[];
  onFinishGame: (choices: ChoiceRecord[]) => void;
  onOpenLibrary: () => void;
}

const CATEGORY_LABEL: Record<Dilemma['category'], { label: string; color: string }> = {
  juventude: { label: 'Jovens', color: 'bg-indigo-100 text-indigo-800' },
  igreja: { label: 'Igreja', color: 'bg-emerald-100 text-emerald-800' },
  familia: { label: 'Família', color: 'bg-pink-100 text-pink-800' },
  pessoal_familiar: { label: 'Família e vida pessoal', color: 'bg-rose-100 text-rose-800' },
  conflito: { label: 'Conflito', color: 'bg-amber-100 text-amber-800' },
  discipulado: { label: 'Discipulado', color: 'bg-purple-100 text-purple-800' },
};

/** Embaralha de forma estável (por jogada) para que a posição não sugira resposta. */
function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const DilemmaGame: React.FC<DilemmaGameProps> = ({
  character,
  dilemmas,
  onFinishGame,
  onOpenLibrary,
}) => {
  const [index, setIndex] = useState(0);
  // escolhas por situação (permite voltar e mudar de ideia antes de finalizar)
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // ordem das alternativas sorteada uma vez por partida
  const shuffled = useMemo(() => {
    const map: Record<string, DilemmaOption[]> = {};
    dilemmas.forEach((d) => {
      map[d.id] = shuffle(d.options);
    });
    return map;
  }, [dilemmas]);

  const dilemma = dilemmas[index];
  const options = shuffled[dilemma.id];
  const selected = answers[dilemma.id];
  const isLast = index === dilemmas.length - 1;
  const progress = Math.round(((index + (selected ? 1 : 0)) / dilemmas.length) * 100);
  const cat = CATEGORY_LABEL[dilemma.category];

  const handleNext = () => {
    if (!selected) return;
    if (isLast) {
      const choices: ChoiceRecord[] = dilemmas
        .filter((d) => answers[d.id])
        .map((d) => ({ dilemmaId: d.id, optionId: answers[d.id] }));
      onFinishGame(choices);
      return;
    }
    setIndex((i) => i + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (index === 0) return;
    setIndex((i) => i - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-32 sm:py-8">
      {/* Progresso */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-amber-100 overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
              <AvatarRenderer config={character} size="xs" showFullBody={false} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider leading-none">
                Situação {index + 1} de {dilemmas.length}
              </p>
              <p className="text-sm font-extrabold text-stone-900 truncate">{character.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLibrary}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Manual</span>
          </button>
        </div>
        <div className="w-full h-2 bg-stone-200/70 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Cartão da situação */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-sm">
        <SceneAnimation dilemmaId={dilemma.id} />
        <span className={`mt-4 inline-block px-3 py-1 rounded-full text-[11px] font-bold ${cat.color}`}>
          {cat.label}
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
          {dilemma.title}
        </h2>
        <p className="mt-3 text-stone-700 text-[15px] sm:text-base leading-relaxed">
          {dilemma.context}
        </p>
        <p className="mt-3 text-stone-900 font-bold text-[15px] sm:text-base leading-relaxed">
          {dilemma.situation}
        </p>

        <div className="mt-5 flex items-center gap-2 text-xs text-stone-500">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Não existe resposta certa. Escolha o que você realmente faria.
        </div>

        {/* Alternativas */}
        <div className="mt-4 space-y-3">
          {options.map((opt, i) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [dilemma.id]: opt.id }))}
                aria-pressed={isSelected}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 active:scale-[0.99] ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/40'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                </span>
                <span className="text-[15px] leading-snug text-stone-800">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de ação fixa (ótima no celular) */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-stone-200 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={index === 0}
            aria-label="Voltar"
            className="h-12 w-12 shrink-0 rounded-xl border border-stone-200 bg-white text-stone-600 disabled:opacity-30 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!selected}
            className={`flex-1 h-12 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all ${
              selected
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md active:scale-[0.99]'
                : 'bg-stone-200 text-stone-400'
            }`}
          >
            {selected ? (isLast ? 'Ver meu resultado' : 'Próxima situação') : 'Escolha uma opção'}
            {selected && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
