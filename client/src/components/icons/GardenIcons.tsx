import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const SettingsFlowerIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="8" fill={color} />
    <g stroke={color} strokeWidth="2" fill="none">
      <ellipse cx="24" cy="8" rx="6" ry="8" />
      <ellipse cx="24" cy="40" rx="6" ry="8" />
      <ellipse cx="8" cy="24" rx="8" ry="6" />
      <ellipse cx="40" cy="24" rx="8" ry="6" />
      <ellipse cx="12" cy="12" rx="6" ry="6" transform="rotate(-45 12 12)" />
      <ellipse cx="36" cy="12" rx="6" ry="6" transform="rotate(45 36 12)" />
      <ellipse cx="12" cy="36" rx="6" ry="6" transform="rotate(45 12 36)" />
      <ellipse cx="36" cy="36" rx="6" ry="6" transform="rotate(-45 36 36)" />
    </g>
    <circle cx="24" cy="24" r="4" fill="#fff" opacity="0.5" />
  </svg>
);

export const SoundWaveIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M8 20v8a2 2 0 002 2h4l10 8V10L14 18h-4a2 2 0 00-2 2z" fill={color} />
    <path d="M32 17c2 2.5 3 5 3 7s-1 4.5-3 7" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M38 12c3.5 4 5.5 8 5.5 12s-2 8-5.5 12" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="8" cy="38" r="4" fill="#4ade80" />
    <path d="M6 36c4-2 8 2 12 0" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const MusicNoteIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <ellipse cx="14" cy="36" rx="6" ry="5" fill={color} />
    <ellipse cx="38" cy="32" rx="6" ry="5" fill={color} />
    <path d="M20 36V12a2 2 0 012-2h20v22" stroke={color} strokeWidth="3" fill="none" />
    <path d="M20 18h24" stroke={color} strokeWidth="2" />
    <path d="M6 42c4-2 8 1 12-1s8 2 12 0" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="32" cy="8" r="3" fill="#f472b6" />
    <path d="M32 8l4 4" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const VolumeHighIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M6 18v12a2 2 0 002 2h6l12 10V6L14 16H8a2 2 0 00-2 2z" fill={color} />
    <path d="M32 18c1.5 2 2.5 4 2.5 6s-1 4-2.5 6" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M38 14c2.5 3 4 7 4 10s-1.5 7-4 10" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export const VolumeLowIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M10 18v12a2 2 0 002 2h6l12 10V6L18 16h-6a2 2 0 00-2 2z" fill={color} />
    <path d="M36 18c1.5 2 2.5 4 2.5 6s-1 4-2.5 6" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export const VolumeMutedIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M6 18v12a2 2 0 002 2h6l12 10V6L14 16H8a2 2 0 00-2 2z" fill={color} />
    <path d="M32 18l12 12M44 18L32 30" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

export const AppleIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M36.5 25c.1-4.7 3.8-7.1 4-7.2-2.2-3.2-5.6-3.7-6.8-3.7-2.9-.3-5.6 1.7-7.1 1.7-1.5 0-3.8-1.7-6.2-1.6-3.2.1-6.2 1.9-7.8 4.7-3.4 5.8-.9 14.5 2.4 19.2 1.6 2.3 3.5 4.9 6 4.8 2.4-.1 3.3-1.5 6.2-1.5 2.9 0 3.7 1.5 6.2 1.5 2.6 0 4.3-2.4 5.9-4.7 1.9-2.7 2.6-5.3 2.7-5.4-.1-.1-5.1-2-5.5-7.8zM31.5 11c1.3-1.6 2.2-3.8 2-6-1.9.1-4.2 1.3-5.6 2.9-1.2 1.4-2.3 3.7-2 5.9 2.1.2 4.3-1.1 5.6-2.8z" fill={color}/>
  </svg>
);

export const EmailIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="10" width="40" height="28" rx="3" stroke={color} strokeWidth="3" fill="none" />
    <path d="M4 14l20 12 20-12" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="40" cy="36" r="5" fill="#4ade80" />
    <path d="M38 38c2-1 4 1 6 0" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const LanguageGlobeIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="3" fill="none" />
    <ellipse cx="24" cy="24" rx="8" ry="18" stroke={color} strokeWidth="2" fill="none" />
    <path d="M6 24h36" stroke={color} strokeWidth="2" />
    <path d="M10 14h28" stroke={color} strokeWidth="2" />
    <path d="M10 34h28" stroke={color} strokeWidth="2" />
    <circle cx="38" cy="38" r="6" fill="#4ade80" />
    <path d="M35 40c2-1 4 1 6 0" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="36" cy="36" r="2" fill="#f472b6" />
  </svg>
);

