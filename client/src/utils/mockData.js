/**
 * Standalone Client-Side Mock Data Engine for MediTrack HMS
 * Guarantees zero-dependency demo login and portal testing without backend server requirement.
 */

export const mockUsers = {
  'admin@meditrack.ng': {
    id: 1,
    email: 'admin@meditrack.ng',
    first_name: 'Babajide',
    last_name: 'Sanwo-Olu',
    role: 'admin',
    phone: '+2348031112233',
    profile_id: 1,
    department: { id: 1, name: 'Hospital Executive' },
  },
  'dr.emeka@meditrack.ng': {
    id: 2,
    email: 'dr.emeka@meditrack.ng',
    first_name: 'Emeka',
    last_name: 'Okonkwo',
    role: 'doctor',
    phone: '+2348039998877',
    profile_id: 1,
    department: { id: 2, name: 'Cardiology' },
    specialization: 'Cardiologist',
    consultation_fee: 15000.0,
  },
  'pharm.chioma@meditrack.ng': {
    id: 3,
    email: 'pharm.chioma@meditrack.ng',
    first_name: 'Chioma',
    last_name: 'Umeh',
    role: 'pharmacist',
    phone: '+2348034445566',
    profile_id: 1,
    license_number: 'PCN-2021-9871',
    shift: 'Morning',
  },
  'patient1@gmail.com': {
    id: 4,
    email: 'patient1@gmail.com',
    first_name: 'Tunde',
    last_name: 'Bakare',
    role: 'patient',
    phone: '+2348123456789',
    profile_id: 1,
    date_of_birth: '1988-04-12',
    gender: 'Male',
    blood_group: 'O+',
  },
};

export const mockDoctors = [
  {
    id: 1,
    user_id: 2,
    specialization: 'Cardiologist',
    license_number: 'MDCN-10492',
    consultation_fee: '15000.00',
    user: { first_name: 'Emeka', last_name: 'Okonkwo', email: 'dr.emeka@meditrack.ng', phone: '+2348039998877' },
    department: { id: 2, name: 'Cardiology' },
  },
  {
    id: 2,
    user_id: 5,
    specialization: 'Pediatrician',
    license_number: 'MDCN-20391',
    consultation_fee: '10000.00',
    user: { first_name: 'Amina', last_name: 'Bello', email: 'dr.amina@meditrack.ng', phone: '+2348038887766' },
    department: { id: 3, name: 'Pediatrics' },
  },
  {
    id: 3,
    user_id: 6,
    specialization: 'General Physician',
    license_number: 'MDCN-39102',
    consultation_fee: '8000.00',
    user: { first_name: 'Babatunde', last_name: 'Adeleke', email: 'dr.babatunde@meditrack.ng', phone: '+2348037776655' },
    department: { id: 1, name: 'General Medicine' },
  },
];

export const mockPatients = [
  {
    id: 1,
    user_id: 4,
    date_of_birth: '1988-04-12',
    gender: 'Male',
    blood_group: 'O+',
    address: 'Victoria Island, Lagos, Nigeria',
    emergency_contact_name: 'Next of Kin Bakare',
    emergency_contact_phone: '+2348030001122',
    medical_history_summary: 'Primary Essential Hypertension',
    user: { first_name: 'Tunde', last_name: 'Bakare', email: 'patient1@gmail.com', phone: '+2348123456789' },
  },
  {
    id: 2,
    user_id: 7,
    date_of_birth: '1995-09-23',
    gender: 'Female',
    blood_group: 'AA',
    address: 'Ikeja, Lagos, Nigeria',
    emergency_contact_name: 'Aisha Kin',
    emergency_contact_phone: '+2348031110099',
    medical_history_summary: 'Seasonal Allergies',
    user: { first_name: 'Aisha', last_name: 'Yerima', email: 'aisha@gmail.com', phone: '+2348122223344' },
  },
];

export let mockAppointments = [
  {
    id: 101,
    patient_id: 1,
    doctor_id: 1,
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '10:30',
    status: 'scheduled',
    reason: 'Routine Cardiology Checkup & Elevated BP',
    patient: { user: { first_name: 'Tunde', last_name: 'Bakare', phone: '+2348123456789' } },
    doctor: { user: { first_name: 'Emeka', last_name: 'Okonkwo' }, department: { name: 'Cardiology' }, consultation_fee: '15000.00' },
  },
  {
    id: 102,
    patient_id: 2,
    doctor_id: 2,
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '11:30',
    end_time: '12:00',
    status: 'scheduled',
    reason: 'Severe Cough & Fever',
    patient: { user: { first_name: 'Aisha', last_name: 'Yerima', phone: '+2348122223344' } },
    doctor: { user: { first_name: 'Amina', last_name: 'Bello' }, department: { name: 'Pediatrics' }, consultation_fee: '10000.00' },
  },
  {
    id: 100,
    patient_id: 1,
    doctor_id: 1,
    appointment_date: '2026-08-01',
    start_time: '09:00',
    end_time: '09:30',
    status: 'completed',
    reason: 'Initial Hypertension Screening',
    patient: { user: { first_name: 'Tunde', last_name: 'Bakare', phone: '+2348123456789' } },
    doctor: { user: { first_name: 'Emeka', last_name: 'Okonkwo' }, department: { name: 'Cardiology' }, consultation_fee: '15000.00' },
  },
];

