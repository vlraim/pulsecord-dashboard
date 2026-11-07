import React from 'react';

interface InitialsAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'rounded' | 'rounded-2xl';
  className?: string;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  bgColor?: string;
}

// Vibrant Discord-inspired palette
const COLOR_PALETTES = [
  'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white',
  'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white',
  'bg-gradient-to-tr from-violet-600 to-purple-600 text-white',
  'bg-gradient-to-tr from-fuchsia-600 to-pink-600 text-white',
  'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white',
  'bg-gradient-to-tr from-blue-600 to-cyan-600 text-white',
  'bg-gradient-to-tr from-rose-600 to-red-600 text-white',
  'bg-gradient-to-tr from-amber-600 to-orange-600 text-white',
];

export function getInitials(name: string): string {
  if (!name || !name.trim()) return '?';
  const clean = name.trim().replace(/[^a-zA-Z0-9\s]/g, '');
  const parts = clean.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return name.slice(0, 2).toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getPalette(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTES.length;
  return COLOR_PALETTES[index];
}

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = 'md',
  shape = 'circle',
  className = '',
  status,
  bgColor,
}) => {
  const initials = getInitials(name);
  const colorClass = bgColor || getPalette(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-14 h-14 text-base',
    '2xl': 'w-16 h-16 text-xl',
  }[size];

  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    'rounded-2xl': 'rounded-2xl',
  }[shape];

  const statusColors = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    dnd: 'bg-rose-500',
    offline: 'bg-neutral-500',
  };

  const statusSize = {
    xs: 'w-2 h-2',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  }[size];

  return (
    <div className={`relative inline-flex flex-shrink-0 items-center justify-center font-bold tracking-tight select-none shadow-sm ${sizeClasses} ${shapeClasses} ${colorClass} ${className}`}>
      <span>{initials}</span>
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-[#090a10] ${statusColors[status]} ${statusSize}`}
        />
      )}
    </div>
  );
};
