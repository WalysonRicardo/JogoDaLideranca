/**
 * Cenas animadas que simulam cada situação.
 * Posições (x, y) em % do quadro; y é a linha dos pés / base do item.
 * d = atraso de entrada (segundos), usado para "contar" a história em ordem.
 */

export type Anim = 'pop' | 'bob' | 'slideL' | 'slideR' | 'shake' | 'float' | 'drop' | 'pulse' | 'spin';
export type Mood = 'ok' | 'sad' | 'angry' | 'shy' | 'wow';

export interface PersonItem {
  k: 'p';
  x: number;
  y: number;
  c: string; // cor da roupa
  skin?: number; // 0-3
  hair?: string; // cor do cabelo
  mood?: Mood;
  s?: number; // escala
  flip?: boolean;
  a?: Anim;
  d?: number;
}
export interface EmojiItem {
  k: 'e';
  x: number;
  y: number;
  e: string;
  s?: number;
  a?: Anim;
  d?: number;
}
export interface BubbleItem {
  k: 'b';
  x: number;
  y: number;
  t: string;
  d?: number;
  tone?: 'say' | 'think' | 'loud';
  tail?: 'l' | 'r' | 'c';
}
export type SceneItem = PersonItem | EmojiItem | BubbleItem;

export interface Scene {
  sky: string; // gradiente do fundo (CSS)
  ground: string; // cor do chão
  label: string; // legenda curta da cena
  items: SceneItem[];
}

const INDOOR = 'linear-gradient(180deg,#fde7c8 0%,#fbd29a 100%)';
const DAY = 'linear-gradient(180deg,#bfe3ff 0%,#eaf6ff 100%)';
const NIGHT = 'linear-gradient(180deg,#1e2a5a 0%,#3b3f87 100%)';
const WARM = 'linear-gradient(180deg,#ffe0e0 0%,#ffd1b8 100%)';

