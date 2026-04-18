import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Printer, Download, DollarSign, Clock, User } from "lucide-react";

export function ShiftInvoiceManagement() {
  const [invoices, setInvoices] = useState([
    {
      id: '#INV001',
      customer: 'Khách hàng',
      items: 'Cappuccino x2, Croissant x1',
      total: 120000,
      status: 'completed',
      time: '10:30 AM',
      cashier: 'NV001',
      shift: 'Ca sáng'
    },
    {
      id: '#INV002',
      customer: 'Khách hàng',
      items: 'Americano x1, Latte x1',
      total: 83000,
      status: 'completed',
      time: '10:45 AM',
      cashier: 'NV002',
      shift: 'Ca sáng'
    }
  ]);

  const [currentShift, setCurrentShift] = useState('Ca sáng');
  const [totalRevenue, setTotalRevenue] = useState(203000);

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
          <h2 className="text-xl font-bold">Quản lý hóa đơn theo ca</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ca làm việc</p>
                <p className="text-2xl font-medium">{currentShift}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Số lượng hóa đơn</p>
                <p className="text-2xl font-medium">{invoices.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-medium text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{invoice.id}</h3>
                    <Badge variant={getStatusColor(invoice.status)}>
                      {invoice.status === 'completed' ? 'Hoàn thành' : invoice.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{invoice.time}</span>
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

              <p className="mb-3">{invoice.items}</p>

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