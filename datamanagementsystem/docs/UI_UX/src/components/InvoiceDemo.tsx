import { useState } from "react";
import { InvoiceDisplay } from "./InvoiceDisplay";
import { CustomerFeedback } from "./CustomerFeedback";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Receipt, QrCode, MessageCircle } from "lucide-react";

export function InvoiceDemo() {
  const [currentView, setCurrentView] = useState<'invoice' | 'feedback'>('invoice');
  
  const sampleInvoice = {
    id: 'INV20241212001',
    timestamp: new Date(),
    cashier: 'Nhân viên A',
    table: 'Bàn 5',
    items: [
      {
        name: 'Cappuccino',
        quantity: 2,
        price: 45000,
        notes: 'Ít đường'
      },
      {
        name: 'Americano',
        quantity: 1,
        price: 35000
      },
      {
        name: 'Bánh croissant',
        quantity: 1,
        price: 30000
      }
    ],
    subtotal: 155000,
    discount: {
      type: 'Khách hàng thân thiết',
      amount: 15500
    },
    total: 139500,
    paymentMethod: 'cash' as const
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Tính năng tải hóa đơn sẽ được triển khai');
  };

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Nhận được đánh giá:', feedback);
    alert('Cảm ơn bạn đã đánh giá! Vui lòng đưa màn hình này cho nhân viên để nhận phiếu khuyến mãi.');
  };

  if (currentView === 'feedback') {
    return (
      <div className="min-h-screen">
        <CustomerFeedback 
          invoiceId={sampleInvoice.id}
          mode="customer"
          onSubmitFeedback={handleFeedbackSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-2">Demo Hóa Đơn & Đánh Giá</h1>
          <p className="text-muted-foreground">
            Xem trước hóa đơn có QR code và giao diện đánh giá khách hàng
          </p>
        </div>

        <Tabs defaultValue="invoice" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invoice" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Hóa đơn
            </TabsTrigger>
            <TabsTrigger value="feedback-form" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Form đánh giá
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoice" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Hóa đơn cho khách */}
              <div>
                <h3 className="font-medium mb-4 text-center">Hóa đơn cho khách hàng</h3>
                <InvoiceDisplay 
                  invoice={sampleInvoice}
                  showQR={true}
                />
                <div className="mt-4 text-center">
                  <Button 
                    onClick={() => setCurrentView('feedback')}
                    className="w-full"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Mô phỏng quét QR để đánh giá
                  </Button>
                </div>
              </div>

              {/* Hóa đơn cho quầy pha chế */}
              <div>
                <h3 className="font-medium mb-4 text-center">Hóa đơn cho quầy pha chế</h3>
                <InvoiceDisplay 
                  invoice={{
                    ...sampleInvoice,
                    id: sampleInvoice.id + ' (PHA CHẾ)'
                  }}
                  showQR={false}
                  onPrint={handlePrint}
                  onDownload={handleDownload}
                />
              </div>
            </div>

            <Card className="p-6">
              <h3 className="font-medium mb-4">Mô tả tính năng:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>QR Code trên hóa đơn:</strong> Khách hàng quét mã QR để truy cập form đánh giá trực tuyến
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>Form đánh giá:</strong> Giao diện thân thiện cho khách hàng đánh giá dịch vụ với nhiều tiêu chí
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>Phiếu khuyến mãi:</strong> Sau khi đánh giá, khách nhận phiếu giảm giá cho lần mua tiếp theo
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>Quản lý phản hồi:</strong> Nhân viên và quản lý có thể xem tất cả đánh giá từ khách hàng
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="feedback-form">
            <CustomerFeedback 
              invoiceId={sampleInvoice.id}
              mode="customer"
              onSubmitFeedback={handleFeedbackSubmit}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}