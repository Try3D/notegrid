import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Light theme
  static const Color lightBg = Color(0xFFFDF7F1);
  static const Color lightCard = Color(0xFFFFFFFF);
  static const Color lightBorder = Color(0xFF3C3C3C);
  static const Color lightText = Color(0xFF3C3C3C);
  static const Color lightMuted = Color(0xFF6B7280);
  static const Color lightHover = Color(0xFFF5EBE0);
  static const Color lightTaskBg = Color(0xFFFEFCFA);
  static const Color lightTaskBgAlt = Color(0xFFFDF7F1);

  // Dark theme
  static const Color darkBg = Color(0xFF1A1A1A);
  static const Color darkCard = Color(0xFF252525);
  static const Color darkBorder = Color(0xFFE0E0E0);
  static const Color darkText = Color(0xFFF0F0F0);
  static const Color darkMuted = Color(0xFFA0A0A0);
  static const Color darkHover = Color(0xFF333333);
  static const Color darkTaskBg = Color(0xFF252525);
  static const Color darkTaskBgAlt = Color(0xFF2A2A2A);

  // Accent colors
  static const Color red = Color(0xFFEF4444);
  static const Color green = Color(0xFF22C55E);
  static const Color orange = Color(0xFFF97316);
  static const Color blue = Color(0xFF3B82F6);
  static const Color purple = Color(0xFF8B5CF6);
  static const Color pink = Color(0xFFEC4899);
  static const Color teal = Color(0xFF14B8A6);
  static const Color yellow = Color(0xFFFACC15);
  static const Color gray = Color(0xFF64748B);
  static const Color dark = Color(0xFF0F172A);
  static const Color danger = Color(0xFFDC2626);

  static const List<Color> taskColors = [
    red, green, orange, blue, purple, pink, teal, yellow, gray, dark
  ];

  static const Map<String, Color> colorMap = {
    '#ef4444': red,
    '#22c55e': green,
    '#f97316': orange,
    '#3b82f6': blue,
    '#8b5cf6': purple,
    '#ec4899': pink,
    '#14b8a6': teal,
    '#facc15': yellow,
    '#64748b': gray,
    '#0f172a': dark,
  };

  static const Map<String, String> colorNames = {
    '#ef4444': 'Red',
    '#22c55e': 'Green',
    '#f97316': 'Orange',
    '#3b82f6': 'Blue',
    '#8b5cf6': 'Purple',
    '#ec4899': 'Pink',
    '#14b8a6': 'Teal',
    '#facc15': 'Yellow',
    '#64748b': 'Gray',
    '#0f172a': 'Dark',
  };

  static Color fromHex(String hex) {
    return colorMap[hex.toLowerCase()] ?? red;
  }

  static String toHex(Color color) {
    for (final entry in colorMap.entries) {
      if (entry.value == color) return entry.key;
    }
    return '#ef4444';
  }
}

