import React, { useState, useEffect } from 'react';
import { Plus, Edit, Copy, Trash2, Sparkles, Search, Filter } from 'lucide-react';
import NewTemplateModal from './NewTemplateModal';
import TemplateEditor from './TemplateEditor';
import axios from 'axios';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  category: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
  created_by: string;
}

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

const EmailTemplates: React.FC = () => {
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/email-templates');
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'follow_up':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'quotation_expiry':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'thank_you':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'promo':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'welcome':
        return 'Welcome Email';
      case 'follow_up':
        return 'Follow Up';
      case 'quotation_expiry':
        return 'Quotation Expiry';
      case 'thank_you':
        return 'Thank You';
      case 'promo':
        return 'Promotional';
      default:
        return type;
    }
  };

  // Updated to handle both creation types and system template selection
  const handleCreateTemplate = (type: 'scratch' | 'layout' | 'system', layoutIdOrTemplate?: string | SystemEmailTemplate) => {
    if (type === 'scratch') {
      setCurrentTemplate({
        name: 'New Template',
        subject: '',
        body_html: '',
        body_text: '',
        category: 'custom',
        is_default: false
      });
      setShowEditor(true);
    } else if (type === 'layout' && typeof layoutIdOrTemplate === 'string') {
      const layoutContent = getLayoutContent(layoutIdOrTemplate);
      setCurrentTemplate({
        name: `New ${layoutIdOrTemplate.charAt(0).toUpperCase() + layoutIdOrTemplate.slice(1)} Template`,
        subject: getLayoutSubject(layoutIdOrTemplate),
        body_html: layoutContent,
        body_text: '',
        category: layoutIdOrTemplate,
        is_default: false
      });
      setShowEditor(true);
    } else if (type === 'system' && typeof layoutIdOrTemplate === 'object') {
      // Handle system template selection
      const systemTemplate = layoutIdOrTemplate as SystemEmailTemplate;
      setCurrentTemplate({
        name: `${systemTemplate.name} (Copy)`,
        subject: systemTemplate.subject,
        body_html: systemTemplate.body_html,
        body_text: systemTemplate.body_text,
        category: systemTemplate.category,
        is_default: false,
        originalSystemTemplateId: systemTemplate.id // Keep reference to original
      });
      setShowEditor(true);
      setShowNewTemplateModal(false); 
    }
  };

  // Handle system template selection
  const handleSelectSystemTemplate = (systemTemplate: SystemEmailTemplate) => {
    console.log('Selected system template:', systemTemplate);
    handleCreateTemplate('system', systemTemplate);
  };

  const getLayoutContent = (layoutId: string) => {
    const layouts: { [key: string]: string } = {
      welcome: `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0 0 10px 0;">Welcome to {{CompanyName}}!</h1>
          <p style="margin: 0; opacity: 0.9;">We're excited to have you on board</p>
        </div>
        <div style="padding: 30px 20px;">
          <p>Hi {{Name}},</p>
          <p>Welcome to our community! We're thrilled to have you join us on this journey.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{Download}}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">Get Started</a>
          </div>
          <p>Best regards,<br>The {{CompanyName}} Team</p>
        </div>
      </div>`,
      followup: `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2d3748;">Quick Follow-up</h2>
        <p>Hello {{Name}},</p>
        <p>I wanted to follow up on our conversation. Do you have any questions I can help answer?</p>
        <div style="margin: 25px 0;">
          <a href="{{Download}}" style="background: #48bb78; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Schedule a Call</a>
        </div>
        <p>Best regards,<br>{{CompanyName}}</p>
      </div>`,
      announcement: `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600" style="width: 100%; height: 200px; object-fit: cover;">
        <div style="padding: 30px 20px;">
          <h1 style="color: #1a202c; margin-bottom: 15px;">Big News Coming!</h1>
          <p>Hi {{Name}},</p>
          <p>We have some exciting updates to share with you!</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="{{Download}}" style="background: #ed8936; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">Learn More</a>
          </div>
          <p>Cheers,<br>{{CompanyName}} Team</p>
        </div>
      </div>`
    };
    return layouts[layoutId] || layouts.welcome;
  };

  const getLayoutSubject = (layoutId: string) => {
    const subjects: { [key: string]: string } = {
      welcome: 'Welcome to {{CompanyName}}!',
      followup: 'Quick follow-up on our conversation',
      announcement: 'Exciting news from {{CompanyName}}!'
    };
    return subjects[layoutId] || 'New Template';
  };

  const handleSaveTemplate = async (template: any) => {
    try {
      if (template.id) {
        // Update existing template
        const response = await axios.put(`/email-templates/${template.id}`, template);
        setTemplates(prev => prev.map(t =>
          t.id === template.id ? response.data : t
        ));
      } else {
        // Add new template
        const response = await axios.post('/email-templates', template);
        setTemplates(prev => [...prev, response.data]);
      }
      setShowEditor(false);
      setCurrentTemplate(null);
    } catch (err) {
      console.error('Error saving template:', err);
      alert('Failed to save template');
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setCurrentTemplate({
      ...template,
      type: template.category,
      content: template.body_html
    });
    setShowEditor(true);
  };

  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    try {
      const newTemplate: Omit<EmailTemplate, 'id'> & Partial<Pick<EmailTemplate, 'id'>> = {
        ...template,
        name: `${template.name} (Copy)`,
        is_default: false,
        id: undefined
      };
      delete newTemplate.id;

      const response = await axios.post('/email-templates', newTemplate);
      setTemplates(prev => [...prev, response.data]);
    } catch (err) {
      console.error('Error duplicating template:', err);
      alert('Failed to duplicate template');
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await axios.delete(`/email-templates/${templateId}`);
        setTemplates(prev => prev.filter(t => t.id !== templateId));
      } catch (err) {
        console.error('Error deleting template:', err);
        alert('Failed to delete template');
      }
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading templates...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (showEditor) {
    return (
      <TemplateEditor
        templateData={currentTemplate}
        onSave={handleSaveTemplate}
        onBack={() => {
          setShowEditor(false);
          setCurrentTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
          <p className="mt-2 text-gray-600">Create and manage your automated email templates.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary inline-flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            AI Assistant
          </button>
          <button
            onClick={() => setShowNewTemplateModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Template
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="btn-secondary inline-flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{templates.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Copy className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Default Templates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {templates.filter(t => t.is_default).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Edit className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {[...new Set(templates.map(t => t.category))].length}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {templates.length > 0 ?
                  new Date(
                    templates.reduce((latest, t) =>
                      new Date(t.updated_at) > new Date(latest) ? t.updated_at : latest,
                      templates[0].updated_at
                    )
                  ).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Copy className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="glass-effect rounded-2xl p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  {template.is_default ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Default
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(template.category)}`}>
                  {getTypeDisplayName(template.category)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Created By</span>
                <span className="text-sm font-medium text-gray-900">{template.created_by}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Created</span>
                <span className="text-sm text-gray-600">
                  {new Date(template.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Last Modified</span>
                <span className="text-sm text-gray-600">
                  {new Date(template.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/20">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Panel */}
      <div className="glass-effect rounded-2xl p-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Email Assistant</h3>
            <p className="text-sm text-gray-600">Let AI help you create and improve your email templates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-colors text-left">
            <h4 className="font-semibold text-gray-900 mb-1">Generate Template</h4>
            <p className="text-sm text-gray-600">Create a new email template with AI</p>
          </button>

          <button className="p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-colors text-left">
            <h4 className="font-semibold text-gray-900 mb-1">Improve Existing</h4>
            <p className="text-sm text-gray-600">Enhance your current templates</p>
          </button>

          <button className="p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-colors text-left">
            <h4 className="font-semibold text-gray-900 mb-1">A/B Test Ideas</h4>
            <p className="text-sm text-gray-600">Get suggestions for testing</p>
          </button>
        </div>
      </div>

      {/* Modals */}
      <NewTemplateModal
        isOpen={showNewTemplateModal}
        onClose={() => setShowNewTemplateModal(false)}
        onCreateTemplate={handleCreateTemplate}
        onSelectSystemTemplate={handleSelectSystemTemplate}
      />
    </div>
  );
};

export default EmailTemplates;