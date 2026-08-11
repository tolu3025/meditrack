import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { mobileApiRequest } from './src/services/api';

export default function App() {
  const [email, setEmail] = useState('patient1@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Data states
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await mobileApiRequest('/auth/login', 'POST', { email, password });
      if (res.success) {
        setUser(res.data.user);
        setToken(res.data.accessToken);

        // Fetch user appointments
        const apptRes = await mobileApiRequest('/appointments', 'GET', null, res.data.accessToken);
        if (apptRes.success) setAppointments(apptRes.data);

        // Fetch prescriptions
        const prescRes = await mobileApiRequest('/prescriptions', 'GET', null, res.data.accessToken);
        if (prescRes.success) setPrescriptions(prescRes.data);
      }
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Check credentials or server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {!user ? (
        <View style={styles.authBox}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🏥</Text>
          </View>
          <Text style={styles.title}>MediTrack Mobile</Text>
          <Text style={styles.subtitle}>Hospital Management App (Android & iOS)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="name@meditrack.ng"
              placeholderTextColor="#64748B"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In to Mobile App</Text>
            )}
          </TouchableOpacity>

          <View style={styles.quickAccess}>
            <Text style={styles.quickLabel}>Quick Role Logins:</Text>
            <View style={styles.quickRow}>
              <TouchableOpacity style={styles.chip} onPress={() => setEmail('patient1@gmail.com')}>
                <Text style={styles.chipText}>Patient</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip} onPress={() => setEmail('dr.emeka@meditrack.ng')}>
                <Text style={styles.chipText}>Doctor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip} onPress={() => setEmail('pharm.chioma@meditrack.ng')}>
                <Text style={styles.chipText}>Pharmacist</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Welcome, {user.first_name}!</Text>
              <Text style={styles.headerSub}>Role: {user.role.toUpperCase()}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Upcoming Appointments</Text>
            {appointments.length === 0 ? (
              <Text style={styles.emptyText}>No appointments found.</Text>
            ) : (
              appointments.map((a) => (
                <View key={a.id} style={styles.itemRow}>
                  <Text style={styles.itemTitle}>Date: {a.appointment_date} at {a.start_time}</Text>
                  <Text style={styles.itemSub}>Reason: {a.reason || 'General Consult'}</Text>
                  <Text style={styles.statusBadge}>{a.status.toUpperCase()}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Prescription Queue / Issued</Text>
            {prescriptions.length === 0 ? (
              <Text style={styles.emptyText}>No prescriptions found.</Text>
            ) : (
              prescriptions.map((p) => (
                <View key={p.id} style={styles.itemRow}>
                  <Text style={styles.itemTitle}>Prescription #{p.id}</Text>
                  <Text style={styles.itemSub}>Status: {p.status.toUpperCase()}</Text>
                  <Text style={styles.itemSub}>Items: {p.items?.map(i => i.medication_name).join(', ')}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  authBox: {
    padding: 24,
    justifyContent: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonPrimary: {
    backgroundColor: '#0EA5E9',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  quickAccess: {
    marginTop: 24,
  },
  quickLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 8,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  chipText: {
    color: '#0EA5E9',
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  headerSub: {
    fontSize: 12,
    color: '#0EA5E9',
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
  itemRow: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  itemSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 10,
    marginTop: 4,
  },
});
