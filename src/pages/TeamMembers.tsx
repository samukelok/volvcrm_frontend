import React, { useState, useEffect, useMemo } from 'react';
// Add axios import
import axios from 'axios';
import {
    UserPlus, Users, Mail, Shield, Trash2, CheckCircle, Clock, X, Send, Loader2
} from 'lucide-react';
import FlashMessage from '../components/FlashMessage';

// Configure axios to include CSRF token for Laravel
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

// Types
type TeamMember = {
    id: number;
    name: string;
    email: string;
    roles: Array<{ name: string }>;
    email_verified_at: string | null;
    pivot?: { joined_at: string };
};

type Role = {
    name: string;
    label?: string;
};

type FlashMessages = {
    success?: string;
    error?: string;
};

const TeamMembers = () => {
    // Initialize state with proper fallbacks
    const [currentUser, setCurrentUser] = useState({
        ...(window as any).__USER__,
        roles: Array.isArray((window as any).__USER__?.roles)
            ? (window as any).__USER__.roles
            : []
    });

    const [client, setClient] = useState((window as any).__CLIENT__ || null);
    const [flashMessages, setFlashMessages] = useState<FlashMessages>(
        (window as any).__FLASH__ || {}
    );
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteForm, setInviteForm] = useState({
        email: '',
        role: ''
    });
    const [error, setError] = useState<string | null>(null);
    
    // New state for flash messages and loading states
    const [flashMessage, setFlashMessage] = useState<string | null>(null);
    const [flashType, setFlashType] = useState<'success' | 'error' | 'info'>('success');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [roleUpdateLoading, setRoleUpdateLoading] = useState<number | null>(null);
    const [removeLoading, setRemoveLoading] = useState<number | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Fetch team data
    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('/team-members/data');

                // Validate response data
                if (!response.data) {
                    throw new Error('Invalid response from server');
                }

                const members = Array.isArray(response.data.teamMembers)
                    ? response.data.teamMembers.map(member => ({
                        ...member,
                        roles: member.roles ? member.roles.map(role => ({
                            name: role.name
                        })) : []
                    }))
                    : [];

                setTeamMembers(members);
                setAvailableRoles(Array.isArray(response.data.availableRoles)
                    ? response.data.availableRoles.map(role => ({
                        name: role.name
                    }))
                    : []);
                setClient(response.data.client || null);

                // Update current user data from the fetched team members
                const updatedCurrentUser = members.find(member =>
                    member.id === currentUser.id
                ) || currentUser;

                setCurrentUser(updatedCurrentUser);
            } catch (err) {
                console.error('Error fetching team data:', err);
                setError('Failed to load team data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, []);

    // Check if user has admin role (properly handles role objects)
    const hasAdminRole = useMemo(() => {
        return currentUser?.roles?.some(role =>
            ['client_admin', 'admin'].includes(role?.name)
        ) ?? false;
    }, [currentUser]);

    // Show flash message helper
    const showFlashMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setFlashMessage(message);
        setFlashType(type);
    };

    // Handle role change
    const handleRoleChange = async (memberId: number, newRole: string) => {
        try {
            setRoleUpdateLoading(memberId);
            setError(null);
            
            const response = await axios.put(`/team-members/${memberId}/update-role`, {
                role: newRole
            });

            setTeamMembers(prev => prev.map(member =>
                member.id === memberId
                    ? { ...member, roles: [{ name: newRole }] }
                    : member
            ));

            // Show flash message from API response
            if (response.data.flash) {
                showFlashMessage(response.data.flash, 'success');
            }
        } catch (err) {
            console.error('Error updating role:', err);
            showFlashMessage('Failed to update role. Please try again.', 'error');
        } finally {
            setRoleUpdateLoading(null);
        }
    };

    // Handle member removal
    const handleRemoveMember = async (memberId: number) => {
        if (!confirm('Are you sure you want to remove this team member?')) return;

        try {
            setRemoveLoading(memberId);
            setError(null);
            
            const response = await axios.delete(`/team-members/${memberId}/remove`);
            
            setTeamMembers(prev => prev.filter(member => member.id !== memberId));
            
            // Show flash message from API response
            if (response.data.flash) {
                showFlashMessage(response.data.flash, 'success');
            }
        } catch (err) {
            console.error('Error removing member:', err);
            showFlashMessage('Failed to remove team member. Please try again.', 'error');
        } finally {
            setRemoveLoading(null);
        }
    };

    // Handle invite submission
    const handleInviteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setInviteLoading(true);
            setError(null);
            
            const response = await axios.post('/team-members/invite', inviteForm);

            setShowInviteModal(false);
            setInviteForm({ email: '', role: '' });

            // Show flash message from API response
            if (response.data.flash) {
                showFlashMessage(response.data.flash, 'success');
            }

            // Refresh team members
            const teamResponse = await axios.get('/team-members/data');
            setTeamMembers(teamResponse.data.teamMembers || []);
        } catch (err) {
            console.error('Error sending invitation:', err);
            showFlashMessage('Failed to send invitation. Please try again.', 'error');
        } finally {
            setInviteLoading(false);
        }
    };

    // Helper functions for UI
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'client_admin': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'client_user': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(teamMembers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMembers = teamMembers.slice(startIndex, endIndex);

    // Reset to first page when team members change
    useEffect(() => {
        setCurrentPage(1);
    }, [teamMembers.length]);

    // Pagination handlers
    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
                <button
                    onClick={() => window.location.reload()}
                    className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            {/* Flash Message */}
            <FlashMessage
                message={flashMessage ?? undefined}
                type={flashType}
                onClose={() => setFlashMessage(null)}
            />

            {/* Flash messages from initial page load */}
            {flashMessages.success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    {flashMessages.success}
                </div>
            )}
            {flashMessages.error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {flashMessages.error}
                </div>
            )}

            {/* No team message */}
            {!client && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
                    You don't have a team yet. You're currently the only member.
                    Invite team members to collaborate.
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
                    <p className="mt-2 text-gray-600">Manage your team and invite new members to collaborate.</p>
                </div>

                {hasAdminRole && (
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Invite Team Member
                    </button>
                )}
            </div>

            {/* Team Members Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Current Team Members</h2>
                        <div className="text-sm text-gray-500">
                            {teamMembers.length > 0 && (
                                <>
                                    Showing {startIndex + 1}-{Math.min(endIndex, teamMembers.length)} of {teamMembers.length} members
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Member
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                {hasAdminRole && (
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                )}
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">
                                                    {(member.name || '').charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900 flex items-center">
                                                    {member.name || 'Unknown'}
                                                    {member.id === currentUser.id && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                            {member.email || 'No email'}
                                        </div>
                                    </td>
                                    {hasAdminRole && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {member.id === currentUser.id ? (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(member.roles?.[0]?.name || '')}`}>
                                                    {(member.roles?.[0]?.name || '').replace('_', ' ')}
                                                </span>
                                            ) : (
                                                <div className="flex items-center">
                                                    <select
                                                        value={member.roles?.[0]?.name || ''}
                                                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                                        disabled={roleUpdateLoading === member.id}
                                                        className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                                                    >
                                                        {(availableRoles || []).map((role) => (
                                                            <option key={role.name} value={role.name}>
                                                                {(role.name || '').replace('_', ' ')}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {roleUpdateLoading === member.id && (
                                                        <Loader2 className="w-4 h-4 ml-2 animate-spin text-blue-500" />
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {member.email_verified_at ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor('active')}`}>
                                                        Active
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor('pending')}`}>
                                                        Pending
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {hasAdminRole && member.id !== currentUser.id ? (
                                                <button
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    disabled={removeLoading === member.id}
                                                    className="p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center"
                                                >
                                                    {removeLoading === member.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    )}
                                                </button>
                                            ) : member.id !== currentUser.id ? (
                                                <button
                                                    onClick={() => showFlashMessage("You don't have permission for this action", 'error')}
                                                    className="p-2 rounded-lg hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-400" />
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        // Show first page, last page, current page, and pages around current
                                        const showPage = page === 1 || 
                                                        page === totalPages || 
                                                        Math.abs(page - currentPage) <= 1;
                                        
                                        if (!showPage) {
                                            // Show ellipsis for gaps
                                            if (page === 2 && currentPage > 4) {
                                                return <span key={page} className="px-2 text-gray-400">...</span>;
                                            }
                                            if (page === totalPages - 1 && currentPage < totalPages - 3) {
                                                return <span key={page} className="px-2 text-gray-400">...</span>;
                                            }
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>

                            <div className="text-sm text-gray-500">
                                Page {currentPage} of {totalPages}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowInviteModal(false)}></div>

                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 pt-6 pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                                        Invite Team Member
                                    </h3>
                                    <button
                                        onClick={() => setShowInviteModal(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleInviteSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                disabled={inviteLoading}
                                                value={inviteForm.email}
                                                onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                                placeholder="colleague@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                            Role
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select
                                                id="role"
                                                name="role"
                                                required
                                                disabled={inviteLoading}
                                                value={inviteForm.role}
                                                onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                            >
                                                <option value="">Select a role</option>
                                                {(availableRoles || []).map((role) => (
                                                    <option key={role.name} value={role.name}>
                                                        {(role.name || '').replace('_', ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setShowInviteModal(false)}
                                            disabled={inviteLoading}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={inviteLoading}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center"
                                        >
                                            {inviteLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Send Invitation
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMembers;