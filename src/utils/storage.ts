import { CharacterConfig, ChoiceRecord } from '../types';

/**
 * Armazenamento 100% local (no aparelho). Nada é enviado a servidor.
 *
 * - No PRIMEIRO acesso é gerada uma chave pessoal (ex.: LIDER-7K2M-9QXA).
 * - Resultados, progresso do devocional e preferências de lembrete ficam
 *   guardados neste navegador, ligados a essa chave.
 * - Para levar tudo a outro aparelho existe o "código de transferência":
 *   um texto que carrega os dados (e a mesma chave) e é colado no outro aparelho.
 */

const LS_KEY = 'lider360:v1';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem O/0/I/1 para evitar confusão

export interface ReminderPrefs {
  enabled: boolean;
  time: string; // "HH:MM"
}

export interface SavedState {
  v: 1;
  key: string;
  createdAt: string;
  character?: CharacterConfig;
  choices?: ChoiceRecord[];
  finishedAt?: string;
  devotional: { startDate?: string; done: number[] };
  reminder: ReminderPrefs;
  lastNotified?: string; // data (AAAA-MM-DD) do último aviso enviado
  keySeen?: boolean; // a pessoa já viu o aviso para guardar a chave
}

export function generateKey(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const c = Array.from(bytes).map((b) => ALPHABET[b % ALPHABET.length]);
  return `LIDER-${c.slice(0, 4).join('')}-${c.slice(4).join('')}`;
}

/** Aceita a chave com ou sem prefixo, hífens, minúsculas ou espaços. */
export const normalizeKey = (s: string): string =>
  s.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^LIDER/, '');

export const keysMatch = (a: string, b: string): boolean => normalizeKey(a) === normalizeKey(b) && normalizeKey(a).length >= 8;

export function emptyState(): SavedState {
  return {
    v: 1,
    key: generateKey(),
    createdAt: new Date().toISOString(),
    devotional: { done: [] },
    reminder: { enabled: false, time: '07:00' },
  };
}

const isState = (x: unknown): x is SavedState => {
  const s = x as SavedState;
  return !!s && s.v === 1 && typeof s.key === 'string' && !!s.devotional && Array.isArray(s.devotional.done) && !!s.reminder;
};

/** Lê o estado salvo; se for o primeiro acesso, cria e grava a chave. */
export function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isState(parsed)) return parsed;
    }
  } catch {
    /* armazenamento indisponível ou corrompido: cria um novo */
  }
  const fresh = emptyState();
  saveState(fresh);
  return fresh;
}

export function saveState(state: SavedState): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* modo privado ou sem espaço: segue só em memória */
  }
}

export function clearState(): SavedState {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    /* ignora */
  }
  return loadState();
}

/* ───────── datas (sempre no fuso do aparelho) ───────── */

export const toISODate = (d: Date = new Date()): string => {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

/** Dia do plano (1 = dia em que o resultado saiu). Pode passar de 7. */
export function dayNumber(startDate: string | undefined, now: Date = new Date()): number {
  if (!startDate) return 1;
  const [y, m, d] = startDate.split('-').map(Number);
  const start = new Date(y, m - 1, d).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.max(1, Math.round((today - start) / 86_400_000) + 1);
}

/* ───────── código de transferência ───────── */

const PREFIX = 'L360.';

const toB64 = (s: string) =>
  btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64 = (s: string) =>
  decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));

export function exportTransferCode(state: SavedState): string {
  const payload = {
    k: state.key,
    c: state.character,
    ch: state.choices,
    f: state.finishedAt,
    s: state.devotional.startDate,
    d: state.devotional.done,
  };
  return PREFIX + toB64(JSON.stringify(payload));
}

export function importTransferCode(code: string): SavedState | null {
  try {
    const clean = code.trim().replace(/\s+/g, '');
    if (!clean.startsWith(PREFIX) || clean.length > 20_000) return null;
    const p = JSON.parse(fromB64(clean.slice(PREFIX.length)));
    if (typeof p.k !== 'string' || !/^LIDER-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(p.k)) return null;
    const choices: ChoiceRecord[] | undefined = Array.isArray(p.ch)
      ? p.ch
          .filter((x: ChoiceRecord) => x && typeof x.dilemmaId === 'string' && typeof x.optionId === 'string')
          .map((x: ChoiceRecord) => ({ dilemmaId: x.dilemmaId, optionId: x.optionId }))
      : undefined;
    return {
      v: 1,
      key: p.k,
      createdAt: new Date().toISOString(),
      character: p.c && typeof p.c.name === 'string' ? p.c : undefined,
      choices,
      finishedAt: typeof p.f === 'string' ? p.f : undefined,
      devotional: {
        startDate: typeof p.s === 'string' ? p.s : undefined,
        done: Array.isArray(p.d) ? p.d.filter((n: unknown) => typeof n === 'number') : [],
      },
      reminder: { enabled: false, time: '07:00' },
      keySeen: true,
    };
  } catch {
    return null;
  }
}
