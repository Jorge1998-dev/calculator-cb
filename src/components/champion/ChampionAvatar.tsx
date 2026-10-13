import React, { useState } from 'react';
import championAvatarsData from '../../data/championAvatars.json';

const CHAMPION_AVATARS: Record<string, string> = championAvatarsData as Record<string, string>;

interface ChampionAvatarProps {
  name: string;
  rarity?: 'Mythical' | 'Legendary' | 'Epic' | 'Rare' | 'Uncommon' | 'Common' | string;
  affinity?: 'Void' | 'Force' | 'Magic' | 'Spirit' | string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  slotColor?: string;
  showAffinity?: boolean;
}

// Known portrait URLs for high-priority Clan Boss champions as fallback
const KNOWN_PORTRAITS: Record<string, string> = {
  'elva autumnborn': 'https://hellhades.com/wp-content/uploads/2022/10/elva-autumnborn-portrait.jpg',
  'demytha': 'https://hellhades.com/wp-content/uploads/2021/09/demytha.png',
  'lady mikage': 'https://hellhades.com/wp-content/uploads/2023/10/Lady-Mikage-Splash-Artwork.jpg',
  'lydia the deathsiren': 'https://hellhades.com/wp-content/uploads/2020/11/Lydia-the-Deathsiren.jpg',
  'maneater': 'https://hellhades.com/wp-content/uploads/2020/11/Maneater.jpg',
  'krisk the ageless': 'https://hellhades.com/wp-content/uploads/2020/11/Krisk-the-Ageless.jpg',
};

export const ChampionAvatar: React.FC<ChampionAvatarProps> = ({
  name,
  rarity = 'Legendary',
  affinity = 'Void',
  avatarUrl,
  size = 'md',
  slotColor,
  showAffinity = true,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Normalize name for lookup
  const cleanName = (name || '').trim().toLowerCase();
  const normalizedKey = cleanName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

  const directUrl =
    (avatarUrl && (avatarUrl.startsWith('http') || avatarUrl.startsWith('data:')) ? avatarUrl : '') ||
    CHAMPION_AVATARS[cleanName] ||
    CHAMPION_AVATARS[normalizedKey] ||
    KNOWN_PORTRAITS[cleanName] ||
    Object.entries(CHAMPION_AVATARS).find(([k]) => cleanName.includes(k) && k.length > 4)?.[1] ||
    '';

  // Reset failed state if URL changes
  const prevUrlRef = React.useRef(directUrl);
  if (prevUrlRef.current !== directUrl) {
    prevUrlRef.current = directUrl;
    setImageFailed(false);
  }

  // Pixel sizing
  const dimensions =
    size === 'xs'
      ? { width: 20, height: 20, font: '0.6rem', border: '1.5px' }
      : size === 'sm'
      ? { width: 26, height: 26, font: '0.7rem', border: '2px' }
      : size === 'lg'
      ? { width: 56, height: 56, font: '1.1rem', border: '3px' }
      : { width: 42, height: 42, font: '0.85rem', border: '2px' };

  // Theme colors based on Raid Rarity
  const rarityColors: Record<string, { border: string; glow: string; bg: string }> = {
    mythical: {
      border: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.45)',
      bg: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
    },
    legendary: {
      border: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.45)',
      bg: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
    },
    epic: {
      border: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.45)',
      bg: 'linear-gradient(135deg, #581c87 0%, #3b0764 100%)',
    },
    rare: {
      border: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.45)',
      bg: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
    },
    uncommon: {
      border: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
      bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
    },
    common: {
      border: '#94a3b8',
      glow: 'rgba(148, 163, 184, 0.25)',
      bg: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
    },
  };

  const rarityKey = (rarity || '').toLowerCase();
  const theme = rarityColors[rarityKey] || rarityColors.legendary;

  // Affinity Icon
  const affinityIcons: Record<string, { icon: string; color: string }> = {
    void: { icon: '🟣', color: '#c084fc' },
    force: { icon: '🔴', color: '#f87171' },
    magic: { icon: '🔵', color: '#60a5fa' },
    spirit: { icon: '🟢', color: '#4ade80' },
  };
  const affKey = (affinity || '').toLowerCase();
  const affMeta = affinityIcons[affKey] || affinityIcons.void;

  // Initials (e.g., 'Elva Autumnborn' => 'EA')
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <div
      className="champion-avatar-wrapper"
      style={{
        position: 'relative',
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        flexShrink: 0,
      }}
      title={`${name} (${rarity} • ${affinity})`}
    >
      <div
        className="champion-avatar-frame"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '6px',
          border: `${dimensions.border} solid ${slotColor || theme.border}`,
          boxShadow: `0 2px 8px ${theme.glow}`,
          background: theme.bg,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {directUrl && !imageFailed ? (
          <img
            src={directUrl}
            alt={name}
            onError={() => setImageFailed(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            loading="lazy"
          />
        ) : (
          <span
            style={{
              fontSize: dimensions.font,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              userSelect: 'none',
            }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Tiny affinity icon in the corner for medium & large sizes */}
      {showAffinity && (size === 'md' || size === 'lg') && (
        <span
          className="affinity-badge"
          style={{
            position: 'absolute',
            bottom: '-3px',
            right: '-3px',
            fontSize: size === 'lg' ? '12px' : '9px',
            lineHeight: 1,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))',
          }}
          title={affinity}
        >
          {affMeta.icon}
        </span>
      )}
    </div>
  );
};
