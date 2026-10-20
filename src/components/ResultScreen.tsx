import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import {
  Download,
  FileText,
  Share2,
  MessageCircle,
  Copy,
  RotateCcw,
  CalendarDays,
  ChevronDown,
  Check,
  Sparkles,
  Compass,
} from 'lucide-react';
import { CharacterConfig, Dilemma, PersonalizedDay, ScoreProfile } from '../types';
import { AvatarRenderer } from './AvatarRenderer';
import { DimensionBars, DonutChart, RadarChart } from './Charts';
import { DIMENSION_INFO } from '../utils/scoringEngine';
import { createReportPdfFile, downloadReportPdf } from '../utils/pdfReport';

interface ResultScreenProps {
  character: CharacterConfig;
  profile: ScoreProfile;
  plan: PersonalizedDay[];
  dilemmas: Dilemma[];
  onRestart: () => void;
  onOpenDevotional: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  character,
  profile,
  plan,
  dilemmas,
  onRestart,
  onOpenDevotional,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<'' | 'img' | 'pdf' | 'share'>('');
  const [toast, setToast] = useState('');
  const [openChoice, setOpenChoice] = useState<string | null>(null);

  const top1 = DIMENSION_INFO[profile.top[0]];
  const top2 = DIMENSION_INFO[profile.top[1]];

