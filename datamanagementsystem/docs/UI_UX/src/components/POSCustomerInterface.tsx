import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Plus, Minus, Star, QrCode, Coffee, Cookie, IceCream, Leaf, Maximize2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { POSCustomerInterfaceFullscreen } from "./POSCustomerInterfaceFullscreen";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  image: string;
  category: string;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  available: boolean;
}

export function POSCustomerInterface() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemNotes, setItemNotes] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Cappuccino",
      category: "coffee",
      price: 45000,
      description: "Espresso với sữa nóng và bọt sữa mịn",
      image: "https://images.unsplash.com/photo-1652432751749-4d6085441aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtZW51JTIwZHJpbmtzfGVufDF8fHx8MTc1NzUwMzEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: true
    },
    {
      id: 2,
      name: "Americano",
      category: "coffee",
      price: 35000,
      description: "Espresso pha loãng với nước nóng",
      image: "https://images.unsplash.com/photo-1652432751749-4d6085441aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtZW51JTIwZHJpbmtzfGVufDF8fHx8MTc1NzUwMzEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: true
    },
    {
      id: 3,
      name: "Latte",
      category: "coffee",
      price: 48000,
      description: "Espresso với nhiều sữa nóng và một chút bọt",
      image: "https://images.unsplash.com/photo-1652432751749-4d6085441aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtZW51JTIwZHJpbmtzfGVufDF8fHx8MTc1NzUwMzEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: true
    },
    {
      id: 4,
      name: "Trà xanh",
      category: "tea",
      price: 25000,
      description: "Trà xanh Thái Nguyên thơm ngon",
      image: "https://images.unsplash.com/photo-1652432751749-4d6085441aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtZW51JTIwZHJpbmtzfGVufDF8fHx8MTc1NzUwMzEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: true
    },
    {
      id: 5,
      name: "Bánh croissant",
      category: "pastry",
      price: 30000,
      description: "Bánh sừng bò bơ thơm giòn",
      image: "https://images.unsplash.com/photo-1652432751749-4d6085441aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtZW51JTIwZHJpbmtzfGVufDF8fHx8MTc1NzUwMzEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: true
    },
    {
      id: 6,
      name: "Kem vani",
      category: "dessert",
      price: 35000,
      description: "Kem vani thơm ngon mát lạnh",
      image: "https://images.unsplash.com/photo-1652432751749-4d6085441aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtZW51JTIwZHJpbmtzfGVufDF8fHx8MTc1NzUwMzEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      available: true
    }
  ];

  const categories = [
    { id: "coffee", name: "Cà phê", icon: Coffee },
    { id: "tea", name: "Trà", icon: Leaf },
    { id: "pastry", name: "Bánh ngọt", icon: Cookie },
    { id: "dessert", name: "Tráng miệng", icon: IceCream }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const addToOrder = (item: MenuItem) => {
    setSelectedItem(item);
    setItemNotes("");
  };

  const confirmAddItem = () => {
    if (!selectedItem) return;

    const existingItem = orderItems.find(orderItem => 
      orderItem.id === selectedItem.id && orderItem.notes === itemNotes
    );
    
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem => 
        orderItem.id === selectedItem.id && orderItem.notes === itemNotes
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setOrderItems([...orderItems, {
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: 1,
        notes: itemNotes,
        image: selectedItem.image,
        category: selectedItem.category
      }]);
    }
    
    setSelectedItem(null);
    setItemNotes("");
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    } else {
      setOrderItems(orderItems.map((item, i) => 
        i === index ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const submitOrder = () => {
    if (orderItems.length === 0) return;
    
    console.log('Đơn hàng từ khách:', {
      items: orderItems,
      total: getTotalAmount(),
      timestamp: new Date()
    });
    
    setOrderComplete(true);
    // Gửi đơn hàng đến hệ thống quản lý đơn hàng
  };

  const submitFeedback = () => {
    console.log('Đánh giá từ khách:', {
      rating,
      feedback: feedbackText,
      timestamp: new Date()
    });
    
    setShowFeedback(false);
    alert('Cảm ơn bạn đã đánh giá! Vui lòng đưa phiếu khuyến mãi cho nhân viên tại quầy.');
  };

  if (isFullscreen) {
    return (
      <POSCustomerInterfaceFullscreen
        onBack={() => setIsFullscreen(false)}
        tableNumber="B05"
        editingOrder={orderItems.length > 0 ? { items: orderItems } : null}
      />
    );
  }

  if (orderComplete) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 to-orange-100">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-medium mb-4">Đơn hàng đã được gửi!</h2>
          <p className="text-muted-foreground mb-6">
            Đơn hàng của bạn đang được xử lý. Vui lòng chờ nhân viên xác nhận.
          </p>
          
          <div className="mb-6">
            <QrCode className="h-16 w-16 mx-auto mb-3 text-primary" />
            <p className="text-sm text-muted-foreground">
              Quét mã QR để đánh giá dịch vụ
            </p>
          </div>

          <Button 
            onClick={() => setShowFeedback(true)}
            className="w-full mb-4"
          >
            Đánh giá ngay
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setOrderComplete(false);
              setOrderItems([]);
            }}
            className="w-full"
          >
            Đặt đơn mới
          </Button>
        </Card>

        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Đánh giá dịch vụ</DialogTitle>
              <DialogDescription>
                Chia sẻ trải nghiệm của bạn để chúng tôi cải thiện dịch vụ
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Mức độ hài lòng:</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Nhận xét:</p>
                <Textarea
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={submitFeedback} className="w-full">
                Gửi đánh giá
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Menu bên trái */}
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium mb-2">Coffee House Menu</h1>
            <p className="text-muted-foreground">Chọn món yêu thích của bạn</p>
          </div>
          <Button variant="outline" onClick={() => setIsFullscreen(true)}>
            <Maximize2 className="h-4 w-4 mr-2" />
            Phóng to
          </Button>
        </div>

        <Tabs defaultValue="coffee" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-2 gap-4">
                {menuItems
                  .filter(item => item.category === category.id)
                  .map((item) => (
                    <Card 
                      key={item.id} 
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToOrder(item)}
                    >
                      <div className="aspect-video mb-3 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-primary">
                          {formatPrice(item.price)}
                        </span>
                        <Button size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Đơn hàng bên phải */}
      <div className="w-96 bg-muted/30 border-l p-6">
        <h2 className="text-xl font-medium mb-4">Đơn hàng của bạn</h2>
        
        <div className="space-y-4 mb-6">
          {orderItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Chưa có món nào được chọn
            </p>
          ) : (
            orderItems.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        Ghi chú: {item.notes}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {orderItems.length > 0 && (
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Tổng cộng:</span>
                <span className="text-xl font-medium text-primary">
                  {formatPrice(getTotalAmount())}
                </span>
              </div>
            </div>

            <Button onClick={submitOrder} className="w-full" size="lg">
              Gửi đơn hàng
            </Button>
          </div>
        )}
      </div>

      {/* Dialog thêm ghi chú */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm vào đơn hàng</DialogTitle>
            <DialogDescription>
              Thêm ghi chú đặc biệt cho món này nếu cần
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {selectedItem.description}
                  </p>
                  <p className="font-medium text-primary">
                    {formatPrice(selectedItem.price)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Ghi chú đặc biệt (tùy chọn):
                </label>
                <Textarea
                  placeholder="Ví dụ: ít đá, ít đường, thêm sữa..."
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedItem(null)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button onClick={confirmAddItem} className="flex-1">
                  Thêm vào đơn
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}