import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react'

const FunnelRequests = () => {
  const requests = [
    {
      id: 1,
      title: 'Summer Solar Promotion',
      goal: 'Generate leads for residential solar installations during summer season',
      status: 'live',
      priority: 'high',
      ctaType: 'form',
      deadline: '2024-02-15',
      created: '2024-01-10',
      targetAudience: 'Homeowners aged 35-65 with household income $75k+'
    },
    {
      id: 2,
      title: 'Commercial Solar Landing',
      goal: 'Capture commercial solar inquiries for businesses',
      status: 'in_progress',
      priority: 'medium',
      ctaType: 'whatsapp',
      deadline: '2024-02-20',
      created: '2024-01-12',
      targetAudience: 'Business owners and facility managers'
    },
    {
      id: 3,
      title: 'Residential Quote Calculator',
      goal: 'Interactive calculator for solar panel cost estimation',
      status: 'pending',
      priority: 'high',
      ctaType: 'form',
      deadline: '2024-02-25',
      created: '2024-01-15',
      targetAudience: 'Homeowners researching solar options'
    },
    {
      id: 4,
      title: 'Energy Savings Webinar',
      goal: 'Promote upcoming webinar about energy savings',
      status: 'completed',
      priority: 'low',
      ctaType: 'email',
      deadline: '2024-01-30',
      created: '2024-01-05',
      targetAudience: 'Environmentally conscious consumers'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-gray-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCTAIcon = (ctaType: string) => {
    switch (ctaType) {
      case 'form':
        return '📝'
      case 'whatsapp':
        return '💬'
      case 'call':
        return '📞'
      case 'email':
        return '✉️'
      default:
        return '📝'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funnel Requests</h1>
          <p className="mt-2 text-gray-600">Manage your funnel requests and track their progress.</p>
        </div>
        <Link
          to="/funnel-requests/create"
          className="mt-4 sm:mt-0 btn-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Request New Funnel
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-wrap gap-4">
          <select className="input-field max-w-xs">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Live</option>
            <option>Completed</option>
          </select>
          <select className="input-field max-w-xs">
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="input-field max-w-xs">
            <option>All CTA Types</option>
            <option>Form</option>
            <option>WhatsApp</option>
            <option>Call</option>
            <option>Email</option>
          </select>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((request) => (
          <div key={request.id} className="glass-effect rounded-2xl p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(request.status)}
                  <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">{request.goal}</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                  {request.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Priority</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                  {request.priority}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">CTA Type</span>
                <span className="text-sm font-medium text-gray-900">
                  {getCTAIcon(request.ctaType)} {request.ctaType}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Deadline</span>
                <div className="flex items-center space-x-1 text-sm text-gray-900">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(request.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20">
                <p className="text-xs text-gray-500 mb-1">Target Audience</p>
                <p className="text-sm text-gray-700">{request.targetAudience}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  Created {new Date(request.created).toLocaleDateString()}
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FunnelRequests