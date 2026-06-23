/**
 * The Brew Lab — brand colors (React Native / Expo / any JS-TS app).
 * Mirrors assets/css/tokens.css. Two themes: dark (default) and light.
 * Usage:  brewLabColors.dark.accent  /  useColorScheme() to pick theme.
 */

export type BrewLabTheme = {
  bg: string;
  surface: string;
  card: string;
  accent: string;      // primary (lavender)
  accentAlt: string;   // secondary (cyan)
  champagne: string;
  rose: string;
  text: string;
  textMuted: string;
  onAccent: string;
  line: string;        // rgba string
  glass: string;       // rgba string
  glow: string;        // rgba string
  shadow: string;      // rgba string
};

export const brewLabColors: { dark: BrewLabTheme; light: BrewLabTheme } = {
  dark: {
    bg: '#0F1117',
    surface: '#161A22',
    card: '#1B202B',
    accent: '#A78BFA',
    accentAlt: '#7DD3FC',
    champagne: '#E9CBA7',
    rose: '#F4A8C5',
    text: '#F5F7FA',
    textMuted: '#98A1B2',
    onAccent: '#0F1117',
    line: 'rgba(255, 255, 255, 0.06)',
    glass: 'rgba(27, 32, 43, 0.55)',
    glow: 'rgba(167, 139, 250, 0.22)',
    shadow: 'rgba(0, 0, 0, 0.55)',
  },
  light: {
    bg: '#FAFAFC',
    surface: '#F4F5F8',
    card: '#FFFFFF',
    accent: '#7C5CFA',
    accentAlt: '#0891B2',
    champagne: '#B07B4E',
    rose: '#DB7093',
    text: '#1A1D26',
    textMuted: '#6B7280',
    onAccent: '#FFFFFF',
    line: 'rgba(15, 17, 23, 0.08)',
    glass: 'rgba(255, 255, 255, 0.7)',
    glow: 'rgba(124, 92, 250, 0.16)',
    shadow: 'rgba(15, 17, 23, 0.10)',
  },
};

/** Signature gradient stops (logo wordmark, headlines, big numbers). */
export const brewLabSignatureGradient = {
  angleDeg: 110,
  colors: ['#A78BFA', '#F4A8C5', '#E9CBA7'], // accent → rose → champagne
  locations: [0, 0.55, 1],
};

/** Status dots (theme-independent). */
export const brewLabDots = {
  red: '#FF5F57',
  yellow: '#FEBC2E',
  green: '#28C840',
};
