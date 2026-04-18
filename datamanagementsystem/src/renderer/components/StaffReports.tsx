import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BarChart3, FileText, Package, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

export function StaffReports() {
  const [reportType, setReportType] = useState<'inventory' | 'equipment' | 'cashflow'>('inventory');

  const inventoryReport = {
    totalItems: 45,
    lowStock: 5,
    outOfStock: 2,
    items: [
      { name: 'Hạt cà phê Arabica', current: 25, min: 10, unit: 'kg', status: 'good' },
      { name: 'Sữa tươi', current: 15, min: 20, unit: 'lít', status: 'low' },
      { name: 'Đường trắng', current: 8, min: 5, unit: 'kg', status: 'good' },
      { name: 'Ly giấy size M', current: 2, min: 5, unit: 'thùng', status: 'critical' }
    ]
  };

  const equipmentReport = {
    totalEquipment: 12,
    active: 9,
    maintenance: 2,
    broken: 1,
    items: [
      { name: 'Máy pha cà phê #1', status: 'active', lastService: '2 ngày trước' },
      { name: 'Máy pha cà phê #2', status: 'maintenance', lastService: 'Đang bảo trì' },
      { name: 'Máy xay cà phê', status: 'active', lastService: '1 tuần trước' },
      { name: 'Hệ thống âm thanh', status: 'active', lastService: '3 ngày trước' },
      { name: 'Điều hòa không khí', status: 'warning', lastService: '2 tuần trước' }
    ]
  };

  const cashflowReport = {
    totalRevenue: 45600000,
    totalExpenses: 28400000,
    netProfit: 17200000,
    profitMargin: 37.7,
    transactions: [
      { type: 'Revenue', amount: 120000, description: 'Hóa đơn #001', time: '10:30 AM' },
      { type: 'Expense', amount: 35000, description: 'Mua nguyên liệu', time: '09:15 AM' },
      { type: 'Revenue', amount: 83000, description: 'Hóa đơn #002', time: '10:45 AM' },
      { type: 'Expense', amount: 15000, description: 'Bảo trì máy', time: '11:00 AM' }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Báo cáo</h2>
          <div className="flex gap-2">
            <Button
              variant={reportType === 'inventory' ? 'default' : 'outline'}
              onClick={() => setReportType('inventory')}
            >
              <Package className="h-4 w-4 mr-2" />
              Nguyên liệu
            </Button>
            <Button
              variant={reportType === 'equipment' ? 'default' : 'outline'}
              onClick={() => setReportType('equipment')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Thiết bị
            </Button>
            <Button
              variant={reportType === 'cashflow' ? 'default' : 'outline'}
              onClick={() => setReportType('cashflow')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Dòng tiền
            </Button>
          </div>
        </div>

        {reportType === 'inventory' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Tổng nguyên liệu</p>
                <p className="text-2xl font-bold">{inventoryReport.totalItems}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Sắp hết</p>
                <p className="text-2xl font-bold text-yellow-600">{inventoryReport.lowStock}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Hết hàng</p>
                <p className="text-2xl font-bold text-red-600">{inventoryReport.outOfStock}</p>
              </div>
            </div>

            <div className="space-y-3">
              {inventoryReport.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Hiện có: {item.current} {item.unit}
                      </p>
                    </div>
                    <Badge variant={item.status === 'good' ? 'default' : item.status === 'low' ? 'secondary' : 'destructive'}>
                      {item.status === 'good' ? 'Đủ' : item.status === 'low' ? 'Sắp hết' : 'Hết hàng'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportType === 'equipment' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Tổng thiết bị</p>
                <p className="text-2xl font-bold">{equipmentReport.totalEquipment}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{equipmentReport.active}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Bảo trì</p>
                <p className="text-2xl font-bold text-yellow-600">{equipmentReport.maintenance}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Hỏng</p>
                <p className="text-2xl font-bold text-red-600">{equipmentReport.broken}</p>
              </div>
            </div>

            <div className="space-y-3">
              {equipmentReport.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Bảo trì gần nhất: {item.lastService}
                      </p>
                    </div>
                    <Badge variant={item.status === 'active' ? 'default' : item.status === 'maintenance' ? 'secondary' : 'destructive'}>
                      {item.status === 'active' ? 'Hoạt động' : item.status === 'maintenance' ? 'Bảo trì' : 'Hỏng'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportType === 'cashflow' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Doanh thu</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(cashflowReport.totalRevenue)}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Chi phí</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(cashflowReport.totalExpenses)}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Lợi nhuận</p>
                <p className="text-2xl font-bold">{formatCurrency(cashflowReport.netProfit)}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Biên lợi nhuận</p>
                <p className="text-2xl font-bold">{cashflowReport.profitMargin}%</p>
              </div>
            </div>

            <div className="space-y-3">
              {cashflowReport.transactions.map((transaction, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{transaction.description}</h3>
                      <p className="text-sm text-muted-foreground">{transaction.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {transaction.type === 'Revenue' ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${transaction.type === 'Revenue' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'Revenue' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}