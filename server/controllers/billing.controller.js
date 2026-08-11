const { Invoice, InvoiceItem, Patient, User, Appointment, Prescription } = require('../models');

/**
 * Get patient invoices and total accumulated balance
 */
const getPatientInvoices = async (req, res, next) => {
  try {
    const { patient_id } = req.params;

    const invoices = await Invoice.findAll({
      where: { patient_id },
      include: [
        { model: InvoiceItem, as: 'items' },
      ],
      order: [['created_at', 'DESC']],
    });

    const totalUnpaid = invoices
      .filter((inv) => inv.status === 'unpaid')
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

    const totalPaid = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

    res.json({
      success: true,
      data: {
        invoices,
        summary: {
          total_unpaid: totalUnpaid.toFixed(2),
          total_paid: totalPaid.toFixed(2),
          invoice_count: invoices.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create or generate invoice
 */
const createInvoice = async (req, res, next) => {
  try {
    const { patient_id, appointment_id, prescription_id, items } = req.body;

    if (!patient_id || !items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Patient ID and invoice items are required.' });
    }

    const total_amount = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const invoice = await Invoice.create({
      patient_id,
      appointment_id: appointment_id || null,
      prescription_id: prescription_id || null,
      total_amount,
      status: 'unpaid',
    });

    const invoiceItems = items.map((item) => ({
      invoice_id: invoice.id,
      description: item.description,
      amount: item.amount,
      item_type: item.item_type || 'other',
    }));

    await InvoiceItem.bulkCreate(invoiceItems);

    const fullInvoice = await Invoice.findByPk(invoice.id, {
      include: [{ model: InvoiceItem, as: 'items' }],
    });

    res.status(201).json({
      success: true,
      message: 'Invoice generated successfully.',
      data: fullInvoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all invoices (admin/staff view)
 */
const getAllInvoices = async (req, res, next) => {
  try {
    const { status } = req.query;
    let whereClause = {};
    if (status) whereClause.status = status;

    const invoices = await Invoice.findAll({
      where: whereClause,
      include: [
        { model: Patient, as: 'patient', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'phone'] }] },
        { model: InvoiceItem, as: 'items' },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark invoice as paid
 */
const payInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payment_method = 'POS / Card' } = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    invoice.status = 'paid';
    invoice.payment_method = payment_method;
    invoice.paid_at = new Date();

    await invoice.save();

    res.json({
      success: true,
      message: 'Invoice marked as paid successfully.',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatientInvoices,
  createInvoice,
  getAllInvoices,
  payInvoice,
};
