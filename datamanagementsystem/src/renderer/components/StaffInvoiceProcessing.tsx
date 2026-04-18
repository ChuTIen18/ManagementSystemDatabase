import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FileText, DollarSign, Clock, User, CheckCircle, AlertCircle } from "lucide-react";

export function StaffInvoiceProcessing() {
  const [invoices, setInvoices] = useState([
    {
      id: '#001',
      table: 'Bàn 3',
      items: 'Cappuccino x2, Croissant x1',
      total: 120000,
      status: 'completed',
      time: '10:30 AM',
      cashier: 'NV001'
    },
    {
      id: '#002',
      table: 'Bàn 7',
      items: 'Americano x1, Latte x1',
      total: 83000,
      status: 'processing',
      time: '10:45 AM',
      cashier: 'NV002'
    },
    {
      id: '#003',
      table: 'Bàn 2',
      items: 'Espresso x3',
      total: 105000,
      status: 'pending',
      time: '11:00 AM',
      cashier: 'NV001'
    }
  ]);

  const handleComplete = (id: string) => {
    setInvoices(invoices.map(inv =>
      inv.id === id ? {...inv, status: 'completed'} : inv
    ));
  };

  const handleCancel = (id: string) => {
    setInvoices(invoices.map(inv =>
      inv.id === id ? {...inv, status: 'cancelled'} : inv
    ));
  };

  const totalRevenue = invoices.filter(i => i.status === 'completed').reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Xử lý hóa đơn cuối ca</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{invoice.id}</h3>
                    <Badge variant={invoice.status === 'completed' ? 'default' : invoice.status === 'processing' ? 'secondary' : 'destructive'}>
                      {invoice.status === 'completed' ? 'Hoàn thành' : invoice.status === 'processing' ? 'Đang xử lý' : 'Chưa xử lý'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{invoice.table}</p>
                  <p className="text-sm">{invoice.items}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
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
                  <p className="font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoice.total)}
                  </p>
                  {invoice.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => handleComplete(invoice.id)}>Hoàn thành</Button>
                      <Button size="sm" variant="outline" onClick={() => handleCancel(invoice.id)}>Hủy</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold mb-4">Báo cáo dòng tiền</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-medium">Tiền mặt</span>
            </div>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(2450000)}
            </p>
            <p className="text-sm text-muted-foreground">Trong ca</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Chuyển khoản</span>
            </div>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1870000)}
            </p>
            <p className="text-sm text-muted-foreground">Trong ca</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Tổng cộng</span>
            </div>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(4320000)}
            </p>
            <p className="text-sm text-muted-foreground">Trong ca</p>
          </div>
        </div>
      </Card>
    </div>
  );
}