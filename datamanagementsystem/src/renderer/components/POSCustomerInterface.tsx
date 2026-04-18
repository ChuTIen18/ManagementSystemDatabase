import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Minus, ShoppingCart, CreditCard, User, Clock } from "lucide-react";

export function POSCustomerInterface() {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('coffee');
  const [tableNumber, setTableNumber] = useState('Bàn 3');

  const menuCategories = [
    { id: 'coffee', name: 'Cà phê', icon: '☕' },
    { id: 'tea', name: 'Trà', icon: '🍵' },
    { id: 'food', name: 'Đồ ăn', icon: '🥐' },
    { id: 'dessert', name: 'Tráng miệng', icon: '🍰' }
  ];

  const menuItems = [
    { id: 1, name: 'Cappuccino', category: 'coffee', price: 45000, image: '/placeholder.jpg' },
    { id: 2, name: 'Latte', category: 'coffee', price: 50000, image: '/placeholder.jpg' },
    { id: 3, name: 'Americano', category: 'coffee', price: 40000, image: '/placeholder.jpg' },
    { id: 4, name: 'Croissant', category: 'food', price: 25000, image: '/placeholder.jpg' },
    { id: 5, name: 'Muffin', category: 'food', price: 35000, image: '/placeholder.jpg' },
    { id: 6, name: 'Trà sữa', category: 'tea', price: 35000, image: '/placeholder.jpg' }
  ];

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: any) => {
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

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    alert(`Thanh toán thành công cho ${tableNumber}!\nTổng cộng: ${calculateTotal().toLocaleString('vi-VN')}₫`);
    setCart([]);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Giao diện gọi món</h2>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <span className="font-medium">{tableNumber}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {menuCategories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div key={item.id} className="border rounded-lg p-4 flex items-center gap-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-green-600 font-medium">
                  {item.price.toLocaleString('vi-VN')}₫
                </p>
              </div>
              <Button size="sm" onClick={() => addToCart(item)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Shopping Cart */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold">Giỏ hàng</h3>
        </div>

        {cart.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Giỏ hàng trống</p>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-green-600 font-medium">
                    {item.price.toLocaleString('vi-VN')}₫ × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <span className="text-red-600">X</span>
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">
                  {calculateTotal().toLocaleString('vi-VN')}₫
                </span>
              </div>
              <Button className="w-full mt-4" onClick={handleCheckout}>
                <CreditCard className="h-4 w-4 mr-2" />
                Thanh toán
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}