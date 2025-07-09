import React from 'react'
import { Plus, Edit, Copy, Trash2, Sparkles } from 'lucide-react'

const EmailTemplates = () => {
  const templates = [
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to Solar Solutions - Your Journey to Clean Energy Starts Here!',
      templateType: 'welcome',
      isActive: true,
      lastModified: '2024-01-15',
      usage: 156,
      openRate: '89.2%'
    },
    {
      id: 2,
      name: 'Follow Up - Day 3',
      subject: 'Quick question about your solar project',
      templateType: 'follow_up',
      isActive: true,
      lastModified: '2024-01-12',
      usage: 89,
      openRate: '76.4%'
    },
    {
      id: 3,
      name: 'Quotation Expiry Reminder',
      subject: 'Your solar quotation expires in 3 days - Don\'t miss out!',
      templateType: 'quotation_expiry',
      isActive: true,
      lastModified: '2024-01-10',
      usage: 45,
      openRate: '82.1%'
    },
    {
      id: 4,
      name: 'Thank You - Installation Complete',
      subject: 'Congratulations! Your solar system is now live',
      templateType: 'thank_you',
      isActive: true,
      lastModified: '2024-01-08',
      usage: 23,
      openRate: '94.7%'
    },
    {
      id: 5,
      name: 'Reactivation Campaign',
      subject: 'Still interested in solar? Here\'s an exclusive offer',
      templateType: 'reactivation',
      isActive: false,
      lastModified: '2024-01-05',
      usage: 12,
      openRate: '68.3%'
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'follow_up':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'quotation_expiry':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'thank_you':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'reactivation':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'welcome':
        return 'Welcome Email'
      case 'follow_up':
        return 'Follow Up'
      case 'quotation_expiry':
        return 'Quotation Expiry'
      case 'thank_you':
        return 'Thank You'
      case 'reactivation':
        return 'Reactivation'
      default:
        return type
    }
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
          <button className="btn-primary inline-flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            New Template
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Copy className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Templates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Edit className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">82.1%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">325</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Copy className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="glass-effect rounded-2xl p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  {template.isActive ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(template.templateType)}`}>
                  {getTypeDisplayName(template.templateType)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Usage</span>
                <span className="text-sm font-medium text-gray-900">{template.usage} sends</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Open Rate</span>
                <span className="text-sm font-medium text-gray-900">{template.openRate}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Last Modified</span>
                <span className="text-sm text-gray-600">
                  {new Date(template.lastModified).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/20">
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
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
    </div>
  )
}

export default EmailTemplates