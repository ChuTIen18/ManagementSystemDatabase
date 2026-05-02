import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Plus, Trash2, Edit2, Percent, Tag, CalendarDays } from 'lucide-react';
import { promotionsAPI } from '../services/api';

interface Promotion {
    id: number;
    name: string;
    description?: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount?: number;
    max_discount_amount?: number;
    applicable_items?: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_by: number;
    created_at: string;
}

export default function PromotionsManagement() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: '',
        max_discount_amount: '',
        applicable_items: '',
        start_date: '',
        end_date: '',
        is_active: true,
    });
    const [applyForm, setApplyForm] = useState({
        orderId: '',
        promotionId: '',
    });

    const { user } = useAuth();
    const isManager = user?.role === 'manager';

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await promotionsAPI.getAll();
            setPromotions(response.data || []);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to load promotions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            discount_type: 'percentage',
            discount_value: '',
            min_order_amount: '',
            max_discount_amount: '',
            applicable_items: '',
            start_date: '',
            end_date: '',
            is_active: true,
        });
        setEditingId(null);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.name || !formData.discount_value || !formData.start_date || !formData.end_date) {
            setError('Name, discount value, start date, and end date are required');
            return;
        }

        try {
            const payload = {
                name: formData.name,
                description: formData.description || null,
                discount_type: formData.discount_type,
                discount_value: Number(formData.discount_value),
                min_order_amount:
                    formData.min_order_amount !== '' ? Number(formData.min_order_amount) : null,
                max_discount_amount:
                    formData.max_discount_amount !== '' ? Number(formData.max_discount_amount) : null,
                applicable_items: formData.applicable_items
                    ? formData.applicable_items
                          .split(',')
                          .map((item) => item.trim())
                          .filter(Boolean)
                    : null,
                start_date: formData.start_date,
                end_date: formData.end_date,
                is_active: formData.is_active,
            };

            if (editingId) {
                await promotionsAPI.update(editingId, payload);
                setSuccessMessage('Promotion updated successfully');
            } else {
                await promotionsAPI.create(payload);
                setSuccessMessage('Promotion created successfully');
            }

            resetForm();
            setShowForm(false);
            await fetchPromotions();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to save promotion');
        }
    };

    const handleEdit = (promotion: Promotion) => {
        setFormData({
            name: promotion.name,
            description: promotion.description || '',
            discount_type: promotion.discount_type,
            discount_value: promotion.discount_value.toString(),
            min_order_amount: promotion.min_order_amount?.toString() || '',
            max_discount_amount: promotion.max_discount_amount?.toString() || '',
            applicable_items: promotion.applicable_items || '',
            start_date: promotion.start_date,
            end_date: promotion.end_date,
            is_active: promotion.is_active,
        });
        setEditingId(promotion.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this promotion?')) return;
        try {
            await promotionsAPI.delete(id);
            setSuccessMessage('Promotion deleted successfully');
            await fetchPromotions();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to delete promotion');
        }
    };

    const handleToggle = async (promotion: Promotion) => {
        try {
            await promotionsAPI.update(promotion.id, { is_active: !promotion.is_active });
            await fetchPromotions();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to update promotion status');
        }
    };

    const handleApplyPromotion = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!applyForm.orderId || !applyForm.promotionId) {
            setError('Order ID and Promotion ID are required');
            return;
        }

        try {
            await promotionsAPI.applyToOrder(Number(applyForm.orderId), {
                promotionId: Number(applyForm.promotionId),
            });
            setSuccessMessage('Promotion applied to order successfully');
            setApplyForm({ orderId: '', promotionId: '' });
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to apply promotion');
        }
    };

    const getStatusLabel = (promotion: Promotion) => {
        const today = new Date();
        const start = new Date(promotion.start_date);
        const end = new Date(promotion.end_date);
        if (!promotion.is_active) return 'Inactive';
        if (today < start) return 'Scheduled';
        if (today > end) return 'Expired';
        return 'Active';
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <Percent className="w-8 h-8" />
                            Promotions Management
                        </h1>
                        <p className="text-gray-600 mt-1">Create and manage discount campaigns.</p>
                    </div>
                    {isManager && (
                        <button
                            onClick={() => {
                                setShowForm((prev) => !prev);
                                if (showForm) resetForm();
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            {showForm ? 'Close Form' : 'Add Promotion'}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>{error}</div>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                        {successMessage}
                    </div>
                )}

                {showForm && isManager && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? 'Edit Promotion' : 'Add New Promotion'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                                    <select
                                        name="discount_type"
                                        value={formData.discount_type}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                                    <input
                                        type="number"
                                        name="discount_value"
                                        value={formData.discount_value}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                                    <input
                                        type="number"
                                        name="min_order_amount"
                                        value={formData.min_order_amount}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount</label>
                                    <input
                                        type="number"
                                        name="max_discount_amount"
                                        value={formData.max_discount_amount}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Items</label>
                                    <input
                                        name="applicable_items"
                                        value={formData.applicable_items}
                                        onChange={handleInputChange}
                                        placeholder="Comma-separated item IDs or names"
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    rows={3}
                                />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                />
                                Active
                            </label>
                            <div className="flex gap-2">
                                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400">
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5" /> Apply Promotion to Order
                    </h2>
                    <form onSubmit={handleApplyPromotion} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                            <input
                                type="number"
                                value={applyForm.orderId}
                                onChange={(e) => setApplyForm((prev) => ({ ...prev, orderId: e.target.value }))}
                                className="w-full border rounded px-3 py-2"
                                min="1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Promotion ID</label>
                            <input
                                type="number"
                                value={applyForm.promotionId}
                                onChange={(e) => setApplyForm((prev) => ({ ...prev, promotionId: e.target.value }))}
                                className="w-full border rounded px-3 py-2"
                                min="1"
                                required
                            />
                        </div>
                        <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 h-[42px]">
                            Apply Promotion
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {loading ? (
                        <div className="col-span-full text-center py-10 text-gray-600">Loading promotions...</div>
                    ) : promotions.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-600">No promotions found</div>
                    ) : (
                        promotions.map((promotion) => {
                            const status = getStatusLabel(promotion);
                            return (
                                <div key={promotion.id} className="bg-white rounded-lg shadow p-5 border border-gray-100">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{promotion.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{promotion.description || 'No description'}</p>
                                        </div>
                                        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">{status}</span>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Percent className="w-4 h-4" />
                                            <span>
                                                {promotion.discount_type === 'percentage'
                                                    ? `${promotion.discount_value}%`
                                                    : `$${promotion.discount_value.toFixed(2)}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="w-4 h-4" />
                                            <span>
                                                {promotion.start_date} to {promotion.end_date}
                                            </span>
                                        </div>
                                        {promotion.min_order_amount != null && (
                                            <div>Min order: ${promotion.min_order_amount.toFixed(2)}</div>
                                        )}
                                        {promotion.max_discount_amount != null && (
                                            <div>Max discount: ${promotion.max_discount_amount.toFixed(2)}</div>
                                        )}
                                    </div>

                                    {isManager && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button onClick={() => handleEdit(promotion)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1">
                                                <Edit2 className="w-4 h-4" /> Edit
                                            </button>
                                            <button onClick={() => handleToggle(promotion)} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm">
                                                {promotion.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button onClick={() => handleDelete(promotion.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm flex items-center gap-1">
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
