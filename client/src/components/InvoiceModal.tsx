import { useState } from "react";
import { X, PrinterIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

interface InvoiceModalProps {
  order?: any;
  invoice?: any;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ order, invoice, isOpen, onClose }: InvoiceModalProps) {
  const { bricks, createInvoice, settings } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInvoiceData = (orderData: any) => {
    if (!orderData) return null;

    const brick = bricks?.find(b => b.id === orderData.brickType);
    if (!brick) return null;

    const brickAmount = parseFloat(orderData.unitPrice) * orderData.quantity;
    const deliveryCharge = parseFloat(settings?.find(s => s.key === 'deliveryCharge')?.value || '2500');
    const laborCharge = parseFloat(settings?.find(s => s.key === 'laborCharge')?.value || '1000');
    const taxRate = parseFloat(settings?.find(s => s.key === 'taxRate')?.value || '0.18');
    const subtotal = brickAmount + deliveryCharge + laborCharge;
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    const items = [
      {
        description: `${brick.type} (Standard Size)`,
        quantity: orderData.quantity,
        rate: parseFloat(orderData.unitPrice),
        amount: brickAmount
      },
      {
        description: "Delivery Charges",
        quantity: 1,
        rate: deliveryCharge,
        amount: deliveryCharge
      },
      {
        description: "Labor Charges",
        quantity: 1,
        rate: laborCharge,
        amount: laborCharge
      }
    ];

    return {
      orderId: orderData.id,
      invoiceNumber: `INV-${orderData.orderNumber || orderData.id.slice(0, 8).toUpperCase()}`,
      customerName: orderData.customerName,
      customerAddress: orderData.customerAddress,
      deliveryAddress: orderData.deliveryAddress,
      items: JSON.stringify(items),
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      totalAmount: totalAmount.toString(),
      paymentStatus: "pending",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
  };

  const handleGenerateInvoice = async () => {
    if (!order) return;

    setIsGenerating(true);
    try {
      const invoiceData = generateInvoiceData(order);
      if (invoiceData) {
        await createInvoice(invoiceData);
        onClose();
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.querySelector('.print-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .invoice-container { max-width: 800px; margin: 0 auto; }
              .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .company-info h1 { color: #D2691E; margin: 0; font-size: 2rem; }
              .company-info p { margin: 5px 0; color: #666; }
              .invoice-info { text-align: right; }
              .invoice-info h2 { margin: 0; font-size: 1.5rem; }
              .addresses { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .address h3 { margin: 0 0 10px 0; }
              .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              .items-table th { background-color: #f2f2f2; }
              .items-table td:last-child { text-align: right; }
              .totals { margin-left: auto; width: 300px; }
              .totals div { display: flex; justify-content: space-between; padding: 5px 0; }
              .totals .total-line { border-top: 1px solid #333; font-weight: bold; font-size: 1.1em; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Determine what data to display
  const displayData = invoice || (order ? generateInvoiceData(order) : null);
  const isExistingInvoice = !!invoice;

  if (!displayData) return null;

  const items = JSON.parse(displayData.items);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isExistingInvoice ? 'Invoice Details' : 'Generate Invoice'}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="print-content bg-white p-8 border border-gray-200 rounded-lg" data-testid="invoice-content">
          <div className="invoice-container">
            {/* Header */}
            <div className="header">
              <div className="company-info">
                <h1 className="text-brick-primary">BrickFlow</h1>
                <p>Bricks Management Company</p>
                <p>Professional Brick Supply Services</p>
              </div>
              <div className="invoice-info">
                <h2>INVOICE</h2>
                <p><strong>{isExistingInvoice ? invoice.invoiceNumber : 'INV-PREVIEW'}</strong></p>
                <p>Date: {new Date(displayData.invoiceDate || new Date()).toLocaleDateString()}</p>
                {displayData.dueDate && (
                  <p>Due: {new Date(displayData.dueDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            
            {/* Addresses */}
            <div className="addresses">
              <div className="address">
                <h3>Bill To:</h3>
                <p>{displayData.customerName}<br />
                {displayData.customerAddress}</p>
              </div>
              <div className="address">
                <h3>Ship To:</h3>
                <p>{displayData.deliveryAddress}</p>
              </div>
            </div>
            
            {/* Items */}
            <table className="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td>{item.quantity.toLocaleString()}</td>
                    <td>PKR{item.rate.toLocaleString()}</td>
                    <td>PKR{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Totals */}
            <div className="totals">
              <div>
                <span>Subtotal:</span>
                <span>PKR{parseFloat(displayData.subtotal).toLocaleString()}</span>
              </div>
              <div>
                <span>Tax ({((parseFloat(settings?.find(s => s.key === 'taxRate')?.value || '0.18') || 0.18) * 100).toFixed(0)}%):</span>
                <span>PKR{parseFloat(displayData.taxAmount).toLocaleString()}</span>
              </div>
              <div className="total-line">
                <span>Total:</span>
                <span>PKR{parseFloat(displayData.totalAmount).toLocaleString()}</span>
              </div>
              {isExistingInvoice && (
                <div className="mt-4">
                  <span>Payment Status: </span>
                  <span className={`font-semibold ${
                    displayData.paymentStatus === 'paid' ? 'text-green-600' :
                    displayData.paymentStatus === 'overdue' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {displayData.paymentStatus.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handlePrint} 
            className="bg-blue-600 hover:bg-blue-700"
            data-testid="button-print-invoice"
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          {!isExistingInvoice && (
            <Button 
              onClick={handleGenerateInvoice} 
              disabled={isGenerating}
              className="bg-brick-primary hover:bg-brick-secondary"
              data-testid="button-save-invoice"
            >
              {isGenerating ? 'Generating...' : 'Save Invoice'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
