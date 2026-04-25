import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { 
  Plus, 
  Minus, 
  Coffee, 
  ShoppingCart,
  Star,
  ArrowLeft,
  Trash2,
  Check
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  rating: number;
  isAvailable: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
  note?: string;
}

interface POSCustomerInterfaceFullscreenProps {
  onBack: () => void;
  tableNumber?: string;
  editingOrder?: any;
}

export function POSCustomerInterfaceFullscreen({ 
  onBack, 
  tableNumber = "B05",
  editingOrder 
}: POSCustomerInterfaceFullscreenProps) {
  const [selectedCategory, setSelectedCategory] = useState("coffee");
  const [cart, setCart] = useState<CartItem[]>(editingOrder?.items || []);
  const [orderNote, setOrderNote] = useState(editingOrder?.note || "");

  // Mock menu data
  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Cà phê đen",
      price: 25000,
      category: "coffee",
      description: "Cà phê đen đậm đà, thơm ngon",
      rating: 4.5,
      isAvailable: true
    },
    {
      id: "2", 
      name: "Cà phê sữa",
      price: 30000,
      category: "coffee",
      description: "Cà phê pha với sữa đặc",
      rating: 4.8,
      isAvailable: true
    },
    {
      id: "3",
      name: "Cappuccino",
      price: 45000,
      category: "coffee",
      description: "Cà phê espresso với sữa bọt",
      rating: 4.7,
      isAvailable: true
    },
    {
      id: "4",
      name: "Latte",
      price: 42000,
      category: "coffee", 
      description: "Cà phê espresso với nhiều sữa",
      rating: 4.6,
      isAvailable: true
    },
    {
      id: "5",
      name: "Americano",
      price: 35000,
      category: "coffee",
      description: "Cà phê espresso pha loãng",
      rating: 4.4,
      isAvailable: false
    },
    {
      id: "6",
      name: "Bánh mì thịt nướng", 
      price: 45000,
      category: "food",
      description: "Bánh mì giòn với thịt nướng thơm ngon",
      rating: 4.6,
      isAvailable: true
    },
    {
      id: "7",
      name: "Bánh croissant",
      price: 35000,
      category: "food",
      description: "Bánh croissant bơ thơm ngon",
      rating: 4.3,
      isAvailable: true
    },
    {
      id: "8",
      name: "Trà đào cam sả",
      price: 38000,
      category: "tea",
      description: "Trà thảo mộc với đào tươi",
      rating: 4.5,
      isAvailable: true
    },
    {
      id: "9",
      name: "Trà xanh matcha",
      price: 42000,
      category: "tea",
      description: "Trà xanh matcha cao cấp",
      rating: 4.7,
      isAvailable: true
    }
  ];

  const categories = [
    { id: "coffee", name: "Cà phê", icon: Coffee },
    { id: "tea", name: "Trà", icon: Coffee },
    { id: "food", name: "Đồ ăn", icon: Coffee }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const clearCart = () => {
    setCart([]);
    setOrderNote("");
  };

  const updateItemNote = (itemId: string, note: string) => {
    setCart(cart.map(cartItem => 
      cartItem.id === itemId ? { ...cartItem, note } : cartItem
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const handleSubmitOrder = () => {
    if (cart.length === 0) return;
    
    // Logic xử lý đặt hàng
    console.log("Đơn hàng:", {
      table: tableNumber,
      items: cart,
      note: orderNote,
      total: getCartTotal()
    });
    
    alert(`Đã gửi đơn hàng cho ${tableNumber}!`);
    clearCart();
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-medium">Gọi món - {tableNumber}</h1>
            <p className="text-sm text-muted-foreground">
              {editingOrder ? "Chỉnh sửa đơn hàng" : "Tạo đơn hàng mới"}
            </p>
          </div>
        </div>
        <Badge variant="outline">
          {getCartItemCount()} món
        </Badge>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Menu Section */}
        <div className="flex-1 flex flex-col">
          {/* Category Tabs */}
          <div className="bg-white border-b px-4 py-2">
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className={!item.isAvailable ? "opacity-50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{item.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-lg">{formatCurrency(item.price)}</span>
                      <Button 
                        size="sm" 
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {!item.isAvailable && (
                      <Badge variant="secondary" className="mt-2">
                        Hết món
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-80 bg-white border-l flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Đơn hàng của bạn</h3>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chưa có món nào</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Chọn món từ menu để thêm vào đơn hàng
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(item.price)}/món
                        </span>
                      </div>
                      
                      <Input
                        placeholder="Ghi chú cho món này..."
                        value={item.note || ""}
                        onChange={(e) => updateItemNote(item.id, e.target.value)}
                        className="text-xs"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t space-y-4">
              <Textarea
                placeholder="Ghi chú cho đơn hàng..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                rows={2}
              />
              
              <div className="flex justify-between items-center py-2 border-t">
                <span className="font-medium">Tổng cộng:</span>
                <span className="font-bold text-lg">{formatCurrency(getCartTotal())}</span>
              </div>
              
              <Button onClick={handleSubmitOrder} className="w-full">
                <Check className="h-4 w-4 mr-2" />
                {editingOrder ? "Cập nhật đơn hàng" : "Gửi đơn hàng"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}