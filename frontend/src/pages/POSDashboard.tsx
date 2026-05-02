import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, UtensilsCrossed, MessageSquareText, MonitorSmartphone } from 'lucide-react';
import { menuAPI, ordersAPI } from '../services/api';

const POSDashboard = () => {
    const [orderCount, setOrderCount] = useState(0);
    const [availableMenuCount, setAvailableMenuCount] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                const [ordersRes, menuRes] = await Promise.all([
                    ordersAPI.getAll({ limit: 200 }),
                    menuAPI.getAll({ availableOnly: true }),
                ]);
                setOrderCount((ordersRes.data || []).length);
                setAvailableMenuCount((menuRes.data || []).length);
            } catch (error) {
                console.error('Failed to load POS dashboard data', error);
            }
        };

        load();
    }, []);

    const now = useMemo(
        () =>
            new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        []
    );

    return (
        <div className="min-h-full p-4 md:p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <section className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">POS Station</p>
                            <h2 className="mt-2 text-2xl font-semibold">Dieu phoi ban hang tai quay</h2>
                            <p className="mt-2 text-sm text-emerald-50/95">
                                Toi uu luong order, cap nhat trang thai nhanh va giam thoi gian cho cua khach.
                            </p>
                        </div>
                        <MonitorSmartphone className="h-8 w-8 text-emerald-100" />
                    </div>
                    <p className="mt-3 text-xs text-emerald-100/90">Phien lam viec bat dau: {now}</p>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">So don hien co</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">{orderCount}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Mon dang phuc vu</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">{availableMenuCount}</p>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Link to="/orders" className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow">
                        <div className="flex items-center gap-2 text-slate-800">
                            <ClipboardList className="h-5 w-5 text-emerald-700" />
                            <h3 className="font-semibold">Order Queue</h3>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">Nhan don moi, cap nhat pending/preparing/ready.</p>
                    </Link>

                    <Link to="/menu" className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow">
                        <div className="flex items-center gap-2 text-slate-800">
                            <UtensilsCrossed className="h-5 w-5 text-cyan-700" />
                            <h3 className="font-semibold">Menu Lookup</h3>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">Kiem tra gia, tinh trang mon va nhom danh muc.</p>
                    </Link>

                    <Link
                        to="/customer-feedback"
                        className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow"
                    >
                        <div className="flex items-center gap-2 text-slate-800">
                            <MessageSquareText className="h-5 w-5 text-violet-700" />
                            <h3 className="font-semibold">Issue & Feedback</h3>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">Bao cao su co hoat dong va theo doi xu ly.</p>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default POSDashboard;
