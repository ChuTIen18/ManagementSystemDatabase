import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Package,
  Wrench,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingDown,
  Eye,
  Edit,
  Save,
  X,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  lastUpdated: Date;
  status: "normal" | "low" | "out";
}

interface EquipmentItem {
  id: string;
  name: string;
  location: string;
  status: "working" | "maintenance" | "broken";
  lastCheck: Date;
  nextMaintenance: Date;
  issues: string[];
}

interface CashFlowSummary {
  date: string;
  cash: number;
  card: number;
  transfer: number;
  total: number;
}

const INVENTORY_DATA: InventoryItem[] = [
  {
    id: "1",
    name: "Cà phê Robusta",
    category: "Nguyên liệu chính",
    currentStock: 5,
    minStock: 10,
    unit: "kg",
    lastUpdated: new Date(),
    status: "low",
  },
  {
    id: "2",
    name: "Sữa tươi",
    category: "Nguyên liệu phụ",
    currentStock: 20,
    minStock: 15,
    unit: "lít",
    lastUpdated: new Date(),
    status: "normal",
  },
  {
    id: "3",
    name: "Đường trắng",
    category: "Nguyên liệu phụ",
    currentStock: 0,
    minStock: 5,
    unit: "kg",
    lastUpdated: new Date(),
    status: "out",
  },
  {
    id: "4",
    name: "Ly nhựa",
    category: "Vật dụng",
    currentStock: 500,
    minStock: 200,
    unit: "cái",
    lastUpdated: new Date(),
    status: "normal",
  },
];

const EQUIPMENT_DATA: EquipmentItem[] = [
  {
    id: "1",
    name: "Máy pha cà phê số 1",
    location: "Quầy bar chính",
    status: "working",
    lastCheck: new Date(2024, 11, 8),
    nextMaintenance: new Date(2024, 11, 15),
    issues: [],
  },
  {
    id: "2",
    name: "Máy xay cà phê",
    location: "Quầy bar chính",
    status: "maintenance",
    lastCheck: new Date(2024, 11, 9),
    nextMaintenance: new Date(2024, 11, 12),
    issues: ["Tiếng ồn bất thường", "Cần thay dao xay"],
  },
  {
    id: "3",
    name: "Tủ lạnh số 2",
    location: "Tầng 2",
    status: "broken",
    lastCheck: new Date(2024, 11, 9),
    nextMaintenance: new Date(2024, 11, 10),
    issues: ["Không làm lạnh", "Cần thay compressor"],
  },
];

