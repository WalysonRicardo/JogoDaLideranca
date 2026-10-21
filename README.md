# Líder 360° — Jornada de Liderança Cristã

Jogo para líderes do grupo de jovens da Igreja Batista no Jardim do Ingá (GO).
O jogador monta um personagem, responde 16 situações (jovens, igreja, conflitos, discipulado e **família**) **sem resposta certa**, cada uma com uma cena animada, e recebe:

- um **perfil de liderança** (7 forças) com gráficos (radar, rosca e barras);
- um **plano devocional de 7 dias personalizado**, com versículos ordenados pelo resultado;
- opções de **compartilhar** (imagem, WhatsApp, link) e **baixar o PDF** completo.

Base teórica: *Liderança Cristã: Princípios e Prática*, de Roger Smalling, e *Família Equilibrada, Igreja Abençoada*, de Wanda de Assumpção.

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
