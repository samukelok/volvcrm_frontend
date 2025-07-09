import { useAuth } from '../context/AuthContext'
import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
    TrendingUp,
    Users,
    Zap,
    Mail,
    ArrowUpRight,
    Plus,
    ExternalLink,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import FlashMessage from '../components/FlashMessage';

const Dashboard = () => {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    const stats = [
        {
            name: 'Total Funnels',
            value: '12',
            change: '+2.5%',
            changeType: 'positive',
            icon: Zap,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            name: 'Active Leads',
            value: '1,247',
            change: '+12.3%',
            changeType: 'positive',
            icon: Users,
            color: 'from-green-500 to-emerald-500'
        },
        {
            name: 'Conversion Rate',
            value: '24.8%',
            change: '+4.1%',
            changeType: 'positive',
            icon: TrendingUp,
            color: 'from-purple-500 to-pink-500'
        },
        {
            name: 'Email Opens',
            value: '89.2%',
            change: '-1.2%',
            changeType: 'negative',
            icon: Mail,
            color: 'from-orange-500 to-red-500'
        }
    ]

    const recentFunnels = [
        {
            id: 1,
            name: 'Summer Solar Promo',
            status: 'live',
            leads: 156,
            conversion: '28.4%',
            created: '2 days ago',
            url: 'https://summer.solarsolutions.com'
        },
        {
            id: 2,
            name: 'Residential Quote Form',
            status: 'live',
            leads: 89,
            conversion: '31.2%',
            created: '1 week ago',
            url: 'https://quote.solarsolutions.com'
        },
        {
            id: 3,
            name: 'Commercial Solar Landing',
            status: 'pending',
            leads: 0,
            conversion: '0%',
            created: '3 days ago',
            url: null
        }
    ]

    const recentLeads = [
        {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            source: 'Summer Solar Promo',
            status: 'new',
            time: '2 hours ago'
        },
        {
            id: 2,
            name: 'Mike Chen',
            email: 'mike@example.com',
            source: 'Residential Quote Form',
            status: 'contacted',
            time: '4 hours ago'
        },
        {
            id: 3,
            name: 'Emily Davis',
            email: 'emily@example.com',
            source: 'Summer Solar Promo',
            status: 'qualified',
            time: '6 hours ago'
        }
    ]

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'live':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800'
            case 'contacted':
                return 'bg-yellow-100 text-yellow-800'
            case 'qualified':
                return 'bg-purple-100 text-purple-800'
            case 'converted':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (

        <div className="space-y-8">
            {/* Success Message */}
            <FlashMessage />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your funnels.</p>
                </div>
                <Link
                    to="/funnel-requests/create"
                    className="mt-4 sm:mt-0 btn-primary inline-flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Request New Funnel
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.name} className="glass-effect rounded-2xl p-6 card-hover">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <div className="flex items-center mt-2">
                                        <ArrowUpRight className={`w-4 h-4 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                                            }`} />
                                        <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                                    </div>
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Funnels */}
                <div className="glass-effect rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Funnels</h2>
                        <Link to="/funnel-requests" className="text-blue-600 hover:text-blue-700 font-medium">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentFunnels.map((funnel) => (
                            <div key={funnel.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(funnel.status)}
                                        <h3 className="font-semibold text-gray-900">{funnel.name}</h3>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                        <span>{funnel.leads} leads</span>
                                        <span>{funnel.conversion} conversion</span>
                                        <span>{funnel.created}</span>
                                    </div>
                                </div>
                                {funnel.url && (
                                    <a
                                        href={funnel.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 text-gray-600" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Leads */}
                <div className="glass-effect rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
                        <Link to="/leads" className="text-blue-600 hover:text-blue-700 font-medium">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentLeads.map((lead) => (
                            <div key={lead.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                                    <p className="text-sm text-gray-600">{lead.email}</p>
                                    <p className="text-xs text-gray-500 mt-1">{lead.source}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">{lead.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard