import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Edit2, Plus, AlertCircle, Package } from 'lucide-react';
import { inventoryAPI, usersAPI } from '../services/api';

interface InventoryItem {
    id: number;
    item_name: string;
    equipment_type: string;
    quantity: number;
    unit: string;
    min_quantity: number;
    supplier?: string;
    cost_per_unit: number;
    last_updated_by?: number;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
}

export default function InventoryManagement() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [stockAction, setStockAction] = useState<'add' | 'remove'>('add');
    const [stockQuantity, setStockQuantity] = useState('');
    const [stockNotes, setStockNotes] = useState('');
    const [filterLowStock, setFilterLowStock] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
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

    const normalizeInventoryItem = (item: InventoryItem): InventoryItem => ({
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
            const payload = response.data as unknown;
            const normalizedItems = Array.isArray(payload)
                ? payload
                : Array.isArray((payload as { data?: unknown })?.data)
                    ? ((payload as { data: InventoryItem[] }).data ?? [])
                    : Array.isArray((payload as { items?: unknown })?.items)
                        ? ((payload as { items: InventoryItem[] }).items ?? [])
                        : [];
            setItems(normalizedItems.map(normalizeInventoryItem));
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to fetch inventory');
        } finally {
            setLoading(false);
        }
    };

    // Fetch users for last_updated_by display
    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll();
            const payload = response.data as unknown;
            const normalizedUsers = Array.isArray(payload)
                ? payload
                : Array.isArray((payload as { data?: unknown })?.data)
                    ? ((payload as { data: User[] }).data ?? [])
                    : Array.isArray((payload as { users?: unknown })?.users)
                        ? ((payload as { users: User[] }).users ?? [])
                        : [];
            setUsers(normalizedUsers);
        } catch (err) {
            console.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchItems();
        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            } else {
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
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to save item');
        }
    };

    const handleEdit = (item: InventoryItem) => {
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

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            setError('');
            await inventoryAPI.delete(id);
            setSuccessMessage('Item deleted successfully');
            await fetchItems();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to delete item');
        }
    };

    const openStockModal = (item: InventoryItem, action: 'add' | 'remove') => {
        setSelectedItem(item);
        setStockAction(action);
        setStockQuantity('');
        setStockNotes('');
        setShowStockModal(true);
    };

    const handleStockSubmit = async (e: React.FormEvent) => {
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
            } else {
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
        } catch (err: any) {
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

    const totalValue = items.reduce(
        (sum, item) => sum + item.quantity * item.cost_per_unit,
        0
    );

    const lowStockCount = items.filter((item) => item.quantity <= item.min_quantity).length;

    const getUserName = (userId: number | undefined) => {
        if (!userId) return 'System';
        const user = users.find((u) => u.id === userId);
        return user?.name || `User ${userId}`;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="w-8 h-8" />
                        Inventory Management
                    </h1>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Total Items</p>
                        <p className="text-3xl font-bold text-blue-600">{items.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Total Value</p>
                        <p className="text-3xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Low Stock Items</p>
                        <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
                    </div>
                </div>

                {/* Alert Messages */}
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

                {/* Low Stock Alert */}
                {lowStockCount > 0 && (
                    <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded mb-4 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Low Stock Alert</p>
                            <p className="text-sm">{lowStockCount} items are below minimum quantity threshold.</p>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex gap-4 mb-6 flex-wrap">
                    {isManager && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            {showForm ? 'Cancel' : 'Add Item'}
                        </button>
                    )}
                    <button
                        onClick={() => setFilterLowStock(!filterLowStock)}
                        className={`px-4 py-2 rounded flex items-center gap-2 ${
                            filterLowStock
                                ? 'bg-orange-600 text-white hover:bg-orange-700'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        <AlertCircle className="w-5 h-5" />
                        {filterLowStock ? 'Showing Low Stock' : 'Show All Items'}
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showForm && isManager && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? 'Edit Item' : 'Add New Item'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Item Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="item_name"
                                        value={formData.item_name}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type *
                                    </label>
                                    <input
                                        type="text"
                                        name="equipment_type"
                                        value={formData.equipment_type}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Coffee Beans, Cups, etc."
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Unit *
                                    </label>
                                    <input
                                        type="text"
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                        placeholder="e.g., kg, liters, pieces"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Min Quantity (Alert)
                                    </label>
                                    <input
                                        type="number"
                                        name="min_quantity"
                                        value={formData.min_quantity}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cost Per Unit
                                    </label>
                                    <input
                                        type="number"
                                        name="cost_per_unit"
                                        value={formData.cost_per_unit}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Supplier
                                    </label>
                                    <input
                                        type="text"
                                        name="supplier"
                                        value={formData.supplier}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                >
                                    {editingId ? 'Update' : 'Create'} Item
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Items List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Loading inventory...</div>
                    ) : displayItems.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">
                            {filterLowStock ? 'No low stock items' : 'No inventory items yet'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Item Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Cost/Unit
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Total Value
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {displayItems.map((item) => {
                                        const isLowStock =
                                            item.quantity <= item.min_quantity;
                                        const itemTotal = item.quantity * item.cost_per_unit;

                                        return (
                                            <tr
                                                key={item.id}
                                                className={`hover:bg-gray-50 ${
                                                    isLowStock ? 'bg-orange-50' : ''
                                                }`}
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {item.item_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {item.equipment_type}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center font-semibold">
                                                    {item.quantity} {item.unit}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center text-gray-600">
                                                    ${item.cost_per_unit.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center font-semibold">
                                                    ${itemTotal.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {isLowStock ? (
                                                        <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                                                            <AlertCircle className="w-4 h-4" />
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                                            OK
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        {isManager && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        openStockModal(item, 'add')
                                                                    }
                                                                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded text-xs"
                                                                    title="Add Stock"
                                                                >
                                                                    +Stock
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        openStockModal(
                                                                            item,
                                                                            'remove'
                                                                        )
                                                                    }
                                                                    className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2 py-1 rounded text-xs"
                                                                    title="Remove Stock"
                                                                >
                                                                    -Stock
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleEdit(item)
                                                                    }
                                                                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(item.id)
                                                                    }
                                                                    className="bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Stock Modal */}
                {showStockModal && selectedItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                            <h3 className="text-xl font-bold mb-4">
                                {stockAction === 'add' ? 'Add Stock' : 'Remove Stock'} -{' '}
                                {selectedItem.item_name}
                            </h3>

                            <form onSubmit={handleStockSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Quantity: {selectedItem.quantity} {selectedItem.unit}
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {stockAction === 'add' ? 'Add' : 'Remove'} Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        value={stockQuantity}
                                        onChange={(e) => setStockQuantity(e.target.value)}
                                        placeholder="0"
                                        min="1"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={stockNotes}
                                        onChange={(e) => setStockNotes(e.target.value)}
                                        placeholder="e.g., Received from supplier"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className={`flex-1 text-white px-4 py-2 rounded ${
                                            stockAction === 'add'
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                    >
                                        {stockAction === 'add' ? 'Add' : 'Remove'} Stock
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowStockModal(false)}
                                        className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