export let mockMedications = [
  { id: 1, name: 'Coartem (Artemether/Lumefantrine)', generic_name: 'Artemether + Lumefantrine', category: 'Antimalarial', stock_quantity: 150, unit_price: '2500.00', reorder_level: 20, supplier: 'Swiss Pharma' },
  { id: 2, name: 'Paracetamol 500mg', generic_name: 'Acetaminophen', category: 'Analgesic', stock_quantity: 500, unit_price: '500.00', reorder_level: 50, supplier: 'Emzor' },
  { id: 3, name: 'Amoxicillin 500mg', generic_name: 'Amoxicillin', category: 'Antibiotic', stock_quantity: 80, unit_price: '1800.00', reorder_level: 25, supplier: 'Fidson' },
  { id: 4, name: 'Metformin 500mg', generic_name: 'Metformin', category: 'Antidiabetic', stock_quantity: 5, unit_price: '3000.00', reorder_level: 15, supplier: 'May & Baker' }, // Low stock
  { id: 5, name: 'Lisinopril 10mg', generic_name: 'Lisinopril', category: 'Antihypertensive', stock_quantity: 8, unit_price: '3500.00', reorder_level: 15, supplier: 'Neimeth' }, // Low stock
];

export let mockPrescriptions = [
  {
    id: 501,
    medical_record_id: 1,
    doctor_id: 1,
    patient_id: 1,
    status: 'pending',
    patient: { user: { first_name: 'Tunde', last_name: 'Bakare', phone: '+2348123456789' } },
    doctor: { user: { first_name: 'Emeka', last_name: 'Okonkwo' } },
    items: [
      { id: 1, medication_name: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', quantity: 30 },
      { id: 2, medication_name: 'Paracetamol 500mg', dosage: '2 tablets', frequency: 'Eight hourly', duration: '5 days', quantity: 10 },
    ],
  },
];

export let mockInvoices = [
  {
    id: 901,
    patient_id: 1,
    total_amount: '18500.00',
    status: 'unpaid',
    payment_method: null,
    created_at: new Date().toISOString(),
    items: [
      { id: 1, description: 'Consultation Fee (Cardiology)', amount: '15000.00', item_type: 'consultation' },
      { id: 2, description: 'Dispensed Medication (Lisinopril 10mg)', amount: '3500.00', item_type: 'medication' },
    ],
  },
];

export let mockMedicalRecords = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 1,
    diagnosis: 'Stage 1 Primary Essential Hypertension',
    symptoms: 'Occasional morning occipital headaches, elevated BP 145/92 mmHg',
    notes: 'Prescribed anti-hypertensive regimen. Lifestyle modifications advised: salt restriction & daily exercise.',
    created_at: new Date().toISOString(),
    doctor: { user: { first_name: 'Emeka', last_name: 'Okonkwo' }, specialization: 'Cardiologist' },
    prescription: mockPrescriptions[0],
  },
];

/**
 * Handles client-side fallback route simulation
 */
