import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Plus, 
  Percent, 
  Gift, 
  Calendar, 
  Target, 
  Coffee, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: "percentage" | "fixed_amount" | "buy_x_get_y" | "free_item";
  value: number;
  minOrderAmount?: number;
  applicableItems?: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
}

const mockPromotions: Promotion[] = [
  {
    id: "PROMO001",
    name: "Giảm giá cuối tuần",
    description: "Giảm 15% cho tất cả đồ uống vào cuối tuần",
    type: "percentage",
    value: 15,
    minOrderAmount: 100000,
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-31"),
    isActive: true,
    usageCount: 45,
    maxUsage: 100
  },
  {
    id: "PROMO002", 
    name: "Mua 2 tặng 1",
    description: "Mua 2 cà phê bất kỳ được tặng 1 cà phê đen",
    type: "buy_x_get_y",
    value: 2,
    applicableItems: ["Cà phê đen", "Cà phê sữa", "Cappuccino"],
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-15"),
    isActive: true,
    usageCount: 23,
    maxUsage: 50
  },
  {
    id: "PROMO003",
    name: "Giảm 30k cho đơn từ 200k",
    description: "Giảm 30.000đ cho hóa đơn từ 200.000đ trở lên",
    type: "fixed_amount",
    value: 30000,
    minOrderAmount: 200000,
    startDate: new Date("2024-11-15"),
    endDate: new Date("2024-11-30"),
    isActive: false,
    usageCount: 67,
    maxUsage: 100
  }
];

