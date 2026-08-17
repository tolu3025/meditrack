import 'package:flutter/material.dart';
import '../api/api_service.dart';
import '../models/models.dart';

class MedicalRecordsScreen extends StatefulWidget {
  const MedicalRecordsScreen({super.key});

  @override
  State<MedicalRecordsScreen> createState() => _MedicalRecordsScreenState();
}

class _MedicalRecordsScreenState extends State<MedicalRecordsScreen> {
  List<MedicalRecord> _records = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadRecords();
  }

  Future<void> _loadRecords() async {
    setState(() => _isLoading = true);
    final records = await ApiService().getMedicalRecords();
    if (mounted) {
      setState(() {
        _records = records;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Medical History'),
      ),
      body: RefreshIndicator(
        onRefresh: _loadRecords,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _records.isEmpty
                ? const Center(child: Text('No medical records found.'))
                : ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: _records.length,
                    itemBuilder: (context, index) {
                      final record = _records[index];
                      return _buildRecordCard(record, theme);
                    },
                  ),
      ),
    );
  }

  Widget _buildRecordCard(MedicalRecord record, ThemeData theme) {
    // Format Date string
    String formattedDate = record.createdAt;
    try {
      final date = DateTime.parse(record.createdAt);
      formattedDate = '${date.day}/${date.month}/${date.year}';
    } catch (_) {}

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  record.diagnosis,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ),
              Text(
                formattedDate,
                style: const TextStyle(color: Colors.black45, fontSize: 13),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Dr. ${record.doctor?.user?.fullName ?? "Doctor"} (${record.doctor?.specialization ?? "Cardiologist"})',
            style: const TextStyle(
              color: Colors.teal,
              fontWeight: FontWeight.w500,
              fontSize: 13,
            ),
          ),
          const Divider(height: 24),
          
          if (record.symptoms != null && record.symptoms!.isNotEmpty) ...[
            const Text(
              'Symptoms',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black54),
            ),
            const SizedBox(height: 4),
            Text(
              record.symptoms!,
              style: const TextStyle(fontSize: 13, color: Colors.black87),
            ),
            const SizedBox(height: 16),
          ],

          if (record.notes != null && record.notes!.isNotEmpty) ...[
            const Text(
              'Doctor\'s Notes',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black54),
            ),
            const SizedBox(height: 4),
            Text(
              record.notes!,
              style: const TextStyle(fontSize: 13, color: Colors.black87, fontStyle: FontStyle.italic),
            ),
            const SizedBox(height: 16),
          ],

          // Attached Prescription Details
          if (record.prescription != null) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.shade50.withOpacity(0.4),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.blue.shade100.withOpacity(0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.medical_information_outlined, color: Colors.blue, size: 18),
                          SizedBox(width: 8),
                          Text(
                            'Prescription',
                            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue, fontSize: 13),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: record.prescription!.status == 'dispensed'
                              ? Colors.green.shade50
                              : Colors.orange.shade50,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          record.prescription!.status.toUpperCase(),
                          style: TextStyle(
                            color: record.prescription!.status == 'dispensed'
                                ? Colors.green.shade800
                                : Colors.orange.shade800,
                            fontWeight: FontWeight.bold,
                            fontSize: 9,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ...record.prescription!.items.map((item) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.circle, size: 6, color: Colors.blue),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${item.medicationName} (${item.dosage})',
                                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
                                ),
                                Text(
                                  'Take ${item.frequency} for ${item.duration} (Qty: ${item.quantity})',
                                  style: const TextStyle(color: Colors.black54, fontSize: 11),
                                ),
                                if (item.instructions != null && item.instructions!.isNotEmpty)
                                  Text(
                                    'Instructions: ${item.instructions}',
                                    style: const TextStyle(color: Colors.black45, fontSize: 11, fontStyle: FontStyle.italic),
                                  ),
                              ],
                            ),
                          )
                        ],
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
