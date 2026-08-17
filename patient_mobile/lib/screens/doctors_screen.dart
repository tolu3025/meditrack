import 'package:flutter/material.dart';
import '../api/api_service.dart';
import '../models/models.dart';
import 'appointments_screen.dart';

class DoctorsScreen extends StatefulWidget {
  const DoctorsScreen({super.key});

  @override
  State<DoctorsScreen> createState() => _DoctorsScreenState();
}

class _DoctorsScreenState extends State<DoctorsScreen> {
  List<DoctorProfile> _doctors = [];
  List<DoctorProfile> _filteredDoctors = [];
  bool _isLoading = true;
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadDoctors();
  }

  Future<void> _loadDoctors() async {
    setState(() => _isLoading = true);
    final doctors = await ApiService().getDoctors();
    if (mounted) {
      setState(() {
        _doctors = doctors;
        _filteredDoctors = doctors;
        _isLoading = false;
      });
    }
  }

  void _filterDoctors(String query) {
    setState(() {
      _filteredDoctors = _doctors.where((doc) {
        final name = doc.user?.fullName.toLowerCase() ?? '';
        final spec = doc.specialization.toLowerCase();
        final search = query.toLowerCase();
        return name.contains(search) || spec.contains(search);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Available Doctors'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Search Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
                  child: TextField(
                    controller: _searchController,
                    onChanged: _filterDoctors,
                    decoration: InputDecoration(
                      hintText: 'Search doctors or specialities...',
                      prefixIcon: const Icon(Icons.search),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear),
                              onPressed: () {
                                _searchController.clear();
                                _filterDoctors('');
                              },
                            )
                          : null,
                    ),
                  ),
                ),

                // Doctors List
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadDoctors,
                    child: _filteredDoctors.isEmpty
                        ? const Center(child: Text('No doctors match your search.'))
                        : ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                            itemCount: _filteredDoctors.length,
                            itemBuilder: (context, index) {
                              final doc = _filteredDoctors[index];
                              return _buildDoctorCard(doc, theme);
                            },
                          ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildDoctorCard(DoctorProfile doc, ThemeData theme) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade100),
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
        children: [
          Row(
            children: [
              // Avatar
              CircleAvatar(
                backgroundColor: theme.primaryColor.withOpacity(0.1),
                radius: 26,
                child: Text(
                  doc.user != null ? '${doc.user!.firstName[0]}${doc.user!.lastName[0]}' : 'DR',
                  style: TextStyle(
                    color: theme.primaryColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Dr. ${doc.user?.fullName ?? "Unknown Doctor"}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      doc.specialization,
                      style: const TextStyle(
                        color: Colors.teal,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
          const Divider(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'CONSULTATION FEE',
                    style: TextStyle(color: Colors.black45, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '₦${doc.consultationFee.toStringAsFixed(2)}',
                    style: const TextStyle(
                      color: Colors.black87,
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () {
                  // Direct to appointment page or show booking trigger
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const AppointmentsScreen()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                ),
                icon: const Icon(Icons.calendar_month, size: 16),
                label: const Text('Book', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              )
            ],
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