export function PromotionManagement() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "percentage" as Promotion["type"],
    value: 0,
    minOrderAmount: 0,
    startDate: "",
    endDate: "",
    maxUsage: 0
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const getPromotionTypeLabel = (type: Promotion["type"]) => {
    switch (type) {
      case "percentage": return "Giảm theo %";
      case "fixed_amount": return "Giảm cố định";
      case "buy_x_get_y": return "Mua X tặng Y";
      case "free_item": return "Tặng món";
      default: return type;
    }
  };

  const getPromotionValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case "percentage": return `${promotion.value}%`;
      case "fixed_amount": return formatCurrency(promotion.value);
      case "buy_x_get_y": return `Mua ${promotion.value} tặng 1`;
      case "free_item": return "Tặng món";
      default: return promotion.value.toString();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "percentage",
      value: 0,
      minOrderAmount: 0,
      startDate: "",
      endDate: "",
      maxUsage: 0
    });
  };

  const handleCreatePromotion = () => {
    const newPromotion: Promotion = {
      id: `PROMO${String(promotions.length + 1).padStart(3, '0')}`,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      value: formData.value,
      minOrderAmount: formData.minOrderAmount || undefined,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      isActive: true,
      usageCount: 0,
      maxUsage: formData.maxUsage || undefined
    };

    setPromotions([newPromotion, ...promotions]);
    setShowCreateDialog(false);
    resetForm();
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name,
      description: promotion.description,
      type: promotion.type,
      value: promotion.value,
      minOrderAmount: promotion.minOrderAmount || 0,
      startDate: promotion.startDate.toISOString().split('T')[0],
      endDate: promotion.endDate.toISOString().split('T')[0],
      maxUsage: promotion.maxUsage || 0
    });
  };

  const handleUpdatePromotion = () => {
    if (!editingPromotion) return;

    const updatedPromotions = promotions.map(p => 
      p.id === editingPromotion.id 
        ? {
            ...p,
            name: formData.name,
            description: formData.description,
            type: formData.type,
            value: formData.value,
            minOrderAmount: formData.minOrderAmount || undefined,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
            maxUsage: formData.maxUsage || undefined
          }
        : p
    );

    setPromotions(updatedPromotions);
    setEditingPromotion(null);
    resetForm();
  };

  const togglePromotionStatus = (id: string) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const deletePromotion = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  const activePromotions = promotions.filter(p => p.isActive);
  const expiredPromotions = promotions.filter(p => !p.isActive || new Date() > p.endDate);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Quản lý khuyến mãi</h1>
          <p className="text-muted-foreground">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo khuyến mãi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
              <DialogDescription>
                Thiết lập thông tin chi tiết cho chương trình khuyến mãi
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tên khuyến mãi</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nhập tên khuyến mãi"
                  />
                </div>
                <div>
                  <Label>Loại khuyến mãi</Label>
                  <Select value={formData.type} onValueChange={(value: Promotion["type"]) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Giảm theo %</SelectItem>
                      <SelectItem value="fixed_amount">Giảm cố định</SelectItem>
                      <SelectItem value="buy_x_get_y">Mua X tặng Y</SelectItem>
                      <SelectItem value="free_item">Tặng món</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Mô tả chi tiết về khuyến mãi"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>
                    {formData.type === "percentage" ? "Giá trị (%)" : 
                     formData.type === "fixed_amount" ? "Số tiền giảm" :
                     formData.type === "buy_x_get_y" ? "Số lượng mua" : "Giá trị"}
                  </Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Đơn hàng tối thiểu</Label>
                  <Input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ngày bắt đầu</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Ngày kết thúc</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Giới hạn sử dụng (để trống nếu không giới hạn)</Label>
                <Input
                  type="number"
                  value={formData.maxUsage}
                  onChange={(e) => setFormData({...formData, maxUsage: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                Hủy
              </Button>
              <Button onClick={handleCreatePromotion} className="flex-1" disabled={!formData.name || !formData.startDate || !formData.endDate}>
                Tạo khuyến mãi
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              <p className="text-2xl font-medium">{activePromotions.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng lượt sử dụng</p>
              <p className="text-2xl font-medium">{promotions.reduce((sum, p) => sum + p.usageCount, 0)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đã hết hạn</p>
              <p className="text-2xl font-medium">{expiredPromotions.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Promotions List */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Đang hoạt động ({activePromotions.length})</TabsTrigger>
          <TabsTrigger value="all">Tất cả ({promotions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activePromotions.length === 0 ? (
            <Card className="p-8 text-center">
              <Gift className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">Chưa có khuyến mãi nào đang hoạt động</p>
            </Card>
          ) : (
            activePromotions.map((promotion) => (
              <Card key={promotion.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{promotion.name}</h3>
                        <Badge variant={promotion.isActive ? "default" : "secondary"}>
                          {promotion.isActive ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                        <Badge variant="outline">{getPromotionTypeLabel(promotion.type)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{promotion.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Percent className="h-4 w-4 text-blue-600" />
                          <span>Giá trị: {getPromotionValue(promotion)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span>{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-purple-600" />
                          <span>Đã dùng: {promotion.usageCount}{promotion.maxUsage ? `/${promotion.maxUsage}` : ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPromotion(promotion)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={promotion.isActive ? "secondary" : "default"}
                        size="sm"
                        onClick={() => togglePromotionStatus(promotion.id)}
                      >
                        {promotion.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePromotion(promotion.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{promotion.name}</h3>
                      <Badge variant={promotion.isActive ? "default" : "secondary"}>
                        {promotion.isActive ? "Hoạt động" : "Tạm dừng"}
                      </Badge>
                      <Badge variant="outline">{getPromotionTypeLabel(promotion.type)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{promotion.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Percent className="h-4 w-4 text-blue-600" />
                        <span>Giá trị: {getPromotionValue(promotion)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span>{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-purple-600" />
                        <span>Đã dùng: {promotion.usageCount}{promotion.maxUsage ? `/${promotion.maxUsage}` : ""}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPromotion(promotion)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={promotion.isActive ? "secondary" : "default"}
                      size="sm"
                      onClick={() => togglePromotionStatus(promotion.id)}
                    >
                      {promotion.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePromotion(promotion.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingPromotion} onOpenChange={(open) => !open && setEditingPromotion(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết cho chương trình khuyến mãi
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên khuyến mãi</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nhập tên khuyến mãi"
                />
              </div>
              <div>
                <Label>Loại khuyến mãi</Label>
                <Select value={formData.type} onValueChange={(value: Promotion["type"]) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Giảm theo %</SelectItem>
                    <SelectItem value="fixed_amount">Giảm cố định</SelectItem>
                    <SelectItem value="buy_x_get_y">Mua X tặng Y</SelectItem>
                    <SelectItem value="free_item">Tặng món</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Mô tả chi tiết về khuyến mãi"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>
                  {formData.type === "percentage" ? "Giá trị (%)" : 
                   formData.type === "fixed_amount" ? "Số tiền giảm" :
                   formData.type === "buy_x_get_y" ? "Số lượng mua" : "Giá trị"}
                </Label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Đơn hàng tối thiểu</Label>
                <Input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ngày bắt đầu</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Ngày kết thúc</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label>Giới hạn sử dụng</Label>
              <Input
                type="number"
                value={formData.maxUsage}
                onChange={(e) => setFormData({...formData, maxUsage: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditingPromotion(null)} className="flex-1">
              Hủy
            </Button>
            <Button onClick={handleUpdatePromotion} className="flex-1" disabled={!formData.name || !formData.startDate || !formData.endDate}>
              Cập nhật
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}