class AppTheme {
  static TextTheme _buildTextTheme(Color textColor, Color mutedColor) {
    return TextTheme(
      displayLarge: GoogleFonts.shortStack(
        fontSize: 32,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      displayMedium: GoogleFonts.shortStack(
        fontSize: 28,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      displaySmall: GoogleFonts.shortStack(
        fontSize: 24,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      headlineLarge: GoogleFonts.shortStack(
        fontSize: 24,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      headlineMedium: GoogleFonts.shortStack(
        fontSize: 20,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      headlineSmall: GoogleFonts.shortStack(
        fontSize: 18,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      titleLarge: GoogleFonts.shortStack(
        fontSize: 18,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      titleMedium: GoogleFonts.shortStack(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      titleSmall: GoogleFonts.shortStack(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      bodyLarge: GoogleFonts.shortStack(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      bodyMedium: GoogleFonts.shortStack(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      bodySmall: GoogleFonts.shortStack(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: mutedColor,
      ),
      labelLarge: GoogleFonts.shortStack(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      labelMedium: GoogleFonts.shortStack(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      labelSmall: GoogleFonts.shortStack(
        fontSize: 10,
        fontWeight: FontWeight.w400,
        color: mutedColor,
      ),
    );
  }

  static ThemeData light() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.lightBg,
      colorScheme: const ColorScheme.light(
        primary: AppColors.blue,
        secondary: AppColors.green,
        surface: AppColors.lightCard,
        error: AppColors.danger,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.lightText,
        onError: Colors.white,
      ),
      textTheme: _buildTextTheme(AppColors.lightText, AppColors.lightMuted),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.lightBg,
        foregroundColor: AppColors.lightText,
        elevation: 0,
        titleTextStyle: GoogleFonts.shortStack(
          fontSize: 20,
          fontWeight: FontWeight.w400,
          color: AppColors.lightText,
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.lightCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(3),
          side: const BorderSide(color: AppColors.lightBorder, width: 3),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.lightCard,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(2),
          borderSide: const BorderSide(color: AppColors.lightBorder, width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(2),
          borderSide: const BorderSide(color: AppColors.lightBorder, width: 2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(2),
          borderSide: const BorderSide(color: AppColors.blue, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        hintStyle: GoogleFonts.shortStack(
          color: AppColors.lightMuted,
          fontSize: 14,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.blue,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(2),
            side: const BorderSide(color: AppColors.lightBorder, width: 2),
          ),
          textStyle: GoogleFonts.shortStack(
            fontSize: 16,
            fontWeight: FontWeight.w400,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.lightText,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(2),
          ),
          side: const BorderSide(color: AppColors.lightBorder, width: 2),
          textStyle: GoogleFonts.shortStack(
            fontSize: 16,
            fontWeight: FontWeight.w400,
          ),
        ),
      ),
      checkboxTheme: CheckboxThemeData(
        fillColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.lightCard;
          }
          return AppColors.lightCard;
        }),
        checkColor: WidgetStateProperty.all(AppColors.lightText),
        side: const BorderSide(color: AppColors.lightBorder, width: 2),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.lightBorder,
        thickness: 2,
      ),
      navigationRailTheme: NavigationRailThemeData(
        backgroundColor: AppColors.lightBg,
        selectedIconTheme: const IconThemeData(color: Colors.white),
        unselectedIconTheme: const IconThemeData(color: AppColors.lightBorder),
        indicatorColor: AppColors.blue,
        labelType: NavigationRailLabelType.none,
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.lightBg,
        selectedItemColor: AppColors.blue,
        unselectedItemColor: AppColors.lightMuted,
        selectedLabelStyle: GoogleFonts.shortStack(fontSize: 12),
        unselectedLabelStyle: GoogleFonts.shortStack(fontSize: 12),
      ),
    );
  }

  static ThemeData dark() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.darkBg,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.blue,
        secondary: AppColors.green,
        surface: AppColors.darkCard,
        error: AppColors.danger,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.darkText,
        onError: Colors.white,
      ),
      textTheme: _buildTextTheme(AppColors.darkText, AppColors.darkMuted),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.darkBg,
        foregroundColor: AppColors.darkText,
        elevation: 0,
        titleTextStyle: GoogleFonts.shortStack(
          fontSize: 20,
          fontWeight: FontWeight.w400,
          color: AppColors.darkText,
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(3),
          side: const BorderSide(color: AppColors.darkBorder, width: 3),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.darkCard,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(2),
          borderSide: const BorderSide(color: AppColors.darkBorder, width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(2),
          borderSide: const BorderSide(color: AppColors.darkBorder, width: 2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(2),
          borderSide: const BorderSide(color: AppColors.blue, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        hintStyle: GoogleFonts.shortStack(
          color: AppColors.darkMuted,
          fontSize: 14,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.blue,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(2),
            side: const BorderSide(color: AppColors.darkBorder, width: 2),
          ),
          textStyle: GoogleFonts.shortStack(
            fontSize: 16,
            fontWeight: FontWeight.w400,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.darkText,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(2),
          ),
          side: const BorderSide(color: AppColors.darkBorder, width: 2),
          textStyle: GoogleFonts.shortStack(
            fontSize: 16,
            fontWeight: FontWeight.w400,
          ),
        ),
      ),
      checkboxTheme: CheckboxThemeData(
        fillColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.darkCard;
          }
          return AppColors.darkCard;
        }),
        checkColor: WidgetStateProperty.all(AppColors.darkText),
        side: const BorderSide(color: AppColors.darkBorder, width: 2),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.darkBorder,
        thickness: 2,
      ),
      navigationRailTheme: NavigationRailThemeData(
        backgroundColor: AppColors.darkBg,
        selectedIconTheme: const IconThemeData(color: Colors.white),
        unselectedIconTheme: const IconThemeData(color: AppColors.darkBorder),
        indicatorColor: AppColors.blue,
        labelType: NavigationRailLabelType.none,
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.darkBg,
        selectedItemColor: AppColors.blue,
        unselectedItemColor: AppColors.darkMuted,
        selectedLabelStyle: GoogleFonts.shortStack(fontSize: 12),
        unselectedLabelStyle: GoogleFonts.shortStack(fontSize: 12),
      ),
    );
  }
}

// Extension for easy access to custom colors based on theme
extension ThemeColors on BuildContext {
  bool get isDark => Theme.of(this).brightness == Brightness.dark;
  
  Color get bgColor => isDark ? AppColors.darkBg : AppColors.lightBg;
  Color get cardColor => isDark ? AppColors.darkCard : AppColors.lightCard;
  Color get borderColor => isDark ? AppColors.darkBorder : AppColors.lightBorder;
  Color get textColor => isDark ? AppColors.darkText : AppColors.lightText;
  Color get mutedColor => isDark ? AppColors.darkMuted : AppColors.lightMuted;
  Color get hoverColor => isDark ? AppColors.darkHover : AppColors.lightHover;
  Color get taskBgColor => isDark ? AppColors.darkTaskBg : AppColors.lightTaskBg;
  Color get taskBgAltColor => isDark ? AppColors.darkTaskBgAlt : AppColors.lightTaskBgAlt;
}
