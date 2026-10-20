import { Dilemma } from '../types';

/**
 * Situações do grupo de jovens da Igreja Batista no Jardim do Ingá (GO).
 *
 * IMPORTANTE: não existe resposta certa. Toda alternativa é uma atitude
 * plausível e cada uma revela uma "força" de liderança diferente
 * (primary = peso 3, secondary = peso 1). A ordem das alternativas é
 * embaralhada a cada partida para que a posição não sugira nada.
 *
 * A seção `bookNote` só aparece no relatório final, como material de reflexão.
 */
export const DILEMMAS: Dilemma[] = [
  {
    id: 'sit-1',
    category: 'juventude',
    title: 'O ensaio que ficou vazio',
    context:
      'Você lidera o grupo de jovens da igreja no Jardim do Ingá. Na sexta, o ensaio do louvor para o culto de sábado teve só metade da equipe. Lucas, que toca violão e é muito querido, não apareceu nem avisou. Os outros ficaram chateados.',
    situation:
      'No sábado, antes do culto, você encontra o Lucas afinando o violão como se nada tivesse acontecido. O que você faz?',
    options: [
      {
        id: 'a',
        text: 'Chamo ele de lado agora mesmo, falo com calma sobre a falta e o que isso causou na equipe, espero ele responder e deixo claro que continuo contando com ele.',
        primary: 'comunicacao',
        secondary: 'integridade',
      },
      {
        id: 'b',
        text: 'Antes de falar da falta, pergunto como ele está. Vai que aconteceu algo em casa ou no trabalho. Quero entender a pessoa antes de tratar do problema.',
        primary: 'servo',
        secondary: 'comunicacao',
      },
      {
        id: 'c',
        text: 'Convido o Lucas e mais dois jovens para combinarmos juntos como a equipe vai se organizar daqui pra frente, e peço que ele ajude a montar esse combinado.',
        primary: 'mentoria',
        secondary: 'mediacao',
      },
      {
        id: 'd',
        text: 'Lembro que a regra do grupo vale pra todos, e por isso ele fica fora da escala do próximo culto. Conversamos depois, com a decisão já tomada.',
        primary: 'integridade',
        secondary: 'protecao',
      },
    ],
    bookNote: {
      chapter: 'Cap. 12 — Comunicação: correções e repreensões',
      insight:
        'Para ofensas menores, Smalling propõe uma correção curta, logo depois do fato, sem sermão: apontar o ato específico, dizer como você se sentiu, dar um instante de silêncio e reafirmar o compromisso com a pessoa. Cada caminho acima valoriza um pedaço disso: a franqueza, o cuidado, o crescimento ou a firmeza.',
      scripture: 'Gálatas 6:1; Efésios 4:15',
    },
  },
  {
    id: 'sit-2',
    category: 'igreja',
    title: 'A ajuda que vem com condições',
    context:
      'O Sr. Ademir, dono de um comércio do bairro, ajuda todo ano com o lanche e o transporte do retiro dos jovens. Neste ano ele começou a dar ordens sobre a programação e a escolha de quem prega, dizendo que "quem ajuda tem direito de opinar".',
    situation:
      'Ele deixa claro que, se não for atendido, a ajuda pode acabar. Como você reage?',
    options: [
      {
        id: 'a',
        text: 'Agradeço tudo o que ele já fez, mas explico com respeito que a programação não está à venda. Se a ajuda acabar, a gente se vira com o que Deus provir.',
        primary: 'integridade',
        secondary: 'comunicacao',
      },
      {
        id: 'b',
        text: 'Procuro uma saída em que ele se sinta valorizado: convido para acompanhar o retiro e dar uma palavra de apoio, mantendo as decisões de programação com a liderança.',
        primary: 'mediacao',
        secondary: 'servo',
      },
      {
        id: 'c',
        text: 'Levo a situação ao pastor e aos demais líderes para decidirmos juntos, assim a resposta não fica só nas minhas costas nem no meu nome.',
        primary: 'protecao',
        secondary: 'integridade',
      },
      {
        id: 'd',
        text: 'Peço uns dias para pensar, oro sobre o assunto e converso com Deus antes de responder qualquer coisa a ele.',
        primary: 'devocional',
        secondary: 'protecao',
      },
    ],
    bookNote: {
      chapter: 'Cap. 2 — A virtude fundamental',
      insight:
        'Smalling chama de "Princípio de Caifás" a troca da integridade por uma paz conveniente. O livro defende manter o que é correto mesmo quando custa caro, e também mostra a importância de ter um comitê de líderes a quem prestar contas (Cap. 9).',
      scripture: 'Salmos 15:4; 2 Coríntios 1:12',
    },
  },
  {
    id: 'sit-3',
    category: 'pessoal_familiar',
    title: 'A agenda que não fecha',
    context:
      'Entre o trabalho, a faculdade e a igreja, você está chegando em casa tarde quase todos os dias. Seus pais e irmãos já comentaram que sentem sua falta. Ao mesmo tempo, o grupo de jovens está crescendo e muita gente depende de você.',
    situation:
      'Depois de uma semana especialmente corrida, você percebe que está no limite. O que faz?',
    options: [
      {
        id: 'a',
        text: 'Reservo horários fixos para a família e para o meu tempo a sós com Deus, e passo a tratar esses momentos como compromissos inegociáveis.',
        primary: 'devocional',
        secondary: 'integridade',
      },
      {
        id: 'b',
        text: 'Escolho dois jovens com potencial, passo parte das tarefas pra eles e acompanho de perto no começo, para que o grupo não dependa só de mim.',
        primary: 'mentoria',
        secondary: 'devocional',
      },
      {
        id: 'c',
        text: 'Sigo firme por mais um tempo: tem jovem precisando de mim agora, e prefiro cansar servindo do que deixar alguém sem apoio. Ajusto quando passar essa fase.',
        primary: 'servo',
        secondary: 'protecao',
      },
      {
        id: 'd',
        text: 'Converso com minha família e com o pastor, assumo o compromisso de reduzir a agenda e peço que me cobrem se eu voltar ao ritmo antigo.',
        primary: 'integridade',
        secondary: 'comunicacao',
      },
    ],
    bookNote: {
      chapter: 'Cap. 3 e Cap. 17 — Filosofia da liderança e vida devocional',
      insight:
        'Smalling afirma que a qualidade das decisões de um líder depende muito da sua vida devocional com Deus, e a Bíblia pede cuidado de si mesmo e da própria casa antes do rebanho (Atos 20:28; 1 Timóteo 3:4-5).',
      scripture: 'Atos 20:28; 1 Timóteo 3:4-5',
    },
  },
  {
    id: 'sit-4',
    category: 'discipulado',
    title: 'A Ana, que quase não fala',
    context:
      'A Ana, 16 anos, começou a frequentar o grupo há uns meses. É tímida, quase não fala nas reuniões, mas você já reparou que ela é muito organizada e sempre chega cedo para ajeitar a sala.',
    situation:
      'Você sente que existe algo especial nela, mas ela mal participa. Qual é o seu primeiro passo?',
    options: [
      {
        id: 'a',
        text: 'Entrego uma responsabilidade pequena e concreta, como cuidar da organização do espaço, e vou acompanhando para que ela cresça no ritmo dela.',
        primary: 'mentoria',
        secondary: 'servo',
      },
      {
        id: 'b',
        text: 'Quando for natural, falo com ela, e na frente do grupo, o que tenho observado de bom: a organização e o cuidado com a sala.',
        primary: 'comunicacao',
        secondary: 'mentoria',
      },
      {
        id: 'c',
        text: 'Sento ao lado dela nas reuniões, puxo conversa sobre a vida e sobre a escola, sem cobrar nada. Quero que ela se sinta acolhida primeiro.',
        primary: 'servo',
        secondary: 'comunicacao',
      },
      {
        id: 'd',
        text: 'Passo a orar especificamente por ela nas próximas semanas e peço a Deus discernimento sobre que dons ele colocou na vida dela, antes de mexer em qualquer coisa.',
        primary: 'devocional',
        secondary: 'mentoria',
      },
    ],
    bookNote: {
      chapter: 'Caps. 11, 19 e 20 — Afirmação positiva e o coração do mentor',
      insight:
        'Para Smalling, a formação de líderes é um trabalho de mentoria: relacional, paciente e adaptado a cada pessoa, como Paulo com Timóteo. A afirmação sincera de algo concreto e observado fortalece o ambiente do grupo.',
      scripture: '2 Timóteo 2:2; 1 Tessalonicenses 5:11',
    },
  },
  {
    id: 'sit-5',
    category: 'conflito',
    title: 'Dois grupos no WhatsApp',
    context:
      'Você descobre que alguns jovens criaram um segundo grupo no WhatsApp "só dos mais chegados", e de lá saem comentários ácidos sobre outros do grupo. Já tem gente se afastando e outros sem querer sentar juntos.',
    situation:
      'A divisão ainda é pequena, mas está crescendo. Como você age?',
    options: [
      {
        id: 'a',
        text: 'Reúno os dois lados na mesma conversa. Digo que não sou juiz e que o objetivo é todos saírem dali em paz, e ajudo cada lado a ouvir o outro.',
        primary: 'mediacao',
        secondary: 'comunicacao',
      },
      {
        id: 'b',
        text: 'Defino com clareza o que é aceitável no grupo oficial e converso com quem lidera cada turminha, combinando limites para proteger o ambiente.',
        primary: 'protecao',
        secondary: 'integridade',
      },
      {
        id: 'c',
        text: 'Converso individualmente com os principais envolvidos, olhando nos olhos, dizendo com franqueza o que percebo e o quanto isso machuca os outros.',
        primary: 'comunicacao',
        secondary: 'mediacao',
      },
      {
        id: 'd',
        text: 'No encontro do grupo, trato do tema de forma geral: quem tem problema com alguém deve falar com a própria pessoa, não pelas costas.',
        primary: 'integridade',
        secondary: 'comunicacao',
      },
    ],
    bookNote: {
      chapter: 'Caps. 15 e 16 — Divisões e resolução de conflitos menores',
      insight:
        'Smalling aponta sinais de conflito iminente (panelinhas, ausências, silêncio, sarcasmo) e ensina que o mediador não age como juiz: reúne as partes, define regras de conversa e busca uma saída em que todos saiam ganhando.',
      scripture: 'Mateus 5:9; Mateus 18:15',
    },
  },
  {
    id: 'sit-6',
    category: 'igreja',
    title: 'O visitante que impressiona',
    context:
      'Um rapaz de fora começa a frequentar os encontros dos jovens. É simpático, fala bonito e tem conquistado a turma. Mas você percebeu que ele insiste em ensinos que não batem com o que a igreja sempre ensinou, e dois jovens já começaram a repetir essas ideias.',
    situation:
      'Ele não fez nada de errado até agora, mas você fica incomodado. O que faz?',
    options: [
      {
        id: 'a',
        text: 'Compartilho a preocupação com o pastor, acompanho o que está sendo ensinado e converso com os jovens que estão sendo influenciados.',
        primary: 'protecao',
        secondary: 'comunicacao',
      },
      {
        id: 'b',
        text: 'Acolho o rapaz com carinho. Convido para um café e para a minha casa, porque quero conhecer a história dele antes de tirar conclusões.',
        primary: 'servo',
        secondary: 'mediacao',
      },
      {
        id: 'c',
        text: 'Proponho uma conversa entre ele, o pastor e eu, para entender o que ele realmente crê e esclarecer as diferenças com respeito.',
        primary: 'mediacao',
        secondary: 'protecao',
      },
      {
        id: 'd',
        text: 'Foco em fortalecer a base dos jovens: iniciamos uma série de estudos bíblicos e oração em grupo, para que eles tenham raízes mais firmes.',
        primary: 'devocional',
        secondary: 'mentoria',
      },
    ],
    bookNote: {
      chapter: 'Cap. 14 — Tratando com lobos',
      insight:
        'Smalling descreve sinais para reconhecer quem pode estar ali para desviar ovelhas e recomenda cuidado ativo com o rebanho, sem perder o amor pela pessoa. Acolher, proteger, dialogar e fortalecer na Palavra são, juntos, partes desse cuidado.',
      scripture: 'Atos 20:28-31; Romanos 16:17',
    },
  },
  {
    id: 'sit-7',
    category: 'conflito',
    title: 'A quadra de todo mundo',
    context:
      'Dois grupos de jovens da igreja brigam pelo horário da quadra do bairro nos sábados à tarde: um quer jogar futsal e o outro quer ensaiar uma peça de teatro. A discussão ficou pesada e ninguém quer ceder.',
    situation:
      'Ambos pedem que você resolva. O que você faz?',
    options: [
      {
        id: 'a',
        text: 'Sento com os dois lados juntos, esclareço que não vou escolher um vencedor e conduzo a conversa para acharmos uma divisão que sirva para todos.',
        primary: 'mediacao',
        secondary: 'servo',
      },
      {
        id: 'b',
        text: 'Transformo o problema em oportunidade: peço que os dois grupos montem juntos o calendário de uso e eu acompanho, para aprenderem a resolver as coisas.',
        primary: 'mentoria',
        secondary: 'mediacao',
      },
      {
        id: 'c',
        text: 'Estabeleço regras claras de uso do espaço, iguais para todos, e comunico à coordenação da igreja para que o combinado fique registrado.',
        primary: 'protecao',
        secondary: 'integridade',
      },
      {
        id: 'd',
        text: 'Cedo o meu próprio tempo e ajudo na logística de um dos lados, mostrando que o importante é o grupo funcionar em paz.',
        primary: 'servo',
        secondary: 'mentoria',
      },
    ],
    bookNote: {
      chapter: 'Cap. 16 — Resolução de conflitos menores e diplomacia',
      insight:
        'O livro orienta ir ao conflito como servo que oferece ajuda, não como autoridade que impõe ordem; deixar claro que o objetivo é todos ganharem, definir regras para a conversa e envolver as partes na própria solução.',
      scripture: 'Tiago 3:17-18; Romanos 12:18',
    },
  },
  {
    id: 'sit-8',
    category: 'igreja',
    title: 'O pouco dinheiro do caixa',
    context:
      'O caixa dos jovens juntou um valor modesto depois de meses de rifas e vendas de lanche. Duas propostas estão na mesa: um retiro de final de semana e uma ação para ajudar famílias do bairro que estão passando necessidade. O dinheiro só dá para uma.',
    situation:
      'Os jovens estão divididos e a decisão está nas suas mãos. Como você conduz?',
    options: [
      {
        id: 'a',
        text: 'Peço alguns dias para orar e buscar direção de Deus junto com a equipe de liderança antes de decidir, mesmo que isso atrase um pouco.',
        primary: 'devocional',
        secondary: 'protecao',
      },
      {
        id: 'b',
        text: 'Penso em quem mais precisa agora e escolho a opção que alcança as pessoas em maior necessidade, explicando com carinho ao grupo.',
        primary: 'servo',
        secondary: 'integridade',
      },
      {
        id: 'c',
        text: 'Abro uma conversa franca com todos, ouço os argumentos de cada lado com atenção e depois tomo a decisão, explicando as razões.',
        primary: 'comunicacao',
        secondary: 'mediacao',
      },
      {
        id: 'd',
        text: 'Peço que uma pequena comissão de jovens estude as duas opções e apresente uma proposta, com minha orientação, para formar o senso de decisão neles.',
        primary: 'mentoria',
        secondary: 'comunicacao',
      },
    ],
    bookNote: {
      chapter: 'Cap. 17 — A tomada de decisões',
      insight:
        'Smalling compara o líder a um detetive que reúne informações sem prejulgar, e afirma que a decisão acertada depende muito da vida devocional, incluindo oração e jejum. Também lembra que envolver pessoas na decisão não é o mesmo que fazer votação (Cap. 10).',
      scripture: 'Atos 13:2-3; Provérbios 15:22',
    },
  },
  {
    id: 'sit-9',
    category: 'juventude',
    title: 'O grupo parado no tempo',
    context:
      'O pastor comentou com você, com carinho, que o grupo de jovens está "na mesma há dois anos": os mesmos encontros, as mesmas atividades e poucos visitantes. Você mesmo sente que falta algo, mas não sabe bem por onde começar.',
    situation:
      'Você quer ajudar o grupo a sair do lugar. Qual seria o seu primeiro passo?',
    options: [
      {
        id: 'a',
        text: 'Passo uma temporada de oração, a sós e com alguns jovens, pedindo a Deus um sonho claro para esse grupo antes de propor qualquer mudança.',
        primary: 'devocional',
        secondary: 'mentoria',
      },
      {
        id: 'b',
        text: 'Converso com cada jovem, um por um, para ouvir os sonhos e as frustrações deles, e só depois penso em propostas.',
        primary: 'comunicacao',
        secondary: 'servo',
      },
      {
        id: 'c',
        text: 'Começo organizando o básico: escalas, rotina e responsáveis. Um grupo estável e bem cuidado vira terreno firme para crescer.',
        primary: 'protecao',
        secondary: 'integridade',
      },
      {
        id: 'd',
        text: 'Defino com o pastor poucas metas concretas para os próximos três meses e me comprometo a prestar contas dos resultados.',
        primary: 'integridade',
        secondary: 'protecao',
      },
    ],
    bookNote: {
      chapter: 'Caps. 6 e 7 — A visão, planificação e metas',
      insight:
        'Para Smalling, uma visão é "um sonho possível": reúne um sonho e um plano realizável, mais o compromisso do líder em implementá-la. Escrever metas e prestar contas ajuda a tirar o sonho do papel.',
      scripture: 'Habacuque 2:2; Provérbios 29:18',
    },
  },
  {
    id: 'sit-10',
    category: 'juventude',
    title: 'O evento bonito, mas cheio de falhas',
    context:
      'O Pedro, 17 anos, organizou pela primeira vez uma noite de louvor com visitantes. Foi um sucesso de público, mas deu muita coisa errada: o som falhou, o lanche acabou cedo e o horário estourou.',
    situation:
      'No dia seguinte o Pedro está animado e também meio inseguro. Como você conversa com ele?',
    options: [
      {
        id: 'a',
        text: 'Parabenizo com detalhes do que vi de bom, com sinceridade. Depois, em outro momento, converso sobre o que podemos ajustar da próxima vez.',
        primary: 'comunicacao',
        secondary: 'mentoria',
      },
      {
        id: 'b',
        text: 'Agradeço pelo esforço e assumo que também falhei: poderia ter dado mais apoio na preparação. Quero que ele se sinta amparado.',
        primary: 'servo',
        secondary: 'integridade',
      },
      {
        id: 'c',
        text: 'Falo com carinho, mas sem rodeios, das falhas que viraram problema. Excelência também faz parte de honrar quem veio.',
        primary: 'integridade',
        secondary: 'comunicacao',
      },
      {
        id: 'd',
        text: 'Reúno a equipe toda numa conversa de aprendizado: cada um diz o que funcionou e o que melhoraria, sem apontar culpados.',
        primary: 'mediacao',
        secondary: 'mentoria',
      },
    ],
    bookNote: {
      chapter: 'Cap. 11 — Comunicação: a afirmação positiva',
      insight:
        'O livro mostra que as pessoas julgam um líder muito pelo clima que ele cria. Reconhecer o bem de forma específica e sincera constrói confiança, e isso torna possível, em outro momento, uma correção mais fácil de receber.',
      scripture: 'Efésios 4:29; Provérbios 25:11',
    },
  },
  {
    id: 'sit-11',
    category: 'igreja',
    title: 'Quem decide?',
    context:
      'Um líder mais antigo da igreja está acostumado a decidir sozinho tudo o que envolve os jovens. Os próprios jovens, por outro lado, querem mais voz e já falam em "fazer do jeito deles". Você está no meio e percebe a tensão crescer.',
    situation:
      'Você precisa definir como vai conduzir as decisões do grupo daqui para a frente. O que prioriza?',
    options: [
      {
        id: 'a',
        text: 'Proponho um modelo de "mesa redonda": sentamos juntos, cada um dá sua opinião, e decidimos com humildade, sem chefes e subordinados.',
        primary: 'servo',
        secondary: 'mediacao',
      },
      {
        id: 'b',
        text: 'Mantenho as decisões principais com a liderança, para proteger o grupo de erros de inexperiência, e abro espaço de escuta em pequenas escolhas.',
        primary: 'protecao',
        secondary: 'servo',
      },
      {
        id: 'c',
        text: 'Procuro unir as duas visões: converso com o líder antigo e com os jovens, até encontrarmos um jeito de trabalhar que respeite os dois.',
        primary: 'mediacao',
        secondary: 'comunicacao',
      },
      {
        id: 'd',
        text: 'Crio um rodízio de lideranças entre os jovens, com acompanhamento, para que aprendam a decidir e a assumir as consequências.',
        primary: 'mentoria',
        secondary: 'servo',
      },
    ],
    bookNote: {
      chapter: 'Caps. 4 e 5 — Os perigos das hierarquias e aspectos da liderança',
      insight:
        'Smalling alerta para os riscos de hierarquias rígidas e propõe a liderança de servo, com respeito a todos, como modelo bíblico. Ao mesmo tempo, mostra que líderes têm responsabilidade real. O desafio é equilibrar autoridade e serviço.',
      scripture: 'Mateus 20:25-28; 1 Pedro 5:2-3',
    },
  },
  {
    id: 'sit-12',
    category: 'conflito',
    title: 'A crítica diante de todos',
    context:
      'Em uma reunião da igreja, um irmão mais velho critica você na frente de todos: diz que o grupo de jovens está "bagunçado" e que você "não leva a sério o que o pastor ensina". Você acha a crítica injusta e sente o rosto esquentar.',
    situation:
      'Todos olham pra você. Qual é a sua reação?',
    options: [
      {
        id: 'a',
        text: 'Respondo com calma, na hora, apresentando fatos do que o grupo tem feito, para esclarecer o que ele disse.',
        primary: 'comunicacao',
        secondary: 'integridade',
      },
      {
        id: 'b',
        text: 'Respiro fundo e fico em silêncio. Depois da reunião, oro sobre o que ouvi e só então decido se e como respondo.',
        primary: 'devocional',
        secondary: 'mediacao',
      },
      {
        id: 'c',
        text: 'Corrijo com firmeza a parte que considero falsa, porque deixar uma acusação sem resposta pode manchar o testemunho do grupo.',
        primary: 'integridade',
        secondary: 'protecao',
      },
      {
        id: 'd',
        text: 'Deixo passar na hora e procuro o irmão depois, em particular, para ouvir o que o incomoda de verdade e buscar reconciliação.',
        primary: 'mediacao',
        secondary: 'servo',
      },
    ],
    bookNote: {
      chapter: 'Cap. 18 — Defendendo-se verbalmente',
      insight:
        'Smalling ensina que o líder não é obrigado a se defender de cada ataque e que reagir na defensiva costuma piorar a situação, oferecendo técnicas para responder sem entrar na briga. O livro trata de equilíbrio entre manter a calma e esclarecer a verdade.',
      scripture: 'Provérbios 15:1; 1 Pedro 2:23',
    },
  },
];
