import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, Edit3, Trash2, Percent, Calendar, Clock } from "lucide-react";

export function PromotionManagement() {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: 'Giảm 20% cho sinh viên',
      description: 'Áp dụng cho sinh viên mang theo thẻ sinh viên',
      discount: 20,
      startDate: '2024-09-01',
      endDate: '2024-09-30',
      status: 'active',
      category: 'student'
    },
    {
      id: 2,
      name: 'Combo 2 đồ uống giảm 15%',
      description: 'Mua combo 2 đồ uống bất kỳ giảm 15%',
      discount: 15,
      startDate: '2024-09-10',
      endDate: '2024-10-10',
      status: 'active',
      category: 'combo'
    }
  ]);

  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    description: '',
    discount: 10,
    startDate: '',
    endDate: '',
    category: 'general'
  });

  const handleAddPromotion = () => {
    if (newPromotion.name && newPromotion.startDate && newPromotion.endDate) {
      const promotion = {
        id: promotions.length + 1,
        ...newPromotion,
        status: 'active'
      };
      setPromotions([...promotions, promotion]);
      setNewPromotion({
        name: '',
        description: '',
        discount: 10,
        startDate: '',
        endDate: '',
        category: 'general'
      });
    }
  };

  const handleUpdatePromotion = () => {
    if (editingPromotion) {
      setPromotions(promotions.map(promo =>
        promo.id === editingPromotion.id ? editingPromotion : promo
      ));
      setEditingPromotion(null);
    }
  };

  const handleDeletePromotion = (id: number) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Quản lý khuyến mãi</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm khuyến mãi
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((promotion) => (
            <div key={promotion.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">{promotion.name}</h3>
                  </div>
                  <Badge variant={getStatusColor(promotion.status)}>
                    {promotion.status === 'active' ? 'Hiệu lực' : promotion.status === 'expired' ? 'Hết hạn' : 'Sắp diễn ra'}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-600">-{promotion.discount}%</span>
                </div>
              </div>

              <p className="text-sm mb-3">{promotion.description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{promotion.startDate} → {promotion.endDate}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingPromotion(promotion)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeletePromotion(promotion.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add/Edit Promotion Form */}
      {editingPromotion && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Chỉnh sửa khuyến mãi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tên khuyến mãi</label>
              <Input
                value={editingPromotion.name}
                onChange={(e) => setEditingPromotion({...editingPromotion, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phần trăm giảm</label>
              <Input
                type="number"
                value={editingPromotion.discount}
                onChange={(e) => setEditingPromotion({...editingPromotion, discount: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Ngày bắt đầu</label>
              <Input
                type="date"
                value={editingPromotion.startDate}
                onChange={(e) => setEditingPromotion({...editingPromotion, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Ngày kết thúc</label>
              <Input
                type="date"
                value={editingPromotion.endDate}
                onChange={(e) => setEditingPromotion({...editingPromotion, endDate: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Mô tả</label>
              <Textarea
                value={editingPromotion.description}
                onChange={(e) => setEditingPromotion({...editingPromotion, description: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleUpdatePromotion}>Lưu thay đổi</Button>
            <Button variant="outline" onClick={() => setEditingPromotion(null)}>Hủy</Button>
          </div>
        </Card>
      )}

      {/* Add New Promotion Form */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Thêm khuyến mãi mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Tên khuyến mãi</label>
            <Input
              placeholder="Nhập tên khuyến mãi"
              value={newPromotion.name}
              onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Phần trăm giảm</label>
            <Input
              type="number"
              placeholder="Nhập phần trăm giảm"
              value={newPromotion.discount}
              onChange={(e) => setNewPromotion({...newPromotion, discount: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Ngày bắt đầu</label>
            <Input
              type="date"
              value={newPromotion.startDate}
              onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Ngày kết thúc</label>
            <Input
              type="date"
              value={newPromotion.endDate}
              onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả khuyến mãi..."
              value={newPromotion.description}
              onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleAddPromotion}>Thêm khuyến mãi</Button>
      </Card>
    </div>
  );
}