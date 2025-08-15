import React, { useState } from 'react';
import { X, FileText, Layout, ArrowRight } from 'lucide-react';
import LayoutSelector from './LayoutSelector';
import ReactDOM from 'react-dom';

interface NewTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateTemplate: (type: 'scratch' | 'layout', layoutId?: string) => void;
}

const NewTemplateModal: React.FC<NewTemplateModalProps> = ({
    isOpen,
    onClose,
    onCreateTemplate,
}) => {
    const [step, setStep] = useState<'choice' | 'layout'>('choice');

    if (!isOpen) return null;

    const handleStartFromScratch = () => {
        onCreateTemplate('scratch');
        onClose();
        setStep('choice');
    };

    const handleLayoutSelected = (layoutId: string) => {
        onCreateTemplate('layout', layoutId);
        onClose();
        setStep('choice');
    };

    const handleBack = () => {
        setStep('choice');
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {step === 'choice' ? 'Create New Template' : 'Choose Layout'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        {step === 'choice' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div
                                    className="group p-8 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                                    onClick={handleStartFromScratch}
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
                                            <FileText className="w-8 h-8 text-blue-600 group-hover:text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Start from Scratch</h3>
                                        <p className="text-gray-600 mb-4">Begin with a blank canvas and create your own custom email template from the ground up.</p>
                                        <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                                            <span className="mr-2">Get Started</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="group p-8 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                                    onClick={() => setStep('layout')}
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
                                            <Layout className="w-8 h-8 text-green-600 group-hover:text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Start from Pre-made Layout</h3>
                                        <p className="text-gray-600 mb-4">Choose from professionally designed templates and customize them to match your brand.</p>
                                        <div className="flex items-center justify-center text-green-600 group-hover:text-green-700">
                                            <span className="mr-2">Browse Templates</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <LayoutSelector onSelectLayout={handleLayoutSelected} onBack={handleBack} />
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body // <- modal is at the root, above everything
    );
};

export default NewTemplateModal;