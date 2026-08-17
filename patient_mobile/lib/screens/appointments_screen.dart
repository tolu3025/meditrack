import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../api/api_service.dart';
import '../models/models.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  List<Appointment> _appointments = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    setState(() => _isLoading = true);
    final appointments = await ApiService().getAppointments();
    if (mounted) {
      setState(() {
        _appointments = appointments;
        _isLoading = false;
      });
    }
  }

  void _showBookSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => const BookAppointmentSheet(),
    ).then((booked) {
      if (booked == true) {
        _loadAppointments();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Appointment booked successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Appointments'),
      ),
      body: RefreshIndicator(
        onRefresh: _loadAppointments,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _appointments.isEmpty
                ? const Center(
                    child: Text('No appointments found. Tap + to book one.'),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: _appointments.length,
                    itemBuilder: (context, index) {
                      final appt = _appointments[index];
                      return _buildAppointmentCard(appt, theme);
                    },
                  ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showBookSheet,
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildAppointmentCard(Appointment appt, ThemeData theme) {
    Color statusColor = Colors.grey;
    if (appt.status == 'scheduled') statusColor = Colors.blue;
    if (appt.status == 'completed') statusColor = Colors.green;
    if (appt.status == 'cancelled') statusColor = Colors.red;

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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Dr. ${appt.doctor?.user?.fullName ?? "Unknown Doctor"}',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  appt.status.toUpperCase(),
                  style: TextStyle(
                    color: statusColor,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            appt.doctor?.specialization ?? 'General Practitioner',
            style: const TextStyle(color: Colors.black54, fontSize: 13),
          ),
          const Divider(height: 24),
          Row(
            children: [
              Icon(Icons.calendar_today_outlined, size: 16, color: theme.primaryColor),
              const SizedBox(width: 8),
              Text(
                appt.appointmentDate,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
              ),
              const SizedBox(width: 20),
              Icon(Icons.access_time_outlined, size: 16, color: theme.primaryColor),
              const SizedBox(width: 8),
              Text(
                '${appt.startTime} - ${appt.endTime}',
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
              ),
            ],
          ),
          if (appt.reason != null && appt.reason!.isNotEmpty) ...[
            const SizedBox(height: 12),
            Text(
              'Reason: ${appt.reason}',
              style: const TextStyle(color: Colors.black54, fontSize: 12),
            ),
          ],
        ],
      ),
    );
  }
}

class BookAppointmentSheet extends StatefulWidget {
  const BookAppointmentSheet({super.key});

  @override
  State<BookAppointmentSheet> createState() => _BookAppointmentSheetState();
}

class _BookAppointmentSheetState extends State<BookAppointmentSheet> {
  final _formKey = GlobalKey<FormState>();
  final _dateController = TextEditingController();
  final _reasonController = TextEditingController();

  List<DoctorProfile> _doctors = [];
  DoctorProfile? _selectedDoctor;
  String _selectedTime = '09:00';
  bool _isLoadingDoctors = true;
  bool _isBooking = false;

  final List<String> _timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', 
    '16:00', '16:30'
  ];

  @override
  void initState() {
    super.initState();
    _fetchDoctors();
  }

  Future<void> _fetchDoctors() async {
    final list = await ApiService().getDoctors();
    if (mounted) {
      setState(() {
        _doctors = list;
        if (list.isNotEmpty) _selectedDoctor = list[0];
        _isLoadingDoctors = false;
      });
    }
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (picked != null) {
      setState(() {
        _dateController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  Future<void> _submitBooking() async {
    if (!_formKey.currentState!.validate() || _selectedDoctor == null) return;

    setState(() => _isBooking = true);

    final result = await ApiService().bookAppointment(
      doctorId: _selectedDoctor!.id,
      date: _dateController.text.trim(),
      startTime: _selectedTime,
      reason: _reasonController.text.trim(),
    );

    if (mounted) {
      setState(() => _isBooking = false);
      if (result['success'] == true) {
        Navigator.pop(context, true);
      } else {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Booking Error'),
            content: Text(result['message'] ?? 'Failed to book appointment.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('OK'),
              )
            ],
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        top: 24,
        left: 24,
        right: 24,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Book Appointment',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (_isLoadingDoctors)
              const Center(child: CircularProgressIndicator())
            else ...[
              // Doctor Selection
              DropdownButtonFormField<DoctorProfile>(
                value: _selectedDoctor,
                decoration: const InputDecoration(labelText: 'Select Doctor'),
                items: _doctors.map((doc) {
                  return DropdownMenuItem(
                    value: doc,
                    child: Text('Dr. ${doc.user?.fullName ?? "Doctor"} (${doc.specialization})'),
                  );
                }).toList(),
                onChanged: (val) {
                  setState(() => _selectedDoctor = val);
                },
              ),
              const SizedBox(height: 16),

              // Date Selection
              TextFormField(
                controller: _dateController,
                readOnly: true,
                onTap: _selectDate,
                decoration: const InputDecoration(
                  labelText: 'Select Date',
                  suffixIcon: Icon(Icons.calendar_today),
                ),
                validator: (v) => v!.isEmpty ? 'Date is required' : null,
              ),
              const SizedBox(height: 16),

              // Time Selection
              DropdownButtonFormField<String>(
                value: _selectedTime,
                decoration: const InputDecoration(labelText: 'Select Time Slot'),
                items: _timeSlots.map((time) {
                  return DropdownMenuItem(
                    value: time,
                    child: Text(time),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedTime = val);
                },
              ),
              const SizedBox(height: 16),

              // Reason
              TextFormField(
                controller: _reasonController,
                decoration: const InputDecoration(labelText: 'Reason for Appointment'),
                maxLines: 2,
                validator: (v) => v!.trim().isEmpty ? 'Reason is required' : null,
              ),
              const SizedBox(height: 24),

              // Submit Button
              ElevatedButton(
                onPressed: _isBooking ? null : _submitBooking,
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.primaryColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: _isBooking
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation(Colors.white),
                        ),
                      )
                    : const Text(
                        'Confirm Appointment',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
              ),
            ]
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _dateController.dispose();
    _reasonController.dispose();
    super.dispose();
  }
}
