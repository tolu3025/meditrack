import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';

class ApiService {
  static const String baseUrl = 'https://meditrack-i1p8.onrender.com/api';
  
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  String? _token;

  Future<String?> getToken() async {
    if (_token != null) return _token;
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('accessToken');
    return _token;
  }

  Future<void> saveTokens(String accessToken, String refreshToken) async {
    _token = accessToken;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', accessToken);
    await prefs.setString('refreshToken', refreshToken);
  }

  Future<void> clearAuth() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('accessToken');
    await prefs.remove('refreshToken');
    await prefs.remove('patientProfileId');
  }

  Map<String, String> _headers(String? token) {
    final headers = {'Content-Type': 'application/json'};
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // Auth Operations
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: _headers(null),
        body: jsonEncode({'email': email, 'password': password}),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        final data = body['data'];
        final userRole = data['user']['role'];
        
        if (userRole != 'patient') {
          return {'success': false, 'message': 'Access denied. This app is only for patients.'};
        }

        await saveTokens(data['accessToken'], data['refreshToken']);
        
        final prefs = await SharedPreferences.getInstance();
        if (data['user']['profile_id'] != null) {
          await prefs.setInt('patientProfileId', data['user']['profile_id'] as int);
        }
        
        return {'success': true, 'user': User.fromJson(data['user'])};
      }
      return {'success': false, 'message': body['message'] ?? 'Login failed.'};
    } catch (e) {
      return {'success': false, 'message': 'Network error: Please check your connection.'};
    }
  }

  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String phone,
    required String dob,
    required String gender,
    required String bloodGroup,
    required String address,
    required String emergencyName,
    required String emergencyPhone,
  }) async {
    try {
      final registerData = {
        'email': email,
        'password': password,
        'role': 'patient',
        'first_name': firstName,
        'last_name': lastName,
        'phone': phone,
        'date_of_birth': dob,
        'gender': gender,
        'blood_group': bloodGroup,
        'address': address,
        'emergency_contact_name': emergencyName,
        'emergency_contact_phone': emergencyPhone,
      };

      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: _headers(null),
        body: jsonEncode(registerData),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 201 && body['success'] == true) {
        final data = body['data'];
        await saveTokens(data['accessToken'], data['refreshToken']);
        return {'success': true, 'user': User.fromJson(data['user'])};
      }
      return {'success': false, 'message': body['message'] ?? 'Registration failed.'};
    } catch (e) {
      return {'success': false, 'message': 'Network error: Please check your connection.'};
    }
  }

  Future<User?> getMe() async {
    try {
      final token = await getToken();
      if (token == null) return null;

      final response = await http.get(
        Uri.parse('$baseUrl/auth/me'),
        headers: _headers(token),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        return User.fromJson(body['data']);
      }
    } catch (e) {
      // Ignore and return null
    }
    return null;
  }

  // Doctor List (For booking appointments)
  Future<List<DoctorProfile>> getDoctors() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/doctors'),
        headers: _headers(token),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        final List list = body['data'] ?? [];
        return list.map((d) => DoctorProfile.fromJson(d)).toList();
      }
    } catch (e) {
      print('Error getting doctors: $e');
    }
    return [];
  }

  // Appointments
  Future<List<Appointment>> getAppointments() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/appointments'),
        headers: _headers(token),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        final List list = body['data'] ?? [];
        return list.map((a) => Appointment.fromJson(a)).toList();
      }
    } catch (e) {
      print('Error getting appointments: $e');
    }
    return [];
  }

  Future<Map<String, dynamic>> bookAppointment({
    required int doctorId,
    required String date,
    required String startTime,
    required String reason,
  }) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('$baseUrl/appointments'),
        headers: _headers(token),
        body: jsonEncode({
          'doctor_id': doctorId,
          'appointment_date': date,
          'start_time': startTime,
          'end_time': _calculateEndTime(startTime),
          'reason': reason,
        }),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 201 && body['success'] == true) {
        return {'success': true, 'data': Appointment.fromJson(body['data'])};
      }
      return {'success': false, 'message': body['message'] ?? 'Booking failed.'};
    } catch (e) {
      return {'success': false, 'message': 'Network error: Failed to book appointment.'};
    }
  }

  String _calculateEndTime(String startTime) {
    try {
      final parts = startTime.split(':');
      int hour = int.parse(parts[0]);
      int minute = int.parse(parts[1]) + 30;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
      final hrStr = hour.toString().padLeft(2, '0');
      final minStr = minute.toString().padLeft(2, '0');
      return '$hrStr:$minStr';
    } catch (e) {
      return startTime; // Fallback
    }
  }

  // Medical Records
  Future<List<MedicalRecord>> getMedicalRecords() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/medical-records'),
        headers: _headers(token),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        final List list = body['data'] ?? [];
        return list.map((r) => MedicalRecord.fromJson(r)).toList();
      }
    } catch (e) {
      print('Error getting records: $e');
    }
    return [];
  }

  // Invoices (Billing)
  Future<List<Invoice>> getInvoices() async {
    try {
      final token = await getToken();
      final prefs = await SharedPreferences.getInstance();
      final patientId = prefs.getInt('patientProfileId');
      
      if (patientId == null) {
        // Fallback: get current patient profile details to retrieve patient ID
        final me = await getMe();
        if (me == null) return [];
      }

      final targetPatientId = patientId ?? await _fetchAndCachePatientId(token!);
      if (targetPatientId == null) return [];

      final response = await http.get(
        Uri.parse('$baseUrl/billing/patient/$targetPatientId'),
        headers: _headers(token),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        final rawData = body['data'];
        List list = [];
        if (rawData is List) {
          list = rawData;
        } else if (rawData is Map && rawData['invoices'] != null) {
          list = rawData['invoices'];
        }
        return list.map((i) => Invoice.fromJson(i)).toList();
      }
    } catch (e) {
      print('Error getting invoices: $e');
    }
    return [];
  }

  Future<int?> _fetchAndCachePatientId(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/me'),
        headers: _headers(token),
      );
      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        final profile = body['data']['patient_profile'];
        if (profile != null) {
          final id = profile['id'] as int;
          final prefs = await SharedPreferences.getInstance();
          await prefs.setInt('patientProfileId', id);
          return id;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>> payInvoice(int invoiceId) async {
    try {
      final token = await getToken();
      final response = await http.put(
        Uri.parse('$baseUrl/billing/invoices/$invoiceId/pay'),
        headers: _headers(token),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        return {'success': true};
      }
      return {'success': false, 'message': body['message'] ?? 'Payment failed.'};
    } catch (e) {
      return {'success': false, 'message': 'Network error: Failed to process payment.'};
    }
  }

  // Pharmacy / Medications Stock
  Future<List<Medication>> getMedications() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/medications'),
        headers: _headers(token),
      );

      final body = jsonDecode(response.body);
      if (response.statusCode == 200 && body['success'] == true) {
        final List list = body['data'] ?? [];
        return list.map((m) => Medication.fromJson(m)).toList();
      }
    } catch (e) {
      print('Error getting medications: $e');
    }
    return [];
  }
}
