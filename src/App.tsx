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
import { MyArea } from './components/MyArea';
import { BookOpen, KeyRound, Check } from 'lucide-react';
import { SavedState, clearState, loadState, saveState, toISODate } from './utils/storage';
import { notifyIfDue, syncReminder } from './utils/notifications';

type ScreenState = 'welcome' | 'creator' | 'game' | 'result' | 'devotional' | 'area';

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
  // Estado guardado no próprio aparelho (chave pessoal, resultado, progresso, lembrete)
  const [saved, setSaved] = useState<SavedState>(() => loadState());
  const hasSavedResult = !!saved.choices && saved.choices.length > 0;

  const [screen, setScreen] = useState<ScreenState>(() => {
    const wantsDevotional = new URLSearchParams(window.location.search).get('aba') === 'devocional';
    return wantsDevotional && hasSavedResult ? 'devotional' : 'welcome';
  });
  const [character, setCharacter] = useState<CharacterConfig>(saved.character ?? DEFAULT_CHARACTER);
  const [choices, setChoices] = useState<ChoiceRecord[] | null>(saved.choices ?? null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const updateSaved = (next: SavedState) => {
    setSaved(next);
    saveState(next);
  };

  const profile = useMemo(
    () => (choices ? calculateScoreProfile(choices, DILEMMAS) : null),
    [choices]
  );
  const plan = useMemo(() => (profile ? buildPersonalizedPlan(profile, DILEMMAS) : null), [profile]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen]);

  // mantém o service worker informado e avisa se o devocional de hoje ainda não foi feito
  useEffect(() => {
    syncReminder(saved, plan);
  }, [saved.reminder.enabled, saved.reminder.time, saved.devotional, plan]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const check = async () => {
      if (document.visibilityState !== 'visible') return;
      const day = await notifyIfDue(saved, plan);
      if (day) updateSaved({ ...saved, lastNotified: day });
    };
    check();
    document.addEventListener('visibilitychange', check);
    return () => document.removeEventListener('visibilitychange', check);
  }, [saved, plan]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartGame = (configured: CharacterConfig) => {
    setCharacter(configured);
    setChoices(null);
    setScreen('game');
  };

  const handleFinish = (finalChoices: ChoiceRecord[]) => {
    setChoices(finalChoices);
    updateSaved({
      ...saved,
      character,
      choices: finalChoices,
      finishedAt: new Date().toISOString(),
      devotional: { startDate: toISODate(), done: [] },
      lastNotified: undefined,
    });
    setScreen('result');
  };

  const toggleDay = (position: number) => {
    const done = saved.devotional.done.includes(position)
      ? saved.devotional.done.filter((d) => d !== position)
      : [...saved.devotional.done, position];
    updateSaved({ ...saved, devotional: { ...saved.devotional, done } });
  };

  const importSaved = (next: SavedState) => {
    updateSaved(next);
    setCharacter(next.character ?? DEFAULT_CHARACTER);
    setChoices(next.choices ?? null);
  };

  const resetAll = () => {
    const fresh = clearState();
    setSaved(fresh);
    setChoices(null);
    setCharacter(DEFAULT_CHARACTER);
    setScreen('welcome');
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
            {!inGame && (
              <button
                type="button"
                onClick={() => setScreen('area')}
                className={`inline-flex items-center gap-1.5 h-9 px-3 text-xs font-bold rounded-xl ${isWelcome ? 'text-white/80 bg-white/10 hover:bg-white/20' : 'text-stone-600 bg-stone-100 hover:bg-stone-200'}`}
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Meu espaço</span>
              </button>
            )}
            {profile && screen !== 'welcome' && screen !== 'creator' && screen !== 'area' && !inGame && (
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
          <WelcomeScreen
            onStart={() => setScreen('creator')}
            totalSituations={DILEMMAS.length}
            hasResult={hasSavedResult}
            onOpenArea={() => setScreen('area')}
          />
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

        {screen === 'result' && !saved.keySeen && (
          <div className="bg-amber-50 border-b border-amber-200">
            <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0 text-sm text-amber-950">
                <p className="font-black flex items-center gap-1.5"><KeyRound className="w-4 h-4" /> Guarde sua chave pessoal</p>
                <p className="font-mono text-lg font-black tracking-wider">{saved.key}</p>
                <p className="text-xs text-amber-900/80">Seu resultado e seu devocional ficam salvos neste aparelho. Use “Meu espaço” para voltar a eles quando quiser.</p>
              </div>
              <button
                type="button"
                onClick={() => updateSaved({ ...saved, keySeen: true })}
                className="h-10 px-4 rounded-xl bg-amber-600 text-white text-sm font-bold inline-flex items-center justify-center gap-2 shrink-0"
              >
                <Check className="w-4 h-4" /> Anotei minha chave
              </button>
            </div>
          </div>
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
            done={saved.devotional.done}
            startDate={saved.devotional.startDate}
            onToggleDay={toggleDay}
            onBack={() => setScreen('result')}
          />
        )}

        {screen === 'area' && (
          <MyArea
            state={saved}
            profile={profile}
            plan={plan}
            onChange={updateSaved}
            onImport={importSaved}
            onReset={resetAll}
            onOpenResult={() => setScreen('result')}
            onOpenDevotional={() => setScreen('devotional')}
            onBack={() => setScreen(hasSavedResult ? 'result' : 'welcome')}
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
