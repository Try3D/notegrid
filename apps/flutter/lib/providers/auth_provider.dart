import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../services/storage_service.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  final StorageService _storage;
  String? _uuid;
  bool _isLoading = false;
  String? _error;

  AuthProvider(this._storage) {
    _uuid = _storage.getUUID();
  }

  String? get uuid => _uuid;
  bool get isLoggedIn => _uuid != null;
  bool get isLoading => _isLoading;
  String? get error => _error;

  String generateUUID() {
    return const Uuid().v4();
  }

  bool isValidUUID(String value) {
    final regex = RegExp(
      r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
      caseSensitive: false,
    );
    return regex.hasMatch(value);
  }

  Future<bool> register(String newUUID) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final api = ApiService(uuid: newUUID);
      final success = await api.register(newUUID);
      if (success) {
        _uuid = newUUID;
        await _storage.setUUID(newUUID);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = 'Failed to register. Please try again.';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Failed to connect. Please try again.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> login(String code) async {
    if (!isValidUUID(code)) {
      _error = 'Invalid code format. Please check and try again.';
      notifyListeners();
      return false;
    }

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final api = ApiService(uuid: code);
      final exists = await api.checkExists(code);
      
      if (!exists) {
        await api.register(code);
      }

      _uuid = code;
      await _storage.setUUID(code);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = 'Failed to connect. Please try again.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _uuid = null;
    await _storage.clearUUID();
    await _storage.clearCachedData();
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
