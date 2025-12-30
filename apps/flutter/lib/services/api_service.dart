import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_data.dart';

class ApiService {
  // Use your machine's IP for mobile/emulator access
  // Change to 'http://localhost:8787' for web or 'http://10.0.2.2:8787' for Android emulator
  static const String baseUrl = 'https://eisenhower-api.rsarans186.workers.dev';

  final String? uuid;

  ApiService({this.uuid});

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (uuid != null) 'Authorization': 'Bearer $uuid',
      };

  Future<bool> checkExists(String uuid) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/exists/$uuid'),
        headers: _headers,
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data']?['exists'] == true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<bool> register(String uuid) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'uuid': uuid}),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['success'] == true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<UserData?> fetchData() async {
    if (uuid == null) return null;
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/data'),
        headers: _headers,
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['data'] != null) {
          return UserData.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<bool> saveData(UserData data) async {
    if (uuid == null) return false;
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/data'),
        headers: _headers,
        body: jsonEncode(data.toJson()),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<bool> deleteAccount() async {
    if (uuid == null) return false;
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/data'),
        headers: _headers,
        body: jsonEncode({
          'tasks': [],
          'links': [],
          'deleted': true,
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
