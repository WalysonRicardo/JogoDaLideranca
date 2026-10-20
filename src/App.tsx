import React, { useEffect, useMemo, useState } from 'react';
import { CharacterConfig, ChoiceRecord } from './types';
import { DILEMMAS } from './data/dilemmas';
import { calculateScoreProfile } from './utils/scoringEngine';
import { buildPersonalizedPlan } from './utils/devotionalPlan';
import { CharacterCreator } from './components/CharacterCreator';
import { DilemmaGame } from './components/DilemmaGame';
import { ResultScreen } from './components/ResultScreen';
import { DevotionalView } from './components/DevotionalView';
import { SmallingLibraryModal } from './components/SmallingLibraryModal';
import { AvatarRenderer } from './components/AvatarRenderer';
import { ArrowRight, BookOpen, Clock, ListChecks, UserRound, Sparkles } from 'lucide-react';

type ScreenState = 'welcome' | 'creator' | 'game' | 'result' | 'devotional';

const DEFAULT_CHARACTER: CharacterConfig = {
  name: 'Líder Gabriel',
  gender: 'masculino',
  hair: 'cacheado',
  skinColor: 'marrom',
  outfit: 'calca_camiseta',
  footwear: 'tenis',
  glasses: false,
  bibleInHand: true,
};

const STEPS = [
  { icon: UserRound, title: 'Monte seu líder', text: 'Escolha o visual do seu personagem.' },
  { icon: ListChecks, title: 'Responda 12 situações', text: 'Decida o que você faria. Não há certo ou errado.' },
  { icon: Sparkles, title: 'Receba seu perfil', text: 'Veja seu resultado, compartilhe e baixe o plano devocional.' },
];

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('welcome');
  const [character, setCharacter] = useState<CharacterConfig>(DEFAULT_CHARACTER);
  const [choices, setChoices] = useState<ChoiceRecord[] | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const profile = useMemo(
    () => (choices ? calculateScoreProfile(choices, DILEMMAS) : null),
    [choices]
  );
  const plan = useMemo(() => (profile ? buildPersonalizedPlan(profile, DILEMMAS) : null), [profile]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen]);

  const handleStartGame = (configured: CharacterConfig) => {
    setCharacter(configured);
    setChoices(null);
    setScreen('game');
  };

  const handleFinish = (finalChoices: ChoiceRecord[]) => {
    setChoices(finalChoices);
    setScreen('result');
  };

  const inGame = screen === 'game';

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-stone-900 font-sans flex flex-col selection:bg-amber-200">
      {/* Cabeçalho enxuto */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => !inGame && setScreen('welcome')}
            className="flex items-center gap-2.5"
            aria-label="Líder 360° - início"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              ✝
            </span>
            <span className="text-base font-black tracking-tight">LÍDER 360°</span>
          </button>

          <div className="flex items-center gap-2">
            {!inGame && (
              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Sobre o livro</span>
              </button>
            )}
            {profile && screen !== 'welcome' && screen !== 'creator' && !inGame && (
              <button
                type="button"
                onClick={() => setScreen(screen === 'devotional' ? 'result' : 'devotional')}
                className="h-9 px-3 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl"
              >
                {screen === 'devotional' ? 'Resultado' : 'Plano 7 dias'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {screen === 'welcome' && (
          <div className="max-w-3xl mx-auto px-4 pt-8 pb-12 sm:pt-14">
            {/* Hero simples */}
            <div className="text-center">
              <div className="mx-auto w-28 h-36 sm:w-32 sm:h-44">
                <AvatarRenderer config={DEFAULT_CHARACTER} size="fill" showFullBody />
              </div>
              <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
                Que tipo de líder você é?
              </h1>
              <p className="mt-3 text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                Um jogo rápido para líderes de jovens da igreja. Descubra seus pontos fortes e receba um plano
                devocional de 7 dias feito para você.
              </p>

              <button
                type="button"
                onClick={() => setScreen('creator')}
                className="mt-7 w-full sm:w-auto sm:min-w-[300px] h-16 px-8 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xl shadow-lg shadow-orange-600/25 hover:shadow-xl active:scale-[0.98] transition-all inline-flex items-center justify-center gap-3"
              >
                Começar agora
                <ArrowRight className="w-6 h-6" />
              </button>
              <p className="mt-3 text-sm text-stone-500 inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Leva cerca de 8 minutos
              </p>
            </div>

            {/* Como funciona: 3 passos */}
            <ol className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="bg-white rounded-2xl border border-stone-200 p-4 flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                  <span className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <s.icon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-extrabold text-sm">
                      {i + 1}. {s.title}
                    </p>
                    <p className="text-xs text-stone-500 leading-snug mt-0.5">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-center text-xs text-stone-400 leading-relaxed">
              Baseado em «Liderança Cristã: Princípios e Prática», de Roger Smalling.
              <br />
              Feito para os líderes de jovens da Igreja Batista no Jardim do Ingá.
            </p>
          </div>
        )}

        {screen === 'creator' && (
          <CharacterCreator
            initialConfig={character}
            onComplete={handleStartGame}
            onBackToHome={() => setScreen('welcome')}
          />
        )}

        {screen === 'game' && (
          <DilemmaGame
            character={character}
            dilemmas={DILEMMAS}
            onFinishGame={handleFinish}
            onOpenLibrary={() => setIsLibraryOpen(true)}
          />
        )}

        {screen === 'result' && profile && plan && (
          <ResultScreen
            character={character}
            profile={profile}
            plan={plan}
            dilemmas={DILEMMAS}
            onRestart={() => setScreen('creator')}
            onOpenDevotional={() => setScreen('devotional')}
          />
        )}

        {screen === 'devotional' && profile && plan && (
          <DevotionalView
            character={character}
            profile={profile}
            plan={plan}
            dilemmas={DILEMMAS}
            onBack={() => setScreen('result')}
          />
        )}
      </main>

      <SmallingLibraryModal isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />

      {!inGame && (
        <footer className="border-t border-stone-200 bg-white py-5 text-center text-xs text-stone-400 px-4">
          Líder 360° · Jogo de formação para liderança cristã
        </footer>
      )}
    </div>
  );
}
