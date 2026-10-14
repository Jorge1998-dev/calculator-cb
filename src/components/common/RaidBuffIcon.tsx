import React, { useState } from 'react';
import {
  resolveRaidBuffIcon,
  DEFAULT_BUFF_ICON,
  DEFAULT_DEBUFF_ICON,
} from './iconRegistry';

export interface RaidBuffIconProps {
  name: string;
  type?: 'buff' | 'debuff';
  duration?: number;
  size?: 'xs' | 'sm' | 'md';
  showDuration?: boolean;
  defaultIcon?: string;
}

export const RaidBuffIcon: React.FC<RaidBuffIconProps> = ({
  name,
  type = 'buff',
  duration = 0,
  size = 'sm',
  showDuration = true,
  defaultIcon,
}) => {
  const [imgError, setImgError] = useState(false);

  // Resolve icon via the central registry (checks registered icons in src/assets/icons, then fallback)
  const resolved = resolveRaidBuffIcon(name, type, defaultIcon);
  const isDebuff = resolved.isDebuff;
  const isExpiring = duration === 1;

  // Sizing
  const px = size === 'xs' ? 18 : size === 'md' ? 28 : 22;

  const tooltipText = `${resolved.label}${
    duration > 0
      ? ` — ${duration} turno${duration === 1 ? ' restante (⚠️ ¡Expira al terminar este turno!)' : 's restantes'}`
      : ''
  }`;

  // If the initial resolved URL fails, fallback to the default configured icon
  const currentIconUrl = imgError
    ? defaultIcon || (isDebuff ? DEFAULT_DEBUFF_ICON : DEFAULT_BUFF_ICON)
    : resolved.url;

  return (
    <div
      className={`raid-buff-container ${isDebuff ? 'debuff' : 'buff'} ${isExpiring ? 'expiring' : ''}`}
      style={{
        position: 'relative',
        width: `${px}px`,
        height: `${px}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        borderRadius: '3px',
      }}
      title={tooltipText}
    >
      <img
        src={currentIconUrl}
        alt={resolved.label}
        onError={() => {
          if (!imgError) {
            setImgError(true);
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          borderRadius: '3px',
        }}
        loading="lazy"
      />

      {/* In-game Turn Counter Badge (Overlay at bottom-right corner) */}
      {showDuration && duration > 0 && (
        <span
          className="raid-buff-counter"
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-3px',
            fontSize: size === 'xs' ? '8px' : '9.5px',
            fontWeight: 800,
            lineHeight: 1,
            color: isExpiring ? '#fca5a5' : '#ffffff',
            backgroundColor: isExpiring ? 'rgba(220, 38, 38, 0.9)' : 'rgba(0, 0, 0, 0.85)',
            border: `1px solid ${isExpiring ? '#ef4444' : 'rgba(255, 255, 255, 0.3)'}`,
            padding: '1px 2px',
            borderRadius: '2px',
            fontFamily: 'monospace',
            textShadow: '0 1px 2px #000000',
            userSelect: 'none',
          }}
        >
          {duration}
        </span>
      )}
    </div>
  );
};

export { DEFAULT_BUFF_ICON, DEFAULT_DEBUFF_ICON };
