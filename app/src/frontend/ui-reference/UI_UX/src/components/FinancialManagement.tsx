import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Calendar,
  Receipt,
  CreditCard,
  Banknote,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle
} from "lucide-react";

interface Transaction {
  id: string;
  date: Date;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  paymentMethod: "cash" | "card" | "transfer";
  status: "completed" | "pending" | "cancelled";
  invoiceNumber?: string;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashFlow: number;
  previousMonthRevenue: number;
  previousMonthExpenses: number;
}

interface CategoryBudget {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
}

const EXPENSE_CATEGORIES = [
  { id: "ingredients", name: "Nguyên liệu", icon: Package },
  { id: "staff", name: "Nhân sự", icon: Users },
  { id: "utilities", name: "Tiện ích", icon: AlertTriangle },
  { id: "equipment", name: "Thiết bị", icon: ShoppingCart },
  { id: "marketing", name: "Marketing", icon: TrendingUp },
  { id: "maintenance", name: "Bảo trì", icon: AlertTriangle },
  { id: "other", name: "Khác", icon: DollarSign },
];

const INCOME_CATEGORIES = [
  { id: "beverage", name: "Đồ uống", icon: Receipt },
  { id: "food", name: "Đồ ăn", icon: ShoppingCart },
  { id: "other", name: "Khác", icon: DollarSign },
];