export const VersionLeafIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M8 40C8 40 12 8 40 8C40 8 44 36 16 40C16 40 8 44 8 40Z" fill="#4ade80" stroke="#22c55e" strokeWidth="2" />
    <path d="M8 40C14 32 24 20 40 8" stroke="#22c55e" strokeWidth="2" fill="none" />
    <path d="M16 28c4-2 10-1 14 2" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M20 34c2-1 6 0 8 1" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const CheckmarkIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="20" fill="#4ade80" />
    <path d="M14 24l7 7 13-14" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const CloseFlowerIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="16" fill="#fecaca" stroke="#ef4444" strokeWidth="2" />
    <path d="M16 16l16 16M32 16L16 32" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
    <circle cx="8" cy="8" r="4" fill="#f472b6" />
    <circle cx="40" cy="8" r="4" fill="#f472b6" />
    <circle cx="8" cy="40" r="4" fill="#f472b6" />
    <circle cx="40" cy="40" r="4" fill="#f472b6" />
  </svg>
);

export const BackArrowIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="18" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
    <path d="M28 16l-10 8 10 8" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="10" cy="38" r="3" fill="#4ade80" />
    <path d="M8 36c2-1 4 1 6 0" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="10" y="20" width="28" height="22" rx="4" fill={color} />
    <path d="M16 20v-6a8 8 0 1116 0v6" stroke={color} strokeWidth="4" fill="none" />
    <circle cx="24" cy="32" r="4" fill="#fff" />
    <path d="M24 34v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PlayButtonIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="20" fill="#4ade80" />
    <path d="M18 14l18 10-18 10V14z" fill="#fff" />
    <circle cx="40" cy="36" r="4" fill="#f472b6" />
    <circle cx="8" cy="12" r="3" fill="#fbbf24" />
  </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M24 4C15.72 4 9 10.72 9 19c0 11.25 15 25 15 25s15-13.75 15-25c0-8.28-6.72-15-15-15z" fill={color} />
    <circle cx="24" cy="19" r="6" fill="#fff" />
    <circle cx="32" cy="8" r="3" fill="#f472b6" />
    <circle cx="16" cy="10" r="2" fill="#fbbf24" />
  </svg>
);

export const GardenFlowerIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="18" r="6" fill="#fbbf24" />
    <ellipse cx="24" cy="8" rx="4" ry="6" fill="#f472b6" />
    <ellipse cx="32" cy="14" rx="4" ry="6" transform="rotate(60 32 14)" fill="#f472b6" />
    <ellipse cx="32" cy="22" rx="4" ry="6" transform="rotate(120 32 22)" fill="#f472b6" />
    <ellipse cx="24" cy="28" rx="4" ry="6" fill="#f472b6" />
    <ellipse cx="16" cy="22" rx="4" ry="6" transform="rotate(60 16 22)" fill="#f472b6" />
    <ellipse cx="16" cy="14" rx="4" ry="6" transform="rotate(120 16 14)" fill="#f472b6" />
    <path d="M24 28v16" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
    <path d="M20 36c-4-2-6 2-10 0" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M28 40c4-2 6 2 10 0" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const FogCloudIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <ellipse cx="16" cy="28" rx="12" ry="8" fill={color} opacity="0.6" />
    <ellipse cx="32" cy="26" rx="12" ry="10" fill={color} opacity="0.7" />
    <ellipse cx="24" cy="22" rx="14" ry="10" fill={color} opacity="0.8" />
    <ellipse cx="20" cy="32" rx="8" ry="6" fill={color} opacity="0.5" />
    <ellipse cx="30" cy="34" rx="10" ry="6" fill={color} opacity="0.5" />
  </svg>
);

