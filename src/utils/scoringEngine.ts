import { ChoiceRecord, DimensionKey, DimensionResult, Dilemma, ScoreProfile } from '../types';

/**
 * Motor de perfil do Líder 360°.
 *
 * Não existe "certo" ou "errado": cada alternativa revela uma força de liderança.
 * A cada escolha, a força principal ganha 3 pontos e a secundária 1 ponto.
 * O resultado mostra tendências (o que você faz por instinto) e pontos de
 * atenção (o que você tende a deixar em segundo plano), a base do plano
 * devocional personalizado.
 */

export const DIMENSION_KEYS: DimensionKey[] = [
  'servo',
  'integridade',
  'devocional',
  'comunicacao',
  'protecao',
  'mediacao',
  'mentoria',
];

export interface DimensionInfo {
  label: string; // nome curto do "estilo"
  full: string; // nome da força
  icon: string;
  color: string; // cor principal (hex) usada nos gráficos
  colorSoft: string;
  description: string;
  bibleReference: string;
  strength: string; // texto quando é uma força
  blindSpot: string; // texto quando é ponto de atenção
}

export const DIMENSION_INFO: Record<DimensionKey, DimensionInfo> = {
  servo: {
    label: 'Coração de Servo',
    full: 'Liderança de Servo',
    icon: '🤝',
    color: '#E0701A',
    colorSoft: '#FDEBD8',
    description:
      'Lidera abaixando-se: escuta, acolhe e coloca as pessoas à frente do próprio cargo.',
    bibleReference: 'Mt 20:25-28; Fp 2:3-5',
    strength:
      'Você acolhe com facilidade e faz o jovem se sentir visto. Isso gera confiança e um ambiente seguro para o grupo crescer.',
    blindSpot:
      'Pode ser que você pouco se coloque como alguém que acolhe e escuta antes de agir. Quando o grupo sente que o líder está distante, a confiança demora a nascer.',
  },
  integridade: {
    label: 'Âncora de Integridade',
    full: 'Firmeza e Integridade',
    icon: '⚓',
    color: '#1F6FB5',
    colorSoft: '#DCEBF8',
    description:
      'Sustenta o que é certo e cumpre a palavra, mesmo quando isso custa algo.',
    bibleReference: 'Sl 15:4; 2 Co 1:12',
    strength:
      'Você é alguém de palavra, que sustenta combinados e princípios. Os jovens sabem em que chão estão pisando.',
    blindSpot:
      'Em algumas situações, você tende a deixar de lado a firmeza ou a clareza de princípios para manter a paz. Cuidado com o hábito de adiar decisões difíceis.',
  },
  devocional: {
    label: 'Raiz Profunda',
    full: 'Vida Interior e Cuidado do Lar',
    icon: '🕯️',
    color: '#7B4FC4',
    colorSoft: '#EBE1F8',
    description:
      'Busca a Deus antes de agir e cuida do próprio coração, da família e do ritmo de vida.',
    bibleReference: 'At 20:28; 1 Tm 4:16',
    strength:
      'Você recorre à oração e à Palavra antes de agir e cuida da vida pessoal e familiar. Isso sustenta o ministério no longo prazo.',
    blindSpot:
      'Sua tendência é partir logo para a ação. Pode valer a pena desacelerar para orar, descansar e cuidar da família: um líder cansado decide pior e serve menos.',
  },
  comunicacao: {
    label: 'Voz que Edifica',
    full: 'Comunicação e Conversa Franca',
    icon: '🗣️',
    color: '#0E9F8E',
    colorSoft: '#D6F3EE',
    description:
      'Fala a verdade com clareza e carinho: afirma o que é bom e corrige sem rodeios.',
    bibleReference: 'Ef 4:15, 29; Pv 25:11',
    strength:
      'Você conversa de frente, elogia com sinceridade e corrige sem humilhar. Os jovens sabem o que você pensa.',
    blindSpot:
      'Em momentos difíceis, você tende a evitar a conversa direta e deixar as coisas se resolverem sozinhas. Uma palavra dita cedo e com amor costuma poupar muito desgaste.',
  },
  protecao: {
    label: 'Pastor-Sentinela',
    full: 'Cuidado e Proteção do Rebanho',
    icon: '🛡️',
    color: '#C23B5A',
    colorSoft: '#F9DDE4',
    description:
      'Zela pela ordem, pela doutrina e pela segurança do grupo, protegendo-o de riscos.',
    bibleReference: 'At 20:28-31; 1 Pe 5:2',
    strength:
      'Você cuida de estrutura, regras e doutrina. O grupo se sente protegido e organizado sob a sua liderança.',
    blindSpot:
      'Há uma tendência a confiar mais no improviso do que em estrutura e vigilância. Atenção a sinais pequenos de divisão ou de ensinos estranhos antes que cresçam.',
  },
  mediacao: {
    label: 'Construtor de Pontes',
    full: 'Mediação e Pacificação',
    icon: '🌉',
    color: '#2B9348',
    colorSoft: '#DAF1E0',
    description:
      'Reconcilia pessoas e busca saídas em que todos ganham, sem criar perdedores.',
    bibleReference: 'Mt 5:9; Rm 12:18',
    strength:
      'Você enxerga os dois lados e busca soluções em que ninguém sai humilhado. É um líder que une.',
    blindSpot:
      'Quando há conflito, você tende a escolher um lado, impor regras ou se afastar. Ouvir os dois lados e conduzir um acordo pode abrir saídas que você ainda não viu.',
  },
  mentoria: {
    label: 'Formador de Líderes',
    full: 'Mentoria e Discipulado',
    icon: '🌱',
    color: '#B8860B',
    colorSoft: '#F7EBC4',
    description:
      'Investe em pessoas: delega, acompanha e ajuda cada um a crescer no seu próprio jeito.',
    bibleReference: '2 Tm 2:2; 1 Co 12:4',
    strength:
      'Você enxerga potencial nas pessoas e as prepara para liderar. Seu grupo tende a crescer em quantidade de líderes.',
    blindSpot:
      'Há uma tendência a carregar tudo sozinho ou a decidir por conta própria. Delegar e acompanhar de perto prepara a próxima geração e alivia você.',
  },
};

