import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, MessageCircle, Phone, Mail, Trash2, CheckCircle } from 'lucide-react';
import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

interface MediaFile {
    id: number;
    file_path: string;
    file_name: string;
}

interface Funnel {
    id?: number;
    title: string;
    goal: string;
    target_audience: string;
    cta: string;
    notes?: string;
    deadline: string;
    media?: MediaFile[];
}

interface CreateFunnelRequestProps {
    editData?: Funnel;
    onCancel?: () => void;
}

function getThreeBusinessDaysFromNow(): string {
    const date = new Date();
    let added = 0;

    while (added < 3) {
        date.setDate(date.getDate() + 1);
        const day = date.getDay();
        if (day !== 0 && day !== 6) {
            added++;
        }
    }

    return date.toISOString().split('T')[0];
}

const CreateFunnelRequest: React.FC<CreateFunnelRequestProps> = ({ editData, onCancel }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: editData?.title || '',
        goal: editData?.goal || '',
        target_audience: editData?.target_audience || '',
        newMedia: [] as File[],
        existingMedia: editData?.media || [] as MediaFile[],
        mediaToDelete: [] as number[],
        cta: editData?.cta || 'form',
        notes: editData?.notes || '',
        deadline: editData?.deadline ? editData.deadline.split('T')[0] : ''
    });

    const [success, setSuccess] = useState(false);
    const [serverMessage, setServerMessage] = useState('');
    const [minDeadline, setMinDeadline] = useState('');
    const [deadlineError, setDeadlineError] = useState('');

    useEffect(() => {
        setMinDeadline(getThreeBusinessDaysFromNow());
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'deadline') {
            const selected = new Date(value);
            const day = selected.getDay();

            if (value < minDeadline) {
                setDeadlineError('Deadline must be at least 3 business days from today.');
            } else if (day === 0 || day === 6) {
                setDeadlineError('Please choose a weekday (Monday to Friday).');
            } else {
                setDeadlineError('');
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).slice(0, 10);
            setFormData(prev => ({
                ...prev,
                newMedia: [...prev.newMedia, ...selectedFiles],
            }));
        }
    };

    const removeNewFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            newMedia: prev.newMedia.filter((_, i) => i !== index),
        }));
    };

    const removeExistingFile = (id: number) => {
        setFormData(prev => ({
            ...prev,
            existingMedia: prev.existingMedia.filter(file => file.id !== id),
            mediaToDelete: [...prev.mediaToDelete, id],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        // Append all standard fields
        Object.entries({
            title: formData.title,
            goal: formData.goal,
            target_audience: formData.target_audience,
            cta: formData.cta,
            notes: formData.notes || '',
            deadline: formData.deadline,
            _method: editData?.id ? 'PUT' : 'POST',
        }).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        // Append new media files
        formData.newMedia.forEach((file) => {
            formDataToSend.append('media[]', file);
        });

        // Append media to delete (for edits)
        formData.mediaToDelete.forEach((id) => {
            formDataToSend.append('deleted_media[]', id.toString());
        });

        try {
            const url = editData?.id ? `/funnels/${editData.id}` : '/funnels/submit';
            const method = editData?.id ? 'post' : 'post';

            const res = await axios.post(url, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setServerMessage(res.data.flash || (editData ? 'Funnel updated successfully!' : 'Funnel sent successfully!'));
            setSuccess(true);
        } catch (err: any) {
            console.error('Error:', err.response?.data || err);
            setServerMessage(err.response?.data?.message || 'Something went wrong.');
        }
    };

    const ctaOptions = [
        {
            value: 'form',
            label: 'Contact Form',
            description: 'Collect lead information',
            icon: FileText,
            color: 'blue'
        },
        {
            value: 'whatsapp',
            label: 'WhatsApp',
            description: 'Direct messaging',
            icon: MessageCircle,
            color: 'green'
        },
        {
            value: 'call',
            label: 'Phone Call',
            description: 'Direct phone contact',
            icon: Phone,
            color: 'purple'
        },
        {
            value: 'email',
            label: 'Email',
            description: 'Email contact',
            icon: Mail,
            color: 'red'
        }
    ];

    if (success) {
        return (
            <div className="p-8 sm:p-10 bg-green-50 border border-green-100 rounded-2xl shadow-sm animate-fade-in">
                {/* Header Icon + Title */}
                <div className="flex items-center gap-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <h2 className="text-2xl font-semibold text-green-800">
                        {editData ? 'Funnel Updated Successfully' : 'Funnel Submitted Successfully'}
                    </h2>
                </div>

                {/* Description */}
                <div className="mt-4 text-sm sm:text-base text-green-700 space-y-1">
                    <p>
                        {serverMessage ||
                            (editData
                                ? 'Your funnel changes have been saved and are now live.'
                                : 'We’ve received your request and our team has started working on it.')}
                    </p>

                    {!editData && (
                        <p className="text-green-600">
                            You’ll receive a preview within 3–5 business days. We’ll notify you via email when it’s ready.
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                        to="/funnel-requests"
                        className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H3m0 0l4-4m-4 4l4 4m7-4h6" />
                        </svg>
                        View All Funnel Requests
                    </Link>

                    {!editData && (
                        <button
                            onClick={() => {
                                setSuccess(false);
                                setFormData({
                                    title: '',
                                    goal: '',
                                    target_audience: '',
                                    newMedia: [],
                                    existingMedia: [],
                                    mediaToDelete: [],
                                    cta: 'form',
                                    notes: '',
                                    deadline: '',
                                });
                            }}
                            className="inline-flex items-center justify-center text-sm text-gray-700 underline hover:text-gray-900"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Submit Another
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onCancel || (() => navigate('/funnel-requests'))}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {editData ? 'Edit Funnel' : 'Request New Funnel'}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {editData ? 'Update your funnel details' : 'Tell us about your funnel requirements and we\'ll create a custom landing page for you.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="glass-effect rounded-2xl p-8 space-y-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-white/20 pb-2">
                        Basic Information
                    </h2>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Funnel Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Solar Panel Lead Generation, Summer Sale Campaign"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Goal *
                        </label>
                        <textarea
                            id="goal"
                            name="goal"
                            required
                            rows={4}
                            value={formData.goal}
                            onChange={handleInputChange}
                            placeholder="Describe what you want to achieve with this funnel. Be specific about your objectives."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 mb-2">
                            Target Audience
                        </label>
                        <textarea
                            id="target_audience"
                            name="target_audience"
                            required
                            rows={3}
                            value={formData.target_audience}
                            onChange={handleInputChange}
                            placeholder="Who is your ideal customer? Demographics, interests, pain points, etc."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-white/20 pb-2">
                        Call-to-Action
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            What action should visitors take? *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {ctaOptions.map((option) => {
                                const Icon = option.icon;
                                const isSelected = formData.cta === option.value;

                                return (
                                    <label
                                        key={option.value}
                                        className={`relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${isSelected
                                            ? `border-${option.color}-500 bg-${option.color}-50`
                                            : 'border-gray-200 hover:border-gray-300 bg-white/50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="cta"
                                            value={option.value}
                                            checked={isSelected}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <Icon className={`w-8 h-8 mb-3 ${isSelected ? `text-${option.color}-600` : 'text-gray-400'
                                            }`} />
                                        <span className="text-sm font-semibold text-gray-900 mb-1">
                                            {option.label}
                                        </span>
                                        <span className="text-xs text-gray-500 text-center">
                                            {option.description}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-white/20 pb-2">
                        Media Uploads (Optional)
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="media"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Upload Images or Files (Max 10)
                            </label>
                            <input
                                type="file"
                                id="media"
                                name="media"
                                accept="image/*,application/pdf"
                                multiple
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={handleFileChange}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Accepted formats: Images or PDFs. Max 10 files.
                            </p>
                        </div>

                        {formData.newMedia.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-700">New files to upload:</h3>
                                <ul className="space-y-2">
                                    {formData.newMedia.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeNewFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {editData && formData.existingMedia.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-700">Existing files:</h3>
                                <ul className="space-y-2">
                                    {formData.existingMedia.map((file) => (
                                        <li key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-sm truncate max-w-xs">{file.file_name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingFile(file.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-white/20 pb-2">
                        Additional Requirements
                    </h2>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                            Special Requirements or Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={4}
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Any specific features, integrations, or design preferences you'd like us to consider..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Deadline <span className="text-xs text-gray-500">(Min: 3 business days, weekdays only)</span>
                        </label>
                        <input
                            type="date"
                            id="deadline"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            min={minDeadline}
                            required
                            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {deadlineError && <p className="text-red-500 text-sm mt-1">{deadlineError}</p>}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/20">
                    <button
                        type="button"
                        onClick={onCancel || (() => navigate('/funnel-requests'))}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {editData ? 'Update Request' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateFunnelRequest;