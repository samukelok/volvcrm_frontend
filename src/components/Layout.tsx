import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Zap,
    Users,
    Mail,
    BarChart3,
    Settings,
    Menu,
    X,
    Bell,
    Search,
    User,
    UserPlus,
    PlusIcon
} from 'lucide-react'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Funnel Requests', href: '/funnel-requests', icon: Zap },
        { name: 'Leads', href: '/leads', icon: Users },
        { name: 'Email Templates', href: '/email-templates', icon: Mail },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/settings', icon: Settings }
    ]

    const user = (window as any).__USER__;
    const client = (window as any).__CLIENT__;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative z-0">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex h-full flex-col glass-effect">
                    <div className="flex items-center justify-between p-6 border-b border-white/20">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold gradient-text">VolvCRM</h1>
                                <p className="text-xs text-gray-500">Funnel Management</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const isActive = item.href === '/dashboard'
                                ? location.pathname === item.href
                                : location.pathname.startsWith(item.href)

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/20">
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/10">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? 'Unknown User'}</p>
                                <p className="text-xs text-gray-500 truncate">{client?.brand_name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content wrapper */}
            <div className="lg:pl-64 relative z-0">
                {/* Sticky header with proper z-index */}
                <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* THIS WAS BROKEN — now fixed */}
                        <div className="flex items-center space-x-4 z-50 relative">
                            <Link
                                to="/notifications"
                                className="relative p-2 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                <Bell className="w-5 h-5 text-gray-600" />
                            </Link>

                            <Link
                                to="/team-members"
                                className="relative p-2 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                <UserPlus className="w-5 h-5 text-gray-600" />
                            </Link>

                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT with stacking fix */}
                <main className="p-6 relative z-10">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout