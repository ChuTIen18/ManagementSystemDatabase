import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            }
            catch (error) {
                console.error('Failed to load POS dashboard data', error);
            }
        };
        load();
    }, []);
    const now = useMemo(() => new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    }), []);
    return (_jsx("div", { className: "min-h-full p-4 md:p-8", children: _jsxs("div", { className: "mx-auto max-w-6xl space-y-6", children: [_jsxs("section", { className: "rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-emerald-100", children: "POS Station" }), _jsx("h2", { className: "mt-2 text-2xl font-semibold", children: "Dieu phoi ban hang tai quay" }), _jsx("p", { className: "mt-2 text-sm text-emerald-50/95", children: "Toi uu luong order, cap nhat trang thai nhanh va giam thoi gian cho cua khach." })] }), _jsx(MonitorSmartphone, { className: "h-8 w-8 text-emerald-100" })] }), _jsxs("p", { className: "mt-3 text-xs text-emerald-100/90", children: ["Phien lam viec bat dau: ", now] })] }), _jsxs("section", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [_jsxs("div", { className: "rounded-xl border bg-white p-5 shadow-sm", children: [_jsx("p", { className: "text-sm text-slate-500", children: "So don hien co" }), _jsx("p", { className: "mt-2 text-3xl font-semibold text-slate-900", children: orderCount })] }), _jsxs("div", { className: "rounded-xl border bg-white p-5 shadow-sm", children: [_jsx("p", { className: "text-sm text-slate-500", children: "Mon dang phuc vu" }), _jsx("p", { className: "mt-2 text-3xl font-semibold text-slate-900", children: availableMenuCount })] })] }), _jsxs("section", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [_jsxs(Link, { to: "/orders", className: "rounded-xl border bg-white p-5 shadow-sm transition hover:shadow", children: [_jsxs("div", { className: "flex items-center gap-2 text-slate-800", children: [_jsx(ClipboardList, { className: "h-5 w-5 text-emerald-700" }), _jsx("h3", { className: "font-semibold", children: "Order Queue" })] }), _jsx("p", { className: "mt-2 text-sm text-slate-600", children: "Nhan don moi, cap nhat pending/preparing/ready." })] }), _jsxs(Link, { to: "/menu", className: "rounded-xl border bg-white p-5 shadow-sm transition hover:shadow", children: [_jsxs("div", { className: "flex items-center gap-2 text-slate-800", children: [_jsx(UtensilsCrossed, { className: "h-5 w-5 text-cyan-700" }), _jsx("h3", { className: "font-semibold", children: "Menu Lookup" })] }), _jsx("p", { className: "mt-2 text-sm text-slate-600", children: "Kiem tra gia, tinh trang mon va nhom danh muc." })] }), _jsxs(Link, { to: "/customer-feedback", className: "rounded-xl border bg-white p-5 shadow-sm transition hover:shadow", children: [_jsxs("div", { className: "flex items-center gap-2 text-slate-800", children: [_jsx(MessageSquareText, { className: "h-5 w-5 text-violet-700" }), _jsx("h3", { className: "font-semibold", children: "Issue & Feedback" })] }), _jsx("p", { className: "mt-2 text-sm text-slate-600", children: "Bao cao su co hoat dong va theo doi xu ly." })] })] })] }) }));
};
export default POSDashboard;
