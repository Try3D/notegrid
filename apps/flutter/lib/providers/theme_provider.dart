import 'package:flutter/material.dart';
import '../services/storage_service.dart';

class ThemeProvider extends ChangeNotifier {
  final StorageService _storage;
  bool _isDark;

  ThemeProvider(this._storage) : _isDark = _storage.isDarkMode();

  bool get isDark => _isDark;

  ThemeMode get themeMode => _isDark ? ThemeMode.dark : ThemeMode.light;

  void toggleTheme() {
    _isDark = !_isDark;
    _storage.setDarkMode(_isDark);
    notifyListeners();
  }
}
