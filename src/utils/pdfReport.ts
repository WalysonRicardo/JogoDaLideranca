import { jsPDF } from 'jspdf';
import { CharacterConfig, Dilemma, PersonalizedDay, ScoreProfile } from '../types';
import { DIMENSION_INFO, DIMENSION_KEYS } from './scoringEngine';

/**
 * Gera o PDF completo: perfil + gráficos + escolhas registradas + plano devocional personalizado.
 * Usa só a fonte padrão do PDF (Helvetica), que cobre acentos do português.
 * Emojis são removidos porque a fonte padrão não os desenha.
 */

const PAGE = { w: 210, h: 297, m: 16 };
const CONTENT_W = PAGE.w - PAGE.m * 2;

const INK: [number, number, number] = [41, 37, 36];
const MUTED: [number, number, number] = [110, 104, 100];
const AMBER: [number, number, number] = [217, 119, 6];

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

/** Mantém Latin-1 + pontuação tipográfica comum; troca o resto. */
const clean = (text: string): string =>
  text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2022/g, '-')
    .replace(/[^\u0020-\u007E\u00A0-\u00FF]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

export interface ReportInput {
  character: CharacterConfig;
  profile: ScoreProfile;
  plan: PersonalizedDay[];
  dilemmas: Dilemma[];
}

export function buildReportPdf({ character, profile, plan, dilemmas }: ReportInput): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = PAGE.m;

  const setColor = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);

  const footer = () => {
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      setColor(MUTED);
      doc.text('Líder 360 - Jornada de Liderança Cristã  |  Baseado na obra de Roger Smalling', PAGE.m, PAGE.h - 8);
      doc.text(`${i} / ${pages}`, PAGE.w - PAGE.m, PAGE.h - 8, { align: 'right' });
    }
  };

  const ensure = (needed: number) => {
    if (y + needed > PAGE.h - 16) {
      doc.addPage();
      y = PAGE.m;
    }
  };

  const paragraph = (
    text: string,
    opts: { size?: number; bold?: boolean; italic?: boolean; color?: [number, number, number]; indent?: number; gap?: number; lineH?: number } = {}
  ) => {
    const { size = 10.5, bold = false, italic = false, color = INK, indent = 0, gap = 2, lineH } = opts;
    doc.setFont('helvetica', bold ? 'bold' : italic ? 'italic' : 'normal');
    doc.setFontSize(size);
    setColor(color);
    const lines = doc.splitTextToSize(clean(text), CONTENT_W - indent) as string[];
    const lh = lineH ?? size * 0.5;
    lines.forEach((line) => {
      ensure(lh);
      doc.text(line, PAGE.m + indent, y);
      y += lh;
    });
    y += gap;
  };

  const heading = (text: string, color: [number, number, number] = AMBER) => {
    ensure(14);
    y += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    setColor(color);
    doc.text(clean(text), PAGE.m, y);
    y += 2;
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.6);
    doc.line(PAGE.m, y, PAGE.m + 24, y);
    y += 6;
  };

  /* ───────── Capa / cabeçalho ───────── */
  doc.setFillColor(194, 65, 12);
  doc.rect(0, 0, PAGE.w, 58, 'F');
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 52, PAGE.w, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 237, 213);
  doc.text('LÍDER 360 - RELATÓRIO DE PERFIL DE LIDERANÇA', PAGE.m, 18);

  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(clean(profile.profileTitle), CONTENT_W) as string[];
  doc.text(titleLines, PAGE.m, 31);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(clean(profile.profileSubtitle), PAGE.m, 42);

  doc.setFontSize(9.5);
  doc.setTextColor(255, 237, 213);
  const dateStr = new Date().toLocaleDateString('pt-BR');
  doc.text(clean(`${character.name}  |  Grupo de jovens - Igreja Batista, Jardim do Ingá (GO)  |  ${dateStr}`), PAGE.m, 49);

  y = 70;

  paragraph(profile.summary, { size: 10.5, lineH: 5.2, gap: 3 });
  paragraph(profile.balanceNote, { size: 10, italic: true, color: MUTED, lineH: 5, gap: 4 });

  /* ───────── Radar ───────── */
  heading('Seu mapa de liderança');
  ensure(88);
  const cx = PAGE.m + 48;
  const cy = y + 40;
  const R = 32;
  const n = DIMENSION_KEYS.length;
  const pt = (i: number, pct: number, extra = 0): [number, number] => {
    const a = ((Math.PI * 2) / n) * i - Math.PI / 2;
    const r = (pct / 100) * R + extra;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  // anéis
  doc.setLineWidth(0.25);
  [25, 50, 75, 100].forEach((ring) => {
    doc.setDrawColor(214, 211, 209);
    for (let i = 0; i < n; i++) {
      const [x1, y1] = pt(i, ring);
      const [x2, y2] = pt((i + 1) % n, ring);
      doc.line(x1, y1, x2, y2);
    }
  });
  for (let i = 0; i < n; i++) {
    const [x, yy] = pt(i, 100);
    doc.setDrawColor(228, 225, 222);
    doc.line(cx, cy, x, yy);
  }
  // área do jogador (leque de triângulos)
  doc.setFillColor(251, 200, 120);
  doc.setDrawColor(251, 200, 120);
  for (let i = 0; i < n; i++) {
    const a = pt(i, Math.max(8, profile.dimensions[DIMENSION_KEYS[i]].percentage));
    const b = pt((i + 1) % n, Math.max(8, profile.dimensions[DIMENSION_KEYS[(i + 1) % n]].percentage));
    doc.triangle(cx, cy, a[0], a[1], b[0], b[1], 'FD');
  }
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.9);
  for (let i = 0; i < n; i++) {
    const a = pt(i, Math.max(8, profile.dimensions[DIMENSION_KEYS[i]].percentage));
    const b = pt((i + 1) % n, Math.max(8, profile.dimensions[DIMENSION_KEYS[(i + 1) % n]].percentage));
    doc.line(a[0], a[1], b[0], b[1]);
  }
  // pontos + rótulos
  DIMENSION_KEYS.forEach((k, i) => {
    const info = DIMENSION_INFO[k];
    const [px, py] = pt(i, Math.max(8, profile.dimensions[k].percentage));
    const rgb = hexToRgb(info.color);
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.circle(px, py, 1.5, 'FD');
    const [lx, ly] = pt(i, 100, 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    const label = clean(info.label);
    const align = lx < cx - 4 ? 'right' : lx > cx + 4 ? 'left' : 'center';
    doc.text(label, lx, ly, { align });
    doc.text(`${profile.dimensions[k].percentage}%`, lx, ly + 3.4, { align });
  });

  // barras ao lado
  const bx = PAGE.m + 100;
  let by = y + 8;
  const bw = PAGE.w - PAGE.m - bx;
  profile.ranking.forEach((k) => {
    const info = DIMENSION_INFO[k];
    const res = profile.dimensions[k];
    const rgb = hexToRgb(info.color);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    setColor(INK);
    doc.text(clean(info.label), bx, by);
    doc.text(`${res.percentage}%`, bx + bw, by, { align: 'right' });
    doc.setFillColor(245, 245, 244);
    doc.roundedRect(bx, by + 1.6, bw, 3, 1.5, 1.5, 'F');
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.roundedRect(bx, by + 1.6, Math.max(2, (bw * res.percentage) / 100), 3, 1.5, 1.5, 'F');
    by += 11;
  });
  y += 84;

  /* ───────── Forças e pontos de atenção ───────── */
  heading('Suas forças', [5, 120, 85]);
  profile.top.forEach((k) => {
    paragraph(`${DIMENSION_INFO[k].label} (${profile.dimensions[k].percentage}%)`, { bold: true, size: 11, gap: 0.5 });
    paragraph(DIMENSION_INFO[k].strength, { lineH: 5, gap: 3, indent: 3 });
  });

  heading('Pontos de atenção', [190, 70, 20]);
  profile.attention.forEach((k) => {
    paragraph(`${DIMENSION_INFO[k].label} (${profile.dimensions[k].percentage}%)`, { bold: true, size: 11, gap: 0.5 });
    paragraph(DIMENSION_INFO[k].blindSpot, { lineH: 5, gap: 3, indent: 3 });
  });
  paragraph(profile.exhortation, { italic: true, color: MUTED, lineH: 5, gap: 4 });

  /* ───────── Escolhas registradas ───────── */
  doc.addPage();
  y = PAGE.m;
  heading('O que você escolheu em cada situação');
  paragraph(
    'Não existe resposta certa. Abaixo estão as suas escolhas, o estilo de liderança que cada uma revela e o princípio do livro de Smalling que dialoga com a situação, como material de reflexão.',
    { size: 9.5, italic: true, color: MUTED, lineH: 4.8, gap: 4 }
  );

  profile.choices.forEach((choice, idx) => {
    const d = dilemmas.find((x) => x.id === choice.dilemmaId);
    const o = d?.options.find((x) => x.id === choice.optionId);
    if (!d || !o) return;
    const info = DIMENSION_INFO[o.primary];
    const rgb = hexToRgb(info.color);

    ensure(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    setColor(INK);
    doc.text(clean(`${idx + 1}. ${d.title}`), PAGE.m, y);
    y += 5.2;

    paragraph(`Você escolheu: ${o.text}`, { size: 9.5, lineH: 4.6, gap: 1.5, indent: 3 });
    paragraph(`Estilo revelado: ${info.label}${o.secondary ? ' (+ ' + DIMENSION_INFO[o.secondary].label + ')' : ''}`, {
      size: 9.5,
      bold: true,
      color: rgb,
      lineH: 4.6,
      gap: 1.5,
      indent: 3,
    });
    paragraph(`${d.bookNote.chapter}: ${d.bookNote.insight}`, { size: 9, italic: true, color: MUTED, lineH: 4.4, gap: 0.5, indent: 3 });
    paragraph(`Leitura: ${d.bookNote.scripture}`, { size: 9, bold: true, color: AMBER, lineH: 4.4, gap: 5, indent: 3 });
  });

  /* ───────── Plano devocional personalizado ───────── */
  doc.addPage();
  y = PAGE.m;
  heading('Seu plano devocional personalizado - 7 dias');
  paragraph(
    'Os dias estão ordenados a partir do seu resultado: começam pelas áreas que mais pedem atenção e terminam nas suas forças naturais, em gratidão. Reserve de 15 a 20 minutos por dia.',
    { size: 9.5, italic: true, color: MUTED, lineH: 4.8, gap: 4 }
  );

  const levelLabel = { forca: 'Sua força', equilibrio: 'Em equilíbrio', atencao: 'Ponto de atenção' } as const;

  plan.forEach((day) => {
    const info = DIMENSION_INFO[day.dimension];
    const rgb = hexToRgb(info.color);

    ensure(60);
    // faixa do dia
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.roundedRect(PAGE.m, y, CONTENT_W, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(clean(`Dia ${day.position}  |  ${day.title}`).slice(0, 78), PAGE.m + 3, y + 6);
    y += 14;

    paragraph(`${info.label} - ${levelLabel[day.level]} (${day.dimensionPercentage}%)`, {
      size: 9.5,
      bold: true,
      color: rgb,
      gap: 1.5,
      lineH: 4.6,
    });
    paragraph(`Tema: ${day.theme}`, { size: 9.5, color: MUTED, lineH: 4.6, gap: 2 });

    paragraph(`${day.scriptureRef}`, { bold: true, size: 10.5, gap: 0.5 });
    paragraph(day.scriptureText, { italic: true, size: 10, lineH: 4.8, gap: 1.5, indent: 3 });
    paragraph(`Textos de apoio: ${day.supportingScriptures.join('; ')}`, { size: 9, color: MUTED, lineH: 4.4, gap: 3 });

    paragraph('Para você, hoje', { bold: true, size: 10, gap: 0.5, color: AMBER });
    paragraph(day.note, { size: 9.5, lineH: 4.7, gap: 2 });

    if (day.relatedChoices.length > 0) {
      paragraph('Suas escolhas ligadas a este tema', { bold: true, size: 9.5, gap: 0.5 });
      day.relatedChoices.slice(0, 3).forEach((rc) => {
        paragraph(`- ${rc.situation}: ${rc.chosen}`, { size: 8.8, color: MUTED, lineH: 4.2, gap: 0.8, indent: 3 });
      });
      y += 1.5;
    }

    paragraph('Princípio do livro', { bold: true, size: 10, gap: 0.5 });
    paragraph(day.smallingPrinciple, { size: 9.5, lineH: 4.7, gap: 2 });
    paragraph('Reflexão', { bold: true, size: 10, gap: 0.5 });
    paragraph(day.reflection, { size: 9.5, lineH: 4.7, gap: 2 });

    paragraph('Perguntas para meditar', { bold: true, size: 10, gap: 0.5 });
    day.meditationQuestions.forEach((q) => paragraph(`- ${q}`, { size: 9.5, lineH: 4.6, gap: 0.8, indent: 3 }));
    y += 1.5;

    paragraph('Prática do dia', { bold: true, size: 10, gap: 0.5 });
    paragraph(day.practicalAction, { size: 9.5, lineH: 4.7, gap: 2 });
    paragraph('Oração', { bold: true, size: 10, gap: 0.5 });
    paragraph(day.prayerFocus, { size: 9.5, italic: true, lineH: 4.7, gap: 2 });
    paragraph('Compartilhar e orar juntos', { bold: true, size: 10, gap: 0.5 });
    paragraph(day.mutualAccountabilityPrompt, { size: 9.5, lineH: 4.7, gap: 8 });
  });

  footer();
  return doc;
}

export function downloadReportPdf(input: ReportInput): Blob {
  const doc = buildReportPdf(input);
  const name = input.character.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  doc.save(`lider-360-${name || 'relatorio'}.pdf`);
  return doc.output('blob');
}

export function createReportPdfFile(input: ReportInput): File {
  const doc = buildReportPdf(input);
  return new File([doc.output('blob')], 'meu-relatorio-lider-360.pdf', { type: 'application/pdf' });
}
