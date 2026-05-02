import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Table2, Plus, Edit2, Trash2, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { tablesAPI } from '../services/api';

interface TableItem {
    id: number;
    table_number: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved';
    qr_code?: string;
    created_at: string;
    updated_at: string;
}

export default function TableManagement() {
    const [tables, setTables] = useState<TableItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
    const [formData, setFormData] = useState({
        tableNumber: '',
        capacity: '',
        status: 'available',
        qrCode: '',
    });

    const { user } = useAuth();
    const isManager = user?.role === 'manager';

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await tablesAPI.getAll(
                filterAvailableOnly ? { available_only: 'true' } : undefined
            );
            setTables(response.data || []);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to load tables');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, [filterAvailableOnly]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ tableNumber: '', capacity: '', status: 'available', qrCode: '' });
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.tableNumber || !formData.capacity) {
            setError('Table number and capacity are required');
            return;
        }

        try {
            const payload = {
                tableNumber: formData.tableNumber,
                capacity: Number(formData.capacity),
                status: formData.status,
                qrCode: formData.qrCode || null,
            };

            if (editingId) {
                await tablesAPI.update(editingId, payload);
                setSuccessMessage('Table updated successfully');
            } else {
                await tablesAPI.create(payload);
                setSuccessMessage('Table created successfully');
            }

            resetForm();
            setShowForm(false);
            await fetchTables();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to save table');
        }
    };

    const handleEdit = (table: TableItem) => {
        setFormData({
            tableNumber: table.table_number,
            capacity: table.capacity.toString(),
            status: table.status,
            qrCode: table.qr_code || '',
        });
        setEditingId(table.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this table?')) return;
        try {
            await tablesAPI.delete(id);
            setSuccessMessage('Table deleted successfully');
            await fetchTables();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to delete table');
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'occupied':
                return 'bg-red-100 text-red-800';
            case 'reserved':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const totalTables = tables.length;
    const availableTables = tables.filter((table) => table.status === 'available').length;
    const occupiedTables = tables.filter((table) => table.status === 'occupied').length;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <Table2 className="w-8 h-8" />
                            Table Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage seating layout and QR codes.</p>
                    </div>
                    {isManager && (
                        <button
                            onClick={() => setShowForm((prev) => !prev)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            {showForm ? 'Close Form' : 'Add Table'}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Total Tables</p>
                        <p className="text-3xl font-bold text-blue-600">{totalTables}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Available</p>
                        <p className="text-3xl font-bold text-green-600">{availableTables}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm">Occupied</p>
                        <p className="text-3xl font-bold text-red-600">{occupiedTables}</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>{error}</div>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>{successMessage}</div>
                    </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setFilterAvailableOnly((prev) => !prev)}
                        className={`px-4 py-2 rounded ${
                            filterAvailableOnly
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                        {filterAvailableOnly ? 'Showing Available Only' : 'Show Available Only'}
                    </button>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        Manager actions only
                    </span>
                </div>

                {showForm && isManager && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? 'Edit Table' : 'Add New Table'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Table Number *</label>
                                <input
                                    name="tableNumber"
                                    value={formData.tableNumber}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    min="1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="reserved">Reserved</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">QR Code</label>
                                <input
                                    name="qrCode"
                                    value={formData.qrCode}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div className="md:col-span-4 flex gap-2">
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

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Loading tables...</div>
                    ) : tables.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">No tables found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Table</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Capacity</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">QR Code</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {tables.map((table) => (
                                        <tr key={table.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{table.table_number}</td>
                                            <td className="px-6 py-4 text-center text-gray-700">{table.capacity}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(table.status)}`}>
                                                    {table.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{table.qr_code || 'N/A'}</td>
                                            <td className="px-6 py-4 text-center">
                                                {isManager && (
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => handleEdit(table)} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(table.id)} className="bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