const CASH_FLOW_DATA: CashFlowSummary[] = [
  { date: "09/12", cash: 1500000, card: 800000, transfer: 700000, total: 3000000 },
  { date: "08/12", cash: 1200000, card: 900000, transfer: 600000, total: 2700000 },
  { date: "07/12", cash: 1800000, card: 1100000, transfer: 800000, total: 3700000 },
  { date: "06/12", cash: 1600000, card: 850000, transfer: 750000, total: 3200000 },
  { date: "05/12", cash: 1400000, card: 950000, transfer: 650000, total: 3000000 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export function StaffReports() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedMonth, setSelectedMonth] = useState("12");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(INVENTORY_DATA);
  const [equipmentData, setEquipmentData] = useState<EquipmentItem[]>(EQUIPMENT_DATA);
  const [editingInventory, setEditingInventory] = useState<string | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null);
  const [tempInventoryValues, setTempInventoryValues] = useState<Partial<InventoryItem>>({});
  const [tempEquipmentValues, setTempEquipmentValues] = useState<Partial<EquipmentItem>>({});

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
      case "working":
        return <Badge className="bg-green-100 text-green-800">Bình thường</Badge>;
      case "low":
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>;
      case "out":
      case "broken":
        return <Badge className="bg-red-100 text-red-800">Cần xử lý</Badge>;
      default:
        return <Badge variant="secondary">Khác</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
      case "working":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "low":
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "out":
      case "broken":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const updateInventoryStatus = (currentStock: number, minStock: number): InventoryItem['status'] => {
    if (currentStock === 0) return 'out';
    if (currentStock <= minStock) return 'low';
    return 'normal';
  };

  const startEditInventory = (item: InventoryItem) => {
    setEditingInventory(item.id);
    setTempInventoryValues({
      currentStock: item.currentStock,
      minStock: item.minStock,
    });
  };

  const saveInventoryEdit = (itemId: string) => {
    const updatedData = inventoryData.map(item => {
      if (item.id === itemId) {
        const newCurrentStock = tempInventoryValues.currentStock ?? item.currentStock;
        const newMinStock = tempInventoryValues.minStock ?? item.minStock;
        return {
          ...item,
          currentStock: newCurrentStock,
          minStock: newMinStock,
          status: updateInventoryStatus(newCurrentStock, newMinStock),
          lastUpdated: new Date(),
        };
      }
      return item;
    });
    setInventoryData(updatedData);
    setEditingInventory(null);
    setTempInventoryValues({});
  };

  const cancelInventoryEdit = () => {
    setEditingInventory(null);
    setTempInventoryValues({});
  };

  const startEditEquipment = (item: EquipmentItem) => {
    setEditingEquipment(item.id);
    setTempEquipmentValues({
      status: item.status,
      issues: [...item.issues],
    });
  };

  const saveEquipmentEdit = (itemId: string) => {
    const updatedData = equipmentData.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: tempEquipmentValues.status ?? item.status,
          issues: tempEquipmentValues.issues ?? item.issues,
          lastCheck: new Date(),
        };
      }
      return item;
    });
    setEquipmentData(updatedData);
    setEditingEquipment(null);
    setTempEquipmentValues({});
  };

  const cancelEquipmentEdit = () => {
    setEditingEquipment(null);
    setTempEquipmentValues({});
  };

  const getInventoryByCategory = () => {
    const categories = inventoryData.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, InventoryItem[]>);
    return categories;
  };

  const getEquipmentByStatus = () => {
    return equipmentData.reduce((acc, item) => {
      if (!acc[item.status]) {
        acc[item.status] = 0;
      }
      acc[item.status]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const cashFlowPieData = [
    { name: "Tiền mặt", value: CASH_FLOW_DATA[0].cash, color: "#8884d8" },
    { name: "Thẻ", value: CASH_FLOW_DATA[0].card, color: "#82ca9d" },
    { name: "Chuyển khoản", value: CASH_FLOW_DATA[0].transfer, color: "#ffc658" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Báo cáo nhân viên</h2>
          <p className="text-muted-foreground">
            Xem các báo cáo hạn chế dành cho nhân viên
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">Tháng 12, 2024</SelectItem>
            <SelectItem value="11">Tháng 11, 2024</SelectItem>
            <SelectItem value="10">Tháng 10, 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Báo cáo tồn kho</TabsTrigger>
          <TabsTrigger value="equipment">Tình trạng thiết bị</TabsTrigger>
          <TabsTrigger value="cashflow">Dòng tiền</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Inventory Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{inventoryData.length}</p>
                    <p className="text-sm text-gray-600">Tổng mặt hàng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {inventoryData.filter(item => item.status === "normal").length}
                    </p>
                    <p className="text-sm text-gray-600">Đủ hàng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {inventoryData.filter(item => item.status === "low").length}
                    </p>
                    <p className="text-sm text-gray-600">Sắp hết</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {inventoryData.filter(item => item.status === "out").length}
                    </p>
                    <p className="text-sm text-gray-600">Hết hàng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory by Category */}
          {Object.entries(getInventoryByCategory()).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {category}
                </CardTitle>
                <CardDescription>
                  {items.length} mặt hàng trong danh mục này
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          {editingInventory === item.id ? (
                            <div className="mt-2 space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-xs">Tồn kho hiện tại</Label>
                                  <Input
                                    type="number"
                                    value={tempInventoryValues.currentStock ?? item.currentStock}
                                    onChange={(e) => setTempInventoryValues(prev => ({
                                      ...prev,
                                      currentStock: Number(e.target.value)
                                    }))}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Tối thiểu</Label>
                                  <Input
                                    type="number"
                                    value={tempInventoryValues.minStock ?? item.minStock}
                                    onChange={(e) => setTempInventoryValues(prev => ({
                                      ...prev,
                                      minStock: Number(e.target.value)
                                    }))}
                                    className="h-8"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => saveInventoryEdit(item.id)}>
                                  <Save className="h-3 w-3 mr-1" />
                                  Lưu
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelInventoryEdit}>
                                  <X className="h-3 w-3 mr-1" />
                                  Hủy
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">
                              Tồn kho: {item.currentStock} {item.unit} 
                              {item.status === "low" && (
                                <span className="text-yellow-600 ml-2">
                                  (Tối thiểu: {item.minStock} {item.unit})
                                </span>
                              )}
                              {item.status === "out" && (
                                <span className="text-red-600 ml-2">
                                  (Cần nhập hàng: {item.minStock} {item.unit})
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingInventory !== item.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditInventory(item)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          {/* Equipment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Wrench className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{equipmentData.length}</p>
                    <p className="text-sm text-gray-600">Tổng thiết bị</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {getEquipmentByStatus().working || 0}
                    </p>
                    <p className="text-sm text-gray-600">Hoạt động tốt</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {getEquipmentByStatus().maintenance || 0}
                    </p>
                    <p className="text-sm text-gray-600">Cần bảo trì</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {getEquipmentByStatus().broken || 0}
                    </p>
                    <p className="text-sm text-gray-600">Hỏng hóc</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipment List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Danh sách thiết bị hôm nay
              </CardTitle>
              <CardDescription>
                Tình trạng thiết bị được cập nhật hằng ngày vào cuối ca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {equipmentData.map((equipment) => (
                  <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(equipment.status)}
                      <div className="flex-1">
                        <p className="font-medium">{equipment.name}</p>
                        <p className="text-sm text-gray-600">
                          {equipment.location} - Kiểm tra: {equipment.lastCheck.toLocaleDateString()}
                        </p>
                        {editingEquipment === equipment.id ? (
                          <div className="mt-2 space-y-2">
                            <div>
                              <Label className="text-xs">Trạng thái</Label>
                              <Select
                                value={tempEquipmentValues.status ?? equipment.status}
                                onValueChange={(value) => setTempEquipmentValues(prev => ({
                                  ...prev,
                                  status: value as EquipmentItem['status']
                                }))}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="working">Hoạt động tốt</SelectItem>
                                  <SelectItem value="maintenance">Cần bảo trì</SelectItem>
                                  <SelectItem value="broken">Hỏng hóc</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Vấn đề (mỗi dòng một vấn đề)</Label>
                              <textarea
                                className="w-full p-2 border rounded text-xs"
                                rows={2}
                                value={(tempEquipmentValues.issues ?? equipment.issues).join('\n')}
                                onChange={(e) => setTempEquipmentValues(prev => ({
                                  ...prev,
                                  issues: e.target.value.split('\n').filter(issue => issue.trim())
                                }))}
                                placeholder="Nhập các vấn đề..."
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => saveEquipmentEdit(equipment.id)}>
                                <Save className="h-3 w-3 mr-1" />
                                Lưu
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEquipmentEdit}>
                                <X className="h-3 w-3 mr-1" />
                                Hủy
                              </Button>
                            </div>
                          </div>
                        ) : (
                          equipment.issues.length > 0 && (
                            <div className="mt-1">
                              {equipment.issues.map((issue, index) => (
                                <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-1">
                                  {issue}
                                </span>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingEquipment !== equipment.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditEquipment(equipment)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="text-right">
                        {getStatusBadge(equipment.status)}
                        {equipment.status === "maintenance" && (
                          <p className="text-xs text-gray-500 mt-1">
                            Bảo trì: {equipment.nextMaintenance.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          {/* Cash Flow Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {CASH_FLOW_DATA[0].total.toLocaleString()}đ
                    </p>
                    <p className="text-sm text-gray-600">Doanh thu hôm nay</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {CASH_FLOW_DATA[0].cash.toLocaleString()}đ
                    </p>
                    <p className="text-sm text-gray-600">Tiền mặt</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {CASH_FLOW_DATA[0].card.toLocaleString()}đ
                    </p>
                    <p className="text-sm text-gray-600">Thẻ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {CASH_FLOW_DATA[0].transfer.toLocaleString()}đ
                    </p>
                    <p className="text-sm text-gray-600">Chuyển khoản</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Biểu đồ doanh thu 5 ngày gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={CASH_FLOW_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toLocaleString()}đ`]}
                    />
                    <Bar dataKey="cash" fill="#8884d8" name="Tiền mặt" />
                    <Bar dataKey="card" fill="#82ca9d" name="Thẻ" />
                    <Bar dataKey="transfer" fill="#ffc658" name="Chuyển khoản" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ thanh toán hôm nay</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={cashFlowPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {cashFlowPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toLocaleString()}đ`]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions Note */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Lưu ý về báo cáo dòng tiền
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Dữ liệu dòng tiền được cập nhật từ các giao dịch bạn đã nhập trong phần "Xử lý hóa đơn". 
                  Để xem báo cáo chi tiết và phân tích sâu hơn, vui lòng liên hệ quản lý.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}