import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, RefreshCcw } from 'lucide-react';
import { ordersAPI } from '../services/api';
const statusOptions = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const params = statusFilter === 'all' ? {} : { status: statusFilter };
            const response = await ordersAPI.getAll(params);
            const payload = response.data;
            const normalizedOrders = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.data)
                    ? (payload.data ?? [])
                    : Array.isArray(payload?.orders)
                        ? (payload.orders ?? [])
                        : [];
            setOrders(normalizedOrders);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch orders');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);
    const summary = useMemo(() => {
        return {
            total: orders.length,
            open: orders.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status)).length,
            completed: orders.filter((o) => o.status === 'completed').length,
        };
    }, [orders]);
    const handleStatusChange = async (id, status) => {
        try {
            await ordersAPI.updateStatus(id, status);
            await fetchOrders();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to update order status');
        }
    };
    const formatMoney = (value) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value || 0);
    return (_jsx("div", { className: "min-h-full bg-slate-100 p-4 md:p-8", children: _jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("h1", { className: "flex items-center gap-2 text-2xl font-semibold text-slate-900", children: [_jsx(ClipboardList, { className: "h-6 w-6" }), "Order Management"] }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Quan ly trang thai don va tien trinh phuc vu theo thoi gian thuc." })] }), _jsxs("button", { onClick: fetchOrders, className: "inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50", children: [_jsx(RefreshCcw, { className: "h-4 w-4" }), "Refresh"] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [_jsxs("div", { className: "rounded-xl bg-white p-4 shadow-sm", children: [_jsx("p", { className: "text-sm text-slate-500", children: "Tong don" }), _jsx("p", { className: "mt-1 text-3xl font-semibold", children: summary.total })] }), _jsxs("div", { className: "rounded-xl bg-white p-4 shadow-sm", children: [_jsx("p", { className: "text-sm text-slate-500", children: "Dang xu ly" }), _jsx("p", { className: "mt-1 text-3xl font-semibold text-amber-700", children: summary.open })] }), _jsxs("div", { className: "rounded-xl bg-white p-4 shadow-sm", children: [_jsx("p", { className: "text-sm text-slate-500", children: "Da hoan tat" }), _jsx("p", { className: "mt-1 text-3xl font-semibold text-emerald-700", children: summary.completed })] })] }), _jsxs("div", { className: "rounded-xl bg-white p-4 shadow-sm", children: [_jsx("label", { className: "text-sm font-medium text-slate-700", htmlFor: "statusFilter", children: "Loc theo trang thai" }), _jsxs("select", { id: "statusFilter", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500", children: [_jsx("option", { value: "all", children: "Tat ca" }), statusOptions.map((status) => (_jsx("option", { value: status, children: status }, status)))] })] }), error && _jsx("div", { className: "rounded-lg bg-red-50 p-3 text-sm text-red-700", children: error }), _jsx("div", { className: "space-y-3", children: loading ? (_jsx("div", { className: "rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm", children: "Dang tai don hang..." })) : orders.length === 0 ? (_jsx("div", { className: "rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm", children: "Chua co don hang nao." })) : (orders.map((order) => (_jsxs("div", { className: "rounded-xl border border-slate-200 bg-white p-4 shadow-sm", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: order.order_number }), _jsxs("p", { className: "text-xs text-slate-500", children: [order.customer_name || 'Walk-in', " | ", order.order_type, " |", ' ', new Date(order.created_at).toLocaleString('vi-VN')] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: formatMoney(order.final_amount) }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Payment: ", order.payment_status] })] })] }), _jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [_jsxs("span", { className: "rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700", children: ["Status: ", order.status] }), statusOptions.map((status) => (_jsx("button", { onClick: () => handleStatusChange(order.id, status), disabled: order.status === status, className: "rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-100", children: status }, status)))] })] }, order.id)))) })] }) }));
};
export default OrdersPage;
