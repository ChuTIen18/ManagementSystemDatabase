import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, MessageSquare, Star, Trash2, ShieldCheck } from 'lucide-react';
import { feedbackAPI } from '../services/api';

interface CustomerFeedbackItem {
    id: number;
    order_id: number;
    overall_rating: number;
    service_rating?: number;
    quality_rating?: number;
    ambiance_rating?: number;
    comment?: string;
    created_at: string;
}

export default function CustomerFeedback() {
    const [feedbacks, setFeedbacks] = useState<CustomerFeedbackItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [formData, setFormData] = useState({
        order_id: '',
        overall_rating: '5',
        service_rating: '5',
        quality_rating: '5',
        ambiance_rating: '5',
        comment: '',
    });

    const { user } = useAuth();
    const isManager = user?.role === 'manager';

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await feedbackAPI.getCustomerAll();
            setFeedbacks(response.data || []);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to load customer feedback');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.order_id || !formData.overall_rating) {
            setError('Order ID and overall rating are required');
            return;
        }

        try {
            await feedbackAPI.createCustomer({
                order_id: Number(formData.order_id),
                overall_rating: Number(formData.overall_rating),
                service_rating: formData.service_rating ? Number(formData.service_rating) : null,
                quality_rating: formData.quality_rating ? Number(formData.quality_rating) : null,
                ambiance_rating: formData.ambiance_rating ? Number(formData.ambiance_rating) : null,
                comment: formData.comment || null,
            });
            setSuccessMessage('Feedback submitted successfully');
            setFormData({
                order_id: '',
                overall_rating: '5',
                service_rating: '5',
                quality_rating: '5',
                ambiance_rating: '5',
                comment: '',
            });
            await fetchFeedbacks();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to submit feedback');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this feedback?')) return;
        try {
            await feedbackAPI.deleteCustomer(id);
            setSuccessMessage('Feedback deleted successfully');
            await fetchFeedbacks();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to delete feedback');
        }
    };

    const renderStars = (rating: number) =>
        Array.from({ length: 5 }).map((_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
            />
        ));

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <MessageSquare className="w-8 h-8" />
                            Customer Feedback
                        </h1>
                        <p className="text-gray-600 mt-1">Collect and review customer experience ratings.</p>
                    </div>
                    <button
                        onClick={() => setShowForm((prev) => !prev)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {showForm ? 'Hide Form' : 'New Feedback'}
                    </button>
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

                {showForm && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">Submit Feedback</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order ID *</label>
                                    <input
                                        type="number"
                                        name="order_id"
                                        value={formData.order_id}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating *</label>
                                    <input
                                        type="number"
                                        name="overall_rating"
                                        value={formData.overall_rating}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        min="1"
                                        max="5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Rating</label>
                                    <input
                                        type="number"
                                        name="service_rating"
                                        value={formData.service_rating}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        min="1"
                                        max="5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quality Rating</label>
                                    <input
                                        type="number"
                                        name="quality_rating"
                                        value={formData.quality_rating}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        min="1"
                                        max="5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ambiance Rating</label>
                                    <input
                                        type="number"
                                        name="ambiance_rating"
                                        value={formData.ambiance_rating}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        min="1"
                                        max="5"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                    <textarea
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                                Submit Feedback
                            </button>
                        </form>
                    </div>
                )}

                {isManager && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" /> Customer Satisfaction Snapshot
                        </h2>
                        <p className="text-gray-600 text-sm">Use the reports page for deeper analytics, or review the summary after submitting.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">Loading feedback...</div>
                    ) : feedbacks.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">No feedback found</div>
                    ) : (
                        feedbacks.map((feedback) => (
                            <div key={feedback.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <h3 className="font-bold text-gray-900">Order #{feedback.order_id}</h3>
                                        <p className="text-sm text-gray-500">Submitted at {new Date(feedback.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-1">{renderStars(feedback.overall_rating)}</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-700">
                                    <div>Service: {feedback.service_rating ?? 'N/A'}</div>
                                    <div>Quality: {feedback.quality_rating ?? 'N/A'}</div>
                                    <div>Ambiance: {feedback.ambiance_rating ?? 'N/A'}</div>
                                </div>
                                {feedback.comment && <p className="mt-4 text-gray-700">{feedback.comment}</p>}
                                {isManager && (
                                    <button
                                        onClick={() => handleDelete(feedback.id)}
                                        className="mt-4 inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded text-sm"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
