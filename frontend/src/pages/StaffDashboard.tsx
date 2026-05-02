import { Link } from 'react-router-dom';
import { CalendarDays, CheckCheck, ClipboardList, MessageSquareText, Timer } from 'lucide-react';

const StaffDashboard = () => (
    <div className="min-h-full p-4 md:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 p-6 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">Staff Workspace</p>
                <h2 className="mt-2 text-2xl font-semibold">Bang dieu khien nhan vien</h2>
                <p className="mt-2 text-sm text-cyan-50/95">
                    Truy cap nhanh cac chuc nang thao tac hang ngay: lich lam, cham cong va don hang.
                </p>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Link to="/schedule-management" className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow">
                    <div className="flex items-center gap-2 text-slate-900">
                        <CalendarDays className="h-5 w-5 text-cyan-700" />
                        <h3 className="font-semibold">Lich Lam</h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Xem ca lam duoc phan bo va cap nhat tinh trang.</p>
                </Link>

                <Link to="/attendance-management" className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow">
                    <div className="flex items-center gap-2 text-slate-900">
                        <CheckCheck className="h-5 w-5 text-emerald-700" />
                        <h3 className="font-semibold">Cham Cong</h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Check-in, check-out va theo doi thong tin ngay cong.</p>
                </Link>

                <Link to="/orders" className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow">
                    <div className="flex items-center gap-2 text-slate-900">
                        <ClipboardList className="h-5 w-5 text-amber-700" />
                        <h3 className="font-semibold">Xu Ly Don</h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Cap nhat trang thai don va ho tro khach tai quay.</p>
                </Link>

                <Link to="/customer-feedback" className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow">
                    <div className="flex items-center gap-2 text-slate-900">
                        <MessageSquareText className="h-5 w-5 text-violet-700" />
                        <h3 className="font-semibold">Phan Hoi</h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Theo doi va ghi nhan y kien de cai thien dich vu.</p>
                </Link>
            </section>

            <section className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-slate-600" />
                    <h3 className="text-sm font-semibold text-slate-800">Goi y ca lam</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                    Nhan vien nen check-in truoc 10 phut de chuan bi khu vuc phuc vu va kiem tra don dang cho.
                </p>
            </section>
        </div>
    </div>
);

export default StaffDashboard;
