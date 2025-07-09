import React from 'react'
import { TrendingUp, Users, Mail, Zap, Calendar, Download } from 'lucide-react'

const Analytics = () => {
  const metrics = [
    {
      name: 'Total Leads',
      value: '1,247',
      change: '+12.3%',
      changeType: 'positive',
      period: 'vs last month'
    },
    {
      name: 'Conversion Rate',
      value: '24.8%',
      change: '+4.1%',
      changeType: 'positive',
      period: 'vs last month'
    },
    {
      name: 'Email Open Rate',
      value: '89.2%',
      change: '-1.2%',
      changeType: 'negative',
      period: 'vs last month'
    },
    {
      name: 'Click-through Rate',
      value: '12.7%',
      change: '+2.8%',
      changeType: 'positive',
      period: 'vs last month'
    }
  ]

  const funnelPerformance = [
    {
      name: 'Summer Solar Promo',
      leads: 456,
      conversion: '28.4%',
      revenue: '$45,600',
      status: 'live'
    },
    {
      name: 'Residential Quote Form',
      leads: 289,
      conversion: '31.2%',
      revenue: '$28,900',
      status: 'live'
    },
    {
      name: 'Commercial Solar Landing',
      leads: 167,
      conversion: '22.1%',
      revenue: '$16,700',
      status: 'live'
    },
    {
      name: 'Energy Savings Webinar',
      leads: 335,
      conversion: '18.9%',
      revenue: '$33,500',
      status: 'completed'
    }
  ]

  const emailPerformance = [
    {
      template: 'Welcome Email',
      sent: 1247,
      opened: 1112,
      clicked: 334,
      openRate: '89.2%',
      clickRate: '26.8%'
    },
    {
      template: 'Follow Up - Day 3',
      sent: 892,
      opened: 681,
      clicked: 156,
      openRate: '76.3%',
      clickRate: '17.5%'
    },
    {
      template: 'Quotation Expiry',
      sent: 445,
      opened: 365,
      clicked: 89,
      openRate: '82.0%',
      clickRate: '20.0%'
    },
    {
      template: 'Thank You',
      sent: 234,
      opened: 221,
      clicked: 67,
      openRate: '94.4%',
      clickRate: '28.6%'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Track your funnel performance and email metrics.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select className="input-field max-w-xs">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="btn-primary inline-flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`w-4 h-4 ${
                    metric.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`text-sm font-medium ml-1 ${
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">{metric.period}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Generation Trend</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600">Chart visualization would go here</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-600">Funnel visualization would go here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funnel Performance */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Funnel Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Funnel Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Leads</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Conversion Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {funnelPerformance.map((funnel, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">{funnel.name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{funnel.leads}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{funnel.conversion}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-green-600">{funnel.revenue}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      funnel.status === 'live' 
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {funnel.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Performance */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Email Template Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Template</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Sent</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Opened</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Clicked</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Open Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Click Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {emailPerformance.map((email, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">{email.template}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{email.sent}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{email.opened}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{email.clicked}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-blue-600">{email.openRate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-purple-600">{email.clickRate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


export default Analytics