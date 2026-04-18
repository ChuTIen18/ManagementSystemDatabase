import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, Edit3, Trash2, Search, Package } from "lucide-react";

export function Menu() {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Cappuccino',
      category: 'Cà phê',
      price: 45000,
      description: 'Cà phê pha máy với sữa đặc',
      status: 'available',
      image: '/placeholder.jpg'
    },
    {
      id: 2,
      name: 'Latte',
      category: 'Cà phê',
      price: 50000,
      description: 'Cà phê pha máy với sữa tươi',
      status: 'available',
      image: '/placeholder.jpg'
    },
    {
      id: 3,
      name: 'Croissant',
      category: 'Bánh mì',
      price: 25000,
      description: 'Bánh mì nướng với nhân butter',
      status: 'available',
      image: '/placeholder.jpg'
    },
    {
      id: 4,
      name: 'Muffin',
      category: 'Bánh ngọt',
      price: 35000,
      description: 'Bánh muffin nướng với trái cây',
      status: 'unavailable',
      image: '/placeholder.jpg'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: 0,
    description: ''
  });

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.price > 0) {
      const item = {
        id: menuItems.length + 1,
        ...newItem,
        status: 'available',
        image: '/placeholder.jpg'
      };
      setMenuItems([...menuItems, item]);
      setNewItem({ name: '', category: '', price: 0, description: '' });
    }
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      setMenuItems(menuItems.map(item =>
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Quản lý menu</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm món
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{item.name}</h3>
                  <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                    {item.status === 'available' ? 'Có sẵn' : 'Không có'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                <p className="text-sm mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add/Edit Item Form */}
      {editingItem && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Chỉnh sửa món ăn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tên món</label>
              <Input
                value={editingItem.name}
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Danh mục</label>
              <Input
                value={editingItem.category}
                onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Giá</label>
              <Input
                type="number"
                value={editingItem.price}
                onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Trạng thái</label>
              <select
                value={editingItem.status}
                onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="available">Có sẵn</option>
                <option value="unavailable">Không có</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Mô tả</label>
              <Textarea
                value={editingItem.description}
                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleUpdateItem}>Lưu thay đổi</Button>
            <Button variant="outline" onClick={() => setEditingItem(null)}>Hủy</Button>
          </div>
        </Card>
      )}

      {/* Add New Item Form */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Thêm món mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Tên món</label>
            <Input
              placeholder="Nhập tên món"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Danh mục</label>
            <Input
              placeholder="Nhập danh mục"
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Giá</label>
            <Input
              type="number"
              placeholder="Nhập giá"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleAddItem}>Thêm món</Button>
      </Card>
    </div>
  );
}