export function FinancialManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMonth, setSelectedMonth] = useState("12");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: new Date("2024-12-09"),
      type: "income",
      category: "beverage",
      amount: 3000000,
      description: "Doanh thu đồ uống ngày 09/12",
      paymentMethod: "cash",
      status: "completed",
      invoiceNumber: "INV001"
    },
    {
      id: "2",
      date: new Date("2024-12-09"),
      type: "expense",
      category: "ingredients",
      amount: 800000,
      description: "Mua nguyên liệu cà phê",
      paymentMethod: "transfer",
      status: "completed"
    },
    {
      id: "3",
      date: new Date("2024-12-08"),
      type: "expense",
      category: "staff",
      amount: 1200000,
      description: "Lương nhân viên part-time",
      paymentMethod: "transfer",
      status: "completed"
    },
  ]);

  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: "expense",
    category: "",
    amount: 0,
    description: "",
    paymentMethod: "cash",
    date: new Date(),
  });

  const [budgets] = useState<CategoryBudget[]>([
    { category: "ingredients", budgeted: 15000000, spent: 12000000, remaining: 3000000 },
    { category: "staff", budgeted: 25000000, spent: 22000000, remaining: 3000000 },
    { category: "utilities", budgeted: 3000000, spent: 2800000, remaining: 200000 },
    { category: "equipment", budgeted: 5000000, spent: 1500000, remaining: 3500000 },
  ]);

  // Tính toán tổng kết tài chính
  const calculateFinancialSummary = (): FinancialSummary => {
    const currentMonth = transactions.filter(t => 
      t.date.getMonth() === new Date().getMonth() && 
      t.date.getFullYear() === new Date().getFullYear()
    );

    const totalRevenue = currentMonth
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentMonth
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      cashFlow: totalRevenue - totalExpenses,
      previousMonthRevenue: 85000000,
      previousMonthExpenses: 45000000,
    };
  };

  const financialSummary = calculateFinancialSummary();

  const addTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount || !newTransaction.description) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: newTransaction.date || new Date(),
      type: newTransaction.type || "expense",
      category: newTransaction.category,
      amount: newTransaction.amount,
      description: newTransaction.description,
      paymentMethod: newTransaction.paymentMethod || "cash",
      status: "completed",
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      type: "expense",
      category: "",
      amount: 0,
      description: "",
      paymentMethod: "cash",
      date: new Date(),
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const getRevenueChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTransactions = transactions.filter(t => 
        t.date.toDateString() === date.toDateString() && t.type === "income"
      );
      const revenue = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      last7Days.push({
        date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        revenue: revenue / 1000000, // Convert to millions
      });
    }
    return last7Days;
  };

  const getExpensesByCategoryData = () => {
    const categoryExpenses = EXPENSE_CATEGORIES.map(cat => {
      const total = transactions
        .filter(t => t.type === "expense" && t.category === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: cat.name,
        value: total / 1000000, // Convert to millions
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      };
    }).filter(item => item.value > 0);

    return categoryExpenses;
  };

  const getCategoryName = (categoryId: string, type: "income" | "expense") => {
    const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash": return <Banknote className="h-4 w-4" />;
      case "card": return <CreditCard className="h-4 w-4" />;
      case "transfer": return <DollarSign className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý tài chính</h2>
          <p className="text-muted-foreground">
            Theo dõi doanh thu, chi phí và lợi nhuận của quán
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">Tháng 12, 2024</SelectItem>
            <SelectItem value="11">Tháng 11, 2024</SelectItem>
            <SelectItem value="10">Tháng 10, 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
          <TabsTrigger value="budget">Ngân sách</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(financialSummary.totalRevenue)}
                    </p>
                    <p className="text-sm text-gray-600">Doanh thu tháng này</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(financialSummary.totalExpenses)}
                    </p>
                    <p className="text-sm text-gray-600">Chi phí tháng này</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(financialSummary.netProfit)}
                    </p>
                    <p className="text-sm text-gray-600">Lợi nhuận ròng</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {((financialSummary.totalRevenue - financialSummary.previousMonthRevenue) / financialSummary.previousMonthRevenue * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Tăng trưởng so với tháng trước</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu 7 ngày gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getRevenueChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value}M VND`, 'Doanh thu']} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chi phí theo danh mục</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getExpensesByCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getExpensesByCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}M VND`]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          {/* Add Transaction Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Thêm giao dịch mới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <Label>Loại</Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value) => setNewTransaction({...newTransaction, type: value as "income" | "expense"})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Thu nhập</SelectItem>
                      <SelectItem value="expense">Chi phí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Danh mục</Label>
                  <Select
                    value={newTransaction.category}
                    onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {(newTransaction.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Số tiền</Label>
                  <Input
                    type="number"
                    value={newTransaction.amount || ''}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Phương thức</Label>
                  <Select
                    value={newTransaction.paymentMethod}
                    onValueChange={(value) => setNewTransaction({...newTransaction, paymentMethod: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Tiền mặt</SelectItem>
                      <SelectItem value="card">Thẻ</SelectItem>
                      <SelectItem value="transfer">Chuyển khoản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ngày</Label>
                  <Input
                    type="date"
                    value={newTransaction.date ? newTransaction.date.toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewTransaction({...newTransaction, date: new Date(e.target.value)})}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addTransaction} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <Label>Mô tả</Label>
                <Input
                  value={newTransaction.description || ''}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  placeholder="Mô tả giao dịch..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử giao dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      <div>
                        <p className="font-medium">
                          {getCategoryName(transaction.category, transaction.type)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {transaction.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={transaction.type === "income" ? "default" : "secondary"}>
                          {transaction.type === "income" ? "Thu nhập" : "Chi phí"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTransaction(transaction.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Chưa có giao dịch nào
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ngân sách theo danh mục</CardTitle>
              <CardDescription>
                Theo dõi việc sử dụng ngân sách cho từng danh mục chi phí
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const usagePercentage = (budget.spent / budget.budgeted) * 100;
                  const isOverBudget = usagePercentage > 100;
                  
                  return (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {getCategoryName(budget.category, "expense")}
                        </span>
                        <span className={`text-sm ${isOverBudget ? "text-red-600" : "text-gray-600"}`}>
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.budgeted)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            isOverBudget ? "bg-red-500" : usagePercentage > 80 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{usagePercentage.toFixed(1)}% đã sử dụng</span>
                        <span>
                          {isOverBudget ? 
                            `Vượt ${formatCurrency(Math.abs(budget.remaining))}` : 
                            `Còn lại ${formatCurrency(budget.remaining)}`
                          }
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo lợi nhuận</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tổng doanh thu:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(financialSummary.totalRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng chi phí:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(financialSummary.totalExpenses)}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span>Lợi nhuận ròng:</span>
                    <span className={`font-bold ${financialSummary.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(financialSummary.netProfit)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Tỷ suất lợi nhuận: {((financialSummary.netProfit / financialSummary.totalRevenue) * 100).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["cash", "card", "transfer"].map((method) => {
                    const methodTransactions = transactions.filter(t => t.paymentMethod === method);
                    const total = methodTransactions.reduce((sum, t) => sum + t.amount, 0);
                    const percentage = transactions.length > 0 ? (methodTransactions.length / transactions.length) * 100 : 0;
                    
                    return (
                      <div key={method} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(method)}
                          <span>
                            {method === "cash" ? "Tiền mặt" : 
                             method === "card" ? "Thẻ" : "Chuyển khoản"}
                          </span>
                        </div>
                        <div className="text-right">
                          <div>{formatCurrency(total)}</div>
                          <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}