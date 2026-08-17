class User {
  final int? id;
  final String? email;
  final String? role;
  final String firstName;
  final String lastName;
  final String? phone;
  final int? departmentId;

  User({
    this.id,
    this.email,
    this.role,
    required this.firstName,
    required this.lastName,
    this.phone,
    this.departmentId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int?,
      email: json['email'] as String?,
      role: json['role'] as String?,
      firstName: json['first_name'] as String? ?? '',
      lastName: json['last_name'] as String? ?? '',
      phone: json['phone'] as String?,
      departmentId: json['department_id'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'role': role,
      'first_name': firstName,
      'last_name': lastName,
      'phone': phone,
      'department_id': departmentId,
    };
  }

  String get fullName => '$firstName $lastName';
}

class PatientProfile {
  final int id;
  final int userId;
  final String? dateOfBirth;
  final String? gender;
  final String? bloodGroup;
  final String? address;
  final String? emergencyContactName;
  final String? emergencyContactPhone;
  final String? medicalHistorySummary;
  final User? user;

  PatientProfile({
    required this.id,
    required this.userId,
    this.dateOfBirth,
    this.gender,
    this.bloodGroup,
    this.address,
    this.emergencyContactName,
    this.emergencyContactPhone,
    this.medicalHistorySummary,
    this.user,
  });

  factory PatientProfile.fromJson(Map<String, dynamic> json) {
    return PatientProfile(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      dateOfBirth: json['date_of_birth'] as String?,
      gender: json['gender'] as String?,
      bloodGroup: json['blood_group'] as String?,
      address: json['address'] as String?,
      emergencyContactName: json['emergency_contact_name'] as String?,
      emergencyContactPhone: json['emergency_contact_phone'] as String?,
      medicalHistorySummary: json['medical_history_summary'] as String?,
      user: json['user'] != null ? User.fromJson(json['user']) : null,
    );
  }
}

class DoctorProfile {
  final int id;
  final int userId;
  final String specialization;
  final String licenseNumber;
  final double consultationFee;
  final User? user;
  final String? departmentName;

  DoctorProfile({
    required this.id,
    required this.userId,
    required this.specialization,
    required this.licenseNumber,
    required this.consultationFee,
    this.user,
    this.departmentName,
  });

  factory DoctorProfile.fromJson(Map<String, dynamic> json) {
    String? deptName;
    if (json['department'] != null) {
      deptName = json['department']['name'] as String?;
    }
    return DoctorProfile(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      specialization: json['specialization'] as String? ?? 'General Practitioner',
      licenseNumber: json['license_number'] as String? ?? '',
      consultationFee: double.tryParse(json['consultation_fee']?.toString() ?? '0') ?? 0.0,
      user: json['user'] != null ? User.fromJson(json['user']) : null,
      departmentName: deptName,
    );
  }
}

class Appointment {
  final int id;
  final int patientId;
  final int doctorId;
  final String appointmentDate;
  final String startTime;
  final String endTime;
  final String status;
  final String? reason;
  final String? notes;
  final DoctorProfile? doctor;

  Appointment({
    required this.id,
    required this.patientId,
    required this.doctorId,
    required this.appointmentDate,
    required this.startTime,
    required this.endTime,
    required this.status,
    this.reason,
    this.notes,
    this.doctor,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id'] as int,
      patientId: json['patient_id'] as int,
      doctorId: json['doctor_id'] as int,
      appointmentDate: json['appointment_date'] as String,
      startTime: json['start_time'] as String,
      endTime: json['end_time'] as String,
      status: json['status'] as String? ?? 'scheduled',
      reason: json['reason'] as String?,
      notes: json['notes'] as String?,
      doctor: json['doctor'] != null ? DoctorProfile.fromJson(json['doctor']) : null,
    );
  }
}

class PrescriptionItem {
  final int id;
  final int prescriptionId;
  final int? medicationId;
  final String medicationName;
  final String dosage;
  final String frequency;
  final String duration;
  final int quantity;
  final String? instructions;

  PrescriptionItem({
    required this.id,
    required this.prescriptionId,
    this.medicationId,
    required this.medicationName,
    required this.dosage,
    required this.frequency,
    required this.duration,
    required this.quantity,
    this.instructions,
  });

  factory PrescriptionItem.fromJson(Map<String, dynamic> json) {
    return PrescriptionItem(
      id: json['id'] as int,
      prescriptionId: json['prescription_id'] as int,
      medicationId: json['medication_id'] as int?,
      medicationName: json['medication_name'] as String? ?? '',
      dosage: json['dosage'] as String? ?? '',
      frequency: json['frequency'] as String? ?? '',
      duration: json['duration'] as String? ?? '',
      quantity: json['quantity'] as int? ?? 1,
      instructions: json['instructions'] as String?,
    );
  }
}

class Prescription {
  final int id;
  final int? medicalRecordId;
  final int doctorId;
  final int patientId;
  final String status;
  final String createdAt;
  final DoctorProfile? doctor;
  final List<PrescriptionItem> items;

  Prescription({
    required this.id,
    this.medicalRecordId,
    required this.doctorId,
    required this.patientId,
    required this.status,
    required this.createdAt,
    this.doctor,
    required this.items,
  });

  factory Prescription.fromJson(Map<String, dynamic> json) {
    var list = json['items'] as List? ?? [];
    List<PrescriptionItem> itemsList = list.map((i) => PrescriptionItem.fromJson(i)).toList();

    return Prescription(
      id: json['id'] as int,
      medicalRecordId: json['medical_record_id'] as int?,
      doctorId: json['doctor_id'] as int,
      patientId: json['patient_id'] as int,
      status: json['status'] as String? ?? 'pending',
      createdAt: json['created_at'] as String,
      doctor: json['doctor'] != null ? DoctorProfile.fromJson(json['doctor']) : null,
      items: itemsList,
    );
  }
}

class MedicalRecord {
  final int id;
  final int patientId;
  final int doctorId;
  final int? appointmentId;
  final String diagnosis;
  final String? symptoms;
  final String? notes;
  final String createdAt;
  final DoctorProfile? doctor;
  final Prescription? prescription;

  MedicalRecord({
    required this.id,
    required this.patientId,
    required this.doctorId,
    this.appointmentId,
    required this.diagnosis,
    this.symptoms,
    this.notes,
    required this.createdAt,
    this.doctor,
    this.prescription,
  });

  factory MedicalRecord.fromJson(Map<String, dynamic> json) {
    return MedicalRecord(
      id: json['id'] as int,
      patientId: json['patient_id'] as int,
      doctorId: json['doctor_id'] as int,
      appointmentId: json['appointment_id'] as int?,
      diagnosis: json['diagnosis'] as String? ?? '',
      symptoms: json['symptoms'] as String?,
      notes: json['notes'] as String?,
      createdAt: json['created_at'] as String,
      doctor: json['doctor'] != null ? DoctorProfile.fromJson(json['doctor']) : null,
      prescription: json['prescription'] != null ? Prescription.fromJson(json['prescription']) : null,
    );
  }
}

class InvoiceItem {
  final int id;
  final int invoiceId;
  final String description;
  final int quantity;
  final double unitPrice;
  final double lineTotal;

  InvoiceItem({
    required this.id,
    required this.invoiceId,
    required this.description,
    required this.quantity,
    required this.unitPrice,
    required this.lineTotal,
  });

  factory InvoiceItem.fromJson(Map<String, dynamic> json) {
    return InvoiceItem(
      id: json['id'] as int,
      invoiceId: json['invoice_id'] as int,
      description: json['description'] as String? ?? '',
      quantity: json['quantity'] as int? ?? 1,
      unitPrice: double.tryParse(json['unit_price']?.toString() ?? '0') ?? 0.0,
      lineTotal: double.tryParse(json['line_total']?.toString() ?? '0') ?? 0.0,
    );
  }
}

class Invoice {
  final int id;
  final int patientId;
  final int? appointmentId;
  final int? prescriptionId;
  final String invoiceNumber;
  final double amount;
  final double tax;
  final double totalAmount;
  final String status;
  final String? paymentDate;
  final String dueDate;
  final String createdAt;
  final List<InvoiceItem> items;

  Invoice({
    required this.id,
    required this.patientId,
    this.appointmentId,
    this.prescriptionId,
    required this.invoiceNumber,
    required this.amount,
    required this.tax,
    required this.totalAmount,
    required this.status,
    this.paymentDate,
    required this.dueDate,
    required this.createdAt,
    required this.items,
  });

  factory Invoice.fromJson(Map<String, dynamic> json) {
    var list = json['items'] as List? ?? [];
    List<InvoiceItem> itemsList = list.map((i) => InvoiceItem.fromJson(i)).toList();

    return Invoice(
      id: json['id'] as int,
      patientId: json['patient_id'] as int,
      appointmentId: json['appointment_id'] as int?,
      prescriptionId: json['prescription_id'] as int?,
      invoiceNumber: json['invoice_number'] as String? ?? '',
      amount: double.tryParse(json['amount']?.toString() ?? '0') ?? 0.0,
      tax: double.tryParse(json['tax']?.toString() ?? '0') ?? 0.0,
      totalAmount: double.tryParse(json['total_amount']?.toString() ?? '0') ?? 0.0,
      status: json['status'] as String? ?? 'unpaid',
      paymentDate: json['payment_date'] as String?,
      dueDate: json['due_date'] as String? ?? '',
      createdAt: json['created_at'] as String,
      items: itemsList,
    );
  }
}

class Medication {
  final int id;
  final String name;
  final String genericName;
  final String category;
  final int stockQuantity;
  final double unitPrice;
  final int reorderLevel;
  final String supplier;

  Medication({
    required this.id,
    required this.name,
    required this.genericName,
    required this.category,
    required this.stockQuantity,
    required this.unitPrice,
    required this.reorderLevel,
    required this.supplier,
  });

  factory Medication.fromJson(Map<String, dynamic> json) {
    return Medication(
      id: json['id'] as int,
      name: json['name'] as String? ?? '',
      genericName: json['generic_name'] as String? ?? '',
      category: json['category'] as String? ?? '',
      stockQuantity: json['stock_quantity'] as int? ?? 0,
      unitPrice: double.tryParse(json['unit_price']?.toString() ?? '0') ?? 0.0,
      reorderLevel: json['reorder_level'] as int? ?? 0,
      supplier: json['supplier'] as String? ?? '',
    );
  }
}
