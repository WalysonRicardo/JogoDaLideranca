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
import { WelcomeScreen } from './components/WelcomeScreen';
import { BookOpen } from 'lucide-react';

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
  const isWelcome = screen === 'welcome';

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-stone-900 font-sans flex flex-col selection:bg-amber-200">
      {/* Cabeçalho enxuto */}
      <header className={`sticky top-0 z-40 backdrop-blur border-b ${isWelcome ? 'bg-[#17100d]/80 border-white/10 text-white' : 'bg-white/90 border-stone-200'}`}>
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
                className={`inline-flex items-center gap-1.5 h-9 px-3 text-xs font-bold rounded-xl ${isWelcome ? 'text-white/80 bg-white/10 hover:bg-white/20' : 'text-stone-600 bg-stone-100 hover:bg-stone-200'}`}
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
          <WelcomeScreen onStart={() => setScreen('creator')} totalSituations={DILEMMAS.length} />
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

      {!inGame && !isWelcome && (
        <footer className="border-t border-stone-200 bg-white py-5 text-center text-xs text-stone-400 px-4">
          Líder 360° · Jogo de formação para liderança cristã
        </footer>
      )}
    </div>
  );
}
