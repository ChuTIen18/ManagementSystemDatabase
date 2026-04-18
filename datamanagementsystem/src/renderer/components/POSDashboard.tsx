import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { POSCustomerInterface } from "./POSCustomerInterface";
import { CustomerFeedback } from "./CustomerFeedback";
import { POSFeedback } from "./POSFeedback";
import { Menu } from "./Menu";
import { OrderManagement } from "./OrderManagement";
import { OnlineOrderEntry } from "./OnlineOrderEntry";
import { PromotionManagement } from "./PromotionManagement";
import { ShiftInvoiceManagement } from "./ShiftInvoiceManagement";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Store,
  Star,
  Coffee,
  Users,
  Clock,
  TrendingUp,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Settings,
  ShoppingCart,
  FileText,
  Menu as MenuIcon,
  Gift,
  Send,
  Smartphone,
  LogOut
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

export function POSDashboard() {
  const [activeTab, setActiveTab] = useState("customer");
  const [newRating, setNewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const todayStats = {
    totalOrders: 45,
    revenue: 2400000,
    avgRating: 4.7,
    tableOccupancy: 75
  };

  const operationStatus = [
    { name: 'Máy pha cà phê #1', status: 'active', lastMaintenance: '2 ngày trước' },
    { name: 'Máy pha cà phê #2', status: 'maintenance', lastMaintenance: 'Đang bảo trì' },
    { name: 'Máy xay cà phê', status: 'active', lastMaintenance: '1 tuần trước' },
    { name: 'Hệ thống âm thanh', status: 'active', lastMaintenance: '3 ngày trước' },
    { name: 'Điều hòa không khí', status: 'warning', lastMaintenance: '2 tuần trước' }
  ];

  // Mock feedback data
  const feedbackData = [
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
      status: 'completed' as const
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
      status: 'completed' as const
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'warning': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const submitReview = () => {
    if (reviewText.trim()) {
      console.log('Đánh giá mới:', { rating: newRating, review: reviewText });
      setReviewText("");
      alert('Cảm ơn bạn đã gửi đánh giá!');
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Máy POS - Quản lý cửa hàng</h1>
          <p className="text-muted-foreground">Theo dõi hoạt động và dịch vụ</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Trạng thái</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Hoạt động</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Đăng xuất
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đơn hàng hôm nay</p>
              <p className="text-2xl font-medium">{todayStats.totalOrders}</p>
            </div>
            <Coffee className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đánh giá TB</p>
              <p className="text-2xl font-medium">{todayStats.avgRating}/5 ⭐</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 text-xs">
          <TabsTrigger value="customer" className="flex items-center gap-1">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Gọi món</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Đơn tại quán</span>
          </TabsTrigger>
          <TabsTrigger value="online" className="flex items-center gap-1">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Đơn online</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Hóa đơn</span>
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-1">
            <MenuIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Menu</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex items-center gap-1">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">KM</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-1">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Phản hồi</span>
          </TabsTrigger>
        </TabsList>

        {/* Giao diện gọi món cho khách */}
        <TabsContent value="customer">
          <POSCustomerInterface />
        </TabsContent>

        {/* Quản lý đơn hàng tại quán */}
        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>

        {/* Đơn hàng trực tuyến */}
        <TabsContent value="online">
          <OnlineOrderEntry />
        </TabsContent>

        {/* Xử lý hóa đơn (có cập nhật theo tầng) */}
        <TabsContent value="invoices">
          <ShiftInvoiceManagement />
        </TabsContent>

        {/* Chỉnh sửa menu */}
        <TabsContent value="menu">
          <Menu />
        </TabsContent>

        {/* Quản lý khuyến mãi */}
        <TabsContent value="promotions">
          <PromotionManagement />
        </TabsContent>

        {/* Gửi phản hồi (thiếu nguyên liệu/máy móc trục trặc/thiếu người) */}
        <TabsContent value="feedback">
          <POSFeedback />
        </TabsContent>
      </Tabs>
    </div>
  );
}