import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import axios from 'axios';

interface SystemEmailTemplate {
  id: number;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  category: string;
  preview_img: string;
  description: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  preview_img_url: string;
}

interface LayoutSelectorProps {
  onSelectLayout: (layoutId: string) => void;
  onBack: () => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ onSelectLayout, onBack }) => {
  const [templates, setTemplates] = useState<SystemEmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/sys-email-templates');
        setTemplates(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load templates');
        setLoading(false);
        console.error('Error fetching templates:', err);
      }
    };

    fetchTemplates();
  }, []);

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'welcome':
        return 'Welcome';
      case 'follow_up':
        return 'Follow Up';
      case 'quotation_expiry':
        return 'Quotation Expiry';
      case 'thank_you':
        return 'Thank You';
      case 'promo':
        return 'Promotional';
      case 'announcement':
        return 'Announcement';
      case 'newsletter':
        return 'Newsletter';
      case 'survey':
        return 'Survey';
      case 'reminder':
        return 'Reminder';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600">
        {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-2 text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No templates found</h3>
        <p className="text-gray-600 mb-4">There are no system templates available at the moment.</p>
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Choose a Template</h3>
          <p className="text-sm text-gray-600">Select a system template to customize</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group cursor-pointer"
            onClick={() => onSelectLayout(template.id.toString())}
          >
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-300">
              <div className="relative">
                {template.preview_img_url ? (
                  <img
                    src={template.preview_img_url}
                    alt={template.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                    {getCategoryDisplayName(template.category)}
                  </span>
                  {template.is_default && (
                    <span className="ml-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Default
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description || 'No description available'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;