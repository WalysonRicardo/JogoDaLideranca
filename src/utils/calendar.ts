import { PersonalizedDay } from '../types';

/** Gera um arquivo .ics com um alarme por dia do plano (funciona em Android e iPhone). */
export function buildIcs(plan: PersonalizedDay[], startDate: string, time: string): string {
  const [y, m, d] = startDate.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  const events = plan.map((day, i) => {
    const start = new Date(y, m - 1, d + i, hh, mm);
    const end = new Date(start.getTime() + 20 * 60_000);
    const f = (dt: Date) => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
    return [
      'BEGIN:VEVENT',
      `UID:lider360-dia${i + 1}-${startDate}@lider360`,
      `DTSTAMP:${stamp}Z`,
      `DTSTART:${f(start)}`,
      `DTEND:${f(end)}`,
      `SUMMARY:${esc(`Devocional Líder 360° · Dia ${i + 1}: ${day.title}`)}`,
      `DESCRIPTION:${esc(`Leitura: ${day.scriptureRef}. Prática: ${day.practicalAction}`)}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Hora do devocional',
      'TRIGGER:PT0M',
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });

  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Lider 360//PT-BR', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR'].join('\r\n');
}

export function downloadIcs(plan: PersonalizedDay[], startDate: string, time: string): void {
  const blob = new Blob([buildIcs(plan, startDate, time)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'devocional-lider-360.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
