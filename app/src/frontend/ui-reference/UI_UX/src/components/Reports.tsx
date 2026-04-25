import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DatePickerWithRange } from "./ui/date-range-picker";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  FileText, 
  Users, 
  Download,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  StickyNote,
  Warehouse,
  Coffee,
  Activity
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from "recharts";

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [reportNotes, setReportNotes] = useState("");
  const [compareMode, setCompareMode] = useState(false);

  // Dữ liệu mẫu cho báo cáo
  const revenueData = [
    { name: 'T2', revenue: 2400000, orders: 45 },
    { name: 'T3', revenue: 1398000, orders: 32 },
    { name: 'T4', revenue: 3200000, orders: 58 },
    { name: 'T5', revenue: 2780000, orders: 49 },
    { name: 'T6', revenue: 4590000, orders: 78 },
    { name: 'T7', revenue: 5200000, orders: 89 },
    { name: 'CN', revenue: 4800000, orders: 82 }
  ];

  const productData = [
    { name: 'Cappuccino', value: 35, sales: 1200000 },
    { name: 'Americano', value: 25, sales: 800000 },
    { name: 'Latte', value: 20, sales: 950000 },
    { name: 'Espresso', value: 15, sales: 450000 },
    { name: 'Khác', value: 5, sales: 200000 }
  ];

  const stockData = [
    { item: 'Hạt cà phê Arabica', current: 25, min: 10, unit: 'kg', status: 'good' },
    { item: 'Sữa tươi', current: 15, min: 20, unit: 'lít', status: 'low' },
    { item: 'Đường', current: 8, min: 5, unit: 'kg', status: 'good' },
    { item: 'Ly giấy', current: 2, min: 5, unit: 'thùng', status: 'critical' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    // Giả lập xuất báo cáo
    alert(`Đang xuất báo cáo dưới định dạng ${format.toUpperCase()}...`);
  };

  const saveReportNotes = () => {
    console.log('Lưu ghi chú báo cáo:', reportNotes);
    alert('Ghi chú báo cáo đã được lưu!');
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Báo cáo</h1>
          <p className="text-muted-foreground">Thống kê và phân tích dữ liệu</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {compareMode ? 'Tắt so sánh' : 'So sánh'}
          </Button>
        </div>
      </div>

      {/* Bộ lọc */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Label>Khoảng thời gian:</Label>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
              <SelectItem value="custom">Tùy chọn</SelectItem>
            </SelectContent>
          </Select>
          
          {compareMode && (
            <Badge variant="secondary" className="ml-2">
              So sánh với cùng kỳ năm trước
            </Badge>
          )}
        </div>
      </Card>

      {/* Tabs cho các loại báo cáo */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="inventory">Kho hàng</TabsTrigger>
          <TabsTrigger value="staff">Nhân sự</TabsTrigger>
          <TabsTrigger value="operations">Hoạt động</TabsTrigger>
        </TabsList>

        {/* Báo cáo doanh thu */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Doanh thu tuần</p>
                  <p className="text-2xl font-medium">24.368.000₫</p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+12.5%</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đơn hàng</p>
                  <p className="text-2xl font-medium">433</p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+8.2%</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Giá trị TB/đơn</p>
                  <p className="text-2xl font-medium">56.300₫</p>
                </div>
                <div className="flex items-center text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">-2.1%</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="mb-4">Biểu đồ doanh thu theo ngày</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Doanh thu']} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* Báo cáo sản phẩm */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="mb-4">Tỷ lệ bán theo sản phẩm</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="mb-4">Top sản phẩm bán chạy</h3>
              <div className="space-y-3">
                {productData.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.sales)}</p>
                      <p className="text-sm text-muted-foreground">{product.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Báo cáo kho hàng */}
        <TabsContent value="inventory" className="space-y-4">
          <Card className="p-4">
            <h3 className="mb-4">Tình trạng nguyên liệu trong kho</h3>
            <div className="space-y-3">
              {stockData.map((item) => (
                <div key={item.item} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Warehouse className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.item}</p>
                      <p className="text-sm text-muted-foreground">Tối thiểu: {item.min} {item.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium">{item.current} {item.unit}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'good' && 'Đủ'}
                      {item.status === 'low' && 'Ít'}
                      {item.status === 'critical' && 'Cần bổ sung'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Báo cáo nhân sự */}
        <TabsContent value="staff" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="mb-4">Thống kê chấm công</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Tổng nhân viên</span>
                  <span className="font-medium">12 người</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Có mặt hôm nay</span>
                  <span className="font-medium text-green-600">10 người</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Vắng mặt</span>
                  <span className="font-medium text-red-600">2 người</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Giờ làm việc TB/người</span>
                  <span className="font-medium">7.5 giờ</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="mb-4">Hiệu suất làm việc</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Đơn hàng xử lý/người</span>
                  <span className="font-medium">36 đơn</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Thời gian TB/đơn</span>
                  <span className="font-medium">4.2 phút</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Đánh giá khách hàng</span>
                  <span className="font-medium text-yellow-600">4.7/5 ⭐</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Báo cáo hoạt động */}
        <TabsContent value="operations" className="space-y-4">
          <Card className="p-4">
            <h3 className="mb-4">Tình trạng đồ uống và quán</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Trạng thái bàn</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Tổng số bàn</span>
                    <span className="font-medium">20 bàn</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Đang phục vụ</span>
                    <span className="font-medium text-blue-600">12 bàn</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Trống</span>
                    <span className="font-medium text-green-600">8 bàn</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tỷ lệ lấp đầy</span>
                    <span className="font-medium">60%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Đánh giá dịch vụ</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Chất lượng đồ uống</span>
                    <span className="font-medium">4.8/5 ⭐</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tốc độ phục vụ</span>
                    <span className="font-medium">4.5/5 ⭐</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Thái độ nhân viên</span>
                    <span className="font-medium">4.7/5 ⭐</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Không gian quán</span>
                    <span className="font-medium">4.6/5 ⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ghi chú báo cáo */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <StickyNote className="h-5 w-5" />
          <h3>Ghi chú báo cáo</h3>
        </div>
        <Textarea
          placeholder="Thêm ghi chú, nhận xét hoặc đề xuất cho báo cáo này..."
          value={reportNotes}
          onChange={(e) => setReportNotes(e.target.value)}
          rows={4}
          className="mb-3"
        />
        <Button onClick={saveReportNotes} size="sm">
          Lưu ghi chú
        </Button>
      </Card>

      {/* Xuất báo cáo */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3>Xuất báo cáo</h3>
            <p className="text-sm text-muted-foreground">Tải báo cáo dưới các định dạng khác nhau</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => exportReport('pdf')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button onClick={() => exportReport('excel')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}