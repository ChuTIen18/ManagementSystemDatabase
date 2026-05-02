import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Plus, Trash2, Edit2, Percent, Tag, CalendarDays } from 'lucide-react';
import { promotionsAPI } from '../services/api';
export default function PromotionsManagement() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to load promotions');
        }
        finally {
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
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    const handleSubmit = async (e) => {
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
                min_order_amount: formData.min_order_amount !== '' ? Number(formData.min_order_amount) : null,
                max_discount_amount: formData.max_discount_amount !== '' ? Number(formData.max_discount_amount) : null,
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
            }
            else {
                await promotionsAPI.create(payload);
                setSuccessMessage('Promotion created successfully');
            }
            resetForm();
            setShowForm(false);
            await fetchPromotions();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to save promotion');
        }
    };
    const handleEdit = (promotion) => {
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
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this promotion?'))
            return;
        try {
            await promotionsAPI.delete(id);
            setSuccessMessage('Promotion deleted successfully');
            await fetchPromotions();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to delete promotion');
        }
    };
    const handleToggle = async (promotion) => {
        try {
            await promotionsAPI.update(promotion.id, { is_active: !promotion.is_active });
            await fetchPromotions();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to update promotion status');
        }
    };
    const handleApplyPromotion = async (e) => {
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
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to apply promotion');
        }
    };
    const getStatusLabel = (promotion) => {
        const today = new Date();
        const start = new Date(promotion.start_date);
        const end = new Date(promotion.end_date);
        if (!promotion.is_active)
            return 'Inactive';
        if (today < start)
            return 'Scheduled';
        if (today > end)
            return 'Expired';
        return 'Active';
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-100 p-4 md:p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "mb-8 flex items-center justify-between gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(Percent, { className: "w-8 h-8" }), "Promotions Management"] }), _jsx("p", { className: "text-gray-600 mt-1", children: "Create and manage discount campaigns." })] }), isManager && (_jsxs("button", { onClick: () => {
                                setShowForm((prev) => !prev);
                                if (showForm)
                                    resetForm();
                            }, className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), showForm ? 'Close Form' : 'Add Promotion'] }))] }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("div", { children: error })] })), successMessage && (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4", children: successMessage })), showForm && isManager && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: editingId ? 'Edit Promotion' : 'Add New Promotion' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Name *" }), _jsx("input", { name: "name", value: formData.name, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Discount Type *" }), _jsxs("select", { name: "discount_type", value: formData.discount_type, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", children: [_jsx("option", { value: "percentage", children: "Percentage" }), _jsx("option", { value: "fixed", children: "Fixed" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Discount Value *" }), _jsx("input", { type: "number", name: "discount_value", value: formData.discount_value, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", step: "0.01", min: "0", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Min Order Amount" }), _jsx("input", { type: "number", name: "min_order_amount", value: formData.min_order_amount, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", step: "0.01", min: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Max Discount Amount" }), _jsx("input", { type: "number", name: "max_discount_amount", value: formData.max_discount_amount, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", step: "0.01", min: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Applicable Items" }), _jsx("input", { name: "applicable_items", value: formData.applicable_items, onChange: handleInputChange, placeholder: "Comma-separated item IDs or names", className: "w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date *" }), _jsx("input", { type: "date", name: "start_date", value: formData.start_date, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date *" }), _jsx("input", { type: "date", name: "end_date", value: formData.end_date, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", rows: 3 })] }), _jsxs("label", { className: "flex items-center gap-2 text-sm text-gray-700", children: [_jsx("input", { type: "checkbox", name: "is_active", checked: formData.is_active, onChange: handleInputChange }), "Active"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", className: "bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700", children: editingId ? 'Update' : 'Create' }), _jsx("button", { type: "button", onClick: resetForm, className: "bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400", children: "Reset" })] })] })] })), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [_jsx(Tag, { className: "w-5 h-5" }), " Apply Promotion to Order"] }), _jsxs("form", { onSubmit: handleApplyPromotion, className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Order ID" }), _jsx("input", { type: "number", value: applyForm.orderId, onChange: (e) => setApplyForm((prev) => ({ ...prev, orderId: e.target.value })), className: "w-full border rounded px-3 py-2", min: "1", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Promotion ID" }), _jsx("input", { type: "number", value: applyForm.promotionId, onChange: (e) => setApplyForm((prev) => ({ ...prev, promotionId: e.target.value })), className: "w-full border rounded px-3 py-2", min: "1", required: true })] }), _jsx("button", { className: "bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 h-[42px]", children: "Apply Promotion" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: loading ? (_jsx("div", { className: "col-span-full text-center py-10 text-gray-600", children: "Loading promotions..." })) : promotions.length === 0 ? (_jsx("div", { className: "col-span-full text-center py-10 text-gray-600", children: "No promotions found" })) : (promotions.map((promotion) => {
                        const status = getStatusLabel(promotion);
                        return (_jsxs("div", { className: "bg-white rounded-lg shadow p-5 border border-gray-100", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-800", children: promotion.name }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: promotion.description || 'No description' })] }), _jsx("span", { className: "text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700", children: status })] }), _jsxs("div", { className: "mt-4 space-y-2 text-sm text-gray-700", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Percent, { className: "w-4 h-4" }), _jsx("span", { children: promotion.discount_type === 'percentage'
                                                        ? `${promotion.discount_value}%`
                                                        : `$${promotion.discount_value.toFixed(2)}` })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CalendarDays, { className: "w-4 h-4" }), _jsxs("span", { children: [promotion.start_date, " to ", promotion.end_date] })] }), promotion.min_order_amount != null && (_jsxs("div", { children: ["Min order: $", promotion.min_order_amount.toFixed(2)] })), promotion.max_discount_amount != null && (_jsxs("div", { children: ["Max discount: $", promotion.max_discount_amount.toFixed(2)] }))] }), isManager && (_jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [_jsxs("button", { onClick: () => handleEdit(promotion), className: "bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1", children: [_jsx(Edit2, { className: "w-4 h-4" }), " Edit"] }), _jsx("button", { onClick: () => handleToggle(promotion), className: "bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm", children: promotion.is_active ? 'Deactivate' : 'Activate' }), _jsxs("button", { onClick: () => handleDelete(promotion.id), className: "bg-red-100 text-red-700 px-3 py-1 rounded text-sm flex items-center gap-1", children: [_jsx(Trash2, { className: "w-4 h-4" }), " Delete"] })] }))] }, promotion.id));
                    })) })] }) }));
}
