import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Printer, Download, Clock, User, DollarSign } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function InvoiceDisplay() {
  const [invoices, setInvoices] = useState([
    {
      id: '#INV001',
      customer: 'Nguyễn Văn A',
      items: [
        { name: 'Cappuccino', quantity: 2, price: 45000 },
        { name: 'Croissant', quantity: 1, price: 25000 }
      ],
      subtotal: 115000,
      discount: 0,
      tax: 11500,
      total: 126500,
      status: 'completed',
      date: '2024-09-15',
      time: '10:30 AM',
      cashier: 'NV001'
    },
    {
      id: '#INV002',
      customer: 'Trần Thị B',
      items: [
        { name: 'Latte', quantity: 1, price: 50000 },
        { name: 'Muffin', quantity: 1, price: 35000 }
      ],
      subtotal: 85000,
      discount: 5000,
      tax: 8000,
      total: 88000,
      status: 'completed',
      date: '2024-09-15',
      time: '11:15 AM',
      cashier: 'NV002'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const printInvoice = (invoiceId: string) => {
    alert(`In hóa đơn ${invoiceId}`);
  };

  const downloadInvoice = (invoiceId: string) => {
    alert(`Tải xuống hóa đơn ${invoiceId}`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Danh sách hóa đơn</h2>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              In tất cả
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{invoice.id}</h3>
                    <Badge variant={getStatusColor(invoice.status)}>
                      {invoice.status === 'completed' ? 'Hoàn thành' : invoice.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{invoice.customer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{invoice.date} {invoice.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{invoice.cashier}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(invoice.total)}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Sản phẩm:</h4>
                <div className="space-y-1">
                  {invoice.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity} × {item.name}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính:</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giảm giá:</span>
                    <span className="text-red-600">-{formatCurrency(invoice.discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thuế:</span>
                    <span>{formatCurrency(invoice.tax)}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex justify-between font-bold">
                    <span>Tổng cộng:</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => printInvoice(invoice.id)}>
                  <Printer className="h-4 w-4 mr-1" />
                  In
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadInvoice(invoice.id)}>
                  <Download className="h-4 w-4 mr-1" />
                  Tải xuống
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}