const PRIMARY_WEIGHT = 3;
const SECONDARY_WEIGHT = 1;

/** Máximo que uma força pode render em cada situação (3 se for principal em alguma alternativa, 1 se só secundária). */
function computeMaxPerDimension(dilemmas: Dilemma[]): Record<DimensionKey, number> {
  const max = Object.fromEntries(DIMENSION_KEYS.map((k) => [k, 0])) as Record<DimensionKey, number>;
  dilemmas.forEach((d) => {
    DIMENSION_KEYS.forEach((k) => {
      let best = 0;
      d.options.forEach((o) => {
        if (o.primary === k) best = Math.max(best, PRIMARY_WEIGHT);
        else if (o.secondary === k) best = Math.max(best, SECONDARY_WEIGHT);
      });
      max[k] += best;
    });
  });
  return max;
}

export function calculateScoreProfile(
  choices: ChoiceRecord[],
  dilemmas: Dilemma[]
): ScoreProfile {
  const earned = Object.fromEntries(DIMENSION_KEYS.map((k) => [k, 0])) as Record<DimensionKey, number>;
  const picks = Object.fromEntries(DIMENSION_KEYS.map((k) => [k, 0])) as Record<DimensionKey, number>;

  choices.forEach((c) => {
    const d = dilemmas.find((x) => x.id === c.dilemmaId);
    const o = d?.options.find((x) => x.id === c.optionId);
    if (!o) return;
    earned[o.primary] += PRIMARY_WEIGHT;
    picks[o.primary] += 1;
    if (o.secondary) earned[o.secondary] += SECONDARY_WEIGHT;
  });

  const max = computeMaxPerDimension(dilemmas);

  // ordena por porcentagem (desempate: mais escolhas principais, depois ordem fixa)
  const provisional = DIMENSION_KEYS.map((k) => ({
    key: k,
    earned: earned[k],
    max: max[k],
    percentage: max[k] > 0 ? Math.round((earned[k] / max[k]) * 100) : 0,
    picks: picks[k],
  }));
  provisional.sort(
    (a, b) =>
      b.percentage - a.percentage ||
      b.picks - a.picks ||
      DIMENSION_KEYS.indexOf(a.key) - DIMENSION_KEYS.indexOf(b.key)
  );

  const dimensions = {} as Record<DimensionKey, DimensionResult>;
  provisional.forEach((p, i) => {
    dimensions[p.key] = { ...p, rank: i + 1 };
  });

  const ranking = provisional.map((p) => p.key);
  const top = ranking.slice(0, 2);
  const attention = ranking.slice(-2).reverse(); // do menor para o maior

  const t1 = DIMENSION_INFO[top[0]];
  const t2 = DIMENSION_INFO[top[1]];
  const gap = dimensions[ranking[0]].percentage - dimensions[ranking[ranking.length - 1]].percentage;

  const profileTitle = t1.label;
  const profileSubtitle = `com traços de ${t2.label}`;

  const summary =
    `Nas situações do grupo de jovens, suas escolhas apontaram com mais frequência para ${t1.full.toLowerCase()} ` +
    `e, em seguida, para ${t2.full.toLowerCase()}. Isso descreve o que você faz por instinto quando precisa liderar. ` +
    `Não é um julgamento: todo estilo tem forças e tem pontos cegos, e o livro de Smalling mostra que a liderança cristã se completa quando as várias forças trabalham juntas.`;

  const balanceNote =
    gap <= 25
      ? 'Seu perfil é bem equilibrado: suas escolhas passaram por várias formas de liderar, sem depender de uma só. Isso é uma riqueza, e vale ter atenção para não ficar sem direção própria em momentos de pressão.'
      : gap >= 55
      ? 'Seu perfil é bem marcado: você tem um estilo muito claro de liderar. Isso dá identidade ao seu ministério, mas também pede cuidado, porque as forças que ficam de lado fazem falta quando a situação exige.'
      : 'Seu perfil tem uma tendência clara, sem ser extremo. Há forças bem desenvolvidas e outras que merecem um pouco mais de atenção.';

  const strengths = top.map((k) => DIMENSION_INFO[k].strength);
  const growthAreas = attention.map((k) => DIMENSION_INFO[k].blindSpot);

  const exhortation =
    'Nenhuma força é a "melhor". Deus costuma colocar vários tipos de líder lado a lado. Se alguém do seu grupo tem as forças que você deixou de lado, aproxime-se, e peça que ele ajude você. Use os 7 dias do plano devocional como um espelho, não como uma cobrança.';

  return {
    dimensions,
    ranking,
    top,
    attention,
    totalChoices: choices.length,
    profileTitle,
    profileSubtitle,
    summary,
    balanceNote,
    strengths,
    growthAreas,
    exhortation,
    choices,
  };
}
