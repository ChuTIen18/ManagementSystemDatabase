import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Edit2, Plus, AlertCircle, Wrench } from 'lucide-react';
import { equipmentAPI, usersAPI } from '../services/api';

interface Equipment {
    id: number;
    equipment_name: string;
    equipment_type: string;
    purchase_date: string;
    purchase_cost: number;
    warranty_expiry?: string;
    location?: string;
    status: 'working' | 'maintenance' | 'broken';
    last_maintained_at?: string;
    last_maintained_by?: number;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
}

const getResponseList = <T,>(payload: any): T[] => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.users)) return payload.users;
    if (Array.isArray(payload?.equipment)) return payload.equipment;
    return [];
};

export default function EquipmentManagement() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const { user } = useAuth();
    const isManager = user?.role === 'manager';

    const [maintenanceData, setMaintenanceData] = useState({
        maintenance_type: '',
        description: '',
        cost: '',
    });

    const [formData, setFormData] = useState({
        equipment_name: '',
        equipment_type: '',
        purchase_date: '',
        purchase_cost: '',
        warranty_expiry: '',
        location: '',
        status: 'working',
    });

    // Fetch equipment
    const fetchEquipment = async () => {
        try {
            setLoading(true);
            setError('');
            const params: any = {};
            if (filterStatus) params.status = filterStatus;
            if (filterType) params.type = filterType;
            const response = await equipmentAPI.getAll(params);
            setEquipment(getResponseList<Equipment>(response.data));
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to fetch equipment');
        } finally {
            setLoading(false);
        }
    };

    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll();
            setUsers(getResponseList<User>(response.data));
        } catch (err) {
            console.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchEquipment();
        fetchUsers();
    }, [filterStatus, filterType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMaintenanceChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setMaintenanceData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.equipment_name || !formData.equipment_type || !formData.purchase_date) {
            setError('Equipment name, type, and purchase date are required');
            return;
        }

        try {
            if (editingId) {
                // Update equipment
                await equipmentAPI.update(editingId, {
                    equipment_name: formData.equipment_name,
                    equipment_type: formData.equipment_type,
                    purchase_date: formData.purchase_date,
                    purchase_cost: parseFloat(formData.purchase_cost) || 0,
                    warranty_expiry: formData.warranty_expiry || null,
                    location: formData.location || null,
                    status: formData.status,
                });
                setSuccessMessage('Equipment updated successfully');
            } else {
                // Create new equipment
                await equipmentAPI.create({
                    equipment_name: formData.equipment_name,
                    equipment_type: formData.equipment_type,
                    purchase_date: formData.purchase_date,
                    purchase_cost: parseFloat(formData.purchase_cost) || 0,
                    warranty_expiry: formData.warranty_expiry || null,
                    location: formData.location || null,
                    status: formData.status,
                });
                setSuccessMessage('Equipment created successfully');
            }

            setFormData({
                equipment_name: '',
                equipment_type: '',
                purchase_date: '',
                purchase_cost: '',
                warranty_expiry: '',
                location: '',
                status: 'working',
            });
            setShowForm(false);
            setEditingId(null);
            await fetchEquipment();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to save equipment');
        }
    };

    const handleEdit = (item: Equipment) => {
        setFormData({
            equipment_name: item.equipment_name,
            equipment_type: item.equipment_type,
            purchase_date: item.purchase_date,
            purchase_cost: item.purchase_cost.toString(),
            warranty_expiry: item.warranty_expiry || '',
            location: item.location || '',
            status: item.status,
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this equipment?')) {
            return;
        }

        try {
            setError('');
            await equipmentAPI.delete(id);
            setSuccessMessage('Equipment deleted successfully');
            await fetchEquipment();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to delete equipment');
        }
    };

    const openMaintenanceModal = (item: Equipment) => {
        setSelectedEquipment(item);
        setMaintenanceData({
            maintenance_type: '',
            description: '',
            cost: '',
        });
        setShowMaintenanceModal(true);
    };

    const handleMaintenanceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!selectedEquipment || !maintenanceData.maintenance_type) {
            setError('Please enter maintenance type');
            return;
        }

        try {
            await equipmentAPI.recordMaintenance(selectedEquipment.id, {
                maintenance_type: maintenanceData.maintenance_type,
                description: maintenanceData.description || null,
                cost: parseFloat(maintenanceData.cost) || 0,
            });

            setSuccessMessage('Maintenance recorded successfully');
            setShowMaintenanceModal(false);
            setSelectedEquipment(null);
            await fetchEquipment();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to record maintenance');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            equipment_name: '',
            equipment_type: '',
            purchase_date: '',
            purchase_cost: '',
            warranty_expiry: '',
            location: '',
            status: 'working',
        });
    };

    const getUserName = (userId: number | undefined) => {
        if (!userId) return 'System';
        const user = users.find((u) => u.id === userId);
        return user?.name || `User ${userId}`;
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'working':
                return 'bg-green-100 text-green-800';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            case 'broken':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const equipmentNeedingMaintenance = equipment.filter(
        (item) =>
            item.status === 'broken' ||
            item.status === 'maintenance' ||
            (item.last_maintained_at &&
                new Date().getTime() - new Date(item.last_maintained_at).getTime() >
                    180 * 24 * 60 * 60 * 1000)
    );

    const totalValue = equipment.reduce((sum, item) => sum + item.purchase_cost, 0);

    const uniqueTypes = Array.from(new Set(equipment.map((item) => item.equipment_type)));

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Wrench className="w-8 h-8" />
                        Equipment Management
                    </h1>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Total Equipment</p>
                        <p className="text-3xl font-bold text-blue-600">{equipment.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Total Value</p>
                        <p className="text-3xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Needs Maintenance</p>
                        <p className="text-3xl font-bold text-orange-600">
                            {equipmentNeedingMaintenance.length}
                        </p>
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

                {/* Maintenance Alert */}
                {equipmentNeedingMaintenance.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded mb-4 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Maintenance Alert</p>
                            <p className="text-sm">
                                {equipmentNeedingMaintenance.length} items need maintenance.
                            </p>
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
                            {showForm ? 'Cancel' : 'Add Equipment'}
                        </button>
                    )}

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="working">Working</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="broken">Broken</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        {uniqueTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Add/Edit Form */}
                {showForm && isManager && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? 'Edit Equipment' : 'Add New Equipment'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Equipment Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="equipment_name"
                                        value={formData.equipment_name}
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
                                        placeholder="e.g., Coffee Machine, Refrigerator"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Purchase Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="purchase_date"
                                        value={formData.purchase_date}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Purchase Cost
                                    </label>
                                    <input
                                        type="number"
                                        name="purchase_cost"
                                        value={formData.purchase_cost}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Warranty Expiry
                                    </label>
                                    <input
                                        type="date"
                                        name="warranty_expiry"
                                        value={formData.warranty_expiry}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Kitchen, Storage"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="working">Working</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="broken">Broken</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                >
                                    {editingId ? 'Update' : 'Create'} Equipment
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

                {/* Equipment List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Loading equipment...</div>
                    ) : equipment.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">
                            No equipment found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Equipment Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Cost
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Warranty
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Last Maintenance
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {equipment.map((item) => {
                                        const needsMaintenance =
                                            item.status === 'broken' ||
                                            item.status === 'maintenance' ||
                                            (item.last_maintained_at &&
                                                new Date().getTime() -
                                                    new Date(item.last_maintained_at).getTime() >
                                                    180 * 24 * 60 * 60 * 1000);

                                        const warrantyExpired =
                                            item.warranty_expiry &&
                                            new Date(item.warranty_expiry) < new Date();

                                        return (
                                            <tr
                                                key={item.id}
                                                className={`hover:bg-gray-50 ${
                                                    needsMaintenance ? 'bg-orange-50' : ''
                                                }`}
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {item.equipment_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {item.equipment_type}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status.charAt(0).toUpperCase() +
                                                            item.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center font-semibold">
                                                    ${item.purchase_cost.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center">
                                                    {item.warranty_expiry ? (
                                                        <span
                                                            className={
                                                                warrantyExpired
                                                                    ? 'text-red-600 font-semibold'
                                                                    : 'text-gray-600'
                                                            }
                                                        >
                                                            {new Date(
                                                                item.warranty_expiry
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-center">
                                                    {item.last_maintained_at ? (
                                                        <div className="text-gray-600">
                                                            {new Date(
                                                                item.last_maintained_at
                                                            ).toLocaleDateString()}
                                                            <div className="text-xs text-gray-500">
                                                                by{' '}
                                                                {getUserName(
                                                                    item.last_maintained_by
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Never</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        {isManager && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        openMaintenanceModal(item)
                                                                    }
                                                                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded text-xs"
                                                                    title="Record Maintenance"
                                                                >
                                                                    Maintain
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

                {/* Maintenance Modal */}
                {showMaintenanceModal && selectedEquipment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                            <h3 className="text-xl font-bold mb-4">
                                Record Maintenance - {selectedEquipment.equipment_name}
                            </h3>

                            <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maintenance Type *
                                    </label>
                                    <input
                                        type="text"
                                        name="maintenance_type"
                                        value={maintenanceData.maintenance_type}
                                        onChange={handleMaintenanceChange}
                                        placeholder="e.g., Regular Service, Repair"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={maintenanceData.description}
                                        onChange={handleMaintenanceChange}
                                        placeholder="Details about the maintenance performed"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cost
                                    </label>
                                    <input
                                        type="number"
                                        name="cost"
                                        value={maintenanceData.cost}
                                        onChange={handleMaintenanceChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Record Maintenance
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowMaintenanceModal(false)}
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
