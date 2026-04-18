import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reports } from "./Reports";
import { InventoryManagement } from "./InventoryManagement";
import { EquipmentManagement } from "./EquipmentManagement";
import { CustomerFeedback } from "./CustomerFeedback";
import { PromotionManagement } from "./PromotionManagement";
import { StaffManagement } from "./StaffManagement";
import { FinancialManagement } from "./FinancialManagement";
import { AttendanceApproval } from "./AttendanceApproval";
import { ScheduleOverview } from "./ScheduleOverview";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Package,
  Users,
  Truck,
  DollarSign,
  BarChart3,
  Plus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Settings,
  MessageCircle,
  Percent,
  Gift,
  UserCheck,
  CalendarCheck,
  LogOut
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

export function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("inventory");
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const inventoryItems = [
    { name: 'Hạt cà phê Arabica', current: 25, min: 10, unit: 'kg', status: 'good', cost: 150000 },
    { name: 'Sữa tươi', current: 15, min: 20, unit: 'lít', status: 'low', cost: 35000 },
    { name: 'Đường trắng', current: 8, min: 5, unit: 'kg', status: 'good', cost: 25000 },
    { name: 'Ly giấy size M', current: 2, min: 5, unit: 'thùng', status: 'critical', cost: 180000 }
  ];

  const staffList = [
    { name: 'Nguyễn Văn A', position: 'Barista', shift: 'Sáng', performance: 'excellent', salary: 8000000 },
    { name: 'Trần Thị B', position: 'Thu ngân', shift: 'Chiều', performance: 'good', salary: 7500000 },
    { name: 'Lê Văn C', position: 'Barista', shift: 'Tối', performance: 'average', salary: 7000000 },
    { name: 'Phạm Thị D', position: 'Phục vụ', shift: 'Sáng', performance: 'excellent', salary: 6500000 }
  ];

  const suppliers = [
    { name: 'Công ty Cà phê Việt', category: 'Nguyên liệu', lastOrder: '2024-09-08', status: 'active', debt: 0 },
    { name: 'Nhà cung cấp sữa ABC', category: 'Sữa & kem', lastOrder: '2024-09-10', status: 'active', debt: 500000 },
    { name: 'Bao bì XYZ', category: 'Đóng gói', lastOrder: '2024-09-05', status: 'pending', debt: 200000 }
  ];

  const financialSummary = {
    totalRevenue: 45600000,
    totalExpenses: 28400000,
    netProfit: 17200000,
    profitMargin: 37.7
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bảng điều khiển quản lý</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động kinh doanh</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Đăng xuất
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lợi nhuận tháng</p>
              <p className="text-2xl font-medium">{formatCurrency(financialSummary.netProfit)}</p>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Biên lợi nhuận</p>
              <p className="text-2xl font-medium">{financialSummary.profitMargin}%</p>
            </div>
            <div className="flex items-center text-blue-600">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-9 text-xs">
          <TabsTrigger value="inventory" className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Kho</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">TB</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-1">
            <CalendarCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Lịch & NV</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-1">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">CC</span>
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">NCC</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">TC</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">ĐG</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex items-center gap-1">
            <Percent className="h-4 w-4" />
            <span className="hidden sm:inline">KM</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">BC</span>
          </TabsTrigger>
        </TabsList>

        {/* Quản lý kho hàng */}
        <TabsContent value="inventory">
          <InventoryManagement />
        </TabsContent>

        {/* Quản lý thiết bị */}
        <TabsContent value="equipment">
          <EquipmentManagement />
        </TabsContent>

        {/* Tổng quan lịch và quản lý nhân viên */}
        <TabsContent value="schedule">
          <ScheduleOverview />
        </TabsContent>

        {/* Duyệt chấm công */}
        <TabsContent value="attendance">
          <AttendanceApproval />
        </TabsContent>

        {/* Quản lý nhà cung cấp */}
        <TabsContent value="suppliers" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3>Nhà cung cấp</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm NCC
              </Button>
            </div>
            <div className="space-y-3">
              {suppliers.map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">{supplier.name}</span>
                      <Badge variant="outline">{supplier.category}</Badge>
                      <Badge className={getStatusColor(supplier.status)}>
                        {supplier.status === 'active' && 'Hoạt động'}
                        {supplier.status === 'pending' && 'Chờ xử lý'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Đơn gần nhất: {new Date(supplier.lastOrder).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">
                      {supplier.debt > 0 ? formatCurrency(supplier.debt) : 'Đã thanh toán'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Quản lý tài chính */}
        <TabsContent value="finance">
          <FinancialManagement />
        </TabsContent>

        {/* Quản lý khuyến mãi */}
        <TabsContent value="promotions">
          <PromotionManagement />
        </TabsContent>

        {/* Đánh giá khách hàng */}
        <TabsContent value="feedback">
          <CustomerFeedback
            mode="staff-view"
            existingFeedback={[
              {
                id: 'FB001',
                invoiceId: 'INV001',
                customerName: 'Nguyễn Văn A',
                overallRating: 5,
                serviceRating: 5,
                foodRating: 4,
                atmosphereRating: 5,
                comments: 'Dịch vụ tuyệt vời, nhân viên thân thiện!',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                status: 'completed'
              },
              {
                id: 'FB002',
                invoiceId: 'INV002',
                customerName: 'Trần Thị B',
                overallRating: 4,
                serviceRating: 4,
                foodRating: 4,
                atmosphereRating: 4,
                comments: 'Cà phê ngon, không gian đẹp',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                status: 'completed'
              }
            ]}
          />
        </TabsContent>

        {/* Báo cáo */}
        <TabsContent value="reports">
          <Reports />
        </TabsContent>
      </Tabs>
    </div>
  );
}