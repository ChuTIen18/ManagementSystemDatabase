import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { BarChart3, AlertCircle, TrendingUp, Package, Star } from 'lucide-react';
import { reportsAPI } from '../services/api';
export default function ReportsAnalytics() {
    const [summary, setSummary] = useState(null);
    const [dailyRevenue, setDailyRevenue] = useState(null);
    const [lowStock, setLowStock] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [satisfaction, setSatisfaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchReports = async () => {
        try {
            setLoading(true);
            setError('');
            const [summaryRes, dailyRes, lowStockRes, topItemsRes, satisfactionRes] = await Promise.all([
                reportsAPI.getSummary(),
                reportsAPI.getDailyRevenue(),
                reportsAPI.getLowStock(),
                reportsAPI.getTopItems(),
                reportsAPI.getCustomerSatisfaction(),
            ]);
            const normalizeArray = (payload) => {
                if (Array.isArray(payload))
                    return payload;
                if (payload && typeof payload === 'object') {
                    const wrapped = payload;
                    if (Array.isArray(wrapped.data))
                        return wrapped.data;
                    if (Array.isArray(wrapped.items))
                        return wrapped.items;
                    if (Array.isArray(wrapped.rows))
                        return wrapped.rows;
                    if (Array.isArray(wrapped.lowStock))
                        return wrapped.lowStock;
                    if (Array.isArray(wrapped.topItems))
                        return wrapped.topItems;
                }
                return [];
            };
            setSummary(summaryRes.data?.data ?? summaryRes.data ?? {});
            setDailyRevenue(dailyRes.data?.data ?? dailyRes.data ?? {});
            setLowStock(normalizeArray(lowStockRes.data));
            setTopItems(normalizeArray(topItemsRes.data));
            setSatisfaction(satisfactionRes.data?.data ?? satisfactionRes.data ?? {});
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to load reports');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchReports();
    }, []);
    return (_jsx("div", { className: "min-h-screen bg-gray-100 p-4 md:p-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-8 h-8" }), "Reports & Analytics"] }), _jsx("p", { className: "text-gray-600 mt-1", children: "Operational metrics, revenue, stock alerts, and customer satisfaction." })] }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("div", { children: error })] })), loading ? (_jsx("div", { className: "bg-white rounded-lg shadow p-10 text-center text-gray-600", children: "Loading reports..." })) : (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Orders" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: summary?.total_orders ?? 0 })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Revenue" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: ["$", Number(summary?.revenue || 0).toFixed(2)] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Low Stock Items" }), _jsx("p", { className: "text-3xl font-bold text-orange-600", children: summary?.low_stock_items ?? 0 })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Feedback" }), _jsx("p", { className: "text-3xl font-bold text-purple-600", children: summary?.total_feedback ?? 0 })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-5 h-5" }), " Daily Revenue"] }), _jsxs("div", { className: "space-y-2 text-sm text-gray-700", children: [_jsxs("div", { children: ["Date: ", dailyRevenue?.order_date || '-'] }), _jsxs("div", { children: ["Orders: ", dailyRevenue?.order_count ?? 0] }), _jsxs("div", { children: ["Total revenue: $", Number(dailyRevenue?.total_revenue || 0).toFixed(2)] }), _jsxs("div", { children: ["Total discount: $", Number(dailyRevenue?.total_discount || 0).toFixed(2)] }), _jsxs("div", { children: ["Average rating: ", dailyRevenue?.avg_rating ?? 'N/A'] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [_jsx(Star, { className: "w-5 h-5" }), " Customer Satisfaction"] }), _jsxs("div", { className: "space-y-2 text-sm text-gray-700", children: [_jsxs("div", { children: ["Overall: ", satisfaction?.avg_overall_rating ?? 0] }), _jsxs("div", { children: ["Service: ", satisfaction?.avg_service_rating ?? 0] }), _jsxs("div", { children: ["Quality: ", satisfaction?.avg_quality_rating ?? 0] }), _jsxs("div", { children: ["Ambiance: ", satisfaction?.avg_ambiance_rating ?? 0] }), _jsxs("div", { children: ["Total feedback: ", satisfaction?.total_feedback ?? 0] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [_jsx(Package, { className: "w-5 h-5" }), " Low Stock Alerts"] }), lowStock.length === 0 ? (_jsx("p", { className: "text-gray-600 text-sm", children: "No low stock items." })) : (_jsx("div", { className: "space-y-3", children: lowStock.map((item) => (_jsxs("div", { className: "flex items-center justify-between border rounded p-3", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-800", children: item.name || item.item_name }), _jsxs("div", { className: "text-xs text-gray-500", children: [item.quantity, " ", item.unit, " / min ", item.min_quantity] })] }), _jsx("span", { className: "text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-xs", children: "Alert" })] }, item.id))) }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-5 h-5" }), " Top Selling Items"] }), topItems.length === 0 ? (_jsx("p", { className: "text-gray-600 text-sm", children: "No completed orders yet." })) : (_jsx("div", { className: "space-y-3", children: topItems.map((item) => (_jsxs("div", { className: "border rounded p-3", children: [_jsx("div", { className: "font-semibold text-gray-800", children: item.name }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Sold: ", item.total_quantity_sold, " | Revenue: $", Number(item.total_revenue || 0).toFixed(2)] })] }, item.id))) }))] })] })] }))] }) }));
}
