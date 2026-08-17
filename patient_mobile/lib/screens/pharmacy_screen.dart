import 'package:flutter/material.dart';
import '../api/api_service.dart';
import '../models/models.dart';

class PharmacyScreen extends StatefulWidget {
  const PharmacyScreen({super.key});

  @override
  State<PharmacyScreen> createState() => _PharmacyScreenState();
}

class _PharmacyScreenState extends State<PharmacyScreen> {
  List<Medication> _medications = [];
  List<Medication> _filteredMedications = [];
  bool _isLoading = true;
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadMedications();
  }

  Future<void> _loadMedications() async {
    setState(() => _isLoading = true);
    final meds = await ApiService().getMedications();
    if (mounted) {
      setState(() {
        _medications = meds;
        _filteredMedications = meds;
        _isLoading = false;
      });
    }
  }

  void _filterMedications(String query) {
    setState(() {
      _filteredMedications = _medications.where((med) {
        final name = med.name.toLowerCase();
        final generic = med.genericName.toLowerCase();
        final cat = med.category.toLowerCase();
        final search = query.toLowerCase();
        return name.contains(search) || generic.contains(search) || cat.contains(search);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hospital Pharmacy'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Active Pharmacist Header Card
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: theme.primaryColor.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: theme.primaryColor.withOpacity(0.1)),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.person_pin, color: theme.primaryColor, size: 40),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Pharmacist on Duty',
                              style: TextStyle(fontSize: 12, color: Colors.black54, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Pharm. Chioma Umeh',
                              style: TextStyle(fontSize: 15, color: Colors.black87, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'License: PCN-2021-9871 | Morning Shift',
                              style: TextStyle(fontSize: 11, color: Colors.black54),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),

                // Search Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 6.0),
                  child: TextField(
                    controller: _searchController,
                    onChanged: _filterMedications,
                    decoration: InputDecoration(
                      hintText: 'Search medications by name or category...',
                      prefixIcon: const Icon(Icons.search),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear),
                              onPressed: () {
                                _searchController.clear();
                                _filterMedications('');
                              },
                            )
                          : null,
                    ),
                  ),
                ),

                // Medications List
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadMedications,
                    child: _filteredMedications.isEmpty
                        ? const Center(child: Text('No medications match your search.'))
                        : ListView.builder(
                            padding: const EdgeInsets.all(20),
                            itemCount: _filteredMedications.length,
                            itemBuilder: (context, index) {
                              final med = _filteredMedications[index];
                              return _buildMedicationCard(med, theme);
                            },
                          ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildMedicationCard(Medication med, ThemeData theme) {
    final isLowStock = med.stockQuantity <= med.reorderLevel;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
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
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  med.name,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.black87),
                ),
                Text(
                  'Generic: ${med.genericName}',
                  style: const TextStyle(fontSize: 12, color: Colors.black54),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        med.category,
                        style: const TextStyle(fontSize: 10, color: Colors.black54, fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: isLowStock ? Colors.orange.shade50 : Colors.green.shade50,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        isLowStock ? 'LOW STOCK (${med.stockQuantity})' : 'IN STOCK (${med.stockQuantity})',
                        style: TextStyle(
                          fontSize: 10,
                          color: isLowStock ? Colors.orange.shade800 : Colors.green.shade800,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                )
              ],
            ),
          ),
          const SizedBox(width: 12),
          Text(
            '₦${med.unitPrice.toStringAsFixed(2)}',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: theme.primaryColor),
          )
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