export function handleMockRoute(endpoint, method = 'GET', data = null) {
  if (endpoint.includes('/auth/login')) {
    const user = mockUsers[data?.email] || mockUsers['patient1@gmail.com'];
    return {
      success: true,
      data: {
        user,
        accessToken: 'mock_demo_access_token_2026',
        refreshToken: 'mock_demo_refresh_token_2026',
      },
    };
  }

  if (endpoint.includes('/auth/me')) {
    const tokenUserEmail = data?.email || 'patient1@gmail.com';
    return { success: true, data: mockUsers[tokenUserEmail] || mockUsers['patient1@gmail.com'] };
  }

  if (endpoint.includes('/appointments')) {
    if (method === 'POST') {
      // Conflict check simulation
      const conflict = mockAppointments.find(
        (a) => a.doctor_id === parseInt(data.doctor_id) &&
               a.appointment_date === data.appointment_date &&
               a.start_time === data.start_time &&
               a.status !== 'cancelled'
      );
      if (conflict) {
        throw new Error('Time slot unavailable. Doctor already has an appointment at this time.');
      }

      const doc = mockDoctors.find((d) => d.id === parseInt(data.doctor_id)) || mockDoctors[0];
      const newAppt = {
        id: Date.now(),
        patient_id: data.patient_id || 1,
        doctor_id: parseInt(data.doctor_id),
        appointment_date: data.appointment_date,
        start_time: data.start_time,
        end_time: '10:30',
        status: 'scheduled',
        reason: data.reason || 'General Health Consultation',
        patient: { user: { first_name: 'Tunde', last_name: 'Bakare', phone: '+2348123456789' } },
        doctor: { user: { first_name: doc.user.first_name, last_name: doc.user.last_name }, department: doc.department, consultation_fee: doc.consultation_fee },
      };
      mockAppointments.unshift(newAppt);
      return { success: true, message: 'Appointment booked successfully.', data: newAppt };
    }
    return { success: true, data: mockAppointments };
  }

  if (endpoint.includes('/doctors')) {
    return { success: true, data: mockDoctors };
  }

  if (endpoint.includes('/patients')) {
    if (endpoint.includes('/history')) {
      return {
        success: true,
        data: {
          patient: mockPatients[0],
          medicalRecords: mockMedicalRecords,
          prescriptions: mockPrescriptions,
          appointments: mockAppointments,
          invoices: mockInvoices,
        },
      };
    }
    return { success: true, data: mockPatients };
  }

  if (endpoint.includes('/prescriptions')) {
    if (endpoint.includes('/dispense')) {
      const parts = endpoint.split('/');
      const id = parseInt(parts[2]);
      const presc = mockPrescriptions.find((p) => p.id === id);
      if (presc) presc.status = 'dispensed';
      return {
        success: true,
        message: 'Prescription marked as dispensed. Stock auto-deducted and added to invoice.',
        data: { prescription_id: id, status: 'dispensed', lowStockAlerts: [] },
      };
    }
    if (method === 'POST') {
      const newPresc = {
        id: Date.now(),
        patient_id: data.patient_id || 1,
        status: 'pending',
        items: data.items || [],
        patient: { user: { first_name: 'Tunde', last_name: 'Bakare' } },
        doctor: { user: { first_name: 'Emeka', last_name: 'Okonkwo' } },
      };
      mockPrescriptions.unshift(newPresc);
      return { success: true, data: newPresc };
    }
    return { success: true, data: mockPrescriptions };
  }

  if (endpoint.includes('/medications')) {
    if (endpoint.includes('/alerts')) {
      const alerts = mockMedications.filter((m) => m.stock_quantity <= m.reorder_level);
      return { success: true, count: alerts.length, data: alerts };
    }
    if (method === 'POST') {
      const newMed = { id: Date.now(), ...data };
      mockMedications.push(newMed);
      return { success: true, data: newMed };
    }
    return { success: true, data: mockMedications };
  }

  if (endpoint.includes('/medical-records')) {
    if (method === 'POST') {
      const newRecord = {
        id: Date.now(),
        patient_id: data.patient_id,
        diagnosis: data.diagnosis,
        symptoms: data.symptoms,
        notes: data.notes,
        created_at: new Date().toISOString(),
        doctor: { user: { first_name: 'Emeka', last_name: 'Okonkwo' }, specialization: 'Cardiologist' },
      };
      mockMedicalRecords.unshift(newRecord);
      if (data.prescriptions && data.prescriptions.length > 0) {
        const newP = {
          id: Date.now() + 1,
          patient_id: data.patient_id,
          status: 'pending',
          items: data.prescriptions,
          patient: { user: { first_name: 'Tunde', last_name: 'Bakare' } },
          doctor: { user: { first_name: 'Emeka', last_name: 'Okonkwo' } },
        };
        mockPrescriptions.unshift(newP);
      }
      return { success: true, data: newRecord };
    }
    return { success: true, data: mockMedicalRecords };
  }

  if (endpoint.includes('/billing')) {
    if (endpoint.includes('/pay')) {
      const parts = endpoint.split('/');
      const id = parseInt(parts[3]);
      const inv = mockInvoices.find((i) => i.id === id);
      if (inv) inv.status = 'paid';
      return { success: true, message: 'Invoice paid successfully.', data: inv };
    }
    return {
      success: true,
      data: {
        invoices: mockInvoices,
        summary: { total_unpaid: '18500.00', total_paid: '35000.00', invoice_count: mockInvoices.length },
      },
    };
  }

  if (endpoint.includes('/admin')) {
    if (endpoint.includes('/revenue')) {
      return {
        success: true,
        data: {
          totalPaidRevenue: '1450000.00',
          totalUnpaidBalance: '18500.00',
        },
      };
    }
    if (endpoint.includes('/users')) {
      return {
        success: true,
        data: Object.values(mockUsers),
      };
    }
    return {
      success: true,
      data: {
        counts: {
          totalPatients: 20,
          totalDoctors: 10,
          appointmentsToday: 5,
          pendingPrescriptions: mockPrescriptions.filter((p) => p.status === 'pending').length,
          lowStockAlerts: mockMedications.filter((m) => m.stock_quantity <= m.reorder_level).length,
        },
      },
    };
  }

  return { success: true, data: [] };
}