export const SCENES: Record<string, Scene> = {
  'sit-1': {
    sky: INDOOR,
    ground: '#c98f5a',
    label: 'Sábado, antes do culto',
    items: [
      { k: 'e', x: 50, y: 30, e: '🪑', s: 1.2, a: 'pop', d: 0.1 },
      { k: 'p', x: 18, y: 88, c: '#14a3a0', skin: 1, mood: 'sad', a: 'bob', d: 0.2 },
      { k: 'p', x: 34, y: 88, c: '#e8604c', skin: 3, mood: 'sad', a: 'bob', d: 0.4 },
      { k: 'b', x: 26, y: 44, t: 'Cadê o Lucas?', d: 0.9, tail: 'c' },
      { k: 'e', x: 52, y: 22, e: '⏰', s: 1.1, a: 'shake', d: 1.2 },
      { k: 'p', x: 78, y: 88, c: '#f28b30', skin: 2, mood: 'ok', a: 'slideR', d: 2.2 },
      { k: 'e', x: 70, y: 66, e: '🎸', s: 1.3, a: 'float', d: 2.6 },
      { k: 'b', x: 80, y: 40, t: 'Oi, pessoal!', d: 3.2, tail: 'c' },
    ],
  },
  'sit-2': {
    sky: INDOOR,
    ground: '#c98f5a',
    label: 'A ajuda tem condições',
    items: [
      { k: 'p', x: 22, y: 88, c: '#2f5d9e', skin: 2, mood: 'shy', a: 'bob', d: 0.2 },
      { k: 'p', x: 74, y: 88, c: '#555a66', skin: 1, hair: '#d6d6d6', mood: 'angry', s: 1.12, a: 'shake', d: 0.8 },
      { k: 'b', x: 70, y: 38, t: 'Quem ajuda, opina!', d: 1.2, tone: 'loud', tail: 'c' },
      { k: 'e', x: 50, y: 52, e: '💰', s: 1.4, a: 'drop', d: 1.6 },
      { k: 'e', x: 60, y: 60, e: '🚌', s: 1.5, a: 'slideR', d: 2.2 },
      { k: 'b', x: 22, y: 42, t: '…', d: 2.8, tone: 'think', tail: 'c' },
    ],
  },
  'sit-3': {
    sky: NIGHT,
    ground: '#27315f',
    label: 'Mais uma noite chegando tarde',
    items: [
      { k: 'e', x: 84, y: 24, e: '🌙', s: 1.4, a: 'float', d: 0.1 },
      { k: 'e', x: 10, y: 28, e: '💼', a: 'float', d: 0.3 },
      { k: 'e', x: 22, y: 20, e: '📚', a: 'float', d: 0.5 },
      { k: 'e', x: 34, y: 28, e: '⛪', a: 'float', d: 0.7 },
      { k: 'p', x: 24, y: 90, c: '#14a3a0', skin: 2, mood: 'sad', a: 'slideL', d: 0.9 },
      { k: 'e', x: 78, y: 64, e: '🏠', s: 2.4, a: 'pop', d: 1.6 },
      { k: 'p', x: 66, y: 90, c: '#e8604c', skin: 1, mood: 'sad', a: 'bob', d: 2.2 },
      { k: 'b', x: 62, y: 46, t: 'A gente sente sua falta…', d: 2.7, tail: 'c' },
    ],
  },
  'fam-1': {
    sky: WARM,
    ground: '#c98f5a',
    label: 'Uma casa em pedaços',
    items: [
      { k: 'e', x: 50, y: 56, e: '🏠', s: 2.6, a: 'pop', d: 0.1 },
      { k: 'e', x: 50, y: 42, e: '💔', s: 1.6, a: 'pulse', d: 1.0 },
      { k: 'p', x: 12, y: 90, c: '#555a66', skin: 1, mood: 'sad', a: 'bob', d: 0.4 },
      { k: 'p', x: 88, y: 90, c: '#7b4fc4', skin: 2, mood: 'sad', a: 'bob', d: 0.6, flip: true },
      { k: 'p', x: 36, y: 90, c: '#2b9348', skin: 2, mood: 'sad', s: 0.78, a: 'bob', d: 1.4 },
      { k: 'p', x: 62, y: 90, c: '#e0701a', skin: 3, mood: 'ok', a: 'slideR', d: 2.4, flip: true },
      { k: 'e', x: 50, y: 70, e: '❤️', s: 1.2, a: 'float', d: 3.0 },
    ],
  },
  'sit-4': {
    sky: INDOOR,
    ground: '#c98f5a',
    label: 'Quem organiza a sala?',
    items: [
      { k: 'p', x: 20, y: 90, c: '#7b4fc4', skin: 0, mood: 'shy', s: 0.9, a: 'bob', d: 0.2 },
      { k: 'e', x: 32, y: 74, e: '🪑', a: 'slideR', d: 0.8 },
      { k: 'e', x: 40, y: 74, e: '🪑', a: 'slideR', d: 1.2 },
      { k: 'e', x: 20, y: 38, e: '✨', s: 1.2, a: 'pulse', d: 1.8 },
      { k: 'p', x: 64, y: 90, c: '#e8604c', skin: 1, mood: 'ok', a: 'bob', d: 0.4 },
      { k: 'p', x: 80, y: 90, c: '#14a3a0', skin: 3, mood: 'ok', a: 'bob', d: 0.6, flip: true },
      { k: 'b', x: 72, y: 40, t: 'Hahaha!', d: 1.0, tail: 'c' },
      { k: 'b', x: 22, y: 30, t: '…', d: 2.4, tone: 'think', tail: 'c' },
    ],
  },
  'sit-5': {
    sky: INDOOR,
    ground: '#c98f5a',
    label: 'O outro grupo do WhatsApp',
    items: [
      { k: 'p', x: 14, y: 90, c: '#c23b5a', skin: 1, mood: 'angry', a: 'bob', d: 0.2 },
      { k: 'p', x: 28, y: 90, c: '#1f6fb5', skin: 2, mood: 'angry', a: 'bob', d: 0.4 },
      { k: 'p', x: 72, y: 90, c: '#b8860b', skin: 3, mood: 'sad', a: 'bob', d: 0.6, flip: true },
      { k: 'p', x: 86, y: 90, c: '#2b9348', skin: 0, mood: 'sad', a: 'bob', d: 0.8, flip: true },
      { k: 'e', x: 50, y: 52, e: '📱', s: 2.2, a: 'pulse', d: 1.0 },
      { k: 'e', x: 36, y: 40, e: '💬', s: 1.3, a: 'float', d: 1.5 },
      { k: 'e', x: 64, y: 36, e: '💬', s: 1.3, a: 'float', d: 2.0 },
      { k: 'e', x: 50, y: 28, e: '🔔', s: 1.2, a: 'shake', d: 2.4 },
      { k: 'b', x: 22, y: 48, t: 'só os chegados…', d: 2.8, tone: 'think', tail: 'c' },
    ],
  },
  'sit-6': {
    sky: DAY,
    ground: '#8bc47a',
    label: 'Um visitante cativante',
    items: [
      { k: 'p', x: 50, y: 90, c: '#3b3f87', skin: 1, mood: 'ok', s: 1.1, a: 'pop', d: 0.2 },
      { k: 'e', x: 50, y: 22, e: '⭐', s: 1.4, a: 'pulse', d: 0.8 },
      { k: 'b', x: 52, y: 42, t: 'Escutem, a verdade é outra…', d: 1.2, tail: 'c' },
      { k: 'p', x: 18, y: 90, c: '#14a3a0', skin: 3, mood: 'wow', a: 'bob', d: 0.6 },
      { k: 'p', x: 32, y: 90, c: '#e8604c', skin: 2, mood: 'wow', a: 'bob', d: 0.8 },
      { k: 'p', x: 84, y: 90, c: '#7b4fc4', skin: 0, mood: 'shy', a: 'bob', d: 1.0, flip: true },
      { k: 'e', x: 84, y: 40, e: '❓', s: 1.5, a: 'shake', d: 2.4 },
    ],
  },
  'fam-2': {
    sky: WARM,
    ground: '#c98f5a',
    label: 'Um silêncio entre o casal',
    items: [
      { k: 'p', x: 28, y: 90, c: '#2f5d9e', skin: 2, mood: 'sad', a: 'bob', d: 0.2 },
      { k: 'p', x: 72, y: 90, c: '#c23b5a', skin: 2, mood: 'shy', a: 'bob', d: 0.4, flip: true },
      { k: 'b', x: 74, y: 40, t: 'Tá bom, você que sabe…', d: 1.2, tone: 'think', tail: 'c' },
      { k: 'b', x: 26, y: 42, t: '…', d: 2.0, tone: 'think', tail: 'c' },
      { k: 'e', x: 50, y: 62, e: '💬', s: 1.6, a: 'pulse', d: 2.6 },
      { k: 'e', x: 50, y: 28, e: '❓', s: 1.4, a: 'shake', d: 3.0 },
    ],
  },
  'sit-7': {
    sky: DAY,
    ground: '#8bc47a',
    label: 'Quem fica com a quadra?',
    items: [
      { k: 'e', x: 50, y: 48, e: '⚽', s: 1.8, a: 'bob', d: 0.3 },
      { k: 'e', x: 50, y: 78, e: '🎭', s: 1.8, a: 'bob', d: 0.6 },
      { k: 'p', x: 14, y: 90, c: '#f28b30', skin: 3, mood: 'angry', a: 'shake', d: 0.8 },
      { k: 'p', x: 28, y: 90, c: '#14a3a0', skin: 2, mood: 'angry', a: 'shake', d: 0.9 },
      { k: 'p', x: 72, y: 90, c: '#c23b5a', skin: 1, mood: 'angry', a: 'shake', d: 1.0, flip: true },
      { k: 'p', x: 86, y: 90, c: '#7b4fc4', skin: 0, mood: 'angry', a: 'shake', d: 1.1, flip: true },
      { k: 'b', x: 22, y: 40, t: 'É nosso horário!', d: 1.6, tone: 'loud', tail: 'c' },
      { k: 'b', x: 78, y: 40, t: 'Não, é nosso!', d: 2.4, tone: 'loud', tail: 'c' },
    ],
  },
  'sit-8': {
    sky: INDOOR,
    ground: '#c98f5a',
    label: 'Só dá para uma coisa',
    items: [
      { k: 'e', x: 50, y: 62, e: '🐷', s: 2.2, a: 'pulse', d: 0.2 },
      { k: 'e', x: 50, y: 30, e: '🪙', s: 1.2, a: 'drop', d: 0.6 },
      { k: 'e', x: 44, y: 24, e: '🪙', s: 1.0, a: 'drop', d: 1.0 },
      { k: 'p', x: 14, y: 90, c: '#2b9348', skin: 1, mood: 'ok', a: 'bob', d: 0.6 },
      { k: 'e', x: 24, y: 64, e: '⛺', s: 1.7, a: 'pop', d: 1.4 },
      { k: 'b', x: 18, y: 42, t: 'Retiro!', d: 1.6, tail: 'c' },
      { k: 'p', x: 86, y: 90, c: '#e0701a', skin: 3, mood: 'ok', a: 'bob', d: 0.8, flip: true },
      { k: 'e', x: 76, y: 64, e: '🧺', s: 1.7, a: 'pop', d: 2.2 },
      { k: 'b', x: 82, y: 42, t: 'Ajudar as famílias!', d: 2.4, tail: 'c' },
    ],
  },
  'sit-9': {
    sky: INDOOR,
    ground: '#c98f5a',
    label: 'Sempre a mesma coisa',
    items: [
      { k: 'e', x: 50, y: 34, e: '🕰️', s: 1.8, a: 'spin', d: 0.2 },
      { k: 'e', x: 78, y: 30, e: '📅', s: 1.5, a: 'float', d: 0.5 },
      { k: 'p', x: 20, y: 90, c: '#14a3a0', skin: 2, mood: 'sad', a: 'bob', d: 0.4 },
      { k: 'p', x: 34, y: 90, c: '#e8604c', skin: 1, mood: 'sad', a: 'bob', d: 0.6 },
      { k: 'p', x: 68, y: 90, c: '#7b4fc4', skin: 3, mood: 'sad', a: 'bob', d: 0.8, flip: true },
      { k: 'b', x: 26, y: 48, t: 'Mesma coisa de sempre…', d: 1.2, tone: 'think', tail: 'c' },
      { k: 'e', x: 80, y: 82, e: '🌱', s: 1.8, a: 'pop', d: 2.8 },
    ],
  },
  'fam-3': {
    sky: WARM,
    ground: '#c98f5a',
    label: 'O pai disse não',
    items: [
      { k: 'p', x: 70, y: 90, c: '#555a66', skin: 1, mood: 'angry', s: 1.1, a: 'shake', d: 0.6, flip: true },
      { k: 'b', x: 72, y: 38, t: 'Não vai!', d: 1.0, tone: 'loud', tail: 'c' },
      { k: 'e', x: 52, y: 50, e: '🚫', s: 1.7, a: 'pulse', d: 1.4 },
      { k: 'p', x: 26, y: 90, c: '#e0701a', skin: 2, mood: 'sad', s: 0.92, a: 'bob', d: 0.3 },
      { k: 'e', x: 36, y: 74, e: '📖', s: 1.3, a: 'float', d: 0.8 },
      { k: 'e', x: 10, y: 34, e: '⛪', s: 1.6, a: 'float', d: 1.8 },
      { k: 'b', x: 26, y: 40, t: 'Eu queria tanto ir…', d: 2.4, tone: 'think', tail: 'c' },
    ],
  },
  'sit-10': {
    sky: NIGHT,
    ground: '#27315f',
    label: 'Noite de louvor… com falhas',
    items: [
      { k: 'p', x: 50, y: 90, c: '#f28b30', skin: 3, mood: 'sad', a: 'bob', d: 0.2 },
      { k: 'e', x: 36, y: 62, e: '🎤', s: 1.5, a: 'shake', d: 0.8 },
      { k: 'e', x: 66, y: 60, e: '🔊', s: 1.6, a: 'pulse', d: 1.2 },
      { k: 'e', x: 66, y: 34, e: '❌', s: 1.2, a: 'pop', d: 1.6 },
      { k: 'b', x: 50, y: 34, t: 'O som falhou…', d: 1.4, tone: 'think', tail: 'c' },
      { k: 'e', x: 16, y: 40, e: '🎉', s: 1.4, a: 'float', d: 2.4 },
      { k: 'e', x: 84, y: 76, e: '👏', s: 1.4, a: 'bob', d: 2.8 },
      { k: 'b', x: 18, y: 66, t: 'Foi lindo!', d: 3.0, tail: 'c' },
    ],
  },
  'sit-11': {
    sky: INDOOR,
    ground: '#c98f5a',
    label: 'Quem decide aqui?',
    items: [
      { k: 'p', x: 18, y: 90, c: '#555a66', skin: 1, hair: '#d6d6d6', mood: 'angry', s: 1.1, a: 'bob', d: 0.2 },
      { k: 'b', x: 22, y: 38, t: 'Eu decido!', d: 0.8, tone: 'loud', tail: 'c' },
      { k: 'p', x: 74, y: 90, c: '#14a3a0', skin: 3, mood: 'ok', a: 'bob', d: 0.4, flip: true },
      { k: 'p', x: 88, y: 90, c: '#e8604c', skin: 2, mood: 'ok', a: 'bob', d: 0.6, flip: true },
      { k: 'e', x: 80, y: 40, e: '✋', s: 1.4, a: 'float', d: 1.6 },
      { k: 'b', x: 78, y: 28, t: 'E nós?', d: 1.8, tail: 'c' },
      { k: 'p', x: 48, y: 90, c: '#1f6fb5', skin: 2, mood: 'shy', a: 'bob', d: 1.0 },
      { k: 'e', x: 48, y: 42, e: '❓', s: 1.4, a: 'shake', d: 2.6 },
    ],
  },
  'fam-4': {
    sky: NIGHT,
    ground: '#27315f',
    label: 'Meia-noite e o celular aceso',
    items: [
      { k: 'e', x: 84, y: 22, e: '🌙', s: 1.4, a: 'float', d: 0.1 },
      { k: 'p', x: 28, y: 90, c: '#14a3a0', skin: 2, mood: 'ok', s: 0.92, a: 'bob', d: 0.3 },
      { k: 'e', x: 40, y: 70, e: '📱', s: 1.5, a: 'pulse', d: 0.8 },
      { k: 'e', x: 52, y: 30, e: '🕛', s: 1.5, a: 'pulse', d: 1.2 },
      { k: 'p', x: 74, y: 90, c: '#e8604c', skin: 2, mood: 'angry', a: 'shake', d: 1.8, flip: true },
      { k: 'b', x: 74, y: 38, t: 'Já é meia-noite!', d: 2.2, tone: 'loud', tail: 'c' },
      { k: 'b', x: 26, y: 44, t: 'Só mais um pouquinho…', d: 3.0, tone: 'think', tail: 'c' },
    ],
  },
  'sit-12': {
    sky: INDOOR,
    ground: '#c98f5a',
    label: 'Diante de todos',
    items: [
      { k: 'p', x: 14, y: 90, c: '#7b4fc4', skin: 1, mood: 'ok', s: 0.9, a: 'bob', d: 0.2 },
      { k: 'p', x: 26, y: 90, c: '#14a3a0', skin: 3, mood: 'wow', s: 0.9, a: 'bob', d: 0.3 },
      { k: 'p', x: 38, y: 90, c: '#e0701a', skin: 2, mood: 'wow', s: 0.9, a: 'bob', d: 0.4 },
      { k: 'p', x: 82, y: 90, c: '#555a66', skin: 1, hair: '#d6d6d6', mood: 'angry', s: 1.1, a: 'shake', d: 0.8, flip: true },
      { k: 'e', x: 66, y: 56, e: '👉', s: 1.6, a: 'float', d: 1.2 },
      { k: 'b', x: 78, y: 32, t: 'Você não leva a sério!', d: 1.4, tone: 'loud', tail: 'c' },
      { k: 'p', x: 56, y: 90, c: '#2f5d9e', skin: 2, mood: 'shy', a: 'pop', d: 2.2 },
      { k: 'e', x: 56, y: 50, e: '😳', s: 1.2, a: 'pulse', d: 2.8 },
    ],
  },
};
