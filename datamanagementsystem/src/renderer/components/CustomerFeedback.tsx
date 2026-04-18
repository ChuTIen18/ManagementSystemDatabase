import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, MessageCircle, Clock } from "lucide-react";

interface FeedbackItem {
  id: string;
  invoiceId: string;
  customerName: string;
  overallRating: number;
  serviceRating: number;
  foodRating: number;
  atmosphereRating: number;
  comments: string;
  timestamp: Date;
  status: string;
}

interface CustomerFeedbackProps {
  mode?: string;
  existingFeedback?: FeedbackItem[];
}

export function CustomerFeedback({ mode = "staff-view", existingFeedback }: CustomerFeedbackProps) {
  const [feedbacks] = useState<FeedbackItem[]>(existingFeedback || []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Đánh giá khách hàng</h2>

        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Chưa có đánh giá nào</p>
          ) : (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{feedback.customerName}</h3>
                      <Badge variant="outline">{feedback.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{feedback.invoiceId}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(feedback.timestamp)} {formatTime(feedback.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  {renderStars(feedback.overallRating)}
                </div>
                <p>{feedback.comments}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}