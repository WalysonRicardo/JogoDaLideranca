import { PersonalizedDay } from '../types';
import { SavedState, dayNumber, toISODate } from './storage';

/**
 * Lembretes do devocional, sem servidor e sem coleta de dados.
 *
 * Como funciona de verdade (importante para quem usa o app):
 *  - Android (Chrome): com o app instalado na tela inicial, o navegador pode
 *    disparar o aviso mesmo com o app fechado (Periodic Background Sync).
 *    Fora do app instalado, o aviso aparece quando a página é aberta.
 *  - iPhone (Safari): o iOS só permite notificações para apps adicionados à
 *    Tela de Início (iOS 16.4 ou mais novo). O aviso aparece quando o app é aberto
 *    ou voltado ao primeiro plano.
 *  - Em qualquer aparelho, o arquivo de calendário (.ics) cria um alarme diário
 *    que o próprio celular dispara, com o app fechado. É a opção mais confiável.
 */

export type NotifSupport = 'ok' | 'ios-needs-install' | 'unsupported';

export const isIOS = (): boolean =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && (navigator as Navigator & { maxTouchPoints: number }).maxTouchPoints > 1);

export const isStandalone = (): boolean =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

export function notifSupport(): NotifSupport {
  if (isIOS() && !isStandalone()) return 'ios-needs-install';
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return 'unsupported';
  return 'ok';
}

export const permission = (): NotificationPermission | 'unsupported' =>
  'Notification' in window ? Notification.permission : 'unsupported';

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return null;
  try {
    return await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  } catch {
    return null;
  }
}

/** Pede permissão ao navegador. Deve ser chamada a partir de um toque do usuário. */
export async function askPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return 'default';
  }
}

/** Entrega ao service worker o que ele precisa para avisar (guardado só no aparelho). */
export async function syncReminder(state: SavedState, plan: PersonalizedDay[] | null): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const payload = {
      enabled: state.reminder.enabled && permission() === 'granted',
      time: state.reminder.time,
      startDate: state.devotional.startDate,
      done: state.devotional.done,
      titles: plan ? plan.map((d) => d.title) : [],
      lastNotified: state.lastNotified,
    };
    reg.active?.postMessage({ type: 'SAVE_REMINDER', payload });

    const periodic = (reg as ServiceWorkerRegistration & {
      periodicSync?: { register: (tag: string, o: { minInterval: number }) => Promise<void>; unregister: (tag: string) => Promise<void> };
    }).periodicSync;
    if (periodic) {
      if (payload.enabled) await periodic.register('devocional-diario', { minInterval: 12 * 60 * 60 * 1000 });
      else await periodic.unregister('devocional-diario');
    }
  } catch {
    /* sem suporte: o aviso acontece ao abrir o app */
  }
}

/**
 * Chamada ao abrir o app / voltar a ele: se estiver na hora e o aviso de hoje ainda
 * não saiu, mostra a notificação. Devolve a data para marcar como já avisado.
 */
export async function notifyIfDue(state: SavedState, plan: PersonalizedDay[] | null): Promise<string | null> {
  if (!plan || !state.reminder.enabled || permission() !== 'granted') return null;
  const now = new Date();
  const [hh, mm] = state.reminder.time.split(':').map(Number);
  if (now.getHours() * 60 + now.getMinutes() < hh * 60 + mm) return null;
  const today = toISODate(now);
  if (state.lastNotified === today) return null;
  const n = dayNumber(state.devotional.startDate, now);
  if (n > plan.length || state.devotional.done.includes(n)) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(`Devocional · Dia ${n} de ${plan.length}`, {
      body: `${plan[n - 1].title} — toque para abrir seu plano.`,
      icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
      tag: `devocional-${today}`,
      data: { url: `${import.meta.env.BASE_URL}?aba=devocional` },
    } as NotificationOptions);
    return today;
  } catch {
    return null;
  }
}

/** Notificação de teste, para a pessoa ver que funciona. */
export async function sendTest(): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification('Líder 360° — teste', {
      body: 'Pronto! É assim que o lembrete do seu devocional vai aparecer.',
      icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
      tag: 'teste',
    } as NotificationOptions);
    return true;
  } catch {
    return false;
  }
}
