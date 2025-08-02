import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Settings, Filter, Search, Mail, Users, Shield, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import FlashMessage from '../components/FlashMessage';

interface Notification {
  id: number;
  type: 'team_invite' | 'role_change' | 'system' | 'security';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'team' | 'system'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [flashType, setFlashType] = useState<'success' | 'error' | 'info'>('success');

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: 'team_invite',
        title: 'New team member joined',
        message: 'Jane Smith has accepted the invitation and joined your team.',
        read: false,
        created_at: '2024-01-20T10:30:00Z'
      },
      {
        id: 2,
        type: 'role_change',
        title: 'Role updated',
        message: 'Your role has been updated to Admin by John Doe.',
        read: false,
        created_at: '2024-01-19T15:45:00Z'
      },
      {
        id: 3,
        type: 'system',
        title: 'System maintenance scheduled',
        message: 'Scheduled maintenance will occur on January 25th from 2:00 AM to 4:00 AM UTC.',
        read: true,
        created_at: '2024-01-18T09:00:00Z'
      },
      {
        id: 4,
        type: 'security',
        title: 'New login detected',
        message: 'A new login was detected from Chrome on Windows. If this wasn\'t you, please secure your account.',
        read: true,
        created_at: '2024-01-17T14:20:00Z'
      },
      {
        id: 5,
        type: 'team_invite',
        title: 'Invitation sent',
        message: 'You sent an invitation to bob@example.com to join your team.',
        read: true,
        created_at: '2024-01-16T11:15:00Z'
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const showFlashMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setFlashMessage(message);
    setFlashType(type);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    showFlashMessage('Notification marked as read', 'success');
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    showFlashMessage('All notifications marked as read', 'success');
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    showFlashMessage('Notification deleted', 'success');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'team_invite': return <Users className="w-5 h-5 text-blue-600" />;
      case 'role_change': return <Shield className="w-5 h-5 text-purple-600" />;
      case 'system': return <Settings className="w-5 h-5 text-gray-600" />;
      case 'security': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'team_invite': return 'bg-blue-50 border-blue-200';
      case 'role_change': return 'bg-purple-50 border-purple-200';
      case 'system': return 'bg-gray-50 border-gray-200';
      case 'security': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notif.read) ||
      (filter === 'team' && ['team_invite', 'role_change'].includes(notif.type)) ||
      (filter === 'system' && ['system', 'security'].includes(notif.type));
    
    const matchesSearch = searchTerm === '' || 
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <FlashMessage
        message={flashMessage ?? undefined}
        type={flashType}
        onClose={() => setFlashMessage(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="mt-2 text-gray-600">Stay updated with your team and system notifications</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="mt-4 sm:mt-0 btn-primary flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'team', label: 'Team' },
              { key: 'system', label: 'System' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`glass-effect rounded-2xl p-6 card-hover border-l-4 ${
                !notification.read ? 'border-l-blue-500' : 'border-l-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(notification.created_at)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load more button (for future pagination) */}
      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <button className="btn-secondary">
            Load More Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;