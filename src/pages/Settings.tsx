import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Bell, Shield, Palette, Globe, Database, Loader2 } from 'lucide-react';
import FlashMessage from '../components/FlashMessage';

// Configure axios for Laravel
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

const Settings = () => {
    // Flash message state
    const [flashMessage, setFlashMessage] = useState<string | null>(
        (window as any).__FLASH__ || null
    );

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: (window as any).__USER__?.name || '',
        email: (window as any).__USER__?.email || '',
        company: (window as any).__CLIENT__?.brand_name || '',
        phone: (window as any).__USER__?.phone || '',
        bio: (window as any).__USER__?.bio || ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const [avatar, setAvatar] = useState<string | null>((window as any).__USER__?.avatar_url || null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);


    // Clear flash message after 4 seconds
    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => {
                setFlashMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/profile/update', profileForm);
            window.location.reload();
        } catch (err) {
            console.error('Error updating profile:', err);
            setFlashMessage('Failed to update profile. Please try again.');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/profile/password', passwordForm);
            window.location.reload();
        } catch (err) {
            console.error('Error updating password:', err);
            setFlashMessage('Failed to update password. Please try again.');
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file
            if (!file.type.match('image.*')) {
                setFlashMessage('Please select an image file (JPG, PNG, GIF)');
                return;
            }

            if (file.size > 1024 * 1024) { // 1MB
                setFlashMessage('Image must be smaller than 1MB');
                return;
            }

            setAvatarFile(file);

            // Preview image
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Upload immediately
            try {
                setIsUploading(true);
                const formData = new FormData();
                formData.append('avatar', file);

                const response = await axios.post('/profile/avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data' 
                    }
                });

                setFlashMessage('Profile picture updated successfully!');
                // Update global user object if needed
                if ((window as any).__USER__) {
                    (window as any).__USER__.avatar_url = response.data.avatar_url;
                }
            } catch (err) {
                console.error('Error uploading avatar:', err);
                setFlashMessage('Failed to update profile picture');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const getAvatarSrc = () => {
        if (avatar) {
            // If it's a data URL (preview), return as is
            if (avatar.startsWith('data:')) {
                return avatar;
            }
            // If it's a relative path, prepend /storage/
            if (!avatar.startsWith('http') && !avatar.startsWith('/storage/')) {
                return `/storage/${avatar}`;
            }
            return avatar;
        }
        // Fallback to default user image
        return '/img/user.png';
    };


    return (
        <div className="space-y-8">
            {/* Flash Message */}
            <FlashMessage />

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="mt-2 text-gray-600">Manage your account and application preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                    <div className="glass-effect rounded-2xl p-6">
                        <nav className="space-y-2">
                            <a href="#profile" className="sidebar-item active">
                                <User className="w-5 h-5" />
                                <span>Profile</span>
                            </a>
                            <a href="#notifications" className="sidebar-item">
                                <Bell className="w-5 h-5" />
                                <span>Notifications</span>
                            </a>
                            <a href="#security" className="sidebar-item">
                                <Shield className="w-5 h-5" />
                                <span>Security</span>
                            </a>
                            <a href="#branding" className="sidebar-item">
                                <Palette className="w-5 h-5" />
                                <span>Branding</span>
                            </a>
                            <a href="#domain" className="sidebar-item">
                                <Globe className="w-5 h-5" />
                                <span>Domain</span>
                            </a>
                            <a href="#integrations" className="sidebar-item">
                                <Database className="w-5 h-5" />
                                <span>Integrations</span>
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Settings */}
                    <div className="glass-effect rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                        <div className="space-y-6">

                            <div className="flex items-center space-x-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                                    {avatar ? (
                                        <img
                                            src={getAvatarSrc()}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback to default image if avatar fails to load
                                                (e.target as HTMLImageElement).src = '/img/user.png';
                                            }}
                                        />
                                    ) : (
                                        <User className="w-8 h-8 text-white" />
                                    )}
                                </div>

                                <div>
                                    <label className="btn-secondary cursor-pointer">
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            'Change Avatar'
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                    </label>
                                    <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                                </div>
                            </div>

                            <form onSubmit={handleProfileSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={profileForm.email}
                                            readOnly
                                            className="input-field bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                        <input
                                            type="text"
                                            value={profileForm.company}
                                            onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        rows={3}
                                        value={profileForm.bio}
                                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                        className="input-field resize-none"
                                    />
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button type="submit" className="btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="glass-effect rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">New Lead Notifications</h3>
                                    <p className="text-sm text-gray-500">Get notified when new leads are captured</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Email Campaign Updates</h3>
                                    <p className="text-sm text-gray-500">Updates on email campaign performance</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Weekly Reports</h3>
                                    <p className="text-sm text-gray-500">Receive weekly performance summaries</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="glass-effect rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
                        <div className="space-y-6">
                            <form onSubmit={handlePasswordSubmit}>
                                <h3 className="font-medium text-gray-900 mb-2">Change Password</h3>
                                <div className="space-y-4">
                                    <input
                                        type="password"
                                        name="current_password"
                                        placeholder="Current password"
                                        value={passwordForm.current_password}
                                        onChange={(e) => setPasswordForm({
                                            ...passwordForm,
                                            current_password: e.target.value
                                        })}
                                        className="input-field"
                                        required
                                    />
                                    <input
                                        type="password"
                                        name="new_password"
                                        placeholder="New password"
                                        value={passwordForm.new_password}
                                        onChange={(e) => setPasswordForm({
                                            ...passwordForm,
                                            new_password: e.target.value
                                        })}
                                        className="input-field"
                                        required
                                    />
                                    <input
                                        type="password"
                                        name="new_password_confirmation"
                                        placeholder="Confirm new password"
                                        value={passwordForm.new_password_confirmation}
                                        onChange={(e) => setPasswordForm({
                                            ...passwordForm,
                                            new_password_confirmation: e.target.value
                                        })}
                                        className="input-field"
                                        required
                                    />
                                    <button type="submit" className="btn-primary">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>


                    {/* Domain Settings */}
                    {/* Domain Settings */}
                    <div className="glass-effect rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Domain Configuration</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
                                <div className="flex items-center space-x-2">
                                    <input type="text" defaultValue="solarsolutions" className="input-field" />
                                    <span className="text-gray-500">.volvcrm.com</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Your funnels will be accessible at this subdomain</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Domain</label>
                                <input type="text" placeholder="yourdomain.com" className="input-field" />
                                <p className="text-sm text-gray-500 mt-1">Use your own domain for funnels (optional)</p>
                            </div>

                            <button className="btn-primary">Save Domain Settings</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Settings