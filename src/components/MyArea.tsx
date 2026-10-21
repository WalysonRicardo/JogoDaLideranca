import React, { useState } from 'react';
import {
  ArrowLeft, Bell, BellOff, CalendarPlus, Check, Copy, KeyRound, Smartphone, Trash2, Upload, Download, ShieldCheck, FileText, CalendarDays,
} from 'lucide-react';
import { PersonalizedDay, ScoreProfile } from '../types';
import {
  SavedState, exportTransferCode, importTransferCode, keysMatch, dayNumber,
} from '../utils/storage';
import { askPermission, isIOS, isStandalone, notifSupport, permission, sendTest } from '../utils/notifications';
import { downloadIcs } from '../utils/calendar';

interface MyAreaProps {
  state: SavedState;
  profile: ScoreProfile | null;
  plan: PersonalizedDay[] | null;
  onChange: (next: SavedState) => void;
  onImport: (next: SavedState) => void;
  onReset: () => void;
  onOpenResult: () => void;
  onOpenDevotional: () => void;
  onBack: () => void;
}

export const MyArea: React.FC<MyAreaProps> = ({
  state, profile, plan, onChange, onImport, onReset, onOpenResult, onOpenDevotional, onBack,
}) => {
  const [typedKey, setTypedKey] = useState('');
  const [keyMsg, setKeyMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const hasResult = !!(state.choices && state.choices.length > 0 && profile && plan);
  const support = notifSupport();
  const perm = permission();
  const doneCount = state.devotional.done.length;
  const today = dayNumber(state.devotional.startDate);

  const copy = async (what: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied(''), 2500);
    } catch {
      setCopied('erro');
    }
  };

  const enterWithKey = () => {
    if (keysMatch(typedKey, state.key)) {
      setKeyMsg({ ok: true, text: 'Chave confirmada!' });
      if (hasResult) onOpenResult();
      else setKeyMsg({ ok: true, text: 'Chave confirmada. Você ainda não terminou o jogo neste aparelho.' });
    } else {
      setKeyMsg({
        ok: false,
        text: 'Esta chave não é a deste aparelho. Para abrir seus resultados em outro aparelho, use o "código de transferência" abaixo, gerado no aparelho onde você jogou.',
      });
    }
  };

  const doImport = () => {
    const parsed = importTransferCode(code);
    if (!parsed) {
      setCodeMsg({ ok: false, text: 'Código inválido. Copie o código completo, começando por L360.' });
      return;
    }
    onImport(parsed);
    setCode('');
    setCodeMsg({ ok: true, text: 'Pronto! Seus dados foram trazidos para este aparelho.' });
  };

  const toggleReminder = async () => {
    setNotifMsg('');
    if (state.reminder.enabled) {
      onChange({ ...state, reminder: { ...state.reminder, enabled: false } });
      return;
    }
    if (support === 'ios-needs-install') {
      setNotifMsg('No iPhone, primeiro adicione o app à Tela de Início (veja as instruções abaixo) e abra por lá.');
      return;
    }
    if (support === 'unsupported') {
      setNotifMsg('Este navegador não oferece notificações. Use o lembrete de calendário abaixo.');
      return;
    }
    const result = await askPermission();
    if (result === 'granted') {
      onChange({ ...state, reminder: { ...state.reminder, enabled: true } });
      await sendTest();
      setNotifMsg('Lembretes ligados! Enviamos um aviso de teste.');
    } else if (result === 'denied') {
      setNotifMsg('A permissão foi negada. Para liberar, abra as configurações do navegador (ou do app) e permita notificações para este site.');
    } else {
      setNotifMsg('A permissão não foi concedida.');
    }
  };

  const card = 'bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-6';

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 sm:py-8 pb-24 space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-500 hover:text-stone-800">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-amber-700">Meu espaço</p>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">Seus resultados e seu devocional</h1>
      </div>

      {/* Chave pessoal */}
      <section className="rounded-3xl p-5 sm:p-6 text-white" style={{ background: 'linear-gradient(135deg,#C2410C,#7C2D12)' }}>
        <p className="text-xs font-black uppercase tracking-widest text-amber-200 flex items-center gap-1.5">
          <KeyRound className="w-4 h-4" /> Sua chave pessoal
        </p>
        <p className="mt-2 font-mono text-3xl sm:text-4xl font-black tracking-wider break-all">{state.key}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => copy('key', state.key)} className="h-10 px-4 rounded-xl bg-white/15 hover:bg-white/25 font-bold text-sm inline-flex items-center gap-2">
            {copied === 'key' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied === 'key' ? 'Copiada!' : 'Copiar chave'}
          </button>
        </div>
        <p className="mt-3 text-sm text-white/85 leading-relaxed flex gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          Gerada neste aparelho, só para você. Seus dados ficam guardados aqui no navegador e não são enviados a ninguém.
        </p>
      </section>

      {/* Meu progresso */}
      {hasResult && profile && plan ? (
        <section className={card}>
          <h2 className="font-black text-lg text-stone-900">Meu resultado</h2>
          <p className="mt-1 text-sm text-stone-600">
            Perfil: <b>{profile.profileTitle}</b> <span className="text-stone-500">{profile.profileSubtitle}</span>
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-xs font-bold text-stone-500 mb-1">
              <span>Devocional: {doneCount} de {plan.length} dias</span>
              <span>{today <= plan.length ? `Hoje: dia ${today}` : 'Plano concluído no calendário'}</span>
            </div>
            <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500" style={{ width: `${(doneCount / plan.length) * 100}%` }} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button type="button" onClick={onOpenResult} className="h-12 rounded-xl bg-stone-900 text-white font-bold text-sm inline-flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Ver meu resultado
            </button>
            <button type="button" onClick={onOpenDevotional} className="h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm inline-flex items-center justify-center gap-2">
              <CalendarDays className="w-4 h-4" /> Continuar o devocional
            </button>
          </div>
        </section>
      ) : (
        <section className={card}>
          <h2 className="font-black text-lg text-stone-900">Nada guardado ainda</h2>
          <p className="mt-1 text-sm text-stone-600">Quando você terminar o jogo, seu resultado e o plano de 7 dias ficam salvos aqui automaticamente.</p>
        </section>
      )}

      {/* Entrar com a chave */}
      <section className={card}>
        <h2 className="font-black text-lg text-stone-900">Voltar com a minha chave</h2>
        <p className="mt-1 text-sm text-stone-600">Digite sua chave para abrir seus resultados neste aparelho.</p>
        <div className="mt-3 flex gap-2">
          <input
            value={typedKey}
            onChange={(e) => setTypedKey(e.target.value)}
            placeholder="LIDER-XXXX-XXXX"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 min-w-0 h-12 px-3 rounded-xl border-2 border-stone-200 font-mono text-base uppercase focus:border-amber-500 outline-none"
          />
          <button type="button" onClick={enterWithKey} disabled={!typedKey.trim()} className="h-12 px-5 rounded-xl bg-stone-900 text-white font-bold text-sm disabled:opacity-40">
            Entrar
          </button>
        </div>
        {keyMsg && <p className={`mt-2 text-sm ${keyMsg.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{keyMsg.text}</p>}
      </section>

      {/* Lembretes */}
      <section className={card}>
        <h2 className="font-black text-lg text-stone-900 flex items-center gap-2">
          {state.reminder.enabled ? <Bell className="w-5 h-5 text-amber-600" /> : <BellOff className="w-5 h-5 text-stone-400" />}
          Lembrete do devocional
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Receba um aviso no horário que você escolher, com o tema do dia. Funciona em Android e iPhone, e fica só no seu aparelho.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
            Horário
            <input
              type="time"
              value={state.reminder.time}
              onChange={(e) => e.target.value && onChange({ ...state, reminder: { ...state.reminder, time: e.target.value } })}
              className="h-11 px-3 rounded-xl border-2 border-stone-200 font-bold"
            />
          </label>
          <button
            type="button"
            onClick={toggleReminder}
            disabled={!hasResult}
            className={`h-11 px-4 rounded-xl font-bold text-sm inline-flex items-center gap-2 disabled:opacity-40 ${
              state.reminder.enabled ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
            }`}
          >
            {state.reminder.enabled ? <><Check className="w-4 h-4" /> Ligado (tocar para desligar)</> : <><Bell className="w-4 h-4" /> Ativar notificações</>}
          </button>
        </div>
        {!hasResult && <p className="mt-2 text-xs text-stone-500">Termine o jogo para ativar o lembrete.</p>}
        {notifMsg && <p className="mt-2 text-sm text-stone-700">{notifMsg}</p>}
        {perm === 'denied' && !notifMsg && <p className="mt-2 text-sm text-rose-700">As notificações estão bloqueadas neste navegador. Libere nas configurações do site.</p>}

        {hasResult && plan && state.devotional.startDate && (
          <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm font-black text-amber-900 flex items-center gap-2">
              <CalendarPlus className="w-4 h-4" /> Opção mais segura: alarme no calendário
            </p>
            <p className="mt-1 text-xs text-amber-950/80 leading-relaxed">
              Baixe o arquivo e abra no celular: ele cria 7 eventos, um por dia, no horário escolhido. O próprio celular avisa, mesmo com o navegador fechado.
            </p>
            <button
              type="button"
              onClick={() => downloadIcs(plan, state.devotional.startDate!, state.reminder.time)}
              className="mt-2 h-10 px-4 rounded-xl bg-amber-600 text-white font-bold text-sm inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Baixar lembretes (.ics)
            </button>
          </div>
        )}

        <div className="mt-4 text-xs text-stone-600 leading-relaxed space-y-1.5">
          <p className="font-black text-stone-800 flex items-center gap-1.5"><Smartphone className="w-4 h-4" /> Para as notificações funcionarem melhor</p>
          <p><b>Android (Chrome):</b> toque no menu ⋮ e em “Instalar app” ou “Adicionar à tela inicial”. Instalado, o aviso pode chegar com o app fechado.</p>
          <p><b>iPhone (Safari):</b> toque em Compartilhar ⬆️ e em “Adicionar à Tela de Início”. Depois abra o app por esse ícone e ative as notificações aqui. Exige iOS 16.4 ou mais novo.</p>
          {isIOS() && !isStandalone() && <p className="text-amber-800 font-bold">Você está no Safari comum: instale na Tela de Início antes de ativar.</p>}
          <p>Sem servidor, o navegador decide quando acordar o app. Se o aviso não chegar com o app fechado, ele aparece assim que você abrir o Líder 360°. Para garantia total, use o alarme no calendário.</p>
        </div>
      </section>

      {/* Transferência */}
      <section className={card}>
        <h2 className="font-black text-lg text-stone-900">Levar para outro aparelho</h2>
        <p className="mt-1 text-sm text-stone-600">
          Como nada é guardado em servidor, a chave sozinha não abre seus dados em outro celular. Use o código de transferência: copie aqui e cole no outro aparelho.
        </p>
        {hasResult && (
          <button
            type="button"
            onClick={() => copy('code', exportTransferCode(state))}
            className="mt-3 h-11 px-4 rounded-xl bg-stone-900 text-white font-bold text-sm inline-flex items-center gap-2"
          >
            {copied === 'code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied === 'code' ? 'Código copiado!' : 'Copiar meu código de transferência'}
          </button>
        )}
        {copied === 'erro' && <p className="mt-2 text-sm text-rose-700">Não consegui copiar automaticamente. Tente novamente.</p>}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Cole aqui o código que começa com L360."
          rows={3}
          className="mt-3 w-full p-3 rounded-xl border-2 border-stone-200 font-mono text-xs focus:border-amber-500 outline-none"
        />
        <button type="button" onClick={doImport} disabled={!code.trim()} className="mt-2 h-11 px-4 rounded-xl border-2 border-stone-300 font-bold text-sm text-stone-800 inline-flex items-center gap-2 disabled:opacity-40">
          <Upload className="w-4 h-4" /> Trazer meus dados para este aparelho
        </button>
        {codeMsg && <p className={`mt-2 text-sm ${codeMsg.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{codeMsg.text}</p>}
        <p className="mt-2 text-xs text-stone-500">Isso substitui o que estiver guardado neste aparelho.</p>
      </section>

      {/* Apagar */}
      <section className="text-center">
        {!confirmReset ? (
          <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-rose-700">
            <Trash2 className="w-4 h-4" /> Apagar meus dados deste aparelho
          </button>
        ) : (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            <p className="font-bold">Isso apaga sua chave, seu resultado e seu progresso aqui. Não dá para desfazer.</p>
            <div className="mt-3 flex justify-center gap-2">
              <button type="button" onClick={() => { onReset(); setConfirmReset(false); }} className="h-10 px-4 rounded-xl bg-rose-600 text-white font-bold">Apagar tudo</button>
              <button type="button" onClick={() => setConfirmReset(false)} className="h-10 px-4 rounded-xl bg-white border border-stone-300 font-bold text-stone-700">Cancelar</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
