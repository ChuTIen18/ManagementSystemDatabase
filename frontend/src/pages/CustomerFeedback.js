import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, MessageSquare, Star, Trash2, ShieldCheck } from 'lucide-react';
import { feedbackAPI } from '../services/api';
export default function CustomerFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
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
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to load customer feedback');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchFeedbacks();
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
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
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to submit feedback');
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this feedback?'))
            return;
        try {
            await feedbackAPI.deleteCustomer(id);
            setSuccessMessage('Feedback deleted successfully');
            await fetchFeedbacks();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to delete feedback');
        }
    };
    const renderStars = (rating) => Array.from({ length: 5 }).map((_, index) => (_jsx(Star, { className: `w-4 h-4 ${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}` }, index)));
    return (_jsx("div", { className: "min-h-screen bg-gray-100 p-4 md:p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "mb-8 flex items-center justify-between flex-wrap gap-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(MessageSquare, { className: "w-8 h-8" }), "Customer Feedback"] }), _jsx("p", { className: "text-gray-600 mt-1", children: "Collect and review customer experience ratings." })] }), _jsx("button", { onClick: () => setShowForm((prev) => !prev), className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700", children: showForm ? 'Hide Form' : 'New Feedback' })] }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("div", { children: error })] })), successMessage && (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4", children: successMessage })), showForm && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Submit Feedback" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Order ID *" }), _jsx("input", { type: "number", name: "order_id", value: formData.order_id, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", min: "1", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Overall Rating *" }), _jsx("input", { type: "number", name: "overall_rating", value: formData.overall_rating, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", min: "1", max: "5", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Service Rating" }), _jsx("input", { type: "number", name: "service_rating", value: formData.service_rating, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", min: "1", max: "5" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Quality Rating" }), _jsx("input", { type: "number", name: "quality_rating", value: formData.quality_rating, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", min: "1", max: "5" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ambiance Rating" }), _jsx("input", { type: "number", name: "ambiance_rating", value: formData.ambiance_rating, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", min: "1", max: "5" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Comment" }), _jsx("textarea", { name: "comment", value: formData.comment, onChange: handleInputChange, rows: 4, className: "w-full border rounded px-3 py-2" })] })] }), _jsx("button", { type: "submit", className: "bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700", children: "Submit Feedback" })] })] })), isManager && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "w-5 h-5" }), " Customer Satisfaction Snapshot"] }), _jsx("p", { className: "text-gray-600 text-sm", children: "Use the reports page for deeper analytics, or review the summary after submitting." })] })), _jsx("div", { className: "grid grid-cols-1 gap-4", children: loading ? (_jsx("div", { className: "bg-white rounded-lg shadow p-8 text-center text-gray-600", children: "Loading feedback..." })) : feedbacks.length === 0 ? (_jsx("div", { className: "bg-white rounded-lg shadow p-8 text-center text-gray-600", children: "No feedback found" })) : (feedbacks.map((feedback) => (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-gray-900", children: ["Order #", feedback.order_id] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Submitted at ", new Date(feedback.created_at).toLocaleString()] })] }), _jsx("div", { className: "flex items-center gap-1", children: renderStars(feedback.overall_rating) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-700", children: [_jsxs("div", { children: ["Service: ", feedback.service_rating ?? 'N/A'] }), _jsxs("div", { children: ["Quality: ", feedback.quality_rating ?? 'N/A'] }), _jsxs("div", { children: ["Ambiance: ", feedback.ambiance_rating ?? 'N/A'] })] }), feedback.comment && _jsx("p", { className: "mt-4 text-gray-700", children: feedback.comment }), isManager && (_jsxs("button", { onClick: () => handleDelete(feedback.id), className: "mt-4 inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded text-sm", children: [_jsx(Trash2, { className: "w-4 h-4" }), " Delete"] }))] }, feedback.id)))) })] }) }));
}
