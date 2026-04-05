import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Download,
  Edit,
  Save,
  Clock
} from "lucide-react";

interface Invoice {
  id: string;
  timestamp: Date;
  cashier: string;
  total: number;
  paymentMethod: 'cash' | 'transfer';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'completed' | 'cancelled' | 'edited';
}

interface ShiftReport {
  shiftId: string;
  startTime: Date;
  endTime?: Date;
  cashier: string;
  totalInvoices: number;
  totalRevenue: number;
  cashAmount: number;
  transferAmount: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  cancelledInvoices: Invoice[];
  notes?: string;
}

export function ShiftInvoiceManagement() {
  const [currentShift] = useState<ShiftReport>({
    shiftId: 'SHIFT001',
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 giờ trước
    cashier: 'Nguyễn Văn A',
    totalInvoices: 0,
    totalRevenue: 0,
    cashAmount: 0,
    transferAmount: 0,
    topProducts: [],
    cancelledInvoices: []
  });

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV001',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      cashier: 'Nguyễn Văn A',
      total: 120000,
      paymentMethod: 'cash',
      items: [
        { name: 'Cappuccino', quantity: 2, price: 45000 },
        { name: 'Croissant', quantity: 1, price: 30000 }
      ],
      status: 'completed'
    },
    {
      id: 'INV002', 
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      cashier: 'Nguyễn Văn A',
      total: 83000,
      paymentMethod: 'transfer',
      items: [
        { name: 'Americano', quantity: 1, price: 35000 },
        { name: 'Latte', quantity: 1, price: 48000 }
      ],
      status: 'completed'
    },
    {
      id: 'INV003',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      cashier: 'Nguyễn Văn A',
      total: 95000,
      paymentMethod: 'cash',
      items: [
        { name: 'Espresso', quantity: 3, price: 30000 },
        { name: 'Cheesecake', quantity: 1, price: 35000 }
      ],
      status: 'edited'
    }
  ]);

  const [showCashFlowDialog, setShowCashFlowDialog] = useState(false);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [shiftNotes, setShiftNotes] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'edited': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Invoice['status']) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'edited': return 'Đã sửa';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const calculateShiftStats = () => {
    const completedInvoices = invoices.filter(inv => inv.status === 'completed' || inv.status === 'edited');
    const totalRevenue = completedInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const cashRevenue = completedInvoices
      .filter(inv => inv.paymentMethod === 'cash')
      .reduce((sum, inv) => sum + inv.total, 0);
    const transferRevenue = completedInvoices
      .filter(inv => inv.paymentMethod === 'transfer')
      .reduce((sum, inv) => sum + inv.total, 0);

    // Top sản phẩm
    const productStats: { [key: string]: { quantity: number; revenue: number } } = {};
    completedInvoices.forEach(invoice => {
      invoice.items.forEach(item => {
        if (!productStats[item.name]) {
          productStats[item.name] = { quantity: 0, revenue: 0 };
        }
        productStats[item.name].quantity += item.quantity;
        productStats[item.name].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.entries(productStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalInvoices: completedInvoices.length,
      totalRevenue,
      cashRevenue,
      transferRevenue,
      topProducts,
      cancelledInvoices: invoices.filter(inv => inv.status === 'cancelled')
    };
  };

  const updateCashFlow = () => {
    console.log('Cập nhật dòng tiền ca:', {
      shiftId: currentShift.shiftId,
      cashAmount,
      transferAmount,
      timestamp: new Date()
    });
    
    setShowCashFlowDialog(false);
    alert('Dòng tiền ca làm đã được cập nhật!');
  };

  const generateShiftReport = () => {
    const stats = calculateShiftStats();
    const report: ShiftReport = {
      ...currentShift,
      endTime: new Date(),
      ...stats,
      cashAmount,
      transferAmount,
      notes: shiftNotes
    };

    console.log('Báo cáo ca làm:', report);
    setShowReportDialog(true);
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    const stats = calculateShiftStats();
    console.log(`Xuất báo cáo ${format}:`, stats);
    alert(`Đang xuất báo cáo ca làm dưới định dạng ${format.toUpperCase()}...`);
  };

  const stats = calculateShiftStats();

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1>Xử lý hóa đơn theo ca</h1>
          <p className="text-muted-foreground">
            Ca làm: {formatTime(currentShift.startTime)} - {formatTime(new Date())}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCashFlowDialog(true)}>
            <DollarSign className="h-4 w-4 mr-2" />
            Cập nhật dòng tiền
          </Button>
          <Button size="sm" onClick={generateShiftReport}>
            <FileText className="h-4 w-4 mr-2" />
            Báo cáo ca
          </Button>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng hóa đơn</p>
              <p className="text-2xl font-medium">{stats.totalInvoices}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Doanh thu</p>
              <p className="text-xl font-medium">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tiền mặt</p>
              <p className="text-xl font-medium">{formatPrice(stats.cashRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-amber-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chuyển khoản</p>
              <p className="text-xl font-medium">{formatPrice(stats.transferRevenue)}</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Danh sách hóa đơn</TabsTrigger>
          <TabsTrigger value="products">Top sản phẩm</TabsTrigger>
          <TabsTrigger value="summary">Tổng kết ca</TabsTrigger>
        </TabsList>

        {/* Danh sách hóa đơn */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{invoice.id}</h3>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusText(invoice.status)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(invoice.timestamp)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(invoice.total)}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  {invoice.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Top sản phẩm */}
        <TabsContent value="products" className="space-y-4">
          <Card className="p-4">
            <h3 className="mb-4">Top sản phẩm bán chạy</h3>
            <div className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(product.revenue)}</p>
                    <p className="text-sm text-muted-foreground">{product.quantity} ly</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Tổng kết ca */}
        <TabsContent value="summary" className="space-y-4">
          <Card className="p-4">
            <h3 className="mb-4">Ghi chú báo cáo ca</h3>
            <Textarea
              placeholder="Ghi chú về ca làm: sự cố, khiếu nại, ý kiến..."
              value={shiftNotes}
              onChange={(e) => setShiftNotes(e.target.value)}
              rows={4}
              className="mb-3"
            />
            <Button onClick={() => console.log('Lưu ghi chú:', shiftNotes)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Lưu ghi chú
            </Button>
          </Card>

          <Card className="p-4">
            <h3 className="mb-4">Xuất báo cáo</h3>
            <div className="flex gap-2">
              <Button onClick={() => exportReport('pdf')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button onClick={() => exportReport('excel')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog cập nhật dòng tiền */}
      <Dialog open={showCashFlowDialog} onOpenChange={setShowCashFlowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật dòng tiền ca làm</DialogTitle>
            <DialogDescription>
              Nhập số tiền thực tế để đối chiếu với hệ thống
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tổng tiền mặt thực tế:
              </label>
              <Input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(Number(e.target.value))}
                placeholder="Nhập số tiền mặt"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Theo hệ thống: {formatPrice(stats.cashRevenue)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Tổng chuyển khoản thực tế:
              </label>
              <Input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                placeholder="Nhập số tiền chuyển khoản"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Theo hệ thống: {formatPrice(stats.transferRevenue)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCashFlowDialog(false)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button onClick={updateCashFlow} className="flex-1">
                Cập nhật
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog báo cáo ca */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Báo cáo ca làm - {currentShift.shiftId}</DialogTitle>
            <DialogDescription>
              Tổng kết hoạt động và doanh thu của ca làm việc
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Nhân viên:</p>
                <p className="text-sm">{currentShift.cashier}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Thời gian:</p>
                <p className="text-sm">
                  {formatTime(currentShift.startTime)} - {formatTime(new Date())}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Tổng hóa đơn</p>
                <p className="text-xl font-medium">{stats.totalInvoices}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Doanh thu</p>
                <p className="text-xl font-medium">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Hóa đơn hủy</p>
                <p className="text-xl font-medium">{stats.cancelledInvoices.length}</p>
              </div>
            </div>

            {shiftNotes && (
              <div>
                <p className="text-sm font-medium mb-2">Ghi chú:</p>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{shiftNotes}</p>
              </div>
            )}

            <Button onClick={() => setShowReportDialog(false)} className="w-full">
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}