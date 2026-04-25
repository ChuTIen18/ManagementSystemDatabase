import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { 
  AlertTriangle, 
  Package, 
  TrendingDown, 
  Plus, 
  Edit, 
  History,
  Search,
  Filter,
  Coffee,
  Milk,
  Zap,
  Cookie
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: 'coffee' | 'milk' | 'syrup' | 'food' | 'supplies';
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  unit: string;
  pricePerUnit: number;
  supplier: string;
  lastUpdated: Date;
  status: 'sufficient' | 'low' | 'out';
}

interface StockTransaction {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  timestamp: Date;
  staff: string;
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'COFFEE001',
      name: 'Cà phê Arabica',
      category: 'coffee',
      currentStock: 25,
      minThreshold: 50,
      maxCapacity: 200,
      unit: 'kg',
      pricePerUnit: 350000,
      supplier: 'Công ty A',
      lastUpdated: new Date(),
      status: 'low'
    },
    {
      id: 'MILK001',
      name: 'Sữa tươi nguyên chất',
      category: 'milk',
      currentStock: 15,
      minThreshold: 20,
      maxCapacity: 100,
      unit: 'lít',
      pricePerUnit: 25000,
      supplier: 'Vinamilk',
      lastUpdated: new Date(),
      status: 'low'
    },
    {
      id: 'SYRUP001',
      name: 'Syrup Vanilla',
      category: 'syrup',
      currentStock: 8,
      minThreshold: 10,
      maxCapacity: 50,
      unit: 'chai',
      pricePerUnit: 45000,
      supplier: 'Công ty B',
      lastUpdated: new Date(),
      status: 'low'
    },
    {
      id: 'SUGAR001',
      name: 'Đường trắng',
      category: 'supplies',
      currentStock: 0,
      minThreshold: 5,
      maxCapacity: 50,
      unit: 'kg',
      pricePerUnit: 18000,
      supplier: 'Công ty C',
      lastUpdated: new Date(),
      status: 'out'
    },
    {
      id: 'COFFEE002',
      name: 'Cà phê Robusta',
      category: 'coffee',
      currentStock: 75,
      minThreshold: 30,
      maxCapacity: 150,
      unit: 'kg',
      pricePerUnit: 280000,
      supplier: 'Công ty A',
      lastUpdated: new Date(),
      status: 'sufficient'
    }
  ]);

  const [transactions] = useState<StockTransaction[]>([
    {
      id: 'TXN001',
      itemId: 'COFFEE001',
      type: 'out',
      quantity: -10,
      reason: 'Sử dụng pha chế',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      staff: 'Nhân viên A'
    },
    {
      id: 'TXN002',
      itemId: 'SUGAR001',
      type: 'out',
      quantity: -5,
      reason: 'Sử dụng pha chế',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      staff: 'Nhân viên B'
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [receiveQuantity, setReceiveQuantity] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = [
    { value: 'coffee', label: 'Cà phê', icon: Coffee },
    { value: 'milk', label: 'Sữa', icon: Milk },
    { value: 'syrup', label: 'Syrup', icon: Zap },
    { value: 'supplies', label: 'Vật tư', icon: Package },
    { value: 'food', label: 'Thực phẩm', icon: Cookie }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'sufficient': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'out': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: InventoryItem['status']) => {
    switch (status) {
      case 'sufficient': return 'Đủ hàng';
      case 'low': return 'Sắp hết';
      case 'out': return 'Hết hàng';
      default: return 'Không xác định';
    }
  };

  const getStockPercentage = (item: InventoryItem) => {
    return Math.max(0, Math.min(100, (item.currentStock / item.maxCapacity) * 100));
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.status === 'low' || item.status === 'out');
  };

  const receiveStock = () => {
    if (selectedItem && receiveQuantity > 0) {
      const updatedInventory = inventory.map(item => 
        item.id === selectedItem.id 
          ? {
              ...item,
              currentStock: Math.min(item.currentStock + receiveQuantity, item.maxCapacity),
              status: (item.currentStock + receiveQuantity) >= item.minThreshold ? 'sufficient' as const : 
                     (item.currentStock + receiveQuantity) > 0 ? 'low' as const : 'out' as const,
              lastUpdated: new Date()
            }
          : item
      );
      
      setInventory(updatedInventory);
      
      // Add transaction record
      const newTransaction: StockTransaction = {
        id: `TXN${Date.now()}`,
        itemId: selectedItem.id,
        type: 'in',
        quantity: receiveQuantity,
        reason: 'Nhập hàng từ nhà cung cấp',
        timestamp: new Date(),
        staff: 'Quản lý'
      };
      
      console.log('Nhập kho:', newTransaction);
      setShowReceiveDialog(false);
      setSelectedItem(null);
      setReceiveQuantity(0);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const createOrder = () => {
    const lowStockItems = getLowStockItems();
    const orderItems = lowStockItems.map(item => ({
      name: item.name,
      needed: item.minThreshold - item.currentStock + 20, // Đặt thêm 20 đơn vị
      supplier: item.supplier
    }));
    
    console.log('Tạo đơn đặt hàng:', orderItems);
    alert(`Đã tạo đơn đặt hàng cho ${orderItems.length} mặt hàng sắp hết`);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header with alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1>Quản lý tồn kho</h1>
            <p className="text-muted-foreground">Theo dõi và quản lý nguyên liệu</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={createOrder} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tạo đơn đặt hàng
            </Button>
            <Button onClick={() => setShowAddDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Thêm mặt hàng
            </Button>
          </div>
        </div>

        {/* Alert banner */}
        {getLowStockItems().length > 0 && (
          <Card className="p-4 border-yellow-200 bg-yellow-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">
                  Cảnh báo thiếu nguyên liệu!
                </p>
                <p className="text-sm text-yellow-700">
                  {getLowStockItems().length} mặt hàng đang sắp hết hoặc đã hết hàng
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={createOrder}>
                Đặt hàng ngay
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nguyên liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Lọc theo danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          <TabsTrigger value="alerts">Cảnh báo ({getLowStockItems().length})</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        {/* Inventory list */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4">
            {filteredInventory.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      {categories.find(c => c.value === item.category)?.icon && (
                        <div className="h-5 w-5">
                          {/* Icon component would be here */}
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.supplier} • Cập nhật {formatDateTime(item.lastUpdated)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tồn kho hiện tại:</span>
                    <span className="font-medium">
                      {item.currentStock} {item.unit}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Tối thiểu: {item.minThreshold}</span>
                      <span>Tối đa: {item.maxCapacity}</span>
                    </div>
                    <Progress value={getStockPercentage(item)} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(item.pricePerUnit)}/{item.unit}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowReceiveDialog(true);
                        }}
                      >
                        <Package className="h-4 w-4 mr-1" />
                        Nhập hàng
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Sửa
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Low stock alerts */}
        <TabsContent value="alerts" className="space-y-4">
          {getLowStockItems().length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-3 text-green-600" />
              <h3 className="font-medium text-green-800 mb-2">Tồn kho ổn định</h3>
              <p className="text-muted-foreground">Tất cả nguyên liệu đều đủ hàng</p>
            </Card>
          ) : (
            getLowStockItems().map((item) => (
              <Card key={item.id} className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <h3 className="font-medium text-red-900">{item.name}</h3>
                      <p className="text-sm text-red-700">
                        Còn {item.currentStock} {item.unit} (tối thiểu: {item.minThreshold})
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowReceiveDialog(true);
                    }}
                  >
                    Nhập hàng ngay
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Transaction history */}
        <TabsContent value="history" className="space-y-4">
          {transactions.map((transaction) => {
            const item = inventory.find(i => i.id === transaction.itemId);
            return (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'in' ? (
                        <TrendingDown className="h-4 w-4 text-green-600 rotate-180" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.reason} • {transaction.staff}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.quantity > 0 ? '+' : ''}{transaction.quantity} {item?.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(transaction.timestamp)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Receive stock dialog */}
      <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nhập hàng - {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Cập nhật số lượng nguyên liệu nhập vào kho
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Tồn kho hiện tại:</span>
                  <span className="font-medium">{selectedItem.currentStock} {selectedItem.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tối thiểu:</span>
                  <span>{selectedItem.minThreshold} {selectedItem.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tối đa:</span>
                  <span>{selectedItem.maxCapacity} {selectedItem.unit}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Số lượng nhập:
                </label>
                <Input
                  type="number"
                  min="1"
                  max={selectedItem.maxCapacity - selectedItem.currentStock}
                  value={receiveQuantity}
                  onChange={(e) => setReceiveQuantity(Number(e.target.value))}
                  placeholder={`Tối đa ${selectedItem.maxCapacity - selectedItem.currentStock} ${selectedItem.unit}`}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReceiveDialog(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={receiveStock}
                  disabled={receiveQuantity <= 0}
                  className="flex-1"
                >
                  Xác nhận nhập
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}