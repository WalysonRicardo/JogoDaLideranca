import React, { useState } from 'react';
import {
  CharacterConfig,
  Gender,
  HairType,
  SkinColor,
  OutfitType,
  FootwearType,
} from '../types';
import { AvatarRenderer } from './AvatarRenderer';
import {
  Sparkles,
  User,
  Scissors,
  Palette,
  Shirt,
  Footprints,
  BookOpen,
  CheckCircle2,
  Dice5,
  ArrowRight,
} from 'lucide-react';

interface CharacterCreatorProps {
  initialConfig?: CharacterConfig;
  onComplete: (config: CharacterConfig) => void;
  onBackToHome?: () => void;
}

const HAIR_OPTIONS: { id: HairType; label: string; icon: string }[] = [
  { id: 'crespo', label: 'Crespo', icon: '🌀' },
  { id: 'cacheado', label: 'Cacheado', icon: '➰' },
  { id: 'liso', label: 'Liso', icon: '〰️' },
  { id: 'careca', label: 'Careca', icon: '✨' },
  { id: 'black_power', label: 'Black Power', icon: '👑' },
  { id: 'reto', label: 'Reto com Franja', icon: '✂️' },
];

const SKIN_OPTIONS: { id: SkinColor; label: string; colorHex: string }[] = [
  { id: 'branco', label: 'Clara / Bege', colorHex: '#FBD8BE' },
  { id: 'amarelo', label: 'Amarela / Dourada', colorHex: '#F4C988' },
  { id: 'marrom', label: 'Parda / Marrom', colorHex: '#A86C45' },
  { id: 'preto', label: 'Negra / Escura', colorHex: '#563522' },
];

const OUTFIT_OPTIONS: { id: OutfitType; label: string; description: string }[] = [
  {
    id: 'calca_camiseta',
    label: 'Calça jeans e camiseta',
    description: 'Estilo jovem despojado e prático para o dia a dia',
  },
  {
    id: 'terno_gravata',
    label: 'Terno e gravata',
    description: 'Elegância e solenidade para ocasiões formais',
  },
  {
    id: 'vestido',
    label: 'Vestido',
    description: 'Charme clássico e fluidez pastoral',
  },
  {
    id: 'saia_blusa',
    label: 'Saia e blusa',
    description: 'Composição harmoniosa e acolhedora',
  },
  {
    id: 'bermuda_camiseta',
    label: 'Bermuda e camiseta',
    description: 'Clima descontraído de acampamento e luau jovem',
  },
];

const FOOTWEAR_OPTIONS: { id: FootwearType; label: string; icon: string }[] = [
  { id: 'tenis', label: 'Tênis', icon: '👟' },
  { id: 'sandalia', label: 'Sandália', icon: '🩴' },
];