  const shareText =
    `Fiz o Líder 360° e meu perfil de liderança é "${profile.profileTitle}" ${top1.icon} ${profile.profileSubtitle}. ` +
    `Descubra o seu, sem resposta certa ou errada:`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 3500);
  };

  useEffect(() => {
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.35 }, colors: [top1.color, top2.color, '#F59E0B', '#FFFFFF'] });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cardToPng = async () => {
    if (!cardRef.current) throw new Error('card');
    return toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#ffffff', cacheBust: true });
  };

  const downloadImage = async () => {
    try {
      setBusy('img');
      const dataUrl = await cardToPng();
      const a = document.createElement('a');
      a.download = 'meu-perfil-lider-360.png';
      a.href = dataUrl;
      a.click();
      flash('Imagem salva! Pronta para postar.');
    } catch {
      flash('Não consegui gerar a imagem. Tente novamente.');
    } finally {
      setBusy('');
    }
  };

  const nativeShare = async () => {
    try {
      setBusy('share');
      const dataUrl = await cardToPng();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'meu-perfil-lider-360.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Meu perfil Líder 360°', text: `${shareText} ${shareUrl}`, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title: 'Meu perfil Líder 360°', text: shareText, url: shareUrl });
      } else {
        await copyText();
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') flash('Não foi possível compartilhar. Use "Copiar texto".');
    } finally {
      setBusy('');
    }
  };

  const shareWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank', 'noopener');
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      flash('Texto copiado!');
    } catch {
      flash('Não foi possível copiar.');
    }
  };

  const downloadPdf = async () => {
    try {
      setBusy('pdf');
      // pequeno atraso para o botão mostrar o estado de carregamento
      await new Promise((r) => setTimeout(r, 50));
      downloadReportPdf({ character, profile, plan, dilemmas });
      flash('PDF gerado com resultado e plano devocional!');
    } catch (e) {
      console.error(e);
      flash('Erro ao gerar o PDF.');
    } finally {
      setBusy('');
    }
  };

  const sharePdf = async () => {
    try {
      const file = createReportPdfFile({ character, profile, plan, dilemmas });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Meu relatório Líder 360°', files: [file] });
      } else {
        downloadPdf();
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') flash('Não foi possível compartilhar o PDF.');
    }
  };

  return (
    <div className="pb-16">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-3 rounded-full shadow-xl text-sm font-semibold flex items-center gap-2 max-w-[92vw]">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}

      {/* ───── Cabeçalho do resultado ───── */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: `linear-gradient(135deg, ${top1.color} 0%, #7C2D12 100%)` }}
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute -left-10 bottom-0 w-40 h-40 rounded-full bg-white/10" />
        <div className="relative max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-32 h-44 sm:w-40 sm:h-56 shrink-0 rounded-3xl bg-white/15 backdrop-blur flex items-center justify-center ring-4 ring-white/30">
            <AvatarRenderer config={character} size="fill" showFullBody className="p-2" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">
              {character.name}, seu perfil de liderança é
            </p>
            <h1 className="mt-1 text-3xl sm:text-5xl font-black leading-tight">
              {top1.icon} {profile.profileTitle}
            </h1>
            <p className="mt-1 text-lg sm:text-xl font-semibold text-white/90">{profile.profileSubtitle}</p>
            <p className="mt-3 text-sm sm:text-base text-white/85 max-w-xl leading-relaxed">
              {top1.description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-5 relative space-y-8">
        {/* ───── Ações: compartilhar + PDF ───── */}
        <section className="bg-white rounded-3xl border border-stone-200 shadow-lg p-4 sm:p-5">
          <p className="text-sm font-black text-stone-800 mb-3">Guarde e compartilhe seu resultado</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={downloadPdf}
              disabled={busy === 'pdf'}
              className="col-span-2 lg:col-span-1 h-14 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] disabled:opacity-60"
            >
              <FileText className="w-5 h-5" />
              {busy === 'pdf' ? 'Gerando PDF...' : 'Baixar PDF completo'}
            </button>
            <button
              type="button"
              onClick={nativeShare}
              disabled={busy === 'share'}
              className="h-14 rounded-2xl bg-stone-900 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
            >
              <Share2 className="w-5 h-5" />
              Compartilhar
            </button>
            <button
              type="button"
              onClick={shareWhatsapp}
              className="h-14 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={downloadImage}
              disabled={busy === 'img'}
              className="h-14 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
            >
              <Download className="w-5 h-5" />
              {busy === 'img' ? 'Salvando...' : 'Salvar imagem'}
            </button>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-stone-500">
            <button type="button" onClick={copyText} className="inline-flex items-center gap-1.5 hover:text-stone-800">
              <Copy className="w-3.5 h-3.5" /> Copiar texto
            </button>
            <button type="button" onClick={sharePdf} className="inline-flex items-center gap-1.5 hover:text-stone-800">
              <Share2 className="w-3.5 h-3.5" /> Enviar o PDF
            </button>
          </div>
        </section>

        {/* ───── Cartão para compartilhar ───── */}
        <section>
          <h2 className="text-lg font-black text-stone-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" /> Seu cartão de perfil
          </h2>
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="w-full max-w-md rounded-[28px] overflow-hidden border border-stone-200 shadow-xl bg-white"
            >
              <div
                className="px-6 pt-6 pb-16 text-white relative"
                style={{ background: `linear-gradient(145deg, ${top1.color}, #7C2D12)` }}
              >
                <p className="text-[11px] font-black tracking-[0.18em] uppercase text-white/80">
                  Líder 360° · Jovens do Jardim do Ingá
                </p>
                <h3 className="mt-3 text-3xl font-black leading-tight">{profile.profileTitle}</h3>
                <p className="text-base font-semibold text-white/90">{profile.profileSubtitle}</p>
                <div className="absolute right-3 bottom-0 translate-y-1/3 w-28 h-40 rounded-2xl bg-white shadow-lg ring-4 ring-white flex items-center justify-center">
                  <AvatarRenderer config={character} size="fill" showFullBody className="p-1.5" />
                </div>
              </div>

              <div className="px-6 pt-6 pb-6">
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Líder</p>
                <p className="text-xl font-black text-stone-900 -mt-0.5">{character.name}</p>

                <div className="mt-2">
                  <RadarChart profile={profile} id="card-radar" />
                </div>

                <div className="mt-1 grid grid-cols-2 gap-2">
                  {profile.top.map((k) => (
                    <div
                      key={k}
                      className="rounded-2xl px-3 py-2.5"
                      style={{ background: DIMENSION_INFO[k].colorSoft }}
                    >
                      <p className="text-[10px] font-black uppercase tracking-wider text-stone-500">Força</p>
                      <p className="text-sm font-black leading-tight" style={{ color: DIMENSION_INFO[k].color }}>
                        {DIMENSION_INFO[k].icon} {DIMENSION_INFO[k].label}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[11px] text-stone-400 text-center">
                  Baseado em «Liderança Cristã», de Roger Smalling · Não existe resposta certa
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───── Gráficos ───── */}
        <section className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">Seu mapa de liderança</h2>
          <p className="text-sm text-stone-500 mt-1">
            Cada ponta mostra uma força. Quanto mais longe do centro, mais suas escolhas apontaram naquela direção.
          </p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <RadarChart profile={profile} id="main-radar" />
            <DimensionBars profile={profile} showDescription />
          </div>

          <div className="mt-8 pt-8 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-base font-black text-stone-900 mb-3">Para onde suas escolhas foram</h3>
              <DonutChart profile={profile} />
            </div>
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-950 leading-relaxed">
              <p className="font-black flex items-center gap-2 mb-1">
                <Compass className="w-4 h-4 text-amber-700" /> Como ler este resultado
              </p>
              {profile.balanceNote}
            </div>
          </div>
        </section>

        {/* ───── Forças e atenção ───── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-5 sm:p-6">
            <h3 className="font-black text-emerald-900 text-lg mb-3">Onde você já brilha</h3>
            <div className="space-y-4">
              {profile.top.map((k) => (
                <div key={k}>
                  <p className="font-extrabold text-sm" style={{ color: DIMENSION_INFO[k].color }}>
                    {DIMENSION_INFO[k].icon} {DIMENSION_INFO[k].label} · {profile.dimensions[k].percentage}%
                  </p>
                  <p className="text-sm text-stone-700 leading-relaxed mt-0.5">{DIMENSION_INFO[k].strength}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-amber-50 border border-amber-200 p-5 sm:p-6">
            <h3 className="font-black text-amber-900 text-lg mb-3">Onde vale dar atenção</h3>
            <div className="space-y-4">
              {profile.attention.map((k) => (
                <div key={k}>
                  <p className="font-extrabold text-sm" style={{ color: DIMENSION_INFO[k].color }}>
                    {DIMENSION_INFO[k].icon} {DIMENSION_INFO[k].label} · {profile.dimensions[k].percentage}%
                  </p>
                  <p className="text-sm text-stone-700 leading-relaxed mt-0.5">{DIMENSION_INFO[k].blindSpot}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Escolhas registradas ───── */}
        <section className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">O que você escolheu</h2>
          <p className="text-sm text-stone-500 mt-1 mb-4">
            Toque em uma situação para ver sua escolha, o estilo que ela revela e o que o livro diz sobre o tema.
          </p>
          <div className="space-y-2.5">
            {profile.choices.map((choice, i) => {
              const d = dilemmas.find((x) => x.id === choice.dilemmaId);
              const o = d?.options.find((x) => x.id === choice.optionId);
              if (!d || !o) return null;
              const info = DIMENSION_INFO[o.primary];
              const isOpen = openChoice === d.id;
              return (
                <div key={d.id} className="rounded-2xl border border-stone-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenChoice(isOpen ? null : d.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-stone-50"
                  >
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ background: info.colorSoft }}
                    >
                      {info.icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-extrabold text-stone-900 truncate">
                        {i + 1}. {d.title}
                      </span>
                      <span className="block text-xs font-bold" style={{ color: info.color }}>
                        {info.label}
                      </span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-3 text-sm bg-stone-50/60">
                      <p className="text-stone-800 leading-relaxed">
                        <span className="font-bold">Você escolheu:</span> {o.text}
                      </p>
                      <div className="rounded-xl bg-white border border-stone-200 p-3">
                        <p className="text-[11px] font-black uppercase tracking-wider text-amber-700">{d.bookNote.chapter}</p>
                        <p className="text-stone-600 leading-relaxed mt-1">{d.bookNote.insight}</p>
                        <p className="text-xs font-bold text-amber-800 mt-1.5">Leitura: {d.bookNote.scripture}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ───── Plano devocional ───── */}
        <section className="rounded-3xl bg-gradient-to-br from-stone-900 to-stone-800 text-white p-5 sm:p-8">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-widest">
            <CalendarDays className="w-4 h-4" /> Plano devocional personalizado
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black">7 dias montados a partir do seu perfil</h2>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">{profile.exhortation}</p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {plan.map((d) => {
              const info = DIMENSION_INFO[d.dimension];
              return (
                <div key={d.day} className="rounded-2xl bg-white/8 border border-white/10 p-3.5 flex gap-3 items-start" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                    style={{ background: info.color }}
                  >
                    {d.position}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold leading-snug">{d.title}</p>
                    <p className="text-xs text-amber-300 font-bold mt-0.5">{d.scriptureRef}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {info.label} ·{' '}
                      {d.level === 'forca' ? 'sua força' : d.level === 'atencao' ? 'ponto de atenção' : 'em equilíbrio'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onOpenDevotional}
              className="h-12 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2"
            >
              <CalendarDays className="w-4 h-4" /> Abrir meu plano de 7 dias
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> Baixar plano + resultado em PDF
            </button>
          </div>
        </section>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-800"
          >
            <RotateCcw className="w-4 h-4" /> Jogar de novo com outro personagem
          </button>
        </div>
      </div>
    </div>
  );
};
