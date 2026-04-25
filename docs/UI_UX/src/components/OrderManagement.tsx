import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { POSCustomerInterfaceFullscreen } from "./POSCustomerInterfaceFullscreen";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Printer, 
  CreditCard, 
  Banknote,
  ShoppingCart,
  Smartphone,
  AlertCircle
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface Order {
  id: string;
  type: 'dine-in' | 'online';
  status: 'pending' | 'confirmed' | 'editing' | 'payment' | 'making' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
  customerInfo?: {
    name?: string;
    phone?: string;
  };
  timestamp: Date;
  assignedCashier?: string;
  paymentMethod?: 'cash' | 'transfer';
  discount?: {
    type: string;
    amount: number;
  };
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'DI001',
      type: 'dine-in',
      status: 'pending',
      items: [
        { id: 1, name: 'Cappuccino', price: 45000, quantity: 2 },
        { id: 2, name: 'Croissant', price: 30000, quantity: 1 }
      ],
      total: 120000,
      timestamp: new Date(),
    },
    {
      id: 'ON002',
      type: 'online',
      status: 'confirmed',
      items: [
        { id: 3, name: 'Americano', price: 35000, quantity: 1 },
        { id: 4, name: 'Latte', price: 48000, quantity: 1 }
      ],
      total: 83000,
      customerInfo: {
        name: 'Nguyễn Văn A',
        phone: '0123456789'
      },
      timestamp: new Date(Date.now() - 300000), // 5 phút trước
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [discountType, setDiscountType] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const promotions = [
    { id: 'NEW_CUSTOMER', name: 'Khách hàng mới', type: 'percentage', value: 10 },
    { id: 'HAPPY_HOUR', name: 'Happy Hour', type: 'percentage', value: 15 },
    { id: 'STUDENT', name: 'Sinh viên', type: 'percentage', value: 5 },
    { id: 'FIXED_10K', name: 'Giảm 10k', type: 'fixed', value: 10000 }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const confirmOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const requestEdit = (order: Order) => {
    updateOrderStatus(order.id, 'editing');
    setEditingOrder(order);
  };

  const applyDiscount = () => {
    if (selectedOrder && discountType) {
      const promotion = promotions.find(p => p.id === discountType);
      if (promotion) {
        const discountValue = promotion.type === 'percentage' 
          ? (selectedOrder.total * promotion.value) / 100
          : promotion.value;

        const updatedOrder = {
          ...selectedOrder,
          discount: {
            type: promotion.name,
            amount: discountValue
          },
          total: selectedOrder.total - discountValue
        };

        setOrders(orders.map(order => 
          order.id === selectedOrder.id ? updatedOrder : order
        ));

        setSelectedOrder(updatedOrder);
      }
    }
    setShowDiscountDialog(false);
    setDiscountType("");
  };

  const processPayment = (method: 'cash' | 'transfer') => {
    if (selectedOrder) {
      const updatedOrder = {
        ...selectedOrder,
        paymentMethod: method,
        status: 'making' as const,
        assignedCashier: 'Nhân viên A'
      };

      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? updatedOrder : order
      ));

      // In hóa đơn
      printReceipts(updatedOrder);
      setSelectedOrder(null);
    }
  };

  const printReceipts = (order: Order) => {
    console.log('In hóa đơn:', {
      customer: order,
      kitchen: {
        ...order,
        note: 'Bản dành cho quầy pha chế'
      }
    });
    alert(`Đã in 2 bản hóa đơn cho đơn ${order.id}`);
  };

  const cancelOrder = (order: Order) => {
    if (confirm(`Bạn có chắc muốn hủy đơn ${order.id}?`)) {
      updateOrderStatus(order.id, 'cancelled');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'editing': return 'bg-orange-100 text-orange-800';
      case 'payment': return 'bg-purple-100 text-purple-800';
      case 'making': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'editing': return 'Đang chỉnh sửa';
      case 'payment': return 'Chờ thanh toán';
      case 'making': return 'Đang pha chế';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const activeOrders = orders.filter(order => 
    !['completed', 'cancelled'].includes(order.status)
  );

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1>Quản lý đơn hàng</h1>
          <p className="text-muted-foreground">Xử lý đơn hàng tại quán và trực tuyến</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {activeOrders.length} đơn đang xử lý
        </Badge>
      </div>

      <Tabs defaultValue="dine-in" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dine-in" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Đơn tại quán
          </TabsTrigger>
          <TabsTrigger value="online" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Đơn trực tuyến
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dine-in" className="space-y-4">
          {orders.filter(order => order.type === 'dine-in').map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">Đơn #{order.id}</h3>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(order.timestamp)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.total)}</p>
                  {order.discount && (
                    <p className="text-sm text-green-600">
                      Giảm {formatPrice(order.discount.amount)}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => confirmOrder(order)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Xác nhận
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => requestEdit(order)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Yêu cầu sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => cancelOrder(order)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Hủy đơn
                    </Button>
                  </>
                )}

                {order.status === 'making' && order.paymentMethod && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Đang pha chế - Thanh toán {order.paymentMethod === 'cash' ? 'tiền mặt' : 'chuyển khoản'}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="online" className="space-y-4">
          {orders.filter(order => order.type === 'online').map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">Đơn #{order.id}</h3>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(order.timestamp)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.total)}</p>
                </div>
              </div>

              {order.customerInfo && (
                <div className="bg-muted/50 p-3 rounded-lg mb-3">
                  <p className="text-sm">
                    <strong>Khách hàng:</strong> {order.customerInfo.name}
                  </p>
                  <p className="text-sm">
                    <strong>SĐT:</strong> {order.customerInfo.phone}
                  </p>
                </div>
              )}

              <div className="space-y-2 mb-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {order.status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Hoàn thành
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Dialog xác nhận đơn hàng */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận đơn hàng #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Xem lại chi tiết đơn hàng và chọn phương thức thanh toán
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Chi tiết đơn hàng:</h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                  {selectedOrder.discount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Đã giảm ({selectedOrder.discount.type}):</span>
                      <span>-{formatPrice(selectedOrder.discount.amount)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDiscountDialog(true)}
                  className="w-full"
                >
                  Áp dụng khuyến mãi
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => processPayment('cash')}
                    className="flex items-center gap-2"
                  >
                    <Banknote className="h-4 w-4" />
                    Tiền mặt
                  </Button>
                  <Button
                    onClick={() => processPayment('transfer')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Chuyển khoản
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog khuyến mãi */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Áp dụng khuyến mãi</DialogTitle>
            <DialogDescription>
              Chọn khuyến mãi phù hợp để áp dụng cho đơn hàng
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={discountType} onValueChange={setDiscountType}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khuyến mãi" />
              </SelectTrigger>
              <SelectContent>
                {promotions.map((promo) => (
                  <SelectItem key={promo.id} value={promo.id}>
                    {promo.name} - {promo.type === 'percentage' ? `${promo.value}%` : formatPrice(promo.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDiscountDialog(false)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={applyDiscount}
                disabled={!discountType}
                className="flex-1"
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chỉnh sửa đơn hàng fullscreen */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-background">
          <POSCustomerInterfaceFullscreen
            onBack={() => setEditingOrder(null)}
            tableNumber={editingOrder.type === 'dine-in' ? 'B05' : 'Online'}
            editingOrder={editingOrder}
          />
        </div>
      )}
    </div>
  );
}