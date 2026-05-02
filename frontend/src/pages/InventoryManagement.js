import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Edit2, Plus, AlertCircle, Package } from 'lucide-react';
import { inventoryAPI, usersAPI } from '../services/api';
export default function InventoryManagement() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [stockAction, setStockAction] = useState('add');
    const [stockQuantity, setStockQuantity] = useState('');
    const [stockNotes, setStockNotes] = useState('');
    const [filterLowStock, setFilterLowStock] = useState(false);
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const isManager = user?.role === 'manager';
    const [formData, setFormData] = useState({
        item_name: '',
        equipment_type: '',
        quantity: '',
        unit: '',
        min_quantity: '',
        supplier: '',
        cost_per_unit: '',
    });
    const normalizeInventoryItem = (item) => ({
        ...item,
        quantity: Number(item.quantity) || 0,
        min_quantity: Number(item.min_quantity) || 0,
        cost_per_unit: Number(item.cost_per_unit) || 0,
    });
    // Fetch inventory items
    const fetchItems = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await inventoryAPI.getAll();
            const payload = response.data;
            const normalizedItems = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.data)
                    ? (payload.data ?? [])
                    : Array.isArray(payload?.items)
                        ? (payload.items ?? [])
                        : [];
            setItems(normalizedItems.map(normalizeInventoryItem));
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch inventory');
        }
        finally {
            setLoading(false);
        }
    };
    // Fetch users for last_updated_by display
    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll();
            const payload = response.data;
            const normalizedUsers = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.data)
                    ? (payload.data ?? [])
                    : Array.isArray(payload?.users)
                        ? (payload.users ?? [])
                        : [];
            setUsers(normalizedUsers);
        }
        catch (err) {
            console.error('Failed to fetch users');
        }
    };
    useEffect(() => {
        fetchItems();
        fetchUsers();
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!formData.item_name || !formData.equipment_type || !formData.unit) {
            setError('Item name, type, and unit are required');
            return;
        }
        try {
            if (editingId) {
                // Update item
                await inventoryAPI.update(editingId, {
                    item_name: formData.item_name,
                    equipment_type: formData.equipment_type,
                    unit: formData.unit,
                    quantity: parseInt(formData.quantity) || 0,
                    min_quantity: parseInt(formData.min_quantity) || 0,
                    supplier: formData.supplier || null,
                    cost_per_unit: parseFloat(formData.cost_per_unit) || 0,
                });
                setSuccessMessage('Item updated successfully');
            }
            else {
                // Create new item
                await inventoryAPI.create({
                    item_name: formData.item_name,
                    equipment_type: formData.equipment_type,
                    unit: formData.unit,
                    quantity: parseInt(formData.quantity) || 0,
                    min_quantity: parseInt(formData.min_quantity) || 0,
                    supplier: formData.supplier || null,
                    cost_per_unit: parseFloat(formData.cost_per_unit) || 0,
                });
                setSuccessMessage('Item created successfully');
            }
            setFormData({
                item_name: '',
                equipment_type: '',
                quantity: '',
                unit: '',
                min_quantity: '',
                supplier: '',
                cost_per_unit: '',
            });
            setShowForm(false);
            setEditingId(null);
            await fetchItems();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to save item');
        }
    };
    const handleEdit = (item) => {
        const normalizedItem = normalizeInventoryItem(item);
        setFormData({
            item_name: normalizedItem.item_name,
            equipment_type: normalizedItem.equipment_type,
            quantity: normalizedItem.quantity.toString(),
            unit: normalizedItem.unit,
            min_quantity: normalizedItem.min_quantity.toString(),
            supplier: normalizedItem.supplier || '',
            cost_per_unit: normalizedItem.cost_per_unit.toString(),
        });
        setEditingId(normalizedItem.id);
        setShowForm(true);
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }
        try {
            setError('');
            await inventoryAPI.delete(id);
            setSuccessMessage('Item deleted successfully');
            await fetchItems();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to delete item');
        }
    };
    const openStockModal = (item, action) => {
        setSelectedItem(item);
        setStockAction(action);
        setStockQuantity('');
        setStockNotes('');
        setShowStockModal(true);
    };
    const handleStockSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!selectedItem || !stockQuantity) {
            setError('Please enter a quantity');
            return;
        }
        const quantity = parseInt(stockQuantity);
        if (quantity <= 0) {
            setError('Quantity must be greater than 0');
            return;
        }
        try {
            if (stockAction === 'add') {
                await inventoryAPI.addStock(selectedItem.id, {
                    quantity,
                    notes: stockNotes || null,
                });
                setSuccessMessage(`Added ${quantity} units successfully`);
            }
            else {
                if (quantity > selectedItem.quantity) {
                    setError(`Cannot remove ${quantity} units. Only ${selectedItem.quantity} available.`);
                    return;
                }
                await inventoryAPI.removeStock(selectedItem.id, {
                    quantity,
                    notes: stockNotes || null,
                });
                setSuccessMessage(`Removed ${quantity} units successfully`);
            }
            setShowStockModal(false);
            setSelectedItem(null);
            await fetchItems();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to update stock');
        }
    };
    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            item_name: '',
            equipment_type: '',
            quantity: '',
            unit: '',
            min_quantity: '',
            supplier: '',
            cost_per_unit: '',
        });
    };
    const displayItems = filterLowStock
        ? items.filter((item) => item.quantity <= item.min_quantity)
        : items;
    const totalValue = items.reduce((sum, item) => sum + item.quantity * item.cost_per_unit, 0);
    const lowStockCount = items.filter((item) => item.quantity <= item.min_quantity).length;
    const getUserName = (userId) => {
        if (!userId)
            return 'System';
        const user = users.find((u) => u.id === userId);
        return user?.name || `User ${userId}`;
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-100 p-4 md:p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("div", { className: "mb-8", children: _jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(Package, { className: "w-8 h-8" }), "Inventory Management"] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Items" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: items.length })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Value" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: ["$", totalValue.toFixed(2)] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Low Stock Items" }), _jsx("p", { className: "text-3xl font-bold text-orange-600", children: lowStockCount })] })] }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("div", { children: error })] })), successMessage && (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4", children: successMessage })), lowStockCount > 0 && (_jsxs("div", { className: "bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded mb-4 flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Low Stock Alert" }), _jsxs("p", { className: "text-sm", children: [lowStockCount, " items are below minimum quantity threshold."] })] })] })), _jsxs("div", { className: "flex gap-4 mb-6 flex-wrap", children: [isManager && (_jsxs("button", { onClick: () => setShowForm(!showForm), className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), showForm ? 'Cancel' : 'Add Item'] })), _jsxs("button", { onClick: () => setFilterLowStock(!filterLowStock), className: `px-4 py-2 rounded flex items-center gap-2 ${filterLowStock
                                ? 'bg-orange-600 text-white hover:bg-orange-700'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`, children: [_jsx(AlertCircle, { className: "w-5 h-5" }), filterLowStock ? 'Showing Low Stock' : 'Show All Items'] })] }), showForm && isManager && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: editingId ? 'Edit Item' : 'Add New Item' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Item Name *" }), _jsx("input", { type: "text", name: "item_name", value: formData.item_name, onChange: handleInputChange, className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type *" }), _jsx("input", { type: "text", name: "equipment_type", value: formData.equipment_type, onChange: handleInputChange, placeholder: "e.g., Coffee Beans, Cups, etc.", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Quantity" }), _jsx("input", { type: "number", name: "quantity", value: formData.quantity, onChange: handleInputChange, placeholder: "0", min: "0", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Unit *" }), _jsx("input", { type: "text", name: "unit", value: formData.unit, onChange: handleInputChange, placeholder: "e.g., kg, liters, pieces", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Min Quantity (Alert)" }), _jsx("input", { type: "number", name: "min_quantity", value: formData.min_quantity, onChange: handleInputChange, placeholder: "0", min: "0", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Cost Per Unit" }), _jsx("input", { type: "number", name: "cost_per_unit", value: formData.cost_per_unit, onChange: handleInputChange, placeholder: "0.00", min: "0", step: "0.01", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Supplier" }), _jsx("input", { type: "text", name: "supplier", value: formData.supplier, onChange: handleInputChange, className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { type: "submit", className: "bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700", children: [editingId ? 'Update' : 'Create', " Item"] }), _jsx("button", { type: "button", onClick: handleCancel, className: "bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400", children: "Cancel" })] })] })] })), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: loading ? (_jsx("div", { className: "p-8 text-center text-gray-600", children: "Loading inventory..." })) : displayItems.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-600", children: filterLowStock ? 'No low stock items' : 'No inventory items yet' })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Item Name" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Quantity" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Cost/Unit" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Total Value" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y", children: displayItems.map((item) => {
                                        const isLowStock = item.quantity <= item.min_quantity;
                                        const itemTotal = item.quantity * item.cost_per_unit;
                                        return (_jsxs("tr", { className: `hover:bg-gray-50 ${isLowStock ? 'bg-orange-50' : ''}`, children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: item.item_name }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: item.equipment_type }), _jsxs("td", { className: "px-6 py-4 text-sm text-center font-semibold", children: [item.quantity, " ", item.unit] }), _jsxs("td", { className: "px-6 py-4 text-sm text-center text-gray-600", children: ["$", item.cost_per_unit.toFixed(2)] }), _jsxs("td", { className: "px-6 py-4 text-sm text-center font-semibold", children: ["$", itemTotal.toFixed(2)] }), _jsx("td", { className: "px-6 py-4 text-center", children: isLowStock ? (_jsxs("span", { className: "inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), "Low Stock"] })) : (_jsx("span", { className: "inline-flex bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium", children: "OK" })) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsx("div", { className: "flex gap-2 justify-center", children: isManager && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => openStockModal(item, 'add'), className: "bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded text-xs", title: "Add Stock", children: "+Stock" }), _jsx("button", { onClick: () => openStockModal(item, 'remove'), className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2 py-1 rounded text-xs", title: "Remove Stock", children: "-Stock" }), _jsx("button", { onClick: () => handleEdit(item), className: "bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(item.id), className: "bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })) }) })] }, item.id));
                                    }) })] }) })) }), showStockModal && selectedItem && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg max-w-sm w-full p-6", children: [_jsxs("h3", { className: "text-xl font-bold mb-4", children: [stockAction === 'add' ? 'Add Stock' : 'Remove Stock', " -", ' ', selectedItem.item_name] }), _jsxs("form", { onSubmit: handleStockSubmit, className: "space-y-4", children: [_jsx("div", { children: _jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Current Quantity: ", selectedItem.quantity, " ", selectedItem.unit] }) }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [stockAction === 'add' ? 'Add' : 'Remove', " Quantity *"] }), _jsx("input", { type: "number", value: stockQuantity, onChange: (e) => setStockQuantity(e.target.value), placeholder: "0", min: "1", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notes (Optional)" }), _jsx("textarea", { value: stockNotes, onChange: (e) => setStockNotes(e.target.value), placeholder: "e.g., Received from supplier", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", rows: 3 })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { type: "submit", className: `flex-1 text-white px-4 py-2 rounded ${stockAction === 'add'
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-red-600 hover:bg-red-700'}`, children: [stockAction === 'add' ? 'Add' : 'Remove', " Stock"] }), _jsx("button", { type: "button", onClick: () => setShowStockModal(false), className: "flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400", children: "Cancel" })] })] })] }) }))] }) }));
}