export const AdminLayoutIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="3" fill={color} opacity="0.8" />
    <rect x="24" y="4" width="20" height="10" rx="3" fill={color} opacity="0.6" />
    <rect x="24" y="18" width="20" height="6" rx="2" fill={color} opacity="0.4" />
    <rect x="4" y="24" width="16" height="20" rx="3" fill={color} opacity="0.5" />
    <rect x="24" y="28" width="20" height="16" rx="3" fill={color} opacity="0.7" />
    <circle cx="12" cy="12" r="3" fill="#fff" />
    <path d="M8 10h8M8 14h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <circle cx="40" cy="40" r="4" fill="#4ade80" />
    <path d="M38 38l4 4M42 38l-4 4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const MergeBoardIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="6" y="6" width="36" height="36" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
    <rect x="10" y="10" width="10" height="10" rx="2" fill="#4ade80" />
    <rect x="24" y="10" width="10" height="10" rx="2" fill="#86efac" />
    <rect x="10" y="24" width="10" height="10" rx="2" fill="#86efac" />
    <rect x="24" y="24" width="10" height="10" rx="2" fill="#4ade80" />
    <circle cx="15" cy="15" r="3" fill="#f472b6" />
    <circle cx="29" cy="15" r="3" fill="#fbbf24" />
    <circle cx="15" cy="29" r="3" fill="#fbbf24" />
    <circle cx="29" cy="29" r="3" fill="#f472b6" />
    <path d="M38 38l6 6M44 38l-6 6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ShopBagIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M8 16h32l-4 26H12L8 16z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
    <path d="M16 16V12a8 8 0 1116 0v4" stroke="#f59e0b" strokeWidth="3" fill="none" />
    <circle cx="18" cy="26" r="3" fill="#f472b6" />
    <circle cx="30" cy="26" r="3" fill="#f472b6" />
    <circle cx="24" cy="32" r="3" fill="#4ade80" />
    <path d="M14 38c2-1 4 1 6 0s4 1 6 0s4 1 6 0" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const InventoryChestIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="6" y="18" width="36" height="24" rx="3" fill="#d4a574" stroke="#8b5a2b" strokeWidth="2" />
    <rect x="6" y="18" width="36" height="8" fill="#c09660" stroke="#8b5a2b" strokeWidth="2" />
    <rect x="20" y="22" width="8" height="6" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
    <circle cx="24" cy="25" r="1.5" fill="#8b5a2b" />
    <path d="M10 10c2 4 6 6 14 6s12-2 14-6" stroke="#8b5a2b" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="12" cy="38" r="2" fill="#4ade80" />
    <circle cx="36" cy="38" r="2" fill="#f472b6" />
    <path d="M18 34c2-1 4 1 6 0s4 1 6 0" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const TaskScrollIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M12 8h24a4 4 0 014 4v28a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4z" fill="#fef9c3" stroke="#eab308" strokeWidth="2" />
    <path d="M8 12a4 4 0 014-4h2v4a4 4 0 01-4 4H8v-4z" fill="#fde047" />
    <path d="M40 12a4 4 0 00-4-4h-2v4a4 4 0 004 4h2v-4z" fill="#fde047" />
    <circle cx="16" cy="18" r="2" fill="#4ade80" />
    <path d="M22 18h14" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="26" r="2" fill="#86efac" />
    <path d="M22 26h14" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="34" r="2" fill="#bbf7d0" />
    <path d="M22 34h14" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SellCoinIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="18" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
    <circle cx="24" cy="24" r="12" fill="#fde047" />
    <path d="M24 14v20" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 18c0-2 2-3 4-3s4 1 4 3-1 2-4 3-4 1-4 3 2 3 4 3 4-1 4-3" stroke="#d97706" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const GardenGateIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="8" y="12" width="32" height="32" rx="2" fill="#22c55e" />
    <rect x="12" y="16" width="10" height="24" rx="1" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
    <rect x="26" y="16" width="10" height="24" rx="1" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
    <circle cx="20" cy="28" r="1.5" fill="#16a34a" />
    <circle cx="28" cy="28" r="1.5" fill="#16a34a" />
    <path d="M4 44h40" stroke="#8b5a2b" strokeWidth="3" strokeLinecap="round" />
    <path d="M24 4l-12 8h24l-12-8z" fill="#f472b6" stroke="#ec4899" strokeWidth="1" />
    <circle cx="24" cy="8" r="2" fill="#fbbf24" />
  </svg>
);

export const PlantSeedlingIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M24 44V28" stroke="#8b5a2b" strokeWidth="3" strokeLinecap="round" />
    <path d="M24 28c-8-2-12-8-10-16 8 2 14 8 10 16z" fill="#4ade80" stroke="#22c55e" strokeWidth="2" />
    <path d="M24 28c8-2 12-8 10-16-8 2-14 8-10 16z" fill="#86efac" stroke="#22c55e" strokeWidth="2" />
    <ellipse cx="24" cy="44" rx="8" ry="3" fill="#d4a574" />
  </svg>
);

export const GardenToolIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="22" y="20" width="4" height="24" rx="1" fill="#d4a574" stroke="#8b5a2b" strokeWidth="1" />
    <path d="M14 8h20l-4 16H18L14 8z" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
    <path d="M18 12h12" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="18" r="2" fill="#64748b" />
  </svg>
);

export const GemIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M24 4L8 16l16 28 16-28L24 4z" fill="#a855f7" />
    <path d="M24 4L8 16h32L24 4z" fill="#c084fc" />
    <path d="M24 4l-8 12h16L24 4z" fill="#e9d5ff" />
    <path d="M16 16l8 28 8-28H16z" fill="#9333ea" />
    <path d="M24 16v28" stroke="#7e22ce" strokeWidth="1" />
  </svg>
);

export const StarXPIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M24 4l5.5 11.5L42 17l-9 8.5 2 12.5-11-6-11 6 2-12.5-9-8.5 12.5-1.5L24 4z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
    <path d="M24 12l3 6.5 7 1-5 5 1 7-6-3.5-6 3.5 1-7-5-5 7-1 3-6.5z" fill="#fde047" />
  </svg>
);

export const EnergyBoltIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M28 4L12 26h12l-4 18 16-22H24l4-18z" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
    <path d="M26 10l-8 12h8l-2 10 8-12h-8l2-10z" fill="#60a5fa" />
  </svg>
);
