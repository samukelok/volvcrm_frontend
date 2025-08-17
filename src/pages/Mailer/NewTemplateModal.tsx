import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, FileText, Layout, Sparkles } from 'lucide-react';
import LayoutSelector from './LayoutSelector';

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

interface NewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTemplate: (type: 'scratch' | 'layout' | 'system', layoutIdOrTemplate?: string | SystemEmailTemplate) => void;
  onSelectSystemTemplate: (template: SystemEmailTemplate) => void;
}

const NewTemplateModal: React.FC<NewTemplateModalProps> = ({
  isOpen,
  onClose,
  onCreateTemplate,
  onSelectSystemTemplate,
}) => {
  const [step, setStep] = useState<'options' | 'layouts' | 'system-templates'>('options');

  if (!isOpen) return null;

  const handleSelectLayout = (layoutId: string) => {
    onCreateTemplate('layout', layoutId);
    onClose();
  };

  const handleSelectSystemTemplate = (template: SystemEmailTemplate) => {
    onSelectSystemTemplate(template);
  };

  const handleBackToOptions = () => {
    setStep('options');
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 'options' && 'Create New Template'}
            {step === 'layouts' && 'Choose Layout'}
            {step === 'system-templates' && 'System Templates'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
          {step === 'options' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => onCreateTemplate('scratch')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start from Scratch</h3>
                <p className="text-sm text-gray-600">Create a completely custom email template with our editor.</p>
              </button>

              <button
                onClick={() => setStep('layouts')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Layout className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Choose Layout</h3>
                <p className="text-sm text-gray-600">Start with a pre-designed layout and customize it to your needs.</p>
              </button>

              <button
                onClick={() => setStep('system-templates')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">System Templates</h3>
                <p className="text-sm text-gray-600">Use professional system templates as your starting point.</p>
              </button>
            </div>
          )}

          {step === 'layouts' && (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBackToOptions}
                  className="text-gray-600 hover:text-gray-800 mr-4"
                >
                  ← Back
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Choose a Layout</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['welcome', 'followup', 'announcement'].map((layoutId) => (
                  <button
                    key={layoutId}
                    onClick={() => handleSelectLayout(layoutId)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                  >
                    <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3 flex items-center justify-center">
                      <Layout className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {layoutId.charAt(0).toUpperCase() + layoutId.slice(1)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Professional {layoutId} email template
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'system-templates' && (
            <LayoutSelector
              onSelectLayout={handleSelectSystemTemplate}
              onBack={handleBackToOptions}
            />
          )}
        </div>
      </div>
    </div>
  );

  // Render modal into document.body
  return ReactDOM.createPortal(modalContent, document.body);
};

export default NewTemplateModal;
