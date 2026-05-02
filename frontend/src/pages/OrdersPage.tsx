import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, RefreshCcw } from 'lucide-react';
import { ordersAPI } from '../services/api';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface OrderItem {
    id: number;
    order_number: string;
    order_type: 'dine_in' | 'takeaway' | 'delivery';
    status: OrderStatus;
    payment_status: 'unpaid' | 'paid' | 'refunded';
    customer_name?: string;
    table_id?: number;
    final_amount?: number;
    created_at: string;
}

const statusOptions: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

const OrdersPage = () => {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const params = statusFilter === 'all' ? {} : { status: statusFilter };
            const response = await ordersAPI.getAll(params);
            const payload = response.data as unknown;
            const normalizedOrders = Array.isArray(payload)
                ? payload
                : Array.isArray((payload as { data?: unknown })?.data)
                    ? ((payload as { data: OrderItem[] }).data ?? [])
                    : Array.isArray((payload as { orders?: unknown })?.orders)
                        ? ((payload as { orders: OrderItem[] }).orders ?? [])
                        : [];
            setOrders(normalizedOrders);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to fetch orders');
        } finally {
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

    const handleStatusChange = async (id: number, status: OrderStatus) => {
        try {
            await ordersAPI.updateStatus(id, status);
            await fetchOrders();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to update order status');
        }
    };

    const formatMoney = (value?: number) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(value || 0);

    return (
        <div className="min-h-full bg-slate-100 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
                            <ClipboardList className="h-6 w-6" />
                            Order Management
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">Quan ly trang thai don va tien trinh phuc vu theo thoi gian thuc.</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Tong don</p>
                        <p className="mt-1 text-3xl font-semibold">{summary.total}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Dang xu ly</p>
                        <p className="mt-1 text-3xl font-semibold text-amber-700">{summary.open}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Da hoan tat</p>
                        <p className="mt-1 text-3xl font-semibold text-emerald-700">{summary.completed}</p>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                    <label className="text-sm font-medium text-slate-700" htmlFor="statusFilter">
                        Loc theo trang thai
                    </label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500"
                    >
                        <option value="all">Tat ca</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

                <div className="space-y-3">
                    {loading ? (
                        <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                            Dang tai don hang...
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                            Chua co don hang nao.
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{order.order_number}</p>
                                        <p className="text-xs text-slate-500">
                                            {order.customer_name || 'Walk-in'} | {order.order_type} |{' '}
                                            {new Date(order.created_at).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900">{formatMoney(order.final_amount)}</p>
                                        <p className="text-xs text-slate-500">Payment: {order.payment_status}</p>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                                        Status: {order.status}
                                    </span>
                                    {statusOptions.map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(order.id, status)}
                                            disabled={order.status === status}
                                            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-100"
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
