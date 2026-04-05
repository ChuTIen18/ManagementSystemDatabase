import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input"; 
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Star, ThumbsUp, Gift, Coffee, Users, Utensils, MapPin } from "lucide-react";

interface FeedbackData {
  id: string;
  invoiceId: string;
  customerName?: string;
  customerPhone?: string;
  overallRating: number;
  serviceRating: number;
  foodRating: number;
  atmosphereRating: number;
  comments: string;
  timestamp: Date;
  status: 'pending' | 'completed';
}

interface CustomerFeedbackProps {
  invoiceId?: string;
  mode?: 'customer' | 'staff-view';
  existingFeedback?: FeedbackData[];
  onSubmitFeedback?: (feedback: FeedbackData) => void;
}

export function CustomerFeedback({ 
  invoiceId = "INV001", 
  mode = 'customer',
  existingFeedback = [],
  onSubmitFeedback 
}: CustomerFeedbackProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [overallRating, setOverallRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [atmosphereRating, setAtmosphereRating] = useState(5);
  const [comments, setComments] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ratingCategories = [
    { key: 'service', name: 'Chất lượng phục vụ', icon: Users, rating: serviceRating, setRating: setServiceRating },
    { key: 'food', name: 'Chất lượng đồ uống', icon: Coffee, rating: foodRating, setRating: setFoodRating },
    { key: 'atmosphere', name: 'Không gian quán', icon: MapPin, rating: atmosphereRating, setRating: setAtmosphereRating }
  ];

  const renderStars = (rating: number, onRate?: (rating: number) => void, size = 'md') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate && onRate(star)}
            disabled={!onRate}
            className={`${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star 
              className={`${starSize} ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = () => {
    const feedback: FeedbackData = {
      id: `FB${Date.now()}`,
      invoiceId,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      overallRating,
      serviceRating,
      foodRating,
      atmosphereRating,
      comments,
      timestamp: new Date(),
      status: 'completed'
    };

    if (onSubmitFeedback) {
      onSubmitFeedback(feedback);
    }

    console.log('Đánh giá từ khách hàng:', feedback);
    setIsSubmitted(true);
  };

  const getAverageRating = (feedbacks: FeedbackData[]) => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, fb) => sum + fb.overallRating, 0);
    return (total / feedbacks.length).toFixed(1);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Customer feedback form
  if (mode === 'customer') {
    if (isSubmitted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="max-w-md p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <ThumbsUp className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-medium">Cảm ơn bạn!</h2>
              <p className="text-muted-foreground">
                Đánh giá của bạn đã được ghi nhận. Vui lòng đưa màn hình này cho nhân viên để nhận phiếu khuyến mãi.
              </p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Phiếu khuyến mãi</span>
                </div>
                <p className="text-sm text-amber-700">Giảm 10% cho lần mua tiếp theo</p>
                <p className="text-xs text-amber-600 mt-1">
                  Mã: FEEDBACK{invoiceId}
                </p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="max-w-md p-6">
          <div className="space-y-6">
            <div className="text-center">
              <Coffee className="h-12 w-12 mx-auto mb-3 text-amber-600" />
              <h2 className="text-2xl font-medium">Đánh giá dịch vụ</h2>
              <p className="text-muted-foreground">
                Mã hóa đơn: <span className="font-medium">{invoiceId}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tên khách hàng (tùy chọn)</Label>
                  <Input
                    placeholder="Nhập tên của bạn"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Số điện thoại (tùy chọn)</Label>
                  <Input
                    placeholder="Số điện thoại"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Đánh giá tổng thể:</Label>
                <div className="flex items-center justify-center">
                  {renderStars(overallRating, setOverallRating)}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Đánh giá chi tiết:</Label>
                {ratingCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      {renderStars(category.rating, category.setRating, 'sm')}
                    </div>
                  );
                })}
              </div>

              <div>
                <Label>Nhận xét thêm:</Label>
                <Textarea
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <Button onClick={handleSubmit} className="w-full" size="lg">
                Gửi đánh giá
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Staff view of all feedback
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Đánh giá khách hàng</h1>
          <p className="text-muted-foreground">Xem và quản lý phản hồi từ khách hàng</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-medium text-amber-600">
              {getAverageRating(existingFeedback)}⭐
            </p>
            <p className="text-sm text-muted-foreground">Điểm trung bình</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-medium">{existingFeedback.length}</p>
            <p className="text-sm text-muted-foreground">Đánh giá</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Gần đây</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {existingFeedback.length === 0 ? (
            <Card className="p-8 text-center">
              <Coffee className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">Chưa có đánh giá nào</p>
            </Card>
          ) : (
            existingFeedback.map((feedback) => (
              <Card key={feedback.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {renderStars(feedback.overallRating, undefined, 'sm')}
                        <Badge variant="outline">{feedback.invoiceId}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(feedback.timestamp)}
                        {feedback.customerName && ` • ${feedback.customerName}`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Phục vụ</p>
                      <div className="flex justify-center mt-1">
                        {renderStars(feedback.serviceRating, undefined, 'sm')}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Đồ uống</p>
                      <div className="flex justify-center mt-1">
                        {renderStars(feedback.foodRating, undefined, 'sm')}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Không gian</p>
                      <div className="flex justify-center mt-1">
                        {renderStars(feedback.atmosphereRating, undefined, 'sm')}
                      </div>
                    </div>
                  </div>

                  {feedback.comments && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">{feedback.comments}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-medium text-green-600">
                {existingFeedback.filter(f => f.overallRating >= 4).length}
              </p>
              <p className="text-sm text-muted-foreground">Đánh giá tích cực</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-medium text-amber-600">
                {(existingFeedback.reduce((sum, f) => sum + f.serviceRating, 0) / Math.max(existingFeedback.length, 1)).toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Điểm phục vụ</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-medium text-blue-600">
                {(existingFeedback.reduce((sum, f) => sum + f.foodRating, 0) / Math.max(existingFeedback.length, 1)).toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Điểm đồ uống</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-medium text-purple-600">
                {(existingFeedback.reduce((sum, f) => sum + f.atmosphereRating, 0) / Math.max(existingFeedback.length, 1)).toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Điểm không gian</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}