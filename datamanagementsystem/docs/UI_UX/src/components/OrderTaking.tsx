import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, Minus, ShoppingCart, Users, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface Table {
  id: number;
  number: string;
  seats: number;
  status: string;
}

export function OrderTaking() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [showCart, setShowCart] = useState(false);

  const availableTables: Table[] = [
    { id: 1, number: "Bàn 2", seats: 2, status: "available" },
    { id: 2, number: "Bàn 5", seats: 2, status: "available" },
    { id: 3, number: "Bàn 8", seats: 8, status: "available" },
    { id: 4, number: "Bàn 9", seats: 4, status: "available" }
  ];

  const menuItems = [
    {
      id: 1,
      name: "Cappuccino",
      category: "Cà phê",
      price: 45000,
      description: "Espresso với sữa nóng và bọt sữa mịn",
      available: true
    },
    {
      id: 2,
      name: "Americano",
      category: "Cà phê",
      price: 35000,
      description: "Espresso pha loãng với nước nóng",
      available: true
    },
    {
      id: 3,
      name: "Latte",
      category: "Cà phê",
      price: 48000,
      description: "Espresso với nhiều sữa nóng và một chút bọt",
      available: true
    },
    {
      id: 4,
      name: "Trà xanh",
      category: "Trà",
      price: 25000,
      description: "Trà xanh Thái Nguyên thơm ngon",
      available: true
    },
    {
      id: 5,
      name: "Bánh croissant",
      category: "Bánh ngọt",
      price: 30000,
      description: "Bánh sừng bò bơ thơm giòn",
      available: true
    },
    {
      id: 6,
      name: "Cheesecake",
      category: "Bánh ngọt",
      price: 55000,
      description: "Bánh phô mai New York truyền thống",
      available: true
    }
  ];

  const addToOrder = (item: typeof menuItems[0]) => {
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem => 
        orderItem.id === item.id 
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setOrderItems([...orderItems, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    } else {
      setOrderItems(orderItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const handleSubmitOrder = () => {
    if (!selectedTable || orderItems.length === 0) return;
    
    console.log('Đơn hàng mới:', {
      table: availableTables.find(t => t.id === selectedTable),
      customer: customerName,
      items: orderItems,
      notes: orderNotes,
      total: getTotalAmount()
    });
    
    // Reset form
    setSelectedTable(null);
    setOrderItems([]);
    setCustomerName("");
    setOrderNotes("");
    setShowCart(false);
    
    alert('Đơn hàng đã được tạo thành công!');
  };

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <h1>Tạo đơn hàng</h1>
        {totalItems > 0 && (
          <Button 
            onClick={() => setShowCart(!showCart)}
            className="relative"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Giỏ hàng
            <Badge className="ml-2 bg-white text-primary">
              {totalItems}
            </Badge>
          </Button>
        )}
      </div>

      {/* Chọn bàn */}
      <Card className="p-4">
        <h3 className="mb-3">1. Chọn bàn</h3>
        <div className="grid grid-cols-2 gap-2">
          {availableTables.map((table) => (
            <Button
              key={table.id}
              variant={selectedTable === table.id ? "default" : "outline"}
              className="p-3 h-auto flex flex-col items-center"
              onClick={() => setSelectedTable(table.id)}
            >
              <div className="flex items-center gap-1 mb-1">
                <Users className="h-4 w-4" />
                <span>{table.number}</span>
              </div>
              <span className="text-xs">{table.seats} chỗ ngồi</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Thông tin khách hàng */}
      {selectedTable && (
        <Card className="p-4">
          <h3 className="mb-3">2. Thông tin khách hàng</h3>
          <Input
            placeholder="Tên khách hàng (tùy chọn)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </Card>
      )}

      {/* Menu */}
      {selectedTable && (
        <Card className="p-4">
          <h3 className="mb-3">3. Chọn món</h3>
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1652432751749-4d6085441aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtZW51JTIwZHJpbmtzfGVufDF8fHx8MTc1NzUwMzEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                  <p className="font-medium text-primary">{formatPrice(item.price)}</p>
                </div>

                <Button
                  onClick={() => addToOrder(item)}
                  size="sm"
                  disabled={!item.available}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Giỏ hàng */}
      {showCart && orderItems.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3>Giỏ hàng</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCart(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="ml-4 text-right">
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Tổng cộng:</span>
              <span className="font-medium text-lg text-primary">
                {formatPrice(getTotalAmount())}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Ghi chú và xác nhận */}
      {orderItems.length > 0 && (
        <Card className="p-4 space-y-4">
          <div>
            <h3 className="mb-3">4. Ghi chú đặc biệt</h3>
            <Textarea
              placeholder="Ghi chú cho đơn hàng (tùy chọn)"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Bàn:</span>
                <span className="font-medium">
                  {availableTables.find(t => t.id === selectedTable)?.number}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Số món:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Tổng tiền:</span>
                <span className="text-primary">{formatPrice(getTotalAmount())}</span>
              </div>
            </div>

            <Button 
              onClick={handleSubmitOrder}
              className="w-full"
              size="lg"
              disabled={!selectedTable || orderItems.length === 0}
            >
              Xác nhận đơn hàng
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}