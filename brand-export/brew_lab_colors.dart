// brew_lab_colors.dart
// The Brew Lab — brand colors for Flutter.
// Mirrors assets/css/tokens.css. Two palettes: dark (default) and light.
// Usage: BrewLabColors.dark.accent  /  Theme via BrewLabColors.dark.toColorScheme()

import 'package:flutter/material.dart';

@immutable
class BrewLabColors {
  final Color bg, surface, card, accent, accentAlt, champagne, rose;
  final Color text, textMuted, onAccent, line, glass, glow, shadow;

  const BrewLabColors({
    required this.bg,
    required this.surface,
    required this.card,
    required this.accent,
    required this.accentAlt,
    required this.champagne,
    required this.rose,
    required this.text,
    required this.textMuted,
    required this.onAccent,
    required this.line,
    required this.glass,
    required this.glow,
    required this.shadow,
  });

  static const dark = BrewLabColors(
    bg:        Color(0xFF0F1117),
    surface:   Color(0xFF161A22),
    card:      Color(0xFF1B202B),
    accent:    Color(0xFFA78BFA),
    accentAlt: Color(0xFF7DD3FC),
    champagne: Color(0xFFE9CBA7),
    rose:      Color(0xFFF4A8C5),
    text:      Color(0xFFF5F7FA),
    textMuted: Color(0xFF98A1B2),
    onAccent:  Color(0xFF0F1117),
    line:      Color(0x0FFFFFFF),  // white @ 6%
    glass:     Color(0x8C1B202B),  // card @ 55%
    glow:      Color(0x38A78BFA),  // accent @ 22%
    shadow:    Color(0x8C000000),  // black @ 55%
  );

  static const light = BrewLabColors(
    bg:        Color(0xFFFAFAFC),
    surface:   Color(0xFFF4F5F8),
    card:      Color(0xFFFFFFFF),
    accent:    Color(0xFF7C5CFA),
    accentAlt: Color(0xFF0891B2),
    champagne: Color(0xFFB07B4E),
    rose:      Color(0xFFDB7093),
    text:      Color(0xFF1A1D26),
    textMuted: Color(0xFF6B7280),
    onAccent:  Color(0xFFFFFFFF),
    line:      Color(0x140F1117),  // ink @ 8%
    glass:     Color(0xB3FFFFFF),  // white @ 70%
    glow:      Color(0x297C5CFA),  // accent @ 16%
    shadow:    Color(0x1A0F1117),  // ink @ 10%
  );

  // Signature gradient (logo wordmark, headlines, big numbers).
  LinearGradient get signatureGradient => LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [accent, rose, champagne],
        stops: const [0.0, 0.55, 1.0],
      );

  ColorScheme toColorScheme(Brightness brightness) => ColorScheme(
        brightness: brightness,
        primary: accent,
        onPrimary: onAccent,
        secondary: accentAlt,
        onSecondary: onAccent,
        surface: card,
        onSurface: text,
        error: const Color(0xFFFF5F57),
        onError: Colors.white,
      );
}

// status dots (theme-independent)
class BrewLabDots {
  static const red = Color(0xFFFF5F57);
  static const yellow = Color(0xFFFEBC2E);
  static const green = Color(0xFF28C840);
}
