import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Boxes,
    ClipboardList,
    Wrench,
    Users,
    CalendarDays,
    BarChart2,
    TableProperties,
    Percent,
    MessageSquareText,
    ArrowRight,
} from 'lucide-react';

const tiles = [
    {
        title: 'Orders & POS',
        description: 'Kiem soat trang thai don, thanh toan va luong ban trong ngay.',
        to: '/orders',
        icon: ClipboardList,
        tone: 'from-blue-600 to-cyan-500',
    },
    {
        title: 'Inventory',
        description: 'Theo doi ton kho, nguong canh bao va giao dich nhap xuat.',
        to: '/inventory-management',
        icon: Boxes,
        tone: 'from-emerald-600 to-teal-500',
    },
    {
        title: 'Equipment',
        description: 'Quan ly thiet bi, bao tri va xu ly su co.',
        to: '/equipment-management',
        icon: Wrench,
        tone: 'from-orange-600 to-amber-500',
    },
    {
        title: 'Staff & Schedule',
        description: 'To chuc nhan su, ca lam, cham cong va don nghi phep.',
        to: '/staff-management',
        icon: Users,
        tone: 'from-violet-600 to-fuchsia-500',
    },
    {
        title: 'Tables',
        description: 'So do ban, suc chua va trang thai phuc vu tai cua hang.',
        to: '/table-management',
        icon: TableProperties,
        tone: 'from-rose-600 to-pink-500',
    },
    {
        title: 'Reports',
        description: 'Tong hop doanh thu, ton kho, muc do hai long va hieu suat.',
        to: '/reports-analytics',
        icon: BarChart2,
        tone: 'from-slate-700 to-slate-500',
    },
];

const ManagerDashboard = () => {
    const now = useMemo(
        () =>
            new Date().toLocaleString('vi-VN', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
        []
    );

    return (
        <div className="min-h-full p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-6 text-white shadow-lg md:p-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-100">Manager Console</p>
                    <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Tong quan van hanh Coffee House</h2>
                    <p className="mt-2 max-w-3xl text-sm text-amber-50/90">
                        Day la trung tam dieu phoi de truy cap nhanh cac module quan ly cot loi cua cua hang.
                    </p>
                    <p className="mt-4 text-xs text-amber-100/95">Cap nhat lan cuoi: {now}</p>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tiles.map((tile) => {
                        const Icon = tile.icon;
                        return (
                            <Link
                                key={tile.title}
                                to={tile.to}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div
                                    className={`inline-flex rounded-xl bg-gradient-to-br ${tile.tone} p-2.5 text-white`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-800">{tile.title}</h3>
                                <p className="mt-2 text-sm text-slate-600">{tile.description}</p>
                                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-amber-700">
                                    Mo module
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        );
                    })}
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Link
                        to="/promotions-management"
                        className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm transition hover:shadow"
                    >
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <Percent className="h-4 w-4" /> Promotions
                        </div>
                        <p className="mt-1 text-sm text-slate-600">Thiet lap chuong trinh khuyen mai theo thoi gian.</p>
                    </Link>
                    <Link
                        to="/schedule-management"
                        className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm transition hover:shadow"
                    >
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <CalendarDays className="h-4 w-4" /> Scheduling
                        </div>
                        <p className="mt-1 text-sm text-slate-600">Phan ca va theo doi lich lam theo ngay/tuần.</p>
                    </Link>
                    <Link
                        to="/customer-feedback"
                        className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm transition hover:shadow"
                    >
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <MessageSquareText className="h-4 w-4" /> Feedback
                        </div>
                        <p className="mt-1 text-sm text-slate-600">Theo doi chat luong dich vu tu phan hoi khach hang.</p>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default ManagerDashboard;
