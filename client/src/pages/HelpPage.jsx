import React from 'react';
import { HelpCircle, MessageCircle, FileQuestion, Phone, Mail, ExternalLink } from 'lucide-react';

const faqs = [
  { q: 'How do I book an appointment?', a: 'Navigate to the "Book Appt" tab in the navigation bar, select a doctor, choose a date and time, and confirm your booking.' },
  { q: 'How can I view my medical records?', a: 'Click "Documents" in the navigation. Your full EHR history, diagnoses, and consultation notes are available there.' },
  { q: 'How do I pay my invoices?', a: 'Go to "Billing" in the navigation. All outstanding and paid invoices are listed with their payment status.' },
  { q: 'Can I cancel an appointment?', a: 'Yes. Go to your Documents page or contact your doctor\'s office. Cancellations made 24+ hours before are free.' },
  { q: 'How are my prescriptions managed?', a: 'When a doctor issues a prescription it is sent directly to the pharmacy queue. You can track the status in your dashboard.' },
  { q: 'Is my health data secure?', a: 'Yes. MediTrack uses industry-standard encryption and is HIPAA-compliant. Your data is never shared without consent.' },
];

export default function HelpPage() {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#F7F8FA', minHeight: '100%', padding: '2rem' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Help & Support</h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.88rem', marginTop: '0.25rem' }}>Find answers and reach our support team.</p>
        </div>

        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { icon: MessageCircle, title: 'Live Chat',       sub: 'Chat with our support team', color: '#1D4ED8', bg: '#EFF6FF', action: '#' },
            { icon: Mail,          title: 'Email Support',   sub: 'support@meditrack.ng',       color: '#059669', bg: '#D1FAE5', action: 'mailto:support@meditrack.ng' },
            { icon: Phone,         title: 'Phone Support',   sub: '+234 800 MED TRACK',         color: '#D97706', bg: '#FEF9C3', action: 'tel:+2348001234567' },
          ].map(c => (
            <a
              key={c.title}
              href={c.action}
              style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center', transition: 'transform 0.15s', border: '1px solid #F3F4F6' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <c.icon size={22} color={c.color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{c.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '0.2rem' }}>{c.sub}</div>
              </div>
            </a>
          ))}
        </div>

        {/* FAQs */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <FileQuestion size={20} color="#1D4ED8" />
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ padding: '1.1rem 0', borderBottom: i < faqs.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827', marginBottom: '0.5rem' }}>
                  {faq.q}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#6B7280', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doc link */}
        <div style={{ marginTop: '1.5rem', background: '#111827', borderRadius: 20, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>View full documentation</div>
            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Comprehensive guides for all roles</div>
          </div>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1D4ED8', color: '#fff', borderRadius: 9999, padding: '0.6rem 1.25rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
            Open Docs <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
