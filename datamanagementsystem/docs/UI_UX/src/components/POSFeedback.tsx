import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertTriangle,
  Users,
  Package,
  Wrench,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";

interface FeedbackItem {
  id: string;
  type: "ingredient" | "equipment" | "staff";
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description: string;
  location?: string;
  equipmentId?: string;
  timestamp: Date;
  status: "pending" | "acknowledged" | "resolved";
  response?: string;
}

const PRIORITY_COLORS = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800", 
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const FEEDBACK_TEMPLATES = {
  ingredient: [
    "Hết nguyên liệu cà phê",
    "Sữa tươi sắp hết",
    "Đường hết",
    "Syrup vị [tên vị] hết",
    "Ly nhựa/giấy sắp hết",
    "Khác",
  ],
  equipment: [
    "Máy pha cà phê không hoạt động",
    "Máy xay cà phê bị kẹt",
    "Tủ lạnh không làm lạnh",
    "Máy POS gặp sự cố",
    "Âm thanh/nhạc bị lỗi",
    "Khác",
  ],
  staff: [
    "Thiếu nhân viên trong ca",
    "Nhân viên xin nghỉ đột xuất",
    "Cần hỗ trợ thêm nhân viên",
    "Khác",
  ],
};

export function POSFeedback() {
  const [activeTab, setActiveTab] = useState("send");
  const [feedbackType, setFeedbackType] = useState<"ingredient" | "equipment" | "staff">("ingredient");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [location, setLocation] = useState("");

  const [feedbackHistory] = useState<FeedbackItem[]>([
    {
      id: "1",
      type: "ingredient",
      priority: "high",
      title: "Hết cà phê Robusta",
      description: "Cà phê Robusta đã hết hoàn toàn, không thể pha các món yêu cầu",
      location: "Quầy bar chính",
      timestamp: new Date(2024, 11, 9, 10, 30),
      status: "acknowledged",
      response: "Đã liên hệ nhà cung cấp, hàng sẽ về trong 2 giờ",
    },
    {
      id: "2", 
      type: "equipment",
      priority: "urgent",
      title: "Máy pha cà phê số 2 hỏng",
      description: "Máy không khởi động được, có mùi cháy",
      location: "Tầng 2",
      equipmentId: "COFFEE-02",
      timestamp: new Date(2024, 11, 9, 9, 15),
      status: "resolved",
      response: "Đã thay thế linh kiện, máy hoạt động bình thường",
    },
    {
      id: "3",
      type: "staff",
      priority: "medium", 
      title: "Thiếu nhân viên ca chiều",
      description: "1 nhân viên xin nghỉ đột xuất do ốm",
      timestamp: new Date(2024, 11, 9, 8, 45),
      status: "pending",
    },
  ]);

  const handleSendFeedback = () => {
    if (!selectedTemplate && !customDescription.trim()) return;
    
    const description = selectedTemplate === "Khác" ? customDescription : selectedTemplate;
    if (!description) return;

    // Simulate sending feedback
    alert(`Đã gửi phản hồi:\nLoại: ${getFeedbackTypeLabel(feedbackType)}\nMức độ: ${getPriorityLabel(priority)}\nNội dung: ${description}`);
    
    // Reset form
    setSelectedTemplate("");
    setCustomDescription("");
    setLocation("");
  };

  const getFeedbackTypeLabel = (type: string) => {
    switch (type) {
      case "ingredient": return "Thiếu nguyên liệu";
      case "equipment": return "Máy móc trục trặc";
      case "staff": return "Thiếu người";
      default: return "Khác";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low": return "Thấp";
      case "medium": return "Trung bình";
      case "high": return "Cao";
      case "urgent": return "Khẩn cấp";
      default: return "Trung bình";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ingredient": return <Package className="h-4 w-4" />;
      case "equipment": return <Wrench className="h-4 w-4" />;
      case "staff": return <Users className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "acknowledged": return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending": return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "resolved": return "Đã xử lý";
      case "acknowledged": return "Đã tiếp nhận";
      case "pending": return "Chờ xử lý";
      default: return "Khác";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gửi phản hồi</h2>
          <p className="text-muted-foreground">
            Báo cáo sự cố và yêu cầu hỗ trợ với quản lý
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Gửi phản hồi mới</TabsTrigger>
          <TabsTrigger value="history">Lịch sử phản hồi</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          {/* Feedback Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chọn loại phản hồi
              </CardTitle>
              <CardDescription>
                Chọn loại sự cố hoặc yêu cầu hỗ trợ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={feedbackType} onValueChange={(value: any) => setFeedbackType(value)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="ingredient" id="ingredient" />
                    <Label htmlFor="ingredient" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="font-medium">Thiếu nguyên liệu</div>
                        <div className="text-sm text-gray-600">Cà phê, sữa, đường, ly...</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="equipment" id="equipment" />
                    <Label htmlFor="equipment" className="flex items-center gap-2 cursor-pointer">
                      <Wrench className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Máy móc trục trặc</div>
                        <div className="text-sm text-gray-600">Máy pha, máy xay, tủ lạnh...</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="staff" id="staff" />
                    <Label htmlFor="staff" className="flex items-center gap-2 cursor-pointer">
                      <Users className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Thiếu người</div>
                        <div className="text-sm text-gray-600">Nghỉ đột xuất, cần hỗ trợ...</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Priority Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Mức độ ưu tiên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={priority} onValueChange={(value: any) => setPriority(value)}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="cursor-pointer">
                      <Badge className={PRIORITY_COLORS.low}>Thấp</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="cursor-pointer">
                      <Badge className={PRIORITY_COLORS.medium}>Trung bình</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="cursor-pointer">
                      <Badge className={PRIORITY_COLORS.high}>Cao</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <Label htmlFor="urgent" className="cursor-pointer">
                      <Badge className={PRIORITY_COLORS.urgent}>Khẩn cấp</Badge>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Feedback Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết phản hồi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Chọn mẫu có sẵn</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mẫu phản hồi..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FEEDBACK_TEMPLATES[feedbackType].map((template) => (
                      <SelectItem key={template} value={template}>
                        {template}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(selectedTemplate === "Khác" || selectedTemplate === "") && (
                <div>
                  <Label>Mô tả chi tiết</Label>
                  <Textarea
                    placeholder="Nhập mô tả chi tiết về sự cố hoặc yêu cầu hỗ trợ..."
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {(feedbackType === "equipment" || feedbackType === "ingredient") && (
                <div>
                  <Label>Vị trí (tùy chọn)</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vị trí..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-counter">Quầy bar chính</SelectItem>
                      <SelectItem value="floor-1">Tầng 1</SelectItem>
                      <SelectItem value="floor-2">Tầng 2</SelectItem>
                      <SelectItem value="floor-3">Tầng 3 (VIP)</SelectItem>
                      <SelectItem value="kitchen">Khu vực pha chế</SelectItem>
                      <SelectItem value="storage">Kho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                onClick={handleSendFeedback} 
                className="w-full"
                disabled={!selectedTemplate && !customDescription.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Gửi phản hồi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Feedback Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{feedbackHistory.length}</p>
                    <p className="text-sm text-gray-600">Tổng phản hồi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {feedbackHistory.filter(f => f.status === "pending").length}
                    </p>
                    <p className="text-sm text-gray-600">Chờ xử lý</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {feedbackHistory.filter(f => f.status === "acknowledged").length}
                    </p>
                    <p className="text-sm text-gray-600">Đã tiếp nhận</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {feedbackHistory.filter(f => f.status === "resolved").length}
                    </p>
                    <p className="text-sm text-gray-600">Đã xử lý</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback History List */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử phản hồi</CardTitle>
              <CardDescription>
                Danh sách các phản hồi đã gửi và trạng thái xử lý
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackHistory.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(feedback.type)}
                        <div>
                          <h4 className="font-medium">{feedback.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={PRIORITY_COLORS[feedback.priority]}>
                              {getPriorityLabel(feedback.priority)}
                            </Badge>
                            <Badge variant="outline" className="text-blue-600">
                              {getFeedbackTypeLabel(feedback.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(feedback.status)}
                        <span className="text-sm font-medium">
                          {getStatusLabel(feedback.status)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3">{feedback.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>
                          {feedback.timestamp.toLocaleDateString()} - {feedback.timestamp.toLocaleTimeString()}
                        </span>
                        {feedback.location && (
                          <span>📍 {feedback.location}</span>
                        )}
                      </div>
                    </div>

                    {feedback.response && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-800">
                          <strong>Phản hồi từ quản lý:</strong> {feedback.response}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {feedbackHistory.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có phản hồi nào được gửi</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}