import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Receipt,
  DollarSign,
  Building,
  FileBarChart,
  CreditCard,
  Banknote,
  Save,
  Send,
} from "lucide-react";

interface CashFlowEntry {
  id: string;
  type: "cash" | "card" | "transfer";
  amount: number;
  description: string;
  time: string;
}

interface ShiftReport {
  id: string;
  date: Date;
  shift: string;
  totalOrders: number;
  totalRevenue: number;
  cashFlow: CashFlowEntry[];
  floor: string;
  notes: string;
}

const FLOORS = [
  { id: "1", name: "Tầng 1", tables: 20 },
  { id: "2", name: "Tầng 2", tables: 15 },
  { id: "3", name: "Tầng 3 (VIP)", tables: 8 },
];

export function StaffInvoiceProcessing() {
  const [activeTab, setActiveTab] = useState("cash-flow");
  const [cashFlowEntries, setCashFlowEntries] = useState<CashFlowEntry[]>([
    {
      id: "1",
      type: "cash",
      amount: 150000,
      description: "Thanh toán hóa đơn #001",
      time: "09:30",
    },
    {
      id: "2",
      type: "card",
      amount: 250000,
      description: "Thanh toán hóa đơn #002",
      time: "10:15",
    },
  ]);

  const [newCashFlow, setNewCashFlow] = useState({
    type: "cash" as "cash" | "card" | "transfer",
    amount: "",
    description: "",
  });

  const [floorUpdate, setFloorUpdate] = useState({
    invoiceId: "",
    floor: "",
    tableNumber: "",
    status: "occupied" as "occupied" | "available" | "cleaning",
  });

  const [shiftReports] = useState<ShiftReport[]>([
    {
      id: "1",
      date: new Date(2024, 11, 9),
      shift: "Ca sáng",
      totalOrders: 45,
      totalRevenue: 2750000,
      cashFlow: [],
      floor: "Tầng 1",
      notes: "Không có vấn đề gì",
    },
  ]);

  const handleAddCashFlow = () => {
    if (!newCashFlow.amount || !newCashFlow.description) return;

    const entry: CashFlowEntry = {
      id: Date.now().toString(),
      type: newCashFlow.type,
      amount: Number(newCashFlow.amount),
      description: newCashFlow.description,
      time: new Date().toLocaleTimeString("vi-VN", { 
        hour: "2-digit", 
        minute: "2-digit" 
      }),
    };

    setCashFlowEntries([...cashFlowEntries, entry]);
    setNewCashFlow({ type: "cash", amount: "", description: "" });
  };

  const handleFloorUpdate = () => {
    if (!floorUpdate.invoiceId || !floorUpdate.floor || !floorUpdate.tableNumber) return;
    
    // Simulate floor update
    alert(`Đã cập nhật: Hóa đơn ${floorUpdate.invoiceId} - ${floorUpdate.floor}, Bàn ${floorUpdate.tableNumber} (${floorUpdate.status})`);
    setFloorUpdate({ invoiceId: "", floor: "", tableNumber: "", status: "occupied" });
  };

  const generateShiftReport = () => {
    const totalCash = cashFlowEntries.filter(e => e.type === "cash").reduce((sum, e) => sum + e.amount, 0);
    const totalCard = cashFlowEntries.filter(e => e.type === "card").reduce((sum, e) => sum + e.amount, 0);
    const totalTransfer = cashFlowEntries.filter(e => e.type === "transfer").reduce((sum, e) => sum + e.amount, 0);
    
    return {
      totalOrders: cashFlowEntries.length,
      totalRevenue: totalCash + totalCard + totalTransfer,
      cashRevenue: totalCash,
      cardRevenue: totalCard,
      transferRevenue: totalTransfer,
      entries: cashFlowEntries,
    };
  };

  const reportData = generateShiftReport();

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "cash":
        return <Banknote className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "transfer":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getPaymentLabel = (type: string) => {
    switch (type) {
      case "cash":
        return "Tiền mặt";
      case "card":
        return "Thẻ";
      case "transfer":
        return "Chuyển khoản";
      default:
        return "Khác";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cash-flow">Cập nhật dòng tiền</TabsTrigger>
          <TabsTrigger value="floor-update">Cập nhật tầng</TabsTrigger>
          <TabsTrigger value="shift-report">Báo cáo cuối ca</TabsTrigger>
        </TabsList>

        <TabsContent value="cash-flow" className="space-y-4">
          {/* Add Cash Flow Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Thêm giao dịch mới
              </CardTitle>
              <CardDescription>
                Cập nhật các giao dịch thanh toán trong ca làm việc
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Loại thanh toán</Label>
                  <Select value={newCashFlow.type} onValueChange={(value: any) => setNewCashFlow({...newCashFlow, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Tiền mặt</SelectItem>
                      <SelectItem value="card">Thẻ</SelectItem>
                      <SelectItem value="transfer">Chuyển khoản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Số tiền</Label>
                  <Input
                    type="number"
                    placeholder="Nhập số tiền"
                    value={newCashFlow.amount}
                    onChange={(e) => setNewCashFlow({...newCashFlow, amount: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Mô tả</Label>
                  <Input
                    placeholder="Mô tả giao dịch"
                    value={newCashFlow.description}
                    onChange={(e) => setNewCashFlow({...newCashFlow, description: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleAddCashFlow} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Thêm giao dịch
              </Button>
            </CardContent>
          </Card>

          {/* Cash Flow List */}
          <Card>
            <CardHeader>
              <CardTitle>Dòng tiền trong ca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cashFlowEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getPaymentIcon(entry.type)}
                      <div>
                        <p className="font-medium">{entry.description}</p>
                        <p className="text-sm text-gray-600">
                          {getPaymentLabel(entry.type)} - {entry.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        +{entry.amount.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                ))}
                {cashFlowEntries.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Chưa có giao dịch nào trong ca này
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt dòng tiền</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {reportData.cashRevenue.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">Tiền mặt</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {reportData.cardRevenue.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">Thẻ</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {reportData.transferRevenue.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">Chuyển khoản</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {reportData.totalRevenue.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">Tổng cộng</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="floor-update" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Cập nhật thông tin tầng
              </CardTitle>
              <CardDescription>
                Cập nhật hóa đơn thuộc tầng nào để tính chỗ trống của cửa hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Mã hóa đơn</Label>
                  <Input
                    placeholder="Nhập mã hóa đơn"
                    value={floorUpdate.invoiceId}
                    onChange={(e) => setFloorUpdate({...floorUpdate, invoiceId: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Tầng</Label>
                  <Select value={floorUpdate.floor} onValueChange={(value) => setFloorUpdate({...floorUpdate, floor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tầng" />
                    </SelectTrigger>
                    <SelectContent>
                      {FLOORS.map((floor) => (
                        <SelectItem key={floor.id} value={floor.name}>
                          {floor.name} ({floor.tables} bàn)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Số bàn</Label>
                  <Input
                    placeholder="Nhập số bàn"
                    value={floorUpdate.tableNumber}
                    onChange={(e) => setFloorUpdate({...floorUpdate, tableNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Trạng thái bàn</Label>
                  <Select value={floorUpdate.status} onValueChange={(value: any) => setFloorUpdate({...floorUpdate, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="occupied">Có khách</SelectItem>
                      <SelectItem value="available">Trống</SelectItem>
                      <SelectItem value="cleaning">Đang dọn dẹp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleFloorUpdate} className="w-full">
                <Building className="h-4 w-4 mr-2" />
                Cập nhật thông tin tầng
              </Button>
            </CardContent>
          </Card>

          {/* Floor Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Tình trạng các tầng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {FLOORS.map((floor) => (
                  <div key={floor.id} className="p-4 border rounded-lg">
                    <div className="text-center">
                      <h3 className="font-medium">{floor.name}</h3>
                      <p className="text-2xl font-bold text-blue-600">{floor.tables}</p>
                      <p className="text-sm text-gray-600">Tổng số bàn</p>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
                        <span>Có khách</span>
                      </div>
                      <div className="text-center">
                        <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
                        <span>Trống</span>
                      </div>
                      <div className="text-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-1"></div>
                        <span>Dọn dẹp</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shift-report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBarChart className="h-5 w-5" />
                Báo cáo cuối ca
              </CardTitle>
              <CardDescription>
                Tạo báo cáo tổng kết ca làm việc và gửi cho quản lý
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Shift Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Receipt className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{reportData.totalOrders}</p>
                  <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {reportData.totalRevenue.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">Tổng doanh thu</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Banknote className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">
                    {reportData.cashRevenue.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">Tiền mặt</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">
                    {(reportData.cardRevenue + reportData.transferRevenue).toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">Không tiền mặt</p>
                </div>
              </div>

              {/* Report Actions */}
              <div className="flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <FileBarChart className="h-4 w-4 mr-2" />
                      Xem báo cáo chi tiết
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Báo cáo chi tiết ca làm việc</DialogTitle>
                      <DialogDescription>
                        Báo cáo cho ca: {new Date().toLocaleDateString()} - Ca hiện tại
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Tổng quan</h4>
                          <div className="space-y-1 text-sm">
                            <p>Tổng đơn hàng: {reportData.totalOrders}</p>
                            <p>Tổng doanh thu: {reportData.totalRevenue.toLocaleString()}đ</p>
                            <p>Tiền mặt: {reportData.cashRevenue.toLocaleString()}đ</p>
                            <p>Thẻ: {reportData.cardRevenue.toLocaleString()}đ</p>
                            <p>Chuyển khoản: {reportData.transferRevenue.toLocaleString()}đ</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Chi tiết giao dịch</h4>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {reportData.entries.map((entry) => (
                              <div key={entry.id} className="text-xs p-2 bg-gray-50 rounded">
                                <div className="flex justify-between">
                                  <span>{entry.description}</span>
                                  <span>{entry.amount.toLocaleString()}đ</span>
                                </div>
                                <div className="text-gray-500">
                                  {getPaymentLabel(entry.type)} - {entry.time}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Gửi báo cáo cho quản lý
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Previous Shift Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử báo cáo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shiftReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileBarChart className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {report.date.toLocaleDateString()} - {report.shift}
                        </p>
                        <p className="text-sm text-gray-600">
                          {report.totalOrders} đơn - {report.totalRevenue.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      Đã gửi
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}