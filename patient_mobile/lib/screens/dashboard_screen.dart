import 'package:flutter/material.dart';
import '../api/api_service.dart';
import '../models/models.dart';
import 'auth/login_screen.dart';
import 'appointments_screen.dart';
import 'medical_records_screen.dart';
import 'billing_screen.dart';
import 'doctors_screen.dart';
import 'pharmacy_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  User? _currentUser;
  bool _isLoading = true;
  
  int _appointmentCount = 0;
  int _recordCount = 0;
  double _outstandingAmount = 0.0;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
    });

    final api = ApiService();
    final user = await api.getMe();

    if (user != null) {
      final appointments = await api.getAppointments();
      final records = await api.getMedicalRecords();
      final invoices = await api.getInvoices();

      // Calculate stats
      final now = DateTime.now();
      final upcoming = appointments.where((a) {
        try {
          final date = DateTime.parse(a.appointmentDate);
          return date.isAfter(now) || a.status == 'scheduled';
        } catch (_) {
          return a.status == 'scheduled';
        }
      }).length;

      final unpaidAmount = invoices
          .where((i) => i.status == 'unpaid')
          .fold(0.0, (sum, item) => sum + item.totalAmount);

      if (mounted) {
        setState(() {
          _currentUser = user;
          _appointmentCount = upcoming;
          _recordCount = records.length;
          _outstandingAmount = unpaidAmount;
          _isLoading = false;
        });
      }
    } else {
      // Token expired or invalid, go to login
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    }
  }

  Future<void> _handleLogout() async {
    await ApiService().clearAuth();
    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'MediTrack Patient',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Logout'),
                  content: const Text('Are you sure you want to log out?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _handleLogout();
                      },
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadDashboardData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Welcome Header Card
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [theme.primaryColor, theme.primaryColor.withOpacity(0.8)],
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: theme.primaryColor.withOpacity(0.2),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    )
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Welcome back,',
                      style: TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _currentUser?.fullName ?? 'Patient',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _currentUser?.email ?? '',
                      style: const TextStyle(color: Colors.white60, fontSize: 14),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Overview Header
              Text(
                'Overview',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 16),

              // Grid cards for stats
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.4,
                children: [
                  _buildStatCard(
                    context,
                    title: 'Appointments',
                    value: '$_appointmentCount scheduled',
                    icon: Icons.calendar_month,
                    color: theme.primaryColor,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const AppointmentsScreen()),
                      ).then((_) => _loadDashboardData());
                    },
                  ),
                  _buildStatCard(
                    context,
                    title: 'Medical Records',
                    value: '$_recordCount files',
                    icon: Icons.assignment_outlined,
                    color: const Color(0xFF1A936F), // Brand Secondary Green
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const MedicalRecordsScreen()),
                      );
                    },
                  ),
                  _buildStatCard(
                    context,
                    title: 'Outstanding Bills',
                    value: '₦${_outstandingAmount.toStringAsFixed(2)}',
                    icon: Icons.account_balance_wallet_outlined,
                    color: Colors.orange.shade800,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const BillingScreen()),
                      ).then((_) => _loadDashboardData());
                    },
                  ),
                  _buildStatCard(
                    context,
                    title: 'Available Doctors',
                    value: 'Directory',
                    icon: Icons.people_outline,
                    color: Colors.blue.shade600,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const DoctorsScreen()),
                      );
                    },
                  ),
                  _buildStatCard(
                    context,
                    title: 'Hospital Pharmacy',
                    value: 'Medications',
                    icon: Icons.local_pharmacy_outlined,
                    color: Colors.teal.shade700,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const PharmacyScreen()),
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.shade100,
              blurRadius: 6,
              offset: const Offset(0, 2),
            )
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(icon, color: color, size: 24),
                const Icon(Icons.chevron_right, color: Colors.grey, size: 16),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.black54,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    color: color,
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
