import React, { useEffect, useState } from 'react';
import { BarChart3, AlertCircle, TrendingUp, Package, Star } from 'lucide-react';
import { reportsAPI } from '../services/api';

export default function ReportsAnalytics() {
    const [summary, setSummary] = useState<any>(null);
    const [dailyRevenue, setDailyRevenue] = useState<any>(null);
    const [lowStock, setLowStock] = useState<any[]>([]);
    const [topItems, setTopItems] = useState<any[]>([]);
    const [satisfaction, setSatisfaction] = useState<any>(null);
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

            const normalizeArray = (payload: unknown): any[] => {
                if (Array.isArray(payload)) return payload;
                if (payload && typeof payload === 'object') {
                    const wrapped = payload as { data?: unknown; items?: unknown; rows?: unknown; lowStock?: unknown; topItems?: unknown };
                    if (Array.isArray(wrapped.data)) return wrapped.data;
                    if (Array.isArray(wrapped.items)) return wrapped.items;
                    if (Array.isArray(wrapped.rows)) return wrapped.rows;
                    if (Array.isArray(wrapped.lowStock)) return wrapped.lowStock;
                    if (Array.isArray(wrapped.topItems)) return wrapped.topItems;
                }
                return [];
            };

            setSummary(summaryRes.data?.data ?? summaryRes.data ?? {});
            setDailyRevenue(dailyRes.data?.data ?? dailyRes.data ?? {});
            setLowStock(normalizeArray(lowStockRes.data));
            setTopItems(normalizeArray(topItemsRes.data));
            setSatisfaction(satisfactionRes.data?.data ?? satisfactionRes.data ?? {});
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-8 h-8" />
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600 mt-1">Operational metrics, revenue, stock alerts, and customer satisfaction.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>{error}</div>
                    </div>
                )}

                {loading ? (
                    <div className="bg-white rounded-lg shadow p-10 text-center text-gray-600">Loading reports...</div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-600 text-sm">Total Orders</p>
                                <p className="text-3xl font-bold text-blue-600">{summary?.total_orders ?? 0}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-600 text-sm">Revenue</p>
                                <p className="text-3xl font-bold text-green-600">${Number(summary?.revenue || 0).toFixed(2)}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-600 text-sm">Low Stock Items</p>
                                <p className="text-3xl font-bold text-orange-600">{summary?.low_stock_items ?? 0}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-600 text-sm">Feedback</p>
                                <p className="text-3xl font-bold text-purple-600">{summary?.total_feedback ?? 0}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" /> Daily Revenue
                                </h2>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <div>Date: {dailyRevenue?.order_date || '-'}</div>
                                    <div>Orders: {dailyRevenue?.order_count ?? 0}</div>
                                    <div>Total revenue: ${Number(dailyRevenue?.total_revenue || 0).toFixed(2)}</div>
                                    <div>Total discount: ${Number(dailyRevenue?.total_discount || 0).toFixed(2)}</div>
                                    <div>Average rating: {dailyRevenue?.avg_rating ?? 'N/A'}</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Star className="w-5 h-5" /> Customer Satisfaction
                                </h2>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <div>Overall: {satisfaction?.avg_overall_rating ?? 0}</div>
                                    <div>Service: {satisfaction?.avg_service_rating ?? 0}</div>
                                    <div>Quality: {satisfaction?.avg_quality_rating ?? 0}</div>
                                    <div>Ambiance: {satisfaction?.avg_ambiance_rating ?? 0}</div>
                                    <div>Total feedback: {satisfaction?.total_feedback ?? 0}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5" /> Low Stock Alerts
                                </h2>
                                {lowStock.length === 0 ? (
                                    <p className="text-gray-600 text-sm">No low stock items.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {lowStock.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between border rounded p-3">
                                                <div>
                                                    <div className="font-semibold text-gray-800">{item.name || item.item_name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.quantity} {item.unit} / min {item.min_quantity}
                                                    </div>
                                                </div>
                                                <span className="text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-xs">
                                                    Alert
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" /> Top Selling Items
                                </h2>
                                {topItems.length === 0 ? (
                                    <p className="text-gray-600 text-sm">No completed orders yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {topItems.map((item) => (
                                            <div key={item.id} className="border rounded p-3">
                                                <div className="font-semibold text-gray-800">{item.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    Sold: {item.total_quantity_sold} | Revenue: ${Number(item.total_revenue || 0).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
