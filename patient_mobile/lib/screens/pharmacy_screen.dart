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

    return GestureDetector(
      onTap: () => _confirmPurchase(med),
      child: Container(
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
      ),
    );
  }

  void _confirmPurchase(Medication med) {
    int quantity = 1;
    final theme = Theme.of(context);
    
    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final totalCost = med.unitPrice * quantity;
            return AlertDialog(
              title: Text('Purchase ${med.name}'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Generic Name: ${med.genericName}'),
                  const SizedBox(height: 8),
                  Text('Price: ₦${med.unitPrice.toStringAsFixed(2)} per unit'),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Quantity:', style: TextStyle(fontWeight: FontWeight.bold)),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove_circle_outline),
                            onPressed: quantity > 1
                                ? () => setModalState(() => quantity--)
                                : null,
                          ),
                          Text('$quantity', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          IconButton(
                            icon: const Icon(Icons.add_circle_outline),
                            onPressed: quantity < med.stockQuantity
                                ? () => setModalState(() => quantity++)
                                : null,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total Cost:', style: TextStyle(fontWeight: FontWeight.bold)),
                      Text(
                        '₦${totalCost.toStringAsFixed(2)}',
                        style: TextStyle(
                          color: theme.primaryColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: med.stockQuantity == 0
                      ? null
                      : () {
                          Navigator.pop(context);
                          _processPurchase(med, quantity);
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.primaryColor,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('Confirm Purchase'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _processPurchase(Medication med, int quantity) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: Card(
          child: Padding(
            padding: EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 16),
                Text('Dispensing medication...', style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ),
      ),
    );

    // Wait a brief moment to simulate transaction processing
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      Navigator.pop(context); // Dismiss loading dialog
      
      // Update local state (deduct stock quantity)
      setState(() {
        final index = _medications.indexWhere((m) => m.id == med.id);
        if (index != -1) {
          final oldMed = _medications[index];
          _medications[index] = Medication(
            id: oldMed.id,
            name: oldMed.name,
            genericName: oldMed.genericName,
            category: oldMed.category,
            stockQuantity: oldMed.stockQuantity - quantity,
            unitPrice: oldMed.unitPrice,
            reorderLevel: oldMed.reorderLevel,
            supplier: oldMed.supplier,
          );
          _filterMedications(_searchController.text);
        }
      });

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green),
              SizedBox(width: 8),
              Text('Purchase Successful'),
            ],
          ),
          content: Text(
            'You have successfully purchased $quantity units of ${med.name}.\nTotal cost: ₦${(med.unitPrice * quantity).toStringAsFixed(2)}\n\nYour prescription and payment receipt has been settled.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        ),
      );
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
