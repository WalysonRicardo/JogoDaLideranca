import React, { useId } from 'react';
import { CharacterConfig } from '../types';

interface AvatarRendererProps {
  config: CharacterConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fill';
  showFullBody?: boolean;
  className?: string;
}

/**
 * Avatar em estilo ilustração plana (flat) moderna:
 * formas arredondadas, paleta suave, rosto minimalista e roupas em blocos de cor.
 * ViewBox cheio: 200 x 300. Recorte de rosto: 40 x 20 → 120 x 120.
 */

const SKIN = {
  branco: { base: '#F9D3B4', shade: '#EDB78F', blush: '#F4A38C' },
  amarelo: { base: '#F2C27F', shade: '#DFA55C', blush: '#E8956B' },
  marrom: { base: '#B97A4E', shade: '#9C6038', blush: '#C9694A' },
  preto: { base: '#6A412B', shade: '#4F2E1D', blush: '#8A4A32' },
} as const;

const HAIR = '#2A1F1A';
const HAIR_LIGHT = '#43332B';

const sizeClass: Record<NonNullable<AvatarRendererProps['size']>, string> = {
  xs: 'w-10 h-10',
  sm: 'w-16 h-16',
  md: 'w-32 h-44',
  lg: 'w-48 h-64',
  xl: 'w-full max-w-[260px] aspect-[2/3]',
  fill: 'w-full h-full',
};

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  config,
  size = 'md',
  showFullBody = true,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const {
    gender = 'masculino',
    hair = 'cacheado',
    skinColor = 'marrom',
    outfit = 'calca_camiseta',
    footwear = 'tenis',
    glasses = false,
    bibleInHand = true,
  } = config;

  const skin = SKIN[skinColor] ?? SKIN.marrom;
  const fem = gender === 'feminino';

  // ───────── roupas ─────────
  const palette = {
    calca_camiseta: { top: '#14A3A0', topShade: '#0E8582', bottom: '#2F5D9E', long: false },
    bermuda_camiseta: { top: '#F28B30', topShade: '#D8741C', bottom: '#C9B38A', long: false },
    terno_gravata: { top: '#1F2A44', topShade: '#151D32', bottom: '#1F2A44', long: true },
    vestido: { top: '#E8604C', topShade: '#CF4A37', bottom: '#E8604C', long: false },
    saia_blusa: { top: '#F4EFE6', topShade: '#DDD5C6', bottom: '#E0A21F', long: false },
  }[outfit];

  const shoulderW = fem ? 38 : 44; // metade da largura dos ombros
  const cx = 100;

  // ───────── cabelo ─────────
  const hairBack = () => {
    switch (hair) {
      case 'black_power':
        return <circle cx={cx} cy={64} r={50} fill={HAIR} />;
      case 'liso':
        return fem ? (
          <path d="M64 62 C58 110 58 150 66 176 L134 176 C142 150 142 110 136 62 Z" fill={HAIR} />
        ) : null;
      case 'reto':
        return fem ? (
          <path d="M64 60 C60 100 62 124 70 136 L130 136 C138 124 140 100 136 60 Z" fill={HAIR} />
        ) : null;
      case 'cacheado':
        return fem ? (
          <g fill={HAIR}>
            <circle cx="66" cy="96" r="13" />
            <circle cx="62" cy="116" r="13" />
            <circle cx="70" cy="136" r="12" />
            <circle cx="134" cy="96" r="13" />
            <circle cx="138" cy="116" r="13" />
            <circle cx="130" cy="136" r="12" />
          </g>
        ) : null;
      default:
        return null;
    }
  };

  const hairFront = () => {
    switch (hair) {
      case 'careca':
        return null;
      case 'black_power':
        return (
          <path
            d="M70 62 C72 40 128 40 130 62 C120 52 80 52 70 62 Z"
            fill={HAIR_LIGHT}
            opacity="0.7"
          />
        );
      case 'liso':
        return (
          <path
            d="M66 66 C62 36 84 28 104 30 C124 30 140 44 134 66 C128 52 112 46 94 50 C82 52 72 58 66 66 Z"
            fill={HAIR}
          />
        );
      case 'reto':
        return (
          <path
            d="M65 68 C60 34 86 26 104 28 C128 28 142 42 135 68 L132 56 C112 58 90 56 68 56 Z"
            fill={HAIR}
          />
        );
      case 'cacheado':
        return (
          <g fill={HAIR}>
            <circle cx="72" cy="52" r="14" />
            <circle cx="88" cy="42" r="15" />
            <circle cx="106" cy="40" r="15" />
            <circle cx="123" cy="48" r="14" />
            <circle cx="131" cy="62" r="10" />
            <circle cx="69" cy="64" r="10" />
          </g>
        );
      case 'crespo':
        return (
          <g fill={HAIR}>
            {[
              [70, 56, 9],
              [80, 46, 9],
              [92, 40, 9],
              [104, 38, 9],
              [116, 40, 9],
              [127, 47, 9],
              [133, 58, 8],
              [86, 52, 8],
              [100, 49, 8],
              [114, 52, 8],
              [70, 66, 6],
              [132, 68, 6],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} />
            ))}
          </g>
        );
      default:
        return null;
    }
  };

  // ───────── pernas / calçado ─────────
  const legsTop = outfit === 'vestido' ? 232 : outfit === 'saia_blusa' ? 228 : outfit === 'bermuda_camiseta' ? 222 : 196;
  const legsSkin = outfit === 'vestido' || outfit === 'saia_blusa' || outfit === 'bermuda_camiseta';

  const legColor = legsSkin ? skin.base : palette.bottom;

  const legs = (
    <g>
      {/* pernas */}
      <rect x="78" y="190" width="20" height="82" rx="9" fill={legColor} />
      <rect x="102" y="190" width="20" height="82" rx="9" fill={legColor} />
      {/* calça: cobre quase tudo; bermuda/saia/vestido: cobrem só o topo */}
      {outfit === 'calca_camiseta' && (
        <>
          <rect x="76" y="188" width="24" height="88" rx="9" fill={palette.bottom} />
          <rect x="100" y="188" width="24" height="88" rx="9" fill={palette.bottom} />
          <line x1="100" y1="196" x2="100" y2="230" stroke="#254B82" strokeWidth="2" />
        </>
      )}
      {outfit === 'terno_gravata' && (
        <>
          <rect x="76" y="188" width="24" height="88" rx="9" fill={palette.bottom} />
          <rect x="100" y="188" width="24" height="88" rx="9" fill={palette.bottom} />
        </>
      )}
      {outfit === 'bermuda_camiseta' && (
        <>
          <rect x="76" y="188" width="24" height="42" rx="8" fill={palette.bottom} />
          <rect x="100" y="188" width="24" height="42" rx="8" fill={palette.bottom} />
        </>
      )}
      {outfit === 'saia_blusa' && (
        <path d="M72 190 L128 190 L138 238 L62 238 Z" fill={palette.bottom} />
      )}
      {outfit === 'vestido' && (
        <path d="M68 150 L132 150 L146 244 L54 244 Z" fill={palette.top} />
      )}
      {/* sombra do ponto de pernas */}
      <rect x="0" y={legsTop} width="0" height="0" />
    </g>
  );

  const shoes = (
    <g>
      {footwear === 'tenis' ? (
        <>
          <path d="M70 270 C70 262 96 262 98 270 L100 282 L66 282 Z" fill="#FFFFFF" stroke="#D9D9DE" strokeWidth="1.5" />
          <path d="M130 270 C130 262 104 262 102 270 L100 282 L134 282 Z" fill="#FFFFFF" stroke="#D9D9DE" strokeWidth="1.5" />
          <rect x="66" y="278" width="34" height="6" rx="3" fill="#E8604C" />
          <rect x="100" y="278" width="34" height="6" rx="3" fill="#E8604C" />
        </>
      ) : (
        <>
          <rect x="68" y="272" width="32" height="10" rx="5" fill={skin.base} />
          <rect x="100" y="272" width="32" height="10" rx="5" fill={skin.base} />
          <rect x="66" y="280" width="36" height="6" rx="3" fill="#8A5A34" />
          <rect x="98" y="280" width="36" height="6" rx="3" fill="#8A5A34" />
          <path d="M72 272 L84 262 L96 272" stroke="#8A5A34" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M104 272 L116 262 L128 272" stroke="#8A5A34" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      )}
    </g>
  );

  // ───────── tronco / braços ─────────
  const torsoBottom = outfit === 'vestido' ? 160 : 196;
  const armTop = 120;

  const arms = (
    <g>
      {/* braço esquerdo (do espectador) */}
      <rect x={cx - shoulderW - 12} y={armTop} width="16" height="70" rx="8" fill={palette.long ? palette.top : skin.base} />
      {!palette.long && (
        <rect x={cx - shoulderW - 13} y={armTop} width="18" height="28" rx="9" fill={palette.top} />
      )}
      <circle cx={cx - shoulderW - 4} cy="192" r="9" fill={skin.base} />

      {/* braço direito */}
      <rect x={cx + shoulderW - 4} y={armTop} width="16" height="70" rx="8" fill={palette.long ? palette.top : skin.base} />
      {!palette.long && (
        <rect x={cx + shoulderW - 5} y={armTop} width="18" height="28" rx="9" fill={palette.top} />
      )}
      <circle cx={cx + shoulderW + 4} cy="192" r="9" fill={skin.base} />
    </g>
  );

  const torso = (
    <g>
      <path
        d={`M${cx - shoulderW} 122 C${cx - shoulderW} 112 ${cx - 20} 108 ${cx} 108 C${cx + 20} 108 ${cx + shoulderW} 112 ${cx + shoulderW} 122 L${cx + shoulderW - 4} ${torsoBottom} L${cx - shoulderW + 4} ${torsoBottom} Z`}
        fill={palette.top}
      />
      {/* detalhes por roupa */}
      {outfit === 'terno_gravata' && (
        <>
          <path d="M84 108 L100 150 L116 108 Z" fill="#FFFFFF" />
          <path d="M100 118 L95 128 L100 164 L105 128 Z" fill="#E8604C" />
          <path d="M84 108 L100 150 L70 150 Z" fill={palette.topShade} />
          <path d="M116 108 L100 150 L130 150 Z" fill={palette.topShade} />
        </>
      )}
      {(outfit === 'calca_camiseta' || outfit === 'bermuda_camiseta') && (
        <path d="M86 108 C92 120 108 120 114 108 C108 112 92 112 86 108 Z" fill={palette.topShade} />
      )}
      {outfit === 'saia_blusa' && (
        <>
          <path d="M86 108 C92 122 108 122 114 108 Z" fill={palette.topShade} />
          <rect x="72" y="186" width="56" height="8" rx="3" fill={palette.bottom} />
        </>
      )}
      {outfit === 'vestido' && (
        <path d="M86 108 C92 122 108 122 114 108 Z" fill={palette.topShade} />
      )}
      {outfit === 'calca_camiseta' && <rect x="76" y="186" width="48" height="8" rx="3" fill="#254B82" />}
    </g>
  );

  // ───────── bíblia ─────────
  const bible = bibleInHand && (
    <g transform={`translate(${cx + shoulderW - 6} 168)`}>
      <rect x="0" y="0" width="22" height="30" rx="3" fill="#6B3E26" />
      <rect x="2" y="2" width="18" height="26" rx="2" fill="#7E4B30" />
      <rect x="10" y="7" width="2" height="12" fill="#E8C766" />
      <rect x="6" y="11" width="10" height="2" fill="#E8C766" />
      <circle cx="4" cy="26" r="9" fill={skin.base} />
    </g>
  );

  // ───────── cabeça ─────────
  const face = (
    <g>
      {/* pescoço */}
      <rect x="90" y="92" width="20" height="22" rx="8" fill={skin.shade} />
      {/* orelhas */}
      <circle cx="66" cy="72" r="7" fill={skin.base} />
      <circle cx="134" cy="72" r="7" fill={skin.base} />
      {/* rosto */}
      <rect x="66" y="38" width="68" height="64" rx="32" fill={skin.base} />
      {/* bochechas */}
      <ellipse cx="80" cy="82" rx="7" ry="4" fill={skin.blush} opacity="0.35" />
      <ellipse cx="120" cy="82" rx="7" ry="4" fill={skin.blush} opacity="0.35" />
      {/* sobrancelhas */}
      <path d="M79 60 Q86 56 93 60" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M107 60 Q114 56 121 60" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {/* olhos */}
      <circle cx="86" cy="70" r="3.6" fill="#1D1613" />
      <circle cx="114" cy="70" r="3.6" fill="#1D1613" />
      <circle cx="87.2" cy="68.8" r="1.1" fill="#FFFFFF" />
      <circle cx="115.2" cy="68.8" r="1.1" fill="#FFFFFF" />
      {fem && (
        <>
          <path d="M82 66 L79.5 63.5" stroke="#1D1613" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M118 66 L120.5 63.5" stroke="#1D1613" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {/* nariz */}
      <path d="M100 74 Q98 82 102 83" stroke={skin.shade} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* sorriso */}
      <path d="M90 90 Q100 98 110 90" stroke="#5A2A22" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {/* óculos */}
      {glasses && (
        <g stroke="#2A2F3A" strokeWidth="2.4" fill="rgba(255,255,255,0.18)">
          <circle cx="86" cy="70" r="10" />
          <circle cx="114" cy="70" r="10" />
          <line x1="96" y1="70" x2="104" y2="70" />
          <line x1="76" y1="70" x2="68" y2="68" />
          <line x1="124" y1="70" x2="132" y2="68" />
        </g>
      )}
    </g>
  );

  const viewBox = showFullBody ? '0 0 200 300' : '48 16 104 104';

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClass[size]} ${className}`}>
      <svg
        viewBox={viewBox}
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Avatar de ${config.name}`}
      >
        <defs>
          <filter id={`sh-${uid}`} x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.12" />
          </filter>
        </defs>
        {showFullBody && <ellipse cx="100" cy="286" rx="52" ry="7" fill="#000" opacity="0.08" />}
        <g filter={showFullBody ? `url(#sh-${uid})` : undefined}>
          {hairBack()}
          {legs}
          {showFullBody && shoes}
          {arms}
          {torso}
          {face}
          {hairFront()}
          {showFullBody && bible}
        </g>
      </svg>
    </div>
  );
};
