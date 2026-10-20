import { DEVOTIONAL_PLAN } from '../data/devotional';
import { Dilemma, PersonalizedDay, ScoreProfile } from '../types';

/**
 * Monta o plano devocional personalizado.
 * Ordem: começa pelas forças que mais pedem atenção e termina nas que já são
 * naturais para o jogador (para fechar a semana em tom de gratidão).
 * Cada dia recebe uma nota conforme a posição da força no resultado e a lista
 * das escolhas que o jogador fez nas situações relacionadas àquele tema.
 */
export function buildPersonalizedPlan(
  profile: ScoreProfile,
  dilemmas: Dilemma[]
): PersonalizedDay[] {
  const order = [...profile.ranking].reverse();

  return order.map((dimension, index) => {
    const base = DEVOTIONAL_PLAN.find((d) => d.dimension === dimension)!;
    const result = profile.dimensions[dimension];

    const level: PersonalizedDay['level'] =
      result.rank <= 2 ? 'forca' : result.rank >= profile.ranking.length - 1 ? 'atencao' : 'equilibrio';

    const relatedChoices = profile.choices
      .map((choice) => {
        const dilemma = dilemmas.find((d) => d.id === choice.dilemmaId);
        const option = dilemma?.options.find((o) => o.id === choice.optionId);
        if (!dilemma || !option || option.primary !== dimension) return null;
        return { situation: dilemma.title, chosen: option.text };
      })
      .filter((x): x is { situation: string; chosen: string } => x !== null);

    return {
      ...base,
      position: index + 1,
      level,
      note: base.personalNote[level],
      dimensionPercentage: result.percentage,
      relatedChoices,
    };
  });
}
