import React from 'react'
import { Search, Filter, Download, Eye, Mail, Phone } from 'lucide-react'

const Leads = () => {
  const leads = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      source: 'Summer Solar Promo',
      status: 'new',
      leadData: {
        interest: 'Residential Solar',
        propertySize: '2,500 sq ft',
        monthlyBill: '$180'
      },
      createdAt: '2024-01-15T10:30:00Z',
      lastContacted: null
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@business.com',
      phone: '+1 (555) 987-6543',
      source: 'Commercial Solar Landing',
      status: 'contacted',
      leadData: {
        interest: 'Commercial Solar',
        businessType: 'Manufacturing',
        monthlyBill: '$2,500'
      },
      createdAt: '2024-01-14T14:20:00Z',
      lastContacted: '2024-01-15T09:00:00Z'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@gmail.com',
      phone: '+1 (555) 456-7890',
      source: 'Residential Quote Form',
      status: 'qualified',
      leadData: {
        interest: 'Residential Solar',
        propertySize: '3,200 sq ft',
        monthlyBill: '$220'
      },
      createdAt: '2024-01-13T16:45:00Z',
      lastContacted: '2024-01-14T11:30:00Z'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      phone: '+1 (555) 321-0987',
      source: 'Summer Solar Promo',
      status: 'converted',
      leadData: {
        interest: 'Residential Solar',
        propertySize: '2,800 sq ft',
        monthlyBill: '$195'
      },
      createdAt: '2024-01-12T11:15:00Z',
      lastContacted: '2024-01-13T15:20:00Z'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'qualified':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'converted':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'lost':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="mt-2 text-gray-600">Manage and track your leads from all funnels.</p>
        </div>
        <button className="mt-4 sm:mt-0 btn-primary inline-flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Export Leads
        </button>
      </div>

      {/* Filters and Search */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, email, or phone..."
              className="pl-10 input-field"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <select className="input-field max-w-xs">
              <option>All Sources</option>
              <option>Summer Solar Promo</option>
              <option>Commercial Solar Landing</option>
              <option>Residential Quote Form</option>
            </select>
            <select className="input-field max-w-xs">
              <option>All Statuses</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Converted</option>
              <option>Lost</option>
            </select>
            <button className="btn-secondary inline-flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-effect rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.leadData.interest}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.source}</div>
                    <div className="text-sm text-gray-500">
                      Monthly Bill: {lead.leadData.monthlyBill}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(lead.createdAt)}
                    </div>
                    {lead.lastContacted && (
                      <div className="text-sm text-gray-500">
                        Last: {formatDate(lead.lastContacted)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                        <Mail className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/20 transition-colors">
                        <Phone className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing 1 to 4 of 247 leads
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-secondary px-4 py-2">Previous</button>
          <button className="btn-primary px-4 py-2">1</button>
          <button className="btn-secondary px-4 py-2">2</button>
          <button className="btn-secondary px-4 py-2">3</button>
          <button className="btn-secondary px-4 py-2">Next</button>
        </div>
      </div>
    </div>
  )
}

export default Leads