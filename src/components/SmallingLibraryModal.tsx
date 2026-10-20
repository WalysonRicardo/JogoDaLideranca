import React, { useState } from 'react';
import { X, BookOpen, Search, Shield, Users, HeartHandshake, Eye, Sparkles } from 'lucide-react';

interface SmallingLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ARTICLES = [
  {
    id: 'caifas',
    title: 'O Princípio de Caifás',
    chapter: 'Capítulo 2: A Virtude Fundamental',
    badge: 'Integridade',
    summary:
      'Caifás sacrificou sua integridade para obter paz passageira ("convém que morra um só homem pelo povo"). Em curto prazo pareceu esperto, mas perdeu tudo. O líder de integridade prefere suportar perdas temporárias a negociar princípios bíblicos.',
    verse: 'João 11:49-50; Salmo 15:4',
  },
  {
    id: 'martelos',
    title: 'Os Três Martelos da Repreensão',
    chapter: 'Capítulo 13: Os Três Martelos',
    badge: 'Correção Pastoral',
    summary:
      'A repreensão é progressiva: Martelo de Borracha (gentil e firme, para primeiro aviso); Martelo de Madeira (mais duro com advertência de disciplina); Martelo de Aço (disciplina eclesiástica formal). Sempre visando restaurar o irmão.',
    verse: 'Tito 1:13; 2 Coríntios 11:11',
  },
  {
    id: 'pausa',
    title: 'A Correção em 1 Minuto & A Pausa que Incomoda',
    chapter: 'Capítulo 12: Comunicação e Correções',
    badge: 'Comunicação',
    summary:
      'Corrija imediatamente e com brevidade. Especifique o fato sem rotular a pessoa como mentirosa ou inútil. Expresse como aquilo o afetou. Aplique "a pausa que incomoda" em silêncio para dar tempo de a pessoa se arrepender, e termine reafirmando seu compromisso com ela.',
    verse: 'Efésios 4:15, 29; Gálatas 6:1',
  },
  {
    id: 'incognito',
    title: 'A Síndrome do "Sr. Incógnito" e do "Vôo do Falcão"',
    chapter: 'Capítulo 10: Comunicação com Subordinados',
    badge: 'Relacionamento',
    summary:
      'O Sr. Incógnito nunca está disponível, vive no modo "não me ligue, eu ligo se quiser" e perde sua liderança. Já o Vôo do Falcão fica vigiando cada passo por trás, sufocando a iniciativa e a criatividade. O bom líder equilibra presença pastoral com espaço para o liderado crescer.',
    verse: 'Atos 20:28; 1 Pedro 5:2',
  },
  {
    id: 'ganhar_ganhar',
    title: 'Diplomacia Ganhar-Ganhar & Cortar o Bolo',
    chapter: 'Capítulo 16: Resolução de Conflitos Menores',
    badge: 'Mediação',
    summary:
      'Em disputas, evite que haja "ganhadores e perdedores". Use técnicas como "cortar o bolo" (um divide, o outro escolhe primeiro), "tríplice opção" (dar 3 opções em vez de sim/não) e "dê-me uma mão", unindo os irmãos em prol da meta do Reino.',
    verse: 'Mateus 5:9; Provérbios 24:6',
  },
  {
    id: 'lobos',
    title: 'Tratando com Lobos & Falsos Pacificadores',
    chapter: 'Capítulos 14 e 15: Pessoas que Causam Divisões',
    badge: 'Proteção do Rebanho',
    summary:
      'Lobos operam às escondidas dos líderes, criticam a liderança pelas costas e bajulam os fracos. A Bíblia ordena em Tito 3:10: admoesta uma vez, duas vezes, e depois evita. Nunca conceda posições de autoridade a manipuladores.',
    verse: 'Tito 3:10; Atos 20:29-30',
  },
  {
    id: 'mentor',
    title: 'O Coração do Mentor & O Perigo da Clonagem',
    chapter: 'Capítulos 19 a 21: O Trabalho de Mentores',
    badge: 'Discipulado',
    summary:
      'O produto principal de um líder cristão é outros líderes (2 Tm 2:2). Não tente clonar seus discípulos para que sejam iguais a você; ajude-os a desenvolver seus próprios dons. Mentoria bíblica é relacional e holística.',
    verse: '2 Timóteo 2:2; 1 Coríntios 12:4-7',
  },
  {
    id: 'comite',
    title: 'O Comitê Pessoal de Prestação de Contas',
    chapter: 'Capítulo 9: Relações Entre Líderes Cristãos',
    badge: 'Humildade & Proteção',
    summary:
      'Todo líder cristão que não responde a ninguém acabará se tornando abusivo. Escolha dois ou três conselheiros maduros e íntegros com quem você compartilha suas lutas e diante dos quais presta contas da vida pessoal e ministerial.',
    verse: 'Provérbios 11:14; Tiago 5:16',
  },
];

export const SmallingLibraryModal: React.FC<SmallingLibraryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredArticles = ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                Manual de Princípios de Roger Smalling
              </h2>
              <p className="text-xs text-stone-500">
                Liderança Cristã: Princípios e Prática (Rev. Dr. Roger L. Smalling)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-stone-200">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar conceito: Caifás, Martelos, Sr. Incógnito, Mentoria..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>
        </div>

        {/* Article Content list */}
        <div className="p-5 overflow-y-auto space-y-4 divide-y divide-stone-100 flex-1">
          {filteredArticles.map((art) => (
            <div key={art.id} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {art.badge}
                </span>
                <span className="text-xs text-stone-600 font-medium">{art.chapter}</span>
              </div>
              <h3 className="text-base font-extrabold text-stone-900">{art.title}</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{art.summary}</p>
              <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5 pt-1">
                <span>📖</span> {art.verse}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition-colors"
          >
            Fechar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
