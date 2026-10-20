export type HairType =
  | 'crespo'
  | 'cacheado'
  | 'liso'
  | 'careca'
  | 'black_power'
  | 'reto';

export type SkinColor = 'branco' | 'amarelo' | 'marrom' | 'preto';

export type Gender = 'masculino' | 'feminino';

export type OutfitType =
  | 'terno_gravata'
  | 'vestido'
  | 'saia_blusa'
  | 'calca_camiseta'
  | 'bermuda_camiseta';

export type FootwearType = 'tenis' | 'sandalia';

export interface CharacterConfig {
  name: string;
  gender: Gender;
  hair: HairType;
  skinColor: SkinColor;
  outfit: OutfitType;
  footwear: FootwearType;
  glasses?: boolean;
  bibleInHand?: boolean;
}

/**
 * As 7 "forças" de liderança medidas pelo jogo.
 * Nenhuma é melhor que a outra: o resultado mostra TENDÊNCIAS, não acertos.
 */
export type DimensionKey =
  | 'servo' // Coração de Servo
  | 'integridade' // Âncora de Integridade
  | 'devocional' // Raiz Profunda (vida interior e lar)
  | 'comunicacao' // Voz que Edifica
  | 'protecao' // Pastor-Sentinela
  | 'mediacao' // Construtor de Pontes
  | 'mentoria'; // Formador de Líderes

export interface DilemmaOption {
  id: string;
  text: string;
  /** Força principal revelada por esta escolha (peso 3) */
  primary: DimensionKey;
  /** Força secundária (peso 1) */
  secondary?: DimensionKey;
}

export interface DilemmaBookNote {
  chapter: string;
  /** Princípio do livro, em linguagem simples, mostrado só no relatório final */
  insight: string;
  scripture: string;
}

export interface Dilemma {
  id: string;
  category: 'juventude' | 'igreja' | 'pessoal_familiar' | 'conflito' | 'discipulado';
  title: string;
  context: string;
  situation: string;
  options: DilemmaOption[];
  bookNote: DilemmaBookNote;
}

export interface ChoiceRecord {
  dilemmaId: string;
  optionId: string;
}

export interface DimensionResult {
  key: DimensionKey;
  earned: number;
  max: number;
  /** 0-100: quanto da pontuação possível nesta força o jogador conquistou */
  percentage: number;
  /** quantas vezes esta força foi a escolha principal */
  picks: number;
  /** posição no ranking (1 = mais forte) */
  rank: number;
}

export interface ScoreProfile {
  dimensions: Record<DimensionKey, DimensionResult>;
  ranking: DimensionKey[];
  top: DimensionKey[];
  attention: DimensionKey[];
  totalChoices: number;
  profileTitle: string;
  profileSubtitle: string;
  summary: string;
  balanceNote: string;
  strengths: string[];
  growthAreas: string[];
  exhortation: string;
  choices: ChoiceRecord[];
}

export interface DevotionalDay {
  day: number;
  /** Força de liderança trabalhada neste dia */
  dimension: DimensionKey;
  title: string;
  theme: string;
  scriptureRef: string;
  scriptureText: string;
  supportingScriptures: string[];
  smallingPrinciple: string;
  reflection: string;
  /** Nota personalizada conforme a posição da força no resultado do jogador */
  personalNote: {
    forca: string;
    equilibrio: string;
    atencao: string;
  };
  meditationQuestions: string[];
  practicalAction: string;
  prayerFocus: string;
  mutualAccountabilityPrompt: string;
}

/** Dia do plano já ordenado e personalizado para o jogador */
export interface PersonalizedDay extends DevotionalDay {
  position: number; // 1..7 na ordem personalizada
  level: 'forca' | 'equilibrio' | 'atencao';
  note: string;
  dimensionPercentage: number;
  /** Escolha(s) do jogador nas situações que tocaram este tema */
  relatedChoices: { situation: string; chosen: string }[];
}
