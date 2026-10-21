import { Dilemma } from '../types';

/**
 * Categoria FAMÍLIA — contexto: o estudo «Família Equilibrada, Igreja Abençoada»,
 * de Wanda de Assumpção. Assim como nas demais, não existe resposta certa:
 * cada alternativa revela uma força de liderança diferente.
 */
export const FAMILY_DILEMMAS: Dilemma[] = [
  {
    id: 'fam-1',
    category: 'familia',
    title: 'A casa do Davi está em pedaços',
    context:
      'Davi, 15 anos, é do seu grupo de jovens no Jardim do Ingá. Você soube que os pais dele estão se separando. Ele passou a chegar mais calado, sentou no fundo e não quis ficar para o lanche.',
    situation:
      'Ele não falou nada com ninguém, mas você percebeu que algo mudou. O que faz?',
    options: [
      {
        id: 'a',
        text: 'Me aproximo sem pressa, convido para um sorvete e deixo ele falar do jeito dele. Não tento resolver nada, só estar ali.',
        primary: 'servo',
        secondary: 'comunicacao',
      },
      {
        id: 'b',
        text: 'Peço a um casal maduro da igreja para acompanhar o Davi de perto comigo, para ele ter referências de uma família que caminha com Deus.',
        primary: 'mentoria',
        secondary: 'protecao',
      },
      {
        id: 'c',
        text: 'Aviso o pastor para que a igreja cuide da família toda, e fico atento para que o grupo não comente nem exponha a situação.',
        primary: 'protecao',
        secondary: 'servo',
      },
      {
        id: 'd',
        text: 'Oro por ele e pela família todos os dias e o convido a ler comigo um Salmo por semana, para que ele encontre um refúgio em Deus.',
        primary: 'devocional',
        secondary: 'servo',
      },
    ],
    bookNote: {
      chapter: 'Família Equilibrada, Igreja Abençoada — a restauração em Cristo',
      insight:
        'O texto reconhece que famílias feridas não são novidade e que ninguém está imune. Ele diz que Deus não promete restaurar todos os relacionamentos, mas promete entrar, ficar e sustentar quem abre a porta do coração. Cada caminho acima é uma forma de levar essa presença ao Davi.',
      scripture: 'Salmos 68:5-6; Romanos 8:28-29',
    },
  },
  {
    id: 'fam-2',
    category: 'familia',
    title: 'O casal de líderes e o silêncio',
    context:
      'João e Marta são casados e ajudam na liderança do grupo. Na reunião de planejamento, Marta tinha uma ótima ideia, mas só falou baixinho, “o João é quem sabe”. João, calado, nem olhou para ela. No caminho de volta, você notou os dois sem se falar.',
    situation:
      'Os jovens também perceberam o clima. Como você age?',
    options: [
      {
        id: 'a',
        text: 'Converso com cada um em separado, com carinho e franqueza, dizendo o que percebi e perguntando como eles estão se sentindo.',
        primary: 'comunicacao',
        secondary: 'servo',
      },
      {
        id: 'b',
        text: 'Convido o casal para um café junto com o pastor ou com um casal mais experiente, para uma conversa em que os dois sejam ouvidos.',
        primary: 'mediacao',
        secondary: 'mentoria',
      },
      {
        id: 'c',
        text: 'Lembro, com respeito e firmeza, o que a Bíblia pede: amor que se entrega por parte do marido e respeito que vem do coração por parte da esposa.',
        primary: 'integridade',
        secondary: 'comunicacao',
      },
      {
        id: 'd',
        text: 'Peço ao pastor que acompanhe o casal, e no grupo evito qualquer exposição, mudando o assunto quando o clima esquentar.',
        primary: 'protecao',
        secondary: 'mediacao',
      },
    ],
    bookNote: {
      chapter: 'Família Equilibrada, Igreja Abençoada — homem e mulher na família',
      insight:
        'O texto explica que a palavra bíblica para “cabeça” lembra o batedor que vai à frente para proteger e servir. A submissão da esposa é descrita como atitude voluntária do coração, e não como silêncio ou passividade. Ele também aponta que o pecado distorce os papéis: o marido tende a ser omisso ou dominador, e a esposa a controlar ou depender demais.',
      scripture: 'Efésios 5:21-33',
    },
  },
  {
    id: 'fam-3',
    category: 'familia',
    title: 'O pai que não deixa a Bia vir',
    context:
      'Bia, 15 anos, quer muito frequentar o grupo de jovens, mas o pai dela, que não é da igreja, proibiu: diz que o sábado é dia de ajudar em casa e de estudar. Ela está desanimada e fala em ir escondida.',
    situation:
      'A Bia pede a sua opinião. O que você faz?',
    options: [
      {
        id: 'a',
        text: 'Digo a ela, com carinho, que ir escondida não é o caminho: ela deve honrar os pais enquanto continua orando e esperando uma porta se abrir.',
        primary: 'integridade',
        secondary: 'devocional',
      },
      {
        id: 'b',
        text: 'Visito a família, me apresento ao pai e ofereço ajuda nas tarefas da casa, para ele ver que o grupo é um lugar de serviço e cuidado.',
        primary: 'servo',
        secondary: 'mediacao',
      },
      {
        id: 'c',
        text: 'Peço para conversar francamente com o pai, tomando um café, e ouvir suas preocupações antes de explicar como funciona o grupo.',
        primary: 'comunicacao',
        secondary: 'mediacao',
      },
      {
        id: 'd',
        text: 'Passo a orar pelo pai e pela família e ajudo a Bia a viver em casa o que aprendeu, para que o testemunho dela fale por si.',
        primary: 'devocional',
        secondary: 'mentoria',
      },
    ],
    bookNote: {
      chapter: 'Família Equilibrada, Igreja Abençoada — pais e filhos',
      insight:
        'O texto lembra que os filhos são bênção do Senhor, confiados aos pais por um período, e que a Palavra pede aos filhos que obedeçam. Daí a importância de a liderança de jovens caminhar junto com as famílias, e não no lugar delas.',
      scripture: 'Efésios 6:1-4; Salmos 127:3',
    },
  },
  {
    id: 'fam-4',
    category: 'familia',
    title: 'O celular de madrugada',
    context:
      'A dona Neide, mãe do Caio, 14 anos, procurou você aflita. O filho passa a madrugada no celular, responde mal e já foi pego mentindo sobre o dever de casa. Ela pede: “Fala com ele, dá uma dura nele, ele te respeita”.',
    situation:
      'Ela espera uma resposta sua. Como você lida com o pedido?',
    options: [
      {
        id: 'a',
        text: 'Convido o Caio para conversar de coração, escuto o lado dele e o ajudo a escolher um compromisso que ele mesmo queira assumir.',
        primary: 'mentoria',
        secondary: 'servo',
      },
      {
        id: 'b',
        text: 'Oriento a dona Neide a combinar regras claras com o marido e com a igreja, e me coloco ao lado deles como apoio, sem substituir os pais.',
        primary: 'protecao',
        secondary: 'integridade',
      },
      {
        id: 'c',
        text: 'Sugiro uma conversa dos três, mãe, filho e eu, num clima tranquilo, para cada um dizer o que sente e chegarem a um acordo.',
        primary: 'mediacao',
        secondary: 'comunicacao',
      },
      {
        id: 'd',
        text: 'Converso com o Caio com firmeza e carinho: mentir e desobedecer os pais tem consequências, e ele precisa aprender a respeitar limites.',
        primary: 'integridade',
        secondary: 'mentoria',
      },
    ],
    bookNote: {
      chapter: 'Família Equilibrada, Igreja Abençoada — disciplina e orientação',
      insight:
        'O texto afirma que a insensatez está ligada ao coração da criança e que, por isso, os pais devem ensinar a obedecer e corrigir a rebeldia. Também pede que os pais observem as boas tendências que Deus colocou em cada filho para favorecê-las. Corrigir e cultivar andam juntos.',
      scripture: 'Provérbios 22:15; Provérbios 29:15; Efésios 6:4',
    },
  },
];
