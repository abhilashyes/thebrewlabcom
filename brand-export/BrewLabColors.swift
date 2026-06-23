//  BrewLabColors.swift
//  The Brew Lab — brand colors for SwiftUI.
//  Mirrors assets/css/tokens.css. Two palettes: .dark (default) and .light.
//  Usage:  Color.brand.accent   /   BrewLabPalette.dark.bg

import SwiftUI

public extension Color {
    /// Hex initializer supporting "#RRGGBB" and "#RRGGBBAA" / "RRGGBB".
    init(hex: String, alpha: Double = 1.0) {
        var s = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        var rgb: UInt64 = 0
        Scanner(string: s).scanHexInt64(&rgb)
        let r, g, b: Double
        var a = alpha
        if s.count == 8 {
            r = Double((rgb & 0xFF000000) >> 24) / 255
            g = Double((rgb & 0x00FF0000) >> 16) / 255
            b = Double((rgb & 0x0000FF00) >> 8)  / 255
            a = Double(rgb & 0x000000FF) / 255
        } else {
            r = Double((rgb & 0xFF0000) >> 16) / 255
            g = Double((rgb & 0x00FF00) >> 8)  / 255
            b = Double(rgb & 0x0000FF) / 255
        }
        self.init(.sRGB, red: r, green: g, blue: b, opacity: a)
    }
}

public struct BrewLabPalette {
    public let bg, surface, card, accent, accentAlt, champagne, rose: Color
    public let text, textMuted, onAccent, line, glass, glow, shadow: Color

    public static let dark = BrewLabPalette(
        bg:        Color(hex: "#0F1117"),
        surface:   Color(hex: "#161A22"),
        card:      Color(hex: "#1B202B"),
        accent:    Color(hex: "#A78BFA"),
        accentAlt: Color(hex: "#7DD3FC"),
        champagne: Color(hex: "#E9CBA7"),
        rose:      Color(hex: "#F4A8C5"),
        text:      Color(hex: "#F5F7FA"),
        textMuted: Color(hex: "#98A1B2"),
        onAccent:  Color(hex: "#0F1117"),
        line:      Color(hex: "#FFFFFF", alpha: 0.06),
        glass:     Color(hex: "#1B202B", alpha: 0.55),
        glow:      Color(hex: "#A78BFA", alpha: 0.22),
        shadow:    Color(hex: "#000000", alpha: 0.55)
    )

    public static let light = BrewLabPalette(
        bg:        Color(hex: "#FAFAFC"),
        surface:   Color(hex: "#F4F5F8"),
        card:      Color(hex: "#FFFFFF"),
        accent:    Color(hex: "#7C5CFA"),
        accentAlt: Color(hex: "#0891B2"),
        champagne: Color(hex: "#B07B4E"),
        rose:      Color(hex: "#DB7093"),
        text:      Color(hex: "#1A1D26"),
        textMuted: Color(hex: "#6B7280"),
        onAccent:  Color(hex: "#FFFFFF"),
        line:      Color(hex: "#0F1117", alpha: 0.08),
        glass:     Color(hex: "#FFFFFF", alpha: 0.70),
        glow:      Color(hex: "#7C5CFA", alpha: 0.16),
        shadow:    Color(hex: "#0F1117", alpha: 0.10)
    )
}

/// Signature gradient (logo wordmark, headlines, big numbers).
public extension LinearGradient {
    static func brewLabSignature(_ p: BrewLabPalette = .dark) -> LinearGradient {
        LinearGradient(
            stops: [
                .init(color: p.accent,    location: 0.0),
                .init(color: p.rose,      location: 0.55),
                .init(color: p.champagne, location: 1.0)
            ],
            startPoint: .topLeading, endPoint: .bottomTrailing
        )
    }
}
