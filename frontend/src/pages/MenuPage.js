import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { menuAPI } from '../services/api';
const categories = ['coffee', 'tea', 'smoothie', 'food', 'other'];
const MenuPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'coffee',
        price: '',
        cost: '',
        description: '',
        imageUrl: '',
    });
    const { user } = useAuth();
    const isManager = user?.role === 'manager';
    const fetchMenu = async () => {
        try {
            setLoading(true);
            setError('');
            const params = {};
            if (categoryFilter !== 'all') {
                params.category = categoryFilter;
            }
            if (onlyAvailable) {
                params.availableOnly = true;
            }
            const response = await menuAPI.getAll(params);
            setItems(response.data || []);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch menu');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMenu();
    }, [categoryFilter, onlyAvailable]);
    const handleCreate = async (event) => {
        event.preventDefault();
        setError('');
        if (!formData.name || !formData.price) {
            setError('Name va price la bat buoc');
            return;
        }
        try {
            await menuAPI.create({
                name: formData.name,
                category: formData.category,
                price: Number(formData.price),
                cost: formData.cost ? Number(formData.cost) : 0,
                description: formData.description || undefined,
                imageUrl: formData.imageUrl || undefined,
            });
            setShowForm(false);
            setFormData({
                name: '',
                category: 'coffee',
                price: '',
                cost: '',
                description: '',
                imageUrl: '',
            });
            await fetchMenu();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to create menu item');
        }
    };
    const handleToggleAvailability = async (id) => {
        try {
            await menuAPI.toggleAvailability(id);
            await fetchMenu();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to update availability');
        }
    };
    const categorySummary = useMemo(() => {
        return categories.reduce((acc, category) => {
            acc[category] = items.filter((item) => item.category === category).length;
            return acc;
        }, {});
    }, [items]);
    const formatMoney = (value) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value || 0);
    return (_jsx("div", { className: "min-h-full bg-slate-100 p-4 md:p-8", children: _jsxs("div", { className: "mx-auto max-w-7xl space-y-6", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("h1", { className: "flex items-center gap-2 text-2xl font-semibold text-slate-900", children: [_jsx(UtensilsCrossed, { className: "h-6 w-6" }), " Menu"] }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Quan ly thuc don va tinh san sang phuc vu cua mon." })] }), isManager && (_jsxs("button", { onClick: () => setShowForm((prev) => !prev), className: "inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700", children: [_jsx(Plus, { className: "h-4 w-4" }), showForm ? 'Dong form' : 'Them mon'] }))] }), _jsx("div", { className: "grid grid-cols-2 gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-5", children: categories.map((category) => (_jsxs("div", { className: "rounded-lg border border-slate-200 p-3 text-center", children: [_jsx("p", { className: "text-xs uppercase text-slate-500", children: category }), _jsx("p", { className: "mt-1 text-xl font-semibold text-slate-900", children: categorySummary[category] || 0 })] }, category))) }), _jsxs("div", { className: "grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3", children: [_jsxs("select", { value: categoryFilter, onChange: (e) => setCategoryFilter(e.target.value), className: "rounded-lg border border-slate-300 px-3 py-2 text-sm", children: [_jsx("option", { value: "all", children: "Tat ca danh muc" }), categories.map((category) => (_jsx("option", { value: category, children: category }, category)))] }), _jsxs("label", { className: "flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", children: [_jsx("input", { type: "checkbox", checked: onlyAvailable, onChange: (e) => setOnlyAvailable(e.target.checked) }), "Chi hien thi mon dang available"] })] }), showForm && isManager && (_jsxs("form", { onSubmit: handleCreate, className: "rounded-xl bg-white p-4 shadow-sm", children: [_jsx("h2", { className: "mb-3 text-sm font-semibold text-slate-800", children: "Tao mon moi" }), _jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: [_jsx("input", { placeholder: "Ten mon", value: formData.name, onChange: (e) => setFormData((prev) => ({ ...prev, name: e.target.value })), className: "rounded-lg border border-slate-300 px-3 py-2 text-sm" }), _jsx("select", { value: formData.category, onChange: (e) => setFormData((prev) => ({
                                        ...prev,
                                        category: e.target.value,
                                    })), className: "rounded-lg border border-slate-300 px-3 py-2 text-sm", children: categories.map((category) => (_jsx("option", { value: category, children: category }, category))) }), _jsx("input", { type: "number", placeholder: "Gia ban", value: formData.price, onChange: (e) => setFormData((prev) => ({ ...prev, price: e.target.value })), className: "rounded-lg border border-slate-300 px-3 py-2 text-sm" }), _jsx("input", { type: "number", placeholder: "Gia von", value: formData.cost, onChange: (e) => setFormData((prev) => ({ ...prev, cost: e.target.value })), className: "rounded-lg border border-slate-300 px-3 py-2 text-sm" }), _jsx("input", { placeholder: "Image URL", value: formData.imageUrl, onChange: (e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value })), className: "rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" }), _jsx("textarea", { placeholder: "Mo ta mon", value: formData.description, onChange: (e) => setFormData((prev) => ({ ...prev, description: e.target.value })), className: "min-h-[88px] rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" })] }), _jsx("button", { type: "submit", className: "mt-3 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800", children: "Luu mon" })] })), error && _jsx("div", { className: "rounded-lg bg-red-50 p-3 text-sm text-red-700", children: error }), _jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3", children: loading ? (_jsx("div", { className: "rounded-xl bg-white p-6 text-sm text-slate-500 shadow-sm", children: "Dang tai menu..." })) : items.length === 0 ? (_jsx("div", { className: "rounded-xl bg-white p-6 text-sm text-slate-500 shadow-sm", children: "Khong co mon nao." })) : (items.map((item) => (_jsxs("div", { className: "rounded-xl border border-slate-200 bg-white p-4 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("h3", { className: "text-base font-semibold text-slate-900", children: item.name }), _jsx("span", { className: "rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600", children: item.category })] }), _jsx("p", { className: "mt-2 text-sm text-slate-600", children: item.description || 'Khong co mo ta' }), _jsxs("div", { className: "mt-3 flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: formatMoney(item.price) }), _jsx("span", { className: `rounded-full px-2.5 py-1 text-xs ${item.is_available
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-slate-200 text-slate-600'}`, children: item.is_available ? 'available' : 'unavailable' })] }), isManager && (_jsx("button", { onClick: () => handleToggleAvailability(item.id), className: "mt-3 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700", children: "Toggle availability" }))] }, item.id)))) })] }) }));
};
export default MenuPage;
