import 'package:flutter/material.dart';
import '../api/api_service.dart';
import '../models/models.dart';

class BillingScreen extends StatefulWidget {
  const BillingScreen({super.key});

  @override
  State<BillingScreen> createState() => _BillingScreenState();
}

class _BillingScreenState extends State<BillingScreen> {
  List<Invoice> _invoices = [];
  bool _isLoading = true;
  double _totalUnpaid = 0.0;

  @override
  void initState() {
    super.initState();
    _loadBillingData();
  }

  Future<void> _loadBillingData() async {
    setState(() => _isLoading = true);
    final invoices = await ApiService().getInvoices();
    
    double unpaid = 0.0;
    for (var inv in invoices) {
      if (inv.status == 'unpaid') {
        unpaid += inv.totalAmount;
      }
    }

    if (mounted) {
      setState(() {
        _invoices = invoices;
        _totalUnpaid = unpaid;
        _isLoading = false;
      });
    }
  }

  Future<void> _payInvoice(Invoice invoice) async {
    // Show confirmation loading dialog
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
                Text('Processing simulated payment...', style: TextStyle(fontWeight: FontWeight.w500)),
              ],
            ),
          ),
        ),
      ),
    );

    final result = await ApiService().payInvoice(invoice.id);

    if (mounted) {
      Navigator.pop(context); // Close loading dialog

      if (result['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Invoice ${invoice.invoiceNumber} paid successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        _loadBillingData(); // Reload invoices
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['message'] ?? 'Payment failed.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Billing & Invoices'),
      ),
      body: RefreshIndicator(
        onRefresh: _loadBillingData,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : Column(
                children: [
                  // Total Unpaid Banner
                  Container(
                    width: double.infinity,
                    color: Colors.orange.shade50.withOpacity(0.5),
                    padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
                    child: Column(
                      children: [
                        const Text(
                          'Total Outstanding Balance',
                          style: TextStyle(color: Colors.black54, fontSize: 13, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '₦${_totalUnpaid.toStringAsFixed(2)}',
                          style: TextStyle(
                            color: Colors.orange.shade900,
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // Invoices List
                  Expanded(
                    child: _invoices.isEmpty
                        ? const Center(child: Text('No billing records found.'))
                        : ListView.builder(
                            padding: const EdgeInsets.all(20),
                            itemCount: _invoices.length,
                            itemBuilder: (context, index) {
                              final invoice = _invoices[index];
                              return _buildInvoiceCard(invoice, theme);
                            },
                          ),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _buildInvoiceCard(Invoice invoice, ThemeData theme) {
    final isPaid = invoice.status == 'paid';
    
    // Format dates
    String formattedDue = invoice.dueDate;
    try {
      final date = DateTime.parse(invoice.dueDate);
      formattedDue = '${date.day}/${date.month}/${date.year}';
    } catch (_) {}

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: ExpansionTile(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              invoice.invoiceNumber,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: isPaid ? Colors.green.shade50 : Colors.orange.shade50,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                invoice.status.toUpperCase(),
                style: TextStyle(
                  color: isPaid ? Colors.green.shade700 : Colors.orange.shade800,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        subtitle: Text(
          'Total: ₦${invoice.totalAmount.toStringAsFixed(2)}',
          style: TextStyle(
            color: theme.primaryColor,
            fontWeight: FontWeight.w600,
            fontSize: 13,
          ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Due Date:', style: TextStyle(color: Colors.black54, fontSize: 12)),
                    Text(formattedDue, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 12),
                
                const Text(
                  'Bill Items',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black54),
                ),
                const SizedBox(height: 6),
                
                ...invoice.items.map((item) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            '${item.description} (x${item.quantity})',
                            style: const TextStyle(fontSize: 12, color: Colors.black87),
                          ),
                        ),
                        Text(
                          '₦${item.lineTotal.toStringAsFixed(2)}',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  );
                }).toList(),
                
                const Divider(height: 24),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Subtotal:', style: TextStyle(color: Colors.black54, fontSize: 12)),
                    Text('₦${invoice.amount.toStringAsFixed(2)}', style: const TextStyle(fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Tax/VAT:', style: TextStyle(color: Colors.black54, fontSize: 12)),
                    Text('₦${invoice.tax.toStringAsFixed(2)}', style: const TextStyle(fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(
                      '₦${invoice.totalAmount.toStringAsFixed(2)}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ],
                ),
                
                if (!isPaid) ...[
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => _payInvoice(invoice),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange.shade800,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text('Simulate Payment', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
                const SizedBox(height: 8),
              ],
            ),
          )
        ],
      ),
    );
  }
}