const RANDOM_NAMES = [
  'Líder Gabriel',
  'Pastora Rebeca',
  'Diácono Lucas',
  'Líder Priscila',
  'Presbítero Tiago',
  'Líder Débora',
  'Pastor Mateus',
  'Líder Sara',
  'Missionário Daniel',
  'Líder Ester',
];

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  initialConfig,
  onComplete,
}) => {
  const [config, setConfig] = useState<CharacterConfig>(
    initialConfig || {
      name: 'Líder Gabriel',
      gender: 'masculino',
      hair: 'cacheado',
      skinColor: 'marrom',
      outfit: 'calca_camiseta',
      footwear: 'tenis',
      glasses: false,
      bibleInHand: true,
    }
  );

  const [activeTab, setActiveTab] = useState<'geral' | 'cabelo' | 'pele' | 'roupa'>('geral');
  const [nameError, setNameError] = useState('');

  const handleRandomize = () => {
    const randomGender: Gender = Math.random() > 0.5 ? 'masculino' : 'feminino';
    const randomHair = HAIR_OPTIONS[Math.floor(Math.random() * HAIR_OPTIONS.length)].id;
    const randomSkin = SKIN_OPTIONS[Math.floor(Math.random() * SKIN_OPTIONS.length)].id;
    const randomFootwear = FOOTWEAR_OPTIONS[Math.floor(Math.random() * FOOTWEAR_OPTIONS.length)].id;
    const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];

    let eligibleOutfits = OUTFIT_OPTIONS.map((o) => o.id);
    if (randomGender === 'masculino') {
      eligibleOutfits = ['terno_gravata', 'calca_camiseta', 'bermuda_camiseta'];
    }
    const randomOutfit = eligibleOutfits[Math.floor(Math.random() * eligibleOutfits.length)];

    setConfig({
      name: randomName,
      gender: randomGender,
      hair: randomHair,
      skinColor: randomSkin,
      outfit: randomOutfit,
      footwear: randomFootwear,
      glasses: Math.random() > 0.5,
      bibleInHand: true,
    });
  };

  const handleConfirm = () => {
    if (!config.name.trim()) {
      setNameError('Por favor, informe o nome do seu líder!');
      return;
    }
    onComplete(config);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Oficina do Líder Cristão
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Monte o seu líder
        </h1>
        <p className="mt-2 text-stone-600 max-w-2xl mx-auto text-sm sm:text-base">
          Escolha o visual do seu personagem. É ele que vai viver as situações do jogo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Avatar Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-b from-stone-50 to-amber-50/40 rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" /> Prévia ao Vivo
            </span>
            <button
              type="button"
              onClick={handleRandomize}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg shadow-2xs hover:bg-stone-50 transition-colors"
            >
              <Dice5 className="w-3.5 h-3.5 text-amber-600" /> Sortear
            </button>
          </div>

          {/* Interactive Podium */}
          <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px] bg-radial from-amber-100/60 to-stone-200/40 rounded-2xl flex items-center justify-center p-4 border border-amber-200/50 shadow-inner">
            <AvatarRenderer config={config} size="xl" showFullBody={true} />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-4 bg-stone-800/10 rounded-full blur-xs pointer-events-none" />
          </div>

          {/* Leader Nametag */}
          <div className="mt-5 w-full text-center">
            <div className="inline-block bg-white px-5 py-2.5 rounded-xl border border-stone-200 shadow-2xs">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                {config.gender === 'masculino' ? 'Líder / Ministro' : 'Líder / Ministra'}
              </p>
              <h3 className="text-xl font-black text-stone-900 mt-0.5">
                {config.name || 'Sem Nome'}
              </h3>
            </div>
          </div>

          {/* Quick Toggle Extras */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setConfig({ ...config, glasses: !config.glasses })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                config.glasses
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              👓 {config.glasses ? 'Com Óculos' : 'Sem Óculos'}
            </button>
            <button
              type="button"
              onClick={() => setConfig({ ...config, bibleInHand: !config.bibleInHand })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                config.bibleInHand
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              📖 {config.bibleInHand ? 'Com Bíblia' : 'Sem Bíblia'}
            </button>
          </div>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-stone-200 pb-3 mb-6 gap-2 sm:gap-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('geral')}
              className={`flex items-center gap-2 pb-2 px-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'geral'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <User className="w-4 h-4" /> Nome & Sexo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cabelo')}
              className={`flex items-center gap-2 pb-2 px-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'cabelo'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Scissors className="w-4 h-4" /> Cabelo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pele')}
              className={`flex items-center gap-2 pb-2 px-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'pele'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Palette className="w-4 h-4" /> Cor de Pele
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('roupa')}
              className={`flex items-center gap-2 pb-2 px-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'roupa'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Shirt className="w-4 h-4" /> Roupas & Calçados
            </button>
          </div>

          {/* Tab 1: Geral */}
          {activeTab === 'geral' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">
                  Nome do Líder / Jogador
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => {
                      setConfig({ ...config, name: e.target.value });
                      if (nameError) setNameError('');
                    }}
                    placeholder="Ex: Pastor Paulo, Líder Ana..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 font-medium placeholder-stone-400"
                  />
                  {nameError && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{nameError}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Sexo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, gender: 'masculino' })}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 font-semibold transition-all ${
                      config.gender === 'masculino'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-2xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-xl">👨</span> Masculino
                    {config.gender === 'masculino' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, gender: 'feminino' })}
                    className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 font-semibold transition-all ${
                      config.gender === 'feminino'
                        ? 'border-rose-500 bg-rose-50/60 text-rose-900 shadow-2xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-xl">👩</span> Feminino
                    {config.gender === 'feminino' && (
                      <CheckCircle2 className="w-4 h-4 text-rose-500 ml-auto" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-700" /> Princípio do Chamado
                </p>
                «Não fostes vós que me escolhestes a mim, pelo contrário, eu vos escolhi a vós para que vades e deis fruto.» (João 15:16). Deus usa todo tipo de pessoa para manifestar Sua glória.
              </div>
            </div>
          )}

          {/* Tab 2: Cabelo */}
          {activeTab === 'cabelo' && (
            <div className="space-y-4 animate-fadeIn">
              <label className="block text-sm font-bold text-stone-700">
                Selecione o Tipo de Cabelo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {HAIR_OPTIONS.map((item) => {
                  const isSelected = config.hair === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setConfig({ ...config, hair: item.id })}
                      className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/80 text-amber-900 shadow-2xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{item.icon}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                      </div>
                      <span className="font-bold text-sm mt-2">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Pele */}
          {activeTab === 'pele' && (
            <div className="space-y-4 animate-fadeIn">
              <label className="block text-sm font-bold text-stone-700">
                Selecione o Tom da Cor de Pele
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SKIN_OPTIONS.map((skin) => {
                  const isSelected = config.skinColor === skin.id;
                  return (
                    <button
                      key={skin.id}
                      type="button"
                      onClick={() => setConfig({ ...config, skinColor: skin.id })}
                      className={`p-4 rounded-xl border-2 text-left flex items-center gap-3.5 transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/80 text-amber-900 shadow-2xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full border border-stone-300 shadow-2xs shrink-0"
                        style={{ backgroundColor: skin.colorHex }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-stone-900 capitalize">{skin.id}</p>
                        <p className="text-xs text-stone-500">{skin.label}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Roupa e Calçado */}
          {activeTab === 'roupa' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Vestimenta / Roupa
                </label>
                <div className="space-y-2">
                  {OUTFIT_OPTIONS.map((item) => {
                    const isSelected = config.outfit === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setConfig({ ...config, outfit: item.id })}
                        className={`w-full p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/80 text-amber-950 shadow-2xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-sm text-stone-900">{item.label}</p>
                          <p className="text-xs text-stone-500 mt-0.5">{item.description}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Calçado
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {FOOTWEAR_OPTIONS.map((foot) => {
                    const isSelected = config.footwear === foot.id;
                    return (
                      <button
                        key={foot.id}
                        type="button"
                        onClick={() => setConfig({ ...config, footwear: foot.id })}
                        className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/80 text-amber-950 shadow-2xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-2xl">{foot.icon}</span>
                        <span className="font-bold text-sm text-stone-900">{foot.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleRandomize}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-stone-700 border border-stone-300 font-semibold text-sm hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
            >
              <Dice5 className="w-4 h-4 text-stone-500" />
              Opção Aleatória
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-base hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Começar o jogo
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
