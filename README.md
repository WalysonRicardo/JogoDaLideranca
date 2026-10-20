# Líder 360° — Jornada de Liderança Cristã

Jogo para líderes do grupo de jovens da Igreja Batista no Jardim do Ingá (GO).
O jogador monta um personagem, responde 12 situações **sem resposta certa** e recebe:

- um **perfil de liderança** (7 forças) com gráficos (radar, rosca e barras);
- um **plano devocional de 7 dias personalizado**, com versículos ordenados pelo resultado;
- opções de **compartilhar** (imagem, WhatsApp, link) e **baixar o PDF** completo.

Base teórica: *Liderança Cristã: Princípios e Prática*, de Roger Smalling.

## Rodar

```bash
npm install
npm run dev
```

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Situações e alternativas | `src/data/dilemmas.ts` |
| Forças, textos e cores | `src/utils/scoringEngine.ts` |
| Plano devocional (7 dias) | `src/data/devotional.ts` |
| PDF | `src/utils/pdfReport.ts` |
