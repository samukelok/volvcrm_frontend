import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
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
} from 'lucide-react';
import FlashMessage from '../components/FlashMessage';

// Configure axios to include CSRF token for Laravel
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Flash message state
    const [flashMessage, setFlashMessage] = useState<string | null>(null);
    const [flashType, setFlashType] = useState<'success' | 'error' | 'info'>('success');

    // Data states
    const [stats, setStats] = useState([
        {
            name: 'Total Funnels',
            value: '0',
            change: '+0%',
            changeType: 'positive',
            icon: Zap,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            name: 'Active Leads',
            value: '0',
            change: '+0%',
            changeType: 'positive',
            icon: Users,
            color: 'from-green-500 to-emerald-500'
        },
        {
            name: 'Conversion Rate',
            value: '0%',
            change: '+0%',
            changeType: 'positive',
            icon: TrendingUp,
            color: 'from-purple-500 to-pink-500'
        },
        {
            name: 'Email Opens',
            value: '0%',
            change: '+0%',
            changeType: 'positive',
            icon: Mail,
            color: 'from-orange-500 to-red-500'
        }
    ]);

    const [recentFunnels, setRecentFunnels] = useState([]);
    const [recentLeads, setRecentLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Check for flash messages on component mount
    useEffect(() => {
        const flashData = (window as any).__FLASH__ || {};
        
        if (typeof flashData === 'string') {
            setFlashMessage(flashData);
            setFlashType('success');
        } else if (flashData.success) {
            setFlashMessage(flashData.success);
            setFlashType('success');
        } else if (flashData.error) {
            setFlashMessage(flashData.error);
            setFlashType('error');
        } else if (flashData.info) {
            setFlashMessage(flashData.info);
            setFlashType('info');
        }
        
        (window as any).__FLASH__ = {};
    }, []);

    // Fetch dashboard data
    useEffect(() => {
        axios.get('/client-dashboard')
            .then(response => {
                // Update stats with actual data
                if (response.data.stats) {
                    setStats(prevStats => {
                        return prevStats.map(stat => {
                            const apiStat = response.data.stats.find((s: any) => s.name === stat.name);
                            return apiStat ? {
                                ...stat,
                                value: apiStat.value,
                                change: apiStat.change,
                                changeType: apiStat.changeType
                            } : stat;
                        });
                    });
                }

                // Update recent funnels
                if (response.data.recentFunnels) {
                    setRecentFunnels(response.data.recentFunnels);
                }

                // Update recent leads
                if (response.data.recentLeads) {
                    setRecentLeads(response.data.recentLeads);
                }
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'live':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new':
                return 'bg-blue-100 text-blue-800';
            case 'contacted':
                return 'bg-yellow-100 text-yellow-800';
            case 'qualified':
                return 'bg-purple-100 text-purple-800';
            case 'converted':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-8">
            {/* Flash Message */}
            <FlashMessage
                message={flashMessage ?? undefined}
                type={flashType}
                onClose={() => setFlashMessage(null)}
            />

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
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="glass-effect rounded-2xl p-6 card-hover">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <div className="flex items-center mt-2">
                                        <ArrowUpRight className={`w-4 h-4 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
                                        <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
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
                    );
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
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <p>Loading funnels...</p>
                        </div>
                    ) : recentFunnels.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <Zap className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-gray-500">No funnels found</p>
                            <Link to="/funnel-requests/create" className="mt-2 text-blue-600 hover:text-blue-700">
                                Create your first funnel
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentFunnels.map((funnel: any) => (
                                <div key={funnel.id} className="group flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(funnel.status)}
                                            <h3 className="font-semibold text-gray-900">
                                                {funnel.name || 'Unnamed Funnel'}
                                            </h3>
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
                                            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50"
                                            title="Preview Funnel"
                                        >
                                            <ArrowUpRight className="w-4 h-4 text-gray-600" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Leads */}
                <div className="glass-effect rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
                        <Link to="/leads" className="text-blue-600 hover:text-blue-700 font-medium">
                            View all
                        </Link>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <p>Loading leads...</p>
                        </div>
                    ) : recentLeads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <Users className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-gray-500">No leads found</p>
                            <p className="text-sm text-gray-400 mt-1">Leads will appear here when you get them</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentLeads.map((lead: any) => (
                                <div key={lead.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-colors">
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;