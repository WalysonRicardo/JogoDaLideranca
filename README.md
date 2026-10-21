# Líder 360° — Jornada de Liderança Cristã

Jogo para líderes do grupo de jovens da Igreja Batista no Jardim do Ingá (GO).
O jogador monta um personagem, responde 16 situações (jovens, igreja, conflitos, discipulado e **família**) **sem resposta certa**, cada uma com uma cena animada, e recebe:

- um **perfil de liderança** (7 forças) com gráficos (radar, rosca e barras);
- um **plano devocional de 7 dias personalizado**, com versículos ordenados pelo resultado;
- opções de **compartilhar** (imagem, WhatsApp, link) e **baixar o PDF** completo.

Base teórica: *Liderança Cristã: Princípios e Prática*, de Roger Smalling, e *Família Equilibrada, Igreja Abençoada*, de Wanda de Assumpção.

## Privacidade, chave pessoal e lembretes

- **Sem servidor e sem coleta.** No primeiro acesso o app gera uma chave pessoal (ex.: `LIDER-7K2M-9QXA`).
  Resultado, progresso do devocional e preferências ficam só no navegador do próprio aparelho (`localStorage`/IndexedDB).
- **Meu espaço**: mostra a chave, abre o resultado e o devocional, e permite *levar para outro aparelho* com um
  código de transferência (a chave sozinha não carrega dados, porque não existe servidor).
- **Lembrete diário**: notificações pelo navegador (Android e iPhone) + arquivo de calendário `.ics` como opção
  garantida. No iPhone é preciso adicionar o app à Tela de Início (iOS 16.4+).
- O app é instalável (PWA): `public/manifest.webmanifest`, `public/sw.js` e ícones em `public/icons/`.

| O quê | Arquivo |
| --- | --- |
| Chave, armazenamento local e transferência | `src/utils/storage.ts` |
| Notificações | `src/utils/notifications.ts` e `public/sw.js` |
| Calendário (.ics) | `src/utils/calendar.ts` |
| Tela "Meu espaço" | `src/components/MyArea.tsx` |

## Rodar

```bash
npm install
npm run dev
```

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Situações e alternativas | `src/data/dilemmas.ts` |
| Situações de família | `src/data/familyDilemmas.ts` |
| Cenas animadas de cada situação | `src/data/scenes.ts` |
| Tela de entrada | `src/components/WelcomeScreen.tsx` |
| Forças, textos e cores | `src/utils/scoringEngine.ts` |
| Plano devocional (7 dias) | `src/data/devotional.ts` |
| PDF | `src/utils/pdfReport.ts` |
