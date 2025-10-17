import { useState } from "react";
import { FileTextIcon, SearchIcon, EyeIcon, PrinterIcon, CheckIcon, XIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceModal } from "./InvoiceModal";

export default function InvoiceManagement() {
  const { invoices, isLoadingInvoices, orders, updateInvoice } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const filteredInvoices = invoices?.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleView = (invoice: any) => {
    // Find the related order for full context
    const relatedOrder = orders?.find(o => o.id === invoice.orderId);
    setSelectedInvoice({ ...invoice, order: relatedOrder });
    setShowInvoiceModal(true);
  };

  const handlePrint = (invoice: any) => {
    const printContent = `
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .details { margin-bottom: 20px; }
            .items { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BrickFlow</h1>
            <h2>INVOICE</h2>
            <p>${invoice.invoiceNumber}</p>
          </div>
          <div class="details">
            <h3>Bill To:</h3>
            <p>${invoice.customerName}<br>${invoice.customerAddress}</p>
            <h3>Ship To:</h3>
            <p>${invoice.deliveryAddress}</p>
            <p><strong>Invoice Date:</strong> ${new Date(invoice.invoiceDate!).toLocaleDateString()}</p>
            ${invoice.dueDate ? `<p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>` : ''}
          </div>
          <div class="items">
            ${JSON.parse(invoice.items).map((item: any) => `
              <p>${item.description}: ${item.quantity} × PKR${item.rate} = PKR${item.amount}</p>
            `).join('')}
          </div>
          <div class="total">
            <p>Subtotal: PKR${parseFloat(invoice.subtotal).toLocaleString()}</p>
            <p>Tax: PKR${parseFloat(invoice.taxAmount).toLocaleString()}</p>
            <p>Total: PKR${parseFloat(invoice.totalAmount).toLocaleString()}</p>
            <p>Payment Status: ${invoice.paymentStatus.toUpperCase()}</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePaymentStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      await updateInvoice(invoiceId, { paymentStatus: newStatus });
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  if (isLoadingInvoices) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Management</CardTitle>
            <div className="relative">
              <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-invoices"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} data-testid={`invoice-row-${invoice.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                          <FileTextIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900" data-testid={`invoice-number-${invoice.id}`}>
                            {invoice.invoiceNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(invoice.invoiceDate!).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900" data-testid={`invoice-customer-${invoice.id}`}>
                          {invoice.customerName}
                        </div>
                        <div className="text-sm text-gray-500">Order: {orders?.find(o => o.id === invoice.orderId)?.orderNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          PKR{parseFloat(invoice.totalAmount).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Tax: PKR{parseFloat(invoice.taxAmount).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={invoice.paymentStatus === 'paid' ? 'default' : 
                                 invoice.paymentStatus === 'overdue' ? 'destructive' : 'outline'}
                          data-testid={`invoice-payment-status-${invoice.id}`}
                        >
                          {invoice.paymentStatus.toUpperCase()}
                        </Badge>
                        {invoice.paymentStatus === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handlePaymentStatusChange(invoice.id, 'paid')}
                            data-testid={`button-mark-paid-${invoice.id}`}
                          >
                            <CheckIcon className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleView(invoice)}
                        data-testid={`button-view-invoice-${invoice.id}`}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handlePrint(invoice)}
                        data-testid={`button-print-invoice-${invoice.id}`}
                      >
                        <PrinterIcon className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredInvoices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No invoices found matching your search criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Modal */}
      <InvoiceModal 
        invoice={selectedInvoice} 
        isOpen={showInvoiceModal} 
        onClose={() => {
          setShowInvoiceModal(false);
          setSelectedInvoice(null);
        }} 
      />
    </div>
  );
}
