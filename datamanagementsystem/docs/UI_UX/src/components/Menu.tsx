import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Menu() {
  const categories = ["Tất cả", "Cà phê", "Trà", "Bánh ngọt", "Món ăn nhẹ"];
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const menuItems = [
    {
      id: 1,
      name: "Cappuccino",
      category: "Cà phé",
      price: "45,000₫",
      description: "Espresso với sữa nóng và bọt sữa mịn",
      image: "coffee cappuccino",
      available: true,
      sales: 23
    },
    {
      id: 2,
      name: "Americano",
      category: "Cà phé",
      price: "35,000₫",
      description: "Espresso pha loãng với nước nóng",
      image: "coffee americano black",
      available: true,
      sales: 18
    },
    {
      id: 3,
      name: "Latte",
      category: "Cà phé",
      price: "48,000₫",
      description: "Espresso với nhiều sữa nóng và một chút bọt",
      image: "coffee latte art",
      available: false,
      sales: 31
    },
    {
      id: 4,
      name: "Trà xanh",
      category: "Trà",
      price: "25,000₫",
      description: "Trà xanh Thái Nguyên thơm ngon",
      image: "green tea cup",
      available: true,
      sales: 12
    },
    {
      id: 5,
      name: "Bánh croissant",
      category: "Bánh ngọt",
      price: "30,000₫",
      description: "Bánh sừng bò bơ thơm giòn",
      image: "croissant pastry",
      available: true,
      sales: 8
    },
    {
      id: 6,
      name: "Cheesecake",
      category: "Bánh ngọt",
      price: "55,000₫",
      description: "Bánh phô mai New York truyền thống",
      image: "cheesecake slice",
      available: true,
      sales: 15
    }
  ];

  const filteredItems = selectedCategory === "Tất cả" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1>Menu quán</h1>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Thêm món
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1500522144261-ea64433bbe27?w=100&h=100&fit=crop`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-lg font-medium text-primary">{item.price}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <Badge variant={item.available ? "default" : "secondary"}>
                    {item.available ? "Còn hàng" : "Hết hàng"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{item.sales} đã bán</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Thêm import useState
import { useState } from "react";