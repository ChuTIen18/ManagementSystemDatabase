import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { menuAPI } from '../services/api';

interface MenuItem {
    id: number;
    name: string;
    category: 'coffee' | 'tea' | 'smoothie' | 'food' | 'other';
    description?: string;
    price: number;
    cost?: number;
    image_url?: string;
    is_available: boolean;
}

const categories: Array<MenuItem['category']> = ['coffee', 'tea', 'smoothie', 'food', 'other'];

const MenuPage = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
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
            const params: any = {};
            if (categoryFilter !== 'all') {
                params.category = categoryFilter;
            }
            if (onlyAvailable) {
                params.availableOnly = true;
            }
            const response = await menuAPI.getAll(params);
            setItems(response.data || []);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to fetch menu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, [categoryFilter, onlyAvailable]);

    const handleCreate = async (event: FormEvent) => {
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
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to create menu item');
        }
    };

    const handleToggleAvailability = async (id: number) => {
        try {
            await menuAPI.toggleAvailability(id);
            await fetchMenu();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to update availability');
        }
    };

    const categorySummary = useMemo(() => {
        return categories.reduce<Record<string, number>>((acc, category) => {
            acc[category] = items.filter((item) => item.category === category).length;
            return acc;
        }, {});
    }, [items]);

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
                            <UtensilsCrossed className="h-6 w-6" /> Menu
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">Quan ly thuc don va tinh san sang phuc vu cua mon.</p>
                    </div>
                    {isManager && (
                        <button
                            onClick={() => setShowForm((prev) => !prev)}
                            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700"
                        >
                            <Plus className="h-4 w-4" />
                            {showForm ? 'Dong form' : 'Them mon'}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-5">
                    {categories.map((category) => (
                        <div key={category} className="rounded-lg border border-slate-200 p-3 text-center">
                            <p className="text-xs uppercase text-slate-500">{category}</p>
                            <p className="mt-1 text-xl font-semibold text-slate-900">{categorySummary[category] || 0}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                        <option value="all">Tat ca danh muc</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={onlyAvailable}
                            onChange={(e) => setOnlyAvailable(e.target.checked)}
                        />
                        Chi hien thi mon dang available
                    </label>
                </div>

                {showForm && isManager && (
                    <form onSubmit={handleCreate} className="rounded-xl bg-white p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-slate-800">Tao mon moi</h2>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <input
                                placeholder="Ten mon"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        category: e.target.value as MenuItem['category'],
                                    }))
                                }
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Gia ban"
                                value={formData.price}
                                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Gia von"
                                value={formData.cost}
                                onChange={(e) => setFormData((prev) => ({ ...prev, cost: e.target.value }))}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                            <input
                                placeholder="Image URL"
                                value={formData.imageUrl}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                                }
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                            />
                            <textarea
                                placeholder="Mo ta mon"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                                }
                                className="min-h-[88px] rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Luu mon
                        </button>
                    </form>
                )}

                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <div className="rounded-xl bg-white p-6 text-sm text-slate-500 shadow-sm">Dang tai menu...</div>
                    ) : items.length === 0 ? (
                        <div className="rounded-xl bg-white p-6 text-sm text-slate-500 shadow-sm">Khong co mon nao.</div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-base font-semibold text-slate-900">{item.name}</h3>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                        {item.category}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">{item.description || 'Khong co mo ta'}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-900">{formatMoney(item.price)}</p>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs ${
                                            item.is_available
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-200 text-slate-600'
                                        }`}
                                    >
                                        {item.is_available ? 'available' : 'unavailable'}
                                    </span>
                                </div>
                                {isManager && (
                                    <button
                                        onClick={() => handleToggleAvailability(item.id)}
                                        className="mt-3 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700"
                                    >
                                        Toggle availability
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
